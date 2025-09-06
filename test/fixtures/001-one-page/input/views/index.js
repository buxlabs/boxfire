const { Doctype, Html, Head, Body, H1 } = require("boxwood")

module.exports = () => {
  return [Doctype(), Html([Head(), Body([H1("foo")])])]
}
