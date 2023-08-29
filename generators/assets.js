const { copyFile, mkdir } = require("fs/promises")
const { basename, dirname } = require("path")
const { glob } = require("glob")
const sharp = require("sharp")

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"]

module.exports = async function generateAssets({ input, output }) {
  const files = await glob(`${input}/assets/**/*`, { nodir: true, dot: false })
  const assets = []
  for (const file of files) {
    const out = file.replace(input, output)
    const filename = basename(out)
    const dir = dirname(out)
    await mkdir(dir, { recursive: true })
    await copyFile(file, out)
    const [name, extension] = filename.split(".")
    if (IMAGE_EXTENSIONS.includes(extension)) {
      const match = name.match(/\d+x\d+/)
      if (match) {
        const size = match[0]
        let [height, width] = size.split("x").map(Number)
        while (width > 100 || height > 100) {
          height = Math.round(height / 2)
          width = Math.round(width / 2)
          const newFilename = file
            .replace(input, output)
            .replace(size, `${width}x${height}`)
          await sharp(file)
            .resize({
              height,
              width,
            })
            .toFile(newFilename)
        }
      } else {
        console.error(`Please rename ${file} and add the size`)
      }
    }
    assets.push({ path: out })
  }
  return assets
}
