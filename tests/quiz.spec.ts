import { expect, test } from '@playwright/test';

test('kasutaja saab vastata küsimustele ja näha lõpptulemust', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Interaktiivne viktoriin' })).toBeVisible();
  await expect(page.getByText('Hetkeskoor: 0')).toBeVisible();

  await page.getByLabel('Tallinn').check();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await expect(page.getByText('Õige vastus!')).toBeVisible();
  await expect(page.getByText('Hetkeskoor: 1')).toBeVisible();
  await page.getByRole('button', { name: 'Järgmine küsimus' }).click();

  await page.getByLabel('Python').check();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await expect(page.getByText('Vale vastus. Õige oli: JavaScript')).toBeVisible();
  await expect(page.getByText('Hetkeskoor: 1')).toBeVisible();
  await page.getByRole('button', { name: 'Järgmine küsimus' }).click();

  await page.getByLabel('1024').check();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await expect(page.getByText('Õige vastus!')).toBeVisible();
  await page.getByRole('button', { name: 'Vaata tulemusi' }).click();

  await expect(page.getByRole('heading', { name: 'Viktoriin on lõppenud' })).toBeVisible();
  await expect(page.getByText('Skoor: 2/3')).toBeVisible();
  await expect(page.getByRole('table', { name: 'Tulemuste tabel' })).toBeVisible();
});