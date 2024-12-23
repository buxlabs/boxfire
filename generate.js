const beforeHook = require("./hooks/before")
const afterHook = require("./hooks/after")
const generatePages = require("./generators/pages")
const generateAssets = require("./generators/assets")
const generateRobots = require("./generators/robots")
const generateSitemap = require("./generators/sitemap")

module.exports = async function generate({
  input,
  output,
  domain,
  robots = true,
  sitemap = true,
  log = true,
  blur = false,
  optimize = false,
  keys,
  compile,
}) {
  const warnings = []
  await beforeHook({ output })
  const pages = await generatePages({ input, output, domain, compile })
  const assets = await generateAssets({
    input,
    output,
    blur,
    optimize,
    keys,
    warnings,
  })
  const paths = [
    ...pages.map((page) => page.path),
    ...assets.map((asset) => asset.path),
  ]
  if (domain && robots) {
    await generateRobots({ output, domain })
  }
  if (domain && sitemap) {
    await generateSitemap({ pages, output, domain })
  }
  await afterHook({ paths, output, domain, robots, sitemap, log, warnings })
}
