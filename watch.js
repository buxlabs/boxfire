const generate = require("./generate")
const serve = require("./serve")
const chokidar = require("chokidar")
const { default: debounce } = require("awesome-debounce-promise")

const debouncedGenerate = debounce(generate, 100)

function clearCache() {
  Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key]
  })
}

module.exports = function watch({
  input,
  output,
  domain,
  robots = true,
  sitemap = true,
  log = true,
  port,
  blur = false,
  optimize,
  keys,
}) {
  serve({ static: output, port })
  const watcher = chokidar.watch(input, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
  })

  async function onEvent() {
    clearCache()
    try {
      await debouncedGenerate({
        input,
        output,
        domain,
        robots,
        sitemap,
        log,
        blur,
        optimize,
        keys,
      })
    } catch (exception) {
      console.error(exception)
    }
  }

  watcher.on("ready", onEvent)
  watcher.on("add", onEvent)
  watcher.on("change", onEvent)
  watcher.on("unlink", onEvent)
}
