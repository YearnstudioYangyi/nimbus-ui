<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    desc?: string;
    hover?: boolean;
    pad?: boolean;
    flush?: boolean;
    href?: string;
  }>(),
  {
    title: "",
    desc: "",
    hover: false,
    pad: false,
    flush: false,
    href: ""
  }
);

const isLink = computed(() => Boolean(props.href));

const cardClasses = computed(() => [
  "card",
  props.pad ? "card--pad" : "",
  props.hover ? "card--hover" : "",
  isLink.value ? "card--link" : ""
]);
</script>

<template>
  <component :is="isLink ? 'a' : 'div'" :href="isLink ? href : undefined" :class="cardClasses">
    <div v-if="title || $slots.header || $slots.actions" class="card__head">
      <div>
        <slot name="header">
          <h3 v-if="title" class="card__title">{{ title }}</h3>
          <p v-if="desc" class="card__desc">{{ desc }}</p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="card__actions">
        <slot name="actions" />
      </div>
    </div>

    <div :class="['card__body', { 'card__body--flush': flush }]">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card__foot">
      <slot name="footer" />
    </div>
  </component>
</template>
