export function printJmeterReport({
    pageName,
    max,
    avg,
    p95,
    p99,
    errorCount,
    totalBytes,
    totalKB,
    totalMB
}: {
    pageName: string,
    max: number,
    avg: number,
    p95: number,
    p99: number,
    errorCount: number,
    totalBytes: number,
    totalKB: string,
    totalMB: string 
}) {
    console.log(`📊${pageName} Load Tests Report (Jmeter): \n
        ⏱ Max response: ${max}ms \n
        ⏱ Average response time: ${avg}ms \n
        ⏱ 95th percentile: ${p95}ms \n
        ⏱ 99th percentile: ${p99}ms \n
        ❗Error requests: ${errorCount} \n
        Total transferred: ${totalBytes} bytes (${totalKB} KB / ${totalMB} MB)`);
}