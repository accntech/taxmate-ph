import { expect, test } from '@playwright/test';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const cases = [
	{
		code: '1702RT',
		classification: 'N',
		pageNumber: 7,
		regionName: /^Schedule 11 - Stockholders/,
		labels: ['Stockholders', 'Partners', 'Members Information (Top 20 stockholders, partners or members)']
	},
	{
		code: '1700',
		classification: 'I',
		pageNumber: 1,
		regionName: 'Filing details',
		labels: ['Other income (II041)', 'Compensation income (II011)']
	}
] as const;

for (const { code, classification, pageNumber, regionName, labels } of cases) {
	test(`${code} checkbox labels use the normal form control size`, async ({ page }, info) => {
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: classification }, []);
		await page.setViewportSize({ width: 1280, height: 950 });
		await page.goto(`${formsPath}/${code}?new=true`);
		await goToReturnPage(page, pageNumber);
		const region = page.getByRole('region', { name: regionName });
		await expect(region).toBeVisible();
		const normalSize = await region.evaluate(element =>
			getComputedStyle(element).getPropertyValue('--form-control-size').trim()
		);

		for (const width of [1280, 390]) {
			await page.setViewportSize({ width, height: 950 });
			if (width === 390) {
				await page.keyboard.press('Escape');
				await expect.poll(async () => (await page.locator('aside.sidebar').boundingBox())!.x).toBeLessThan(-245);
			}
			for (const name of labels) {
				const checkbox = region.getByRole('checkbox', { name, exact: true });
				const label = checkbox.locator('xpath=ancestor::label[1]').getByText(name, { exact: true });
				await expect(label).toHaveCSS('font-size', normalSize);
				await expect(label).toBeVisible();
			}
			await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
			await region.screenshot({ path: info.outputPath(`${code}-checkbox-labels-${width}.png`), animations: 'disabled' });
		}

		const checkbox = region.getByRole('checkbox', { name: labels[0], exact: true });
		await checkbox.check();
		await expect(checkbox).toBeChecked();
		await checkbox.uncheck();
		await expect(checkbox).not.toBeChecked();
	});
}
