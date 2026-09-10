import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.setTimeout(90_000);
test('a reviewer can use the keyboard to reach work, source, résumé, and contact', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.getByRole('link', { name: 'Explore projects', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#selected-work$/);
  const work = page.getByRole('heading', { name: 'Selected work' });
  await expect(work).toBeInViewport();
  await page.getByRole('link', { name: 'Read E-commerce Bookstore case study' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('E-commerce Bookstore');
  await expect(page.getByRole('link', { name: 'Source code', exact: true })).toHaveAttribute(
    'href',
    'https://github.com/khoipn21/TMDT-main'
  );
  await expect(page.getByText(/Co-authored by Pham Ngoc Khoi and Cao Quoc Viet/)).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Résumé' })
    .click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
  await page.emulateMedia({ media: 'screen' });
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Contact', exact: true })
    .click();
  await expect(page.getByRole('link', { name: 'contact@khoipn.com' })).toHaveAttribute(
    'href',
    'mailto:contact@khoipn.com'
  );
});

test('theme preference survives navigation and reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Color theme' }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Color theme' })).toHaveValue('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('reduced motion keeps anchors, direct links, and history usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#selected-work');
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeInViewport();
  await page.getByRole('link', { name: 'Read E-commerce Bookstore case study' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('E-commerce Bookstore');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeInViewport();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('link', { name: 'Pham Ngoc Khoi, home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await page.getByRole('link', { name: 'Explore projects', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeInViewport();
});

test('content and missing-route recovery work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/projects/bookstore');
  await expect(page.getByRole('heading', { name: 'Contribution & credits' })).toBeVisible();
  await page.getByRole('link', { name: 'All projects', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Murmur Chatapp', exact: true })).toBeVisible();
  const response = await page.goto('/projects/not-a-project');
  expect(response?.status()).toBe(404);
  await page.getByRole('link', { name: 'Browse projects' }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await context.close();
});

test('primary pages remain usable between responsive breakpoints', async ({ page }) => {
  for (const width of [320, 700, 900, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/projects', '/contact', '/resume']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      );
    }
  }
});

test('primary pages have no automated WCAG A/AA violations across themes', async ({ page }) => {
  for (const theme of ['light', 'dark', 'mint']) {
    for (const route of [
      '/',
      '/projects',
      '/projects/bookstore',
      '/resume',
      '/contact',
      '/experience',
    ]) {
      await page.goto(route);
      await page.getByRole('combobox', { name: 'Color theme' }).selectOption(theme);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(result.violations, `${route} in ${theme}`).toEqual([]);
    }
  }
});
