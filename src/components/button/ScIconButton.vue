<script setup lang="ts">
import { computed } from "vue";
import { vRipple } from "../../directives/ripple";

const props = withDefaults(
  defineProps<{
    size?: "sm" | "md";
    danger?: boolean;
    disabled?: boolean;
    title?: string;
    ariaLabel?: string;
    type?: "button" | "submit" | "reset";
    ripple?: boolean;
  }>(),
  {
    size: "md",
    danger: false,
    disabled: false,
    type: "button",
    ripple: true
  }
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const classes = computed(() => [
  "icon-btn",
  props.size === "sm" ? "icon-btn--sm" : "",
  props.danger ? "icon-btn--danger" : ""
]);
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled"
    :title="title"
    :aria-label="ariaLabel || title"
    v-ripple="ripple && !disabled"
    @click="(e) => !disabled && emit('click', e)"
  >
    <slot />
  </button>
</template>
