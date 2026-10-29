import { ref } from "vue";

export type ToastKind = "info" | "success" | "error" | "warning";
export type ToastPlacement = "bottom-center" | "top-center" | "top-right" | "bottom-right";

export interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
  timeout: number;
  placement: ToastPlacement;
  paused?: boolean;
}

export interface ToastHandle {
  id: number;
  close: () => void;
  pause: () => void;
  resume: () => void;
}

interface ToastTimerRecord {
  timerId: any;
  startTime: number;
  remaining: number;
  isPaused: boolean;
}

let seq = 0;
const toasts = ref<ToastItem[]>([]);
const timerRecords = new Map<number, ToastTimerRecord>();

export function useToast() {
  function pushToast(
    message: string,
    kind: ToastKind = "info",
    timeout = 4000,
    placement: ToastPlacement = "bottom-center"
  ): ToastHandle {
    const id = ++seq;
    const item: ToastItem = {
      id,
      message,
      kind,
      timeout,
      placement,
      paused: false
    };
    toasts.value.push(item);

    if (timeout > 0 && typeof window !== "undefined") {
      const timerId = window.setTimeout(() => dismissToast(id), timeout);
      timerRecords.set(id, {
        timerId,
        startTime: Date.now(),
        remaining: timeout,
        isPaused: false
      });
    }

    return {
      id,
      close: () => dismissToast(id),
      pause: () => pauseToast(id),
      resume: () => resumeToast(id)
    };
  }

  function pauseToast(id: number) {
    const record = timerRecords.get(id);
    if (!record || record.isPaused) return;

    if (record.timerId !== null) {
      clearTimeout(record.timerId);
      record.timerId = null;
    }

    const elapsed = Date.now() - record.startTime;
    // 扣减已消耗时间，并保证恢复时至少保留 1000ms 缓冲，避免鼠标移开瞬间突然消失
    record.remaining = Math.max(record.remaining - elapsed, 1000);
    record.isPaused = true;

    const item = toasts.value.find((t) => t.id === id);
    if (item) {
      item.paused = true;
    }
  }

  function resumeToast(id: number) {
    const record = timerRecords.get(id);
    if (!record || !record.isPaused) return;

    if (record.remaining > 0 && typeof window !== "undefined") {
      record.startTime = Date.now();
      record.isPaused = false;
      record.timerId = window.setTimeout(() => dismissToast(id), record.remaining);
    }

    const item = toasts.value.find((t) => t.id === id);
    if (item) {
      item.paused = false;
    }
  }

  function dismissToast(id: number) {
    const record = timerRecords.get(id);
    if (record?.timerId) {
      clearTimeout(record.timerId);
    }
    timerRecords.delete(id);

    const idx = toasts.value.findIndex((t) => t.id === id);
    if (idx !== -1) {
      toasts.value.splice(idx, 1);
    }
  }

  function clearAll() {
    timerRecords.forEach((record) => {
      if (record.timerId) clearTimeout(record.timerId);
    });
    timerRecords.clear();
    toasts.value = [];
  }

  const toast = {
    info: (msg: string, timeout = 4000, placement?: ToastPlacement) =>
      pushToast(msg, "info", timeout, placement),
    success: (msg: string, timeout = 4000, placement?: ToastPlacement) =>
      pushToast(msg, "success", timeout, placement),
    warning: (msg: string, timeout = 5000, placement?: ToastPlacement) =>
      pushToast(msg, "warning", timeout, placement),
    error: (msg: string, timeout = 6000, placement?: ToastPlacement) =>
      pushToast(msg, "error", timeout, placement)
  };

  return {
    toasts,
    pushToast,
    dismissToast,
    pauseToast,
    resumeToast,
    clearAll,
    toast
  };
}
