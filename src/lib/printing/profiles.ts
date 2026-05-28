export type PrintPaperSize = 'letter' | 'a4' | 'long'

export type PrintProfile = {
	size: PrintPaperSize
	label: string
	width: string
	height: string
	margin: string
	scale: string
	cssClass: string
}

export const printProfiles: PrintProfile[] = [
	{
		size: 'letter',
		label: 'Letter',
		width: '8.5in',
		height: '11in',
		margin: '0.55in 0.45in',
		scale: '0.75',
		cssClass: 'print-paper-letter'
	},
	{
		size: 'a4',
		label: 'A4',
		width: '210mm',
		height: '297mm',
		margin: '12mm 10mm',
		scale: '0.74',
		cssClass: 'print-paper-a4'
	},
	{
		size: 'long',
		label: 'Long',
		width: '8.5in',
		height: '13in',
		margin: '0.55in 0.45in',
		scale: '0.82',
		cssClass: 'print-paper-long'
	}
]

export function getPrintProfile(size: unknown): PrintProfile {
	return printProfiles.find((profile) => profile.size === size) ?? printProfiles[0]
}
