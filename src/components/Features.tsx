import React from "react";
import { motion } from "framer-motion";
import { Search, GitCompare, Lightbulb, BarChart3 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Search,
      title: "Granular Cost Breakdown",
      desc: "We split every quoted line item into its base material cost, assumed labor, and contractor margin."
    },
    {
      icon: GitCompare,
      title: "Apples-to-Apples Comparison",
      desc: "Upload quotes from 3 different contractors. We'll standardize them so you can actually compare them."
    },
    {
      icon: Lightbulb,
      title: "Smart AI Recommendations",
      desc: "Discover where substituting a slightly different laminate or ply can save you thousands without losing quality."
    },
    {
      icon: BarChart3,
      title: "Hyper-Local Benchmarking",
      desc: "Our database knows the difference in labor rates between South Mumbai and Navi Mumbai."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Everything you need to negotiate with confidence
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 mb-6 border border-slate-200">
                <feat.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
