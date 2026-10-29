<script setup lang="ts">
import { watch } from "vue";
import { useTheme, type ThemeMode } from "../../composables/useTheme";

const props = withDefaults(
  defineProps<{
    theme?: ThemeMode;
    tag?: string;
  }>(),
  {
    theme: undefined,
    tag: "div"
  }
);

// 若指定了 theme，与 useTheme 联动
const { setTheme } = useTheme();
if (props.theme) {
  setTheme(props.theme);
}
watch(
  () => props.theme,
  (newTheme) => {
    if (newTheme) {
      setTheme(newTheme);
    }
  }
);
</script>

<template>
  <component :is="tag" class="sc-config-provider">
    <slot></slot>
  </component>
</template>

<style scoped>
.sc-config-provider {
  display: contents;
}
</style>
