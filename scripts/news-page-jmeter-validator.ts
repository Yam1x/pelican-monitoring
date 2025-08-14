import fs from 'fs';
import xml2js from 'xml2js';

(async () => {
  const filePath: string = './result/news-page.jtl';

  if (!fs.existsSync(filePath)) {
    console.error(`File was not found: ${filePath}`);
    process.exit(1);
  }

  const data: string = fs.readFileSync(filePath, 'utf8');
  if (data.trim() === '') {
    console.error(`File is empty: ${filePath}`);
    process.exit(1);
  }

  try {
    const result: any = await xml2js.parseStringPromise(data);
    const samples: any[] = result.testResults.httpSample || [];
    if (samples.length === 0) {
      console.log('There are no results.');
      process.exit(0);
    }

    const responseTimes: number[] = samples.map((s: any) => parseInt(s.$.t));
    const errorCount: number = samples.filter((s: any) => s.$.s === 'false').length;
    const avg: number = Math.round(responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length);
    const max: number = Math.max(...responseTimes);
    const sorted: number[] = [...responseTimes].sort((a: number, b: number) => a - b);  
    const p95: number = sorted[Math.floor(sorted.length * 0.95)];
    const p99: number = sorted[Math.floor(sorted.length * 0.99)];

    // console.log(`📊News Page Load Tests Report (Jmeter):`);
    // console.log(`  Max response: ${max}ms`);
    // console.log(`  Average response time: ${avg}ms`);
    // console.log(`  95th percentile: ${p95}ms`);
    // console.log(`  99th percentile: ${p99}ms`);
    // console.log(`  Error requests: ${errorCount}`);

    console.log(`📊News Page Load Tests Report (Jmeter): \n
        Max response: ${max}ms \n
        Average response time: ${avg}ms \n
        95th percentile: ${p95}ms \n
        99th percentile: ${p99}ms \n
        Error requests: ${errorCount}`);

    const issues: string[] = [];
    if (max >= 5000) issues.push(`❌ Max response time is too high (>5000ms): ${max}`);
    if (avg >= 1500) issues.push(`❌ Average response time is too high (>1500ms): ${avg}`);
    if (errorCount !== 0) issues.push(`❌ There are errors while processing requests from JMeter`);

    if (issues.length > 0) {
      console.error(issues.join('\n'));
      process.exit(1);
    }

  } catch (err: any) {
    console.error(`Error while parsing results: ${err.message}`);
    process.exit(1);
  }
})();
