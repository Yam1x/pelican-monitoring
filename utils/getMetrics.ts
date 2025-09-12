export function getMetrics(samples: any[]) {
    const responseTimes: number[] = samples.map((s: any) => parseInt(s.$.t));
    const errorCount: number = samples.filter((s: any) => s.$.s === 'false').length;
    const avg = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
    const max = Math.max(...responseTimes);
    const sorted = [...responseTimes].sort((a, b) => a - b);  
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return {
        errorCount,
        avg,
        max,
        p95,
        p99
    }
}