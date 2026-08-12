export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    assets: "assets",
    css: "css",
    js: "js",
  });
}
