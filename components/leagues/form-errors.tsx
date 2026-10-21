type FormErrorsProps = {
	id: string;
	errors?: string[];
};

export function FormErrors({ id, errors }: FormErrorsProps) {
	if (!errors || errors.length === 0) {
		return null;
	}

	return (
		<ul id={id} role="alert" className="space-y-1 text-xs text-destructive">
			{errors.map((error, index) => (
				<li key={index}>{error}</li>
			))}
		</ul>
	);
}
