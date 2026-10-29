# Nimbus UI

<p align="center">
  <strong>现代 Vue 3 设计系统与微交互动效组件库</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@yearnstudioyangyi/nimbus-ui">
    <img src="https://img.shields.io/npm/v/@yearnstudioyangyi/nimbus-ui.svg?style=flat-square&color=0b57d0" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/Vue-3.x-42b883.svg?style=flat-square&logo=vuedotjs" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646cff.svg?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License MIT" />
</p>

Nimbus UI 是一套专注于**现代高质感视觉体系**与**细腻物理微交互**的 Vue 3 组件库。提供 Light / Dark / Gold（尊享黑金）三套独立打磨的设计系统、全量 CSS 变量令牌，以及开箱即用的全局反馈（Toast、挑战式安全确认弹窗、并发安全 Loading 遮罩等）。

---

## 目录

- [特性亮点](#特性亮点)
- [快速安装](#快速安装)
- [使用方式](#使用方式)
  - [方式一：Vue 官方插件模式（最推荐：全局一键引入）](#方式一vue-官方插件模式最推荐全局一键引入)
  - [方式二：配合 unplugin-vue-components 按需自动引入](#方式二配合-unplugin-vue-components-按需自动引入)
  - [方式三：手动具名按需导入](#方式三手动具名按需导入)
- [推荐应用架构 (App.vue 最佳实践)](#推荐应用架构-appvue-最佳实践)
- [设计系统与主题机制](#设计系统与主题机制)
  - [主题模式与 useTheme](#主题模式与-usetheme)
  - [尊享黑金（Gold）主题视觉哲学](#尊享黑金gold主题视觉哲学)
  - [核心设计令牌（Design Tokens）与自定义覆盖](#核心设计令牌design-tokens与自定义覆盖)
- [全局反馈机制](#全局反馈机制)
  - [Toast 消息通知 (`useToast` / `ScToastHost`)](#toast-消息通知-usetoast--sctoasthost)
  - [二次确认与安全挑战验证 (`useConfirm` / `ScConfirmDialog`)](#二次确认与安全挑战验证-useconfirm--scconfirmdialog)
  - [全屏与局部加载遮罩 (`useLoading` / `ScLoading`)](#全屏与局部加载遮罩-useloading--scloading)
- [国际化 (i18n) 设计与实践](#国际化-i18n-设计与实践)
- [核心组件清单与索引](#核心组件清单与索引)
- [指令与实用工具库](#指令与实用工具库)
- [本地开发与体验 Playground](#本地开发与体验-playground)
- [开源许可](#开源许可)

---

## 特性亮点

- 🎨 **三套精细打磨的设计系统主题**：
  - **Light（经典浅色）**：明亮清爽，阅读与信息密度极佳。
  - **Dark（极客深色）**：低眩光、层次分明的冷灰色阶。
  - **Gold（尊享黑金）**：严格遵循冷灰低饱和基底与专属香槟金点缀，绝无脏浊黄色 tint。
  - 全量采用原生 CSS 变量，零运行时样式性能损耗，切换主题无缝瞬间生效。
- 🌊 **Material 3 级高质感物理动效**：
  - **动态弹性位移指示器**：`ScTabs` / `NbTabs` 激活项具备真实物理滑动宽度形变与连续位移。
  - **平滑触控水波纹**：`v-ripple` 指令自动计算点击原点并向外辐射扩散。
  - **级联推入动效**：侧边菜单与抽屉阶梯式延时进场（Staggered Item-in）。
  - **视口自适应避让**：`ScDropdownMenu` / `ScSelect` 自动探测屏幕边界，智能上下左右翻转。
  - **丝滑微动效**：物理惯性滑动开关、骨架屏平滑扫光（Shimmer）、顶部无限平滑流动进度条。
- ♿ **无障碍友好（a11y）与用户尊重**：
  - 全量适配系统级 `prefers-reduced-motion`，低动效偏好下自动优雅降级。
  - 模态框与抽屉提供 Focus Trap 键盘焦点锁定、ESC 快捷退出与背景滚动穿透锁定。
- 🌍 **零侵入国际化（与 vue-i18n 原生协同）**：
  - 组件内置自然的中文字符串回退，所有交互文案均暴露为标准 Props 与插槽。
  - 彻底解耦自定义语言包引擎，与 Vue 官方事实标准 `vue-i18n` 零心智负担自然传值。
- 📦 **纯粹 TypeScript & 智能补全**：
  - 纯 TypeScript 编写，自带完整 `.d.ts` 声明。
  - 内置 `GlobalComponents` 接口扩充，在 VSCode / Volar 下书写模板无需手工配置即可享受完整的 Props、Events、Slots 自动补全。

---

## 快速安装

```bash
# 使用 pnpm（推荐）
pnpm add @yearnstudioyangyi/nimbus-ui bootstrap-icons

# 或使用 npm
npm install @yearnstudioyangyi/nimbus-ui bootstrap-icons

# 或使用 yarn
yarn add @yearnstudioyangyi/nimbus-ui bootstrap-icons
```

> **图标库提示**：组件库内置图标基于行业通用的 [Bootstrap Icons](https://icons.getbootstrap.com/) 类名规范（如 `bi bi-check-lg`、`bi bi-search`）。只需在项目入口全局引入图标字体样式即可完整呈现组件内置图标：
>
> ```ts
> import "bootstrap-icons/font/bootstrap-icons.css";
> ```

---

## 使用方式

Nimbus UI 提供了灵活多样的接入方式，无论是一键全局体验还是极速按需打包，均能开箱即用：

### 方式一：Vue 官方插件模式（最推荐：全局一键引入）

在 `main.ts` 中通过 `app.use(NimbusUI)` 注册，之后在项目内的任何页面或组件中**直接书写，无需手动 import**。

并且由于库内自带 `GlobalComponents` 类型声明，IDE 与 Volar 会自动提供完备的代码补全与类型检查：

```ts
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

// 引入 Nimbus UI 插件与全套样式
import NimbusUI from "@yearnstudioyangyi/nimbus-ui";
import "@yearnstudioyangyi/nimbus-ui/style.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);

// 方式 1.1：默认注册 (同时支持 Nb* 与 Sc* 双前缀别名，兼容性最好)
app.use(NimbusUI);

// 方式 1.2：仅注册现代化 Nb 前缀 (如 <NbButton>、<NbCard>、<NbSelect>)
// app.use(NimbusUI, { prefix: "nb" });

// 方式 1.3：仅注册经典 Sc 前缀 (如 <ScButton>、<ScCard>、<ScSelect>)
// app.use(NimbusUI, { prefix: "sc" });

app.mount("#app");
```

在任意 `.vue` 页面中直接书写：

```vue
<script setup lang="ts">
import { ref } from "vue";

const activeTab = ref("overview");
const selectedCluster = ref("prod-hk");
const switchValue = ref(true);

const clusterOptions = [
  { label: "中国香港主节点 (prod-hk)", value: "prod-hk", icon: "bi-hdd-network" },
  { label: "新加坡边缘加速 (sg-edge)", value: "sg-edge", icon: "bi-lightning-charge" },
  { label: "北美容灾备份 (us-west)", value: "us-west", icon: "bi-shield-check" }
];
</script>

<template>
  <div class="page-container">
    <NbCard title="集群运行概览" hover>
      <template #actions>
        <NbButton variant="primary" v-ripple>同步配置</NbButton>
      </template>

      <div class="row">
        <NbSelect
          v-model="selectedCluster"
          label="当前环境"
          :options="clusterOptions"
        />

        <NbSwitch v-model="switchValue" label="自动扩缩容" />
      </div>
    </NbCard>
  </div>
</template>
```

---

### 方式二：配合 `unplugin-vue-components` 按需自动引入

如果你追求极小打包体积与 Tree-shaking，可以使用组件库内置的 `NimbusUIResolver`（兼容 `ShangCloudUIResolver`）：

1. 安装自动引入插件：

```bash
pnpm add -D unplugin-vue-components
```

2. 在 `vite.config.ts` 中配置 Resolver：

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { NimbusUIResolver } from "@yearnstudioyangyi/nimbus-ui";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        NimbusUIResolver({
          // 开启后，在模板中使用组件时会自动按需引入该组件专属样式
          importStyle: true,
          // 可选: 仅自动解析指定前缀组件，如 'Nb' 或 'Sc'（默认同时匹配 Nb* 与 Sc*）
          prefix: "Nb",
        }),
      ],
    }),
  ],
});
```

---

### 方式三：手动具名按需导入

在单个单文件组件中直接解构所需组件，完全自主控制：

```vue
<script setup lang="ts">
import {
  NbButton,
  NbDrawer,
  NbCard,
  useToast,
  vRipple
} from "@yearnstudioyangyi/nimbus-ui";
import "@yearnstudioyangyi/nimbus-ui/style.css";

const { toast } = useToast();
</script>

<template>
  <NbCard title="按需引入演示">
    <NbButton variant="tonal" v-ripple @click="toast.success('操作成功')">
      点击弹出通知
    </NbButton>
  </NbCard>
</template>
```

---

## 推荐应用架构 (App.vue 最佳实践)

为了让 **Toast 通知**、**二次确认对话框** 与 **主题上下文** 在整个应用中平滑协同，推荐在应用的根组件（`App.vue`）采用如下标准装配结构：

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { onMounted } from "vue";
import {
  ScConfigProvider,
  ScToastHost,
  ScConfirmDialog,
  useTheme
} from "@yearnstudioyangyi/nimbus-ui";

const { initTheme } = useTheme();

onMounted(() => {
  // 恢复本地存储的主题设定，并自动挂载系统亮/暗色偏好监听
  initTheme();
});
</script>

<template>
  <ScConfigProvider>
    <!-- 业务路由出口 -->
    <router-view />

    <!-- 全局 Toast 挂载容器：支持 bottom-center / top-center / top-right / bottom-right -->
    <ScToastHost default-placement="bottom-center" />

    <!-- 全局二次确认与安全挑战弹窗 -->
    <ScConfirmDialog />
  </ScConfigProvider>
</template>
```

---

## 设计系统与主题机制

### 主题模式与 useTheme

Nimbus UI 原生支持四种主题模式：
- `"auto"`：跟随操作系统暗色偏好（`prefers-color-scheme: dark`）动态响应；
- `"light"`：经典浅色模式；
- `"dark"`：极客冷灰深色模式；
- `"gold"`：尊享黑金模式。

```vue
<script setup lang="ts">
import { useTheme, ScButton } from "@yearnstudioyangyi/nimbus-ui";

const { theme, mode, setTheme, cycleTheme } = useTheme();
</script>

<template>
  <div class="theme-toolbar">
    <span>当前生效: {{ theme }} (模式: {{ mode }})</span>
    <ScButton size="sm" variant="outline" @click="setTheme('light')">浅色</ScButton>
    <ScButton size="sm" variant="outline" @click="setTheme('dark')">深色</ScButton>
    <ScButton size="sm" variant="outline" @click="setTheme('gold')">黑金</ScButton>
    <ScButton size="sm" variant="tonal" @click="cycleTheme()">轮播切换</ScButton>
  </div>
</template>
```

### 尊享黑金（Gold）主题视觉哲学

Nimbus UI 的 Gold 主题并非浮夸的亮黄色涂层，而是经过严谨色彩学调校的冷灰基底与香槟金重音符设计：
- **背景表面**：保留 `#0c0d0e` ~ `#1b1c1e` 的超低眩光深冷灰层次；
- **重音强调**：在主操作按钮、赞助者徽章、激活指示器与悬浮边框上点缀专属香槟金（`#e2ba64`）；
- **质感**：提供专门的冷色微光边框与金属质感，专为管理后台中的 VIP / 旗舰级控制台场景定制。

### 核心设计令牌（Design Tokens）与自定义覆盖

所有色彩、圆角、阴影与过渡均通过标准 CSS 变量驱动。你可以直接在自己的全局 CSS 文件（如 `src/style.css`）中自由覆盖变量以适配自家品牌：

```css
/* 自定义品牌色彩示例 */
:root {
  --primary: #2563eb;           /* 替换为你的品牌主色 */
  --primary-hover: #1d4ed8;     /* 悬浮主色 */
  --primary-container: #dbeafe; /* 浅色容器填充色 */
  --r-md: 12px;                 /* 自定义基准圆角 */
}
```

#### 常用核心变量速查表

| 令牌名 | 默认值 (Light) | 说明 |
| :--- | :--- | :--- |
| `--bg` | `#f0f4f9` | 页面全局背景基底色 |
| `--surface` | `#ffffff` | 基础卡片、面板与对话框表面色 |
| `--surface-2` | `#f8fafd` | 次级容器表面色（输入框、表头） |
| `--surface-3` | `#eef2f8` | 三级底色（Hover 高亮条、选中项底色） |
| `--primary` | `#0b57d0` | 品牌主色 |
| `--primary-container` | `#d3e3fd` | 品牌浅色容器填充色 |
| `--success` / `--warning` / `--danger` | 语义色彩 | 成功、警告、破坏性危险状态色 |
| `--r-xs` ~ `--r-xl` / `--r-full` | `8px` ~ `28px` / `999px` | 圆角阶梯系统 |
| `--ease` | `cubic-bezier(0.2, 0, 0, 1)` | Material 3 强调动效物理曲线 |
| `--dur` / `--dur-slow` | `0.2s` / `0.3s` | 基准过渡时长 |

---

## 全局反馈机制

### Toast 消息通知 (`useToast` / `ScToastHost`)

在应用中挂载 `<ScToastHost />` 后，在任何业务组件、Pinia Store 或普通 TS 工具文件中均可调用：

```ts
import { useToast } from "@yearnstudioyangyi/nimbus-ui";

const { toast } = useToast();

// 基础调用
toast.success("应用配置已成功同步！");
toast.error("网络连接断开，请检查网关设置");

// 指定展示时长与弹出位置 (bottom-center / top-center / top-right / bottom-right)
toast.info("检测到新版本发布", 4000, "top-center");
toast.warning("服务响应延迟过高", 3000, "top-right");
```

- **平滑离场动效**：四向挂载分别沿视口边缘方向自然滑出并配合 FLIP 队列自动补位；
- **悬停挂起**：鼠标指针悬停于通知卡片上时，剩余倒计时自动暂停，移开后平滑恢复；
- **状态微光**：卡片右侧/底侧带有对应状态色的柔和环境光晕与物理微浮起。

---

### 二次确认与安全挑战验证 (`useConfirm` / `ScConfirmDialog`)

挂载 `<ScConfirmDialog />` 后，即可使用 Promise 式的命令调用，摆脱在每个页面手动写 `dialogVisible` 的繁琐状态管理：

```ts
import { useConfirm, useToast } from "@yearnstudioyangyi/nimbus-ui";

const { confirm } = useConfirm();
const { toast } = useToast();

// 1. 普通操作确认
async function handlePublish() {
  const ok = await confirm({
    title: "确认发布当前更改？",
    body: "发布后新配置将立即下发至所有集群节点并生效。",
    confirmText: "立即发布",
    cancelText: "取消"
  });

  if (ok) {
    toast.success("已发布成功");
  }
}

// 2. 危险操作挑战输入校验 (专为删除库表、清空应用等破坏性动作设计)
async function handleDeleteCluster(clusterName: string) {
  const ok = await confirm({
    title: `确定彻底删除集群 "${clusterName}"？`,
    body: "该操作为不可逆危险操作，关联的所有节点与数据副本将被永久清空。",
    danger: true,
    confirmText: "确认彻底销毁",
    // 关键：开启挑战校验，用户必须逐字敲入完全一致的名称，确认按钮才可点击
    challenge: clusterName,
    challengeLabel: `请输入集群名称 "${clusterName}" 以确认操作身份`,
  });

  if (ok) {
    toast.success("集群已成功删除");
  }
}
```

---

### 全屏与局部加载遮罩 (`useLoading` / `ScLoading`)

专为异步路由切换、异步组件懒加载（`defineAsyncComponent`）与后台并发接口设计。

#### 1. 声明式局部容器 Loading
在普通容器内作为遮罩：

```vue
<template>
  <div class="table-card relative">
    <ScLoading
      :active="isFetching"
      text="正在拉取最新报表..."
      spinner="ring"
      card
    />
    <ScTable :columns="columns" :data="data" />
  </div>
</template>
```

- `spinner`: 支持 `"ring"`（Linear / Vercel 极简流动圆弧）与 `"spokes"`（Apple 经典 12 瓣刻度自旋）；
- `card`: 是否以半透明磨砂卡片 HUD 的形式呈现，质感更聚焦；
- `fullscreen`: 是否作为固定全屏遮罩。

#### 2. 编程式并发安全全局 Loading
内置并发计数器（Reference Counting），避免两个并行异步接口中先返回的一个提前关闭了全局 Loading：

```ts
import { useLoading } from "@yearnstudioyangyi/nimbus-ui";

const { show, hide, withLoading } = useLoading();

async function handleBatchTask() {
  // 方式 A：自动 Promise 包裹管理（推荐）
  await withLoading(
    async () => {
      await api.fetchData();
      await api.processData();
    },
    { text: "正在批量处理，请稍候...", spinner: "ring" }
  );

  // 方式 B：手动调用
  show({ text: "正在打包导出..." });
  try {
    await api.exportFile();
  } finally {
    hide();
  }
}
```

---

## 国际化 (i18n) 设计与实践

Nimbus UI 坚持现代组件库**零依赖、轻量化**的原则：
- **不捆绑私有微型 i18n 引擎**：避免带来不必要的包体积开销与私有配置学习心智；
- **开箱即用中文回退**：所有交互组件均带有优雅的中文回退文本；
- **标准属性与插槽透传**：文案均作为标准的 Props（如 `placeholder`、`emptyText`、`confirmText`、`cancelText`）直接暴露。

与 Vue 官方事实标准 **`vue-i18n`** 协同使用时自然无缝：

```vue
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ScSelect, ScTable } from "@yearnstudioyangyi/nimbus-ui";

const { t } = useI18n();
</script>

<template>
  <ScSelect
    v-model="env"
    :label="t('app.env')"
    :placeholder="t('common.select')"
    :options="options"
  />

  <ScTable
    :columns="columns"
    :data="tableData"
    :empty-text="t('common.noData')"
  />
</template>
```

---

## 核心组件清单与索引

组件库提供 30+ 款高阶组件，同时注册 `Nb*`（现代）与 `Sc*`（经典）双前缀：

### 1. 基础与按钮 (Buttons & Cards)
- **`ScButton` / `NbButton`**：物理反馈按钮，支持 `primary` / `tonal` / `outline` / `ghost` / `danger` 变体、`cta` 渐变发光高亮、`loading` 态与水波纹。
- **`ScIconButton` / `NbIconButton`**：圆形/圆角微交互图标按钮。
- **`ScCard` / `NbCard`**：现代容器卡片，支持 `hover` 抬升位移动效、`flush` 内容贴边与丰富插槽。

### 2. 导航与布局 (Navigation & Layout)
- **`ScSideRail` / `NbSideRail`**：自适应侧边主导航栏，支持折叠、品牌区域定制。
- **`ScNavItem` / `NbNavItem`**：菜单项，支持 Bootstrap 图标、未读角标与阶梯延时进场动效。
- **`ScPageHeader` / `NbPageHeader`**：页面面包屑导航与标题操作区。
- **`ScTabs` / `NbTabs`**：弹性物理滑动下划线标签页，下划线自带形变位移动效。
- **`ScViewTransition` / `NbViewTransition`**：页面/视图平滑切替容器。

### 3. 表单与输入 (Form & Inputs)
- **`ScInput` / `NbInput`**：基础文本输入框，支持标签、辅助说明、错误校验提示、等宽字体。
- **`ScSearch` / `NbSearch`**：搜索输入框，支持一键清空与回车触发。
- **`ScSelect` / `NbSelect`**：悬浮下拉选择器，与全局菜单风格统一，支持视口边缘自适应翻转。
- **`ScTextarea` / `NbTextarea`**：多行文本域，支持实时字数统计。
- **`ScSwitch` / `NbSwitch`**：物理惯性滑动开关。

### 4. 浮层与反馈 (Overlays & Feedback)
- **`ScModal` / `NbModal`**：缩放淡入模态对话框，内置 Focus Trap 焦点锁定与滚动穿透防护。
- **`ScDrawer` / `NbDrawer`**：抽屉面板，支持 `left` / `right` / `bottom` 方向边缘滑入。
- **`ScDropdownMenu` / `NbDropdownMenu`**：智能视口避让下拉菜单，底部空间不足时自动向上翻转。
- **`ScConfirmDialog` / `NbConfirmDialog`**：命令式二次确认与安全挑战输入对话框。
- **`ScToastHost` / `NbToastHost`**：全局通知多方位容器。
- **`ScNotice` / `NbNotice`**：静态状态提示条（`info` / `success` / `warning` / `danger`）。
- **`ScProgress` / `NbProgress`**：顶部无缝加载进度条，支持流光扫光与平滑淡出。
- **`ScLoading` / `NbLoading`**：全屏/局部遮罩 Loading，支持 Linear 弧形与 Apple 刻度两种风格。

### 5. 数据展示与状态 (Data Display & States)
- **`ScTable` / `NbTable`**：数据表格包装，支持列插槽 `cell-[key]`、紧凑模式与空态插槽。
- **`ScStat` / `NbStat`**：指标卡片，支持数值、涨跌幅、图标展示。
- **`ScSkeleton` / `NbSkeleton`**：扫光骨架屏，内置 1.4s 循环平滑扫光。
- **`ScAsyncState` / `NbAsyncState`**：异步生命周期容器（初始 -> 加载 -> 错误重试 -> 空态 -> 正常渲染）。
- **`ScCopyField` / `NbCopyField`**：密钥打码脱敏复制栏，支持显隐切换与一键复制通知。
- **`ScUserAvatar` / `NbUserAvatar`**：动态用户名哈希色彩头像，图片失效自动降级为首字缩写。
- **`ScBadge` / `NbBadge`**：徽标红点与数字计数胶囊。
- **`ScChip` / `NbChip`**：标签胶囊，支持交互点击与激活高亮态。
- **`ScSponsorBadge` / `NbSponsorBadge`**：尊享头衔徽章，金属质感描边。
- **`ScConfigProvider` / `NbConfigProvider`**：根配置上下文注入器。

---

## 指令与实用工具库

### `v-ripple` 水波纹指令

支持应用于任何原生元素或自定义组件上，遵循触控点向外扩散的 Material 3 物理涟漪：

```vue
<template>
  <!-- 基础用法 -->
  <div v-ripple class="action-card">点击产生触控波纹</div>

  <!-- 自定义波纹颜色与禁用 -->
  <div v-ripple="{ color: 'rgba(59, 130, 246, 0.2)', disabled: false }">
    自定义主色波纹
  </div>
</template>
```

### 实用工具函数

```ts
import {
  copyText,
  formatBytes,
  formatDate,
  hashHue,
  initials
} from "@yearnstudioyangyi/nimbus-ui";

// 1. 剪贴板安全复制（自动处理剪贴板权限与降级模式）
await copyText("nimbus_token_live_abcdef123456");

// 2. 存储容量格式化
formatBytes(1048576);       // "1.0 MB"
formatBytes(5368709120);    // "5.0 GB"

// 3. 日期时间本地化格式化
formatDate(new Date(), "zh-CN"); // "2026/10/29 15:00:00"

// 4. 首字母/中文字符提取 (用于默认头像)
initials("Nimbus UI");      // "N"
initials("张三");           // "张"

// 5. 稳定哈希色阶计算 (将任意字符串稳定映射到 1 ~ 6 色标)
hashHue("user_1024");       // 3
```

---

## 本地开发与体验 Playground

组件库内置了一个完备的交互式 Playground，涵盖所有组件的 Props 调试、主题实时切换与国际化演练：

```bash
# 1. 安装项目依赖
pnpm install

# 2. 启动交互式 Playground 演示站
pnpm dev

# 3. 运行 TypeScript 类型检查
pnpm typecheck

# 4. 构建发布产物 (生成 dist/ 目录，包含 ESM、UMD、CSS 与 .d.ts)
pnpm build
```

---

## 开源许可

本项目基于 [MIT License](./package.json) 开源协议分发与使用。
