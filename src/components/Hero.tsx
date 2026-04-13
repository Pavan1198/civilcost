import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/40 via-slate-50 to-slate-50"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
              India's #1 Contractor Quote Analyzer
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Don't Overpay for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Home Interiors.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl">
              Upload your contractor's quote. Our AI instantly breaks down margins, material costs, and labor rates to tell you exactly how much you're overpaying.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-emerald-600 text-white rounded-full px-8 h-14 text-lg font-semibold shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-1">
                Check My Quote for ₹199
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg font-semibold border-slate-300 text-slate-700 hover:bg-slate-100 transition-all">
                View Sample Report
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                ))}
              </div>
              <p>Trusted by 2,000+ homeowners in Bangalore & Mumbai</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-md"
          >
            {/* Floating Card UI */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-20">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Wardrobe_Quote_v2.pdf</h3>
                      <p className="text-xs text-slate-500">2.4 MB • Processing...</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin"></div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div className="bg-indigo-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Estimated Cost</p>
                    <p className="text-3xl font-bold text-slate-900">₹4,50,000</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg font-bold text-sm">
                    <AlertCircle size={16} />
                    22% Overpriced
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Material Cost</span>
                    <span className="font-semibold text-slate-900">₹2,10,000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Labor Cost</span>
                    <span className="font-semibold text-slate-900">₹85,000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                      Contractor Margin
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px]">!</span>
                    </span>
                    <span className="font-bold text-red-600">₹1,55,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-60"></div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-8 top-1/2 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 z-30"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" size={24} />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Fair Market Value</p>
                  <p className="font-bold text-slate-900">₹3,48,000</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
