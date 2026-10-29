import { ref } from "vue";

export interface ConfirmOptions {
  title: string;
  body?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  /** 需要用户逐字输入该文本才能确认（用于删除应用等危险操作） */
  challenge?: string;
  challengeLabel?: string;
}

export interface ConfirmState {
  open: boolean;
  options: ConfirmOptions;
  resolve: ((ok: boolean) => void) | null;
}

const confirmState = ref<ConfirmState>({
  open: false,
  options: { title: "" },
  resolve: null
});

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      // 若已有弹窗打开，先取消前一个
      if (confirmState.value.resolve) {
        confirmState.value.resolve(false);
      }
      confirmState.value = {
        open: true,
        options,
        resolve
      };
    });
  }

  function resolveConfirm(ok: boolean) {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(ok);
    }
    confirmState.value = {
      open: false,
      options: { title: "" },
      resolve: null
    };
  }

  return {
    confirmState,
    confirm,
    resolveConfirm
  };
}
