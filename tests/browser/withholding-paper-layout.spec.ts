import { expect, test } from '@playwright/test';
import { withholdingDefinitions } from '../../src/lib/forms/withholding-definitions';
import { seedWorkspace, taxpayerId } from './fixtures';

const codes = withholdingDefinitions.map(({ code }) => code).filter(code => !['0605', '0619E', '0619F'].includes(code));

for (const code of ['0605', '0619E', '0619F']) {
	test(`${code} has one continuous rule above Part I`, async ({ page }) => {
		await seedWorkspace(page);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const period = page.getByRole('region', { name: 'Return period', exact: true });
		const heading = page.getByRole('region', { name: 'Taxpayer information', exact: true }).locator('header');
		for (const width of [1440, 850, 390, 320]) {
			await page.setViewportSize({ width, height: 960 });
			await expect(period).toHaveCSS('border-bottom-width', '1px');
			await expect(period.locator(':scope > :last-child')).toHaveCSS('border-bottom-width', '0px');
			await expect(heading).toHaveCSS('border-top-width', '0px');
			if (code === '0605' && width === 1440) {
				await expect(period.locator('.year-end')).toHaveCSS('border-top-width', '1px');
				await expect(period.locator('.year-end')).toHaveCSS('border-left-width', '0px');
			}
		}
	});
}

for (const code of codes) {
	test(`${code} opens a responsive paper form with the printed section order`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 960 });
		await seedWorkspace(page);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		const sheet = page.locator('.paper-sheet');
		const header = sheet.locator('header').first();
		const title = header.getByRole('heading', { level: 1 });
		await expect(title).toBeVisible({ timeout: 3000 });
		const period = sheet.getByRole('region', { name: 'Return period', exact: true });
		const taxpayer = sheet.getByRole('region', { name: 'Taxpayer information', exact: true });
		const partTwo = sheet.getByRole('region', { name: /^Part II ·/ });
		await expect(period).toBeVisible();
		await expect(taxpayer.getByRole('heading', { name: 'Part I · Background Information' })).toBeVisible();
		await expect(partTwo).toBeVisible();
		await expect(sheet.getByRole('heading', { level: 1 })).toHaveCount(1);
		for (const width of [1440, 390, 320]) {
			await page.setViewportSize({ width, height: 960 });
			await page.evaluate(() => document.fonts.ready);
			const [heading, masthead, periodBox, taxpayerBox, secondPart] = await Promise.all(
				[title, header, period, taxpayer, partTwo].map(locator => locator.boundingBox())
			);
			expect(Math.abs(heading!.x + heading!.width / 2 - masthead!.x - masthead!.width / 2)).toBeLessThan(1);
			expect(periodBox!.y).toBeLessThan(taxpayerBox!.y);
			expect(taxpayerBox!.y).toBeLessThan(secondPart!.y);
			const overflow = await sheet.evaluate(element => {
				const bounds = element.getBoundingClientRect();
				return [...element.querySelectorAll<HTMLElement>('input:not([type=radio]), [role=combobox], output, summary')]
					.filter(control => {
						const box = control.getBoundingClientRect();
						return box.width > 0 && (box.left < bounds.left - 1 || box.right > bounds.right + 1);
					})
					.map(control => control.id || control.textContent?.trim());
			});
			expect(overflow).toEqual([]);
			const profileGrid = await taxpayer.locator('.profile-grid').evaluate(grid => {
				const { left, right } = grid.getBoundingClientRect();
				const rows = new Map<number, DOMRect[]>();
				for (const child of grid.children) {
					const box = child.getBoundingClientRect();
					const top = Math.round(box.top);
					const row = rows.get(top) ?? [];
					row.push(box);
					rows.set(top, row);
				}
				const cellsByRow = [...rows.values()];
				const incompleteRows = cellsByRow.filter((row, index, all) => {
					if (Math.abs(row[0].left - left) > 1 || Math.abs(row.at(-1)!.right - right) > 1) return true;
					const columnGaps = row.slice(1).map((cell, column) => cell.left - row[column].right);
					const preceding = all[index - 1];
					const rowGap = preceding ? row[0].top - preceding[0].bottom : 1;
					return [...columnGaps, rowGap].some(gap => Math.abs(gap - 1) > 0.25);
				}).length;
				return { incompleteRows, widestRow: Math.max(...cellsByRow.map(row => row.length)) };
			});
			expect(profileGrid.incompleteRows, 'background rows fill the sheet with a single divider between adjacent cells').toBe(0);
			if (width === 1440) {
				expect(profileGrid.widestRow).toBeGreaterThanOrEqual(3);
			} else {
				expect(profileGrid.widestRow).toBe(1);
			}
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
		}
	});
}
