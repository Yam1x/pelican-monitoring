module.exports = {
  ci: {
    collect: {
      url: [
        "https://chelzoo.ru",
        "https://chelzoo.ru/news"
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop'
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
        
        // SEO / Best practices / HTTPS
        'is-on-https': 'error',
        'redirects-http': 'error',
        'uses-http2': 'warn',
        'canonical': 'off',

        // Accessibility
        'accessibility-score': ['error', { minScore: 0.9 }],

        // Best Practices
        'errors-in-console': 'error',
        'uses-passive-event-listeners': 'warn',

        // Optional – security-relevant, if supported
        'uses-text-compression': 'warn',
        'uses-optimized-images': 'warn', 

        // CSP (Content-Security-Policy)
        'csp-xss': ['error', { minScore: 1 }], // строгое требование

        // Security headers
        'uses-http2': ['warn', { minScore: 1 }],
        'uses-text-compression': ['error', { minScore: 1 }],
        'x-content-type-options': ['error', { minScore: 1 }],
        'x-frame-options': ['error', { minScore: 1 }],
        'x-xss-protection': ['error', { minScore: 1 }],
        'strict-transport-security': ['error', { minScore: 1 }],
        'no-vulnerable-libraries': ['warn', { minScore: 1 }],
        'is-on-https': ['error', { minScore: 1 }],
        'redirects-http': ['error', { minScore: 1 }],
        'uses-long-cache-ttl': ['warn', { minScore: 0.5 }],
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci-report',
      reportFilenamePattern: 'report-{{url}}-{{hash}}.html',
    }
  }
};
