const fs = require('fs');
const path = require('path');

const reportsDir = './lhci-report';

fs.readdirSync(reportsDir).forEach(file => {
  if (file.endsWith('.json')) {
    const filePath = path.join(reportsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    try {
      const report = JSON.parse(content);

      if (!report.categories || !report.audits) {
        console.warn(`⚠️  Skipping ${file} — not a valid Lighthouse report.`);
        return;
      }

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

    } catch (error) {
      console.error(`❌ Failed to parse ${file}: ${error.message}`);
    }
  }
});
