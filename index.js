const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB (Replace 'your_mongo_connection_string' with your actual MongoDB connection string)
mongoose.connect('mongodb+srv://2099akshat:092005Akm@cluster0.r3tdz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Define the schema and model for storing emails
const emailSchema = new mongoose.Schema({
    email: { type: String, unique: true }
});

const Email = mongoose.model('Email', emailSchema);

// Handle the form submission
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        console.log('Received request with missing email');
        return res.status(400).send('Email is required');
    }

    try {
        console.log(`Checking if email ${email} already exists`);
        const existingEmail = await Email.findOne({ email });
        if (existingEmail) {
            console.log(`Email ${email} is already registered`);
            return res.status(400).send('This email is already registered.');
        }

        console.log(`Registering new email: ${email}`);
        const newEmail = new Email({ email });
        await newEmail.save();
        console.log(`Email ${email} registered successfully`);
        res.status(201).send('Registration Successful!');
    } catch (error) {
        console.error('Error during email registration:', error);
        res.status(500).send('Server error');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
