import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

const code = '0619E';
const prefix = 'frm0619E:';
const draftId = 'month-year-draft';
const formsPath = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const returnPath = `${formsPath}/${code}?return=${draftId}`;

async function openMonthlyDraft(page: import('@playwright/test').Page) {
	await page.routeWebSocket('**/*', socket => socket.close());
	await seedWorkspace(page, 'light', 'loaded', {}, [{
		id: draftId, taxpayerId, formCode: code, returnPeriod: '2025-06',
		status: 'Draft', updatedAt: 1794441600000, finalFlag: '0',
		values: { [prefix + 'txtMonth']: '06', [prefix + 'txtYear']: '2025' }
	}]);
	await page.goto(returnPath);
	const field = page.getByRole('group', { name: 'For the month', exact: true });
	return {
		field,
		month: field.getByRole('spinbutton', { name: 'Month', exact: true }),
		year: field.getByRole('spinbutton', { name: 'Year', exact: true })
	};
}

test('the filing period uses DateInput’s tab order and advances after typing a month', async ({ page }, testInfo) => {
	const { field, month, year } = await openMonthlyDraft(page);
	const toggle = field.getByRole('button', { name: 'Choose month and year' });
	const dueDate = page.getByRole('group', { name: 'Due date', exact: true });
	for (const property of ['background-color', 'min-height', 'padding-inline', 'font-size']) {
		await expect(field).toHaveCSS(property, await dueDate.evaluate((element, property) => getComputedStyle(element).getPropertyValue(property), property));
	}
	await expect(month).toHaveValue('06');
	await expect(year).toHaveValue('2025');

	await month.focus();
	await page.keyboard.press('Tab');
	await expect(year).toBeFocused();
	await page.keyboard.press('Shift+Tab');
	await expect(month).toBeFocused();
	await month.pressSequentially('7');
	await expect(month).toHaveValue('07');
	await expect(year).toBeFocused();
	await year.pressSequentially('2024');
	await expect(year).toHaveValue('2024');
	await year.press('Backspace');
	await expect(year).toHaveValue('202');
	await year.pressSequentially('4');
	await expect(year).toHaveValue('2024');
	await year.press('ArrowLeft');
	await expect(month).toBeFocused();
	await month.pressSequentially('12');
	await expect(year).toBeFocused();
	await year.press('ArrowDown');
	await expect(year).toHaveValue('2023');
	await year.press('ArrowLeft');
	await month.press('ArrowUp');
	await expect(month).toHaveValue('01');
	await expect(year).toHaveValue('2023');
	await month.press('ArrowDown');
	await expect(month).toHaveValue('12');
	await year.focus();
	await field.screenshot({ path: testInfo.outputPath('native-year-segment.png') });
	await page.keyboard.press('Tab');
	await expect(toggle).toBeFocused();

	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(formsPath);
	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
	await expect(month).toHaveValue('12');
	await expect(year).toHaveValue('2023');
});

test('the filing period supports whole-period paste and returns focus after using the picker', async ({ page }) => {
	const { month, year } = await openMonthlyDraft(page);
	await month.focus();
	await page.keyboard.insertText('07/20251');
	await month.press('Enter');
	await expect(month).toHaveValue('07');
	await expect(month).toHaveAttribute('aria-invalid', 'true');
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(formsPath);
	const values = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	expect(values).toMatchObject({ [prefix + 'txtMonth']: '07', [prefix + 'txtYear']: '' });

	await page.getByRole('link', { name: /^Edit BIR Form / }).click();
	await expect(month).toHaveValue('07');
	await expect(year).toHaveValue('');
	await month.focus();
	await page.keyboard.insertText('022025');
	await expect(month).toHaveValue('02');
	await expect(year).toHaveValue('2025');
	await year.press('Alt+ArrowDown');
	const picker = page.getByRole('dialog', { name: 'Choose month and year' });
	await expect(picker).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(year).toBeFocused();
	await year.press('Alt+ArrowDown');
	await picker.getByRole('button', { name: 'November 2025' }).click();
	await expect(picker).toHaveCount(0);
	await expect(month).toHaveValue('11');
	await expect(year).toHaveValue('2025');
	await expect(year).toBeFocused();
});

for (const theme of ['light', 'dark']) {
	test(`native date segments and their picker keep visible focus in ${theme}`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width: theme === 'light' ? 1440 : 390, height: 900 });
		await seedWorkspace(page, theme, 'loaded', { taxpayerClassification: 'N' });
		await page.goto(`${formsPath}/1702RTv2018C?new=true`);
		const field = page.getByRole('group', { name: 'Year ended', exact: true });
		const month = field.getByRole('spinbutton', { name: 'Month', exact: true });
		const year = field.getByRole('spinbutton', { name: 'Year', exact: true });
		const toggle = field.getByRole('button', { name: 'Choose month and year' });

		await month.focus();
		await expect(month).toHaveCSS('background-color', await field.evaluate(element => {
			const probe = document.createElement('span');
			probe.style.backgroundColor = 'var(--accent)';
			element.appendChild(probe);
			const color = getComputedStyle(probe).backgroundColor;
			probe.remove();
			return color;
		}));
		await expect(month).toHaveCSS('box-shadow', 'none');
		await expect(field).not.toHaveCSS('box-shadow', 'none');
		await page.keyboard.press('Tab');
		await expect(year).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(toggle).toBeFocused();
		await toggle.press('Enter');
		const picker = page.getByRole('dialog', { name: 'Choose month and year' });
		await expect(picker.getByRole('button', { pressed: true })).toBeFocused();
		const january = picker.getByRole('button', { name: /^January / });
		await january.focus();
		await expect(january).toBeFocused();
		await expect(january).toHaveCSS('box-shadow', /0px 0px 0px 3px/);
		await january.press('ArrowDown');
		await expect(picker.getByRole('button', { name: /^April / })).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(toggle).toBeFocused();

		await page.emulateMedia({ forcedColors: 'active' });
		await year.focus();
		await expect(field).toHaveCSS('outline-style', 'solid');
		await year.press('Alt+ArrowDown');
		await january.focus();
		await expect(january).toBeFocused();
		await expect(january).toHaveCSS('outline-style', 'solid');
		await picker.screenshot({ path: testInfo.outputPath(`forced-colors-${theme}.png`) });
	});
}

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
	test(`the month picker respects ${reducedMotion} motion preferences`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion });
		const { field } = await openMonthlyDraft(page);
		const toggle = field.getByRole('button', { name: 'Choose month and year' });
		const popup = page.locator('[popover="manual"][aria-label="Choose month and year"]');
		const durations = () => popup.evaluate(element => element.getAnimations().map(animation => animation.effect?.getTiming().duration));
		await toggle.press('Enter');
		await expect(popup).toBeVisible();
		if (reducedMotion === 'no-preference') {
			await expect.poll(durations).toContain(180);
			await popup.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
		} else {
			expect(await durations()).toEqual([]);
		}

		await page.keyboard.press('Escape');
		await expect(toggle).toBeFocused();
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		if (reducedMotion === 'no-preference') await expect.poll(durations).toContain(120);
		await expect(popup).toHaveCount(0);
	});
}

test('the calendar button opens on the selected month and restores focus when the picker closes', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const { field, month } = await openMonthlyDraft(page);
	const toggle = field.getByRole('button', { name: 'Choose month and year', exact: true });
	const picker = page.getByRole('dialog', { name: 'Choose month and year' });

	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-expanded', 'true');
	await expect(picker.getByRole('button', { name: 'June 2025', exact: true })).toBeFocused();
	await picker.getByRole('button', { name: 'December 2025', exact: true }).focus();
	await page.keyboard.press('Tab');
	await expect(picker.getByRole('button', { name: 'Previous year', exact: true })).toBeFocused();
	await page.keyboard.press('Shift+Tab');
	await expect(picker.getByRole('button', { name: 'December 2025', exact: true })).toBeFocused();

	await toggle.click();
	await expect(picker).toHaveCount(0);
	await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	await expect(toggle).toBeFocused();
	await toggle.press('Enter');
	await picker.getByRole('button', { name: 'July 2025', exact: true }).click();
	await expect(month).toHaveValue('07');
	await expect(toggle).toBeFocused();

	await toggle.press('Enter');
	await expect(picker.getByRole('button', { name: 'July 2025', exact: true })).toBeFocused();
	const dueDate = page.getByRole('group', { name: 'Due date', exact: true });
	const dueMonth = dueDate.getByRole('spinbutton', { name: 'Month', exact: true });
	await dueMonth.click();
	await expect(picker).toHaveCount(0);
	await expect(dueMonth).toBeFocused();

	const dateToggle = dueDate.getByRole('button', { name: 'Open calendar', exact: true });
	await dateToggle.press('Enter');
	const datePicker = page.getByRole('dialog', { name: 'Choose date', exact: true });
	const date = datePicker.getByRole('gridcell').and(datePicker.locator('[tabindex="0"]'));
	await expect(date).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(datePicker.getByRole('button', { name: 'Previous month', exact: true })).toBeFocused();
	await page.keyboard.press('Shift+Tab');
	await expect(date).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(dateToggle).toBeFocused();
});
