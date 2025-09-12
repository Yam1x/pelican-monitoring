module.exports = {
  ci: {
    collect: {
      url: ['https://chelzoo.ru?mobile'],
      numberOfRuns: 1,
      settings: {
        additive: "true",
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
        'largest-contentful-paint': ['error', { maxNumericValue: 15000 }], // recommended: <2.5s
        'first-contentful-paint': ['error', { maxNumericValue: 5000 }],   // recommended: <1.8s
        'speed-index': ['error', { maxNumericValue: 8000 }],              // recommended: <3.4s
        'total-blocking-time': ['error', { maxNumericValue: 2000 }],       // recommended: <200ms
        'interactive': ['error', { maxNumericValue: 10000 }],              // recommended: <3.8s

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
