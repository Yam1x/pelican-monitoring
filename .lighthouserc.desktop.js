module.exports = {
  ci: {
    collect: {
      url: ['https://chelzoo.ru'],
      numberOfRuns: 1,
      settings: {
        additive: "true",
        preset: 'desktop',
        output: ['html', 'json'],
      },
    },
    upload: {
      target: 'temporary-public-storage',
      outputDir: '.lighthouseci'
    },
    assert: {
      preset: 'lighthouse:recommended'
    }
  },
};
