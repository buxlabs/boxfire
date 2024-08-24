const { copyFile, mkdir } = require("fs/promises")
const { basename, dirname, join } = require("path")
const { glob } = require("glob")
const { blur, resize } = require("./image")

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]

async function generateAsset({ file, input, output, assets }) {
  const out = file.replace(input, output)
  const dir = dirname(out)
  await mkdir(dir, { recursive: true })
  await copyFile(file, out)
  assets.push({ path: out })
}

async function generateImage({ file, input, output, params, assets }) {
  const out = file
    .replace(input, output)
    .replace(join(output, "views"), `${output}/`)
  const filename = basename(out)
  const dir = dirname(out)
  await mkdir(dir, { recursive: true })
  await copyFile(file, out)
  const [name, extension] = filename.split(".")
  if (params.blur) {
    const blurred = out.replace(`.${extension}`, `_blur32.${extension}`)
    await blur({ input: file, output: blurred })
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
      if (params.blur) {
        const filename2 = file
          .replace(input, output)
          .replace(size, `${width}x${height}_blur32`)
        await resize({ input: file, output: filename2, width, height })
        await blur({ input: filename2, output: filename2 })
      }
    }
  } else {
    console.error(`Please rename ${file} and add the size`)
  }
  assets.push({ path: out })
}

module.exports = async function generateAssets(params) {
  const { input, output } = params
  const files = await glob(`${input}/assets/**/*`, {
    absolute: true,
    nodir: true,
    dot: false,
  })
  const assets = []
  for (const file of files) {
    const extension = file.split(".").pop()
    if (!IMAGE_EXTENSIONS.includes(extension)) {
      await generateAsset({ file, input, output, assets })
    }
  }

  const everything = await glob(`${input}/**/*`, {
    absolute: true,
    nodir: true,
    dot: false,
  })
  for (const file of everything) {
    const extension = file.split(".").pop()
    if (IMAGE_EXTENSIONS.includes(extension)) {
      await generateImage({ file, input, output, params, assets })
    }
  }

  return assets
}
