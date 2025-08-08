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
    },
    assert: {
      assertions: {
        // Performance
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1000 }],
        'speed-index': ['error', { maxNumericValue: 100 }],
        'total-blocking-time': ['error', { maxNumericValue: 20 }],
        'interactive': ['error', { maxNumericValue: 5000 }],

        // Categories
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // CSP / Security headers (as close as possible)
        'csp-xss': ['error', { minScore: 1 }], // Available in core audits
        'uses-http2': 'warn',
        'is-on-https': 'error',
        'redirects-http': 'error',
        'uses-rel-preconnect': 'warn',

        // HSTS – Only "has-hs  ts" is available
        'has-hsts': ['error', { minScore: 1 }]
      }
    },
  }
};
