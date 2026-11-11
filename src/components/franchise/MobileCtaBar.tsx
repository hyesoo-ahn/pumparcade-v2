"use client";

import { useEffect, useState } from "react";
import { PHONE } from "./ui";

// Mobile only: once the intro CTA buttons scroll off the top, a sticky bar pops up
// from the bottom. It drops away again over the inquiry form and footer so it never covers them.
export default function MobileCtaBar() {
  const [passedIntro, setPassedIntro] = useState(false);
  const [nearForm, setNearForm] = useState(false);

  useEffect(() => {
    const intro = document.getElementById("intro-cta");
    const targets = [document.getElementById("inquiry"), document.getElementById("contact")].filter(Boolean) as HTMLElement[];
    if (!intro) return;

    const introIo = new IntersectionObserver(([e]) => {
      // Only "passed" when it left through the top, not while it's still below
      setPassedIntro(!e.isIntersecting && e.boundingClientRect.bottom < 0);
    });
    introIo.observe(intro);

    const visible = new Set<Element>();
    const formIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setNearForm(visible.size > 0);
    });
    targets.forEach((t) => formIo.observe(t));

    return () => {
      introIo.disconnect();
      formIo.disconnect();
    };
  }, []);

  const show = passedIntro && !nearForm;

  return (
    <div
      aria-hidden={!show}
      className="mobile-cta lg:hidden fixed inset-x-0 bottom-0 z-40 px-3 pt-3 bg-background/90 backdrop-blur border-t border-foreground/10"
      data-show={show ? "" : undefined}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${PHONE}`}
          tabIndex={show ? 0 : -1}
          className="type-pixel flex items-center justify-center gap-1.5 border border-foreground/30 text-foreground px-4 py-3.5"
        >
          <span className="font-toss">☎️</span> {PHONE}
        </a>
        <a
          href="#inquiry"
          tabIndex={show ? 0 : -1}
          className="type-pixel flex items-center justify-center bg-green text-background px-4 py-3.5"
        >
          상담 신청 ↓
        </a>
      </div>
    </div>
  );
}
