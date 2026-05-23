export type EngineSpecs = {
  displacement?: string;     // "2.0L"
  cylinders?: number;        // 4
  consumptionCity?: string;  // "8.5 L/100km"
  consumptionRoad?: string;  // "6.2 L/100km"
  emissions?: string;        // "Euro 6"
};

export type Documentation = {
  ownerType?: string;        // "Único dueño"
  permit?: string;           // "Vigente hasta 2026"
  technicalReview?: string;  // "Al día"
  color?: string;            // "Negro Carbono"
  doors?: number;            // 4
  seats?: number;            // 5
  vin?: string;              // optional
};

export type Car = {
  id: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: string;
  priceNumeric: number;
  km: string;
  fuel: string;
  transmission: string;
  drivetrain?: string;
  power?: string;
  bodyType: string;
  image: string;
  gallery?: string[];        // imágenes adicionales
  videoUrl?: string;         // YouTube watch/embed URL
  tagline: string;
  badge?: "Nuevo" | "Destacado" | "Bajo Pedido" | "Edición Especial";
  description: string;
  // Extended technical sheet
  engine?: EngineSpecs;
  equipment?: string[];      // ["Aire acondicionado", "Cámara retroceso", ...]
  documentation?: Documentation;
};

export const cars: Car[] = [
  {
    id: "bmw-420-coupe-2024",
    brand: "BMW",
    model: "420",
    variant: "Grand Coupé M Design",
    year: 2024,
    price: "$40.980.000",
    priceNumeric: 40980000,
    km: "20.600",
    fuel: "Bencina",
    transmission: "Automático",
    drivetrain: "RWD",
    power: "184 HP",
    bodyType: "Coupé",
    image: "https://images.unsplash.com/photo-1570356528233-b442cf2de345?w=2400&q=90",
    videoUrl: "https://www.youtube.com/embed/N7vlsZbQ-jU",
    tagline: "Elegancia en movimiento",
    badge: "Destacado",
    description:
      "Una declaración de estilo y rendimiento. El Grand Coupé M Design combina la exclusividad de un cupé con la versatilidad de cuatro puertas.",
    engine: {
      displacement: "2.0L Turbo",
      cylinders: 4,
      consumptionCity: "8.5 L/100km",
      consumptionRoad: "5.8 L/100km",
      emissions: "Euro 6d",
    },
    equipment: [
      "Climatizador automático bi-zona",
      "Asientos deportivos M Sport",
      "Pantalla iDrive 10.25\"",
      "Carga inalámbrica",
      "Apple CarPlay y Android Auto",
      "Llantas aleación 18\"",
      "Cámara de retroceso HD",
      "Sensores de estacionamiento",
      "Faros LED adaptativos",
      "Modo Sport / Eco / Confort",
    ],
    documentation: {
      ownerType: "Único dueño",
      permit: "Vigente",
      technicalReview: "Al día",
      color: "Negro Carbón Metálico",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "bmw-x4-2021",
    brand: "BMW",
    model: "X4",
    variant: "D 2.0 xDrive",
    year: 2021,
    price: "$35.980.000",
    priceNumeric: 35980000,
    km: "115.000",
    fuel: "Diésel",
    transmission: "Automático",
    drivetrain: "AWD",
    power: "190 HP",
    bodyType: "SUV Coupé",
    image: "https://images.unsplash.com/photo-1739519308619-69fe64960696?w=2400&q=90",
    videoUrl: "https://www.youtube.com/embed/lJDcOmIvE_M",
    tagline: "Presencia atlética",
    description:
      "El SUV coupé que redefine la silueta. Tracción integral xDrive, postura agresiva y eficiencia diésel para cada terreno.",
    engine: {
      displacement: "2.0L TwinPower Turbo Diesel",
      cylinders: 4,
      consumptionCity: "7.8 L/100km",
      consumptionRoad: "5.5 L/100km",
      emissions: "Euro 6",
    },
    equipment: [
      "Tracción integral xDrive",
      "Suspensión adaptativa M Sport",
      "Pantalla flotante 10.25\"",
      "Apple CarPlay inalámbrico",
      "Asientos calefactables",
      "Techo panorámico",
      "Llantas M Sport 19\"",
      "Cámara 360°",
      "Head-up display",
    ],
    documentation: {
      ownerType: "Segundo dueño",
      permit: "Vigente",
      technicalReview: "Al día",
      color: "Gris Mineral",
      doors: 5,
      seats: 5,
    },
  },
  {
    id: "ford-edge-st-2023",
    brand: "Ford",
    model: "Edge",
    variant: "ST 2.7 EcoBoost",
    year: 2023,
    price: "$27.980.000",
    priceNumeric: 27980000,
    km: "35.000",
    fuel: "Bencina",
    transmission: "Automático",
    drivetrain: "AWD",
    power: "335 HP",
    bodyType: "SUV Performance",
    image: "https://images.unsplash.com/photo-1672690536198-cf2ec44b73b6?w=2400&q=90",
    videoUrl: "https://www.youtube.com/embed/_eOdpIRsHzs",
    tagline: "Adrenalina americana",
    badge: "Edición Especial",
    description:
      "Ford Performance ingeniería. V6 biturbo de 335 caballos, tracción inteligente y un carácter inconfundible.",
    engine: {
      displacement: "2.7L V6 EcoBoost Biturbo",
      cylinders: 6,
      consumptionCity: "12.5 L/100km",
      consumptionRoad: "8.9 L/100km",
      emissions: "Tier 3",
    },
    equipment: [
      "Suspensión deportiva ST",
      "Modo Sport+ exclusivo",
      "SYNC 4 con pantalla 12\"",
      "Sistema de sonido B&O Premium 12 parlantes",
      "Asientos cuero deportivos calefactables/ventilados",
      "Llantas aleación negras 21\"",
      "Frenos performance",
      "Volante deportivo aplomado",
      "Insignia ST exterior",
    ],
    documentation: {
      ownerType: "Único dueño",
      permit: "Vigente",
      technicalReview: "Al día",
      color: "Azul Atlas",
      doors: 5,
      seats: 5,
    },
  },
  {
    id: "chevrolet-colorado-2022",
    brand: "Chevrolet",
    model: "Colorado",
    variant: "High Country 4WD",
    year: 2022,
    price: "$24.980.000",
    priceNumeric: 24980000,
    km: "51.000",
    fuel: "Diésel",
    transmission: "Automático",
    drivetrain: "4WD",
    power: "200 HP",
    bodyType: "Pickup",
    image: "https://images.unsplash.com/photo-1726762764087-b9e9b28008c3?w=2400&q=90",
    tagline: "Sin límites",
    description:
      "La pickup premium que combina trabajo y lujo. Acabados High Country, tecnología completa y capacidad 4WD.",
    engine: {
      displacement: "2.8L Duramax Turbo Diesel",
      cylinders: 4,
      consumptionCity: "10.2 L/100km",
      consumptionRoad: "7.5 L/100km",
      emissions: "Euro 5",
    },
    equipment: [
      "Tracción 4WD con bloqueo diferencial",
      "Cabina doble cuero perforado",
      "Asientos calefactables y eléctricos",
      "Pantalla MyLink 8\"",
      "Cámara con visión 360°",
      "Llantas cromadas 18\"",
      "Pisadera lateral",
      "Pluma cubre carga eléctrica",
      "Sensores delanteros y traseros",
    ],
    documentation: {
      ownerType: "Único dueño",
      permit: "Vigente",
      technicalReview: "Al día",
      color: "Blanco Summit",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "jaecoo-7-2025",
    brand: "Jaecoo",
    model: "7",
    variant: "Prime 1.6T",
    year: 2025,
    price: "$17.180.000",
    priceNumeric: 17180000,
    km: "17.600",
    fuel: "Bencina",
    transmission: "Automático",
    drivetrain: "FWD",
    power: "186 HP",
    bodyType: "SUV Premium",
    image: "https://images.unsplash.com/photo-1765446826359-4d563ec8d10a?w=2400&q=90",
    tagline: "Nueva era SUV",
    badge: "Nuevo",
    description:
      "Diseño escultórico, interior de cuero y la última generación turbo. Un SUV que reescribe las reglas.",
    engine: {
      displacement: "1.6L Turbo TGDI",
      cylinders: 4,
      consumptionCity: "9.0 L/100km",
      consumptionRoad: "6.3 L/100km",
      emissions: "Euro 6",
    },
    equipment: [
      "Pantalla central flotante 14.8\"",
      "Asientos cuero ventilados",
      "Techo panorámico eléctrico",
      "Sound Sony 8 parlantes",
      "Carga inalámbrica con ventilación",
      "Apple CarPlay y Android Auto inalámbrico",
      "Llantas aleación 19\" diamante",
      "Volante calefactable",
      "Sensor de huella en columna",
    ],
    documentation: {
      ownerType: "Único dueño",
      permit: "Vigente 2026",
      technicalReview: "Sin requerir",
      color: "Negro Aurora",
      doors: 5,
      seats: 5,
    },
  },
  {
    id: "ssangyong-korando-2024",
    brand: "SsangYong",
    model: "Korando",
    variant: "New 1.6 Diesel",
    year: 2024,
    price: "$16.980.000",
    priceNumeric: 16980000,
    km: "14.900",
    fuel: "Diésel",
    transmission: "Automático",
    drivetrain: "FWD",
    power: "136 HP",
    bodyType: "SUV",
    image: "https://images.unsplash.com/photo-1773096222232-d88bed5c1c1c?w=2400&q=90",
    tagline: "Equilibrio coreano",
    description:
      "Diseño contemporáneo y refinamiento europeo. Eficiencia diésel y tecnología de seguridad activa de serie.",
    engine: {
      displacement: "1.6L Diesel TDI",
      cylinders: 4,
      consumptionCity: "6.5 L/100km",
      consumptionRoad: "4.8 L/100km",
      emissions: "Euro 6",
    },
    equipment: [
      "Pantalla 9\" infoentretenimiento",
      "Asientos tela premium",
      "Climatizador automático",
      "Apple CarPlay y Android Auto",
      "Cámara retroceso",
      "Sensores delanteros y traseros",
      "Llantas aleación 18\"",
      "Llave inteligente",
      "Encendido por botón",
    ],
    documentation: {
      ownerType: "Único dueño",
      permit: "Vigente",
      technicalReview: "Al día",
      color: "Blanco Pearl",
      doors: 5,
      seats: 5,
    },
  },
  {
    id: "ford-ranger-2021",
    brand: "Ford",
    model: "Ranger",
    variant: "XLT 2.5 Bencina",
    year: 2021,
    price: "$16.180.000",
    priceNumeric: 16180000,
    km: "101.300",
    fuel: "Bencina",
    transmission: "Manual",
    drivetrain: "4x2",
    power: "166 HP",
    bodyType: "Pickup",
    image: "https://images.unsplash.com/photo-1700943937372-12c2611b5af8?w=2400&q=90",
    tagline: "Resistencia legendaria",
    description:
      "La pickup más confiable de su clase. Robustez probada, capacidad de carga superior y eficiencia probada.",
    engine: {
      displacement: "2.5L Duratec",
      cylinders: 4,
      consumptionCity: "11.5 L/100km",
      consumptionRoad: "8.2 L/100km",
      emissions: "Euro 5",
    },
    equipment: [
      "Tracción trasera con diferencial",
      "Cabina doble",
      "Pantalla SYNC 3 8\"",
      "Aire acondicionado",
      "Bluetooth y USB",
      "Cámara de retroceso",
      "Llantas aleación 17\"",
      "Volante con controles",
      "Sensores traseros",
    ],
    documentation: {
      ownerType: "Segundo dueño",
      permit: "Vigente",
      technicalReview: "Al día",
      color: "Gris Plata",
      doors: 4,
      seats: 5,
    },
  },
  {
    id: "peugeot-3008-2022",
    brand: "Peugeot",
    model: "3008",
    variant: "Blue HDI 130",
    year: 2022,
    price: "$15.870.000",
    priceNumeric: 15870000,
    km: "49.000",
    fuel: "Diésel",
    transmission: "Manual",
    drivetrain: "FWD",
    power: "130 HP",
    bodyType: "SUV Crossover",
    image: "https://images.unsplash.com/photo-1566421740474-8456c6840c71?w=2400&q=90",
    tagline: "Audacia francesa",
    description:
      "i-Cockpit revolucionario, líneas afiladas y eficiencia diésel europea. Un crossover con personalidad inconfundible.",
    engine: {
      displacement: "1.5L BlueHDi Diesel",
      cylinders: 4,
      consumptionCity: "5.8 L/100km",
      consumptionRoad: "4.2 L/100km",
      emissions: "Euro 6.2",
    },
    equipment: [
      "i-Cockpit con pantalla 12\" digital",
      "Touchscreen 10\" central",
      "Asientos AGR ergonómicos",
      "Climatizador bi-zona",
      "Apple CarPlay y Android Auto",
      "Llantas diamantadas 18\"",
      "Cámara visión 180°",
      "Sensores frontales y traseros",
      "Frenado autónomo de emergencia",
    ],
    documentation: {
      ownerType: "Único dueño",
      permit: "Vigente",
      technicalReview: "Al día",
      color: "Rojo Ultimate",
      doors: 5,
      seats: 5,
    },
  },
];

export function getCarById(id: string): Car | undefined {
  return cars.find((c) => c.id === id);
}
