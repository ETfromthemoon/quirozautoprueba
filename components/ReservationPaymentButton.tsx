"use client";

import { useEffect, useState } from "react";

const RESERVA_PAGO_URL = "https://www.webpay.cl/form-pay/412455";
// Activación única: 25 horas desde el 19 de agosto de 2026 a las 15:35:21 (-04:00).
const RESERVA_PAGO_ACTIVATES_AT = Date.parse("2026-08-20T16:35:21-04:00");

type Props = {
  className: string;
  label: string;
};

export default function ReservationPaymentButton({ className, label }: Props) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const activate = () => setIsActive(Date.now() >= RESERVA_PAGO_ACTIVATES_AT);
    const remaining = RESERVA_PAGO_ACTIVATES_AT - Date.now();

    activate();
    if (remaining <= 0) return;

    const timer = window.setTimeout(activate, remaining);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isActive) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="El pago de reserva estará disponible próximamente"
        className={`${className} opacity-60 cursor-not-allowed`}
      >
        <span>{label}</span>
      </button>
    );
  }

  return (
    <a
      href={RESERVA_PAGO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <span>{label}</span>
    </a>
  );
}
