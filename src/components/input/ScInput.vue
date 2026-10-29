<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string | number;
    label?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    mono?: boolean;
    type?: string;
  }>(),
  {
    modelValue: "",
    label: "",
    hint: "",
    error: "",
    required: false,
    disabled: false,
    placeholder: "",
    mono: false,
    type: "text"
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="field">
    <label v-if="label" class="field__label">
      {{ label }}
      <span v-if="required" class="field__req">*</span>
    </label>

    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="input"
      :class="[
        { 'input--invalid': Boolean(error) },
        { 'input--mono': mono }
      ]"
      @input="onInput"
    />

    <p v-if="error" class="field__error">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>
