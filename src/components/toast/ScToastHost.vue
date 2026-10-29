<script setup lang="ts">
import { useToast, type ToastPlacement, type ToastItem } from "../../composables/useToast";

const props = withDefaults(
  defineProps<{
    /** 若指定默认位置，则未显式指定 placement 的 toast 会落在这里 */
    defaultPlacement?: ToastPlacement;
  }>(),
  {
    defaultPlacement: "bottom-center"
  }
);

const { toasts, dismissToast, pauseToast, resumeToast } = useToast();

const ICONS: Record<string, string> = {
  info: "bi-info-circle",
  success: "bi-check-circle",
  warning: "bi-exclamation-triangle",
  error: "bi-exclamation-circle"
};

const placements: ToastPlacement[] = [
  "bottom-center",
  "top-center",
  "top-right",
  "bottom-right"
];

function getToastsForPlacement(p: ToastPlacement): ToastItem[] {
  return toasts.value.filter((t) => (t.placement || props.defaultPlacement) === p);
}

function onBeforeLeave(el: Element) {
  const htmlEl = el as HTMLElement;
  const parent = htmlEl.offsetParent as HTMLElement | null;
  const isBottom = htmlEl.closest(".sc-toasts--bottom-center, .sc-toasts--bottom-right") !== null;

  // 锁定当前绝对像素与宽度，防止脱离文档流导致元素形变或突跳
  htmlEl.style.left = `${htmlEl.offsetLeft}px`;
  htmlEl.style.width = `${htmlEl.offsetWidth}px`;

  if (isBottom && parent) {
    // 底部堆叠时根据容器当前底边精确对齐
    const bottomOffset = parent.offsetHeight - htmlEl.offsetTop - htmlEl.offsetHeight;
    htmlEl.style.bottom = `${bottomOffset}px`;
    htmlEl.style.top = "auto";
  } else {
    // 顶部堆叠时按当前 offsetTop 锁定
    htmlEl.style.top = `${htmlEl.offsetTop}px`;
    htmlEl.style.bottom = "auto";
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-for="p in placements"
      :key="p"
      class="sc-toasts"
      :class="`sc-toasts--${p}`"
      role="status"
      aria-live="polite"
    >
      <TransitionGroup
        :name="`sc-toast-anim-${p}`"
        appear
        @before-leave="onBeforeLeave"
      >
        <div
          v-for="toast in getToastsForPlacement(p)"
          :key="toast.id"
          class="sc-toast"
          :class="[
            `sc-toast--${toast.kind}`,
            { 'is-paused': toast.paused }
          ]"
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id)"
        >
          <i :class="['bi', ICONS[toast.kind] || 'bi-info-circle']"></i>
          <span class="sc-toast__msg">{{ toast.message }}</span>
          <button
            class="sc-toast__close"
            type="button"
            aria-label="关闭通知"
            title="关闭通知"
            @click="dismissToast(toast.id)"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
/* 多方位容器定位覆盖 */
.sc-toasts--top-center {
  top: var(--sp-6);
  bottom: auto;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column;
}

.sc-toasts--top-right {
  top: var(--sp-6);
  bottom: auto;
  right: var(--sp-6);
  left: auto;
  transform: none;
  flex-direction: column;
}

.sc-toasts--bottom-right {
  bottom: var(--sp-6);
  right: var(--sp-6);
  left: auto;
  transform: none;
  flex-direction: column-reverse;
}

.sc-toasts--bottom-center {
  bottom: var(--sp-6);
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column-reverse;
}

@media (max-width: 768px) {
  .sc-toasts--top-right,
  .sc-toasts--bottom-right {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
  }
}
</style>
