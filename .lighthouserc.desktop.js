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
      assertions: {
        // Performance
        'largest-contentful-paint': [
          'warn', { maxNumericValue: 2400 },
          'error', { maxNumericValue: 4000 }
        ],
        'first-contentful-paint': [
          'warn', { maxNumericValue: 1800 },
          'error', { maxNumericValue: 3000 }
        ],
        'speed-index': [
          'warn', { maxNumericValue: 3400 },
          'error', { maxNumericValue: 5800 }
        ],
        'total-blocking-time': [
          'warn', { maxNumericValue: 150 },
          'error', { maxNumericValue: 350 }
        ],
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
