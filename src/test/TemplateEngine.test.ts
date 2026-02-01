import { expect } from 'chai';
import { TemplateEngine } from '../shared/TemplateEngine';

suite('TemplateEngine Test Suite', () => {
	test('should replace simple placeholders', () => {
		const template = 'Hello {{name}}!';
		const result = TemplateEngine.render(template, { name: 'World' });
		expect(result).to.equal('Hello World!');
	});

	test('should handle placeholders with flexible spacing', () => {
		const template = '{{  csp  }} - {{chartJsUri}} - {{ colorsJson }}';
		const replacements = {
			csp: 'POLICY',
			chartJsUri: 'URI',
			colorsJson: '{}',
		};
		const result = TemplateEngine.render(template, replacements);
		expect(result).to.equal('POLICY - URI - {}');
	});

	test('should replace all occurrences of a placeholder', () => {
		const template = '{{val}} {{val}} {{val}}';
		const result = TemplateEngine.render(template, { val: 'x' });
		expect(result).to.equal('x x x');
	});

	test('should not affect other text', () => {
		const template = 'Stay {{status}}. Do not change.';
		const result = TemplateEngine.render(template, { status: 'safe' });
		expect(result).to.equal('Stay safe. Do not change.');
	});
});
