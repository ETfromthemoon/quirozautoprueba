import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CarShowcase from "@/components/CarShowcase";
import Contact from "@/components/Contact";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { cars } from "@/lib/cars";

export default function Home() {
  return (
    <>
      <Navbar totalCars={cars.length} />
      <main
        id="showcase-root"
        className="showcase-container"
      >
        <Hero />
        {cars.map((car, i) => (
          <CarShowcase
            key={car.id}
            car={car}
            index={i}
            total={cars.length}
          />
        ))}
        <Contact />
      </main>
      <FloatingWhatsApp />
    </>
  );
}
