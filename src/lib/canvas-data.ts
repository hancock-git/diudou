// Mock data for the DAAI 画布 (da-ai.cc/canvas) clone.
// All content is mock/placeholder — no real backend.

export type CanvasNodeKind = "markdown" | "image" | "video" | "audio";

export interface TutorialCard {
  step: string;
  title: string;
  desc: string;
  image: string;
}

export interface CanvasProject {
  id: string;
  name: string;
  updatedAt: string;
  /** preview image url; empty means "无预览" placeholder */
  preview?: string;
}

export const CANVAS_TUTORIALS: TutorialCard[] = [
  {
    step: "01",
    title: "画布组件",
    desc: "批量运行&连线逻辑",
    image: "/images/canvas/tutorials/canvas-tutorial-step-01.jpg",
  },
  {
    step: "02",
    title: "智能编导",
    desc: "分析视频、分析图片，帮我写组件、改写替换元素",
    image: "/images/canvas/tutorials/canvas-tutorial-step-02.jpg",
  },
  {
    step: "03",
    title: "图片创作",
    desc: "文生图、图生图、替换元素",
    image: "/images/canvas/tutorials/canvas-tutorial-step-03.jpg",
  },
  {
    step: "04",
    title: "视频创作",
    desc: "文生视频、全能参考生视频",
    image: "/images/canvas/tutorials/canvas-tutorial-step-04.jpg",
  },
];

export const CANVAS_PROJECTS: CanvasProject[] = [
  { id: "5af6742e-1fd8-450c-bafb-c5f888c8e18d", name: "未命名画布", updatedAt: "2026-07-17 11:38" },
  { id: "a1b2c3d4-1111-2222-3333-444455556666", name: "未命名画布", updatedAt: "2026-07-17 11:20" },
  { id: "b2c3d4e5-2222-3333-4444-555566667777", name: "未命名画布", updatedAt: "2026-07-17 11:09" },
  { id: "c3d4e5f6-3333-4444-5555-666677778888", name: "未命名画布", updatedAt: "2026-07-12 12:14" },
  { id: "d4e5f6a7-4444-5555-6666-777788889999", name: "未命名画布", updatedAt: "2026-07-12 10:53" },
];

/** Per-kind copy used by node cards + selection inspector. */
export const NODE_KIND_META: Record<
  CanvasNodeKind,
  {
    title: string;
    placeholder: string;
    inspectorPlaceholder: string;
    /** credit price shown at the composer bottom-right */
    price: string;
    priceUnit: string;
  }
> = {
  markdown: {
    title: "文本节点",
    placeholder: "请输入您的指令、提示词或脚本等...",
    inspectorPlaceholder:
      "可连线添加素材并 @引用，描述你想生成的文本。例如：提炼这款保温杯的核心卖点，写成适合电商详情页的短文。",
    price: "0.20",
    priceUnit: "条",
  },
  image: {
    title: "图片节点",
    placeholder: "",
    inspectorPlaceholder:
      "可连线添加素材并 @引用，描述你想生成或编辑的图片。例如：生成一张电商主图，突出商品质感、使用场景和促销氛围。",
    price: "1.18",
    priceUnit: "张",
  },
  video: {
    title: "视频节点",
    placeholder: "",
    inspectorPlaceholder:
      "可连线添加素材并 @引用，描述你想生成的视频。例如：根据这张主图生成 5 秒商品展示短视频，镜头缓慢推进。",
    price: "12.00",
    priceUnit: "条",
  },
  audio: {
    title: "音频节点",
    placeholder: "",
    inspectorPlaceholder:
      "可连线添加素材并 @引用，描述你想生成的音频。例如：为这段口播生成自然、亲和的女声配音。",
    price: "0.60",
    priceUnit: "条",
  },
};

/** Model / aspect / quality selectors shown on the image-node composer. */
export const IMAGE_MODELS = ["高级版 VIP", "标准版", "极速版"] as const;
export const IMAGE_ASPECTS = ["自适应", "1:1", "3:4", "4:3", "9:16", "16:9"] as const;
export const IMAGE_QUALITIES = ["标清·1K", "高清·2K", "超清·4K"] as const;

export const DIALOG_SKILLS = [
  { key: "analyze", label: "素材分析" },
  { key: "breakdown", label: "视频拆解" },
  { key: "script", label: "视频脚本" },
] as const;

export const ADD_NODE_ITEMS: { kind: CanvasNodeKind; label: string }[] = [
  { kind: "markdown", label: "文本" },
  { kind: "image", label: "图片" },
  { kind: "video", label: "视频" },
  { kind: "audio", label: "音频" },
];
