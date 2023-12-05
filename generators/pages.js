const { writeFile, mkdir } = require("fs/promises")
const { dirname } = require("path")
const { glob } = require("glob")
const { compile } = require("boxwood")

async function findViews(input) {
  const paths = await glob(`${input}/views/**/*.js`)
  return paths.filter((file) => !file.endsWith(".test.js"))
}

module.exports = async function generatePages({ input, output }) {
  const views = await findViews(input)
  const pages = []
  for (const view of views) {
    const parts = dirname(view).split("/")
    const partial = parts[parts.length - 1].startsWith("_")
    if (partial) {
      continue
    }
    const { template } = await compile(view)
    const html = template()
    const out = view.replace(`${input}/views`, output).replace(".js", ".html")
    const dir = out.replace("/index.html", "")
    await mkdir(dir, { recursive: true })
    await writeFile(out, html, "utf8")
    pages.push({ path: out })
  }
  return pages
}
