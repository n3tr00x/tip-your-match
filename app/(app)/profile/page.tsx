import { ProfileForm } from '@/components/profile/profile-form';
import { ProfileSummary } from '@/components/profile/profile-summary';
import { requireSession } from '@/lib/session';

export default async function ProfilePage() {
	const session = await requireSession();
	const { name, email, createdAt, bio } = session.user;

	return (
		<div className="max-w-2xl mx-auto my-6 space-y-6">
			<header className="border-b pb-2">
				<h1 className="font-heading uppercase tracking-widest">Profil</h1>
			</header>
			<ProfileSummary name={name} email={email} createdAt={createdAt} />
			<ProfileForm name={name} bio={bio ?? ''} />
		</div>
	);
}
