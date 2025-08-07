const fs = require('fs');
const xml2js = require('xml2js');

(async () => {
  const data = fs.readFileSync('./result/result.jtl');
  const result = await xml2js.parseStringPromise(data);

  const samples = result.testResults.httpSample;

  const responseTimes = samples.map(s => parseInt(s.$.t));
  const errorCount = samples.filter(s => s.$.s === 'false').length;

  const avg = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
  const max = Math.max(...responseTimes);
  const sorted = [...responseTimes].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];

  console.log(`📊 Home Page Metrics Report:`);
  console.log(`  Max Response Time: ${max}ms`);
  console.log(`  Average Response Time: ${avg}ms`);
  console.log(`  95th Percentile: ${p95}ms`);
  console.log(`  99th Percentile: ${p99}ms`);
  console.log(`  Errored Requests: ${errorCount}`);

  if (max >= 10000) throw new Error(`❌ Max response time too high: ${max}`);
  if (avg >= 1600) throw new Error(`❌ Average response time too high: ${avg}`);
  if (errorCount !== 0) throw new Error(`❌ Errors found in JMeter requests`);
})();
