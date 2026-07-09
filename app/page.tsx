import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CarShowcase from "@/components/CarShowcase";
import Contact from "@/components/Contact";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { fetchCars } from "@/lib/wordpress";

// ISR: regenerar la página hasta cada 60 segundos para mostrar autos nuevos en ~1 min
export const revalidate = 60;

export default async function Home() {
  const cars = await fetchCars();

  return (
    <>
      <Navbar totalCars={cars.length} />
      <main
        id="showcase-root"
        className="showcase-container"
      >
        <Hero totalCars={cars.length} />
        <h2 className="sr-only">Catálogo de {cars.length} vehículos disponibles</h2>
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
