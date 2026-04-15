import React from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function CTA() {
  const { isLoggedIn, openSignup } = useAuth();

  const handlePrimaryAction = () => {
    if (isLoggedIn) {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    openSignup(() => {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <section className="relative overflow-hidden bg-primary py-24">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Stop guessing. Start knowing.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-emerald-100">
            Upload your quote right now and find out exactly how much you&apos;re
            overpaying within 60 seconds.
          </p>

          {!isLoggedIn ? (
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={handlePrimaryAction}
                className="h-16 rounded-full bg-slate-900 px-10 text-xl font-bold text-white shadow-2xl transition-transform hover:-translate-y-1 hover:bg-slate-800"
              >
                <Gift size={22} className="mr-2" />
                Get Free Quote Analysis
              </Button>
              <p className="text-sm font-medium text-emerald-200">
                Sign up free. First analysis worth Rs 199 is on us.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={handlePrimaryAction}
                className="h-16 rounded-full bg-slate-900 px-10 text-xl font-bold text-white shadow-2xl transition-transform hover:-translate-y-1 hover:bg-slate-800"
              >
                Analyze My Quote - Free
              </Button>
              <p className="text-sm font-medium text-emerald-200">
                Your free analysis is ready. Instant results and a downloadable
                report.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
