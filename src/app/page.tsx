import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NearbyStores from "@/components/NearbyStores";
import GameModes from "@/components/GameModes";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <NearbyStores />
        <GameModes />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
