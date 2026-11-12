import { expect, test, type Page } from '@playwright/test';
import { formPath, seedWorkspace } from './fixtures';

const list = (page: Page) => page.getByRole('list', { name: 'ATC line items', exact: true });

test.beforeEach(async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1100 });
	await seedWorkspace(page);
	await page.addInitScript(() => {
		// Exercise pointer gestures even when the host intercepts native HTML dragging.
		window.addEventListener('dragstart', event => event.preventDefault(), true);
		const data = JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!);
		Object.assign(data.returns[0].values, { 'frm1601EQ:txtATC14': 'WI010', 'frm1601EQ:txtTaxBase14': '20000' });
		localStorage.setItem('ebirforms-created-returns-v1', JSON.stringify(data));
	});
	await page.goto(formPath);
	await expect(list(page).getByRole('listitem')).toHaveCount(2);
});

async function dragSecondUp(page: Page) {
	await list(page).scrollIntoViewIfNeeded();
	const source = await page.getByRole('button', { name: 'Drag line item 2', exact: true }).boundingBox();
	const target = await page.getByRole('button', { name: 'Drag line item 1', exact: true }).boundingBox();
	await page.mouse.move(source!.x + source!.width / 2, source!.y + source!.height / 2);
	await page.mouse.down();
	await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, { steps: 8 });
}

test('pointer dragging previews the new position and saves whole rows on release', async ({ page }, testInfo) => {
	await dragSecondUp(page);
	await expect(list(page).getByRole('listitem').first()).toContainText('WI010');
	await expect(page.getByRole('complementary', { name: 'Summary', exact: true })).toContainText('₱1,765.44');
	await page.screenshot({ path: testInfo.outputPath('drag-preview.png') });
	await page.mouse.up();
	await expect(page.getByRole('button', { name: 'Drag line item 1', exact: true })).toBeFocused();
	await page.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/forms$/);
	const values = await page.evaluate(() => JSON.parse(localStorage.getItem('ebirforms-created-returns-v1')!).returns[0].values);
	expect(values['frm1601EQ:txtATC13']).toBe('WI010');
	expect(values['frm1601EQ:txtTaxBase13']).toBe('20000');
	expect(values['frm1601EQ:txtTaxWithheld13']).toBe('1000.00');
	expect(values['frm1601EQ:txtATC14']).toBe('WI120');
});

test('downward dragging waits for the next row midpoint and can cross three items', async ({ page }) => {
	await page.getByRole('button', { name: 'Add line item', exact: true }).click();
	const editor = page.getByRole('dialog', { name: 'New line item', exact: true });
	await editor.getByRole('combobox', { name: 'ATC', exact: true }).click();
	await page.getByPlaceholder('Search code or income', { exact: true }).fill('WI011');
	await page.getByRole('option', { name: /^WI011 / }).click();
	await editor.getByRole('textbox', { name: 'Tax Base', exact: true }).fill('10000');
	await editor.getByRole('button', { name: 'Add', exact: true }).click();
	await expect(editor).toBeHidden();
	await expect(list(page).getByRole('listitem')).toHaveCount(3);
	await list(page).scrollIntoViewIfNeeded();
	const first = await list(page).getByRole('listitem').first().boundingBox();
	const third = await list(page).getByRole('listitem').last().boundingBox();
	const grip = await page.getByRole('button', { name: 'Drag line item 1', exact: true }).boundingBox();
	const x = grip!.x + grip!.width / 2;
	await page.mouse.move(x, grip!.y + grip!.height / 2);
	await page.mouse.down();
	await page.mouse.move(x, first!.y + first!.height / 2 + 8, { steps: 4 });
	await expect(list(page).getByRole('listitem').first()).toContainText('WI120');
	await page.mouse.move(x, third!.y + third!.height / 2 + 8, { steps: 8 });
	await expect(list(page).getByRole('listitem').last()).toContainText('WI120');
	await page.mouse.up();
	await expect(list(page).getByRole('listitem').first()).toContainText('WI010');
});

test('Escape cancels a drag preview without changing the saved row order', async ({ page }) => {
	await dragSecondUp(page);
	await expect(list(page).getByRole('listitem').first()).toContainText('WI010');
	await page.keyboard.press('Escape');
	await page.mouse.up();
	await expect(list(page).getByRole('listitem').first()).toContainText('WI120');
	await expect(page.getByRole('dialog')).toBeHidden();
});

test('scrolling cancels a drag instead of committing against stale row positions', async ({ page }) => {
	await dragSecondUp(page);
	await expect(list(page).getByRole('listitem').first()).toContainText('WI010');
	await page.mouse.wheel(0, 200);
	await expect(list(page).getByRole('listitem').first()).toContainText('WI120');
	await page.mouse.up();
});

test('keyboard reordering moves the same row element with a position animation', async ({ page }) => {
	const original = await list(page).getByRole('listitem').first().elementHandle();
	await page.getByRole('button', { name: 'Drag line item 1', exact: true }).press('ArrowDown');
	expect(await original!.textContent()).toContain('WI120');
	await expect.poll(() => original!.evaluate(element => element.getAnimations().some(animation =>
		animation.playState === 'running' && (animation.effect as KeyframeEffect).getKeyframes().some(frame => frame.transform && frame.transform !== 'none')
	))).toBe(true);
	await expect(list(page).getByRole('listitem').last()).toContainText('WI120');
});

test('reduced motion reorders immediately without a movement animation', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const original = await list(page).getByRole('listitem').first().elementHandle();
	await page.getByRole('button', { name: 'Drag line item 1', exact: true }).press('ArrowDown');
	await expect(list(page).getByRole('listitem').last()).toContainText('WI120');
	expect(await original!.evaluate(element => element.getAnimations().filter(animation => animation.playState === 'running'))).toHaveLength(0);
});
