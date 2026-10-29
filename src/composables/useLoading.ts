import { ref } from "vue";

export interface LoadingOptions {
  /** 加载提示文案 */
  text?: string;
  /** 旋转器尺寸 */
  spinnerSize?: "sm" | "md" | "lg";
  /** 旋转器类型：极简圆弧 (ring) | 经典系统刻度 (spokes) */
  spinnerType?: "ring" | "spokes";
  /** 是否以系统级悬浮卡片 (HUD) 承载 */
  card?: boolean;
  /** 是否开启毛玻璃背景模糊 */
  blur?: boolean;
  /** 自定义背景色 / 不透明度 */
  background?: string;
}

const active = ref(false);
const text = ref<string | undefined>("加载中...");
const spinnerSize = ref<"sm" | "md" | "lg">("md");
const spinnerType = ref<"ring" | "spokes">("ring");
const card = ref(false);
const blur = ref(true);
const background = ref<string | undefined>(undefined);

let count = 0;

export function useLoading() {
  function show(options?: LoadingOptions) {
    count++;
    text.value = options?.text !== undefined ? options.text : "加载中...";
    if (options?.spinnerSize !== undefined) {
      spinnerSize.value = options.spinnerSize;
    }
    if (options?.spinnerType !== undefined) {
      spinnerType.value = options.spinnerType;
    }
    card.value = options?.card ?? false;
    if (options?.blur !== undefined) {
      blur.value = options.blur;
    }
    background.value = options?.background;
    active.value = true;
  }

  function hide() {
    count = Math.max(0, count - 1);
    if (count === 0) {
      active.value = false;
    }
  }

  function close() {
    count = 0;
    active.value = false;
  }

  /**
   * 自动包裹异步 Promise，执行期间自动开启全屏 Loading，完成后自动关闭
   */
  async function withLoading<T>(fn: () => Promise<T>, options?: LoadingOptions): Promise<T> {
    show(options);
    try {
      return await fn();
    } finally {
      hide();
    }
  }

  return {
    active,
    text,
    spinnerSize,
    spinnerType,
    card,
    blur,
    background,
    show,
    hide,
    close,
    withLoading
  };
}
