# Nimbus UI

<p align="center">
  <strong>现代 Vue 3 设计系统与微交互动效组件库</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-42b883.svg?style=flat-square&logo=vuedotjs" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646cff.svg?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License MIT" />
</p>

---

## 目录

- [特性亮点](#特性亮点)
- [快速安装](#快速安装)
- [使用方式](#使用方式)
  - [方式一：配合 unplugin-vue-components 按需自动引入（推荐）](#方式一配合-unplugin-vue-components-按需自动引入推荐)
  - [方式二：完整全局引入](#方式二完整全局引入)
  - [方式三：手动按需引入](#方式三手动按需引入)
- [设计系统与主题机制](#设计系统与主题机制)
  - [主题模式（Light / Dark / Gold）](#主题模式light--dark--gold)
  - [useTheme 组合式函数](#usetheme-组合式函数)
  - [核心设计令牌（Design Tokens）](#核心设计令牌design-tokens)
- [国际化 (i18n)](#国际化-i18n)
- [全局反馈机制](#全局反馈机制)
  - [Toast 消息通知 (`useToast`)](#toast-消息通知-usetoast)
  - [二次确认与危险操作挑战验证 (`useConfirm`)](#二次确认与危险操作挑战验证-useconfirm)
- [核心组件清单与索引](#核心组件清单与索引)
- [指令与工具库](#指令与工具库)
- [本地开发与体验 Playground](#本地开发与体验-playground)
- [开源许可](#开源许可)

---

## 特性亮点

- 🎨 **三套精细打磨的设计系统主题**：
  - **Light（经典浅色）**：明亮清爽、阅读友好。
  - **Dark（极客深色）**：低眩光、深邃且对比鲜明。
  - **Gold（尊享黑金）**：遵循严格冷灰低饱和基底与专属香槟金重音符哲学，绝无脏浊黄色 tint。
  - 支持跟随系统（`auto`）或手动切换，全量 CSS 变量无运行时样式开销。
- 🌊 **Material 3 级高质感物理动效**：
  - 减速与强调缓动曲线：`--ease: cubic-bezier(0.2, 0, 0, 1)`。
  - **动态弹性位移指示器**：`ScTabs` 激活项具备真实物理滑动宽度形变与连续位移。
  - **平滑触控水波纹**：`v-ripple` 指令自动计算触控点向外扩散并自然淡出。
  - **级联推入动效**：侧边菜单与抽屉阶梯式延时进场（Staggered Item-in: `0ms, 25ms, 50ms, 75ms...`）。
  - **视口感知避让**：`ScDropdownMenu` 自动探测屏幕边界，智能上下左右翻转。
  - **丝滑微动效**：物理惯性滑动开关、骨架屏循环扫光（Shimmer）、顶部无限平滑流动进度条。
- ♿ **无障碍友好（a11y）与用户尊重**：
  - 全量适配系统级 `prefers-reduced-motion`，低动效偏好下自动降级为极短过渡。
  - 对话框与抽屉提供 Focus Trap、ESC 快捷键响应与背景滚动穿透锁定。
- 🌍 **零侵入国际化（与 vue-i18n 原生协同）**：
  - 各组件自带自然的中文字符串回退，所有交互文案均暴露为标准 Props 与插槽。
  - 彻底解耦自定义语言包引擎，与 Vue 官方事实标准 `vue-i18n` 零心智负担配合。
- 📦 **现代前端工程化**：
  - 原生提供 `NimbusUIResolver`（兼容 `ShangCloudUIResolver`），与 `unplugin-vue-components` 零配置配合。
  - 纯 TypeScript 编写，完备的类型推导与 d.ts 声明。

---

## 快速安装

```bash
# 使用 pnpm（推荐）
pnpm add nimbus-ui bootstrap-icons

# 或使用 npm
npm install nimbus-ui bootstrap-icons

# 或使用 yarn
yarn add nimbus-ui bootstrap-icons
```

> **提示**：组件库内置图标依赖于 [Bootstrap Icons](https://icons.getbootstrap.com/) 图标类名（如 `bi bi-check`）。在项目中引入 Bootstrap Icons 字体样式即可完整显示组件内置图标：
>
> ```ts
> import "bootstrap-icons/font/bootstrap-icons.css";
> ```

---

## 使用方式

### 方式一：Vue 官方插件模式（最推荐：像 Element Plus 一样一键引入）

安装后在 `main.ts` 中调用 `app.use(NimbusUI)`，之后在任何页面或组件中**直接使用，无需任何 import**，并享有完备的 IDE 智能提示与 TypeScript 类型校验：

```ts
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import NimbusUI from "nimbus-ui";
import "nimbus-ui/style.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);

// 注册全局插件 (默认同时注册 Nb* 与 Sc* 双前缀别名)
app.use(NimbusUI);

// 也支持指定前缀：app.use(NimbusUI, { prefix: "nb" }) 或 { prefix: "sc" }
app.mount("#app");
```

在任意 `.vue` 页面中直接书写：

```vue
<template>
  <!-- 直接使用，IDE 拥有完整的 Props 与事件智能补全 -->
  <NbButton variant="primary" v-ripple>保存配置</NbButton>
  
  <NbSelect
    v-model="currentEnv"
    label="集群环境"
    :options="envOptions"
  />

  <NbCard title="服务监控" hover>
    <p>运行状态正常</p>
  </NbCard>
</template>
```

---

### 方式二：配合 `unplugin-vue-components` 零配置按需自动导入

如果你追求极限打包体积（Tree-Shaking），可以使用组件库自带的 `NimbusUIResolver`：

1. 安装自动导入插件：

```bash
pnpm add -D unplugin-vue-components
```

2. 在 `vite.config.ts` 中配置：

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { NimbusUIResolver } from "nimbus-ui";

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        NimbusUIResolver({
          // 默认会在使用到组件时自动按需加载样式
          importStyle: true,
        }),
      ],
    }),
  ],
});
```

---

### 方式三：手动具名按需导入

在特定单文件组件中直接解构：

```vue
<script setup lang="ts">
import { NbButton, NbDrawer, useToast } from "nimbus-ui";
import "nimbus-ui/style.css";

const { toast } = useToast();
</script>

<template>
  <NbButton variant="tonal" @click="toast.success('操作成功')">点击提示</NbButton>
</template>
```

---

## 设计系统与主题机制

### 主题模式（Light / Dark / Gold）

Nimbus UI 原生支持四种配置模式：

- `"auto"`：跟随操作系统暗色偏好（`prefers-color-scheme: dark`）动态响应；
- `"light"`：亮色模式；
- `"dark"`：暗色模式；
- `"gold"`：尊享特权黑金模式（深冷灰 + 金色点缀）。

### useTheme 组合式函数

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "nimbus-ui";

const { theme, mode, setTheme, cycleTheme, initTheme } = useTheme();

onMounted(() => {
  // 从 localStorage 恢复用户主题并挂载系统偏好监听器
  initTheme();
});
</script>

<template>
  <div>
    <p>当前计算主题: {{ theme }} (设定模式: {{ mode }})</p>
    <ScButton variant="outline" size="sm" @click="setTheme('light')"
      >浅色</ScButton
    >
    <ScButton variant="outline" size="sm" @click="setTheme('dark')"
      >深色</ScButton
    >
    <ScButton variant="outline" size="sm" @click="setTheme('gold')"
      >黑金</ScButton
    >
    <ScButton variant="tonal" size="sm" @click="cycleTheme()"
      >轮播切换</ScButton
    >
  </div>
</template>
```

### 核心设计令牌（Design Tokens）

组件库的所有颜色、边距、字号与圆角均由标准 CSS 变量定义，可随时在自定义样式中复用或覆盖：

| 令牌名                                 | 默认值 (Light)               | 说明                           |
| :------------------------------------- | :--------------------------- | :----------------------------- |
| `--bg`                                 | `#f0f4f9`                    | 页面全局背景色                 |
| `--surface`                            | `#ffffff`                    | 基础卡片/面板容器表面色        |
| `--surface-2`                          | `#f8fafd`                    | 次级容器表面色                 |
| `--surface-3`                          | `#eef2f8`                    | 三级底色与高亮条               |
| `--primary`                            | `#0b57d0`                    | 主题品牌色                     |
| `--primary-hover`                      | `#0847ac`                    | 品牌色悬浮态                   |
| `--primary-container`                  | `#d3e3fd`                    | 品牌浅色容器底色               |
| `--success` / `--warning` / `--danger` | 语义色彩                     | 成功、警告、危险/破坏性状态    |
| `--r-xs` ~ `--r-xl` / `--r-full`       | `8px` ~ `28px` / `999px`     | 圆角阶梯                       |
| `--sp-1` ~ `--sp-12`                   | `4px` ~ `48px`               | 间距步进                       |
| `--ease`                               | `cubic-bezier(0.2, 0, 0, 1)` | Material Design 3 强调动效缓动 |
| `--dur` / `--dur-slow`                 | `0.2s` / `0.3s`              | 基准过渡时长                   |

---

## 国际化 (与 vue-i18n 协同)

Nimbus UI 秉持现代组件库的极简无侵入设计原则，不生硬捆绑私有微型 i18n 引擎，所有组件均提供清晰规范的 Props 默认文案（如 `placeholder="请选择"`、`emptyText="暂无数据"`、`confirmText="确定"`）。

与 Vue 官方生态事实标准 **`vue-i18n`** 协同使用时，可直接通过属性或插槽自然传值：

```vue
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ScSelect, ScTable, ScConfirmDialog, useConfirm } from "nimbus-ui";

const { t } = useI18n();
const { confirm } = useConfirm();

async function handleAction() {
  const ok = await confirm({
    title: t("dialog.confirmTitle"),
    body: t("dialog.confirmBody"),
    confirmText: t("common.confirm"),
    cancelText: t("common.cancel")
  });
}
</script>

<template>
  <!-- 直接配合 $t / t() 传递本地化文案 -->
  <ScSelect
    v-model="env"
    :label="t('deploy.envLabel')"
    :placeholder="t('common.selectPlaceholder')"
    :options="options"
  />

  <ScTable :columns="columns" :data="data" :empty-text="t('common.noData')" />
</template>
```

---

## 全局反馈机制

### Toast 消息通知 (`useToast`)

在应用根组件（如 `App.vue`）中挂载 `<ScToastHost />`，即可在任何脚本中命令式触发丝滑通知：

```vue
<!-- App.vue -->
<template>
  <router-view />
  <!-- 支持 bottom-center / top-center / top-right / bottom-right -->
  <ScToastHost default-placement="bottom-center" />
</template>
```

在任意业务组件或函数中使用：

```ts
import { useToast } from "nimbus-ui";

const { toast } = useToast();

toast.success("应用配置已成功同步！");
toast.info("检测到新版本发布", 3000, "top-center");
toast.warning("服务响应延迟较高", 4000, "top-right");
toast.error("网络连接异常，请检查配置");
```

- **四向堆叠与平滑离场**：支持 `top-center`（向上飞出视口）、`bottom-center`（向下飞出视口）、`top-right` / `bottom-right`（向右侧飞出视口），队列变动时自动执行 FLIP 无缝补位，告别突兀原地消失；
- **悬停智能挂起倒计时**：鼠标悬停在 Toast 上时倒计时自动暂停，移开后平滑继续，避免用户阅读未完即消失；
- **触感微交互与微光**：悬停时自带物理微浮起、层次阴影与对应状态色光晕。

---

### 二次确认与危险操作挑战验证 (`useConfirm`)

在根组件挂载 `<ScConfirmDialog />`，通过 Promise 形式获得用户确认结果。同时支持**逐字输入 Challenge 验证码**，专为删除资源、清空数据库等危险操作量身定制：

```vue
<!-- App.vue -->
<template>
  <router-view />
  <ScConfirmDialog />
</template>
```

```ts
import { useConfirm, useToast } from "nimbus-ui";

const { confirm } = useConfirm();
const { toast } = useToast();

// 1. 普通确认对话框
async function handleAction() {
  const ok = await confirm({
    title: "确认发布更改？",
    body: "发布后配置将立即推送到所有运行节点。",
  });
  if (ok) {
    toast.success("已发布");
  }
}

// 2. 带有文字挑战的安全销毁操作
async function handleDeleteApp(appName: string) {
  const ok = await confirm({
    title: `确定删除应用 "${appName}" 吗？`,
    body: "该操作将立即销毁所有关联的沙箱与业务数据库，数据不可恢复。",
    danger: true,
    confirmText: "确认彻底删除",
    challenge: appName,
    challengeLabel: `请输入应用名称 "${appName}" 以核验身份`,
  });

  if (ok) {
    // 只有当用户逐字输入匹配的 challenge 字符串时，确定按钮才可点击并 resolve(true)
    toast.success("已成功删除");
  }
}
```

### 全屏加载与组件懒加载 (`useLoading` / `ScLoading`)

专为异步组件懒加载 (`defineAsyncComponent`)、Vue Router 路由切替或后台长耗时接口设计，采用极简圆弧与系统级刻度（Linear / Apple 风格）动效与环境毛玻璃 (`backdrop-filter`)：

```ts
import { defineAsyncComponent, h } from "vue";
import { ScLoading, useLoading } from "nimbus-ui";

// 1. 配合 Vue 3 异步组件懒加载 (超过 200ms 自动弹出全屏 Loading)
const AsyncHeavyChart = defineAsyncComponent({
  loader: () => import("./HeavyChart.vue"),
  loadingComponent: () =>
    h(ScLoading, { fullscreen: true, text: "正在懒加载图表模块..." }),
  delay: 200,
});

// 2. 编程式全局遮罩服务 (内置并发请求计数保护，避免多个接口同时完成时提前关闭)
const { show, hide, withLoading } = useLoading();

async function handleBatchProcess() {
  // 方式 A: 自动 Promise 包裹
  await withLoading(
    async () => {
      await api.batchSync();
    },
    { text: "正在批量同步远程数据..." },
  );

  // 方式 B: 手动调用
  show({ text: "资源打包中..." });
  try {
    await api.downloadBundle();
  } finally {
    hide();
  }
}
```

---

## 核心组件清单与索引

Nimbus UI 提供 30+ 款开箱即用的高阶组件，覆盖完整业务交互链路：

### 1. 基础与按钮 (Buttons & Cards)

| 组件           | 说明                    | 关键 Props / 特性                                                                                                                                                                                                      |
| :------------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScButton`     | 现代物理反馈按钮        | `variant`: `primary` / `tonal` / `outline` / `ghost` / `danger` / `danger-text`；`size`: `sm` / `md` / `lg`；`cta`: 是否强调渐变发光；`loading`: 加载态自旋；`ripple`: 水波纹开关；支持 `href` 自适应渲染为 `<a>` 标签 |
| `ScIconButton` | 圆形/圆角微交互图标按钮 | `variant`: 按钮变体；`size`: `sm` / `md` / `lg`；`rounded`: 是否纯圆角；`ripple`: 水波纹                                                                                                                               |
| `ScCard`       | 容器卡片                | `title`, `desc`, `hover` 抬升位移动效, `pad` 内边距模式, `flush` 无缝内容区, 支持 `header`, `actions`, `footer` 插槽                                                                                                   |

### 2. 导航与布局 (Navigation & Layout)

| 组件               | 说明                     | 关键 Props / 特性                                                                                                                                  |
| :----------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScSideRail`       | 响应式侧边主导航栏       | `collapsed`: 折叠态；`brandName`: 品牌标题；`logoSrc`: 品牌图标；`collapsible`: 是否允许用户折叠                                                   |
| `ScNavItem`        | 侧边栏菜单项             | `label`: 标题；`icon`: Bootstrap 图标名；`active`: 当前激活；`badge`: 未读角标计数；`staggerIndex`: 阶梯延时进场序号（0~7+）；`ripple`: 触控水波纹 |
| `ScPageHeader`     | 页面面包屑与标题区       | `title`: 标题；`desc`: 副标题；`crumbs`: 面包屑数组 `BreadcrumbItem[]`；支持 `actions` 操作栏插槽                                                  |
| `ScTabs`           | 弹性物理滑动下划线标签页 | `modelValue`: 选中项；`items`: `{ label, value, icon?, badge?, disabled? }`；下划线指示条跟随选中项自动计算位置并附带形变位移动效                  |
| `ScViewTransition` | 视图平滑进入容器         | `viewKey`: 监听视图切换并自动触发优雅渐入淡出动效                                                                                                  |

### 3. 表单与输入 (Form & Inputs)

| 组件         | 说明             | 关键 Props / 特性                                                                                                     |
| :----------- | :--------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `ScInput`    | 基础文本输入框   | `modelValue`, `label`, `placeholder`, `hint`, `error`, `required`, `mono`（等宽字体）, `disabled`                     |
| `ScSearch`   | 搜索输入框       | `modelValue`, `placeholder`；回车触发 `@search` 事件                                                                  |
| `ScSelect`   | 悬浮下拉选择器   | 与全局菜单风格统一的高级选择器，支持图标、分割线、键盘焦点选择与边缘自适应翻转 (`modelValue`, `options`, `menuLabel`) |
| `ScTextarea` | 多行文本域       | `modelValue`, `rows`, `maxlength`, `showCount`（实时字数统计）, `error`, `hint`                                       |
| `ScSwitch`   | 物理惯性滑动开关 | `modelValue`: 布尔值；支持平滑物理滚动指针微动效；`disabled`                                                          |

### 4. 浮层与反馈 (Overlays & Feedback)

| 组件              | 说明                   | 关键 Props / 特性                                                                                                                                                                  |
| :---------------- | :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScModal`         | 缩放淡入模态对话框     | `open`: 是否打开；`title`: 标题；`width`: 弹窗宽度；`dismissible`: 点击遮罩/ESC关闭；内置焦点陷阱与全屏滚动锁定                                                                    |
| `ScDrawer`        | 抽屉面板               | `open`: 开闭；`placement`: `left` / `right` / `bottom`；`width` / `height`；平滑自边缘推入                                                                                         |
| `ScDropdownMenu`  | 智能视口避让下拉菜单   | `align`: `start` / `end` / `auto`；自动探测视口高度，如果屏幕底部空间不足则自动改为向上弹出                                                                                        |
| `ScConfirmDialog` | 命令式确认对话框       | 与 `useConfirm()` 联动，全自动管理弹出、安全验证、确认与取消流程                                                                                                                   |
| `ScToastHost`     | 全局通知多方位容器     | 与 `useToast()` 联动，支持四向挂载，多条通知自动计算间距并流畅排队滑入                                                                                                             |
| `ScNotice`        | 静态提示通知条         | `variant`: `info` / `success` / `warning` / `danger`；`title`: 标题；`dismissible`: 是否带有关闭图标                                                                               |
| `ScProgress`      | 顶部无缝加载进度条     | `active`: 是否激活；`mode`: `indeterminate`（流光扫光不断流平滑淡出，默认）/ `trickle`（真实模拟步进与 100% 滑行渐隐）；`percent`: 指定百分比；`height`: 高度；`color`: 自定义颜色 |
| `ScLoading`       | 全屏与局部遮罩 Loading | 采用极简圆弧与经典刻度动效（Linear / Apple 风格）与毛玻璃磨砂遮罩；专为组件懒加载 (`defineAsyncComponent`) 与异步任务设计；支持声明式与命令式 (`useLoading()`)                     |

### 5. 数据展示与状态 (Data Display & States)

| 组件               | 说明                 | 关键 Props / 特性                                                                                                                        |
| :----------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `ScTable`          | 数据表格包装         | `columns`: `TableColumn[]`；`data`: 列表数据；`compact`: 紧凑行距；`hover`: 悬停高亮；支持 `cell-[key]` 单元格插槽与 `empty` 空态插槽    |
| `ScStat`           | 统计看板指标卡       | `label`: 指标名称；`value`: 数值；`delta`: 涨跌幅说明；`icon`: 对应图标                                                                  |
| `ScSkeleton`       | 扫光骨架屏           | `lines`: 渲染行数；`height`: 高度；`width`: 宽度；`circle`: 圆形头像模式；内置 1.4s 循环平滑扫光 (Shimmer)                               |
| `ScAsyncState`     | 异步生命周期管理容器 | `initial`, `pending`, `error`, `empty`；自动处理首次骨架占位、错误重试（`@retry`）、空数据状态与二次刷新遮罩                             |
| `ScCopyField`      | 密钥打码复制栏       | `value`: 文本内容；`secret`: 是否开启打码模式（点击眼睛图标显示/隐藏）；内置一键复制与复制成功 Toast 联动                                |
| `ScUserAvatar`     | 动态名称哈希头像     | `src`: 图片路径（加载失败自动降级）；`name`: 用户名（根据字符串哈希算法自动映射主题色并提取首字缩写）；`size`: `sm` / `md` / `lg` / `xl` |
| `ScBadge`          | 徽章标记             | `count`: 计数；`max`: 封顶值（如 99+）；`dot`: 小红点模式                                                                                |
| `ScChip`           | 标签胶囊             | `variant`: 标签色调；`interactive`: 可点击交互态；`active`: 选中高亮态                                                                   |
| `ScSponsorBadge`   | 赞助者尊享头衔徽章   | `label`: 称号名称；`compact`: 紧凑图标模式；黑金金属质感描边                                                                             |
| `ScConfigProvider` | 根配置注入器         | `theme`: 主题设置；向下响应式分发上下文                                                                                |

---

## 指令与工具库

### `v-ripple` 水波纹指令

支持应用于任意容器或自定义按钮上，跟随鼠标/触摸位置产生 Material 3 物理扩散水波纹：

```vue
<template>
  <!-- 基础用法 -->
  <div v-ripple class="custom-card">点击产生水波纹</div>

  <!-- 自定义波纹颜色与禁用控制 -->
  <div v-ripple="{ color: 'rgba(255, 0, 0, 0.2)', disabled: false }">
    自定义波纹
  </div>
</template>
```

### 实用工具函数 (`nimbus-ui`)

```ts
import {
  copyText,
  formatBytes,
  formatDate,
  hashHue,
  initials,
} from "nimbus-ui";

// 1. 剪贴板安全复制（自动降级支持）
await copyText("sk-prod-983274918237498");

// 2. 存储容量格式化
formatBytes(1048576); // "1.0 MB"
formatBytes(5368709120); // "5.0 GB"

// 3. 时间本地化格式化
formatDate(new Date(), "zh-CN"); // "2026/10/26 14:30:00"

// 4. 首字母提取
initials("Nimbus"); // "N"
initials("张三"); // "张"

// 5. 稳定哈希色阶计算 (返回 1 ~ 6，映射 --viz-1 ~ --viz-6)
hashHue("user_id_1024"); // 3
```

---

## 本地开发与体验 Playground

组件库内置了全功能的交互式 Playground，囊括了所有组件交互示例、国际化切换、主题轮换与动效演示。

```bash
# 1. 克隆并进入目录
cd nimbus-ui

# 2. 安装项目依赖
pnpm install

# 3. 运行交互式 Playground 演示站
pnpm dev

# 4. 执行类型检查
pnpm typecheck

# 5. 构建库产物 (输出到 dist/ 目录，包含 esm, umd, css, d.ts)
pnpm build
```

---

## 目录结构

```text
nimbus-ui/
├── src/
│   ├── components/        # 核心 UI 组件
│   │   ├── avatar/        # 用户头像 ScUserAvatar
│   │   ├── badge/         # 徽章 ScBadge, ScChip, ScSponsorBadge
│   │   ├── button/        # 按钮 ScButton, ScIconButton
│   │   ├── card/          # 卡片 ScCard
│   │   ├── config-provider/ # 配置容器 ScConfigProvider
│   │   ├── confirm/       # 二次确认 ScConfirmDialog
│   │   ├── copy/          # 密钥复制 ScCopyField
│   │   ├── drawer/        # 抽屉 ScDrawer
│   │   ├── dropdown/      # 下拉菜单 ScDropdownMenu
│   │   ├── header/        # 页头 ScPageHeader
│   │   ├── input/         # 表单输入 ScInput, ScSearch, ScSelect, ScTextarea
│   │   ├── modal/         # 模态弹窗 ScModal
│   │   ├── notice/        # 提示通知 ScNotice
│   │   ├── progress/      # 进度条 ScProgress
│   │   ├── rail/          # 侧边栏 ScSideRail, ScNavItem
│   │   ├── skeleton/      # 骨架与异步态 ScSkeleton, ScAsyncState
│   │   ├── stat/          # 统计指标 ScStat
│   │   ├── switch/        # 滑动开关 ScSwitch
│   │   ├── table/         # 数据表格 ScTable
│   │   ├── tabs/          # 弹性标签页 ScTabs
│   │   ├── toast/         # 吐司消息 ScToastHost
│   │   └── view/          # 视图动画 ScViewTransition
│   ├── composables/       # 组合式函数 (useTheme, useToast, useConfirm, useLoading)
│   ├── directives/        # 自定义指令 (v-ripple)
│   ├── styles/            # 核心样式体系 (tokens, animations, layout, components)
│   ├── utils/             # 实用格式化与系统工具
│   ├── playground/        # 交互演示应用
│   ├── index.ts           # 库总入口
│   └── resolver.ts        # unplugin-vue-components 专用解析器
├── dist/                  # 构建产物目录
├── package.json
└── vite.config.ts
```

---

## 开源许可

本项目基于 [MIT License](./package.json) 开源许可协议发布。
