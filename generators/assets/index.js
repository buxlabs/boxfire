const { copyFile, mkdir } = require("fs/promises")
const { basename, dirname } = require("path")
const { glob } = require("glob")
const { blur, resize, compress } = require("./image")
const tinify = require("tinify")

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"]

module.exports = async function generateAssets(params) {
  const { input, output } = params
  const optimize = params.optimize && params.keys.tinify
  if (optimize) {
    tinify.key = params.keys.tinify
  }
  const files = await glob(`${input}/assets/**/*`, { nodir: true, dot: false })
  const assets = []
  for (const file of files) {
    const out = file.replace(input, output)
    const filename = basename(out)
    const dir = dirname(out)
    await mkdir(dir, { recursive: true })
    await copyFile(file, out)
    if (optimize) {
      await compress({ input: out, output: out })
    }
    const [name, extension] = filename.split(".")
    if (IMAGE_EXTENSIONS.includes(extension)) {
      if (params.blur) {
        const blurred = out.replace(`.${extension}`, `_blur32.${extension}`)
        await blur({ input: file, output: blurred })
        if (optimize) {
          await compress({ input: blurred, output: blurred })
        }
      }
      const match = name.match(/\d+x\d+/)
      if (match) {
        const size = match[0]
        let [width, height] = size.split("x").map(Number)
        while (width > 100 || height > 100) {
          height = Math.round(height / 2)
          width = Math.round(width / 2)
          const filename1 = file
            .replace(input, output)
            .replace(size, `${width}x${height}`)
          await resize({ input: file, output: filename1, width, height })
          if (optimize) {
            await compress({ input: filename1, output: filename1 })
          }
          if (params.blur) {
            const filename2 = file
              .replace(input, output)
              .replace(size, `${width}x${height}_blur32`)
            await resize({ input: file, output: filename2, width, height })
            await blur({ input: filename2, output: filename2 })
            if (optimize) {
              await compress({ input: filename2, output: filename2 })
            }
          }
        }
      } else {
        console.error(`Please rename ${file} and add the size`)
      }
    }
    assets.push({ path: out })
  }
  return assets
}
