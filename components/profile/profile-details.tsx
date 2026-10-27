'use client';

import { useState } from 'react';
import { ProfileForm } from '@/components/profile/profile-form';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { PencilIcon } from 'lucide-react';

type ProfileDetailsProps = {
	name: string;
	bio: string | null;
};

export function ProfileDetails({ name, bio }: ProfileDetailsProps) {
	const [isEditing, setIsEditing] = useState(false);

	if (isEditing) {
		return (
			<ProfileForm
				name={name}
				bio={bio ?? ''}
				onCancel={() => setIsEditing(false)}
				onSaved={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>O mnie</CardTitle>
				<CardAction>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsEditing(true)}
					>
						<PencilIcon data-icon="inline-start" />
						Edytuj profil
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				{bio ? (
					<p className="whitespace-pre-line text-sm">{bio}</p>
				) : (
					<p className="text-sm text-muted-foreground">Brak opisu</p>
				)}
			</CardContent>
		</Card>
	);
}
