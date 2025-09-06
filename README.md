npm install --save-dev boxfire boxwood

# boxfire

**boxfire** is a static site generator for Node.js, designed to work seamlessly with [boxwood](https://github.com/buxlabs/boxwood). It supports dynamic pages, asset processing (including image resizing), robots.txt and sitemap generation, and HTML minification.

## Features

- **Boxwood-based views**: Write your site using boxwood components and functions.
- **Dynamic pages**: Generate pages from dynamic content (e.g., blog posts).
- **Asset pipeline**: Copy, resize images; copy other assets.
- **HTML minification**: Output is minified for performance.
- **robots.txt & sitemap.xml/txt**: Generated automatically for SEO.
- **Watch mode**: Watch mode for development with auto-regeneration and static file serving.
- **Hooks**: Customizable before/after build hooks.

## Installation

```bash
npm install --save-dev boxfire boxwood
```

## Usage

### CLI

You can use `boxfire` programmatically in your build scripts. Example:

```js
const { generate, serve, watch } = require("boxfire")
const { compile } = require("boxwood")

generate({
  input: "src", // Path to your input directory (must contain 'views/')
  output: "dist", // Path to output directory
  domain: "example.com", // Used for canonical URLs, robots.txt, sitemap
  robots: true, // Generate robots.txt
  sitemap: true, // Generate sitemap.xml and sitemap.txt
  log: true, // Enable logging
  compile, // boxwood compile function
})
```

### Watch mode

For development, use the watch function to regenerate and serve your site on file changes:

```js
watch({
  input: "src",
  output: "dist",
  domain: "localhost",
  port: 3000,
  compile,
})
```

## Project Structure

Your input directory should look like:

```
src/
	views/
		index.js
		about/
			index.js
	assets/
		logo.png
		...
```

- **views/**: Each `.js` file exports a boxwood component for a page.
- **assets/**: Static files (images, pdfs, etc.) are copied and processed.

## Dynamic Pages

To generate dynamic pages (e.g., blog posts), use dynamic view filenames like `[slug].js` and provide content in `assets/content/`:

```
src/
	views/
		blog/
			[slug].js
	assets/
		content/
			blog/
				foo/
					index.js
				bar/
					index.js
```

Each content file should export a function returning an object with properties (e.g., `{ slug: "foo" }`).

## Output

- HTML files for each view.
- Resized images in multiple sizes.
- `robots.txt`, `sitemap.xml`, and `sitemap.txt` (if enabled).

## Testing

Run tests with:

```sh
npm test
```

## License

MIT
