const { Link } = require("boxwood")

module.exports = ({ canonical }) => {
  return Link({ rel: "canonical", href: canonical })
}
