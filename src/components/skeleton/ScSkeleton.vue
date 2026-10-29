<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    width?: string | number;
    height?: string | number;
    circle?: boolean;
    rows?: number;
  }>(),
  {
    width: "100%",
    height: "20px",
    circle: false,
    rows: 1
  }
);

const style = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  height: typeof props.height === "number" ? `${props.height}px` : props.height,
  borderRadius: props.circle ? "50%" : undefined
}));
</script>

<template>
  <div v-if="rows > 1" class="sc-skeleton-group">
    <div
      v-for="i in rows"
      :key="i"
      class="skeleton"
      :style="[
        style,
        i === 1 ? { width: '40%', height: '24px', marginBottom: '8px' } : { marginBottom: '8px' }
      ]"
    ></div>
  </div>
  <div v-else class="skeleton" :style="style"></div>
</template>

<style scoped>
.sc-skeleton-group {
  display: flex;
  flex-direction: column;
}
</style>
