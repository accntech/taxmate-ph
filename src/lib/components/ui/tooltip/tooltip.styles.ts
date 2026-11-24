import * as stylex from '@stylexjs/stylex';

export const tooltip = stylex.create({
  floatingTrigger: { display: 'inline-flex' },
  trigger: { position: 'relative', display: 'inline-flex' },
  floatingPopup: { zIndex: 80 },
  popup: {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 60,
    borderRadius: 'var(--radius-md)',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'var(--border)',
    backgroundColor: 'var(--bg-elev)',
    paddingInline: 'calc(var(--spacing) * 2.5)',
    paddingBlock: 'calc(var(--spacing) * 1.5)',
    fontSize: '12.5px',
    whiteSpace: 'nowrap',
    color: 'var(--fg)',
    '--sx-shadow': 'var(--shadow-lg)',
    boxShadow: 'var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)',
  },
});
