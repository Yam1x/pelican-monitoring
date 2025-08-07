module.exports = {
  ci: {
    collect: {
      url: [
        "https://chelzoo.ru",
        "https://chelzoo.ru/news"
      ],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
      }
    },
    assert: {
      assertions: {
        // Performance
        'largest-contentful-paint': ['error', { maxNumericValue: 5000 }],
        'first-contentful-paint': ['error', { maxNumericValue: 3000 }],
        'speed-index': ['error', { maxNumericValue: 4300 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'interactive': ['error', { maxNumericValue: 5000 }],

        // Categories
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:performance': ['error', { minScore: 0.7 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.9 }],

        // Best Practices
        'errors-in-console': 'error',
        'uses-passive-event-listeners': 'warn',
        'deprecations': 'warn',

        // Byte Efficiency
        'uses-text-compression': 'warn',
        'uses-optimized-images': 'warn',
        'uses-responsive-images': 'warn',
        'uses-long-cache-ttl': ['warn', { minScore: 0.5 }],
        'total-byte-weight': ['warn', { maxNumericValue: 1600000 }],

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
