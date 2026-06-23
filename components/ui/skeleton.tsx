import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer rounded-2xl bg-muted/70", className)}
      {...props}
    />
  );
}

export { Skeleton };
