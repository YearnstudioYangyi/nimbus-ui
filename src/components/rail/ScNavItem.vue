<script setup lang="ts">
import { computed } from "vue";
import ScBadge from "../badge/ScBadge.vue";
import { vRipple } from "../../directives/ripple";

const props = withDefaults(
  defineProps<{
    label: string;
    icon?: string;
    active?: boolean;
    badge?: number | string;
    href?: string;
    staggerIndex?: number;
    direction?: "forward" | "back";
    ripple?: boolean;
  }>(),
  {
    icon: "",
    active: false,
    badge: 0,
    href: "",
    staggerIndex: 0,
    direction: "forward",
    ripple: true
  }
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const isLink = computed(() => Boolean(props.href));

const animationStyle = computed(() => {
  if (props.staggerIndex <= 0) return undefined;
  const delayMs = Math.min((props.staggerIndex - 1) * 25, 175);
  return {
    animationDelay: `${delayMs}ms`
  };
});
</script>

<template>
  <component
    :is="isLink ? 'a' : 'button'"
    :href="isLink ? href : undefined"
    :type="isLink ? undefined : 'button'"
    class="sc-nav-item"
    :class="[
      { 'is-active': active },
      direction === 'back' ? 'sc-rail-item-in--back' : 'sc-rail-item-in'
    ]"
    :style="animationStyle"
    :title="label"
    v-ripple="ripple"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <span v-if="icon || $slots.icon" class="sc-nav-item__icon">
      <slot name="icon">
        <i :class="['bi', icon]"></i>
      </slot>
    </span>
    <span class="sc-nav-item__label">{{ label }}</span>
    <span v-if="Boolean(badge)" class="sc-nav-item__trail">
      <ScBadge :count="badge" />
    </span>
  </component>
</template>
