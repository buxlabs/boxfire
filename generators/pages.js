const { writeFile, mkdir } = require("fs/promises")
const { dirname } = require("path")
const { glob } = require("glob")
const { compile } = require("boxwood")

module.exports = async function generatePages({ input, output }) {
  const files = await glob(`${input}/views/**/*.js`)
  const pages = []
  for (const file of files) {
    const parts = dirname(file).split("/")
    const partial = parts[parts.length - 1].startsWith("_")
    if (partial) {
      continue
    }
    const { template } = await compile(file)
    const html = template()
    const out = file.replace(`${input}/views`, output).replace(".js", ".html")
    const dir = out.replace("/index.html", "")
    await mkdir(dir, { recursive: true })
    await writeFile(out, html, "utf8")
    pages.push({ path: out })
  }
  return pages
}
