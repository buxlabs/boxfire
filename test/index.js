const test = require("ava")
const { globSync } = require("glob")
const { readFile } = require("fs/promises")
const { generate } = require("..")
const { join } = require("path")
const { tmpdir } = require("os")

const tmp = tmpdir()

async function compare(assert, dir1, dir2) {
  const files1 = globSync(dir1 + "/**/*.html")
  const files2 = globSync(dir2 + "/**/*.html")
  for (let i = 0, ilen = files1.length; i < ilen; i += 1) {
    const file1 = files1[i]
    const file2 = files2[i]
    const content1 = await readFile(file1, "utf8")
    const content2 = await readFile(file2, "utf8")
    assert.deepEqual(content1, content2)
  }
}

const specs = globSync(join(__dirname, "fixtures") + "/*")

specs.map((dir) => {
  const parts = dir.split("/")
  const name = parts[parts.length - 1]
  test(name, async (assert) => {
    const input = join(__dirname, `fixtures/${name}/input`)
    const output = join(tmp, name)
    await generate({
      input,
      output,
    })
    await compare(assert, input.replace(/\/input$/, "/output"), output)
  })
})
