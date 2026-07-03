"use client";

import { Button } from "@maricopa-senior-living/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button type="button" onClick={() => router.back()}>
      <ArrowLeft data-icon="inline-start" />
      Go Back
    </Button>
  );
}
