<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";

let activeDrawerCount = 0;

const props = withDefaults(
  defineProps<{
    open: boolean;
    placement?: "left" | "right" | "bottom";
    title?: string;
    width?: string | number;
    height?: string | number;
    dismissible?: boolean;
    closeLabel?: string;
  }>(),
  {
    placement: "right",
    title: "",
    width: "380px",
    height: "50vh",
    dismissible: true,
    closeLabel: "关闭"
  }
);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update:open", value: boolean): void;
}>();

const panelRef = ref<HTMLElement | null>(null);
let isOpenTracked = false;

function close() {
  if (props.dismissible) {
    emit("close");
    emit("update:open", false);
  }
}

function onKeydown(e: KeyboardEvent) {
  if (props.open && e.key === "Escape") {
    close();
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      if (!isOpenTracked) {
        isOpenTracked = true;
        activeDrawerCount++;
      }
      document.body.style.overflow = "hidden";
      await nextTick();
      panelRef.value?.focus();
    }
  },
  { immediate: true }
);

function handleAfterLeave() {
  if (isOpenTracked) {
    isOpenTracked = false;
    activeDrawerCount = Math.max(0, activeDrawerCount - 1);
  }
  if (activeDrawerCount === 0 && typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
}

onMounted(() => {
  if (typeof document !== "undefined") {
    document.addEventListener("keydown", onKeydown);
  }
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", onKeydown);
    if (isOpenTracked) {
      isOpenTracked = false;
      activeDrawerCount = Math.max(0, activeDrawerCount - 1);
    }
    if (activeDrawerCount === 0) {
      document.body.style.overflow = "";
    }
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition
      :name="`sc-drawer-${placement}`"
      :duration="300"
      @after-leave="handleAfterLeave"
    >
      <div v-if="open" class="sc-drawer-root">
        <!-- 遮罩 -->
        <div class="sc-scrim" @click="close"></div>

        <!-- 抽屉面板 -->
        <div
          ref="panelRef"
          class="sc-drawer"
          :class="`sc-drawer--${placement}`"
          :style="[
            placement === 'bottom'
              ? { height: typeof height === 'number' ? `${height}px` : height }
              : { width: typeof width === 'number' ? `${width}px` : width }
          ]"
          role="dialog"
          aria-modal="true"
          :aria-label="title || closeLabel"
          tabindex="-1"
        >
          <div v-if="title || $slots.header" class="sc-drawer__head">
            <slot name="header">
              <h3 class="sc-drawer__title">{{ title }}</h3>
            </slot>
            <button
              class="icon-btn icon-btn--sm"
              type="button"
              :aria-label="closeLabel"
              :title="closeLabel"
              @click="close"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="sc-drawer__body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="sc-drawer__foot">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sc-drawer-root {
  position: fixed;
  inset: 0;
  z-index: var(--z-dialog);
  pointer-events: auto;
}

.sc-drawer {
  position: fixed;
  background: var(--bg-elevated);
  box-shadow: var(--shadow-3);
  display: flex;
  flex-direction: column;
  z-index: calc(var(--z-dialog) + 1);
  box-sizing: border-box;
  outline: none;
}

.sc-drawer--right {
  top: 0;
  bottom: 0;
  right: 0;
  max-width: 90vw;
  border-left: 1px solid var(--outline-soft);
}

.sc-drawer--left {
  top: 0;
  bottom: 0;
  left: 0;
  max-width: 90vw;
  border-right: 1px solid var(--outline-soft);
}

.sc-drawer--bottom {
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 90vh;
  border-top: 1px solid var(--outline-soft);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
}

.sc-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: var(--sp-4) var(--sp-6);
  border-bottom: 1px solid var(--outline-soft);
}

.sc-drawer__title {
  margin: 0;
  font-size: var(--fs-lg);
  font-weight: 500;
  color: var(--text);
}

.sc-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--sp-6);
}

.sc-drawer__foot {
  padding: var(--sp-4) var(--sp-6);
  border-top: 1px solid var(--outline-soft);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--sp-2);
}
</style>
