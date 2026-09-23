import type React from "react";

/**
 * Next's ScriptProps extends `import type { ScriptHTMLAttributes } from "react"`,
 * which does not resolve under TypeScript 6 + @types/react's `export =` shape.
 * Re-merge HTML script attributes via the React namespace so `src` and data-* work.
 */
declare module "next/script" {
  interface ScriptProps extends React.ScriptHTMLAttributes<HTMLScriptElement> {}
}
