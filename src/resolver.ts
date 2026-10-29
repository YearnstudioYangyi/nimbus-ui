export interface NimbusUIResolverOptions {
  /**
   * 是否自动导入全量样式文件
   * @default true
   */
  importStyle?: boolean;
  /**
   * 自定义组件前缀过滤（默认自动匹配 'Nb' 与 'Sc'）
   */
  prefix?: string;
}

export type ShangCloudUIResolverOptions = NimbusUIResolverOptions;

/**
 * Nimbus UI 专用的 unplugin-vue-components 按需引入解析器
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import Components from 'unplugin-vue-components/vite'
 * import { NimbusUIResolver } from 'nimbus-ui'
 *
 * export default defineConfig({
 *   plugins: [
 *     Components({
 *       resolvers: [NimbusUIResolver()]
 *     })
 *   ]
 * })
 * ```
 */
export function NimbusUIResolver(options: NimbusUIResolverOptions = {}) {
  const { importStyle = true, prefix } = options;

  return {
    type: "component" as const,
    resolve: (name: string) => {
      const isMatched = prefix
        ? name.startsWith(prefix)
        : name.startsWith("Nb") || name.startsWith("Sc");

      if (isMatched) {
        return {
          name,
          from: "nimbus-ui",
          sideEffects: importStyle ? "nimbus-ui/style.css" : undefined
        };
      }
      return undefined;
    }
  };
}

export const ShangCloudUIResolver = NimbusUIResolver;
