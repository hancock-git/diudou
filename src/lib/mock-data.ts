import {
  Home,
  FileText,
  LayoutPanelLeft,
  Wand2,
  FileVideo,
  ImagePlus,
  Briefcase,
  Settings,
  Sparkles,
  CreditCard,
  LogOut,
  Link as LinkIcon,
  Video as VideoIcon,
  ImageIcon,
  Mic,
  Music,
  PenLine,
  Clapperboard,
} from "lucide-react";

import type {
  CreationModeItem,
  ExtractTab,
  ShowcaseItem,
  ShowcaseTab,
  SidebarBottomItem,
  SidebarNavItem,
} from "@/types";

export const SIDEBAR_NAV: SidebarNavItem[] = [
  { key: "home", label: "首页", icon: Home, href: "/agent/ecommerce/home" },
  { key: "director", label: "超级编导", icon: FileText, href: "/agent/ecommerce/copywriting" },
  { key: "canvas", label: "高级画布", icon: LayoutPanelLeft, href: "/agent/ecommerce/canvas" },
  { key: "viral", label: "爆款裂变", icon: Wand2, href: "/agent/ecommerce/remix" },
  { key: "video", label: "视频成片", icon: FileVideo, href: "/agent/ecommerce/video" },
  { key: "aigen", label: "AI生图", icon: ImagePlus, href: "/agent/ecommerce/image" },
  { key: "assets", label: "资产库", icon: Briefcase, href: "/agent/ecommerce/assets" },
  { key: "settings", label: "账号与设置", icon: Settings, href: "/agent/ecommerce/settings" },
  { key: "admin", label: "管理面板", icon: Sparkles, href: "/agent/ecommerce/admin" },
];

export const SIDEBAR_BOTTOM: SidebarBottomItem[] = [
  {
    key: "credits",
    label: "无限",
    description: "可用积分：无限",
    icon: Sparkles,
    variant: "credits",
    href: "/agent/ecommerce/credits",
  },
  {
    key: "billing",
    label: "订阅",
    description: "订阅 / 充值",
    icon: CreditCard,
    variant: "billing",
    href: "/agent/ecommerce/credits",
  },
  { key: "logout", label: "退出", icon: LogOut, variant: "logout", href: "/login" },
];

export const CREATION_MODES: CreationModeItem[] = [
  {
    key: "copy",
    label: "提文案",
    desc: "从链接 / 视频 / 图集提取口播文案",
    icon: FileText,
  },
  {
    key: "rewrite",
    label: "文案改写",
    desc: "对已有文案改写、裂变多个版本",
    icon: PenLine,
  },
  {
    key: "storyboard",
    label: "分镜片段生成",
    desc: "把脚本拆分镜并生成视频片段",
    icon: Clapperboard,
  },
];

export const EXTRACT_TABS: ExtractTab[] = [
  { key: "link", label: "链接提文案", icon: LinkIcon },
  { key: "video", label: "视频提文案", icon: VideoIcon },
  { key: "image", label: "图片提文案", icon: ImageIcon },
  { key: "voice", label: "录音提文案", icon: Mic },
  { key: "audio", label: "音频提文案", icon: Music },
];

export const SHOWCASE_TABS: ShowcaseTab[] = [
  { key: "all", label: "全部" },
  { key: "video", label: "视频", count: 18 },
  { key: "image", label: "图片", count: 24 },
];

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "vid-01",
    kind: "video",
    title:
      "高清足球比赛现场电视转播实拍画面，氛围感十足，拥挤热闹的...",
    date: "07/10 16:37",
    aspect: "4/5",
    src: "/images/posters/poster-01.jpg",
  },
  {
    id: "vid-02",
    kind: "video",
    title:
      "高清足球比赛现场电视转播实拍画面，氛围感十足，拥挤热闹的...",
    date: "07/09 22:31",
    aspect: "3/4",
    src: "/images/posters/poster-02.jpg",
  },
  {
    id: "vid-03",
    kind: "video",
    title: "生成一个威化饼干的视频",
    date: "07/09 17:01",
    aspect: "3/4",
    src: "/images/posters/poster-04.jpg",
  },
  {
    id: "vid-04",
    kind: "video",
    title:
      "中景镜头，女性手指自然拿起沪上阿姨香浓可可小方威化饼干盒...",
    date: "07/09 16:59",
    aspect: "3/4",
    src: "/images/posters/poster-03.png",
  },
  {
    id: "vid-05",
    kind: "video",
    title:
      "中景镜头，女性手指自然拿起沪上阿姨香浓可可小方威化饼干盒...",
    date: "07/09 16:49",
    aspect: "3/4",
    src: "/images/posters/poster-04.jpg",
  },
  {
    id: "vid-06",
    kind: "video",
    title:
      "真实电商口播信息流短视频，9:16竖屏。办公室工位场景，...",
    date: "07/08 14:45",
    aspect: "3/4",
    src: "/images/posters/poster-05.png",
  },
  {
    id: "vid-07",
    kind: "video",
    title:
      "真实电商口播信息流短视频，9:16竖屏。依照参考图，办公...",
    date: "07/07 13:24",
    aspect: "3/4",
    src: "/images/posters/poster-06.png",
  },
  {
    id: "vid-08",
    kind: "video",
    title: "根据素材生成商品带货视频",
    date: "06/26 20:17",
    aspect: "3/4",
    src: "/images/posters/poster-01.jpg",
  },
  {
    id: "img-01",
    kind: "image",
    title:
      "生成一张世界杯球场看台的女生照片，女生是冷白皮，皮肤白皙通透，柔和皮肤高光...",
    date: "07/09 18:28",
    aspect: "3/4",
    src: "/images/ai/img-01.png",
  },
  {
    id: "img-02",
    kind: "image",
    title:
      "生成一张@图1美女，一手拿着@图2中沪上阿姨威化小方的产品，另一只手拿着一块@图3中的威化小方，品尝一口的画面，美女面前放着@图4的手编包的画面",
    date: "07/09 17:34",
    aspect: "3/4",
    src: "/images/ai/img-02.png",
  },
  {
    id: "img-03",
    kind: "image",
    title: "生成一张具有真实感的海绵宝宝和祖国人在一起的合影",
    date: "07/09 17:30",
    aspect: "square",
    src: "/images/ai/img-03.png",
  },
  {
    id: "img-04",
    kind: "image",
    title: "生成一张海南旅游的宣传图",
    date: "07/09 17:25",
    aspect: "square",
    src: "/images/ai/img-04.png",
  },
];
