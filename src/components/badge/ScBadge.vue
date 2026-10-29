<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    count?: number | string;
    max?: number;
    dot?: boolean;
  }>(),
  {
    count: 0,
    max: 99,
    dot: false
  }
);

const displayValue = computed(() => {
  if (props.dot) return "";
  const num = Number(props.count);
  if (!Number.isNaN(num) && num > props.max) {
    return `${props.max}+`;
  }
  return String(props.count);
});
</script>

<template>
  <span
    v-if="dot || Boolean(count)"
    class="dot-badge"
    :class="{ 'dot-badge--dot': dot }"
  >
    {{ displayValue }}
  </span>
</template>

<style scoped>
.dot-badge--dot {
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
}
</style>
