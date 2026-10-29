<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    delta?: string;
    icon?: string;
  }>(),
  { delta: "", icon: "" }
);
</script>

<template>
  <div class="stat">
    <div class="stat__label">
      <i v-if="icon" :class="['bi', icon]"></i>
      <span>{{ label }}</span>
    </div>
    <div class="stat__value">{{ value }}</div>
    <div v-if="delta || $slots.delta" class="stat__delta">
      <slot name="delta">{{ delta }}</slot>
    </div>
  </div>
</template>
