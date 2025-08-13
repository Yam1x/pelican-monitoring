import { Page } from '@playwright/test';

export class ImageCollector {
  static async collectImageUrls(page: Page): Promise<Set<string>> {
    const imageUrls = new Set<string>();

    page.on('response', async (response) => {
      const url = response.url();
      if (url.match(/\.(png|jpg|jpeg|svg|webp|gif)(\?|$)/i)) {
        imageUrls.add(url);
      }
    });

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

    return imageUrls;
  }

  static filterUrls(urls: Set<string>): string[] {
    return Array.from(urls).filter(url => 
      url.includes('cdn.chelzoo.ru') || url.includes('storage.yandexcloud.net')
    );
  }
}