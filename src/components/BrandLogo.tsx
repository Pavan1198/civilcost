import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
};

export default function BrandLogo({
  className,
  iconClassName,
  textClassName,
}: BrandLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-bold text-xl tracking-tight",
        className,
      )}
    >
      <img
        src="/favicon.svg"
        alt="CivilCost logo"
        className={cn("h-10 w-10 shrink-0", iconClassName)}
      />
      <span className={cn("text-slate-900", textClassName)}>
        Civil<span className="text-primary">Cost</span>
      </span>
    </div>
  );
}
