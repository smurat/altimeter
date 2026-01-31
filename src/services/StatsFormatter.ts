export interface TrendRow {
	date: string;
	input: number;
	output: number;
	cache: number;
}

export class StatsFormatter {
	static formatTrendTable(title: string, rows: TrendRow[]): string {
		const lines: string[] = [];
		lines.push(`\n${title}`);
		lines.push('─'.repeat(65));
		lines.push(
			`${'Date'.padEnd(12)} | ${'Input'.padStart(12)} | ${'Output'.padStart(12)} | ${'Cache'.padStart(7)}%`,
		);
		lines.push('─'.repeat(65));

		let totalIn = 0,
			totalOut = 0,
			totalCache = 0;
		for (const row of rows) {
			const input = row.input;
			const eff = input > 0 ? Math.round((row.cache / input) * 100) : 0;
			totalIn += input;
			totalOut += row.output;
			totalCache += row.cache;
			lines.push(
				`${row.date.padEnd(12)} | ${input.toLocaleString().padStart(12)} | ` +
					`${row.output.toLocaleString().padStart(12)} | ${eff.toString().padStart(7)}%`,
			);
		}

		const totalEff = totalIn > 0 ? Math.round((totalCache / totalIn) * 100) : 0;
		lines.push('─'.repeat(65));
		lines.push(
			`${'TOTAL'.padEnd(12)} | ${totalIn.toLocaleString().padStart(12)} | ` +
				`${totalOut.toLocaleString().padStart(12)} | ${totalEff.toString().padStart(7)}%`,
		);
		lines.push('═'.repeat(65));
		return lines.join('\n');
	}
}
