import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Save ₹50,000+ for the price of a coffee
          </h2>
          <p className="text-slate-400 text-lg">
            No subscriptions. No hidden fees. Just the data you need.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-3xl p-8 text-slate-900 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              LIMITED TIME
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-500 mb-2">Quote Analysis Report</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">₹199</span>
                <span className="text-slate-400 line-through">₹499</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Per quotation analyzed</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Full material & labor breakdown",
                "Hidden margin detection",
                "Alternative material suggestions",
                "Downloadable negotiation PDF",
                "Guaranteed 60-second turnaround"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full h-14 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-lg">
              Upload Quote Now
            </Button>
            
            <p className="text-center text-xs text-slate-500 mt-4 font-medium">
              Secure payments via Razorpay. 100% money-back guarantee if we don't find savings.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
