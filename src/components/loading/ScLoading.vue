<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useLoading } from "../../composables/useLoading";

const props = withDefaults(
  defineProps<{
    /** 是否处于加载激活状态；若未传入且开启 fullscreen，则自动联动 useLoading() 全局状态 */
    active?: boolean;
    /** 是否为全屏遮罩（全屏模式自动 Teleport 到 body 且置于最高层级） */
    fullscreen?: boolean;
    /** 加载提示文案 */
    text?: string;
    /** 旋转器尺寸 */
    spinnerSize?: "sm" | "md" | "lg";
    /** 旋转器风格：极简圆弧 (ring) | 经典系统刻度 (spokes) */
    spinnerType?: "ring" | "spokes";
    /** 是否以系统级悬浮卡片 (HUD) 形式展示 */
    card?: boolean;
    /** 是否开启毛玻璃背景模糊 (backdrop-filter) */
    blur?: boolean;
    /** 自定义背景色 */
    background?: string;
    /** 延迟显示时间 (毫秒)，可避免超快异步任务瞬间微闪 */
    delay?: number;
  }>(),
  {
    active: undefined,
    fullscreen: false,
    text: undefined,
    spinnerSize: undefined,
    spinnerType: undefined,
    card: undefined,
    blur: undefined,
    background: undefined,
    delay: 0
  }
);

const globalLoading = useLoading();

const isTargetActive = computed(() => {
  if (props.active !== undefined) {
    return props.active;
  }
  if (props.fullscreen) {
    return globalLoading.active.value;
  }
  return true;
});

const resolvedText = computed(() => {
  if (props.text !== undefined) {
    return props.text;
  }
  if (props.fullscreen) {
    return globalLoading.text.value;
  }
  return "加载中...";
});

const resolvedSize = computed(() => {
  return props.spinnerSize || (props.fullscreen ? globalLoading.spinnerSize.value : "md") || "md";
});

const resolvedType = computed(() => {
  return props.spinnerType || (props.fullscreen ? globalLoading.spinnerType.value : "ring") || "ring";
});

const resolvedCard = computed(() => {
  if (props.card !== undefined) {
    return props.card;
  }
  if (props.fullscreen) {
    return globalLoading.card.value;
  }
  return false;
});

const resolvedBlur = computed(() => {
  if (props.blur !== undefined) {
    return props.blur;
  }
  if (props.fullscreen) {
    return globalLoading.blur.value;
  }
  return true;
});

const resolvedBackground = computed(() => {
  return props.background || (props.fullscreen ? globalLoading.background.value : undefined);
});

const visible = ref(false);
let delayTimer: any = null;

function clearDelay() {
  if (delayTimer) {
    clearTimeout(delayTimer);
    delayTimer = null;
  }
}

watch(
  () => isTargetActive.value,
  (newVal) => {
    clearDelay();
    if (newVal) {
      if (props.delay > 0) {
        delayTimer = setTimeout(() => {
          visible.value = true;
          delayTimer = null;
        }, props.delay);
      } else {
        visible.value = true;
      }
    } else {
      visible.value = false;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  clearDelay();
});
</script>

<template>
  <Component :is="fullscreen ? 'Teleport' : 'div'" :to="fullscreen ? 'body' : undefined">
    <Transition name="sc-loading-fade">
      <div
        v-if="visible"
        class="sc-loading"
        :class="{
          'sc-loading--fullscreen': fullscreen,
          'sc-loading--blur': resolvedBlur
        }"
        :style="{ backgroundColor: resolvedBackground }"
        role="status"
        aria-live="polite"
        :aria-busy="visible"
      >
        <div
          class="sc-loading__content"
          :class="{ 'sc-loading__content--card': resolvedCard }"
        >
          <slot>
            <!-- 极简旋转器 -->
            <slot name="spinner">
              <!-- 极简圆弧 (Linear / Vercel 风格) -->
              <svg
                v-if="resolvedType === 'ring'"
                class="sc-loading__spinner sc-loading__spinner--ring"
                :class="`sc-loading__spinner--${resolvedSize}`"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  class="sc-loading__track"
                  cx="12"
                  cy="12"
                  r="9.5"
                  stroke-width="2.5"
                />
                <path
                  class="sc-loading__arc"
                  d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />
              </svg>

              <!-- 经典系统刻度 (Apple macOS / iOS 风格) -->
              <svg
                v-else-if="resolvedType === 'spokes'"
                class="sc-loading__spinner sc-loading__spinner--spokes"
                :class="`sc-loading__spinner--${resolvedSize}`"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="1" />
                <line x1="17" y1="3.34" x2="15" y2="6.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.92" />
                <line x1="20.66" y1="7" x2="17.2" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.83" />
                <line x1="22" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.75" />
                <line x1="20.66" y1="17" x2="17.2" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.66" />
                <line x1="17" y1="20.66" x2="15" y2="17.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.58" />
                <line x1="12" y1="22" x2="12" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.50" />
                <line x1="7" y1="20.66" x2="9" y2="17.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.42" />
                <line x1="3.34" y1="17" x2="6.8" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.33" />
                <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.25" />
                <line x1="3.34" y1="7" x2="6.8" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.17" />
                <line x1="7" y1="3.34" x2="9" y2="6.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.10" />
              </svg>
            </slot>

            <!-- 提示文案 -->
            <slot name="text">
              <span v-if="resolvedText" class="sc-loading__text">{{ resolvedText }}</span>
            </slot>
          </slot>
        </div>
      </div>
    </Transition>
  </Component>
</template>

<style scoped>
/* 遮罩底板 */
.sc-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  z-index: 20;
  user-select: none;
  border-radius: inherit;
}

:root[data-theme="dark"] .sc-loading {
  background: rgba(18, 19, 22, 0.72);
}

:root[data-theme="gold"] .sc-loading {
  background: rgba(18, 18, 20, 0.78);
}

/* 磨砂微模糊 */
.sc-loading--blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 全屏模式 */
.sc-loading--fullscreen {
  position: fixed;
  z-index: calc(var(--z-toast) + 15);
  border-radius: 0;
}

/* 居中内容承载 */
.sc-loading__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

/* 悬浮微卡片 (HUD 模式) */
.sc-loading__content--card {
  padding: 18px 24px;
  background: var(--bg-elevated);
  border: 1px solid var(--outline-soft);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-2);
  min-width: 120px;
}

/* ==================== 旋转器基础 ==================== */
.sc-loading__spinner {
  display: block;
}

.sc-loading__spinner--sm {
  width: 18px;
  height: 18px;
}

.sc-loading__spinner--md {
  width: 26px;
  height: 26px;
}

.sc-loading__spinner--lg {
  width: 36px;
  height: 36px;
}

/* 极简圆弧 (Linear 风格) */
.sc-loading__spinner--ring {
  color: var(--primary);
  animation: sc-spin 0.75s linear infinite;
}

.sc-loading__track {
  stroke: currentColor;
  opacity: 0.16;
}

.sc-loading__arc {
  stroke: currentColor;
}

/* 系统级经典刻度 (Apple 风格) */
.sc-loading__spinner--spokes {
  color: var(--text-2);
  animation: sc-spin-steps 0.9s steps(12) infinite;
}

@keyframes sc-spin-steps {
  to {
    transform: rotate(360deg);
  }
}

/* ==================== 文案排印 ==================== */
.sc-loading__text {
  font-size: 13px;
  color: var(--text-2);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

/* ==================== 进出场平滑过渡 ==================== */
.sc-loading-fade-enter-active,
.sc-loading-fade-leave-active {
  transition: opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.sc-loading-fade-enter-active .sc-loading__content,
.sc-loading-fade-leave-active .sc-loading__content {
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.sc-loading-fade-enter-from,
.sc-loading-fade-leave-to {
  opacity: 0;
}

.sc-loading-fade-enter-from .sc-loading__content,
.sc-loading-fade-leave-to .sc-loading__content {
  transform: scale(0.96);
}
</style>
