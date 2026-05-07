import { dark } from "@clerk/ui/themes";

export const clerkAppearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--text-primary)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    colorNeutral: "var(--border-default)",
    colorForeground: "var(--text-primary)",
    colorMuted: "var(--bg-elevated)",
    colorMutedForeground: "var(--text-muted)",
    colorBackground: "var(--bg-surface)",
    colorInputForeground: "var(--text-primary)",
    colorInput: "var(--bg-elevated)",
    colorRing: "var(--accent-secondary)",
    colorBorder: "var(--border-default)",
    fontFamily: "var(--font-geist-sans)",
    borderRadius: "var(--radius)",
  },
} as const;
