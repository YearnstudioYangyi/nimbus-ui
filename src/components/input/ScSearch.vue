<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    placeholder: "搜索...",
    disabled: false
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search", value: string): void;
}>();

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  emit("update:modelValue", val);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    emit("search", (e.target as HTMLInputElement).value);
  }
}
</script>

<template>
  <div class="search">
    <i class="bi bi-search"></i>
    <input
      type="search"
      class="input"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      @keydown="onKeydown"
    />
  </div>
</template>
