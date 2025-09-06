const { A } = require("boxwood")

module.exports = ({ currentPath }) => {
  return A({ href: currentPath }, "baz")
}
