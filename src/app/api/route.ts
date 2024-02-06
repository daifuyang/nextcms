import { type NextRequest,NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: NextRequest) {
    return new NextResponse(JSON.stringify({
        hello: 'world'
    }))
}