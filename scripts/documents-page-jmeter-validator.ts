import { 
  readJmeterResultFile,
  parseJmeterResults,
  getMetrics,
  calculateTotalDataSize,
  printJmeterReport,
  printJmeterIssues
} from "../utils";

(async () => {
  const data = readJmeterResultFile('./result/documents-page.jtl');

  try {
    const samples = await parseJmeterResults(data);

    const {
      errorCount,
      avg,
      max,
      p95,
      p99
    } = getMetrics(samples);

    const { 
      totalBytes,
      totalKB,
      totalMB
    } = calculateTotalDataSize(samples);

    printJmeterReport({
      pageName: 'Documents Page',
      errorCount,
      avg,
      max,
      p95,
      p99,
      totalBytes,
      totalKB,
      totalMB
    });

    printJmeterIssues({
      max,
      avg,
      errorCount
    })
  } catch (err: any) {
    console.error(`Error while parsing results: ${err.message}`);
    process.exit(1);
  }
})();
