<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { vRipple } from "../../directives/ripple";

export interface TabItem {
  label: string;
  value: string | number;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    items: TabItem[];
    ripple?: boolean;
  }>(),
  {
    ripple: true
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "change", value: string | number): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const tabRefs = ref<HTMLElement[]>([]);

const indicatorStyle = ref<{
  transform: string;
  width: string;
  opacity: number;
}>({
  transform: "translateX(0px)",
  width: "0px",
  opacity: 0
});

function updateIndicator() {
  if (!containerRef.value) return;
  const idx = props.items.findIndex((item) => item.value === props.modelValue);
  if (idx === -1 || !tabRefs.value[idx]) {
    indicatorStyle.value.opacity = 0;
    return;
  }

  const activeTabEl = tabRefs.value[idx];
  const offsetLeft = activeTabEl.offsetLeft;
  const clientWidth = activeTabEl.clientWidth;

  // 内缩间距让指示条与文本对齐（类似 Material 风格左右各留 padding）
  const inset = Math.min(12, Math.max(4, Math.floor(clientWidth * 0.12)));
  const indicatorWidth = Math.max(clientWidth - inset * 2, 16);
  const indicatorLeft = offsetLeft + inset;

  indicatorStyle.value = {
    transform: `translateX(${indicatorLeft}px)`,
    width: `${indicatorWidth}px`,
    opacity: 1
  };
}

function scrollActiveTabIntoView(idx: number) {
  const container = containerRef.value;
  const tab = tabRefs.value[idx];
  if (!container || !tab) return;

  const containerWidth = container.clientWidth;
  const scrollLeft = container.scrollLeft;
  const tabLeft = tab.offsetLeft;
  const tabWidth = tab.clientWidth;

  const padding = 16;

  if (tabLeft < scrollLeft + padding) {
    container.scrollTo({
      left: Math.max(0, tabLeft - padding),
      behavior: "smooth"
    });
  } else if (tabLeft + tabWidth > scrollLeft + containerWidth - padding) {
    container.scrollTo({
      left: tabLeft + tabWidth - containerWidth + padding,
      behavior: "smooth"
    });
  }
}

function selectTab(item: TabItem) {
  if (item.disabled || item.value === props.modelValue) return;
  emit("update:modelValue", item.value);
  emit("change", item.value);
}

function onKeydown(e: KeyboardEvent) {
  const enabledItems = props.items.filter((item) => !item.disabled);
  if (!enabledItems.length) return;

  const currentIdx = enabledItems.findIndex((item) => item.value === props.modelValue);
  let targetItem: TabItem | undefined;

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    targetItem = enabledItems[(currentIdx + 1) % enabledItems.length];
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    targetItem = enabledItems[(currentIdx - 1 + enabledItems.length) % enabledItems.length];
  } else if (e.key === "Home") {
    e.preventDefault();
    targetItem = enabledItems[0];
  } else if (e.key === "End") {
    e.preventDefault();
    targetItem = enabledItems[enabledItems.length - 1];
  }

  if (targetItem) {
    selectTab(targetItem);
    const targetIdx = props.items.findIndex((item) => item.value === targetItem?.value);
    tabRefs.value[targetIdx]?.focus();
  }
}

watch(
  () => props.modelValue,
  () => {
    nextTick(() => {
      updateIndicator();
      const idx = props.items.findIndex((item) => item.value === props.modelValue);
      if (idx !== -1) {
        scrollActiveTabIntoView(idx);
      }
    });
  }
);

watch(
  () => props.items,
  () => {
    nextTick(() => {
      updateIndicator();
      const idx = props.items.findIndex((item) => item.value === props.modelValue);
      if (idx !== -1) {
        scrollActiveTabIntoView(idx);
      }
    });
  },
  { deep: true }
);

let resizeObserver: ResizeObserver | null = null;
let rafId: number | null = null;

onMounted(() => {
  nextTick(() => {
    updateIndicator();
    const idx = props.items.findIndex((item) => item.value === props.modelValue);
    if (idx !== -1) {
      scrollActiveTabIntoView(idx);
    }
    if (typeof ResizeObserver !== "undefined" && containerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          updateIndicator();
          rafId = null;
        });
      });
      resizeObserver.observe(containerRef.value);
    }
  });
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="tabs tabs--sliding"
    role="tablist"
    @keydown="onKeydown"
  >
    <div class="tabs__track">
      <button
        v-for="(item, idx) in items"
        :key="item.value"
        :ref="(el) => { if (el) tabRefs[idx] = el as HTMLElement; }"
        type="button"
        role="tab"
        :aria-selected="modelValue === item.value"
        :disabled="item.disabled"
        class="tab"
        :class="{ 'is-active': modelValue === item.value }"
        v-ripple="ripple && !item.disabled"
        @click="selectTab(item)"
      >
        <i v-if="item.icon" :class="['bi', item.icon]" style="margin-right: 6px"></i>
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="dot-badge" style="margin-left: 6px">{{ item.badge }}</span>
      </button>

      <!-- 真实物理滑动下划线指示器 -->
      <div
        class="tabs__sliding-bar"
        :style="{
          transform: indicatorStyle.transform,
          width: indicatorStyle.width,
          opacity: indicatorStyle.opacity
        }"
        aria-hidden="true"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.tabs--sliding {
  position: relative;
}

.tabs__track {
  display: inline-flex;
  align-items: center;
  position: relative;
  min-width: 100%;
  gap: var(--sp-1);
}

/* 隐藏原本静态的 ::after 伪元素，换用真实位移的 sliding bar */
.tabs--sliding :deep(.tab.is-active::after) {
  display: none !important;
}

.tabs__sliding-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: var(--primary);
  border-radius: 3px 3px 0 0;
  pointer-events: none;
  transition:
    transform var(--dur-slow) var(--ease),
    width var(--dur) var(--ease),
    opacity var(--dur-fast) var(--ease);
}

@media (prefers-reduced-motion: reduce) {
  .tabs__sliding-bar {
    transition: none !important;
  }
}
</style>
