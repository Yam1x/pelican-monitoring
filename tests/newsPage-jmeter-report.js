const fs = require('fs');
const xml2js = require('xml2js');

(async () => {
  const filePath = './result/documentsPage.jtl';
  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${filePath}`);
    process.exit(1);
  }
  const data = fs.readFileSync(filePath, 'utf8');
  if (data.trim() === '') {
    console.error(`Файл пуст: ${filePath}`);
    process.exit(1);
  }
  try {
    const result = await xml2js.parseStringPromise(data);
    const samples = result.testResults.httpSample || [];
    if (samples.length === 0) {
      console.log('Образцы не найдены в файле результатов.');
      process.exit(0);
    }
    const responseTimes = samples.map(s => parseInt(s.$.t));
    const errorCount = samples.filter(s => s.$.s === 'false').length;
    const avg = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length);
    const max = Math.max(...responseTimes);
    const sorted = [...responseTimes].sort((a, b) => a - b);
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];
    console.log(`📊 Отчет метрик для News Page:`);
    console.log(`  Максимальное время ответа: ${max}ms`);
    console.log(`  Среднее время ответа: ${avg}ms`);
    console.log(`  95-й процентиль: ${p95}ms`);
    console.log(`  99-й процентиль: ${p99}ms`);
    console.log(`  Ошибочные запросы: ${errorCount}`);
    if (max >= 10000) throw new Error(`❌ Максимальное время ответа слишком высокое: ${max}`);
    if (avg >= 1600) throw new Error(`❌ Среднее время ответа слишком высокое: ${avg}`);
    if (errorCount !== 0) throw new Error(`❌ Найдены ошибки в запросах JMeter`);
  } catch (err) {
    console.error(`Ошибка обработки результатов: ${err.message}`);
    process.exit(1);
  }
})();