const sharp = require("sharp")

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
  resize,
}
