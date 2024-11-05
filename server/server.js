const express = require('express');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const multer = require('multer'); // Import multer

const app = express();
const PORT = 3000;

// Utilise CORS pour toutes les routes
app.use(cors());

// Configuration de multer pour gérer le fichier ZIP uploadé
const upload = multer({ dest: 'uploads/' });

app.post('/watch', upload.single('archive'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const newDirectoryName = `Vfinal_${uuidv4()}`;
    const newDirectoryPath = path.join(__dirname, newDirectoryName);
    const assetsPath = path.join(newDirectoryPath, 'assets');

    // Crée les répertoires nécessaires
    fs.mkdirSync(newDirectoryPath);
    fs.mkdirSync(assetsPath);

    // Chemin de l'archive uploadée
    const archivePath = req.file.path;

    // Décompression de l'archive
    fs.createReadStream(archivePath)
        .pipe(unzipper.Extract({ path: newDirectoryPath }))
        .on('close', () => {
            // Déplace les dossiers img et json dans assets
            const imgPath = path.join(newDirectoryPath, 'img');
            const jsonPath = path.join(newDirectoryPath, 'json');

            if (fs.existsSync(imgPath)) {
                fs.renameSync(imgPath, path.join(assetsPath, 'img'));
            }

            if (fs.existsSync(jsonPath)) {
                fs.renameSync(jsonPath, path.join(assetsPath, 'json'));
            }

            // Supprime le fichier temporaire une fois terminé
            fs.unlinkSync(archivePath);

            res.send(`Files extracted to ${newDirectoryPath}`);
        })
        .on('error', (err) => {
            res.status(500).send(`Error extracting files: ${err.message}`);
        });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
