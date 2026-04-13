import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, EyeOff, Scale } from "lucide-react";

export default function Problem() {
  const problems = [
    {
      icon: TrendingUp,
      title: "Contractors Overprice by Default",
      desc: "They know you don't know the cost of 18mm MR Grade Plywood. Quotes are padded by 20-40% right out of the gate.",
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      icon: EyeOff,
      title: "Zero Cost Transparency",
      desc: "Quotes bundle materials and labor into a single opaque 'per sq ft' number. You have no idea what you're actually paying for.",
      color: "text-amber-500",
      bg: "bg-amber-50"
    },
    {
      icon: Scale,
      title: "Impossible to Compare",
      desc: "Contractor A quotes per sq ft. Contractor B quotes lump sum. Without standardizing, you can't compare apples to apples.",
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            The home renovation industry is designed to keep you in the dark.
          </h2>
          <p className="text-lg text-slate-600">
            You're making the biggest purchase since buying the house itself, armed with zero data.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((prob, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl ${prob.bg} ${prob.color} flex items-center justify-center mb-6`}>
                <prob.icon size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{prob.title}</h3>
              <p className="text-slate-600 leading-relaxed">{prob.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
