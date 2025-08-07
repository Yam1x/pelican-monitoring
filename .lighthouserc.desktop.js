module.exports = {
  ci: {
    collect: {
      url: [
        "https://chelzoo.ru",
        "https://chelzoo.ru/news"
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
      }
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['error', { maxNumericValue: 5000 }],
        'uses-https': 'error',
        'is-on-https': 'error',
        'no-mixed-content': 'error',
        'canonical': 'off',
        'redirects-http': 'error',
        'service-worker': 'off',
        'csp-xss': 'error',
        'x-frame-options': 'error',
        'strict-transport-security': 'error',
        'accessibility': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
       target: 'filesystem',
       outputDir: './lhci-report',
       reportFilenamePattern: 'report-{{url}}-{{hash}}.html',
    },
  }
};
