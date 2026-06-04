import { dark } from "@clerk/ui/themes";

const authPanelElements = {
  rootBox: "w-full max-w-[28.5rem]",
  cardBox: "w-full max-w-[28.5rem]",
  card: "w-full rounded-3xl border border-surface-border/80 bg-elevated/85 ring-1 ring-surface-border/40 shadow-xl shadow-base/45 backdrop-blur-sm transition-all duration-300",
  headerTitle: "text-copy-primary tracking-tight",
  headerSubtitle: "text-copy-secondary",
  socialButtonsBlockButton:
    "rounded-xl border border-surface-border/80 bg-surface text-copy-primary transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated",
  socialButtonsIconButton:
    "rounded-xl border border-surface-border/80 bg-surface text-copy-primary transition-all duration-200 hover:border-copy-secondary/40 hover:bg-elevated",
  dividerLine: "bg-surface-border/70",
  dividerText: "text-copy-muted",
  formFieldInput:
    "rounded-xl border border-surface-border/80 bg-surface text-copy-primary transition-colors duration-200",
  formButtonPrimary:
    "rounded-xl bg-brand text-copy-primary shadow-sm shadow-base/30 transition-all duration-200 hover:opacity-95",
  footerActionText: "text-copy-secondary",
  footerActionLink: "text-copy-primary transition-colors duration-200 hover:text-brand",
} as const;

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
  signIn: {
    elements: authPanelElements,
  },
  signUp: {
    elements: authPanelElements,
  },
} as const;
