"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@maricopa-senior-living/ui/components/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Go back
    </Button>
  );
}
