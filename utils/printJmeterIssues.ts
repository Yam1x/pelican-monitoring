export function printJmeterIssues({
    max,
    avg,
    errorCount
}: {
    max: number;
    avg: number;
    errorCount: number;
}) {
    const issues: string[] = [];
    if (max >= 5000) issues.push(`❌ Max response time is too high (>5000ms): ${max}`);
    if (avg >= 1500) issues.push(`❌ Average response time is too high (>1500ms): ${avg}`);
    if (errorCount !== 0) issues.push(`❌ There are errors while processing requests from JMeter`);

    if (issues.length > 0) {
      console.error(issues.join('\n'));
      process.exit(1);
    }
}