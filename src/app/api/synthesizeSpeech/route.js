import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const requestBody = await request.json();
        console.log('Request Body:', requestBody);

        // Sending the request to the TTS API
        const response = await axios.post('https://text-to-speech-1023375960426.asia-south1.run.app/synthesize', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer', // Use arraybuffer to handle audio data
        });

        console.log('TTS Response Received');

        // Constructing a Next.js response with the audio data
        return new Response(response.data, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="speech.mp3"',
            },
        });
    } catch (error) {
        console.error('Error in TTS API Proxy:', error);

        // Handle Axios specific errors
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.toJSON());
        }

        return NextResponse.json({ error: 'Failed to fetch data from the TTS API' }, { status: 500 });
    }
}
