"use client";

import Link from "next/link";
import {
  Clock,
  Coins,
  ExternalLink,
  Infinity as InfinityIcon,
  Settings2,
  Shield,
  Sparkles,
  UserCog,
} from "lucide-react";

const QUICK_LINKS: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
  {
    href: "/agent/ecommerce/settings",
    title: "账号与团队",
    description: "管理团队成员、角色权限与安全设置。",
    icon: Settings2,
  },
  {
    href: "/agent/ecommerce/credits",
    title: "积分与订阅",
    description: "查看积分明细、订阅套餐与充值记录。",
    icon: Coins,
  },
  {
    href: "#",
    title: "完整管理台",
    description: "跳转到完整版后台，管理所有工作台数据。",
    icon: ExternalLink,
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-950">管理面板</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                当前登录管理员的账号、积分和后台入口。
              </p>
            </div>
          </div>
          <Link
            href="#"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            完整管理台
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={UserCog}
          value="管理员"
          label="当前账号"
          meta="admin"
          iconTone="primary"
        />
        <StatCard
          icon={InfinityIcon}
          value="无限"
          label="可用积分"
          meta="累计消耗 0"
          iconTone="blue"
        />
        <StatCard
          icon={Clock}
          value="0"
          label="冻结积分"
          meta="进行中的视频任务预占"
          iconTone="slate"
        />
      </div>

      {/* Quick links card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">快捷入口</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              直接跳转至常用的设置、积分与后台页面。
            </p>
          </div>
          <Shield className="h-5 w-5 text-slate-300" />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-900">
                    {link.title}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                    {link.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value: string;
  label: string;
  meta: string;
  iconTone: "primary" | "blue" | "slate";
}

function StatCard({
  icon: Icon,
  value,
  label,
  meta,
  iconTone,
}: StatCardProps) {
  const iconCls =
    iconTone === "primary"
      ? "bg-primary/10 text-primary"
      : iconTone === "blue"
        ? "bg-sky-100 text-sky-500"
        : "bg-slate-100 text-slate-500";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconCls}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">
        {value}
      </div>
      <div className="mt-2 text-xs text-slate-500">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="mx-1.5 text-slate-300">·</span>
        <span>{meta}</span>
      </div>
    </div>
  );
}
