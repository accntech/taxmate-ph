const xmlDeclaration = '<?xml version=\'1.0\'?>'
const legacyFooter = 'All Rights Reserved BIR 2012.0'

const escapedCharacters: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&apos;'
}

const unescapedEntities: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: '\''
}

export function serializeLegacyXml(fields: Record<string, string | boolean | number>): string {
	const records = Object.entries(fields)
		.map(([id, value]) => {
			const escapedId = escapeXmlText(id)
			const escapedValue = escapeXmlText(String(value))

			return `<div>${escapedId}=${escapedValue}${escapedId}=</div>`
		})
		.join('')

	return `${xmlDeclaration}${records}${legacyFooter}`
}

export function parseLegacyXml(xml: string): Record<string, string> {
	const fields: Record<string, string> = {}
	const recordPattern = /<div>([\s\S]*?)<\/div>/g

	for (const [, content] of xml.matchAll(recordPattern)) {
		const firstSeparator = content.indexOf('=')

		if (firstSeparator < 1) {
			continue
		}

		const id = unescapeXmlText(content.slice(0, firstSeparator))
		const legacyTerminator = `${content.slice(0, firstSeparator)}=`
		const lastTerminator = content.lastIndexOf(legacyTerminator)

		if (lastTerminator <= firstSeparator) {
			continue
		}

		fields[id] = unescapeXmlText(content.slice(firstSeparator + 1, lastTerminator))
	}

	return fields
}

function escapeXmlText(text: string): string {
	return text.replace(/[&<>"']/g, (character) => escapedCharacters[character])
}

function unescapeXmlText(text: string): string {
	return text.replace(/&([a-z]+);/g, (entity, name: string) => {
		return unescapedEntities[name] ?? entity
	})
}
