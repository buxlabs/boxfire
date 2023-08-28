const { copyFile, mkdir } = require("fs/promises")
const { dirname } = require("path")
const { glob } = require("glob")

module.exports = async function generateAssets({ input, output }) {
  const files = await glob(`${input}/assets/**/*`, { nodir: true, dot: false })
  const assets = []
  for (const file of files) {
    const out = file.replace(input, output)
    const dir = dirname(out)
    await mkdir(dir, { recursive: true })
    await copyFile(file, out)
    assets.push({ path: out })
  }
  return assets
}