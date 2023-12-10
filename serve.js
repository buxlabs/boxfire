const express = require("express")
const compression = require("compression")

module.exports = async function serve({ static, port }) {
  const app = express()
  app.use(compression())
  app.use(express.static(static))
  app.listen(port)
  return app
}
