const { writeFile } = require("fs/promises")
const { join } = require("path")

const SITEMAP_START = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`.trim()

const SITEMAP_END = `
</urlset>
`.trim()

module.exports = async function generateSitemap({ paths, output, domain }) {
  const content =
    SITEMAP_START +
    "\n" +
    paths
      .map((path) => {
        const pathname = path.replace(output, "").replace("index.html", "")
        return `  <url><loc>${
          domain.startsWith("https://") ? domain : "https://" + domain
        }${pathname === "/" ? "" : pathname}</loc></url>`
      })
      .join("\n") +
    "\n" +
    SITEMAP_END

  await writeFile(join(output, "sitemap.xml"), content)
}
