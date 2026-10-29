<script setup lang="ts">
import { computed } from "vue";
import { vRipple } from "../../directives/ripple";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "tonal" | "outline" | "ghost" | "danger" | "danger-text";
    size?: "sm" | "md" | "lg";
    cta?: boolean;
    loading?: boolean;
    block?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    ripple?: boolean;
    href?: string;
  }>(),
  {
    variant: "primary",
    size: "md",
    cta: false,
    loading: false,
    block: false,
    disabled: false,
    type: "button",
    ripple: true,
    href: ""
  }
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const isLink = computed(() => Boolean(props.href));

const classes = computed(() => [
  "btn",
  `btn--${props.variant}`,
  props.size !== "md" ? `btn--${props.size}` : "",
  props.cta ? "btn--cta" : "",
  props.block ? "btn--block" : ""
]);

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) return;
  emit("click", event);
}
</script>

<template>
  <component
    :is="isLink ? 'a' : 'button'"
    :href="isLink ? href : undefined"
    :type="isLink ? undefined : type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading"
    v-ripple="ripple && !disabled && !loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true"></span>
    <slot name="icon" v-else-if="$slots.icon" />
    <slot />
  </component>
</template>
