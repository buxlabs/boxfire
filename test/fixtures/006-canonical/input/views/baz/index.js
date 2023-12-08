const { link } = require("boxwood")

module.exports = ({ canonical }) => {
  return link({ rel: "canonical", href: canonical })
}
