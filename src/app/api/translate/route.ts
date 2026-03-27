import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const LANGUAGE_MAP: Record<string, string> = {
    'hi': 'Hindi',
    'bn': 'Bengali',
    'te': 'Telugu',
    'ta': 'Tamil',
    'mr': 'Marathi',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'pa': 'Punjabi',
    'or': 'Odia',
    'as': 'Assamese',
    'ur': 'Urdu',
};

export async function POST(request: NextRequest) {
    try {
        const { text, target_language } = await request.json();

        if (!text || !target_language) {
            return NextResponse.json({ error: 'Missing text or target_language' }, { status: 400 });
        }

        if (target_language === 'en') {
            return NextResponse.json({ translated_text: text });
        }

        const langName = LANGUAGE_MAP[target_language] || target_language;

        if (!GROQ_API_KEY) {
            return NextResponse.json({ translated_text: text, error: 'No API key' }, { status: 200 });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional translator. Translate the given text to ${langName}. Return ONLY the translated text, nothing else. Do not add explanations, quotes, or formatting.`
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.3,
                max_tokens: 1024,
            }),
        });

        if (!response.ok) {
            console.error('Groq API error:', response.status, await response.text());
            return NextResponse.json({ translated_text: text });
        }

        const data = await response.json();
        const translated = data.choices?.[0]?.message?.content?.trim() || text;

        return NextResponse.json({ translated_text: translated });
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ translated_text: '' });
    }
}
