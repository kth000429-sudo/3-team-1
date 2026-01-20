import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Since we are implementing this on the frontend for now
});
