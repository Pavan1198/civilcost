import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "How accurate are your material prices?",
      a: "Very. We update our database weekly using wholesale market rates across major Indian cities, including transport and standard wastage margins."
    },
    {
      q: "What file formats do you accept?",
      a: "You can upload PDF documents, Excel sheets (XLS/XLSX), or clear photos (JPG/PNG) of handwritten quotes. Our AI can read them all."
    },
    {
      q: "How long does it take to get the report?",
      a: "Less than 60 seconds for digital files (PDF/Excel), and up to 5 minutes for complex handwritten photos."
    },
    {
      q: "My contractor gave a 'lump sum' quote. Will this work?",
      a: "Yes. Even with lump-sum quotes, if they provide room dimensions, we can estimate the fair market value for that specific scope of work and highlight the difference."
    },
    {
      q: "Do you share my quotes with anyone?",
      a: "Never. Your files are encrypted, analyzed, and automatically deleted from our servers after 24 hours."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Got Questions?</h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-slate-200">
              <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-primary text-lg py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
