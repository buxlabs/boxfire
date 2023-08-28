const express = require("express")

module.exports = async function serve({ static, port }) {
  const app = express()
  app.use(express.static(static))
  app.listen(port)
  return app
}
