import { test, expect, chromium } from '@playwright/test';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

interface TestResult {
  url: string;
  type: string;
  expected: string;
  header: string;
  passed: boolean;
}

test.describe('Image Cache Validation', () => {
  test('Validate cache headers for all images', async ({}) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const imageUrls = new Set<string>();
    const results: TestResult[] = [];
    let hasErrors = false;

    page.on('response', async (response) => {
      const url = response.url();
      if (url.match(/\.(png|jpg|jpeg|svg|webp|gif)(\?|$)/i)) {
        imageUrls.add(url);
      }
    });

    await page.goto('https://chelzoo.ru', { waitUntil: 'networkidle' });

    const elements = await page.$$('img, [style*="background-image"]');
    for (const el of elements) {
      const src = await el.evaluate((node) => {
        if (node.tagName === 'IMG') return (node as HTMLImageElement).src;
        const style = window.getComputedStyle(node);
        const match = style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        return match ? match[1] : null;
      });
      if (src) imageUrls.add(src);
    }

    const filteredUrls = Array.from(imageUrls).filter(url => 
      url.includes('cdn.chelzoo.ru') || url.includes('storage.yandexcloud.net')
    );
    // Отслеживать, чтобы обязательно присутствовал cdn.chelzoo.ru в урле картинок и подумать над условием

    for (const url of filteredUrls) {
      const decodedUrl = decodeURIComponent(url);
      let type: string;
      let expected: string;

      if (url.includes('/_next/static/media/') || decodedUrl.includes('/_next/static/media/')) {
        type = 'Static Media';
        expected = 'max-age=31536000';
      } else if (url.includes('/_next/image') && url.includes('storage.yandexcloud.net')) {
        type = 'Dynamic Image (Yandex)';
        expected = 'max-age=3600';
      } else if (url.includes('/_next/image') && decodedUrl.includes('/_next/static/media/')) {
        type = 'Static Media (via Image Optimizer)';
        expected = 'max-age=31536000';
      } else {
        type = 'Other Resource';
        expected = 'max-age=3600';
      }

      try {
        const header = execSync(`curl -s -I "${url}" | grep -i 'cache-control:' | tr -d '\r'`).toString();
        const passed = header.toLowerCase().includes(expected.toLowerCase());
        
        results.push({
          url,
          type,
          expected,
          header: header || 'NO HEADER',
          passed
        });

        if (!passed) hasErrors = true;
      } catch (error) {
        results.push({
          url,
          type,
          expected,
          header: 'ERROR FETCHING HEADER',
          passed: false
        });
        hasErrors = true;
      }
    }

    writeFileSync('results.json', JSON.stringify(results, null, 2));

    console.log('\n=== Cache Validation Report ===');
    results.forEach(result => {
      console.log(`\n${result.passed ? '✅' : '❌'} ${result.type}: ${result.url}`);
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Found:    ${result.header}`);
    });

    console.log('\n=== Summary ===');
    console.log(`Total URLs checked: ${results.length}`);
    console.log(`Passed: ${results.filter(r => r.passed).length}`);
    console.log(`Failed: ${results.filter(r => !r.passed).length}`);

    await browser.close();
    expect(hasErrors).toBeFalsy();
  });
});