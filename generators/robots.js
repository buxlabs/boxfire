const { writeFile } = require("fs/promises")
const { join } = require("path")

const ROBOTS = `
User-agent: *
Allow: /

Sitemap: https://example.domain/sitemap.xml
`.trim()

module.exports = async function generateRobots({ output, domain }) {
  const content = domain.startsWith("https://")
    ? ROBOTS.replace("https://example.domain", domain)
    : ROBOTS.replace("example.domain", domain)
  await writeFile(join(output, "robots.txt"), content)
}
