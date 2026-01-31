/**
 * DailyStatsAggregator - Aggregates token usage statistics by day
 *
 * Design: Pure business logic, no I/O. Takes raw metadata and returns
 * aggregated daily stats for chart visualization.
 */

import { getModelDisplayName } from '../shared/ModelCatalog';
import { DailyModelStats } from '../shared/types';

interface CascadeTrajectory {
	cascadeId: string;
	lastModifiedTime?: string;
}

interface MetadataItem {
	chatModel?: {
		model?: string;
		usage?: {
			model?: string;
			inputTokens?: string | number;
			outputTokens?: string | number;
			cacheReadTokens?: string | number;
		};
	};
	timestamp?: string;
}

export class DailyStatsAggregator {
	/**
	 * Filters cascades to only those modified within the cutoff period.
	 */
	static filterByModifiedDate(
		cascades: CascadeTrajectory[],
		cutoffDays: number,
	): CascadeTrajectory[] {
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - cutoffDays);
		cutoffDate.setHours(0, 0, 0, 0);

		return cascades.filter((c) => {
			if (!c.lastModifiedTime) {
				return false;
			}
			const modified = new Date(c.lastModifiedTime);
			return modified >= cutoffDate;
		});
	}

	/**
	 * Aggregates metadata items into daily stats grouped by model.
	 */
	static aggregateByDay(allMetadata: MetadataItem[], dayCount: number = 8): DailyModelStats[] {
		const dailyMap = new Map<string, DailyModelStats>();

		// Initialize days
		for (let i = 0; i < dayCount; i++) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateStr = this.formatDate(date);
			dailyMap.set(dateStr, this.createEmptyDayStats(dateStr));
		}

		// Process each metadata item
		for (const item of allMetadata) {
			const dateStr = this.extractDateFromItem(item);
			if (!dateStr || !dailyMap.has(dateStr)) {
				continue;
			}

			const dayStats = dailyMap.get(dateStr)!;
			this.addItemToDay(dayStats, item);
		}

		// Calculate cache efficiency and sort by date descending
		const result = Array.from(dailyMap.values());
		for (const day of result) {
			day.cacheEfficiency = this.calculateCacheEfficiency(day);
		}

		return result.sort((a, b) => b.date.localeCompare(a.date));
	}

	private static formatDate(date: Date): string {
		return date.toISOString().split('T')[0];
	}

	private static createEmptyDayStats(date: string): DailyModelStats {
		return {
			date,
			models: {},
			totals: { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0 },
			cacheEfficiency: 0,
		};
	}

	private static extractDateFromItem(item: MetadataItem): string | null {
		if (!item.timestamp) {
			return null;
		}
		try {
			return new Date(item.timestamp).toISOString().split('T')[0];
		} catch {
			return null;
		}
	}

	private static addItemToDay(day: DailyModelStats, item: MetadataItem): void {
		const usage = item.chatModel?.usage || {};
		const rawModel = usage.model || item.chatModel?.model || 'Unknown';
		const displayName = getModelDisplayName(rawModel);

		const input = this.toNumber(usage.inputTokens);
		const output = this.toNumber(usage.outputTokens);
		const cacheRead = this.toNumber(usage.cacheReadTokens);

		// Update model stats
		if (!day.models[displayName]) {
			day.models[displayName] = {
				inputTokens: 0,
				outputTokens: 0,
				cacheReadTokens: 0,
				calls: 0,
			};
		}
		const modelStats = day.models[displayName];
		modelStats.inputTokens += input;
		modelStats.outputTokens += output;
		modelStats.cacheReadTokens += cacheRead;
		modelStats.calls++;

		// Update totals
		day.totals.inputTokens += input;
		day.totals.outputTokens += output;
		day.totals.cacheReadTokens += cacheRead;
	}

	private static toNumber(val: string | number | undefined): number {
		if (typeof val === 'number') {
			return val;
		}
		if (typeof val === 'string') {
			return parseInt(val, 10) || 0;
		}
		return 0;
	}

	private static calculateCacheEfficiency(day: DailyModelStats): number {
		const totalInput = day.totals.inputTokens;
		const cacheRead = day.totals.cacheReadTokens;
		const totalObservedInput = totalInput + cacheRead;
		if (totalObservedInput === 0) {
			return 0;
		}
		return Math.round((cacheRead / totalObservedInput) * 100);
	}
}
