<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    collapsed?: boolean;
    brandName?: string;
    logoSrc?: string;
    collapsible?: boolean;
  }>(),
  {
    collapsed: false,
    brandName: "Nimbus UI",
    logoSrc: "",
    collapsible: true
  }
);

const emit = defineEmits<{
  (e: "update:collapsed", value: boolean): void;
  (e: "toggleCollapse"): void;
}>();

function toggle() {
  emit("update:collapsed", !props.collapsed);
  emit("toggleCollapse");
}

const collapseTitle = computed(() => (props.collapsed ? "展开导航" : "收起导航"));
</script>

<template>
  <aside class="sc-rail" :class="{ 'sc-rail--collapsed': collapsed }" aria-label="主侧边导航">
    <div class="sc-rail__brand">
      <slot name="brand">
        <img v-if="logoSrc" class="sc-rail__logo" :src="logoSrc" :alt="brandName" />
        <span class="sc-rail__brand-text">{{ brandName }}</span>
      </slot>
    </div>

    <div class="sc-rail__scroll">
      <slot />
    </div>

    <div v-if="collapsible" class="sc-rail__foot">
      <slot name="footer">
        <button
          class="sc-nav-item sc-rail__collapse"
          type="button"
          :aria-label="collapseTitle"
          :title="collapseTitle"
          @click="toggle"
        >
          <span class="sc-nav-item__icon">
            <i
              :class="[
                'bi',
                collapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'
              ]"
            ></i>
          </span>
          <span class="sc-nav-item__label">{{ collapseTitle }}</span>
        </button>
      </slot>
    </div>
  </aside>
</template>

<style scoped>
.sc-rail__collapse {
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  margin-bottom: 0;
}
</style>
