export function shouldPreventNumberPaste(text: string, allowedRe: RegExp): boolean {
	return text.length > 0 && !allowedRe.test(text.trim());
}
