import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import WhatIsFullBootcamp from "@/components/WhatIsFullBootcamp";
import DiverseTopics from "@/components/DiverseTopics";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <WhatIsFullBootcamp />
      <DiverseTopics />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
