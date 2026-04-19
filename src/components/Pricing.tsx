import React from "react";
import { motion } from "framer-motion";
import { Building2, Check, Gift, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const homeownerFeatures = [
  "Full material and labor breakdown",
  "Hidden margin detection",
  "Alternative material suggestions",
  "Downloadable negotiation PDF",
  "Guaranteed 60-second turnaround",
];

const professionalFeatures = [
  "Everything in the homeowner plan",
  "Multi-room quote comparison",
  "Project-level cost benchmarking",
  "Client-ready report export",
  "Priority AI processing",
  "Contractor database access",
];

type PricingCardProps = {
  title: string;
  subtitle: string;
  features: string[];
  ctaLabel: string;
  icon: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
  tag?: string;
  tagClassName?: string;
  isFree?: boolean;
};

function PricingCard({
  title,
  subtitle,
  features,
  ctaLabel,
  icon,
  onClick,
  highlight = false,
  tag,
  tagClassName,
  isFree = false,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative flex flex-col overflow-hidden rounded-3xl p-8 shadow-2xl ${
        highlight
          ? "bg-white text-slate-900 ring-2 ring-emerald-500"
          : "bg-white/10 text-white"
      }`}
    >
      {tag && (
        <div
          className={`absolute right-0 top-0 rounded-bl-lg px-3 py-1 text-xs font-bold ${tagClassName}`}
        >
          {tag}
        </div>
      )}

      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
          highlight
            ? "bg-emerald-100 text-emerald-600"
            : "bg-white/20 text-white"
        }`}
      >
        {icon}
      </div>

      <h3
        className={`mb-1 text-xl font-bold ${
          highlight ? "text-slate-900" : "text-white"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mb-5 text-sm ${
          highlight ? "text-slate-500" : "text-slate-300"
        }`}
      >
        {subtitle}
      </p>

      <div className="mb-6">
        {isFree ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-emerald-700">
              <Gift size={18} />
              <span className="text-lg font-bold">FREE</span>
            </div>
            <div>
              <span className="text-sm text-slate-400 line-through">Rs 199</span>
              <p
                className={`text-xs font-medium ${
                  highlight ? "text-emerald-600" : "text-emerald-300"
                }`}
              >
                Saved on signup
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span
              className={`text-5xl font-extrabold tracking-tight ${
                highlight ? "text-slate-900" : "text-white"
              }`}
            >
              Rs 199
            </span>
            <span className="line-through text-slate-400">Rs 499</span>
          </div>
        )}
        <p
          className={`mt-1 text-sm ${
            highlight ? "text-slate-500" : "text-slate-400"
          }`}
        >
          Per quotation analyzed
        </p>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                highlight
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-white/20 text-emerald-300"
              }`}
            >
              <Check size={11} strokeWidth={3} />
            </div>
            <span
              className={`text-sm font-medium ${
                highlight ? "text-slate-700" : "text-slate-200"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onClick}
        className={`h-12 w-full rounded-xl text-sm font-bold ${
          highlight
            ? "bg-slate-900 text-white shadow-lg hover:bg-slate-800"
            : "bg-white text-slate-900 hover:bg-slate-100"
        }`}
      >
        {ctaLabel}
      </Button>
    </motion.div>
  );
}

export default function Pricing() {
  const { isLoggedIn, openAnalyzer, openSignup } = useAuth();

  const handleAction = () => {
    if (isLoggedIn) {
      openAnalyzer();
      return;
    }

    openSignup(() => openAnalyzer());
  };

  return (
    <section id="pricing" className="bg-slate-900 py-24 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Save Rs 50,000+ for the price of a coffee
          </h2>
          <p className="text-lg text-slate-400">
            No subscriptions. No hidden fees. Just the data you need.
          </p>

          {!isLoggedIn ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-4 py-2">
              <Gift size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">
                Sign up free. Your first analysis worth Rs 199 is on us.
              </span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-4 py-2">
              <Gift size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">
                Your free analysis is ready to use.
              </span>
            </div>
          )}
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <PricingCard
            icon={<Home size={24} />}
            title="Homeowner"
            subtitle="For families renovating their home, flat, or villa"
            tag="MOST POPULAR"
            tagClassName="bg-emerald-500 text-white"
            features={homeownerFeatures}
            ctaLabel={
              isLoggedIn ? "Use Your Free Analysis" : "Sign Up and Analyze Free"
            }
            onClick={handleAction}
            highlight={true}
            isFree={isLoggedIn}
          />

          <PricingCard
            icon={<Building2 size={24} />}
            title="Architect / Engineer"
            subtitle="For professionals handling client renovation contracts"
            tag="PRO"
            tagClassName="bg-indigo-500 text-white"
            features={professionalFeatures}
            ctaLabel={
              isLoggedIn ? "Start Professional Analysis" : "Sign Up and Analyze Free"
            }
            onClick={handleAction}
            isFree={isLoggedIn}
          />
        </div>

        <p className="mt-8 text-center text-xs font-medium text-slate-500">
          Secure payments via Razorpay. 100% money-back guarantee if we do not
          find savings.
        </p>
      </div>
    </section>
  );
}
