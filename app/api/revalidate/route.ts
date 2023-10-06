import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody(req, process.env.SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      const message = 'Invalid Signature'

      return new Response(JSON.stringify({ message, isValidSignature, body }), { status: 401 })
    }

    if (!body?._type) {
      const message = 'Bad Request, missing type'
      return new Response(JSON.stringify({ message, body }), { status: 400 })
    }

    revalidateTag(body._type)
    if (body.slug) {
      revalidateTag(`${body._type}:${body.slug}`)
    }

    return NextResponse.json({ body })
  } catch (error: any) {
    console.error(error)

    return new Response(error?.message, { status: 500 })
  }
}
