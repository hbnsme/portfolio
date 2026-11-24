const base = import.meta.env.BASE_URL + 'portfolio-assets/';

export type PublishedReport = { filename: string; pages: number; href: string };
type PublishedImage = { filename: string; title: string; caption: string };
type PublishedAssets = { report: PublishedReport; images: PublishedImage[] };

function report(filename: string, pages: number): PublishedReport {
  return { filename, pages, href: base + 'reports/' + filename };
}

export const imageHref = (image: PublishedImage) => base + 'images/' + image.filename;

export const publishedAssets: Partial<Record<string, PublishedAssets>> = {
  marginalia: {
    report: report('marginalia.pdf', 15),
    images: [
      { filename: 'marginalia-workspace.jpg', title: '阅读工作区', caption: '冻结演示 V1 实图。据 V2.4 第 1 页，样例正文与笔记局部已移除。' },
    ],
  },
  'model-evaluation': {
    report: report('model-evaluation.pdf', 8),
    images: [
      { filename: 'model-evaluation-rubric.jpg', title: '情感理解评测维度与初评', caption: '报告第 3 页。作者定性评价与 AI 辅助初评仅适用于本次小样本。' },
      { filename: 'model-evaluation-failure.jpg', title: '典型错误案例对照', caption: '报告第 4 页。以非原文概述呈现代表性输出。' },
    ],
  },
  'content-strategy': {
    report: report('content-strategy.pdf', 4),
    images: [
      { filename: 'content-strategy-comparison.jpg', title: '双列与单列信息流对照', caption: '报告第 1 页。交互示意，非真实平台界面。' },
      { filename: 'content-strategy-ecosystem.jpg', title: '用户、供给与商业化影响路径', caption: '报告第 2 页。影响关系为待验证假设。' },
    ],
  },
  'hotel-search': {
    report: report('hotel-search-strategy.pdf', 5),
    images: [
      { filename: 'hotel-search-funnel.jpg', title: '从搜索到支付的转化漏斗', caption: '报告第 1 页。数字均为教学模拟数据。' },
      { filename: 'hotel-search-diagnosis.jpg', title: '转化异常的原因与指标拆解', caption: '报告第 2 页。教学模拟线索与待验证假设。' },
    ],
  },
  mirror: {
    report: report('mirror-narrative-design.pdf', 10),
    images: [
      { filename: 'mirror-route.jpg', title: '从列车出发的叙事路线', caption: '策划案第 3 页。场景与线索为设计稿。' },
      { filename: 'mirror-branch.jpg', title: '左右蜗角对照与分支结构', caption: '策划案第 4 页。原作引文以非原文概述代替，部分历史语境待核。' },
    ],
  },
};
