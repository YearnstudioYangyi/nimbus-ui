<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { hashHue, initials } from "../../utils/format";

const props = withDefaults(
  defineProps<{
    src?: string | null;
    name?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    square?: boolean;
    title?: string | null;
  }>(),
  { src: "", name: "", size: "md", square: false, title: undefined }
);

const failed = ref(false);
watch(
  () => props.src,
  () => (failed.value = false)
);

const showImage = computed(() => Boolean(props.src) && !failed.value);
const letter = computed(() => initials(props.name));
const tint = computed(() => `var(--viz-${hashHue(props.name || props.src || "?")})`);
const tooltip = computed(() => (props.title === undefined ? props.name : props.title) || undefined);

const sizeClass = computed(() => {
  if (props.size === "sm") return "avatar--sm";
  if (props.size === "lg") return "avatar--lg";
  if (props.size === "xl") return "avatar--xl";
  return "";
});
</script>

<template>
  <span
    class="avatar"
    :class="[sizeClass, { 'avatar--square': square }]"
    :style="showImage ? undefined : { background: tint }"
    :title="tooltip"
  >
    <img
      v-if="showImage"
      :src="src as string"
      :alt="name || '头像'"
      loading="lazy"
      @error="failed = true"
    />
    <template v-else>{{ letter }}</template>
  </span>
</template>
