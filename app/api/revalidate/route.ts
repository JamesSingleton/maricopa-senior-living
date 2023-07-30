import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { SIGNATURE_HEADER_NAME, isValidSignature } from '@sanity/webhook'

const secret = `${process.env.SANITY_WEBHOOK_SECRET}`

export async function POST(request: NextRequest) {
  const res = await request.json()

  const headersList = headers()

  const signature = `${headersList.get(SIGNATURE_HEADER_NAME)}`
  const isValid = isValidSignature(JSON.stringify(res), signature, secret)

  console.log(`===== Is the webhook request valid? ${isValid}`)

  if (!isValid) {
    NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 })
    return
  }

  console.log('===== Webhook request body', JSON.stringify(res, null, 2))

  if (res._type === 'service') {
    console.log('===== Service type updated')
    revalidatePath('/')
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
