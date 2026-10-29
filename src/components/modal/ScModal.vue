<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, nextTick } from "vue";

let activeModalCount = 0;

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    wide?: boolean;
    dismissible?: boolean;
    scrimClass?: string;
  }>(),
  {
    wide: false,
    dismissible: true,
    scrimClass: ""
  }
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const panel = ref<HTMLElement | null>(null);
let previouslyFocused: HTMLElement | null = null;
let isOpenTracked = false;

function requestClose() {
  if (props.dismissible) emit("close");
}

function onKeydown(event: KeyboardEvent) {
  if (!props.open) return;
  if (event.key === "Escape") {
    requestClose();
    return;
  }
  if (event.key !== "Tab" || !panel.value) return;

  const focusable = panel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (open) => {
    if (typeof document === "undefined") return;
    if (open) {
      if (!isOpenTracked) {
        isOpenTracked = true;
        activeModalCount++;
      }
      document.body.style.overflow = "hidden";
      previouslyFocused = document.activeElement as HTMLElement | null;
      await nextTick();
      panel.value
        ?.querySelector<HTMLElement>("input, textarea, select, button:not([disabled])")
        ?.focus();
    } else {
      if (isOpenTracked) {
        isOpenTracked = false;
        activeModalCount = Math.max(0, activeModalCount - 1);
      }
      if (activeModalCount === 0) {
        document.body.style.overflow = "";
      }
      previouslyFocused?.focus?.();
    }
  },
  { immediate: true }
);

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
      activeModalCount = Math.max(0, activeModalCount - 1);
    }
    if (activeModalCount === 0) {
      document.body.style.overflow = "";
    }
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="sc-dialog">
      <div
        v-if="open"
        :class="['sc-dialog-scrim', scrimClass]"
        @click.self="requestClose"
      >
        <div
          ref="panel"
          class="sc-dialog"
          :class="{ 'sc-dialog--wide': wide }"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
          <h2 class="sc-dialog__title">{{ title }}</h2>
          <div class="sc-dialog__body">
            <slot />
          </div>
          <div v-if="$slots.actions" class="sc-dialog__actions">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
