<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, nextTick } from "vue";

const props = withDefaults(
  defineProps<{
    align?: "start" | "end" | "auto";
  }>(),
  { align: "end" }
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const placement = ref<"bottom" | "top">("bottom");
const resolvedAlign = ref<"start" | "end">("end");

function updatePosition() {
  if (!root.value) return;
  const triggerRect = root.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const estimatedMenuHeight = 260; // 预估或实际高度
  const spaceBelow = windowHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  // 如果下方空间不足且上方空间更大，向上展开
  if (spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow) {
    placement.value = "top";
  } else {
    placement.value = "bottom";
  }

  // 自动检测左右对齐
  if (props.align === "auto") {
    if (triggerRect.left < 200) {
      resolvedAlign.value = "start";
    } else {
      resolvedAlign.value = "end";
    }
  } else {
    resolvedAlign.value = props.align;
    // 边缘保护：若右对齐时超出屏幕左侧，强制改为 start
    if (props.align === "end" && triggerRect.right < 200) {
      resolvedAlign.value = "start";
    }
    // 若左对齐时超出屏幕右侧，强制改为 end
    if (props.align === "start" && windowWidth - triggerRect.left < 200) {
      resolvedAlign.value = "end";
    }
  }
}

function toggle() {
  if (!open.value) {
    updatePosition();
    open.value = true;
    nextTick(() => {
      if (panelRef.value) {
        // 实际渲染后再精确校准一次高度
        const rect = panelRef.value.getBoundingClientRect();
        if (rect.bottom > window.innerHeight && placement.value === "bottom") {
          placement.value = "top";
        }
      }
    });
  } else {
    open.value = false;
  }
}

function close() {
  open.value = false;
}

function onScrollOrResize() {
  if (open.value) {
    window.requestAnimationFrame(updatePosition);
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!open.value) return;
  if (root.value && !root.value.contains(event.target as Node)) {
    close();
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value) {
    close();
    root.value?.querySelector<HTMLElement>("[data-menu-trigger]")?.focus();
    return;
  }

  if (open.value && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
    event.preventDefault();
    const items = panelRef.value?.querySelectorAll<HTMLElement>("button, a, [tabindex]:not([tabindex='-1'])");
    if (!items || !items.length) return;
    const current = document.activeElement as HTMLElement;
    const idx = Array.from(items).indexOf(current);
    if (event.key === "ArrowDown") {
      const next = items[idx + 1] || items[0];
      next.focus();
    } else {
      const prev = items[idx - 1] || items[items.length - 1];
      prev.focus();
    }
  }
}

onMounted(() => {
  if (typeof document !== "undefined") {
    document.addEventListener("pointerdown", onDocumentPointerDown);
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
  }
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("pointerdown", onDocumentPointerDown);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("scroll", onScrollOrResize);
    window.removeEventListener("resize", onScrollOrResize);
  }
});

defineExpose({ close, open, toggle });
</script>

<template>
  <div ref="root" class="sc-dropdown">
    <div
      data-menu-trigger
      aria-haspopup="true"
      :aria-expanded="open"
      @click="toggle"
    >
      <slot name="trigger" :open="open" />
    </div>

    <Transition name="sc-dropdown-fade">
      <div
        v-if="open"
        ref="panelRef"
        class="sc-dropdown__panel menu"
        :class="[
          `sc-dropdown__panel--${placement}`,
          resolvedAlign === 'start' ? 'sc-dropdown__panel--start' : ''
        ]"
        role="menu"
        @click="close"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.sc-dropdown {
  position: relative;
  display: inline-block;
}

.sc-dropdown__panel {
  position: absolute;
  z-index: var(--z-dialog);
  max-height: min(70vh, 480px);
  overflow-y: auto;
}

.sc-dropdown__panel--bottom {
  top: calc(100% + 6px);
  right: 0;
  transform-origin: top right;
}

.sc-dropdown__panel--bottom.sc-dropdown__panel--start {
  right: auto;
  left: 0;
  transform-origin: top left;
}

.sc-dropdown__panel--top {
  bottom: calc(100% + 6px);
  right: 0;
  transform-origin: bottom right;
}

.sc-dropdown__panel--top.sc-dropdown__panel--start {
  right: auto;
  left: 0;
  transform-origin: bottom left;
}

/* 顶部弹出动画微调 */
.sc-dropdown-fade-enter-from .sc-dropdown__panel--top,
.sc-dropdown-fade-leave-to .sc-dropdown__panel--top {
  transform: scale(0.96) translateY(4px);
}
</style>
