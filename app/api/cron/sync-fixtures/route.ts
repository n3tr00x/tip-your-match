import { NextRequest, NextResponse } from 'next/server';
import { requireEnvVariable } from '@/lib/utils';
import { syncFixtures } from '@/lib/football-api/sync-fixtures';

export const maxDuration = 60;

export async function GET(request: NextRequest) {
	const cronSecret = requireEnvVariable('CRON_SECRET');

	if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const result = await syncFixtures();
		console.log(`Fixtures synced: ${result.updated} of ${result.total}`);

		return NextResponse.json(result);
	} catch (error) {
		console.error('Failed to sync fixtures:', error);
		return NextResponse.json(
			{ error: 'Failed to sync fixtures' },
			{ status: 500 },
		);
	}
}
