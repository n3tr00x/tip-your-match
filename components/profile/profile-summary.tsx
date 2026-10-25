import { formatMonthYear } from '@/lib/date';
import { getInitials } from '@/lib/profile/format';

type ProfileSummaryProps = {
	name: string;
	email: string;
	createdAt: Date;
};

export function ProfileSummary({
	name,
	email,
	createdAt,
}: ProfileSummaryProps) {
	return (
		<div className="flex items-center gap-4">
			<div
				aria-hidden="true"
				className="flex size-14 shrink-0 items-center justify-center bg-primary/10 font-heading text-lg text-primary"
			>
				{getInitials(name)}
			</div>
			<div className="min-w-0 space-y-0.5">
				<p className="truncate font-heading uppercase tracking-widest">
					{name}
				</p>
				<p className="truncate text-sm text-muted-foreground">{email}</p>
				<p className="text-xs text-muted-foreground">
					Konto od {formatMonthYear(createdAt)}
				</p>
			</div>
		</div>
	);
}
