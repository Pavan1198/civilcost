import React from "react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    {
      name: "Priya S.",
      location: "Indiranagar, Bangalore",
      quote: "My contractor quoted ₹6.5L for my 2BHK woodwork. CivilCost showed me he was charging a 45% premium on plywood alone. Negotiated it down to ₹4.8L.",
      saved: "₹1,70,000",
      initials: "PS",
      color: "bg-blue-100 text-blue-700"
    },
    {
      name: "Rahul M.",
      location: "Powai, Mumbai",
      quote: "I had 3 quotes that looked completely different. The comparison report standardized them and found hidden labor costs in the 'cheapest' quote.",
      saved: "₹85,000",
      initials: "RM",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      name: "Deepa K.",
      location: "Gurgaon",
      quote: "Best ₹199 I've ever spent. It felt like having a civil engineer friend looking over my shoulder. The PDF report gave me the confidence to push back.",
      saved: "₹1,12,000",
      initials: "DK",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Don't just take our word for it
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full"
            >
              <div className="flex-1 mb-6">
                <div className="flex gap-1 mb-4 text-amber-400">
                  {"★★★★★".split("").map((star, j) => <span key={j}>{star}</span>)}
                </div>
                <p className="text-slate-700 leading-relaxed italic">"{review.quote}"</p>
              </div>
              
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${review.color}`}>
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">Saved</p>
                  <p className="font-bold text-emerald-600">{review.saved}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
