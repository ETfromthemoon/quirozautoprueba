import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  const { fetchCarsForSnapshot } = await import("../lib/wordpress");
  const cars = await Promise.race([
    fetchCarsForSnapshot(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Tiempo máximo de actualización del CMS excedido")), 75_000),
    ),
  ]);
  if (cars.length < 10) {
    throw new Error(`El CMS devolvió solo ${cars.length} autos; se conserva la instantánea anterior.`);
  }

  const galleryImageCount = cars.reduce(
    (total, car) => total + (car.gallery?.length ?? 0),
    0,
  );
  const categorizedCars = cars.filter((car) => car.cmsCategories?.length).length;
  if (galleryImageCount < cars.length * 2 || categorizedCars < cars.length * 0.8) {
    throw new Error(
      `El CMS devolvió una carga parcial (${galleryImageCount} fotos, ${categorizedCars}/${cars.length} autos categorizados); se conserva la instantánea anterior.`,
    );
  }

  const outputPath = resolve(process.cwd(), "lib", "cars.snapshot.json");
  await writeFile(outputPath, `${JSON.stringify(cars, null, 2)}\n`, "utf8");
  console.log(
    `[CMS snapshot] ${cars.length} autos, ${galleryImageCount} fotos y ${categorizedCars} fichas categorizadas guardados en ${outputPath}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[CMS snapshot] error:", error);
    process.exit(1);
  });
