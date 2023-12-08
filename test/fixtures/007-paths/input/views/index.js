const { a, ul, li } = require("boxwood")

module.exports = ({ currentPath, paths }) => {
  return [a({ href: currentPath }, "home"), ul(paths.map((path) => li(path)))]
}
