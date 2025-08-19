module.exports = {
  ci: {
    collect: {
      url: ['https://chelzoo.ru?desktop'],
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
      assertions: {
        // Performance core metrics
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // recommended: <2.5s
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],   // recommended: <1.8s
        'speed-index': ['error', { maxNumericValue: 3400 }],              // recommended: <3.4s
        'total-blocking-time': ['error', { maxNumericValue: 200 }],       // recommended: <200ms
        'interactive': ['error', { maxNumericValue: 3800 }],              // recommended: <3.8s

        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // Best practices / security headers
        'is-on-https': 'error',
        'redirects-http': 'error',
        'uses-http2': 'warn',
        'has-hsts': ['error', { minScore: 1 }],
      },
    },
  },
};
