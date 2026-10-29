import type { Metadata } from 'next';
import { ProfileDetails } from '@/components/profile/profile-details';
import { ProfileSummary } from '@/components/profile/profile-summary';
import { ProfileStats } from '@/components/profile/profile-stats';
import { getUserStanding } from '@/lib/ranking/queries';
import { requireSession } from '@/lib/session';
import { requireEnvVariable } from '@/lib/utils';

export const metadata: Metadata = { title: 'Profil' };

export default async function ProfilePage() {
	const session = await requireSession();
	const { id, name, email, createdAt, bio } = session.user;
	const seasonYear = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const standing = await getUserStanding(id, seasonYear);

	return (
		<div className="max-w-2xl mx-auto my-6 space-y-6">
			<header className="border-b pb-2">
				<h1 className="font-heading uppercase tracking-widest">Profil</h1>
			</header>
			<ProfileSummary name={name} email={email} createdAt={createdAt} />
			<ProfileStats standing={standing} />
			<ProfileDetails name={name} bio={bio ?? null} />
		</div>
	);
}
