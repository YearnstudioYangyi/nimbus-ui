<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "success" | "warning" | "danger" | "info" | "outline" | "default";
    interactive?: boolean;
    active?: boolean;
  }>(),
  {
    variant: "default",
    interactive: false,
    active: false
  }
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const classes = computed(() => [
  "chip",
  props.variant !== "default" ? `chip--${props.variant}` : "",
  props.interactive ? "chip--button" : "",
  props.active ? "is-active" : ""
]);
</script>

<template>
  <component
    :is="interactive ? 'button' : 'span'"
    :type="interactive ? 'button' : undefined"
    :class="classes"
    @click="(e: MouseEvent) => interactive && emit('click', e)"
  >
    <slot />
  </component>
</template>
