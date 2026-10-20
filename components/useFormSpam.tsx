"use client";

import { useId, useState } from "react";

export function useFormSpam() {
  const fieldId = useId();
  const [startedAt] = useState(() => Date.now());
  const [website, setWebsite] = useState("");

  return {
    spam: { startedAt, website },
    field: (
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={fieldId}>Sitio web</label>
        <input
          id={fieldId}
          name="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
    ),
  };
}
