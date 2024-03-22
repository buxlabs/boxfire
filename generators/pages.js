const { writeFile, mkdir } = require("fs/promises")
const { dirname, join, relative, sep } = require("path")
const { glob } = require("glob")
const { compile } = require("boxwood")

async function findViews(input) {
  const paths = await glob(`${input}/views/**/*.js`, { absolute: true })
  return paths.filter((file) => !file.endsWith(".test.js"))
}

function prependHttps(domain) {
  return domain.startsWith("https://") ? domain : "https://" + domain
}

function getCurrentPath({ input, view }) {
  return `/${relative(join(input, "views"), dirname(view))}`
}

function getCanonical({ domain, currentPath }) {
  return prependHttps(domain) + currentPath
}

function isPartial(view) {
  const parts = dirname(view).split(sep)
  return parts[parts.length - 1].startsWith("_")
}

function isDynamicView(view) {
  const parts = view.split(sep)
  const filename = parts[parts.length - 1]
  return filename.startsWith("[") && filename.endsWith("].js")
}

async function generatePage({
  input,
  output,
  domain,
  view,
  path,
  paths,
  data = {},
}) {
  const { template } = await compile(view)
  const currentPath = getCurrentPath({ input, view: path })
  const canonical = getCanonical({
    domain,
    currentPath,
  })
  const html = template({ currentPath, canonical, paths, ...data })
  const out = path.replace(join(input, "views"), output).replace(".js", ".html")
  const dir = dirname(out)
  await mkdir(dir, { recursive: true })
  await writeFile(out, html, "utf8")
  return out
}

module.exports = async function generatePages({ input, output, domain }) {
  const views = await findViews(input)
  const pages = []
  const paths = views.map((view) => {
    return getCurrentPath({ input, view })
  })
  for (const view of views) {
    if (isPartial(view)) {
      continue
    }
    if (isDynamicView(view)) {
      const path = dirname(view)
      const parts = path.split(sep)
      const last = parts[parts.length - 1]
      const dir = join(input, "assets/content", last)
      const files = await glob(dir + "/**/*.js", { absolute: true })
      for (const file of files) {
        const fn = require(file)
        const data = await fn()
        const out = await generatePage({
          input,
          output,
          domain,
          view,
          path: file.replace("/assets/content/", "/views/"),
          paths,
          data: { ...data },
        })
        pages.push({ path: out })
      }
    } else {
      const out = await generatePage({
        input,
        output,
        domain,
        view,
        path: view,
        paths,
      })
      pages.push({ path: out })
    }
  }
  return pages
}
