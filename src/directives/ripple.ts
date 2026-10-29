import type { Directive, DirectiveBinding } from "vue";

export interface RippleOptions {
  color?: string;
  disabled?: boolean;
}

interface RippleState {
  count: number;
  originalOverflow: string;
  originalPosition: string;
}

const rippleStateMap = new WeakMap<HTMLElement, RippleState>();

function handlePointerDown(e: PointerEvent, el: HTMLElement, binding: DirectiveBinding<RippleOptions | boolean | undefined>) {
  if (binding.value === false) return;
  if (typeof binding.value === "object" && binding.value.disabled) return;
  if (e.button !== 0) return; // 仅左键触发

  // 媒体查询判断是否偏好减少动效
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  let state = rippleStateMap.get(el);
  if (!state) {
    state = {
      count: 0,
      originalOverflow: el.style.overflow,
      originalPosition: el.style.position
    };
    rippleStateMap.set(el, state);
  }
  state.count++;

  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 确保宿主容器支持绝对定位与溢出隐藏
  const computedStyle = window.getComputedStyle(el);
  if (computedStyle.position === "static") {
    el.style.position = "relative";
  }
  if (computedStyle.overflow !== "hidden") {
    el.style.overflow = "hidden";
  }

  // 半径取到四个角的最大距离
  const maxDistX = Math.max(x, rect.width - x);
  const maxDistY = Math.max(y, rect.height - y);
  const radius = Math.sqrt(maxDistX * maxDistX + maxDistY * maxDistY);
  const diameter = radius * 2;

  const ripple = document.createElement("span");
  ripple.className = "sc-ripple";
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.left = `${x - radius}px`;
  ripple.style.top = `${y - radius}px`;

  if (typeof binding.value === "object" && binding.value.color) {
    ripple.style.backgroundColor = binding.value.color;
  }

  el.appendChild(ripple);

  function removeRipple() {
    ripple.classList.add("sc-ripple--leave");
    setTimeout(() => {
      ripple.remove();
      const s = rippleStateMap.get(el);
      if (s) {
        s.count--;
        if (s.count <= 0) {
          el.style.overflow = s.originalOverflow;
          el.style.position = s.originalPosition;
          rippleStateMap.delete(el);
        }
      }
    }, 350);
    window.removeEventListener("pointerup", removeRipple);
    window.removeEventListener("pointercancel", removeRipple);
  }

  window.addEventListener("pointerup", removeRipple);
  window.addEventListener("pointercancel", removeRipple);
}

export const vRipple: Directive<HTMLElement, RippleOptions | boolean | undefined> = {
  mounted(el, binding) {
    const handler = (e: PointerEvent) => handlePointerDown(e, el, binding);
    (el as HTMLElement & { _scRippleHandler?: typeof handler })._scRippleHandler = handler;
    el.addEventListener("pointerdown", handler, { passive: true });
  },
  unmounted(el) {
    const handler = (el as HTMLElement & { _scRippleHandler?: (e: PointerEvent) => void })._scRippleHandler;
    if (handler) {
      el.removeEventListener("pointerdown", handler);
      delete (el as HTMLElement & { _scRippleHandler?: unknown })._scRippleHandler;
    }
    const s = rippleStateMap.get(el);
    if (s) {
      el.style.overflow = s.originalOverflow;
      el.style.position = s.originalPosition;
      rippleStateMap.delete(el);
    }
  }
};
