const fs = require('fs');
const xml2js = require('xml2js');

(async () => {
  const filePath = './result/homePage.jtl';
  if (!fs.existsSync(filePath)) {
    console.error(`File was not found: ${filePath}`);
    process.exit(1);
  }

  const data = fs.readFileSync(filePath, 'utf8');
  if (data.trim() === '') {
    console.error(`File is empty: ${filePath}`);
    process.exit(1);
  }

  try {
    const result = await xml2js.parseStringPromise(data);
    const samples = result.testResults.httpSample || [];
    if (samples.length === 0) {
      console.log('There are no results.');
      process.exit(0);
    }

    const responseTimes = samples.map(s => parseInt(s.$.t));
    const errorCount = samples.filter(s => s.$.s === 'false').length;
    const avg = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
    const max = Math.max(...responseTimes);
    const sorted = [...responseTimes].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    console.log(`📊Home Page Load Tests Report (Jmeter):`);
    console.log(`  Max response: ${max}ms`);
    console.log(`  Average response time: ${avg}ms`);
    console.log(`  95th percentile: ${p95}ms`);
    console.log(`  99th percentile: ${p99}ms`);
    console.log(`  Error requests: ${errorCount}`);

    const issues = [];
    if (max >= 5000) issues.push(`❌ Max response time is too high (>5000ms): ${max}`);
    if (avg >= 1500) issues.push(`❌ Average response time is too high (>1500ms): ${avg}`);
    if (errorCount !== 0) issues.push(`❌ There are errors while processing requests from JMeter`);

    if (issues.length > 0) {
      console.error(issues.join('\n'));
      process.exit(1);
    }

  } catch (err) {
    console.error(`Error while parsing results: ${err.message}`);
    process.exit(1);
  }
})();
