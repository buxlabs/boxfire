const test = require("ava")
const { globSync } = require("glob")
const { readFile } = require("fs/promises")
const { generate } = require("..")
const { join } = require("path")
const { tmpdir } = require("os")

const tmp = tmpdir()

async function compareByExtension(assert, dir1, dir2, extension) {
  const files1 = globSync(dir1 + `/**/*.${extension}`)
  const files2 = globSync(dir2 + `/**/*.${extension}`)
  for (let i = 0, ilen = files1.length; i < ilen; i += 1) {
    const file1 = files1[i]
    const file2 = files2[i]
    assert.truthy(file1)
    assert.truthy(file2)
    const content1 = await readFile(file1, "utf8")
    const content2 = await readFile(file2, "utf8")
    assert.deepEqual(content1, content2)
  }
}

async function compare(assert, dir1, dir2) {
  await compareByExtension(assert, dir1, dir2, "html")
  await compareByExtension(assert, dir1, dir2, "txt")
  await compareByExtension(assert, dir1, dir2, "xml")
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
      robots: name.includes("robots"),
      sitemap: name.includes("sitemap"),
      domain: "foo.bar",
      log: false,
    })
    await compare(assert, input.replace(/\/input$/, "/output"), output)
  })
})
