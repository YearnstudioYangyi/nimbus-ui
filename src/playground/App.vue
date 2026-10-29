<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTheme } from "../composables/useTheme";
import { useToast } from "../composables/useToast";
import { useConfirm } from "../composables/useConfirm";
import { useLoading } from "../composables/useLoading";

const { mode, theme, setTheme, cycleTheme, initTheme } = useTheme();
const { toast } = useToast();
const { confirm } = useConfirm();
const { withLoading } = useLoading();
const cardLoadingDemo = ref(false);

function triggerLazyLoadingDemo(type: "ring" | "spokes" = "ring", cardMode = false) {
  withLoading(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("模块加载完成！", 2500, "top-center");
    },
    {
      text: "正在加载组件资源...",
      spinnerType: type,
      card: cardMode
    }
  );
}

onMounted(() => {
  initTheme();
});

// 基础状态
const railCollapsed = ref(false);
const mobileRailOpen = ref(false);
const showProgress = ref(false);
const activeTab = ref<string | number>("overview");
const switchVal = ref(true);
const modalOpen = ref(false);
const drawerRightOpen = ref(false);
const drawerBottomOpen = ref(false);
const loadingBtn = ref(false);
const searchKeyword = ref("");
const asyncState = ref<"loading" | "content" | "error" | "empty">("content");
const navCategory = ref<"apps" | "system">("apps");

function handleRailToggle() {
  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    mobileRailOpen.value = !mobileRailOpen.value;
  } else {
    railCollapsed.value = !railCollapsed.value;
  }
}

function handleTabChange(tab: string | number) {
  activeTab.value = tab;
  mobileRailOpen.value = false;
}

// 表单演示状态
const selectVal = ref("production");
const textareaVal = ref("Nimbus 致力于为全栈开发者提供现代敏捷的应用外壳与高质感动效体验。");

const selectOptions = [
  { label: "生产就绪 (Production)", value: "production" },
  { label: "沙箱测试 (Sandbox)", value: "sandbox" },
  { label: "预发布节点 (Staging)", value: "staging", disabled: true }
];

const sampleTableData = [
  { id: "app_1001", name: "Nimbus Hub", status: "运行中", latency: "24ms", load: "12%" },
  { id: "app_1002", name: "Astra Engine Server", status: "运行中", latency: "38ms", load: "34%" },
  { id: "app_1003", name: "MCP Gateway Core", status: "维护中", latency: "120ms", load: "5%" }
];

const tableColumns = [
  { key: "id", title: "服务 ID", width: "140px" },
  { key: "name", title: "服务名称" },
  { key: "status", title: "运行状态", width: "120px" },
  { key: "latency", title: "延迟", width: "100px" },
  { key: "load", title: "资源占用", width: "100px" }
];

const tabs = [
  { label: "总览看板", value: "overview", icon: "bi-grid-1x2" },
  { label: "按钮与波纹", value: "buttons", icon: "bi-hand-index-thumb" },
  { label: "抽屉与弹窗", value: "dialogs", icon: "bi-window-stack", badge: "New" },
  { label: "表单与数据", value: "forms", icon: "bi-input-cursor-text" },
  { label: "骨架屏与状态", value: "states", icon: "bi-activity" }
];

const progressMode = ref<"indeterminate" | "trickle">("indeterminate");

function toggleTopIndeterminateProgress() {
  if (showProgress.value) {
    showProgress.value = false;
  } else {
    progressMode.value = "indeterminate";
    showProgress.value = true;
    toast.info("已开启顶部流光扫光进度条", 2500, "top-center");
  }
}

function toggleProgress(mode?: "indeterminate" | "trickle") {
  if (mode) {
    if (showProgress.value && progressMode.value === mode) {
      showProgress.value = false;
      return;
    }
    progressMode.value = mode;
    showProgress.value = true;
    const modeLabel = mode === "indeterminate" ? "流光扫光 (平滑淡出)" : "模拟步进 (丝滑长程缓动)";
    toast.info(`已开启顶部进度条 [${modeLabel}]`, 2500, "top-center");
    return;
  }
  showProgress.value = !showProgress.value;
  if (showProgress.value) {
    progressMode.value = "indeterminate";
    toast.info("已开启顶部流光扫光进度条", 2500, "top-center");
  }
}

async function triggerConfirm() {
  const ok = await confirm({
    title: "确认删除该关键服务？",
    body: "此操作不可撤销。如确认删除，请在下方挑战输入框中完整键入指定确认码。",
    danger: true,
    confirmText: "确认彻底删除",
    challenge: "DELETE-APP",
    challengeLabel: '请输入 "DELETE-APP" 以确认删除'
  });

  if (ok) {
    toast.success("验证通过，已成功执行删除动作", 4000, "top-right");
  } else {
    toast.info("已取消操作");
  }
}

function triggerAsync(type: "loading" | "content" | "error" | "empty") {
  asyncState.value = type;
}

function simulateLoading() {
  loadingBtn.value = true;
  setTimeout(() => {
    loadingBtn.value = false;
    toast.success("操作处理完成！", 3500, "top-center");
  }, 1400);
}

function switchNavCategory(cat: "apps" | "system") {
  navCategory.value = cat;
}
</script>

<template>
  <ScConfigProvider>
    <div class="sc-layout">
      <!-- 全局进度条动效 -->
      <ScProgress :active="showProgress" :mode="progressMode" />

      <!-- 移动端侧栏遮罩 -->
      <Transition name="sc-fade">
        <div
          v-if="mobileRailOpen"
          class="sc-mobile-rail-scrim"
          @click="mobileRailOpen = false"
        ></div>
      </Transition>

      <!-- 侧边导航栏 -->
      <ScSideRail
        v-model:collapsed="railCollapsed"
        brand-name="Nimbus UI"
        class="sc-showcase-rail"
        :class="{ 'is-mobile-open': mobileRailOpen }"
      >
        <template #brand>
          <div class="u-row-between" style="width: 100%">
            <div class="u-row">
              <span class="avatar avatar--sm avatar--square avatar--gradient" style="margin-right: 12px">
                <i class="bi bi-clouds-fill" style="color: #fff"></i>
              </span>
              <span class="sc-rail__brand-text">Nimbus UI</span>
            </div>
            <button
              class="icon-btn icon-btn--sm u-hidden-desktop"
              type="button"
              aria-label="关闭侧边栏"
              @click="mobileRailOpen = false"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </template>

        <!-- 演示 Stagger 菜单级联推入动效 -->
        <div :key="navCategory" class="sc-rail__nav">
          <div class="u-row-between" style="padding: 4px 16px 8px; font-size: 12px; color: var(--text-3)">
            <span>{{ navCategory === 'apps' ? '应用管理菜单' : '系统管理菜单' }}</span>
            <a href="javascript:void(0)" @click="switchNavCategory(navCategory === 'apps' ? 'system' : 'apps')">
              <i class="bi bi-arrow-repeat"></i> 切换形态
            </a>
          </div>

          <template v-if="navCategory === 'apps'">
            <ScNavItem
              label="总览看板"
              icon="bi-speedometer2"
              :active="activeTab === 'overview'"
              :stagger-index="1"
              @click="handleTabChange('overview')"
            />
            <ScNavItem
              label="按钮与波纹"
              icon="bi-hand-index-thumb"
              :active="activeTab === 'buttons'"
              :stagger-index="2"
              @click="handleTabChange('buttons')"
            />
            <ScNavItem
              label="抽屉与弹窗"
              icon="bi-window-stack"
              badge="3"
              :active="activeTab === 'dialogs'"
              :stagger-index="3"
              @click="handleTabChange('dialogs')"
            />
            <ScNavItem
              label="表单与数据"
              icon="bi-input-cursor-text"
              :active="activeTab === 'forms'"
              :stagger-index="4"
              @click="handleTabChange('forms')"
            />
            <ScNavItem
              label="异步骨架屏"
              icon="bi-hourglass-split"
              :active="activeTab === 'states'"
              :stagger-index="5"
              @click="handleTabChange('states')"
            />
          </template>

          <template v-else>
            <ScNavItem
              label="系统审计日志"
              icon="bi-journal-text"
              direction="back"
              :stagger-index="1"
              @click="mobileRailOpen = false; toast.info('查看审计日志', 3000, 'top-right')"
            />
            <ScNavItem
              label="云函数引擎"
              icon="bi-cpu"
              direction="back"
              :stagger-index="2"
              @click="mobileRailOpen = false; toast.info('云函数管理', 3000, 'top-right')"
            />
            <ScNavItem
              label="安全守护规则"
              icon="bi-shield-check"
              direction="back"
              :stagger-index="3"
              badge="NEW"
              @click="mobileRailOpen = false; toast.info('安全守护', 3000, 'top-right')"
            />
          </template>
        </div>
      </ScSideRail>

      <!-- 主展示区 -->
      <main class="sc-main-container">
        <!-- 顶栏 -->
        <header class="sc-topbar-showcase">
          <div class="u-row u-gap-2">
            <ScIconButton
              title="折叠/展开侧栏"
              @click="handleRailToggle"
            >
              <i class="bi bi-list" style="font-size: 20px"></i>
            </ScIconButton>
            <ScSearch v-model="searchKeyword" placeholder="搜索组件、动效..." class="sc-topbar-search" />
          </div>

          <div class="u-row u-gap-2">
            <ScSponsorBadge label="金牌赞助者" class="u-hidden-mobile" />

            <!-- 下拉菜单：自动探测边缘避让 -->
            <ScDropdownMenu align="auto">
              <template #trigger="{ open }">
                <button class="btn btn--tonal btn--sm" type="button" title="切换主题">
                  <i class="bi bi-palette"></i>
                  <span class="u-hidden-mobile">主题: {{ mode.toUpperCase() }}</span>
                  <i :class="['bi', open ? 'bi-chevron-up' : 'bi-chevron-down']" style="font-size: 11px" class="u-hidden-mobile"></i>
                </button>
              </template>
              <div class="menu__label">选择设计系统主题</div>
              <button class="menu__item" @click="setTheme('light')">
                <i class="bi bi-sun"></i> 浅色 (Light)
              </button>
              <button class="menu__item" @click="setTheme('dark')">
                <i class="bi bi-moon"></i> 深色 (Dark)
              </button>
              <button class="menu__item" @click="setTheme('gold')">
                <i class="bi bi-award-fill" style="color: #d9c48c"></i> 黑金专属 (Gold)
              </button>
              <div class="menu__sep"></div>
              <button class="menu__item" @click="setTheme('auto')">
                <i class="bi bi-laptop"></i> 跟随系统 (Auto)
              </button>
            </ScDropdownMenu>

            <!-- 顶部进度条控制：流光扫光与关闭 -->
            <ScButton
              variant="outline"
              size="sm"
              class="u-hidden-mobile"
              @click="toggleTopIndeterminateProgress"
            >
              <i :class="showProgress ? 'bi bi-x-circle' : 'bi bi-water'"></i>
              {{ showProgress ? '关闭' : '流光扫光' }}
            </ScButton>
          </div>
        </header>

        <!-- 内容区 -->
        <div class="sc-content-wrap">
          <ScPageHeader
            title="Nimbus UI 组件库与动效系统"
            desc="现代 Vue 3 设计系统与微交互动效组件库，拥有物理惯性滑动指示器、v-ripple 水波纹反馈、抽屉组件、自适应智能下拉与完整三套设计主题。"
            :crumbs="[
              { label: '控制台', href: '#' },
              { label: '组件演示', href: '#' },
              { label: String(activeTab).toUpperCase() }
            ]"
          >
            <template #actions>
              <ScButton variant="tonal" @click="cycleTheme">
                <i class="bi bi-magic"></i> 循环主题
              </ScButton>
              <ScButton variant="primary" cta @click="toast.success('已触发尊享 CTA 动作！', 4000, 'top-center')">
                <i class="bi bi-heart-fill"></i> 尊享 CTA 按钮
              </ScButton>
            </template>
          </ScPageHeader>

          <!-- 真实物理滑动下划线指示器的 Tabs 组件 -->
          <ScTabs v-model="activeTab" :items="tabs" style="margin-bottom: 24px" />

          <!-- 仅主体内容包裹在 ScViewTransition 中实现滑入动效 -->
          <ScViewTransition :view-key="activeTab">
            <!-- Tab 1: 总览概览 -->
            <div v-if="activeTab === 'overview'" class="u-col u-gap-6">
            <!-- 提示块组件 -->
            <ScNotice
              variant="info"
              title="物理动效升级完毕"
              dismissible
            >
              当前版本的 Tabs 采用真实 DOM 物理位移与弹性宽度形变算法；按钮与导航项已全面支持 Material 水波纹微动效；新增了独立右滑/底滑抽屉面板。
            </ScNotice>

            <!-- 统计卡片栅格 -->
            <div class="grid grid--stats">
              <ScStat label="组件与扩展" value="26+" delta="新增抽屉/表格/选择器/提示" icon="bi-puzzle" />
              <ScStat label="物理动效" value="0.2s / 0.3s" delta="物理滑动 + Ripple 波纹" icon="bi-bezier2" />
              <ScStat label="当前主题" :value="theme.toUpperCase()" :delta="`选择模式: ${mode}`" icon="bi-palette2" />
              <ScStat label="按需引入" value="支持" delta="NimbusUIResolver" icon="bi-box-seam" />
            </div>

            <!-- 卡片系统展示 -->
            <div class="grid grid--2">
              <ScCard title="主题与色彩系统" desc="包含完整三套令牌，自动计算冷暖对比与黑金 wash 保护" hover>
                <div class="u-col u-gap-3">
                  <p style="font-size: 14px; color: var(--text-2)">
                    黑金主题（Gold）遵循极严格的「金色是重音符，不是背景色」规范：金色像素占比严格控制在 8% 以下，大面积面采用透明 wash，深色底色中性偏冷，避免浑浊。
                  </p>
                  <div class="u-row u-wrap u-gap-2">
                    <ScChip variant="primary">Primary Chip</ScChip>
                    <ScChip variant="success">Success 99.9%</ScChip>
                    <ScChip variant="warning">Warning Notice</ScChip>
                    <ScChip variant="danger">Security Alert</ScChip>
                    <ScChip variant="info">Info Badge</ScChip>
                    <ScChip variant="outline">Outline Pill</ScChip>
                  </div>
                </div>
                <template #footer>
                  <div class="u-row-between" style="width: 100%">
                    <span style="font-size: 12px; color: var(--text-3)">全站设计令牌自适应</span>
                    <button class="btn btn--ghost btn--sm" @click="cycleTheme">切换到下一个主题</button>
                  </div>
                </template>
              </ScCard>

              <ScCard title="头像与安全展示" desc="多尺寸、根据名称哈希动态生成色彩、复制保护" hover>
                <div class="u-col u-gap-4">
                  <div class="u-row u-gap-3">
                    <ScUserAvatar name="Admin" size="lg" />
                    <ScUserAvatar name="Nimbus" size="md" />
                    <ScUserAvatar name="Developer" size="sm" />
                    <ScUserAvatar name="System" size="md" square />
                  </div>

                  <div class="field">
                    <span class="field__label">敏感令牌与代码一键复制：</span>
                    <ScCopyField value="sk-live_sec_9948271038102947192" secret label="开发者密钥" />
                  </div>
                </div>
              </ScCard>
            </div>
          </div>

          <!-- Tab 2: 按钮与波纹动效 -->
          <div v-else-if="activeTab === 'buttons'" class="u-col u-gap-6">
            <ScCard title="点击水波纹 (v-ripple) 与按钮动效" desc="随意点击任意按钮，体验从触控点向外扩散的优雅涟漪动效" pad>
              <div class="u-col u-gap-4">
                <div class="u-row u-wrap u-gap-3">
                  <ScButton variant="primary">Primary 按钮</ScButton>
                  <ScButton variant="tonal">Tonal 浅底按钮</ScButton>
                  <ScButton variant="outline">Outline 边框按钮</ScButton>
                  <ScButton variant="ghost">Ghost 文字按钮</ScButton>
                  <ScButton variant="danger">Danger 危险按钮</ScButton>
                  <ScButton variant="primary" cta>尊享实心金 CTA</ScButton>
                </div>

                <div class="u-row u-wrap u-gap-3">
                  <ScButton size="sm" variant="primary">小型按钮 (sm)</ScButton>
                  <ScButton size="md" variant="primary">标准按钮 (md)</ScButton>
                  <ScButton size="lg" variant="primary">大号按钮 (lg)</ScButton>
                  <ScButton variant="primary" :loading="loadingBtn" @click="simulateLoading">
                    {{ loadingBtn ? '执行中...' : '点击触发 Loading 动画' }}
                  </ScButton>
                </div>

                <div class="u-row u-gap-3">
                  <ScIconButton title="喜欢" @click="toast.success('已添加到喜欢', 2500, 'top-center')">
                    <i class="bi bi-heart"></i>
                  </ScIconButton>
                  <ScIconButton title="分享" @click="toast.info('链接已生成', 2500, 'top-center')">
                    <i class="bi bi-share"></i>
                  </ScIconButton>
                  <ScIconButton size="sm" title="设置">
                    <i class="bi bi-gear"></i>
                  </ScIconButton>
                  <ScIconButton danger title="删除" @click="toast.error('已移除项目', 3000, 'bottom-right')">
                    <i class="bi bi-trash"></i>
                  </ScIconButton>
                </div>
              </div>
            </ScCard>

            <ScCard title="开关与表单微动效" desc="平滑物理滑移与弹性变形效果" pad>
              <div class="u-col u-gap-4">
                <div class="u-row u-gap-6">
                  <ScSwitch v-model="switchVal" label="启用动态刷新" />
                  <ScSwitch :model-value="false" label="禁用态开关" disabled />
                </div>
              </div>
            </ScCard>
          </div>

          <!-- Tab 3: 抽屉与弹窗系统 -->
          <div v-else-if="activeTab === 'dialogs'" class="u-col u-gap-6">
            <ScCard title="抽屉面板 (ScDrawer) 与弹窗" desc="支持从右侧、底部、左侧多方向平滑滑入，自适应触控与键盘关闭" pad>
              <div class="u-row u-wrap u-gap-4">
                <ScButton variant="primary" @click="drawerRightOpen = true">
                  <i class="bi bi-layout-sidebar-reverse"></i> 打开右侧抽屉
                </ScButton>

                <ScButton variant="tonal" @click="drawerBottomOpen = true">
                  <i class="bi bi-chevron-bar-up"></i> 打开底部抽屉
                </ScButton>

                <ScButton variant="outline" @click="modalOpen = true">
                  <i class="bi bi-window"></i> 打开标准模态框
                </ScButton>

                <ScButton variant="danger" @click="triggerConfirm">
                  <i class="bi bi-shield-slash"></i> 挑战输入确认框
                </ScButton>
              </div>
            </ScCard>

            <ScCard
              title="多位置 Toast 消息提示"
              desc="支持 top-center, bottom-center, top-right, bottom-right 灵活堆叠；退出时平滑滑向屏幕外，悬停时暂停倒计时并提供立体微触感反馈"
              pad
            >
              <div class="u-row u-wrap u-gap-3">
                <ScButton variant="tonal" size="sm" @click="toast.info('顶部居中滑下通知', 3500, 'top-center')">
                  Top-Center 通知
                </ScButton>
                <ScButton variant="tonal" size="sm" @click="toast.success('右上角通知卡片', 3500, 'top-right')">
                  Top-Right 通知
                </ScButton>
                <ScButton variant="tonal" size="sm" @click="toast.warning('底部正中浮出通知', 3500, 'bottom-center')">
                  Bottom-Center 通知
                </ScButton>
                <ScButton variant="tonal" size="sm" @click="toast.error('右下角警告通知', 3500, 'bottom-right')">
                  Bottom-Right 通知
                </ScButton>
              </div>
              <p style="margin: 12px 0 0; color: var(--text-2); font-size: 13px; line-height: 1.6">
                • <b>滑向屏幕外退出</b>：顶部通知向上滑出、底部通知向下滑出、右侧通知向右平滑飞出视口，配合队列 FLIP 自动补位，告别突兀原地消失；<br />
                • <b>悬停暂停与微触感</b>：鼠标移入 Toast 时倒计时自动挂起（移开自动恢复），并伴随立体微浮起、环境微光与图标回弹微交互。
              </p>
            </ScCard>
          </div>

          <!-- Tab 4: 表单与数据组件 -->
          <div v-else-if="activeTab === 'forms'" class="u-col u-gap-6">
            <div class="grid grid--2">
              <ScCard title="高级表单输入" desc="输入框、选择器、多行文本域" pad>
                <div class="u-col u-gap-3">
                  <ScInput
                    model-value="nimbus-app-production"
                    label="应用唯一标识 (App ID)"
                    hint="全局唯一，仅支持小写字母与连字符"
                    mono
                  />
                  <ScSelect
                    v-model="selectVal"
                    label="部署环境"
                    :options="selectOptions"
                    hint="生产环境将启用高可用节点群"
                  />
                  <ScTextarea
                    v-model="textareaVal"
                    label="服务描述信息"
                    :rows="3"
                    :maxlength="200"
                    show-count
                  />
                </div>
              </ScCard>

              <ScCard title="数据表格 (ScTable)" desc="紧凑、悬停渐变高亮与空态整合" pad>
                <ScTable
                  :columns="tableColumns"
                  :data="sampleTableData"
                  compact
                >
                  <template #cell-status="{ row }">
                    <ScChip :variant="row.status === '运行中' ? 'success' : 'warning'">
                      {{ row.status }}
                    </ScChip>
                  </template>
                </ScTable>
              </ScCard>
            </div>
          </div>

          <!-- Tab 5: 骨架屏与异步状态 -->
          <div v-else-if="activeTab === 'states'" class="u-col u-gap-6">
            <ScCard title="骨架屏扫光 (Shimmer) 与异步状态" desc="高质感 1.4s 扫光动效与平滑状态切替" pad>
              <div class="u-row u-wrap u-gap-2" style="margin-bottom: 20px">
                <button
                  class="btn btn--sm"
                  :class="asyncState === 'content' ? 'btn--primary' : 'btn--outline'"
                  @click="triggerAsync('content')"
                >
                  正常内容
                </button>
                <button
                  class="btn btn--sm"
                  :class="asyncState === 'loading' ? 'btn--primary' : 'btn--outline'"
                  @click="triggerAsync('loading')"
                >
                  骨架屏加载中
                </button>
                <button
                  class="btn btn--sm"
                  :class="asyncState === 'error' ? 'btn--primary' : 'btn--outline'"
                  @click="triggerAsync('error')"
                >
                  失败重试态
                </button>
                <button
                  class="btn btn--sm"
                  :class="asyncState === 'empty' ? 'btn--primary' : 'btn--outline'"
                  @click="triggerAsync('empty')"
                >
                  空数据态
                </button>
              </div>

              <ScAsyncState
                :pending="asyncState === 'loading'"
                :initial="asyncState === 'loading'"
                :error="asyncState === 'error' ? '服务连接超时，错误码: 504 Gateway Timeout' : null"
                :empty="asyncState === 'empty'"
                empty-title="暂无任何部署服务"
                empty-desc="您可以点击下方按钮立即创建第一个服务。"
                :skeleton-rows="4"
                @retry="triggerAsync('content')"
              >
                <template #empty-action>
                  <ScButton variant="primary" size="sm" style="margin-top: 12px" @click="triggerAsync('content')">
                    <i class="bi bi-plus-lg"></i> 立即创建
                  </ScButton>
                </template>

                <div class="card card--pad">
                  <h4 style="margin: 0 0 8px">已成功加载的内容面板</h4>
                  <p style="color: var(--text-2); font-size: 14px">
                    骨架屏具有渐变光晕扫过的流动效果，让等待过程具有出色的心理缓冲。
                  </p>
                </div>
              </ScAsyncState>
            </ScCard>

            <ScCard title="顶部无缝加载进度条 (ScProgress)" desc="支持流光扫光平滑渐隐与模拟步进 100% 完成态" pad>
              <div class="u-row u-wrap u-gap-3">
                <ScButton
                  :variant="showProgress && progressMode === 'indeterminate' ? 'primary' : 'outline'"
                  size="sm"
                  @click="toggleProgress('indeterminate')"
                >
                  <i class="bi bi-water"></i> 开启流光扫光 (Indeterminate)
                </ScButton>
                <ScButton
                  :variant="showProgress && progressMode === 'trickle' ? 'primary' : 'outline'"
                  size="sm"
                  @click="toggleProgress('trickle')"
                >
                  <i class="bi bi-speedometer2"></i> 开启模拟步进 (Trickle)
                </ScButton>
                <ScButton
                  v-if="showProgress"
                  variant="danger-text"
                  size="sm"
                  @click="showProgress = false"
                >
                  <i class="bi bi-x-circle"></i> 关闭进度条
                </ScButton>
              </div>
              <p style="margin: 12px 0 0; color: var(--text-2); font-size: 13px; line-height: 1.6">
                • <b>流光扫光 (Indeterminate)</b>：扫光循环不断流，关闭时优雅平滑淡出，绝无瞬间拉扯满格；<br />
                • <b>模拟步进 (Trickle)</b>：基于流体物理启动并无缝衔接长程缓动，60/120fps 全帧率平滑滑行，关闭时以 300ms 冲向 100% 同时上下对称收拢缩窄至极细光线渐隐。
              </p>
            </ScCard>

            <ScCard
              title="全屏与局部遮罩加载 (ScLoading / useLoading)"
              desc="极简克制的高质感加载指示器，专为组件异步懒加载 (defineAsyncComponent)、页面路由切换与长耗时任务打造"
              pad
            >
              <div class="u-row u-wrap u-gap-3">
                <ScButton variant="primary" size="sm" @click="triggerLazyLoadingDemo('ring', false)">
                  <i class="bi bi-circle-half"></i> 极简圆弧全屏 (Linear/Vercel)
                </ScButton>
                <ScButton variant="outline" size="sm" @click="triggerLazyLoadingDemo('spokes', false)">
                  <i class="bi bi-apple"></i> 经典系统刻度 (Apple/macOS)
                </ScButton>
                <ScButton variant="tonal" size="sm" @click="triggerLazyLoadingDemo('ring', true)">
                  <i class="bi bi-pip"></i> 悬浮微卡片 (HUD 模式)
                </ScButton>
                <ScButton variant="ghost" size="sm" @click="cardLoadingDemo = !cardLoadingDemo">
                  <i :class="cardLoadingDemo ? 'bi bi-x-circle' : 'bi bi-arrow-repeat'"></i>
                  {{ cardLoadingDemo ? '关闭局部 Loading' : '开启局部 Loading' }}
                </ScButton>
              </div>

              <div class="card card--pad" style="margin-top: 16px; position: relative; min-height: 110px">
                <h4 style="margin: 0 0 8px">局部容器遮罩体验</h4>
                <p style="color: var(--text-2); font-size: 14px; margin: 0">
                  自适应父容器尺寸，带有轻量微磨砂（<code>backdrop-filter</code>），极简微旋转环不喧宾夺主。
                </p>
                <!-- 局部遮罩 -->
                <ScLoading :active="cardLoadingDemo" text="正在同步数据..." />
              </div>

              <p style="margin: 12px 0 0; color: var(--text-2); font-size: 13px; line-height: 1.6">
                • <b>极简克制</b>：告别粗糙堆砌的科幻旋转环与发光核心，回归现代顶级工具类应用（Linear、Vercel、Apple）的优雅简约设计；<br />
                • <b>开箱即用</b>：直接作为 <code>defineAsyncComponent</code> 的 <code>loadingComponent</code>，或在长耗时操作中调用 <code>useLoading().show()</code>。
              </p>
            </ScCard>
          </div>
        </ScViewTransition>
      </div>
    </main>

    <!-- 右侧抽屉 -->
    <ScDrawer
      v-model:open="drawerRightOpen"
      title="高级配置与服务详情"
      placement="right"
    >
      <div class="u-col u-gap-4">
        <p style="color: var(--text-2); font-size: 14px; line-height: 1.6">
          这是一个独立的抽屉组件（<code>ScDrawer</code>），具有平滑的从屏幕右侧滑入/滑出动效。
        </p>
        <ScInput label="配置键名" placeholder="CONFIG_ENTRY_POINT" />
        <ScSwitch label="开启自动故障转移" :model-value="true" />
      </div>
      <template #footer>
        <ScButton variant="ghost" size="sm" @click="drawerRightOpen = false">取消</ScButton>
        <ScButton variant="primary" size="sm" @click="drawerRightOpen = false; toast.success('已应用抽屉配置', 3000, 'top-right')">
          应用
        </ScButton>
      </template>
    </ScDrawer>

    <!-- 底部抽屉 -->
    <ScDrawer
      v-model:open="drawerBottomOpen"
      title="快速操作面板"
      placement="bottom"
      height="320px"
    >
      <div class="u-row u-wrap u-gap-4" style="justify-content: center; padding: 24px 0">
        <ScButton variant="tonal" size="lg" @click="drawerBottomOpen = false; toast.info('执行同步', 2500, 'top-center')">
          <i class="bi bi-arrow-repeat"></i> 立即同步
        </ScButton>
        <ScButton variant="tonal" size="lg" @click="drawerBottomOpen = false; toast.success('导出成功', 2500, 'top-center')">
          <i class="bi bi-download"></i> 导出配置
        </ScButton>
      </div>
    </ScDrawer>

    <!-- 模态框容器 -->
    <ScModal
      :open="modalOpen"
      title="Nimbus UI 模态对话框"
      @close="modalOpen = false"
    >
      <p style="font-size: 14px; color: var(--text-2); line-height: 1.6">
        模态框具有 <code>scale(0.96) + translateY(8px) -> 1.0</code> 的缩放入场动效与焦点锁定。
      </p>
      <div style="margin-top: 16px">
        <ScInput label="测试聚焦输入框" placeholder="打开弹窗自动获得焦点..." />
      </div>
      <template #actions>
        <ScButton variant="ghost" @click="modalOpen = false">取消</ScButton>
        <ScButton variant="primary" @click="modalOpen = false; toast.success('已保存配置')">保存变更</ScButton>
      </template>
    </ScModal>

    <!-- 命令式 Confirm 弹窗挂载点 -->
    <ScConfirmDialog />

      <!-- 全局 Toast 挂载点 (支持多位置自动渲染) -->
      <ScToastHost />

      <!-- 全局 Loading 挂载点 (支持 useLoading() 编程式调用) -->
      <ScLoading fullscreen />
    </div>
  </ScConfigProvider>
</template>

<style scoped>
.sc-layout {
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg);
}

.sc-showcase-rail {
  border-right: 1px solid var(--outline-soft);
  min-height: 100vh;
}

.sc-main-container {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.sc-topbar-showcase {
  height: var(--topbar-h);
  padding: 0 var(--sp-6);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--outline-soft);
  position: sticky;
  top: 0;
  z-index: var(--z-topbar);
  gap: var(--sp-3);
}

.sc-topbar-search {
  width: 260px;
}

.sc-content-wrap {
  flex: 1;
  max-width: var(--content-max);
  margin: 0 auto;
  width: 100%;
  padding: var(--sp-6) var(--sp-8) var(--sp-12);
  box-sizing: border-box;
}

.sc-mobile-rail-scrim {
  display: none;
}

@media (max-width: 768px) {
  .sc-mobile-rail-scrim {
    display: block;
    position: fixed;
    inset: 0;
    background: var(--scrim);
    z-index: var(--z-dialog);
  }

  .sc-showcase-rail {
    position: fixed !important;
    top: 0;
    bottom: 0;
    left: 0;
    width: 280px !important;
    z-index: calc(var(--z-dialog) + 1);
    background: var(--bg-elevated);
    box-shadow: var(--shadow-3);
    transform: translateX(-100%);
    transition: transform var(--dur-slow) var(--ease);
  }

  .sc-showcase-rail.is-mobile-open {
    transform: translateX(0);
  }

  .sc-showcase-rail :deep(.sc-rail__foot) {
    display: none;
  }

  .sc-showcase-rail :deep(.sc-nav-item__label),
  .sc-showcase-rail :deep(.sc-nav-item__trail) {
    display: flex !important;
  }

  .sc-topbar-showcase {
    padding: 0 var(--sp-3);
    gap: var(--sp-2);
  }

  .sc-topbar-search {
    width: 130px !important;
  }

  .sc-content-wrap {
    padding: var(--sp-4);
  }
}
</style>
