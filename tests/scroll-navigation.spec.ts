import { expect, test } from '@playwright/test';

test('scrolling preserves access to hero and final project links', async ({ page }, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'desktop') {
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  } else {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true
    );
  }
  await page.getByRole('link', { name: 'Explore projects', exact: true }).click();
  await expect(page).toHaveURL(/#selected-work$/);
  const lastProject = page.getByRole('link', { name: 'Read CodexBar Linux Port case study' });
  if (testInfo.project.name === 'desktop') {
    await lastProject.focus();
    await expect(lastProject).toBeInViewport();
    await page.keyboard.press('Enter');
  } else {
    await lastProject.scrollIntoViewIfNeeded();
    await expect(lastProject).toBeInViewport();
    await lastProject.tap();
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CodexBar Linux Port');
});
