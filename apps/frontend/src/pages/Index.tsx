import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedJobs } from "@/components/home/FeaturedJobs";
import { Categories } from "@/components/home/Categories";
import { Companies } from "@/components/home/Companies";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Companies />
        <FeaturedJobs />
        <Categories />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
