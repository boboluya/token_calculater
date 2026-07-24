/** 站点 SEO 常量与 URL 解析（供 metadata / robots / sitemap 复用） */

export const SITE_NAME = "Token 计算器";

export const SITE_TITLE = "AI 助手 Token 用量分析与成本计算器";

export const SITE_DESCRIPTION =
  "本地汇总 Cursor、Claude Code、Codex、OpenCode 的 Token 用量，提供趋势图表、月度明细与多模型成本估算，帮助开发者掌握 AI 助手消费。";

export const SITE_KEYWORDS = [
  "Token 计算器",
  "Token 用量分析",
  "AI 成本计算",
  "Cursor Token",
  "Claude Code 用量",
  "Codex Token",
  "OpenCode",
  "LLM 成本",
  "AI 助手用量看板",
] as const;

/**
 * 解析站点绝对根地址，供 Open Graph / canonical / sitemap 使用。
 * 优先 NEXT_PUBLIC_SITE_URL，其次 Vercel 部署域名，本地回退 localhost。
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return new URL(explicit.endsWith("/") ? explicit : `${explicit}/`);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return new URL(`https://${host}/`);
  }

  return new URL("http://localhost:3000/");
}