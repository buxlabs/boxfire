const beforeHook = require("./hooks/before")
const afterHook = require("./hooks/after")
const generatePages = require("./generators/pages")
const generateRobots = require("./generators/robots")
const generateSitemap = require("./generators/sitemap")

async function generate({
  input,
  output,
  domain,
  robots = true,
  sitemap = true,
  log = true,
}) {
  await beforeHook({ output })
  const { paths } = await generatePages({ input, output })
  if (domain && robots) {
    await generateRobots({ output, domain })
  }
  if (domain && sitemap) {
    await generateSitemap({ paths, output, domain })
  }
  await afterHook({ paths, output, domain, robots, sitemap, log })
}

module.exports = { generate }
