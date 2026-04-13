import React from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, FileCheck2 } from "lucide-react";

export default function Solution() {
  const steps = [
    {
      icon: Upload,
      title: "1. Upload Your Quote",
      desc: "PDF, Excel, or just a photo of the handwritten estimate.",
    },
    {
      icon: Cpu,
      title: "2. AI Analysis",
      desc: "Our engine extracts line items and checks current market rates in your city.",
    },
    {
      icon: FileCheck2,
      title: "3. Get Your Report",
      desc: "Instantly see exact margins, overpriced items, and negotiation points.",
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/20 blur-[100px] pointer-events-none rounded-full"></div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Take back control in 60 seconds</h2>
          <p className="text-slate-400 text-lg">We've mapped prices for 500+ materials and labor rates across major Indian cities.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/4 left-[10%] right-[10%] h-0.5 bg-slate-800 z-0"></div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl relative">
                <step.icon size={32} className="text-emerald-400" />
                {/* Number badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center border-4 border-slate-900">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
