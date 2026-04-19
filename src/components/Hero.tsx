import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const { isLoggedIn, openSignup, openAnalyzer } = useAuth();

  const handlePrimaryAction = () => {
    if (isLoggedIn) {
      openAnalyzer();
      return;
    }

    openSignup(() => openAnalyzer());
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-full w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/40 via-slate-50 to-slate-50" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />
              India&apos;s #1 Contractor Quote Analyzer
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              Don&apos;t Overpay for Your{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Home Interiors.
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Upload your contractor&apos;s quote. Our AI instantly breaks down
              margins, material costs, and labor rates to tell you exactly how
              much you&apos;re overpaying.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={handlePrimaryAction}
                className="h-14 rounded-full bg-primary px-8 text-lg font-semibold text-white shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-1 hover:bg-emerald-600"
              >
                {isLoggedIn
                  ? "Analyze My Quote - Free"
                  : "Check My Quote for Rs 199"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-full border-slate-300 px-8 text-lg font-semibold text-slate-700 transition-all hover:bg-slate-100"
              >
                View Sample Report
              </Button>
            </div>

            {!isLoggedIn && (
              <p className="mt-3 text-sm font-medium text-emerald-700">
                Sign up free to unlock your first analysis worth Rs 199.
              </p>
            )}

            <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="h-8 w-8 rounded-full border-2 border-white bg-slate-200"
                  />
                ))}
              </div>
              <p>Trusted by 2,000+ homeowners in Thane and Mumbai</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-md lg:ml-auto"
          >
            <div className="relative z-20 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
              <div className="border-b border-slate-100 bg-slate-50/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Wardrobe_Quote_v2.pdf
                      </h3>
                      <p className="text-xs text-slate-500">
                        2.4 MB - Processing...
                      </p>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-800" />
                  </div>
                </div>
                <div className="mb-1 h-2 w-full rounded-full bg-slate-100">
                  <div className="h-2 w-3/4 rounded-full bg-indigo-600" />
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="mb-1 text-sm font-medium text-slate-500">
                      Estimated Cost
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      Rs 4,50,000
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700">
                    <AlertCircle size={16} />
                    22% Overpriced
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Material Cost</span>
                    <span className="font-semibold text-slate-900">
                      Rs 2,10,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Labor Cost</span>
                    <span className="font-semibold text-slate-900">
                      Rs 85,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-slate-600">
                      Contractor Margin
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[10px] text-red-600">
                        !
                      </span>
                    </span>
                    <span className="font-bold text-red-600">Rs 1,55,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100 opacity-60 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-100 opacity-60 blur-2xl" />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute right-4 top-1/4 z-30 w-[calc(100%-2rem)] max-w-[220px] rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:w-auto sm:max-w-none lg:right-0 xl:-right-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={24} />
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Fair Market Value
                  </p>
                  <p className="font-bold text-slate-900">Rs 3,48,000</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
