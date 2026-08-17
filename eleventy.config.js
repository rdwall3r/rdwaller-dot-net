export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    assets: 'assets',
    css: 'css',
    js: 'js',
  });

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(dateObj);
  });
}
