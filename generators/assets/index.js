const { copyFile, mkdir } = require("fs/promises")
const { basename, dirname, join } = require("path")
const { glob } = require("glob")
const { resize } = require("./image")

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]

async function generateAsset({ file, input, output, assets }) {
  const out = file.replace(input, output)
  const dir = dirname(out)
  await mkdir(dir, { recursive: true })
  await copyFile(file, out)
  assets.push({ path: out })
}

async function generateImage({
  file,
  input,
  output,
  params,
  assets,
  warnings,
  shouldResize,
}) {
  const out = file
    .replace(input, output)
    .replace(join(output, "views"), `${output}/`)
  const filename = basename(out)
  const dir = dirname(out)
  await mkdir(dir, { recursive: true })
  await copyFile(file, out)
  const [name, extension] = filename.split(".")
  const match = name.match(/\d+x\d+/)
  if (shouldResize && match) {
    const size = match[0]
    let [width, height] = size.split("x").map(Number)
    while (width > 100 || height > 100) {
      height = Math.round(height / 2)
      width = Math.round(width / 2)
      const filename1 = file
        .replace(input, output)
        .replace(size, `${width}x${height}`)
      await resize({ input: file, output: filename1, width, height })
    }
  } else if (shouldResize && !match) {
    warnings.push({
      file,
      type: "IMAGE_SIZE_MISSING",
    })
  }
  assets.push({ path: out })
}

module.exports = async function generateAssets(params) {
  const { input, output, warnings, resize: shouldResize = false } = params
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
      await generateImage({
        file,
        input,
        output,
        params,
        assets,
        warnings,
        shouldResize,
      })
    }
  }

  return assets
}
