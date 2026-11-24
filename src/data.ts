export const profile = '北京大学中国语言文学系硕士在读，关注文学叙事、人工智能与数字产品，探索人文经验在技术时代的表达方式。';

export const categories = [
  ['ai', 'AI Product', 'AI产品'],
  ['evaluation', 'Model Evaluation', '模型评测'],
  ['strategy', 'Product & Strategy', '产品与策略'],
  ['writing', 'Creative Writing', '文学创作'],
  ['narrative', 'Narrative Design', '游戏叙事'],
] as const;

type Category = typeof categories[number][0];
type Work = {
  id: string;
  title: string;
  category: Category;
  number: string;
  description?: string;
  attributes?: string;
  literaryType?: string;
};
export const works: Work[] = [
  { id: 'marginalia', number: '01', title: 'Marginalia', category: 'ai', description: 'AI辅助多语种学术阅读工具', attributes: '独立产品实践 / 功能原型 / GitHub' },
  { id: 'model-evaluation', number: '02', title: '从文学审美到模型评测', category: 'evaluation', description: '大语言模型的内容生成与情感理解', attributes: '3个模型 / 2项评测任务 / 专项报告' },
  { id: 'content-strategy', number: '03', title: '小红书 × 抖音', category: 'strategy', description: '内容消费与信息流策略分析', attributes: '竞品分析 / 用户行为 / A/B测试方案' },
  { id: 'mirror', number: '04', title: '《对镜》', category: 'narrative', description: '文学作品的游戏化叙事改编', attributes: '叙事设计 / 角色塑造 / 改编策划案' },
  { id: 'low-season', number: '01', title: '《低回的季节》', category: 'writing', literaryType: 'Novel' },
  { id: 'will-o-the-wisp', number: '02', title: '《鬼火》', category: 'writing', literaryType: 'Fiction' },
  { id: 'winter-irrigation', number: '03', title: '《冬灌》', category: 'writing', literaryType: 'Fan Fiction' },
  { id: 'first-snow', number: '04', title: '《初雪》', category: 'writing', literaryType: 'Fan Fiction' },
  { id: 'hotel-search', number: '05', title: '酒店搜索转化策略分析', category: 'strategy', description: '酒店搜索漏斗与实验设计 · 模拟商业案例' },
  { id: 'rainy-season', number: '06', title: '《雨季》', category: 'writing', description: '电影创作实践 · 剧本顾问' },
];

export const collections = [
  {
    id: 'ai-product', title: 'AI产品与模型策略', english: 'AI & Product',
    subtitle: 'AI Product & Model Strategy',
    summary: '从人文研究出发，探索人工智能产品设计、模型内容质量评估与用户体验策略。以下项目涵盖独立产品开发、生成式AI评测、内容分发机制及商业策略分析。',
    skills: ['AI产品设计', 'LLM Evaluation', 'Vibe Coding', '产品策略'],
    workIds: ['marginalia', 'model-evaluation', 'content-strategy', 'hotel-search'],
  },
  {
    id: 'content', title: '内容创作与运营', english: 'Content & Strategy',
    subtitle: 'Content Creation & Operations',
    summary: '这组作品从原创小说和改编策划出发，延伸到模型内容质量与平台分发。小说训练对人物和语气的判断，评测与信息流案例则把这些判断转化为可比较的内容标准和可验证的运营假设。',
    skills: ['原创内容创作', '内容质量评估', '信息流分析', '实验方案设计'],
    workIds: ['model-evaluation', 'content-strategy', 'mirror', 'low-season', 'will-o-the-wisp', 'winter-irrigation', 'first-snow', 'rainy-season'],
  },
  {
    id: 'game-writing', title: '游戏叙事与编剧', english: 'Narrative & Writing',
    subtitle: 'Game Narrative & Screenwriting',
    summary: '从小说中提炼人物动机与场景冲突，再把它们拆成玩家可以观察、选择和回看的线索。《对镜》与《冬灌》的改编展示这一过程，小说与《雨季》的剧本顾问经历补充了不同媒介的写作实践。',
    skills: ['人物塑造', '互动叙事', '场景与分支设计', '文学改编'],
    workIds: ['mirror', 'winter-irrigation', 'first-snow', 'low-season', 'will-o-the-wisp', 'rainy-season'],
  },
];
export const categoryFor = (id: Category) => categories.find(([key]) => key === id)!;
export type { Work };
