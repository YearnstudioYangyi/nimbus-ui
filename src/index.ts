import type { App, Plugin } from "vue";
import "./styles/index.css";

// 基础与按钮组件
import ScButton from "./components/button/ScButton.vue";
import ScIconButton from "./components/button/ScIconButton.vue";

// 卡片组件
import ScCard from "./components/card/ScCard.vue";

// 开关组件
import ScSwitch from "./components/switch/ScSwitch.vue";

// 模态弹窗与确认框
import ScModal from "./components/modal/ScModal.vue";
import ScConfirmDialog from "./components/confirm/ScConfirmDialog.vue";

// 抽屉组件
import ScDrawer from "./components/drawer/ScDrawer.vue";

// 下拉菜单
import ScDropdownMenu from "./components/dropdown/ScDropdownMenu.vue";

// 消息提示
import ScToastHost from "./components/toast/ScToastHost.vue";

// 提示块组件
import ScNotice from "./components/notice/ScNotice.vue";

// 进度条
import ScProgress from "./components/progress/ScProgress.vue";

// 全屏与局部加载遮罩
import ScLoading from "./components/loading/ScLoading.vue";

// 骨架屏与异步容器
import ScSkeleton from "./components/skeleton/ScSkeleton.vue";
import ScAsyncState from "./components/skeleton/ScAsyncState.vue";

// 徽章与标签
import ScChip from "./components/badge/ScChip.vue";
import ScBadge from "./components/badge/ScBadge.vue";
import ScSponsorBadge from "./components/badge/ScSponsorBadge.vue";

// 头像
import ScUserAvatar from "./components/avatar/ScUserAvatar.vue";

// 复制展示框
import ScCopyField from "./components/copy/ScCopyField.vue";

// 页面头部
import ScPageHeader from "./components/header/ScPageHeader.vue";

// 全局配置与国际化注入器
import ScConfigProvider from "./components/config-provider/ScConfigProvider.vue";

// 标签页
import ScTabs from "./components/tabs/ScTabs.vue";

// 统计卡片
import ScStat from "./components/stat/ScStat.vue";

// 数据表格
import ScTable from "./components/table/ScTable.vue";

// 侧边导航与项
import ScSideRail from "./components/rail/ScSideRail.vue";
import ScNavItem from "./components/rail/ScNavItem.vue";

// 视图切换动画容器
import ScViewTransition from "./components/view/ScViewTransition.vue";

// 表单输入
import ScInput from "./components/input/ScInput.vue";
import ScSearch from "./components/input/ScSearch.vue";
import ScSelect from "./components/input/ScSelect.vue";
import ScTextarea from "./components/input/ScTextarea.vue";

// Directives
import { vRipple } from "./directives/ripple";

// Composables
export * from "./composables/useTheme";
export * from "./composables/useToast";
export * from "./composables/useConfirm";
export * from "./composables/useLoading";

// Directives
export * from "./directives/ripple";

// Resolver
export * from "./resolver";

// Utils
export * from "./utils/format";

// Types
export type { SelectOption } from "./components/input/ScSelect.vue";

// 导出所有组件 (同时支持 Sc* 与 Nb* 前缀别名)
export {
  ScButton,
  ScIconButton,
  ScCard,
  ScSwitch,
  ScModal,
  ScConfirmDialog,
  ScDrawer,
  ScDropdownMenu,
  ScToastHost,
  ScNotice,
  ScProgress,
  ScLoading,
  ScSkeleton,
  ScAsyncState,
  ScChip,
  ScBadge,
  ScSponsorBadge,
  ScUserAvatar,
  ScCopyField,
  ScPageHeader,
  ScConfigProvider,
  ScTabs,
  ScStat,
  ScTable,
  ScSideRail,
  ScNavItem,
  ScViewTransition,
  ScInput,
  ScSearch,
  ScSelect,
  ScTextarea,
  // Nimbus 专属别名
  ScButton as NbButton,
  ScIconButton as NbIconButton,
  ScCard as NbCard,
  ScSwitch as NbSwitch,
  ScModal as NbModal,
  ScConfirmDialog as NbConfirmDialog,
  ScDrawer as NbDrawer,
  ScDropdownMenu as NbDropdownMenu,
  ScToastHost as NbToastHost,
  ScNotice as NbNotice,
  ScProgress as NbProgress,
  ScLoading as NbLoading,
  ScSkeleton as NbSkeleton,
  ScAsyncState as NbAsyncState,
  ScChip as NbChip,
  ScBadge as NbBadge,
  ScSponsorBadge as NbSponsorBadge,
  ScUserAvatar as NbUserAvatar,
  ScCopyField as NbCopyField,
  ScPageHeader as NbPageHeader,
  ScConfigProvider as NbConfigProvider,
  ScTabs as NbTabs,
  ScStat as NbStat,
  ScTable as NbTable,
  ScSideRail as NbSideRail,
  ScNavItem as NbNavItem,
  ScViewTransition as NbViewTransition,
  ScInput as NbInput,
  ScSearch as NbSearch,
  ScSelect as NbSelect,
  ScTextarea as NbTextarea
};

export const componentMap: Record<string, any> = {
  ScButton,
  ScIconButton,
  ScCard,
  ScSwitch,
  ScModal,
  ScConfirmDialog,
  ScDrawer,
  ScDropdownMenu,
  ScToastHost,
  ScNotice,
  ScProgress,
  ScLoading,
  ScSkeleton,
  ScAsyncState,
  ScChip,
  ScBadge,
  ScSponsorBadge,
  ScUserAvatar,
  ScCopyField,
  ScPageHeader,
  ScConfigProvider,
  ScTabs,
  ScStat,
  ScTable,
  ScSideRail,
  ScNavItem,
  ScViewTransition,
  ScInput,
  ScSearch,
  ScSelect,
  ScTextarea
};

export interface NimbusUIOptions {
  /**
   * 组件全局注册前缀策略：
   * - "all": 同时注册 Sc* 与 Nb* 双前缀（默认，兼容性最广）
   * - "nb": 仅注册 Nb* 现代前缀 (NbButton, NbSelect...)
   * - "sc": 仅注册 Sc* 经典前缀 (ScButton, ScSelect...)
   * @default "all"
   */
  prefix?: "all" | "nb" | "sc";
}

export type ShangCloudUIOptions = NimbusUIOptions;

/**
 * 创建 Nimbus UI Vue 插件实例
 */
export function createNimbusUI(options: NimbusUIOptions = {}): Plugin {
  return {
    install(app: App) {
      // 注册全局指令
      app.directive("ripple", vRipple);

      const prefixMode = options.prefix ?? "all";

      // 可靠遍历注册所有组件
      Object.entries(componentMap).forEach(([scName, comp]) => {
        const nbName = `Nb${scName.slice(2)}`;
        if (prefixMode === "all") {
          app.component(scName, comp);
          app.component(nbName, comp);
        } else if (prefixMode === "nb") {
          app.component(nbName, comp);
        } else if (prefixMode === "sc") {
          app.component(scName, comp);
        }
      });
    }
  };
}

/**
 * 默认 Vue 插件对象，支持 app.use(NimbusUI) 或 app.use(NimbusUI, { prefix: 'nb' })
 */
export const NimbusUI: Plugin = {
  install(app: App, options?: NimbusUIOptions) {
    const plugin = createNimbusUI(options);
    plugin.install?.(app);
  }
};

export const ShangCloudUI = NimbusUI;

export default NimbusUI;

/* ============================================================
   TypeScript 全局组件类型补充 (Volar / VSCode 模板语法高亮与智能提示)
   ============================================================ */
declare module "vue" {
  export interface GlobalComponents {
    ScButton: typeof ScButton;
    NbButton: typeof ScButton;
    ScIconButton: typeof ScIconButton;
    NbIconButton: typeof ScIconButton;
    ScCard: typeof ScCard;
    NbCard: typeof ScCard;
    ScSwitch: typeof ScSwitch;
    NbSwitch: typeof ScSwitch;
    ScModal: typeof ScModal;
    NbModal: typeof ScModal;
    ScConfirmDialog: typeof ScConfirmDialog;
    NbConfirmDialog: typeof ScConfirmDialog;
    ScDrawer: typeof ScDrawer;
    NbDrawer: typeof ScDrawer;
    ScDropdownMenu: typeof ScDropdownMenu;
    NbDropdownMenu: typeof ScDropdownMenu;
    ScToastHost: typeof ScToastHost;
    NbToastHost: typeof ScToastHost;
    ScNotice: typeof ScNotice;
    NbNotice: typeof ScNotice;
    ScProgress: typeof ScProgress;
    NbProgress: typeof ScProgress;
    ScLoading: typeof ScLoading;
    NbLoading: typeof ScLoading;
    ScSkeleton: typeof ScSkeleton;
    NbSkeleton: typeof ScSkeleton;
    ScAsyncState: typeof ScAsyncState;
    NbAsyncState: typeof ScAsyncState;
    ScChip: typeof ScChip;
    NbChip: typeof ScChip;
    ScBadge: typeof ScBadge;
    NbBadge: typeof ScBadge;
    ScSponsorBadge: typeof ScSponsorBadge;
    NbSponsorBadge: typeof ScSponsorBadge;
    ScUserAvatar: typeof ScUserAvatar;
    NbUserAvatar: typeof ScUserAvatar;
    ScCopyField: typeof ScCopyField;
    NbCopyField: typeof ScCopyField;
    ScPageHeader: typeof ScPageHeader;
    NbPageHeader: typeof ScPageHeader;
    ScConfigProvider: typeof ScConfigProvider;
    NbConfigProvider: typeof ScConfigProvider;
    ScTabs: typeof ScTabs;
    NbTabs: typeof ScTabs;
    ScStat: typeof ScStat;
    NbStat: typeof ScStat;
    ScTable: typeof ScTable;
    NbTable: typeof ScTable;
    ScSideRail: typeof ScSideRail;
    NbSideRail: typeof ScSideRail;
    ScNavItem: typeof ScNavItem;
    NbNavItem: typeof ScNavItem;
    ScViewTransition: typeof ScViewTransition;
    NbViewTransition: typeof ScViewTransition;
    ScInput: typeof ScInput;
    NbInput: typeof ScInput;
    ScSearch: typeof ScSearch;
    NbSearch: typeof ScSearch;
    ScSelect: typeof ScSelect;
    NbSelect: typeof ScSelect;
    ScTextarea: typeof ScTextarea;
    NbTextarea: typeof ScTextarea;
  }
}
