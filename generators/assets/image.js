const sharp = require("sharp")
const tinify = require("tinify")

async function blur({ input, output, blur = 32 }) {
  const buffer = await sharp(input).blur(blur).toBuffer()
  return sharp(buffer).toFile(output)
}

async function resize({ input, output, width, height }) {
  const buffer = await sharp(input)
    .resize({
      width,
      height,
    })
    .toBuffer()
  return sharp(buffer).toFile(output)
}

async function blurAndResize({ input, output, width, height, blur = 32 }) {
  const buffer = await sharp(input)
    .resize({
      width,
      height,
    })
    .blur(blur)
    .toBuffer()
  return sharp(buffer).toFile(output)
}

async function compress({ input, output }) {
  const source = tinify.fromFile(input)
  source.toFile(output)
}

module.exports = {
  blur,
  resize,
  blurAndResize,
  compress,
}
