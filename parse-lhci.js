const fs = require('fs');
const path = require('path');

const reportsDir = './lhci-report';

fs.readdirSync(reportsDir).forEach(file => {
  if (file.endsWith('.json')) {
    const report = JSON.parse(fs.readFileSync(path.join(reportsDir, file)));
    console.log(`\n📄 Report for: ${report.finalUrl}`);
    console.log(`Performance: ${report.categories.performance.score}`);
    console.log(`Accessibility: ${report.categories.accessibility.score}`);
    console.log(`Best Practices: ${report.categories['best-practices'].score}`);
    console.log(`SEO: ${report.categories.seo.score}`);
    console.log(`PWA: ${report.categories.pwa.score}`);
    console.log(`LCP: ${report.audits['largest-contentful-paint'].displayValue}`);
    console.log(`TBT: ${report.audits['total-blocking-time'].displayValue}`);
    console.log(`FCP: ${report.audits['first-contentful-paint'].displayValue}`);
    console.log(`CSP: ${report.audits['csp-xss'].score === 1 ? '✅' : '❌'}`);
    console.log(`HSTS: ${report.audits['has-hsts'].score === 1 ? '✅' : '❌'}`);
  }
});
