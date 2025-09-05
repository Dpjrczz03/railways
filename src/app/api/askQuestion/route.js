import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const requestBody = await request.json();
        console.log('Request Body:', requestBody);

        const response = await axios.post('https://generate-text-strict-1023375960426.asia-south1.run.app/generate_response', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Response Data:', response.data);
        //return response.data;
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error in API Proxy:', error);

        // Handle Axios specific errors
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.toJSON());
        }

        return NextResponse.json({ error: 'Failed to fetch data from the external API' }, { status: 500 });
    }
}