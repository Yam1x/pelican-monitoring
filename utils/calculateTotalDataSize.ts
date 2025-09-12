export function calculateTotalDataSize(samples: any[]) {
    const totalBytes: number = samples
        .map((s: any) => parseInt(s.$.by || '0', 10))
        .reduce((a, b) => a + b, 0);
    const totalKB = (totalBytes / 1024).toFixed(2);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

    return {
      totalBytes,
      totalKB,
      totalMB
    }
}