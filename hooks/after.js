module.exports = async function afterHook({
  paths,
  output,
  domain,
  robots,
  sitemap,
  log,
}) {
  if (log) {
    paths.map((path) =>
      console.log(`${path.replace(`${output}/`, "")} created`)
    )
    if (domain && robots) {
      console.log("robots.txt created")
    }
    if (domain && sitemap) {
      console.log("sitemap.xml created")
    }
  }
}
