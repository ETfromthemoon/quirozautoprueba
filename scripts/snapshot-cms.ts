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

  const outputPath = resolve(process.cwd(), "lib", "cars.snapshot.json");
  await writeFile(outputPath, `${JSON.stringify(cars, null, 2)}\n`, "utf8");
  console.log(`[CMS snapshot] ${cars.length} autos guardados en ${outputPath}`);
}

main().catch((error) => {
  console.error("[CMS snapshot] error:", error);
  process.exit(1);
});
