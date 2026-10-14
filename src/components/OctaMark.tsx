/** Marca do Octa: octógono com o trigrama ☲. */
export function OctaMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <polygon points="12,2 28,2 38,12 38,28 28,38 12,38 2,28 2,12" fill="#A51F24" />
      <rect x="11" y="12" width="18" height="3" fill="#fff" />
      <rect x="11" y="18.5" width="7.5" height="3" fill="#fff" />
      <rect x="21.5" y="18.5" width="7.5" height="3" fill="#fff" />
      <rect x="11" y="25" width="18" height="3" fill="#fff" />
    </svg>
  );
}
