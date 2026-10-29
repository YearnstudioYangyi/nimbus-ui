<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
    maxlength?: number;
    showCount?: boolean;
    error?: string;
    hint?: string;
    required?: boolean;
  }>(),
  {
    label: "",
    placeholder: "请输入内容...",
    disabled: false,
    rows: 4,
    maxlength: undefined,
    showCount: false,
    error: "",
    hint: "",
    required: false
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const currentLength = computed(() => (props.modelValue ? props.modelValue.length : 0));

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
}
</script>

<template>
  <div class="field">
    <div class="u-row-between">
      <label v-if="label" class="field__label">
        {{ label }}
        <span v-if="required" class="field__req">*</span>
      </label>
      <span v-if="showCount" class="field__hint" style="margin-top: 0">
        {{ currentLength }}{{ maxlength ? ` / ${maxlength}` : "" }}
      </span>
    </div>

    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      class="textarea"
      :class="{ 'textarea--invalid': Boolean(error) }"
      @input="onInput"
    ></textarea>

    <p v-if="error" class="field__error">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>
