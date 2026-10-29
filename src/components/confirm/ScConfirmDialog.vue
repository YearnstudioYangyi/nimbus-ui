<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ScModal from "../modal/ScModal.vue";
import { useConfirm } from "../../composables/useConfirm";

const { confirmState, resolveConfirm } = useConfirm();
const typed = ref("");

const options = computed(() => confirmState.value.options);
const open = computed(() => confirmState.value.open);

/** 挑战模式：必须严格匹配输入文本才允许确认 */
const blocked = computed(() => {
  if (!options.value.challenge) return false;
  return typed.value.trim() !== options.value.challenge;
});

watch(open, (isOpen) => {
  if (isOpen) typed.value = "";
});
</script>

<template>
  <ScModal
    :open="open"
    :title="options.title || '提示'"
    :dismissible="true"
    scrim-class="sc-dialog-scrim--confirm"
    @close="resolveConfirm(false)"
  >
    <p v-if="options.body" style="white-space: pre-line">{{ options.body }}</p>

    <label v-if="options.challenge" class="field" style="margin: var(--sp-5) 0 0">
      <span class="field__label">
        {{ options.challengeLabel || `请输入确认文本: "${options.challenge}"` }}
      </span>
      <input
        v-model="typed"
        class="input input--mono"
        type="text"
        autocomplete="off"
        spellcheck="false"
        @keydown.enter="!blocked && resolveConfirm(true)"
      />
    </label>

    <template #actions>
      <button class="btn btn--ghost" type="button" @click="resolveConfirm(false)">
        {{ options.cancelText || '取消' }}
      </button>
      <button
        class="btn"
        :class="options.danger ? 'btn--danger' : 'btn--primary'"
        type="button"
        :disabled="blocked"
        @click="resolveConfirm(true)"
      >
        {{ options.confirmText || '确定' }}
      </button>
    </template>
  </ScModal>
</template>
