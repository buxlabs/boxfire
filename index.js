const { writeFile, mkdir, unlink } = require("fs/promises")
const { join, dirname } = require("path")
const { glob } = require("glob")
const { compile } = require("boxwood")

const ROBOTS = `
User-agent: *
Allow: /

Sitemap: https://example.domain/sitemap.xml
`.trim()

async function generate({ input, output, domain, robots = true }) {
  const pages = await glob(`${output}/**/*.html`)
  for (const page of pages) {
    await unlink(page)
  }

  const files = await glob(`${input}/**/*.js`)
  for (const file of files) {
    const parts = dirname(file).split("/")
    const partial = parts[parts.length - 1].startsWith("_")
    if (partial) {
      continue
    }
    const { template } = await compile(file)
    const html = template()
    const out = file.replace(input, output).replace(".js", ".html")
    const dir = out.replace("/index.html", "")
    await mkdir(dir, { recursive: true })
    await writeFile(out, html, "utf8")
  }
  if (domain && robots) {
    await writeFile(
      join(output, "robots.txt"),
      ROBOTS.replace("example.domain", domain)
    )
  }
}

module.exports = { generate }
