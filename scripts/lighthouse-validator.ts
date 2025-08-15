import fs from 'fs';
import path from 'path';

interface Audit {
  id: string;
  title: string;
  score: number | null;
  numericValue?: number;
  numericUnit?: string;
}

interface Category {
  score: number;
}

interface LHR {
  audits: Record<string, Audit>;
  categories: Record<string, Category>;
}

function main() {
  try {
    const reportsDir = '.lighthouseci';
    const reportFile = fs.readdirSync(reportsDir).find(file => file.startsWith('lhr-') && file.endsWith('.json'));
    
    if (!reportFile) {
      throw new Error('No Lighthouse JSON report found in .lighthouseci directory');
    }

    const reportPath = path.join(reportsDir, reportFile);
    console.log(`Found report: ${reportPath}`);

    const rawData = fs.readFileSync(reportPath, 'utf8');
    const report: LHR = JSON.parse(rawData);

    if (!report.audits || !report.categories) {
      throw new Error('Invalid Lighthouse report format - missing required fields');
    }

    processReport(report);
  } catch (error: any) {
    console.error('\n❌ Error processing Lighthouse results:');
    console.error(error.stack);
    process.exit(1);
  }
}

function processReport(data: LHR) {
  const audits = data.audits;
  const categories = data.categories;

  const performanceThresholds: Record<string, { warn: number; error: number }> = {
    'first-contentful-paint': { warn: 1800, error: 3000 },
    'largest-contentful-paint': { warn: 2400, error: 4000 },
    'speed-index': { warn: 3400, error: 5800 },
    'total-blocking-time': { warn: 150, error: 350 },
    'interactive': { warn: Infinity, error: 5000 }
  };

  const securityThresholds: Record<string, { minScore: number }> = {
    'csp-xss': { minScore: 1 },
    'is-on-https': { minScore: 1 },
    'redirects-http': { minScore: 1 },
    'has-hsts': { minScore: 1 }
  };

  const warningMetrics = {
    'uses-http2': 'Uses HTTP/2',
    'uses-rel-preconnect': 'Uses rel=preconnect'
  };

  console.log('\n📊 Lighthouse Audit Summary:');
  let hasError = false;
  let hasWarning = false;

  console.log('\n🚀 Performance Metrics:');
  Object.entries(performanceThresholds).forEach(([id, limits]) => {
    const audit = audits[id];
    if (!audit) {
      console.warn(`⚠️  Audit not found: ${id}`);
      return;
    }

    const value = audit.numericValue ?? 0;
    const unit = audit.numericUnit || '';
    let status: string, emoji: string;

    if (value > limits.error) {
      status = 'ERROR';
      emoji = '❌';
      hasError = true;
    } else if (value > limits.warn) {
      status = 'WARN';
      emoji = '⚠️';
      hasWarning = true;
    } else {
      status = 'PASS';
      emoji = '✅';
    }

    console.log(`${emoji} ${audit.title}: ${Math.round(value)}${unit} | warn ≤ ${limits.warn}, error ≤ ${limits.error} (${status})`);
  });

  console.log('\n🔒 Security Metrics:');
  Object.entries(securityThresholds).forEach(([id, limits]) => {
    const audit = audits[id];
    if (!audit) {
      console.warn(`⚠️  Audit not found: ${id}`);
      return;
    }

    const score = (audit.score ?? 0) * 100;
    let status, emoji: string;

    if (score < limits.minScore * 100) {
      status = 'ERROR';
      emoji = '❌';
      hasError = true;
    } else {
      status = 'PASS';
      emoji = '✅';
    }

    console.log(`${emoji} ${audit.title}: ${Math.round(score)}/100 | min ${limits.minScore * 100} (${status})`);
  });

  console.log('\nℹ️  Additional Checks:');
  Object.entries(warningMetrics).forEach(([id, title]) => {
    const audit = audits[id];
    if (!audit) return;

    const score = (audit.score ?? 0) * 100;
    if (score < 100) {
      console.log(`⚠️  ${title}: ${Math.round(score)}/100 (WARNING)`);
      hasWarning = true;
    } else {
      console.log(`✅ ${title}: ${Math.round(score)}/100 (PASS)`);
    }
  });

  console.log('\n🏆 Category Scores:');
  const perfScore = Math.round((categories.performance?.score ?? 0) * 100);
  console.log(`🚀 Performance: ${perfScore}/100`);

  const a11yScore = Math.round((categories.accessibility?.score ?? 0) * 100);
  if (a11yScore < 90) {
    console.log(`❌ Accessibility: ${a11yScore}/100 | min 90 (ERROR)`);
    hasError = true;
  } else {
    console.log(`✅ Accessibility: ${a11yScore}/100 (PASS)`);
  }

  if (hasError) {
    console.error('\n❌ One or more metrics exceeded ERROR thresholds');
    process.exit(1);
  } else if (hasWarning) {
    console.log('\n⚠️  Some warnings detected, but no critical errors');
  } else {
    console.log('\n✅ All metrics within acceptable thresholds');
  }
}

main();