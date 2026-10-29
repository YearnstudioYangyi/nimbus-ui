<script setup lang="ts">
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

withDefaults(
  defineProps<{
    title: string;
    desc?: string;
    crumbs?: BreadcrumbItem[];
  }>(),
  { desc: "", crumbs: () => [] }
);
</script>

<template>
  <header class="sc-page-head">
    <div class="u-grow">
      <nav v-if="crumbs?.length" class="sc-crumbs" aria-label="面包屑">
        <template v-for="(crumb, index) in crumbs" :key="index">
          <a v-if="crumb.href" :href="crumb.href">{{ crumb.label }}</a>
          <span v-else>{{ crumb.label }}</span>
          <i
            v-if="index < crumbs.length - 1"
            class="bi bi-chevron-right"
            style="font-size: 10px"
          ></i>
        </template>
      </nav>

      <h1 class="sc-page-head__title">{{ title }}</h1>
      <p v-if="desc" class="sc-page-head__desc">{{ desc }}</p>
      <slot />
    </div>

    <div v-if="$slots.actions" class="sc-page-head__actions">
      <slot name="actions" />
    </div>
  </header>
</template>
