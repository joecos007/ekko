import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, message } = body

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Simulate processing delay (e.g. sending email via Resend/SendGrid)
        await new Promise(resolve => setTimeout(resolve, 1000))

        // In a real app, you would send the email here
        console.log(`[Contact Form] Received message from ${email}: ${message}`)

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
