'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function BackButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.back()}>
      <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      Go Back
    </Button>
  )
}
