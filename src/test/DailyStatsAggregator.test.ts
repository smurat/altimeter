import { expect } from 'chai';
import { DailyStatsAggregator } from '../services/DailyStatsAggregator';

suite('DailyStatsAggregator Test Suite', () => {
	test('should filter cascades by modified date', () => {
		const now = new Date();
		const old = new Date();
		old.setDate(old.getDate() - 10);

		const cascades = [
			{ cascadeId: 'recent', lastModifiedTime: now.toISOString() },
			{ cascadeId: 'old', lastModifiedTime: old.toISOString() },
		];

		const filtered = DailyStatsAggregator.filterByModifiedDate(cascades, 8);
		expect(filtered).to.have.lengthOf(1);
		expect(filtered[0].cascadeId).to.equal('recent');
	});

	test('should aggregate metadata by day', () => {
		const today = new Date().toISOString();
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayStr = yesterday.toISOString();

		const metadata = [
			{
				timestamp: today,
				chatModel: {
					model: 'MODEL_PLACEHOLDER_M18',
					usage: { inputTokens: 100, outputTokens: 50, cacheReadTokens: 20 },
				},
			},
			{
				timestamp: yesterdayStr,
				chatModel: {
					model: 'MODEL_PLACEHOLDER_M18',
					usage: { inputTokens: 200, outputTokens: 100, cacheReadTokens: 40 },
				},
			},
		];

		const stats = DailyStatsAggregator.aggregateByDay(metadata, 2);
		expect(stats).to.have.lengthOf(2);

		const todayStats = stats.find((s) => s.date === today.split('T')[0]);
		expect(todayStats?.totals.inputTokens).to.equal(100);
		// formula: 20 / (100 + 20) = 16.66% -> 17%
		expect(todayStats?.cacheEfficiency).to.equal(17);

		const yesterdayStats = stats.find((s) => s.date === yesterdayStr.split('T')[0]);
		expect(yesterdayStats?.totals.inputTokens).to.equal(200);
		// formula: 40 / (200 + 40) = 16.66% -> 17%
		expect(yesterdayStats?.cacheEfficiency).to.equal(17);
	});

	test('should handle missing metadata fields gracefully', () => {
		const metadata = [
			{
				timestamp: new Date().toISOString(),
				chatModel: {
					model: 'unknown',
					// usage missing
				},
			},
		];

		const stats = DailyStatsAggregator.aggregateByDay(metadata, 1);
		expect(stats[0].totals.inputTokens).to.equal(0);
		expect(stats[0].models['unknown']).to.exist;
	});
});
