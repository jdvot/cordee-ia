import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Method } from "@/components/landing/Method";
import { Expertise, Personas, Process } from "@/components/landing/Sections";
import { UseCases } from "@/components/landing/UseCases";
import { Faq, CTA, Footer } from "@/components/landing/FaqCtaFooter";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Method />
        <Expertise />
        <Personas />
        <Process />
        <UseCases />
        <Faq />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
