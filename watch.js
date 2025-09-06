const generate = require("./generate")
const serve = require("./serve")
const chokidar = require("chokidar")
const { default: debounce } = require("awesome-debounce-promise")
const PrettyError = require("pretty-error")
const pe = new PrettyError()

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
  paths = [],
  port,
  keys,
  compile,
}) {
  serve({ static: output, port })
  const watcher = chokidar.watch([input, ...paths], {
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
        keys,
        compile,
      })
    } catch (exception) {
      console.log(pe.render(exception))
    }
  }

  watcher.on("ready", onEvent)
  watcher.on("add", onEvent)
  watcher.on("change", onEvent)
  watcher.on("unlink", onEvent)
}
