const test = require("ava")
const { globSync } = require("glob")
const { readFile, unlink } = require("fs/promises")
const { generate } = require("..")
const { join } = require("path")
const { tmpdir } = require("os")

async function compareByExtension(assert, dir1, dir2, extension) {
  const files1 = globSync(dir1 + `/**/*.${extension}`, { nodir: true })
  const files2 = globSync(dir2 + `/**/*.${extension}`, { nodir: true })
  for (let i = 0, ilen = files1.length; i < ilen; i += 1) {
    const file1 = files1[i]
    const file2 = files2[i]
    assert.truthy(file1)
    assert.truthy(file2, "Missing file for: " + file1)
    const content1 = await readFile(file1, "utf8")
    const content2 = await readFile(file2, "utf8")
    assert.deepEqual(content1, content2)
  }
}

async function compare(assert, dir1, dir2) {
  await compareByExtension(assert, dir1, dir2, "html")
  await compareByExtension(assert, dir1, dir2, "txt")
  await compareByExtension(assert, dir1, dir2, "xml")
  await compareByExtension(assert, dir1, dir2, "svg")
  await compareByExtension(assert, dir1, dir2, "png")
  await compareByExtension(assert, dir1, dir2, "pdf")
}

const specs = globSync(join(__dirname, "fixtures") + "/*")

specs.map((dir) => {
  const parts = dir.split("/")
  const name = parts[parts.length - 1]
  test(name, async (assert) => {
    const input = join(__dirname, `fixtures/${name}/input`)
    const output = process.env.DEBUG
      ? join(__dirname, "debug")
      : join(tmpdir(), name)
    const existing = globSync(output + "/**/*", { nodir: true })
    existing.forEach((file) => {
      unlink(file)
    })
    await generate({
      input,
      output,
      robots: name.includes("robots"),
      sitemap: name.includes("sitemap"),
      domain: "foo.bar",
      log: false,
      blur: true,
    })
    await compare(assert, input.replace(/\/input$/, "/output"), output)
  })
})
