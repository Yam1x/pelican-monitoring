module.exports = {
  ci: {
    collect: {
      url: ['https://chelzoo.ru'],
      numberOfRuns: 1,
      settings: {
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
