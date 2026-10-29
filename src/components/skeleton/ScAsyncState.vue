<script setup lang="ts">
withDefaults(
  defineProps<{
    pending?: boolean;
    initial?: boolean;
    error?: string | null;
    errorTitle?: string;
    retryText?: string;
    empty?: boolean;
    emptyIcon?: string;
    emptyTitle?: string;
    emptyDesc?: string;
    skeletonRows?: number;
  }>(),
  {
    pending: false,
    initial: false,
    error: null,
    errorTitle: "加载失败",
    retryText: "重试",
    empty: false,
    emptyIcon: "bi-inbox",
    emptyTitle: "暂无数据",
    emptyDesc: "",
    skeletonRows: 4
  }
);

const emit = defineEmits<{
  (e: "retry"): void;
}>();
</script>

<template>
  <Transition name="sc-fade" mode="out-in">
    <div v-if="initial && pending" key="skeleton" class="sc-async-skeleton" aria-busy="true" aria-live="polite">
      <div v-for="n in skeletonRows" :key="n" class="skeleton sc-async-skeleton__row"></div>
    </div>

    <div v-else-if="error" key="error" class="empty">
      <div class="empty__icon" style="color: var(--danger)">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <p class="empty__title">{{ errorTitle }}</p>
      <p class="empty__desc">{{ error }}</p>
      <button class="btn btn--outline btn--sm" type="button" @click="emit('retry')">
        <i class="bi bi-arrow-clockwise"></i>
        {{ retryText }}
      </button>
    </div>

    <div v-else-if="empty" key="empty" class="empty">
      <div class="empty__icon"><i :class="['bi', emptyIcon]"></i></div>
      <p class="empty__title">{{ emptyTitle }}</p>
      <p v-if="emptyDesc" class="empty__desc">
        {{ emptyDesc }}
      </p>
      <slot name="empty-action" />
    </div>

    <div v-else key="content" :class="{ 'sc-async--refreshing': pending }">
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.sc-async-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.sc-async-skeleton__row {
  height: 52px;
}

.sc-async--refreshing {
  opacity: 0.6;
  pointer-events: none;
  transition: opacity var(--dur) var(--ease);
}
</style>
