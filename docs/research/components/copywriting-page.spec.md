# 超级编导 (Copywriting) Page Specification

Target: `http://124.174.43.52/agent/ecommerce/copywriting` (login: admin). Menu label renamed to **超级编导**.
Target file: `src/app/agent/ecommerce/copywriting/page.tsx`. Shell (`WorkspaceShell`) already supplies `main > div.flex-1 overflow-y-auto px-3 pt-5 sm:px-5 sm:pt-7 lg:px-8 > div.mx-auto max-w-shell space-y-4 pb-8`. Page returns the two top-level cards as siblings.

## Layout
- Page = 2 siblings (shell adds `space-y-4` = 16px between):
  1. **Header card**: `section.rounded-2xl border border-black/10 bg-white shadow-sm`
  2. **Body grid**: `div.grid gap-3 lg:grid-cols-[380px_minmax(0,1fr)]` → left form column (380px) + right result panel (1fr)

## Header card
Inner row: `grid gap-3 border-b border-black/5 px-4 py-3 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center`
- Title block: `flex shrink-0 flex-wrap items-center gap-2`
  - `h1.text-xl font-semibold tracking-tight text-slate-950` → "超级编导"
  - badge `inline-flex h-5 items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700` → "AI视频脚本"
- Steps: `grid min-w-0 gap-2 md:grid-cols-3`, 3 step buttons.

### Step button `min-h-[64px] rounded-xl border px-3 py-2 text-left transition`
- active: `border-primary/40 bg-primary/[0.07] text-primary shadow-sm ring-2 ring-primary/10`
- inactive: `border-slate-200 bg-white hover:bg-slate-50`
- inner: `flex h-full items-center justify-between gap-3`
  - left `flex min-w-0 items-center gap-3`:
    - icon span `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg` — active `bg-primary text-white`, inactive `bg-slate-100 text-slate-500`; icon h-4 w-4
    - text: title `text-sm font-semibold` (active text-primary / inactive text-slate-900); desc `mt-0.5 text-xs text-slate-500`
  - number `shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold` — active `bg-primary text-white`, inactive `bg-slate-100 text-slate-500`
- Steps: 01 脚本生成 / 按品类、场景和卖点生成当前版本脚本。 (FileText, active by default)
  02 脚本改写/裂变 / 承接参考文案，做 1:1 改写和批量裂变。 (Wand2)
  03 分镜与片段生成 / 把定稿脚本拆成分镜，再生成视频片段。 (Video)

## Form column `space-y-3` — each field group is card `rounded-xl border border-slate-200 bg-white p-3 shadow-sm`
Section label: `text-xs font-semibold text-slate-700`. Pills wrap: `mt-2 flex flex-wrap gap-1.5`.
Pill `h-8 rounded-full px-3 text-xs font-semibold transition`:
- inactive: `bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:text-slate-950`
- active (品类, 脚本风格): `bg-slate-950 text-white shadow-sm`
- active (营销场景): `bg-primary text-white shadow-sm`
Input `mt-2 min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10`
Textarea same but `min-h-[N] py-2 leading-6 text-slate-700 resize-y`.
Upload button `inline-flex items-center gap-1 h-7 rounded-full border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 hover:bg-slate-50` + Upload icon h-3.5 w-3.5.
Label+upload row: `flex min-h-7 flex-wrap items-center justify-between gap-2`.

Cards, in order:
1. 品类 (pills, slate-950 active) + 营销场景 (pills, primary active; each has title=desc) — inner `space-y-3`
2. 商品信息 — input, ph "请输入商品ID或名称"
3. 商品卖点 — upload; textarea min-h-[84] ph 「请输入产品卖点，如"饱和度高；不易脱妆"，多个卖点使用回车或分号分隔」
4. 优惠活动（选填）— upload; textarea min-h-[84] ph 「请输入价格/优惠活动，如"拍一发三""99元三件"等」
5. 适用场景（选填）— textarea min-h-[72] ph 「请输入商品的适用场景，例如"约会""通勤""送礼"」
6. 适用人群（选填）— textarea min-h-[72] ph 「请输入产品的适用人群，如"宝妈；小姐姐；上班族"」
7. 用户痛点（选填）— textarea min-h-[72] ph 「请输入商品解决的痛点，例如"没气色；价格昂贵；清洁麻烦"」
8. 参考素材 / 甲方资料（选填）— upload; textarea min-h-[96] ph 「粘贴甲方需求、参考口播、对标素材拆解或活动规则；也可以先上传识别后再整理。」
9. 审核反馈 / 额外要求（选填）— upload; textarea min-h-[136] ph 「粘贴违禁词、平台审核反馈、品牌禁用话术；生成结果会在文案中直接标出风险词。 也可补充适用场景、口播语气、甲方要求或不能出现的表达。」
10. 脚本风格 (pills, slate-950 active: 不限/国货/达人种草/老板人设/家庭视角/网感营销) + 脚本字数 select — inner `space-y-3`. Select `mt-2 h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10`. Options: 自动匹配/50-75字/75-150字/150-300字/300字以上
11. 立即生成 card `flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between`; button `h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 sm:flex-1`

## Result panel (right, 1fr)
`rounded-xl border border-primary/20 bg-white p-4 shadow-sm ring-1 ring-primary/5 xl:min-h-[680px]`
- title `text-sm font-semibold text-slate-950` → "文案结果"
- `mt-3 space-y-3` > empty box `rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-24 text-center text-sm text-slate-500` → "暂无结果"

## Tokens
primary = #0471fe (rgb 4,113,254). Interaction: click-driven step tabs + pill toggles. No scroll-driven behavior.
