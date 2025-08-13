import { execSync } from 'child_process';

export interface TestResult {
  url: string;
  type: string;
  expected: string;
  header: string;
  passed: boolean;
}

export class CacheValidator {
  static determineCacheType(url: string, decodedUrl: string): { type: string; expected: string } {
    if (url.includes('/_next/static/media/') || decodedUrl.includes('/_next/static/media/')) {
      return { type: 'Static Media', expected: 'max-age=31536000' };
    }
    if (url.includes('/_next/image') && url.includes('storage.yandexcloud.net')) {
      return { type: 'Dynamic Image (Yandex)', expected: 'max-age=3600' };
    }
    if (url.includes('/_next/image') && decodedUrl.includes('/_next/static/media/')) {
      return { type: 'Static Media (via Image Optimizer)', expected: 'max-age=31536000' };
    }
    return { type: 'Other Resource', expected: 'max-age=3600' };
  }

  static getCacheHeader(url: string): string {
    try {
      return execSync(`curl -s -I "${url}" | grep -i 'cache-control:' | tr -d '\r'`).toString().trim();
    } catch {
      return 'ERROR FETCHING HEADER';
    }
  }

  static validateCacheHeader(header: string, expected: string): boolean {
    return header.toLowerCase().includes(expected.toLowerCase());
  }

  static printReport(results: TestResult[]): void {
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
  }
}