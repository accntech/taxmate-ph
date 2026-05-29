export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warn';
export type ButtonSize = 'sm' | 'md' | 'touch' | 'icon';

export const buttonBaseClass = [
	'inline-flex items-center justify-center gap-2 rounded-md font-medium',
	'transition-[background-color,border-color,color,box-shadow,transform] duration-150',
	'outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55',
	'focus-visible:shadow-[0_0_0_3px_var(--ring)]'
].join(' ');

export const buttonVariantClass: Record<ButtonVariant, string> = {
	primary: 'border border-accent bg-accent text-[var(--accent-fg)] hover:bg-accent-hover',
	secondary: 'border border-border bg-bg-elev text-fg hover:bg-bg-hover',
	ghost: 'border border-transparent bg-transparent text-fg-muted hover:bg-bg-hover hover:text-fg',
	danger: 'border border-danger bg-danger text-[var(--accent-fg)] hover:bg-danger/90',
	warn: 'border border-warn bg-warn text-[var(--accent-fg)] hover:bg-warn/90'
};

export const buttonSizeClass: Record<ButtonSize, string> = {
	sm: 'min-h-8 px-2.5 text-xs',
	md: 'min-h-10 px-3 text-sm',
	touch: 'min-h-12 px-4 text-base',
	icon: 'size-9 p-0'
};
