import assert from "node:assert/strict";
import {
  classifyVehicleAvailability,
  parseVehiclePrice,
} from "../lib/vehicle-availability";

const baseVehicle = {
  slug: "auto-prueba-2026",
  title: "AUTO PRUEBA 2026",
  description: "Impecable estado",
  categories: ["Activo", "SUV"],
};

assert.deepEqual(classifyVehicleAvailability({ ...baseVehicle, price: "15.980.000" }), {
  status: "available",
  reason: "numeric-price",
});
assert.deepEqual(classifyVehicleAvailability({ ...baseVehicle, price: "EXHIBICIÓN" }), {
  status: "sold",
  reason: "non-numeric-price",
});
assert.deepEqual(classifyVehicleAvailability({ ...baseVehicle, price: "Consultar" }), {
  status: "available",
  reason: "consult-price",
});
assert.deepEqual(classifyVehicleAvailability({ ...baseVehicle, price: "Consultar precio" }), {
  status: "available",
  reason: "consult-price",
});
assert.equal(parseVehiclePrice("EXHIBICIÓN").text, "EXHIBICIÓN");

for (const price of [undefined, "", "   "]) {
  assert.equal(
    classifyVehicleAvailability({ ...baseVehicle, price }).status,
    "sold",
  );
}
for (const price of ["0", "$0", "0.000"]) {
  assert.equal(
    classifyVehicleAvailability({ ...baseVehicle, price }).reason,
    "zero-price",
  );
}

assert.equal(
  classifyVehicleAvailability({
    ...baseVehicle,
    price: "12.500.000",
    description: "Vendido a cliente",
  }).status,
  "available",
);
assert.equal(
  classifyVehicleAvailability({
    ...baseVehicle,
    price: "EXHIBICIÓN",
    categories: ["No disponible"],
  }).status,
  "sold",
);

console.log("vehicle-availability: 14 casos verificados");
