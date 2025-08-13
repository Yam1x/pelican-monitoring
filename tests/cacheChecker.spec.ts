import { test, expect, chromium } from '@playwright/test';
import { writeFileSync } from 'fs';
import { CacheValidator, TestResult } from '../utils/cacheValidator';
import { ImageCollector } from '../utils/imageCollector';

test.describe('Image Cache Validation', () => {
  test('Validate cache headers for all images - strict mode', async ({}) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const results: TestResult[] = [];
    const failedUrls: string[] = [];

    await page.goto('https://chelzoo.ru', { waitUntil: 'networkidle' });
    const imageUrls = await ImageCollector.collectImageUrls(page);
    const filteredUrls = ImageCollector.filterUrls(imageUrls);

    for (const url of filteredUrls) {
      const decodedUrl = decodeURIComponent(url);
      const { type, expected } = CacheValidator.determineCacheType(url, decodedUrl);
      const header = CacheValidator.getCacheHeader(url);
      const passed = CacheValidator.validateCacheHeader(header, expected);

      results.push({ url, type, expected, header, passed });
      
      if (!passed) {
        failedUrls.push(url);
      }
    }

    writeFileSync('results.json', JSON.stringify(results, null, 2));
    CacheValidator.printReport(results);

    await browser.close();

    if (failedUrls.length > 0) {
      console.error('\n❌ Following URLs haven`t passed checks of cache-control:');
      failedUrls.forEach(url => console.error(`- ${url}`));
      throw new Error(`Test failed: ${failedUrls.length} from ${filteredUrls.length} URLs haven't passed cache-control`);
    }

    console.log('\n✅ All URLs have successfully passed checks of cache-control!');
  });
});