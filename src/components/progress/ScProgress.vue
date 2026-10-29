<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount, onMounted } from "vue";

export interface ScProgressProps {
  active?: boolean;
  label?: string;
  height?: number | string;
  color?: string;
  mode?: "indeterminate" | "trickle";
  percent?: number;
}

const props = withDefaults(defineProps<ScProgressProps>(), {
  active: true,
  label: "加载中",
  height: 3,
  mode: "indeterminate"
});

const visible = ref(props.active);
const progress = ref(0);
const isFadingOut = ref(false);
const isFinishing = ref(false);
const transition = ref("none");

let stageTimer1: ReturnType<typeof setTimeout> | null = null;
let stageTimer2: ReturnType<typeof setTimeout> | null = null;
let finishTimer1: ReturnType<typeof setTimeout> | null = null;
let finishTimer2: ReturnType<typeof setTimeout> | null = null;

function clearTimers() {
  if (stageTimer1) {
    clearTimeout(stageTimer1);
    stageTimer1 = null;
  }
  if (stageTimer2) {
    clearTimeout(stageTimer2);
    stageTimer2 = null;
  }
  if (finishTimer1) {
    clearTimeout(finishTimer1);
    finishTimer1 = null;
  }
  if (finishTimer2) {
    clearTimeout(finishTimer2);
    finishTimer2 = null;
  }
}

function start() {
  clearTimers();
  visible.value = true;
  isFadingOut.value = false;
  isFinishing.value = false;

  if (props.mode === "indeterminate") {
    return;
  }

  // 指定百分比模式
  if (typeof props.percent === "number") {
    transition.value = "transform 200ms ease-out";
    progress.value = Math.min(100, Math.max(0, props.percent));
    return;
  }

  // 丝滑模拟步进（Trickle）：采用连续物理缓动曲线与 GPU 合成线程插值，彻底消除 setInterval 阶梯顿挫
  progress.value = 0;
  transition.value = "none";

  requestAnimationFrame(() => {
    // 阶段 1：首屏启动阶段，用 320ms 优雅冲刺到 28%
    transition.value = "transform 320ms cubic-bezier(0.1, 0.85, 0.25, 1)";
    progress.value = 28;

    // 阶段 2：无缝衔接连续长程缓动（10 秒持续推向 86%），由浏览器合成线程 60/120fps 全帧率平滑插值
    stageTimer1 = setTimeout(() => {
      transition.value = "transform 10000ms cubic-bezier(0.08, 0.6, 0.15, 1)";
      progress.value = 86;

      // 阶段 3：超长时间等待时，平缓蠕动至 95%
      stageTimer2 = setTimeout(() => {
        transition.value = "transform 15000ms cubic-bezier(0.05, 0.5, 0.1, 1)";
        progress.value = 95;
      }, 10000);
    }, 320);
  });
}

function finish() {
  clearTimers();
  if (!visible.value) return;

  if (props.mode === "indeterminate") {
    // 流光扫光模式：保持平滑循环扫光不断流，外层容器 350ms 平滑淡出，绝无瞬间拉扯或突兀中断
    isFadingOut.value = true;
    finishTimer2 = setTimeout(() => {
      visible.value = false;
      isFadingOut.value = false;
    }, 360);
    return;
  }

  // 步进/确定模式完成态：
  // 1. 同时联动：极速冲刺至 100% 满格 + 上下对称压缩收拢高度 (scaleY: 1 -> 0，越来越窄) + 尾段优雅渐隐
  isFinishing.value = true;
  progress.value = 100;
  transition.value =
    "transform 300ms cubic-bezier(0.15, 0.85, 0.25, 1), opacity 300ms cubic-bezier(0.6, 0, 0.9, 0.3)";

  finishTimer1 = setTimeout(() => {
    visible.value = false;
    isFinishing.value = false;
    isFadingOut.value = false;
    progress.value = 0;
    transition.value = "none";
  }, 320);
}

watch(
  () => props.active,
  (isActive) => {
    if (isActive) {
      start();
    } else {
      finish();
    }
  }
);

watch(
  () => props.mode,
  () => {
    if (props.active) {
      start();
    }
  }
);

watch(
  () => props.percent,
  (newVal) => {
    if (typeof newVal === "number" && props.active && props.mode !== "indeterminate") {
      transition.value = "transform 200ms ease-out";
      progress.value = Math.min(100, Math.max(0, newVal));
      if (progress.value >= 100) {
        finish();
      }
    }
  }
);

onMounted(() => {
  if (props.active) {
    start();
  }
});

onBeforeUnmount(() => {
  clearTimers();
});

const heightStyle = computed(() => {
  if (typeof props.height === "number") {
    return `${props.height}px`;
  }
  return props.height;
});

const barStyle = computed(() => {
  if (props.mode === "indeterminate") {
    return props.color
      ? { backgroundColor: props.color, boxShadow: `0 0 10px ${props.color}` }
      : undefined;
  }
  const scaleYVal = isFinishing.value ? 0 : 1;
  const opacityVal = isFinishing.value ? 0 : 1;
  return {
    transform: `translate3d(${progress.value - 100}%, 0, 0) scaleY(${scaleYVal})`,
    transformOrigin: "0 50%",
    transition: transition.value,
    opacity: opacityVal,
    backgroundColor: props.color || undefined
  };
});
</script>

<template>
  <div
    v-if="visible"
    class="sc-progress"
    :class="[
      `sc-progress--${mode}`,
      {
        'is-fade-out': isFadingOut,
        'is-finishing': isFinishing
      }
    ]"
    :style="{ height: heightStyle }"
    role="progressbar"
    :aria-label="label"
    :aria-valuenow="mode === 'indeterminate' ? undefined : Math.round(progress)"
  >
    <div class="sc-progress__bar" :style="barStyle">
      <!-- 步进模式下的头部流动光晕 (Peg) -->
      <div
        v-if="mode !== 'indeterminate'"
        class="sc-progress__peg"
        :style="color ? { boxShadow: `0 0 12px ${color}, 0 0 6px ${color}` } : undefined"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.sc-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: calc(var(--z-toast) + 1);
  overflow: hidden;
  background: transparent;
  pointer-events: none;
  opacity: 1;
  transition: opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

.sc-progress.is-fade-out {
  opacity: 0;
}

.sc-progress__bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--primary);
  box-shadow: 0 0 8px var(--primary);
  transform-origin: 0 50%;
}

/* 流光扫光模式：平滑循环波 */
.sc-progress--indeterminate .sc-progress__bar {
  animation: sc-indeterminate 1.4s var(--ease) infinite;
}

/* 步进模式：光流微光纹理 */
.sc-progress--trickle .sc-progress__bar {
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.22) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: sc-trickle-glow 2s linear infinite;
}

@keyframes sc-trickle-glow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 步进模式：头部光晕 (Peg) */
.sc-progress__peg {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 90px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5));
  box-shadow: 0 0 10px var(--primary), 0 0 4px var(--primary);
  opacity: 1;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .sc-progress--indeterminate .sc-progress__bar,
  .sc-progress--trickle .sc-progress__bar {
    animation: none !important;
  }
  .sc-progress {
    transition: opacity 150ms var(--ease) !important;
  }
}
</style>
