export function Footer() {
  return (
    <div className="mt-auto flex shrink-0 justify-center py-4">
      <p className="m-0 flex flex-wrap items-center justify-center gap-y-0.5 text-[12px] leading-relaxed text-[#999999]">
        <span>
          Copyright <span aria-hidden="true">©</span> 丢抖AI
        </span>
        <span aria-hidden="true" className="select-none px-1.5 text-[#cccccc]">
          |
        </span>
        <span>
          网站备案号：
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] leading-relaxed text-[#999999] transition-colors hover:text-[#666666]"
          >
            浙ICP备2024085888号-4
          </a>
        </span>
        <span aria-hidden="true" className="select-none px-1.5 text-[#cccccc]">
          |
        </span>
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-[12px] leading-relaxed text-[#999999] transition-colors hover:text-[#666666]"
        >
          联系我们
        </button>
      </p>
    </div>
  );
}
