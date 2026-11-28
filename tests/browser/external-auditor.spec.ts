import { expect, test } from '@playwright/test';
import { join } from 'node:path';
import { goToReturnPage, seedWorkspace, taxpayerId } from './fixtures';

const labels = [
	'External auditor or accredited tax agent',
	'External auditor or tax agent TIN',
	'Signing partner name (if the external auditor is a partnership)',
	'Signing partner TIN',
	'BIR accreditation number',
	'Accreditation issue date',
	'Accreditation expiry date'
];

for (const [code, pageNumber, firstItem, taxpayerClassification] of [
	['1702RT', 2, 55, 'N'],
	['1702MX', 2, 45, 'N'],
	['1702EX', 2, 45, 'N'],
	['1701', 4, 112, 'I']
] as const) {
	test(`${code} shows the standard auditor fields with its original item numbers`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1450 });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification }, []);
		await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
		await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 20000 });
		await goToReturnPage(page, pageNumber);
		const section = page.getByRole('region', { name: /External Auditor\/Accredited Tax Agent/i });
		await expect(section).toBeVisible();
		const items = section.locator('.paper-item-number');
		await expect(items).toHaveText(labels.map((_, index) => String(firstItem + index)), { timeout: 2000 });

		for (const [index, label] of labels.entries()) {
			const row = items.nth(index).locator('..');
			await expect(row.getByRole(index < 5 ? 'textbox' : 'group', { name: label, exact: true })).toBeVisible();
			await expect(row.getByText(label, { exact: true }).first()).toBeVisible();
		}

		for (const width of [1440, 390]) {
			await page.setViewportSize({ width, height: 1450 });
			const sidebar = page.locator('aside.sidebar');
			if (width === 390 && await sidebar.getAttribute('data-mobile-open') === 'true') {
				await page.getByRole('button', { name: 'Toggle sidebar', exact: true }).click();
				await page.keyboard.press('Escape');
			}
			await section.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
			await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
			const bounds = (await section.boundingBox())!;
			const footer = (await page.getByRole('button', { name: 'Save draft', exact: true }).boundingBox())!;
			expect(bounds.y + bounds.height).toBeLessThan(footer.y - 12);
			const positions = await Promise.all((await items.all()).map(item => item.boundingBox()));
			expect(positions[2]!.y).toBeGreaterThan(positions[0]!.y);
			expect(positions[4]!.y).toBeGreaterThan(positions[2]!.y);
			for (const [left, right] of [[0, 1], [2, 3], [4, 5], [5, 6]]) {
				const first = positions[left]!;
				const second = positions[right]!;
				if (width === 1440) {
					expect(Math.abs(first.y - second.y)).toBeLessThan(2);
					expect(second.x).toBeGreaterThan(first.x);
				} else {
					expect(second.y).toBeGreaterThan(first.y);
					expect(Math.abs(first.x - second.x)).toBeLessThan(2);
				}
			}
			if (width === 1440) {
				for (const [name, tin] of [[labels[0], labels[1]], [labels[2], labels[3]]]) {
					const nameBox = (await section.getByRole('textbox', { name, exact: true }).boundingBox())!;
					const tinBox = (await section.getByRole('textbox', { name: tin, exact: true }).boundingBox())!;
					expect(Math.abs(nameBox.y - tinBox.y)).toBeLessThan(2);
					expect(tinBox.x + tinBox.width).toBeLessThan(bounds.x + bounds.width - 8);
				}
			}
			for (const label of labels.slice(-2)) {
				const calendar = section.getByRole('group', { name: label, exact: true });
				expect((await calendar.boundingBox())!.width).toBeLessThanOrEqual(272);
			}
			const output = process.env.EBIRFORMS_AUDITOR_SCREENSHOTS;
			if (output) await section.screenshot({
				path: join(output, `${code.toLowerCase()}-external-auditor-${width}.png`),
				animations: 'disabled', caret: 'hide', scale: 'css'
			});
		}
	});
}

for (const [code, accreditation, issueDate, savedAccreditation] of [
	['1702RT', '01-000234-007-0026', 'frm1702RT:txtPg2Pt6I60IssueDate', {
		'frm1702RT:txtPg2Pt6I59BIR1': '01',
		'frm1702RT:txtPg2Pt6I59BIR2': '000234',
		'frm1702RT:txtPg2Pt6I59BIR3': '007',
		'frm1702RT:txtPg2Pt6I59BIR4': '0026'
	}],
	['1702MX', '010002340070026', 'frm1702MX:txtPg2Pt6I50IssueDate', {
		'frm1702MX:txtPg2Pt6I49BIRAccreditation': '010002340070026'
	}]
] as const) {
	test(`${code} saves and reopens the accreditation number and issue date`, async ({ page }) => {
		await seedWorkspace(page, 'light', 'loaded', { taxpayerClassification: 'N' }, []);
		const returns = `/ebirforms/taxpayers/${taxpayerId}/forms`;
		await page.goto(`${returns}/${code}?new=true`);
		await expect(page.getByRole('navigation', { name: 'Return pages' })).toBeVisible({ timeout: 20000 });
		await goToReturnPage(page, 2);
		const section = page.getByRole('region', { name: /External Auditor\/Accredited Tax Agent/i });
		const number = section.getByRole('textbox', { name: 'BIR accreditation number', exact: true });
		const date = section.getByRole('group', { name: 'Accreditation issue date', exact: true });
		await number.pressSequentially(accreditation.replaceAll('-', ''));
		await date.getByRole('spinbutton', { name: 'Year', exact: true }).fill('2024');
		await date.getByRole('spinbutton', { name: 'Month', exact: true }).fill('01');
		await date.getByRole('spinbutton', { name: 'Day', exact: true }).fill('15');
		await page.getByRole('button', { name: 'Save draft', exact: true }).click();
		await expect(page).toHaveURL(returns);
		const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
		expect(saved).toMatchObject({ ...savedAccreditation, [issueDate]: '01/15/2024' });
		await page.getByRole('link', { name: /^Edit BIR Form / }).click();
		await goToReturnPage(page, 2);
		await expect(number).toHaveValue(accreditation);
		await expect(date.getByRole('spinbutton', { name: 'Year', exact: true })).toHaveValue('2024');
		await expect(date.getByRole('spinbutton', { name: 'Month', exact: true })).toHaveValue('01');
		await expect(date.getByRole('spinbutton', { name: 'Day', exact: true })).toHaveValue('15');
	});
}
