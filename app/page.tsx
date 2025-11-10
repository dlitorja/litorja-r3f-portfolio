import { createClient } from "@/lib/prismic";
import { HomeHeroClient } from "@/components/HomeHeroClient";

export default async function Home() {
  const client = createClient();

  let title = "Dustin Litorja";
  let blurb = "Content Strategy | Marketing | Videography | Photography";

  try {
    const home = await client.getSingle("homepage");
    if (home?.data) {
      const t = (home.data as any).hero_title;
      const b = (home.data as any).blurb;
      const toPlainText = (val: any): string => {
        if (!val) return "";
        if (typeof val === "string") return val;
        if (Array.isArray(val)) {
          try {
            return val.map((s: any) => s?.text).filter(Boolean).join(" ") || "";
          } catch {
            return "";
          }
        }
        return "";
      };
      title = toPlainText(t) || title;
      blurb = toPlainText(b) || blurb;
    }
  } catch {}

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-zinc-50">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-sm font-medium">Litorja</div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <HomeHeroClient title={title} blurb={blurb} />
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-500"> {new Date().getFullYear()} Litorja</footer>
    </div>
  );
}
