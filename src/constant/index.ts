export const Lib = {
  React: "react",
  Vue2: "vue2",
  Vue3: "vue3",
} as const;

export type LibUnion = (typeof Lib)[keyof typeof Lib];

export const pkgManager = {
  PNPM: "pnpm",
  NPM: "npm",
  YARN: "yarn",
} as const;

export type PkgManagerUnion = (typeof pkgManager)[keyof typeof pkgManager];
