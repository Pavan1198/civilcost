import React from "react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
            Upload your quote right now and find out exactly how much you're overpaying within 60 seconds.
          </p>
          
          <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 h-16 text-xl font-bold shadow-2xl transition-transform hover:-translate-y-1">
            Analyze My Quote — ₹199
          </Button>
          <p className="mt-4 text-emerald-200 text-sm font-medium">No account required • Instant results</p>
        </div>
      </div>
    </section>
  );
}
