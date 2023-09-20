const { writeFile } = require("fs/promises")
const { join } = require("path")

const ROBOTS = `
User-agent: *
Allow: /

Sitemap: https://example.domain/sitemap.xml
Sitemap: https://example.domain/sitemap.txt
`.trim()

module.exports = async function generateRobots({ output, domain }) {
  const content = domain.startsWith("https://")
    ? ROBOTS.replaceAll("https://example.domain", domain)
    : ROBOTS.replaceAll("example.domain", domain)
  await writeFile(join(output, "robots.txt"), content)
}
