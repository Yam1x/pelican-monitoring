import fs from 'fs';
import path from 'path';

interface AssertionResult {
  level: 'error' | 'warn' | 'info';
  assertion: string;
  expected: string;
  actual: string | number;
}

interface AssertionResults {
  [category: string]: AssertionResult[];
}

interface Summary {
  numPassing: number;
  numFailing: number;
  numWarnings: number;
}

interface AssertionReport {
  assertionResults?: AssertionResults;
  summary?: Summary;
}

function loadReport(filePath: string): AssertionReport | [] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ Mobile: no such file assertion-results.json (${filePath})`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function processReport(report: AssertionReport | []): void {
  // случай: пустой массив
  if (Array.isArray(report) && report.length === 0) {
    console.log('✅ Mobile: ALL TESTS ARE PASSED');
    process.exit(0);
  }

  if (!Array.isArray(report)) {
    const summary = report.summary;
    const results = report.assertionResults ?? {};

    if (summary?.numFailing && summary.numFailing > 0) {
      console.error('❌ Mobile: TESTS ARE FAILED!');
      for (const [category, assertions] of Object.entries(results)) {
        assertions.forEach(r => {
          if (r.level === 'error') {
            console.error(`- [${category}] ${r.assertion}: expected ${r.expected}, actual ${r.actual}`);
          }
        });
      }
      process.exit(1);
    }

    if (summary?.numWarnings && summary.numWarnings > 0) {
      console.warn('⚠️ Mobile: WARNINGS!');
      process.exit(0);
    }

    // если только проходящие тесты
    console.log('✅ Mobile: ALL TESTS ARE PASSED!');
    process.exit(0);
  }

  throw new Error('❌ Mobile: incorrect format of assertion-results.json');
}

function main(): void {
  try {
    const reportsDir = '.lighthouseci';
    const reportFile = 'mobile-assertion-results.json';
    const reportPath = path.join(reportsDir, reportFile);

    const report = loadReport(reportPath);
    processReport(report);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    process.exit(1);
  }
}

main();
