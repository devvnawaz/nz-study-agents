/**
 * Layered hero backdrop for the homepage.
 *
 * Bottom → top:
 *  1. Solid navy base (always present).
 *  2. Optional photo at /images/hero-nz.jpg (shows only if the file exists).
 *  3. Inline mountain-silhouette SVG — makes the hero look intentional even
 *     when no photo is supplied.
 *  4. Navy gradient overlay so white foreground text stays readable.
 *
 * Purely decorative — marked aria-hidden.
 */
export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-ink-900">
      {/* Photo layer (optional). If the file is absent, nothing renders here. */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/images/hero-nz.jpg')" }}
      />

      {/* Mountain silhouette fallback / texture */}
      <svg
        className="absolute bottom-0 left-0 h-2/3 w-full text-ink-950/70"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 320V180l180-120 160 120 200-160 220 200 180-120 200 140 300-180v260z" opacity="0.55" />
        <path d="M0 320V230l260-140 220 160 260-180 240 160 220-120 240 140v170z" opacity="0.75" />
      </svg>

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950/95 via-ink-900/80 to-ink-900/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />

      {/* Accent glow */}
      <div className="absolute -right-32 top-8 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl" />
    </div>
  );
}
