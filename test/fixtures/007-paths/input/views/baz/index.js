const { a } = require("boxwood")

module.exports = ({ currentPath }) => {
  return a({ href: currentPath }, "baz")
}
