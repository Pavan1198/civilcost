import React from "react";
import { motion } from "framer-motion";
import {
  HardHat,
  MapPin,
  Package,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    icon: <HardHat size={22} />,
    value: "30+",
    label: "Verified Contractors",
    sub: "Across major cities",
  },
  {
    icon: <TrendingUp size={22} />,
    value: "Live",
    label: "Labour Cost Rates",
    sub: "Updated daily",
  },
  {
    icon: <Package size={22} />,
    value: "Live",
    label: "Material Cost Data",
    sub: "Sourced from suppliers",
  },
  {
    icon: <Users size={22} />,
    value: "2,000+",
    label: "Homeowners Saved",
    sub: "Avg. Rs 42,000 saved",
  },
  {
    icon: <MapPin size={22} />,
    value: "12+",
    label: "Cities Covered",
    sub: "Bangalore, Mumbai & more",
  },
  {
    icon: <ShieldCheck size={22} />,
    value: "100%",
    label: "Money-Back Guarantee",
    sub: "If no savings found",
  },
];

export default function Stats() {
  return (
    <section className="border-y border-slate-100 bg-white py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-extrabold leading-none text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-700">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
