import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Info } from "lucide-react";

export default function CostPreview() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              See exactly where they're padding the bill
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Contractors hide their margins in broad categories. We break them down into material, labor, and profit. When you know the real cost, negotiating is easy.
            </p>
            
            <ul className="space-y-4">
              {[
                "Identify sub-par material substitutions",
                "Flag bloated per-sqft rates",
                "Highlight missing hidden costs"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    ✓
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 w-full max-w-lg mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Line Item Analysis</p>
                  <h3 className="font-bold text-xl">Master Bedroom Wardrobe</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/20 text-rose-300 rounded-lg border border-rose-500/30 text-sm font-bold">
                  <ShieldAlert size={16} />
                  18% Overpriced
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-5">
                  
                  {/* Item */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-900">Cabinets (BWR Plywood)</span>
                      <span className="font-bold text-slate-900">₹64,000</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2 rounded-md">
                      <Info size={14} />
                      Market rate is ₹52,000 max. Contractor is marking up by ~23%.
                    </div>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  {/* Item */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Loft Addition</span>
                    <span className="font-bold text-slate-900">₹12,000</span>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  {/* Item */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Labor & Hardware</span>
                    <span className="font-bold text-slate-900">₹11,000</span>
                  </div>

                </div>

                <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-600 font-medium">Quoted Total</span>
                    <span className="text-2xl font-bold text-slate-900 line-through text-slate-400">₹1,10,000</span>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-slate-900 font-bold">Fair Market Total</span>
                    <span className="text-3xl font-extrabold text-emerald-600">₹87,000</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
