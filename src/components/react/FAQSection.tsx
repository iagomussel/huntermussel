import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/react/ui/accordion";
import AnimeScrollSection from "@/components/react/AnimeScrollSection";
import type { FAQItem } from "@/data/faq";

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQSection({
  items,
  title = "Frequently Asked Questions",
}: FAQSectionProps) {
  return (
    <AnimeScrollSection className="py-24 relative">
      <div className="container px-6 mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
            // faq
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
        </div>

        <div>
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border"
              >
                <AccordionTrigger className="font-heading text-left text-base font-semibold hover:text-primary hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </AnimeScrollSection>
  );
}
