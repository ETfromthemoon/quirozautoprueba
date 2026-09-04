import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/cars";
import type { InspectionDatum, ReportImage, ReportModule, VehicleReport as Report } from "@/lib/brochures";
import VideoEmbed from "./VideoEmbed";
import VehicleGallery from "./VehicleGallery";
import Logo from "./Logo";
import Reveal from "./brochure/Reveal";
import ChapterNav from "./brochure/ChapterNav";
import { ArrowLeftIcon, ArrowRightIcon, LockIcon, ScanIcon } from "./icons";

type Props = { car: Car; report: Report; demo?: boolean };
type Row = [string, string];
type Group = { title?: string; rows: Row[]; observationKey?: string };
type Definition = { id: string; index: string; title: string; overline: string; module?: ReportModule; groups: Group[] };
const EMPTY = /^(?:-|—|n\/?a|s\/?i|sin informaci[oó]n|no informado)$/i;

export default function VehicleReport({ car, report, demo = false }: Props) {
  const all: Definition[] = [
    { id: "identificacion", index: "01", title: "Identificación legal", overline: "Datos de CAV", module: report.identificacionLegal, groups: [{ observationKey: "observaciones", rows: [
      ["Tipo de vehículo", "tipoVehiculo"], ["Marca", "marca"], ["Modelo", "modelo"], ["Año", "ano"], ["Color", "color"], ["Versión", "version"], ["Transmisión", "transmision"], ["Combustible", "combustible"], ["Patente", "patente"], ["Nº motor", "numeroMotor"], ["Nº chasis (VIN)", "vin"], ["Nº de dueños", "numeroDuenos"], ["Copia de llaves", "copiaLlaves"], ["Transporte", "transporte"], ["Aseguradora", "aseguradora"], ["Pérdida total", "perdidaTotal"], ["Prenda", "prenda"], ["Multas inscritas", "multasInscritas"], ["Limitaciones al dominio", "limitacionesDominio"]
    ] }] },
    { id: "scanner", index: "02", title: "Escáner electrónico", overline: "Diagnóstico OBD2", module: report.scannerElectronico, groups: [{ observationKey: "observaciones", rows: [["Resultado escáner OBD2", "resultadoObd2"], ["Testigos encendidos", "testigosEncendidos"]] }] },
    { id: "motor", index: "03", title: "Motor y mecánica", overline: "Inspección mecánica", module: report.motorMecanica, groups: [{ observationKey: "observaciones", rows: [["Partida en frío", "partidaFrio"], ["Ruidos", "ruidos"], ["Humo", "humo"], ["Fugas de aceite", "fugasAceite"], ["Mantenciones", "mantenciones"]] }] },
    { id: "transmision", index: "04", title: "Transmisión", overline: "Comportamiento", module: report.transmision, groups: [{ observationKey: "observaciones", rows: [["Tipo", "tipo"], ["Embrague", "embrague"], ["Paso de cambios", "pasoCambios"], ["Golpe", "golpe"], ["Patina", "patina"], ["Tirones", "tirones"]] }] },
    { id: "rodaje", index: "05", title: "Dirección, suspensión, frenos y neumáticos", overline: "Control y seguridad", module: report.direccionSuspensionFrenosNeumaticos, groups: [
      { title: "Dirección", rows: [["Juego", "direccionJuego"], ["Ruidos al girar", "direccionRuidos"], ["Cremallera", "cremallera"]], observationKey: "observacionesDireccion" },
      { title: "Suspensión", rows: [["Amortiguadores", "amortiguadores"], ["Bandejas", "bandejas"], ["Cazoletas", "cazoletas"]], observationKey: "observacionesSuspension" },
      { title: "Frenos", rows: [["Discos", "discos"], ["Pastillas", "pastillas"]], observationKey: "observacionesFrenos" },
      { title: "Neumáticos", rows: [["Neumáticos", "neumaticos"], ["Rueda de repuesto", "ruedaRepuesto"]], observationKey: "observacionesNeumaticos" }
    ] },
    { id: "carroceria", index: "06", title: "Carrocería y estructura", overline: "Inspección exterior", module: report.carroceriaEstructura, groups: [{ observationKey: "observaciones", rows: [["Repintado / medidor de micras", "repintado"], ["Golpe reparado", "golpeReparado"], ["Cuadratura", "cuadratura"], ["Capó", "capot"], ["Techo", "techo"], ["Maletero", "maletero"], ["Puertas", "puertas"], ["Parachoque delantero", "parachoqueDelantero"], ["Parachoque trasero", "parachoqueTrasero"], ["Pilares", "pilares"], ["Parabrisas delantero", "parabrisasDelantero"], ["Parabrisas trasero", "parabrisasTrasero"], ["Focos", "focos"], ["Llantas", "llantas"]] }] },
    { id: "interior", index: "07", title: "Interior", overline: "Habitáculo", module: report.interior, groups: [{ observationKey: "observaciones", rows: [["Desgaste del volante", "desgasteVolante"], ["Asientos", "asientos"], ["Pedales coherentes con kilometraje", "pedalesCoherentesKm"], ["Limpieza", "limpieza"]] }] },
    { id: "equipamiento", index: "08", title: "Equipamiento", overline: "Funciones verificadas", module: report.equipamiento, groups: [{ observationKey: "observaciones", rows: [["A/C · calefacción · climatizador", "climatizacion"], ["Alzavidrios", "alzavidrios"], ["Cierre central", "cierreCentral"], ["Radio", "radio"], ["Airbags", "airbags"], ["Cinturones", "cinturones"], ["Maletero", "maletero"], ["Rueda de repuesto", "ruedaRepuesto"], ["Gata", "gata"]] }] },
    { id: "prueba-ruta", index: "09", title: "Prueba de ruta", overline: "Comportamiento dinámico", module: report.pruebaRuta, groups: [{ observationKey: "observaciones", rows: [["Distancia", "distancia"], ["Ruidos", "ruidos"], ["Tironeo", "tironeo"], ["Frenado", "frenado"], ["Vibración", "vibracion"], ["Temperatura", "temperatura"]] }] }
  ];
  const definitions = all.filter(hasDefinitionContent);
  const name = `${car.brand} ${car.model} ${car.year}`;
  const videos = unique([...(car.videoUrls ?? []), car.videoUrl]);
  const gallery = unique([car.image, ...(car.gallery ?? []), ...(report.galeria ?? []).map(item => item.url)]);
  const chapters = [...definitions.map(item => ({ id: item.id, label: item.title })), ...(gallery.length ? [{ id: "galeria", label: "Galería" }] : [])];
  const booking = `/reserva?vehiculo=${encodeURIComponent(name)}`;

  return <main className="min-h-dvh bg-ink-950 text-ink-50">
    <ChapterNav chapters={chapters} />
    <header className="fixed inset-x-0 top-0 z-50 py-3"><div className="mx-auto max-w-6xl px-4"><div className="glass-dark flex items-center justify-between rounded-full px-5 py-2">
      <Link href={`/vehiculo/${car.id}`} className="btn-ghost min-h-11"><ArrowLeftIcon className="h-4 w-4" /><span className="hidden sm:inline">Ficha</span></Link>
      <Logo variant="horizontal" className="hidden h-7 w-auto sm:block" />
      <span className="flex items-center gap-2 text-overline text-ink-200">{demo ? <ScanIcon className="h-4 w-4 text-accent-500" /> : <LockIcon className="h-4 w-4 text-accent-500" />}{demo ? "Demo · datos de prueba" : "Informe privado"}</span>
      <Link href={booking} className="btn-base btn-primary !min-h-11 !px-4 !py-2">Agendar visita</Link>
    </div></div></header>
    <section className="cinematic-vignette relative h-[86dvh] min-h-[580px] overflow-hidden">
      <Image src={car.image} alt={name} fill preload sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-black/30" /><div className="grain-overlay" />
      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-14"><div className="mx-auto max-w-6xl">
        <div className="mb-5 flex gap-2"><span className="rounded-full border border-accent-500/30 bg-accent-600/15 px-3 py-1.5 text-overline text-accent-400">{demo ? "Demostración pública" : "Documento confidencial"}</span>{validText(report.signature?.folio) && <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-overline">Folio {report.signature?.folio}</span>}</div>
        <p className="text-overline text-accent-500">Informe de inspección vehicular</p>
        <h1 className="mt-3 max-w-5xl font-display text-4xl font-extrabold leading-[.92] tracking-tighter text-white sm:text-6xl lg:text-8xl">{car.brand} <span className="text-silver-300">{car.model}</span></h1>
        <p className="mt-6 text-ink-200">{car.year} · {car.variant} · {definitions.length} módulos informados</p>
      </div></div>
    </section>
    {videos.length > 0 && <section className="px-4 pt-16"><div className="mx-auto max-w-6xl"><Heading overline="Registro audiovisual" title="Conócelo en movimiento" /><div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10"><VideoEmbed videoUrls={videos} posterImage={car.videoPoster ?? car.image} alt={`Video del ${name}`} /></div></div></section>}
    <div className="mx-auto max-w-6xl space-y-24 px-4 py-20 md:px-8">
      {definitions.map(definition => <ModuleSection key={definition.id} definition={definition} />)}
      {gallery.length > 0 && <Reveal as="section" id="galeria" className="scroll-mt-28"><Heading index="10" overline="Registro fotográfico" title="Galería del vehículo" /><VehicleGallery images={gallery} alt={name} /><div className="mt-4 flex flex-wrap gap-2">{report.galeria?.filter(item => validText(item.caption)).map(item => <span key={item.url} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-ink-300">{item.caption}</span>)}</div></Reveal>}
      {report.signature && <Reveal><div className="glass-light flex flex-col justify-between gap-5 rounded-3xl p-7 sm:flex-row sm:items-center"><div><p className="text-overline text-accent-500">Responsable del informe</p><p className="mt-2 font-display text-lg font-bold">{report.signature.perito}</p><p className="text-sm text-ink-300">{report.signature.taller}</p><p className="mt-2 text-xs text-ink-500">Emitido el {report.signature.fecha}</p></div><Logo className="h-12 w-auto" /></div></Reveal>}
      <Reveal><div className="glass-panel rounded-3xl p-9 text-center"><p className="text-overline text-accent-500">Siguiente paso</p><h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-extrabold">Revisa la unidad con un asesor</h2><Link href={booking} className="btn-base btn-primary mt-7">Agendar una visita <ArrowRightIcon className="h-4 w-4" /></Link></div></Reveal>
    </div>
  </main>;
}

function ModuleSection({ definition }: { definition: Definition }) {
  const module = definition.module; if (!module) return null;
  const image = module.informeImagen as ReportImage | undefined;
  return <Reveal as="section" id={definition.id} className="scroll-mt-28"><Heading index={definition.index} overline={definition.overline} title={definition.title} />
    <div className={`grid gap-5 ${definition.groups.length > 1 ? "md:grid-cols-2" : ""}`}>{definition.groups.map((group, index) => {
      const rows = group.rows.filter(([, key]) => datum(module[key] as InspectionDatum));
      const observation = group.observationKey ? display(module[group.observationKey] as InspectionDatum) : null;
      if (!rows.length && !observation) return null;
      return <div key={group.title ?? index} className="glass-panel rounded-2xl p-6">{group.title && <h3 className="mb-4 font-display text-lg font-bold">{group.title}</h3>}<dl>{rows.map(([label, key]) => <Line key={key} label={label} datumValue={module[key] as InspectionDatum} />)}</dl>{observation && <Observation text={observation} />}</div>;
    })}</div>
    {image?.url && <figure className="mt-5 overflow-hidden rounded-3xl border border-white/10"><div className="relative aspect-[16/8]"><Image src={image.url} alt={image.caption ?? "Informe OBD2"} fill sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /><figcaption className="absolute bottom-0 p-6 text-sm">{image.caption}</figcaption></div></figure>}
  </Reveal>;
}
function Line({ label, datumValue }: { label: string; datumValue?: InspectionDatum }) { const value = datum(datumValue); if (!value) return null; return <div className="grid gap-1 border-b border-white/10 py-3.5 first:pt-0 last:border-0 last:pb-0 sm:grid-cols-[.8fr_1.2fr] sm:gap-6"><dt className="text-xs uppercase tracking-[.13em] text-ink-400">{label}</dt><dd className="text-sm font-medium text-white sm:text-right md:text-base">{value.value}{value.observation && <span className="mt-1 block text-xs font-light text-amber-300">{value.observation}</span>}</dd></div>; }
function Heading({ index, overline, title }: { index?: string; overline: string; title: string }) { return <div className="mb-8"><div className="flex items-center gap-3">{index && <span className="font-display text-sm font-bold text-accent-500">{index}</span>}<span className="h-px w-8 bg-accent-600" /><span className="text-overline text-ink-400">{overline}</span></div><h2 className="mt-3 max-w-4xl font-display text-2xl font-extrabold tracking-tight md:text-4xl">{title}</h2></div>; }
function Observation({ text }: { text: string }) { return <div className="mt-5 border-l-2 border-accent-500 bg-accent-500/[.06] px-4 py-3"><p className="text-overline text-accent-400">Observaciones</p><p className="mt-1 text-sm font-light text-ink-200">{text}</p></div>; }
function datum(value?: InspectionDatum): { value?: string; observation?: string } | null { if (value === undefined || value === null) return null; if (typeof value === "object") { const main = display(value.value); const observation = display(value.observation); return main || observation ? { value: main ?? undefined, observation: observation ?? undefined } : null; } const main = display(value); return main ? { value: main } : null; }
function display(value?: InspectionDatum): string | null { if (typeof value === "boolean") return value ? "Sí" : "No"; if (typeof value === "number") return Number.isFinite(value) ? String(value) : null; return typeof value === "string" && validText(value) ? value.trim() : null; }
function validText(value?: string): value is string { return Boolean(value?.trim() && !EMPTY.test(value.trim())); }
function unique(values: Array<string | undefined>) { return Array.from(new Set(values.filter((value): value is string => validText(value)))); }
function hasDefinitionContent(definition: Definition) { return Boolean(definition.module && definition.groups.some(group => group.rows.some(([, key]) => datum(definition.module?.[key] as InspectionDatum)) || (group.observationKey && display(definition.module?.[group.observationKey] as InspectionDatum)))); }
