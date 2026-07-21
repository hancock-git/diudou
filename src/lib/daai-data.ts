// Mock data for the DAAI 电商 (da-ai.cc) home clone.
// All content is mock/placeholder — no real backend.

export interface HeroBanner {
  key: string;
  label: string;
  image: string;
  /** tailwind gradient classes for the button background */
  gradient: string;
  /** text color for the label */
  textColor: string;
  /** arrow badge fill color */
  arrowFill: string;
}

export interface QuickEntryCard {
  key: string;
  title: string;
  desc: string;
  image: string;
  /** gradient tint class, e.g. "from-[#FFA12E]/[0.14]" */
  tint: string;
  disabled?: boolean;
}

export interface DiscoverItem {
  id: string;
  kind: "video" | "image";
  title: string;
  author: string;
  date: string;
  /** 点赞数（da-ai.cc 发现流卡片右下角展示） */
  likes: number;
  /** css aspect-ratio value */
  aspect: string;
  src: string;
}

export const HERO_BANNERS: HeroBanner[] = [
  {
    key: "write-video",
    label: "「帮我写」一键生成投流视频",
    image: "/images/banners/write-video.jpg",
    gradient: "from-[#d7d4ec] to-[#f1efff]",
    textColor: "text-[#47389b]",
    arrowFill: "#685AB5",
  },
  {
    key: "one-image",
    label: "「一张图」生成一套商品详情图",
    image: "/images/banners/one-image.jpg",
    gradient: "from-[#d5e3ed] to-[#e7f5ff]",
    textColor: "text-[#1a4e79]",
    arrowFill: "#216EA6",
  },
];

export const QUICK_ENTRY_FEATURED = {
  key: "product-detail",
  title: "商详套图",
  desc: "一键生成专业电商详情套图",
  images: [
    "/images/quick-entry/product-detail-set-1.jpg",
    "/images/quick-entry/product-detail-set-2.jpg",
    "/images/quick-entry/product-detail-set-3.jpg",
  ],
};

export const QUICK_ENTRY_CARDS: QuickEntryCard[] = [
  {
    key: "watermark",
    title: "水印擦除",
    desc: "智能擦除视频水印与遮挡元素",
    image: "/images/quick-entry/video-watermark-remover.jpg",
    tint: "from-[#FFA12E]/[0.14]",
  },
  {
    key: "subtitle",
    title: "字幕擦除",
    desc: "一键去除视频字幕与画面文字",
    image: "/images/quick-entry/video-subtitle-remover.jpg",
    tint: "from-[#0471FE]/[0.15]",
  },
  {
    key: "enhance",
    title: "画质增强",
    desc: "提升视频清晰度与画面质感",
    image: "/images/quick-entry/video-quality-enhance.jpg",
    tint: "from-[#FF31C8]/[0.13]",
  },
  {
    key: "remix",
    title: "爆款裂变",
    desc: "快速裂变多条爆款投流视频",
    image: "/images/quick-entry/hot-video-remix.jpg",
    tint: "from-[#8737FF]/[0.13]",
  },
  {
    key: "avatar",
    title: "数字分身",
    desc: "敬请期待",
    image: "/images/quick-entry/digital-avatar.jpg",
    tint: "from-[#FF5454]/[0.13]",
    disabled: true,
  },
  {
    key: "try-on",
    title: "模特换衣",
    desc: "敬请期待",
    image: "/images/quick-entry/virtual-try-on.jpg",
    tint: "from-[#FFEED6]/[0.34]",
    disabled: true,
  },
];

export const DISCOVER_TABS = [
  { key: "all", label: "全部" },
  { key: "video", label: "视频" },
  { key: "image", label: "图片" },
] as const;

export type DiscoverTabKey = (typeof DISCOVER_TABS)[number]["key"];

const DISCOVER_TITLES = [
  "高清足球比赛现场电视转播实拍画面，氛围感十足，拥挤热闹的看台",
  "中景镜头，女性手指自然拿起香浓可可小方威化饼干盒，缓缓打开",
  "真实电商口播信息流短视频，9:16 竖屏，办公室工位场景真实还原",
  "生成一张世界杯球场看台的女生照片，冷白皮，皮肤白皙通透柔和高光",
  "根据素材生成商品带货视频，产品特写与卖点字幕自动排版",
  "生成一张具有真实感的海边度假宣传图，暖色调，氛围松弛",
  "美妆产品详情套图，主图 + 卖点图 + 细节图一键成套",
  "夜市街头美食探店口播视频，热气腾腾的烟火气镜头语言",
  "新中式茶饮品牌宣传短片，国风水墨转场，节奏明快",
  "宠物用品带货视频，猫咪试用产品的可爱反应特写",
  "服饰上身展示视频，模特多角度走位，光影层次分明",
  "数码 3C 产品开箱短视频，金属质感特写与参数字幕",
  "母婴用品温馨场景图，柔光暖调，突出安全与呵护",
  "健身器材使用教程短片，动作分解 + 卖点标注",
  "家居收纳好物种草图集，前后对比一目了然",
  "户外露营装备场景大片，日落金光下的松弛生活",
  "生鲜水果电商主图，水珠特写与鲜切质感拉满",
  "国货美妆口红试色视频，唇部特写 + 色号名称浮层",
  "小家电厨房场景视频，一键出餐的高效演示",
  "潮玩手办展示图，360° 旋转 + 细节局部放大",
];

const DISCOVER_ASPECTS = ["3 / 4", "4 / 5", "1 / 1", "9 / 16", "3 / 4", "2 / 3"];
const DISCOVER_AUTHORS = [
  "电商小助手",
  "投流阿May",
  "带货老王",
  "AIGC创作者",
  "运营喵",
  "爆款制造机",
];

export const DISCOVER_ITEMS: DiscoverItem[] = Array.from({ length: 20 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  const ext = i + 1 === 11 ? "jpg" : "png";
  const day = 10 - Math.floor(i / 3);
  const hh = String(9 + (i % 12)).padStart(2, "0");
  const mm = String((i * 7 + 13) % 60).padStart(2, "0");
  return {
    id: `disc-${n}`,
    kind: i % 3 === 1 ? "image" : "video",
    title: DISCOVER_TITLES[i % DISCOVER_TITLES.length],
    author: DISCOVER_AUTHORS[i % DISCOVER_AUTHORS.length],
    date: `07/${String(day).padStart(2, "0")} ${hh}:${mm}`,
    likes: ((i * i * 7 + i * 29 + 13) % 486) + 8,
    aspect: DISCOVER_ASPECTS[i % DISCOVER_ASPECTS.length],
    src: `/images/discover/card-${n}.${ext}`,
  };
});
