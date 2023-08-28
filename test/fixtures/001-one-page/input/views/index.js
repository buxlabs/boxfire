const { doctype, html, head, body, h1 } = require("boxwood")

module.exports = () => {
  return [doctype(), html([head(), body([h1("foo")])])]
}
