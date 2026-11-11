import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Intro, Benefits, Certifications, Areas, Faq } from "@/components/franchise/Sections";
import ProcessSteps from "@/components/franchise/ProcessSteps";
import Combos from "@/components/franchise/Combos";
import InquiryForm from "@/components/franchise/InquiryForm";
import MobileCtaBar from "@/components/franchise/MobileCtaBar";

export const metadata: Metadata = {
  title: "창업문의 | PUMP ARCADE 펌프 아케이드",
  description: "세계 최초 VAR 발판게임 펌프아케이드 창업. 30평 기준 7,500~9,500만원, 신규 게임 무료 업데이트, 무상 A/S 2년.",
};

export default function FranchisePage() {
  return (
    <>
      <Header />
      <main>
        <Intro />
        <Combos />
        <ProcessSteps />
        <Benefits />
        <Certifications />
        <Areas />
        <Faq />
        <InquiryForm />
      </main>
      <Footer />
      <ScrollReveal />
      <MobileCtaBar />
    </>
  );
}
