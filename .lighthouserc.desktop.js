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
      target: 'filesystem',
      outputDir: './lhci-report',
      reportFilenamePattern: 'report-{{url}}-{{hash}}.html',
    },
    assert: {
      assertions: {
        // Performance
        'largest-contentful-paint': ['error', { maxNumericValue: 10000 }],
        'first-contentful-paint': ['error', { maxNumericValue: 6000 }],
        'speed-index': ['error', { maxNumericValue: 5000 }],
        'total-blocking-time': ['error', { maxNumericValue: 500 }],
        'interactive': ['error', { maxNumericValue: 5000 }],

        // Categories
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // CSP / Security headers (as close as possible)
        'csp-xss': ['error', { minScore: 1 }], // Available in core audits
        'uses-http2': 'warn',
        'is-on-https': 'error',
        'redirects-http': 'error',
        'uses-rel-preconnect': 'warn',

        // HSTS – Only "has-hsts" is available
        'has-hsts': ['error', { minScore: 1 }]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci-report',
      reportFilenamePattern: 'report-{{url}}-{{hash}}.html'
    }
  }
};
