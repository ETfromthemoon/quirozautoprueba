import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/cars";
import type {
  VehicleReport as Report,
  ItemStatus,
  OverallState,
} from "@/lib/brochures";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import Logo from "./Logo";
import Reveal from "./brochure/Reveal";
import ChapterNav from "./brochure/ChapterNav";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  CheckIcon,
  LockIcon,
  ScanIcon,
  ShieldCheckIcon,
  WrenchIcon,
  GaugeIcon,
  AlertTriangleIcon,
  CalendarIcon,
} from "./icons";

type Props = { car: Car; report: Report };

const CHAPTERS = [
  { id: "veredicto", label: "Veredicto" },
  { id: "ficha", label: "Ficha real" },
  { id: "scanner", label: "Escáner" },
  { id: "mecanica", label: "Mecánica" },
  { id: "carroceria", label: "Carrocería" },
  { id: "rodaje", label: "Neumáticos" },
  { id: "historial", label: "Historial" },
  { id: "fotos", label: "Fotos" },
];

const BODY_ELEMENTS = [
  "Capó", "Maletero", "Parabrisas", "Luneta trasera", "Espejos exteriores", "Llantas",
  "Focos delanteros", "Focos traseros", "Tapabarro delantero derecho", "Tapabarro delantero izquierdo",
  "Tapabarro trasero derecho", "Tapabarro trasero izquierdo", "Puerta delantera derecha",
  "Puerta delantera izquierda", "Puerta trasera derecha", "Puerta trasera izquierda",
  "Parachoques delantero", "Parachoques trasero",
];

/** Escala máxima de las barras de espesor de pintura (µm). */
const PAINT_BAR_MAX_MICRAS = 300;
/** Banda de rodadura de un neumático nuevo (mm), tope de la barra. */
const TIRE_NEW_TREAD_MM = 8;

export default function VehicleReport({ car, report }: Props) {
  const carName = `${car.brand} ${car.model} ${car.year}`;
  const visitaUrl = `/reserva?vehiculo=${encodeURIComponent(carName)}`;
  const waMsg = `Hola, revisé el informe privado del ${carName} (folio ${report.signature.folio}) y quiero agendar una visita.`;
  const waUrl = getWhatsAppUrl(waMsg);
  const state = STATE_META[report.verdict.estado];

  return (
    <main className="relative min-h-dvh bg-ink-950 text-ink-50">
      <ChapterNav chapters={CHAPTERS} />

      {/* Barra superior */}
      <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="glass-dark rounded-full flex items-center justify-between gap-3 px-4 md:px-6 py-2 md:py-2.5">
            <Link
              href={`/vehiculo/${car.id}`}
              className="flex items-center gap-2 text-ink-200 hover:text-white transition-colors group"
              aria-label="Volver a la ficha del vehículo"
            >
              <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-overline hidden sm:inline">Ficha</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <Logo variant="horizontal" className="h-6 md:h-7 w-auto max-w-[130px]" />
              <span className="hidden lg:inline text-overline text-[9px] text-ink-400 whitespace-nowrap">KAIROS RED CAR</span>
            </div>

            <div className="flex items-center gap-2 text-ink-300">
              <LockIcon className="w-3.5 h-3.5 text-accent-500" />
              <span className="text-overline text-[10px] md:text-[11px]">
                Informe privado
              </span>
            </div>

            <Link href={visitaUrl} className="btn-base btn-primary !py-2 !px-4 md:!px-5 !text-[11px]">
              <span className="hidden sm:inline">Agendar visita</span>
              <span className="sm:hidden">Visita</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Portada ── */}
      <section className="relative h-[82dvh] md:h-[90dvh] w-full overflow-hidden cinematic-vignette">
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src={car.image}
            alt={carName}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/20 pointer-events-none" />
        <div className="grain-overlay" />
        <div className="light-streak" />

        {/* Sello confidencial */}
        <div className="absolute top-24 left-4 md:top-28 md:left-10 z-20">
          <div className="glass-dark rounded-full px-3 md:px-4 py-1.5 flex items-center gap-2">
            <LockIcon className="w-3 h-3 text-accent-500" />
            <span className="text-overline text-white text-[9px] md:text-[10px]">
              Confidencial · Folio {report.signature.folio}
            </span>
          </div>
        </div>

        {/* Info portada */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 lg:p-16">
          <div className="max-w-6xl mx-auto">
            <p className="text-overline mb-3">
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-6 md:w-8 bg-accent-600" />
                <span className="text-accent-500">Informe de peritaje</span>
              </span>
            </p>
            <h1 className="font-display text-white leading-[0.92] tracking-tighter">
              <span className="block text-sm md:text-2xl lg:text-3xl font-medium text-ink-200 tracking-[0.2em] uppercase">
                {car.brand}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mt-1 md:mt-2 break-words">
                {car.model}
              </span>
            </h1>
            {car.variant && (
              <p className="mt-3 md:mt-4 text-silver-300 text-xs md:text-base font-medium tracking-[0.15em] uppercase">
                {car.variant}
              </p>
            )}
            <p className="mt-5 max-w-2xl text-sm md:text-base text-ink-200 font-light leading-relaxed">
              Radiografía completa del vehículo - escanner - mediciones y observaciones.
            </p>
            <p className="hidden">
              Radiografía completa del estado real de este vehículo — con
              escáner electrónico, mediciones y observaciones honestas — para
              que decidas con datos.
            </p>
          </div>
        </div>
      </section>

      {car.videoUrl && (
        <section className="relative bg-ink-950 px-4 md:px-8 pt-10 md:pt-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-overline text-accent-500 mb-2">Presentación del vehículo</p>
            <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-5">Conócelo en movimiento</h2>
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
              <iframe src={car.videoUrl} title={`Video de presentación del ${carName}`} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        </section>
      )}

      {/* Cuerpo */}
      <div className="mx-auto max-w-6xl px-4 md:px-8 pb-24 md:pb-32 space-y-20 md:space-y-28 pt-16 md:pt-24">
        {/* ── Veredicto ── */}
        <Reveal as="section" id="veredicto">
          <SectionHead
            index="01"
            overline="Veredicto del perito"
            title="Estado general"
          />
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-5">
              <div className="glass-panel rounded-3xl p-7 md:p-8 h-full flex flex-col">
                <div
                  className={`inline-flex self-start items-center gap-2 rounded-full px-4 py-1.5 border ${state.pill}`}
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span className="text-overline text-[11px]">{report.verdict.estado}</span>
                </div>
                <p className="mt-6 text-lg md:text-xl text-white font-light leading-relaxed">
                  {report.verdict.resumen}
                </p>
                <div className="mt-auto pt-6 flex items-center gap-3 text-ink-400">
                  <GaugeIcon className="w-4 h-4 text-accent-500" />
                  <span className="text-xs font-light">
                    {report.historial.kmVerificado} verificados · {report.historial.dueños}{" "}
                    {report.historial.dueños === 1 ? "dueño" : "dueños"}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              <div className="glass-light rounded-2xl p-6">
                <p className="text-overline text-emerald-400 mb-4 flex items-center gap-2">
                  <CheckIcon className="w-4 h-4" /> A favor
                </p>
                <ul className="space-y-3">
                  {report.verdict.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-ink-100 font-light leading-snug">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-light rounded-2xl p-6">
                <p className="text-overline text-amber-400 mb-4 flex items-center gap-2">
                  <AlertTriangleIcon className="w-4 h-4" /> A considerar
                </p>
                {report.verdict.observaciones.length > 0 ? (
                  <ul className="space-y-3">
                    {report.verdict.observaciones.map((o) => (
                      <li key={o} className="flex items-start gap-2.5 text-sm text-ink-100 font-light leading-snug">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-300 font-light">
                    Sin observaciones relevantes en esta inspección.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Ficha verificada ── */}
        <Reveal as="section" id="ficha">
          <SectionHead
            index="02"
            overline="Datos verificados"
            title="Ficha real del vehículo"
            desc="Los mismos datos publicados, confirmados uno a uno durante el peritaje."
          />
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
              <Spec label="Marca" value={car.brand} />
              <Spec label="Modelo" value={car.model} />
              {car.variant && <Spec label="Versión" value={car.variant} />}
              <Spec label="Año" value={String(car.year)} />
              <Spec label="Kilometraje" value={`${car.km} km`} />
              <Spec label="Combustible" value={car.fuel} />
              <Spec label="Transmisión" value={car.transmission} />
              {car.drivetrain && <Spec label="Tracción" value={car.drivetrain} />}
              {car.power && <Spec label="Potencia" value={car.power} />}
              <Spec label="Carrocería" value={car.bodyType} />
              {car.documentation?.color && (
                <Spec label="Color" value={car.documentation.color} />
              )}
              <Spec label="Precio" value={car.price} accent />
            </dl>

            {/* Identificadores sensibles */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-overline text-accent-500 mb-4 flex items-center gap-2">
                <LockIcon className="w-3.5 h-3.5" /> Identificadores (confidencial)
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
                <Spec label="VIN / Chasis" value={report.identifiers.vin} mono />
                <Spec label="Patente" value={report.identifiers.patente} mono />
                <Spec label="N° de motor" value={report.identifiers.numeroMotor} mono />
              </dl>
            </div>
          </div>
        </Reveal>

        {/* ── Escáner OBD-II ── */}
        <Reveal as="section" id="scanner">
          <SectionHead
            index="03"
            overline="Diagnóstico electrónico"
            title="Análisis con escáner"
            desc={report.scanner.resumen}
            icon={<ScanIcon className="w-5 h-5" />}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {report.scanner.systems.map((s) => (
              <div
                key={s.nombre}
                className="glass-light rounded-2xl p-5 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-sm md:text-base text-white font-medium">{s.nombre}</p>
                  {s.nota && (
                    <p className="text-xs text-ink-400 font-light mt-1">{s.nota}</p>
                  )}
                </div>
                <StatusChip status={s.estado} />
              </div>
            ))}
          </div>

          {report.scanner.codigos.length > 0 && (
            <div className="mt-6 glass-panel rounded-2xl p-6">
              <p className="text-overline text-amber-400 mb-4">Códigos registrados</p>
              <ul className="space-y-4">
                {report.scanner.codigos.map((c) => (
                  <li key={c.codigo} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <span className="font-display text-white font-semibold tracking-tight shrink-0">
                      {c.codigo}
                    </span>
                    <span className="text-sm text-ink-200 font-light leading-snug flex-1">
                      {c.descripcion}
                    </span>
                    <span
                      className={`text-overline text-[10px] self-start px-2.5 py-1 rounded-full border ${
                        c.tipo === "activo"
                          ? STATUS_META.falla.pill
                          : STATUS_META.atencion.pill
                      }`}
                    >
                      {c.tipo === "activo" ? "Activo" : "Histórico"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>

        {/* ── Inspección mecánica ── */}
        <Reveal as="section" id="mecanica">
          <SectionHead
            index="04"
            overline="Inspección multipunto"
            title="Estado mecánico"
            icon={<WrenchIcon className="w-5 h-5" />}
          />
          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {report.mecanica.map((sec) => (
              <div key={sec.area} className="glass-panel rounded-2xl p-6">
                <h3 className="font-display text-lg text-white font-bold tracking-tight mb-4">
                  {sec.area}
                </h3>
                <ul className="space-y-3">
                  {sec.items.filter((item) => !/corrosi.n estructural/i.test(item.label)).map((item) => (
                    <li key={item.label} className="flex items-start justify-between gap-3 border-b border-white/8 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm text-ink-100 font-light">{item.label}</p>
                        {item.nota && (
                          <p className="text-xs text-ink-400 font-light mt-0.5">{item.nota}</p>
                        )}
                      </div>
                      <StatusChip status={item.estado} compact />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <ObservationBlock text="La inspección mecánica no presenta hallazgos críticos fuera de los estados indicados en cada ítem." />
        </Reveal>

        {/* ── Carrocería y pintura ── */}
        <Reveal as="section" id="carroceria">
          <SectionHead
            index="05"
            overline="Medición de pintura"
            title="Carrocería y estructura"
            desc={report.carroceria.resumen}
          />
          <div className="glass-panel rounded-3xl p-6 md:p-8">
            <p className="text-xs text-ink-400 font-light mb-6">
              Rango original de fábrica de referencia:{" "}
              <span className="text-ink-200">{report.carroceria.rangoOriginal}</span>
            </p>
            <div className="space-y-4">
              {report.carroceria.paneles.map((p) => {
                const st: ItemStatus = p.estado === "original" ? "ok" : "atencion";
                const pct = Math.min(100, Math.round((p.micras / PAINT_BAR_MAX_MICRAS) * 100));
                return (
                  <div key={p.panel}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-ink-100 font-light">{p.panel}</span>
                      <span className="flex items-center gap-2">
                        <span className="font-display text-sm text-white font-semibold tabular-nums">
                          {p.micras} µm
                        </span>
                        <span className={`text-[10px] text-overline px-2 py-0.5 rounded-full border ${STATUS_META[st].pill}`}>
                          {p.estado === "original" ? "Original" : p.estado === "repintado" ? "Repintado" : "Observación"}
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${STATUS_META[st].bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {p.nota && (
                      <p className="text-xs text-ink-400 font-light mt-1.5">{p.nota}</p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-overline text-accent-500 mb-2">Elementos revisados</p>
              <div className="flex flex-wrap gap-2">{(report.carroceria.elementos ?? BODY_ELEMENTS).map((elemento) => <span key={elemento} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-ink-200">{elemento}</span>)}</div>
            </div>
            <ObservationBlock text={report.carroceria.observaciones ?? "Sin observaciones adicionales."} />
          </div>
        </Reveal>

        {/* ── Neumáticos y frenos ── */}
        <Reveal as="section" id="rodaje">
          <SectionHead
            index="06"
            overline="Tren de rodaje"
            title="Neumáticos y frenos"
          />
          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-display text-lg text-white font-bold tracking-tight mb-5">
                Neumáticos
              </h3>
              <div className="space-y-4">
                {report.running.neumaticos.map((t) => {
                  const pct = Math.min(100, Math.round((t.bandaMm / TIRE_NEW_TREAD_MM) * 100));
                  return (
                    <div key={t.posicion}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-ink-100 font-light">
                          {t.posicion}
                          <span className="text-ink-500"> · {t.marca}</span>
                        </span>
                        <span className="font-display text-sm text-white font-semibold tabular-nums">
                          {t.bandaMm.toFixed(1)} mm
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${STATUS_META[t.estado].bar}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-display text-lg text-white font-bold tracking-tight mb-5">
                Frenos
              </h3>
              <div className="space-y-5">
                {report.running.frenos.map((b) => (
                  <div key={b.eje}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-ink-100 font-light">{b.eje}</span>
                      <span className="font-display text-sm text-white font-semibold tabular-nums">
                        {b.pastillasPct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${STATUS_META[b.estado].bar}`}
                        style={{ width: `${b.pastillasPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-ink-400 font-light mt-1.5">{b.discos}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {report.running.nota && (
            <p className="mt-4 text-sm text-ink-300 font-light flex items-start gap-2">
              <AlertTriangleIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              {report.running.nota}
            </p>
          )}
          <ObservationBlock text={report.running.observaciones ?? report.running.nota ?? "Sin observaciones adicionales."} />
        </Reveal>

        {/* ── Historial ── */}
        <Reveal as="section" id="historial">
          <SectionHead
            index="07"
            overline="Trazabilidad"
            title="Historial verificado"
          />
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-panel rounded-2xl p-6">
                <p className="text-overline text-accent-500 mb-2">Kilometraje</p>
                <p className="font-display text-2xl text-white font-bold tracking-tight">
                  {report.historial.kmVerificado}
                </p>
                <p className="text-xs text-ink-400 font-light mt-1.5">
                  {report.historial.kmComentario}
                </p>
              </div>
              <div className="glass-light rounded-2xl p-6 space-y-3">
                <LegalRow label="Multas" value={report.historial.legal.multas} />
                <LegalRow label="Prendas / gravámenes" value={report.historial.legal.prendas} />
                <LegalRow label="Transferencia" value={report.historial.legal.transferencia} />
                <LegalRow label="N° de dueños" value={String(report.historial.dueños)} />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-panel rounded-2xl p-6 md:p-7">
                <p className="text-overline text-accent-500 mb-5">Historial de propietarios</p>
                <ol className="relative border-l border-white/12 ml-1.5 space-y-6">
                  {report.historial.mantenciones.map((m) => (
                    <li key={`${m.fecha}-${m.km}`} className="pl-6 relative">
                      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-accent-600 ring-4 ring-ink-950" />
                      <div className="flex items-center gap-2 text-ink-300 text-xs mb-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span className="font-medium">{m.fecha}</span>
                        <span className="text-ink-500">· {m.km}</span>
                      </div>
                      <p className="text-sm text-ink-100 font-light">{m.detalle}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <div className="glass-light rounded-2xl p-5"><LegalRow label="Aseguradora" value={report.historial.aseguradora === "no" ? "No" : "Sí"} /></div>
            <div className="glass-light rounded-2xl p-5"><p className="text-overline text-accent-500 mb-2">Observaciones</p><p className="text-sm text-ink-200 font-light leading-relaxed">{report.historial.observaciones ?? "Sin observaciones adicionales."}</p></div>
          </div>
        </Reveal>

        {/* ── Fotos honestas ── */}
        <Reveal as="section" id="fotos">
          <SectionHead
            index="08"
            overline="Registro fotográfico"
            title="Fotos de detalle"
            desc="Highlights y observaciones reales, sin retoques."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.fotos.map((f) => (
              <figure
                key={f.url}
                className="group relative rounded-2xl overflow-hidden border border-white/10"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={f.url}
                    alt={f.caption}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                </div>
                <figcaption className="absolute bottom-0 left-0 right-0 p-4">
                  <span
                    className={`inline-block mb-2 text-[10px] text-overline px-2 py-0.5 rounded-full border ${
                      f.tipo === "highlight" ? STATUS_META.ok.pill : STATUS_META.atencion.pill
                    }`}
                  >
                    {f.tipo === "highlight" ? "A favor" : "Observación"}
                  </span>
                  <p className="text-sm text-white font-light leading-snug">{f.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          {car.videoUrl && <div className="mt-8"><p className="text-overline text-accent-500 mb-3">Inspección visual completa</p><div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-black"><iframe src={car.videoUrl} title={`Inspección visual completa del ${carName}`} className="absolute inset-0 h-full w-full" allowFullScreen /></div></div>}
        </Reveal>

        {/* ── Firma ── */}
        <Reveal as="section" id="firma" className="hidden">
          <div className="glass-light rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-overline text-accent-500 mb-3">Responsable del informe</p>
              <p className="font-display text-lg text-white font-bold tracking-tight">
                {report.signature.perito}
              </p>
              <p className="text-sm text-ink-300 font-light">{report.signature.taller}</p>
              <p className="text-xs text-ink-500 font-light mt-2">
                Emitido el {report.signature.fecha} · Folio {report.signature.folio}
              </p>
            </div>
            <Logo variant="horizontal" className="h-9 w-auto opacity-90 shrink-0" />
          </div>
        </Reveal>

        {/* ── CTA final ── */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl glass-panel p-8 md:p-12 text-center">
            <div className="light-streak" />
            <p className="text-overline text-accent-500 mb-3">Siguiente paso</p>
            <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
              Ya conoces su estado real, ahora ven por él
            </h2>
            <h2 className="hidden">
              Ya conoces su estado real. Ahora ven por él.
            </h2>
            <p className="hidden">
              Agenda una visita sin compromiso para revisar el {carName} y este
              informe con tu asesor Quiroz.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={visitaUrl} className="btn-base btn-primary">
                <span>Haz tu reserva aquí</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

            {/* Pago de reserva Transbank/Webpay — pendiente de conexión */}
            <div className="hidden">
              <p className="text-overline text-accent-500">Asegura tu compra</p>
              <p className="text-base text-white font-semibold">Reserva con $200.000 y el auto es tuyo.</p>
              <button
                type="button"
                
                aria-disabled="true"
                title="Disponible próximamente"
                className="btn-base btn-primary"
              >
                <span>Reserva con $200.000</span>
              </button>
              <p className="text-[11px] text-ink-500 font-light">
                Pago en línea con Webpay disponible próximamente.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Pie */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href={`/vehiculo/${car.id}`} className="btn-ghost">
            <ArrowLeftIcon className="w-3 h-3" />
            <span>Volver a la ficha pública</span>
          </Link>
          <p className="text-xs text-ink-500 font-light tracking-widest text-center">
            DOCUMENTO CONFIDENCIAL · QUIROZ REDCAR
          </p>
        </div>
      </div>
    </main>
  );
}

/* ── Meta de estados (semáforo) ── */

const STATUS_META: Record<
  ItemStatus,
  { pill: string; bar: string; dot: string; label: string }
> = {
  ok: {
    pill: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    bar: "bg-emerald-400",
    dot: "bg-emerald-400",
    label: "OK",
  },
  atencion: {
    pill: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    bar: "bg-amber-400",
    dot: "bg-amber-400",
    label: "Atención",
  },
  falla: {
    pill: "text-accent-400 bg-accent-500/10 border-accent-500/25",
    bar: "bg-accent-500",
    dot: "bg-accent-500",
    label: "Revisar",
  },
};

const STATE_META: Record<OverallState, { pill: string }> = {
  Excelente: { pill: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
  "Muy bueno": { pill: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
  Bueno: { pill: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
  "Con observaciones": { pill: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
};

/* ── Subcomponentes ── */

function ObservationBlock({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-accent-500/20 bg-accent-500/[0.05] p-5">
      <p className="text-overline text-accent-500 mb-2">Observaciones</p>
      <p className="text-sm text-ink-200 font-light leading-relaxed">{text}</p>
    </div>
  );
}

function SectionHead({
  index,
  overline,
  title,
  desc,
  icon,
}: {
  index: string;
  overline: string;
  title: string;
  desc?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-display text-sm text-accent-500 font-bold tabular-nums">
          {index}
        </span>
        <span className="h-px w-8 bg-accent-600" />
        <span className="text-overline text-ink-400">{overline}</span>
      </div>
      <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
        {icon && <span className="text-accent-500">{icon}</span>}
        {title}
      </h2>
      {desc && (
        <p className="mt-3 max-w-2xl text-sm md:text-base text-ink-300 font-light leading-relaxed">
          {desc}
        </p>
      )}
    </div>
  );
}

function Spec({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="border-b border-white/10 pb-3">
      <dt className="text-overline text-ink-400 mb-1.5">{label}</dt>
      <dd
        className={`font-display text-base md:text-lg font-semibold tracking-tight ${
          accent ? "text-accent-400" : "text-white"
        } ${mono ? "!font-sans !tracking-normal text-sm md:text-base tabular-nums break-all" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

function StatusChip({ status, compact }: { status: ItemStatus; compact?: boolean }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shrink-0 ${m.pill} ${
        compact ? "px-2 py-0.5" : "px-2.5 py-1"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      <span className="text-overline text-[10px]">{m.label}</span>
    </span>
  );
}

function LegalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/8 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-ink-400 font-light">{label}</span>
      <span className="text-sm text-white font-light text-right">{value}</span>
    </div>
  );
}
