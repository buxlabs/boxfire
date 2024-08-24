const sharp = require("sharp")

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

module.exports = {
  blur,
  resize,
}
