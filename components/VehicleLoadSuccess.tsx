"use client";

import { useEffect } from "react";

export default function VehicleLoadSuccess() {
  useEffect(() => {
    window.sessionStorage.removeItem(`vehicle-retry:${window.location.pathname}`);
  }, []);

  return null;
}
