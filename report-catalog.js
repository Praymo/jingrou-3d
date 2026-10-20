// Only reviewed, site-local reports belong in this catalog. No arbitrary URL input.
export const reports = {
  "sk-hynix": {
    title: {zh: "SK 海力士全球交易敞口与跨市场定价研究", en: "SK Hynix: Global Exposure & Cross-Market Pricing"},
    category: {zh: "跨市场研究", en: "Cross-market research"},
    description: {zh: "从韩国正股、存托凭证到衍生敞口，梳理不同交易入口之间的权益映射与定价摩擦。", en: "Equity mapping and pricing frictions across common shares, depositary receipts, and derivative exposure."},
    note: {zh: "原始报告。数据截止 2026 年 7 月 12 日；文中价格与判断对应报告时点。", en: "Original report. Data cutoff: July 12, 2026. Prices and judgments reflect the report date."},
    file: "reports/sk-hynix-cross-market-20260712.pdf", cover: "reports/covers/sk-hynix.jpg", pages: 15, bytes: 1117523, date: "2026-07-12", anchor: "sk-hynix-global", original: true
  },
  "factor-robustness": {
    title: {zh: "市场波动 × 因子稳健性", en: "Market Volatility × Factor Robustness"},
    category: {zh: "量化研究 · 英文报告", en: "Quantitative research · English PDF"},
    description: {zh: "从波动状态出发，检验因子表现、无前视风险预算、交易成本与分样本稳健性。", en: "Volatility regimes, factor payoffs, ex-ante risk budgets, transaction costs, and robustness tests."},
    note: {zh: "原始英文报告。生成于 2026 年 8 月 24 日，样本截至 2026 年 6 月 30 日。", en: "Original English report, prepared August 24, 2026. Sample ends June 30, 2026."},
    file: "reports/market-volatility-factor-robustness-20260824.pdf", cover: "reports/covers/factor-robustness.jpg", pages: 6, bytes: 466673, date: "2026-08-24", anchor: null, original: true
  },
  "laopu-gold": {
    title: {zh: "老铺黄金＋航天晨光分析报告", en: "Lao Pu Gold & Aerosun: Company Analysis"},
    category: {zh: "公司研究 · 历史原稿", en: "Company research · Original archive"},
    description: {zh: "保留完整合订原稿：前 4 页为老铺黄金分析，随后为航天晨光的业务、财务与行业研究。", en: "The original combined file: four pages on Lao Pu Gold, followed by Aerosun business, financial, and industry analysis."},
    note: {zh: "原始扫描版，可在线翻页或下载。老铺黄金部分标注写作于 2024 年 11 月，并附有后续价格备注；具体时点以各篇原文为准。", en: "Original scanned PDF. The Lao Pu Gold section is dated November 2024 with a later price annotation. See each section for its historical context."},
    file: "reports/laopu-gold-aerosun-original.pdf", cover: "reports/covers/laopu-gold.jpg", pages: 28, bytes: 4421073, date: "2024-11", anchor: "lao-pu-gold", original: true
  },
  "lgfv-thesis": {
    title: {zh: "隐性债务治理对地级市城投净融资的影响", en: "Implicit Debt Governance & LGFV Net Financing"},
    category: {zh: "本科论文 · 公开阅读版", en: "Undergraduate thesis · Public reading copy"},
    description: {zh: "围绕政策冲击、连续处理强度 DID、平行趋势与稳健性检验，展示完整实证研究。", en: "The full empirical study, including continuous-treatment DID, parallel trends, and robustness checks."},
    note: {zh: "", en: ""},
    file: "reports/lgfv-implicit-debt-thesis-public.pdf?v=20261020-no-ack", cover: "reports/covers/lgfv-thesis.jpg", pages: 30, bytes: 1493698, date: "2026-04-12", anchor: "did-research", original: false
  }
};

export function fileSize(bytes) {
  return bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + " MB" : Math.round(bytes / 1024) + " KB";
}
