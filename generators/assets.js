const { copyFile, mkdir } = require("fs/promises")
const { basename, dirname } = require("path")
const { glob } = require("glob")

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"]

module.exports = async function generateAssets({ input, output }) {
  const files = await glob(`${input}/assets/**/*`, { nodir: true, dot: false })
  const assets = []
  for (const file of files) {
    const out = file.replace(input, output)
    const filename = basename(out)
    const [name, extension] = filename.split(".")
    if (IMAGE_EXTENSIONS.includes(extension) && !name.match(/\d+x\d+/)) {
      console.error(`Please rename ${file} and add the size`)
    }
    const dir = dirname(out)
    await mkdir(dir, { recursive: true })
    await copyFile(file, out)
    assets.push({ path: out })
  }
  return assets
}
