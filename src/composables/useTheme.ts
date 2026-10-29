import { ref, computed } from "vue";

export type ThemeMode = "auto" | "light" | "dark" | "gold";
export type ResolvedTheme = "light" | "dark" | "gold";

const STORAGE_KEY = "sc-theme-mode";
const ALL_MODES: ThemeMode[] = ["auto", "light", "dark", "gold"];
const THEME_COLORS: Record<ResolvedTheme, string> = {
  light: "#f0f4f9",
  dark: "#131314",
  gold: "#151518"
};

let mediaWatcher: MediaQueryList | null = null;
const currentMode = ref<ThemeMode>("auto");
const allowedModes = ref<ThemeMode[]>(["auto", "light", "dark", "gold"]);

function resolveMode(mode: ThemeMode): ResolvedTheme {
  if (mode === "auto") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }
  return mode;
}

const resolvedTheme = computed(() => resolveMode(currentMode.value));

function applyDOM(resolved: ResolvedTheme, mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.setAttribute("data-theme-mode", mode);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[resolved]);
}

export function useTheme() {
  function initTheme() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored && ALL_MODES.includes(stored)) {
        currentMode.value = stored;
      }
    } catch {
      // 忽略隐私模式下访问限制
    }

    applyDOM(resolvedTheme.value, currentMode.value);

    if (!mediaWatcher && window.matchMedia) {
      mediaWatcher = window.matchMedia("(prefers-color-scheme: dark)");
      mediaWatcher.addEventListener("change", () => {
        if (currentMode.value === "auto") {
          applyDOM(resolveMode("auto"), "auto");
        }
      });
    }
  }

  function setTheme(mode: ThemeMode) {
    if (!allowedModes.value.includes(mode)) return false;
    currentMode.value = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // 忽略
    }
    applyDOM(resolveMode(mode), mode);
    return true;
  }

  function cycleTheme() {
    const list = allowedModes.value;
    const idx = list.indexOf(currentMode.value);
    const next = list[(idx + 1) % list.length];
    setTheme(next);
  }

  return {
    mode: currentMode,
    theme: resolvedTheme,
    allowedThemes: allowedModes,
    initTheme,
    setTheme,
    cycleTheme
  };
}
