import type { Category } from "@/lib/categories";

/// Gives a whole page the identity of one category: a full-page backdrop plus
/// accent variables (--theme-accent / --theme-soft) that themed sections read.
export function CategoryTheme({ category }: { category: Category }) {
  const css = `:root{--theme-accent:${category.accent};--theme-soft:${category.accentSoft};}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{ background: category.pageBackground }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.7) 0 1px, transparent 1px 7px)",
        }}
      />
    </>
  );
}
