import 'dotenv/config';
import axios from 'axios';
import cors from 'cors'
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500', // Allow requests from this origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.static('client'));

app.post('/api/query', async (req, res) => {
    const { feature, input } = req.body;
    const API_KEY = process.env.API_KEY;
    const API_URL = process.env.ENDPOINT;

    const featurePrompts = {
        textGeneration: "You are a creative text generation assistant. When a user provides a prompt or topic, generate creative and contextually relevant text in response. But make sure you're short and concise also use plain simple words (sound like a human)",
        textSummarization: "You are a text summarization assistant. When a user inputs a lengthy document, article, or text, provide a concise and clear summary. But make sure you're short and concise also use plain simple words (sound like a human)",
        languageTranslation: "You are a language translation assistant. When a user provides text in one language, translate it accurately into another language. But make sure you're short and concise also use plain simple words (sound like a human)"
    };

    const prompt = featurePrompts[feature] + `\nUser input: "${input}"`;

    try {
        const response = await axios.post(API_URL, {
            message: prompt,
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        res.json({ text: response.data.text });
    } catch (error) {
        console.error('Error making API request:', error);
        res.status(500).json({ text: 'Error processing request.' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
