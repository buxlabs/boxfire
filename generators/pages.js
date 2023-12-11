const { writeFile, mkdir } = require("fs/promises")
const { dirname, join, relative } = require("path")
const { glob } = require("glob")
const { compile } = require("boxwood")

async function findViews(input) {
  const paths = await glob(`${input}/views/**/*.js`)
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

module.exports = async function generatePages({ input, output, domain }) {
  const views = await findViews(input)
  const pages = []
  const paths = views.map((view) => {
    return getCurrentPath({ input, view })
  })
  for (const view of views) {
    const parts = dirname(view).split("/")
    const partial = parts[parts.length - 1].startsWith("_")
    if (partial) {
      continue
    }
    const { template } = await compile(view)
    const currentPath = getCurrentPath({ input, view })
    const canonical = getCanonical({
      domain,
      currentPath,
    })
    const html = template({ currentPath, canonical, paths })
    const out = view.replace(`${input}/views`, output).replace(".js", ".html")
    const dir = dirname(out)
    await mkdir(dir, { recursive: true })
    await writeFile(out, html, "utf8")
    pages.push({ path: out })
  }
  return pages
}
