<script setup lang="ts">
withDefaults(
  defineProps<{
    viewKey?: string | number;
    mode?: "out-in" | "default" | "in-out";
  }>(),
  {
    viewKey: "",
    mode: "out-in"
  }
);
</script>

<template>
  <Transition name="sc-view" :mode="mode">
    <div :key="viewKey" class="sc-view">
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.sc-view {
  width: 100%;
}
</style>
