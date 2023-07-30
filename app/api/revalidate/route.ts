import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

import type { NextApiRequest, NextApiResponse } from 'next'

const secret = `${process.env.SANITY_WEBHOOK_SECRET}`

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { isValidSignature, body } = await parseBody(request, secret)

    if (!isValidSignature) {
      NextResponse.json({
        success: false,
        message: 'Invalid signature',
      }, {
        status: 401,
      })

      return
    }

    console.log(`===== Received webhook =====`)
    console.log(JSON.stringify(body, null, 2))

    if (body._type === 'service') {
      revalidatePath('/')
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
