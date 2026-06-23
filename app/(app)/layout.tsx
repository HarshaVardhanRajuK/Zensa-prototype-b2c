import { Providers } from "@/components/providers";
import { BottomNav } from "@/components/shell/bottom-nav";

/**
 * The mobile application shell: an ambient backdrop with a centred phone-width
 * column. The bottom navigation (Home · Discover · Journey · Wallet · Me) is
 * fixed within the column; deep flows render full-screen and hide it.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-[100dvh] w-full bg-gradient-to-b from-primary-soft/40 via-background to-clay-soft/30">
        <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-app flex-col border-border/60 bg-background shadow-[0_0_80px_-20px_hsl(150_24%_18%/0.15)] sm:border-x">
          <main className="flex-1 pb-24">{children}</main>
          <BottomNav />
        </div>
      </div>
    </Providers>
  );
}
