import axios from 'axios';


const SynthesizeSpeech = async (text) => {
    try {
        // Replace the endpoint with your TTS service URL
        const response = await axios.post(
            '/api/synthesizeSpeech',
            { text },
            { responseType: 'blob' }
        );

        const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Play the audio
        const audio = new Audio(audioUrl);
        audio.play();

        audio.onended = () => {
            console.log('Finished playing audio for:', text);
        };

        audio.onerror = (err) => {
            console.error('Error playing audio:', err);
        };
    } catch (error) {
        console.error('Error synthesizing speech:', error);
    }
};

export default SynthesizeSpeech;
