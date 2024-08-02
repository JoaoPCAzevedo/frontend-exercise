"use client";

/**
 * Imports
 */
import { useTheme } from "next-themes";

import { subtitle, title } from "./primitives";

/**
 * Component
 */
export default function Header() {
  // Constants and hooks
  const { theme } = useTheme();

  // Render
  return (
    <div className="inline-block max-w-lg text-center justify-center">
      <h1 className={title()}>You are using the&nbsp;</h1>
      <br />
      <h1 className={title({ color: "violet" })}>{theme} side&nbsp;</h1>
      <br />
      <h1 className={title()}>of the force.</h1>
      <h2 className={subtitle({ class: "mt-4" })}>
        Use this power to search through the planets.
      </h2>
    </div>
  );
}
