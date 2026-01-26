// src/app/[locale]/speaking/page.tsx
import { Suspense } from "react";
import SpeakingClient from "./speaking-client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SpeakingClient />
    </Suspense>
  );
}
