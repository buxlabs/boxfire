const button = require("../components/button")
const { doctype, html, head, body } = require("boxwood")

module.exports = () => {
  return [doctype(), html([head(), body([button({ px: "sm" }, "foo")])])]
}
