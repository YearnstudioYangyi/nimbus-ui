<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "info" | "success" | "warning" | "danger";
    title?: string;
    icon?: string;
    dismissible?: boolean;
  }>(),
  {
    variant: "info",
    title: "",
    icon: "",
    dismissible: false
  }
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const visible = ref(true);

const defaultIcon = computed(() => {
  if (props.icon) return props.icon;
  switch (props.variant) {
    case "success": return "bi-check-circle-fill";
    case "warning": return "bi-exclamation-triangle-fill";
    case "danger": return "bi-exclamation-octagon-fill";
    default: return "bi-info-circle-fill";
  }
});

function handleClose() {
  visible.value = false;
  emit("close");
}
</script>

<template>
  <div
    v-if="visible"
    class="notice"
    :class="`notice--${variant}`"
    role="alert"
  >
    <slot name="icon">
      <i :class="['bi', defaultIcon]" aria-hidden="true"></i>
    </slot>

    <div class="sc-notice__content">
      <div v-if="title" class="sc-notice__title">{{ title }}</div>
      <div class="sc-notice__body">
        <slot />
      </div>
    </div>

    <div v-if="$slots.actions || dismissible" class="sc-notice__actions">
      <slot name="actions" />
      <button
        v-if="dismissible"
        class="sc-notice__close"
        type="button"
        aria-label="关闭提示"
        @click="handleClose"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sc-notice__content {
  flex: 1;
  min-width: 0;
}

.sc-notice__title {
  font-weight: 500;
  margin-bottom: 2px;
}

.sc-notice__body {
  font-size: var(--fs-sm);
  line-height: 1.5;
}

.sc-notice__actions {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-left: auto;
  flex: none;
}

.sc-notice__close {
  border: 0;
  background: transparent;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 13px;
  line-height: 1;
  transition: opacity var(--dur-fast) var(--ease);
}

.sc-notice__close:hover {
  opacity: 1;
}
</style>
