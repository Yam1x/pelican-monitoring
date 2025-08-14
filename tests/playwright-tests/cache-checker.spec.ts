import { test, expect, Response } from '@playwright/test';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const CDN_HOST = 'cdn.chelzoo.ru';

enum ResourceKind {
  Static = 'Static Media',
  Dynamic = 'Dynamic Image (Yandex)',
}

const EXPECTED_CACHE: Record<ResourceKind, string> = {
  [ResourceKind.Static]: 'max-age=31536000',
  [ResourceKind.Dynamic]: 'max-age=3600',
};

interface TestResult {
  url: string;
  type: string;
  expected: string;
  header: string;
  passed: boolean;
}

interface BadCacheEntry {
  url: string;
  kind: ResourceKind;
  expected: string;
  header: string;
}

const hasCdn = (u: string): boolean => u.includes(CDN_HOST);

const isStaticMedia = (u: string): boolean =>
  decodeURIComponent(u).includes('/_next/static/media/');

const isDynamicImage = (u: string): boolean =>
  decodeURIComponent(u).includes('storage.yandexcloud.net');

const getCacheControlHeader = (url: string): string => {
  return execSync(
    `curl -s -I "${url}" | awk 'BEGIN{IGNORECASE=1}/^cache-control:/{print; exit}' | tr -d '\\r'`
  ).toString();
};

test.describe('Image Cache Validation', () => {
  test('Validate cache headers for all images (CDN-enforced)', async ({ page }) => {
    const imageUrls = new Set<string>();
    const results: TestResult[] = [];
    const uncheckedUrls: string[] = [];

    const badCdnUrls: string[] = [];
    const badCacheUrls: BadCacheEntry[] = [];

    page.on('response', (response: Response) => {
      const url = response.url();
      if (/\.(png|jpg|jpeg|svg|webp|avif|gif)(\?|$)/i.test(url)) {
        imageUrls.add(url);
      }
    });

    await page.goto('https://chelzoo.ru', { waitUntil: 'networkidle' });

    const elements = await page.$$('img, [style*="background-image"]');
    for (const el of elements) {
      const src = await el.evaluate((node: HTMLElement) => {
        if (node.tagName === 'IMG') return (node as HTMLImageElement).src;
        const style = window.getComputedStyle(node);
        const match = style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        return match ? match[1] : null;
      });
      if (src) imageUrls.add(src);
    }

    const toCheck: Array<{ url: string; kind: ResourceKind }> = [];
    for (const rawUrl of imageUrls) {
      const url = decodeURIComponent(rawUrl);
      const staticMedia = isStaticMedia(url);
      const dynamicImage = isDynamicImage(url);

      if (!staticMedia && !dynamicImage) continue;

      if (!staticMedia && !dynamicImage) {
        uncheckedUrls.push(rawUrl);
        continue;
      }

      if (!hasCdn(url)) {
        badCdnUrls.push(rawUrl);
        continue;
      }

      const kind = staticMedia ? ResourceKind.Static : ResourceKind.Dynamic;
      toCheck.push({ url: rawUrl, kind });
    }

    for (const { url, kind } of toCheck) {
      try {
        const header = getCacheControlHeader(url);
        const expected = EXPECTED_CACHE[kind];
        const passed = header.toLowerCase().includes(expected.toLowerCase());

        results.push({
          url,
          type: kind,
          expected,
          header: header || 'NO HEADER',
          passed,
        });

        if (!passed) {
          badCacheUrls.push({ url, kind, expected, header: header || 'NO HEADER' });
        }
      } catch {
        results.push({
          url,
          type: kind,
          expected: EXPECTED_CACHE[kind],
          header: 'ERROR FETCHING HEADER',
          passed: false,
        });
        badCacheUrls.push({
          url,
          kind,
          expected: EXPECTED_CACHE[kind],
          header: 'ERROR FETCHING HEADER',
        });
      }
    }

    const report = {
      summary: {
        totalCollected: imageUrls.size,
        checked: toCheck.length,
        unchecked: uncheckedUrls.length,
        badCdnCount: badCdnUrls.length,
        badCacheCount: badCacheUrls.length,
      },
      badCdnUrls,
      badCacheUrls,
      uncheckedUrls,
      results,
    };

    writeFileSync('results.json', JSON.stringify(report, null, 2));

    console.log('\n=== Cache Validation Report ===');
    for (const r of results) {
      console.log(`\n${r.passed ? '✅' : '❌'} ${r.type}: ${r.url}`);
      console.log(`   Expected: ${r.expected}`);
      console.log(`   Found:    ${r.header}`);
    }

    if (badCdnUrls.length) {
      console.log('\n=== URLs missing CDN (must include cdn.chelzoo.ru) ===');
      badCdnUrls.forEach((u) => console.log(`❌ ${u}`));
    }

    if (badCacheUrls.length) {
      console.log('\n=== URLs with wrong Cache-Control ===');
      badCacheUrls.forEach((e) =>
        console.log(`❌ ${e.kind}: ${e.url}\n   Expected: ${e.expected}\n   Found:    ${e.header}`)
      );
    }

    console.log('\n=== Summary ===');
    console.log(`Collected: ${imageUrls.size}`);
    console.log(`Unchecked: ${uncheckedUrls.length}`);
    console.log(`Checked:   ${toCheck.length}`);
    console.log(`No CDN:    ${badCdnUrls.length}`);
    console.log(`Bad Cache: ${badCacheUrls.length}`);

    expect(badCdnUrls.length === 0 && badCacheUrls.length === 0).toBeTruthy();
  });
});
