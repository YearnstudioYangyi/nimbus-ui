<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    compact?: boolean;
  }>(),
  { label: "赞助者", compact: false }
);
</script>

<template>
  <span
    class="sponsor-badge"
    :class="{ 'sponsor-badge--compact': compact }"
    :title="label"
  >
    <i class="bi bi-patch-check-fill" aria-hidden="true"></i>
    <span v-if="!compact">{{ label }}</span>
  </span>
</template>

<style scoped>
.sponsor-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid rgba(217, 196, 140, 0.42);
  border-radius: var(--r-full);
  background: rgba(217, 196, 140, 0.1);
  color: #7d6524;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.7;
  white-space: nowrap;
  vertical-align: middle;
}

.sponsor-badge--compact {
  padding: 2px 6px;
}

.sponsor-badge i {
  font-size: 11px;
}

:root[data-theme="dark"] .sponsor-badge,
:root[data-theme="gold"] .sponsor-badge {
  border-color: rgba(217, 196, 140, 0.32);
  color: #ebdcb4;
}
</style>
