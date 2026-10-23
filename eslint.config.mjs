import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Deno 런타임(Supabase Edge Functions) — Next.js/Node lint 대상 아님
    "supabase/functions/**",
    // agy E2E 작업용 격리 worktree(CLAUDE.md §5) — 메인 체크아웃의 검사 대상이 아니다
    "worktrees/**",
  ]),
]);

export default eslintConfig;
