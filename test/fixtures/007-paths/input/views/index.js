const { A, Ul, Li } = require("boxwood")

module.exports = ({ currentPath, paths }) => {
  return [A({ href: currentPath }, "home"), Ul(paths.map((path) => Li(path)))]
}
