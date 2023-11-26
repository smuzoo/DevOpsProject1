const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const { readFile } = require('fs').promises;

const port = process.env.PORT || 8080;

const mongoUri = "mongodb+srv://anyviolent:OeTzE3VvEYwAlVWG@cluster0.2qwyeev.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function startServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        app.use(express.json());

        app.get('/', async (request, response) => {
            try {
                response.send(await readFile('./src/home.html', 'utf8'));
            } catch (error) {
                console.error('Error reading HTML file:', error);
                response.status(500).send('Internal Server Error');
            }
        });

        app.get('/data', async (request, response) => {
            try {
                const db = client.db('FirstDB');
                const collection = db.collection('FirstCollection');
                const data = await collection.find().toArray();
                response.json(data);
            } catch (error) {
                console.error('Error fetching data from MongoDB:', error);
                response.status(500).send('Internal Server Error');
            }
        });

        app.post('/data', async (request, response) => {
            try {
                const db = client.db('FirstDB');
                const collection = db.collection('FirstCollection');
                const { message } = request.body;
                await collection.insertOne({ message });
                response.status(200).send('Data added to MongoDB');
            } catch (error) {
                console.error('Error adding data to MongoDB:', error);
                response.status(500).send('Internal Server Error');
            }
        });

        app.listen(port, '0.0.0.0', () => console.log(`App available at http://localhost:5000`));
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

console.log('Приложение запущено');
startServer();
