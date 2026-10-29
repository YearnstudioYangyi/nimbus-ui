<script setup lang="ts">
import { ref } from "vue";
import { copyText } from "../../utils/format";
import { useToast } from "../../composables/useToast";

const props = withDefaults(
  defineProps<{
    value: string;
    secret?: boolean;
    label?: string;
    copyTooltip?: string;
    copiedText?: string;
    showTooltip?: string;
    hideTooltip?: string;
  }>(),
  {
    secret: false,
    label: "",
    copyTooltip: "复制",
    copiedText: "已复制",
    showTooltip: "显示",
    hideTooltip: "隐藏"
  }
);

const emit = defineEmits<{
  (e: "copy", success: boolean): void;
}>();

const { toast } = useToast();
const revealed = ref(!props.secret);

async function copy() {
  const ok = await copyText(props.value);
  if (ok) {
    toast.success(props.label ? `${props.label}: ${props.copiedText}` : props.copiedText);
  } else {
    toast.error("复制到剪贴板失败");
  }
  emit("copy", ok);
}
</script>

<template>
  <div class="codebox">
    <pre>{{ revealed ? value : "•".repeat(Math.min(40, value.length || 16)) }}</pre>
    <button
      v-if="secret"
      class="icon-btn icon-btn--sm"
      type="button"
      :aria-label="revealed ? hideTooltip : showTooltip"
      :title="revealed ? hideTooltip : showTooltip"
      @click="revealed = !revealed"
    >
      <i :class="['bi', revealed ? 'bi-eye-slash' : 'bi-eye']"></i>
    </button>
    <button
      class="icon-btn icon-btn--sm"
      type="button"
      :aria-label="copyTooltip"
      :title="copyTooltip"
      @click="copy"
    >
      <i class="bi bi-clipboard"></i>
    </button>
  </div>
</template>
