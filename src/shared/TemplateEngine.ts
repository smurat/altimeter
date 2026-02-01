/**
 * TemplateEngine - Helper for performing placeholder replacements in HTML templates
 */
export class TemplateEngine {
	/**
	 * Replaces placeholders in the format {{ name }} or {{name}} with provided values.
	 */
	static render(template: string, replacements: Record<string, string>): string {
		let result = template;
		for (const [key, value] of Object.entries(replacements)) {
			const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
			result = result.replace(regex, value);
		}
		return result;
	}
}
