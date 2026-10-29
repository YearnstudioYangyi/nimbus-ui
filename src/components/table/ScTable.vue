<script setup lang="ts">
export interface TableColumn {
  key: string;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
}

withDefaults(
  defineProps<{
    columns?: TableColumn[];
    data?: Array<Record<string, unknown>>;
    compact?: boolean;
    hover?: boolean;
    emptyText?: string;
  }>(),
  {
    columns: () => [],
    data: () => [],
    compact: false,
    hover: true,
    emptyText: "暂无数据"
  }
);
</script>

<template>
  <div class="table-wrap">
    <table class="table" :class="{ 'table--compact': compact }">
      <thead>
        <slot name="header">
          <tr v-if="columns.length">
            <th
              v-for="col in columns"
              :key="col.key"
              :style="[
                col.width ? { width: col.width } : {},
                col.align ? { textAlign: col.align } : {}
              ]"
            >
              {{ col.title }}
            </th>
          </tr>
        </slot>
      </thead>
      <tbody>
        <slot>
          <template v-if="data.length">
            <tr v-for="(row, rIdx) in data" :key="rIdx">
              <td
                v-for="col in columns"
                :key="col.key"
                :style="col.align ? { textAlign: col.align } : {}"
              >
                <slot :name="`cell-${col.key}`" :row="row" :column="col" :index="rIdx">
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td :colspan="Math.max(columns.length, 1)" style="text-align: center; padding: var(--sp-8)">
              <slot name="empty">
                <div class="u-col" style="align-items: center; gap: 8px; color: var(--text-3)">
                  <i class="bi bi-inbox" style="font-size: 24px"></i>
                  <span>{{ emptyText }}</span>
                </div>
              </slot>
            </td>
          </tr>
        </slot>
      </tbody>
    </table>
  </div>
</template>
