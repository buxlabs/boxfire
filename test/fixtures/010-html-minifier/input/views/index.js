const Button = require("../components/button")
const { Doctype, Html, Head, Body } = require("boxwood")

module.exports = () => {
  return [Doctype(), Html([Head(), Body([Button({ px: "sm" }, "foo")])])]
}
