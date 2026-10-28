import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import PhrasePreview from "@/components/PhrasePreview";
import Curriculum from "@/components/Curriculum";
import Steps from "@/components/Steps";
import LevelQuiz from "@/components/LevelQuiz";
import ForYou from "@/components/ForYou";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import ApplyForm from "@/components/ApplyForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhySection />
        <PhrasePreview />
        <Curriculum />
        <Steps />
        <LevelQuiz />
        <ForYou />
        <Pricing />
        <Faq />
        <ApplyForm />
      </main>
      <Footer />
    </>
  );
}
