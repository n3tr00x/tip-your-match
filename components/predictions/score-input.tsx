import { Input } from '@/components/ui/input';

type ScoreInputProps = {
	name: 'homeScore' | 'awayScore';
	team: string;
	defaultValue?: number | string;
};

export function ScoreInput({ name, team, defaultValue }: ScoreInputProps) {
	return (
		<Input
			aria-label={`Gole: ${team}`}
			type="number"
			name={name}
			inputMode="numeric"
			defaultValue={defaultValue}
			placeholder="-"
			min={0}
			max={20}
			required
			className="w-12 shrink-0 text-center font-heading text-lg tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
		/>
	);
}
