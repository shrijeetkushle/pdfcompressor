const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// Route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Access the file path
    const filePath = req.file.path;
    console.log('File path:', filePath);

    // Further processing for the PDF compression can go here

    res.send(`File uploaded successfully. Access it at /?file=${req.file.filename}`);
});

// Route to serve uploaded files
app.get('/', (req, res) => {
    const fileName = req.query.file;

    if (!fileName) {
        return res.status(400).send('File parameter is missing.');
    }

    const filePath = path.join(__dirname, 'uploads', fileName);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File not found:', filePath);
            return res.status(404).send('File not found.');
        }

        // Send the file
        res.sendFile(filePath);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
