const { unlink } = require("fs/promises")
const { glob } = require("glob")

const PAGES = [".env", ".env.example", ".htaccess"]

async function unlinkFiles({ output }) {
  const pages = await glob(`${output}/**/*`, { nodir: true, dot: false })
  for (const page of pages) {
    if (!PAGES.includes(page)) {
      await unlink(page)
    }
  }
}

module.exports = async function beforeHook({ output }) {
  await unlinkFiles({ output })
}
