const WARNING_MAP = {
  IMAGE_SIZE_MISSING:
    "is missing the size in the filename. Please rename the file to include the size (e.g. 100x100)",
}

module.exports = async function afterHook({
  paths,
  output,
  domain,
  robots,
  sitemap,
  warnings,
  log,
}) {
  if (log === "verbose" || process.env.LOG === "verbose") {
    warnings.map((warning) =>
      console.log(`${warning.file} ${WARNING_MAP[warning.type]}`)
    )

    paths.map((path) =>
      console.log(`${path.replace(`${output}/`, "")} created`)
    )
    if (domain && robots) {
      console.log("robots.txt created")
    }
    if (domain && sitemap) {
      console.log("sitemap.xml created")
      console.log("sitemap.txt created")
    }
  } else if (log) {
    console.log(
      [
        `${paths.length} files created`,
        warnings.length > 0 &&
          `${warnings.length} warnings. Run with LOG=verbose for more details.`,
      ]
        .filter(Boolean)
        .join(", ")
    )
  }
}
