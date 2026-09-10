import { Button } from '@/components/ui/button';
import { GoogleIcon, DiscordIcon } from '@/components/ui/icons';

export function OAuthButtons() {
	return (
		<div className="w-full space-y-3 my-2">
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-card px-2 text-muted-foreground">
						lub kontynuuj z
					</span>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<Button variant="outline" type="button" className="w-full">
					<GoogleIcon />
					Google
				</Button>
				<Button variant="outline" type="button" className="w-full">
					<DiscordIcon />
					Discord
				</Button>
			</div>
		</div>
	);
}
