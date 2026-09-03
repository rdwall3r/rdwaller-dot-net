export default function (eleventyConfig) {
  eleventyConfig.addFilter('readableDate', (dateObj, lang = 'en') => {
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(dateObj);
  });

  eleventyConfig.addPassthroughCopy({
    assets: 'assets',
    css: 'css',
    js: 'js',
  });

  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  eleventyConfig.addFilter('isoDate', (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  });
}
