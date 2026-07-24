# EcommerceToolCards Specification

## Overview
- **Target file:** `src/components/daai/EcommerceToolCards.tsx`
- **Reference URL:** `http://124.174.43.52/agent/ecommerce/home`
- **Screenshot:** `docs/design-references/target-ecommerce-tools-auth.png`
- **Interaction model:** static tool launcher with link-card hover transitions

## DOM Structure
- `section[aria-label="电商创作工具"]`
  - White rounded container
    - Header row: title/subtitle block and desktop/tablet-only count badge
    - Body grid
      - Left primary card: 商详套图
      - Right feature grid: six small feature cards

## Computed Styles From Target

### Container
- width at 1440px viewport: 1300px
- padding: 16px
- borderRadius: 18px
- border: slate-200/90 equivalent
- boxShadow: `0px 8px 26px rgba(15, 23, 42, 0.06)`
- background: white

### Header
- heading: 16px, extra-bold, slate-950
- subtitle: 12px, slate-500
- badge: hidden below `sm`, blue-50 background, blue-600 text, 11px bold

### Primary Card
- minHeight: 176px
- borderRadius: 16px
- padding: 20px
- background: light blue gradient from `#f2f7ff` through `#eef4ff` to `#dbe8ff`
- title: 20px, black weight
- subtitle: 12px, slate-600
- button: 36px high, slate-950 background, white 12px bold text
- decoration: rotated white translucent image tile with ImagePlus icon

### Feature Cards
- desktop grid: 3 columns x 2 rows
- tablet grid: 2 columns x 3 rows
- mobile grid: 1 column x 6 rows
- minHeight: 82px
- borderRadius: 12px
- padding: 12px
- gap: 12px
- icon box: 56px square, 12px radius, translucent white surface
- title: 14px, black weight
- description: 11px, 16px line-height

## Text Content
- 电商创作工具
- 从素材处理到商品内容生成，一站式完成
- 7 项实用功能
- 商详套图
- 一键生成专业电商详情套图
- 立即创作
- 水印擦除: 智能擦除视频水印与遮挡元素
- 字幕擦除: 一键去除视频字幕与画面文字
- 画质增强: 提升视频清晰度与画面质感
- 爆款裂变: 快速裂变多条爆款投流视频
- 数字分身: 上传人物照片，生成自然口播视频
- 模特换衣: 上传模特与服装图，快速生成试穿效果

## Responsive Behavior
- **Desktop (1440px):** left primary card plus right 3-column feature grid.
- **Tablet (768px):** primary card stacks above two-column feature grid.
- **Mobile (390px):** all cards stack in one column; count badge is hidden; decorative primary-card image fades and shifts to avoid text crowding.
- **Overflow rule:** no horizontal page overflow at 1440px, 768px, or 390px.
