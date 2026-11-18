import Bento from "@/components/Bento";
import Contact from "@/components/Contact";
import Dock from "@/components/Dock";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import Spine from "@/components/Spine";
import ScrollFields from "@/components/ScrollFields";
import { ui } from "@/content/profile";

export default function Page() {
  return (
    <>
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-signal focus:px-4 focus:py-2 focus:text-obsidian">
        {ui.skip}
      </a>
      <div className="bg" aria-hidden>
        <div className="bg-grid" /><div className="bg-field bg-f1" /><div className="bg-field bg-f2" /><div className="bg-grain" />
      </div>
      <ScrollFields />
      <div id="page">
        <Hero />
        <Spine>
          <main>
            <Bento />
            <Method />
            <Contact />
          </main>
        </Spine>
      </div>
      <Dock />
    </>
  );
}
