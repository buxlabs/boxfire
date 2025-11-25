const { cp: copy, stat } = require("node:fs/promises")
const { join } = require("node:path")

async function isDirectory(path) {
  try {
    const dirent = await stat(path)
    return dirent.isDirectory()
  } catch {
    return false
  }
}

async function generatePublic({ input, output }) {
  const publicPath = join(input, "public")
  if (await isDirectory(publicPath)) {
    await copy(publicPath, output, { recursive: true })
  }
}

module.exports = generatePublic
