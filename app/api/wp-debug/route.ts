import { NextResponse } from "next/server";
import { fetchCars } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export async function GET() {
  const wpApiUrl = process.env.WORDPRESS_API_URL ?? "https://www.quirozautomotriz.cl/wp-json/wp/v2";
  const nextPhase = process.env.NEXT_PHASE ?? "(not set)";

type Step = { step: string; ok: boolean; detail: string };

const result: {
    timestamp: string;
    env: { WORDPRESS_API_URL: string; NEXT_PHASE: string; isBuild: boolean };
    steps: Step[];
    cars?: Array<{ id: string; brand: string; model: string; price: string }>;
  } = {
    timestamp: new Date().toISOString(),
    env: {
      WORDPRESS_API_URL: wpApiUrl,
      NEXT_PHASE: nextPhase,
      isBuild: nextPhase === "phase-production-build",
    },
    steps: [],
  };

  // Step 1: Test raw fetch to WP API
  try {
    const t0 = Date.now();
    const res = await fetch(
      `${wpApiUrl}/product?per_page=2&_embed`,
      {
        signal: AbortSignal.timeout(20000),
        headers: { "Accept": "application/json" },
      }
    );
    const elapsed = Date.now() - t0;
    const data = await res.json();
    const count = Array.isArray(data) ? data.length : 0;
    result.steps.push({
      step: "1. Raw fetch WP API",
      ok: res.ok,
      detail: `HTTP ${res.status} · ${elapsed}ms · ${count} productos en página 1`,
    });

    if (count > 0) {
      const p = data[0];
      result.steps.push({
        step: "2. Inspect first product",
        ok: true,
        detail: `slug=${p.slug} · title=${p.title?.rendered} · acf.precio=${p.acf?.precio} · has_embedded=${!!p._embedded}`,
      });
    }
  } catch (err) {
    result.steps.push({
      step: "1. Raw fetch WP API",
      ok: false,
      detail: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // Step 3: Test fetchCars()
  try {
    const t0 = Date.now();
    const cars = await fetchCars();
    const elapsed = Date.now() - t0;
    const isStatic = cars.length === 8 && cars[0]?.id === "bmw-420-coupe-2024";
    result.steps.push({
      step: "3. fetchCars()",
      ok: !isStatic,
      detail: `${cars.length} autos · ${elapsed}ms · ${isStatic ? "STATIC FALLBACK" : "WP DATA"}`,
    });

    if (!isStatic) {
      result.cars = cars.slice(0, 5).map((c) => ({
        id: c.id,
        brand: c.brand,
        model: c.model,
        price: c.price,
      }));
    }
  } catch (err) {
    result.steps.push({
      step: "3. fetchCars()",
      ok: false,
      detail: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  const anyOk = result.steps.some((s: Step) => s.ok);
  return NextResponse.json(result, { status: anyOk ? 200 : 500 });
}
