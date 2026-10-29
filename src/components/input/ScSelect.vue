<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
  divider?: boolean;
}

let selectSeq = 0;

const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    hint?: string;
    required?: boolean;
    menuLabel?: string;
    id?: string;
  }>(),
  {
    label: "",
    placeholder: "请选择",
    disabled: false,
    error: "",
    hint: "",
    required: false,
    menuLabel: "",
    id: undefined
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "change", value: string | number): void;
}>();

const uniqueId = `sc-select-${++selectSeq}`;
const selectId = computed(() => props.id || uniqueId);
const menuId = computed(() => `${selectId.value}-menu`);

const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const open = ref(false);
const placement = ref<"bottom" | "top">("bottom");
const activeIndex = ref(-1);

const selectedOption = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue);
});

const displayLabel = computed(() => {
  if (selectedOption.value) {
    return selectedOption.value.label;
  }
  return props.placeholder || "请选择";
});

function updatePlacement() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const estimatedHeight = Math.min(props.options.length * 44 + 32, 280);
  const spaceBelow = windowHeight - rect.bottom;
  const spaceAbove = rect.top;

  if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
    placement.value = "top";
  } else {
    placement.value = "bottom";
  }
}

function scrollToActiveItem() {
  if (!menuRef.value || activeIndex.value === -1) return;
  const items = menuRef.value.querySelectorAll<HTMLElement>(".sc-select__item");
  const target = items[activeIndex.value];
  if (target) {
    target.scrollIntoView({ block: "nearest" });
  }
}

function openMenu() {
  if (props.disabled) return;
  updatePlacement();
  open.value = true;

  const currentIdx = props.options.findIndex((o) => o.value === props.modelValue);
  if (currentIdx !== -1 && !props.options[currentIdx].disabled) {
    activeIndex.value = currentIdx;
  } else {
    activeIndex.value = props.options.findIndex((o) => !o.disabled);
  }

  nextTick(() => {
    scrollToActiveItem();
  });
}

function closeMenu() {
  open.value = false;
  activeIndex.value = -1;
}

function toggleOpen() {
  if (open.value) {
    closeMenu();
  } else {
    openMenu();
  }
}

function selectOption(opt: SelectOption) {
  if (opt.disabled) return;
  emit("update:modelValue", opt.value);
  emit("change", opt.value);
  closeMenu();
  triggerRef.value?.focus();
}

function onItemHover(idx: number) {
  if (props.options[idx] && !props.options[idx].disabled) {
    activeIndex.value = idx;
  }
}

function moveActive(delta: number) {
  const len = props.options.length;
  if (len === 0) return;
  let next = activeIndex.value;
  for (let i = 0; i < len; i++) {
    next = (next + delta + len) % len;
    if (!props.options[next].disabled) {
      activeIndex.value = next;
      scrollToActiveItem();
      break;
    }
  }
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (props.disabled) return;

  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!open.value) {
      openMenu();
    } else {
      moveActive(e.key === "ArrowDown" ? 1 : -1);
    }
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (!open.value) {
      openMenu();
    } else if (activeIndex.value >= 0 && activeIndex.value < props.options.length) {
      selectOption(props.options[activeIndex.value]);
    }
  } else if (e.key === "Escape" && open.value) {
    e.preventDefault();
    closeMenu();
  } else if (e.key === "Tab" && open.value) {
    closeMenu();
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!open.value) return;
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    closeMenu();
  }
}

function onScrollOrResize() {
  if (open.value) {
    window.requestAnimationFrame(updatePlacement);
  }
}

watch(
  () => props.disabled,
  (val) => {
    if (val && open.value) {
      closeMenu();
    }
  }
);

onMounted(() => {
  if (typeof document !== "undefined") {
    document.addEventListener("pointerdown", onDocumentPointerDown);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
  }
});

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("pointerdown", onDocumentPointerDown);
    window.removeEventListener("scroll", onScrollOrResize);
    window.removeEventListener("resize", onScrollOrResize);
  }
});
</script>

<template>
  <div ref="rootRef" class="field sc-select">
    <label v-if="label" class="field__label" :for="selectId">
      {{ label }}
      <span v-if="required" class="field__req">*</span>
    </label>

    <div class="sc-select__wrapper">
      <!-- 触发按钮：继承表单规范并拥有清晰的微交互与箭头反馈 -->
      <button
        :id="selectId"
        ref="triggerRef"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="menuId"
        :disabled="disabled"
        class="select sc-select__trigger"
        :class="{
          'is-open': open,
          'input--invalid': Boolean(error),
          'is-placeholder': !selectedOption
        }"
        @click="toggleOpen"
        @keydown="onTriggerKeydown"
      >
        <span class="sc-select__trigger-text">
          <i
            v-if="selectedOption?.icon"
            :class="['bi', selectedOption.icon, 'sc-select__trigger-icon']"
          ></i>
          <span class="sc-select__trigger-label">{{ displayLabel }}</span>
        </span>

        <i
          :class="[
            'bi',
            'bi-chevron-down',
            'sc-select__arrow',
            { 'is-open': open }
          ]"
        ></i>
      </button>

      <!-- 下拉面板：完全继承设计系统 .menu 风格与 .sc-dropdown-fade 动效 -->
      <Transition name="sc-dropdown-fade">
        <div
          v-if="open"
          :id="menuId"
          ref="menuRef"
          role="listbox"
          class="sc-select__menu menu"
          :class="`sc-select__menu--${placement}`"
          tabindex="-1"
        >
          <div v-if="menuLabel" class="menu__label">{{ menuLabel }}</div>

          <template v-for="(opt, idx) in options" :key="opt.value">
            <button
              type="button"
              role="option"
              :aria-selected="opt.value === modelValue"
              :disabled="opt.disabled"
              class="menu__item sc-select__item"
              :class="{
                'is-selected': opt.value === modelValue,
                'is-active': activeIndex === idx,
                'is-disabled': opt.disabled
              }"
              @click.stop="selectOption(opt)"
              @mouseenter="onItemHover(idx)"
            >
              <span class="sc-select__item-content">
                <i
                  v-if="opt.icon"
                  :class="['bi', opt.icon, 'sc-select__item-icon']"
                ></i>
                <span class="sc-select__item-label">{{ opt.label }}</span>
              </span>

              <i
                v-if="opt.value === modelValue"
                class="bi bi-check-lg sc-select__check"
              ></i>
            </button>

            <div v-if="opt.divider" class="menu__sep"></div>
          </template>
        </div>
      </Transition>
    </div>

    <!-- 兼容原生表单提交 -->
    <select
      aria-hidden="true"
      tabindex="-1"
      class="sc-select__native"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
    >
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </option>
    </select>

    <p v-if="error" class="field__error">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.sc-select {
  position: relative;
  width: 100%;
}

.sc-select__wrapper {
  position: relative;
  width: 100%;
}

/* 触发按钮定制 */
.sc-select__trigger {
  appearance: none;
  background-image: none !important; /* 清除原生 select 的双背景箭头 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid var(--outline);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--text);
  font-size: var(--fs-base);
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  transition:
    border-color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease),
    background-color var(--dur) var(--ease);
}

.sc-select__trigger:hover:not(:disabled) {
  border-color: var(--outline-strong);
}

.sc-select__trigger:focus {
  outline: none;
}

.sc-select__trigger.is-open,
.sc-select__trigger:focus-visible {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.sc-select__trigger.is-placeholder .sc-select__trigger-label {
  color: var(--text-disabled);
}

.sc-select__trigger:disabled {
  background: var(--surface-3);
  color: var(--text-disabled);
  cursor: not-allowed;
  opacity: 0.7;
}

.sc-select__trigger-text {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sc-select__trigger-icon {
  font-size: 16px;
  color: var(--text-2);
  width: 18px;
  text-align: center;
  flex: none;
}

.sc-select__trigger-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sc-select__arrow {
  font-size: 12px;
  color: var(--text-3);
  transition: transform var(--dur) var(--ease);
  flex: none;
  margin-left: var(--sp-2);
}

.sc-select__arrow.is-open {
  transform: rotate(180deg);
}

/* 下拉菜单面板 */
.sc-select__menu {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  min-width: 100%;
  box-sizing: border-box;
  z-index: var(--z-dialog);
  max-height: 260px;
  overflow-y: auto;
  overflow-x: hidden;
  outline: none;
}

.sc-select__menu--bottom {
  top: calc(100% + 6px);
  bottom: auto;
  transform-origin: top center;
}

.sc-select__menu--top {
  bottom: calc(100% + 6px);
  top: auto;
  transform-origin: bottom center;
}

/* 动效微调 */
.sc-select__menu--bottom.sc-dropdown-fade-enter-from,
.sc-select__menu--bottom.sc-dropdown-fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}

.sc-select__menu--top.sc-dropdown-fade-enter-from,
.sc-select__menu--top.sc-dropdown-fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(4px);
}

/* 菜单项样式 */
.sc-select__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.sc-select__item-content {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sc-select__item-icon {
  font-size: 16px;
  color: var(--text-3);
  width: 18px;
  text-align: center;
  flex: none;
}

.sc-select__item-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sc-select__check {
  font-size: 15px;
  color: var(--primary);
  margin-left: var(--sp-2);
  flex: none;
}

/* 激活与选中态 */
.sc-select__item.is-selected {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 500;
}

.sc-select__item.is-selected .sc-select__item-icon {
  color: var(--primary);
}

.sc-select__item.is-active:not(.is-selected):not(.is-disabled) {
  background: var(--neutral-hover);
  color: var(--text);
}

.sc-select__item.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/* 原生表单项隐藏 */
.sc-select__native {
  position: absolute !important;
  opacity: 0 !important;
  pointer-events: none !important;
  width: 1px !important;
  height: 1px !important;
  margin: -1px !important;
  clip: rect(0, 0, 0, 0) !important;
}
</style>
