const generate = require("./generate")
const serve = require("./serve")
const { default: debounce } = require("awesome-debounce-promise")

const debouncedGenerate = debounce(generate, 100)

module.exports = function watch({
  input,
  output,
  domain,
  robots = true,
  sitemap = true,
  log = true,
  port,
}) {
  serve({ static: output, port })
  const watcher = chokidar.watch(input, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
  })

  async function onEvent() {
    await debouncedGenerate({
      input,
      output,
      domain,
      robots,
      sitemap,
      log,
    })
  }

  watcher.on("ready", onEvent)
  watcher.on("add", onEvent)
  watcher.on("change", onEvent)
  watcher.on("unlink", onEvent)
}
