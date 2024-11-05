const express = require('express');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(cors());

// Configuration de multer pour gérer le fichier ZIP uploadé
const upload = multer({ dest: 'uploads/' });


require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER, // Serveur SMTP de IONOS
    port: process.env.SMTP_PORT, // Port SMTP
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour d'autres ports
    auth: {
        user: process.env.SMTP_USERNAME, // Adresse e-mail IONOS
        pass: process.env.SMTP_PASSWORD, // Mot de passe
    },
});

// Fonction pour copier des dossiers et fichiers de manière récursive
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true, mode: 0o777 });
        fs.readdirSync(src).forEach(child => {
            copyRecursiveSync(path.join(src, child), path.join(dest, child));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

app.post('/watch', upload.single('archive'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const directoryPath = path.join(__dirname, '..', 'Vfinal');
    const newDirectoryName = `${uuidv4()}`;
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
        .on('close', async () => { // Utilisation de async ici
            // Déplace les dossiers img et json dans assets
            const imgPath = path.join(newDirectoryPath, 'img');
            const jsonPath = path.join(newDirectoryPath, 'json');

            if (fs.existsSync(imgPath)) {
                fs.renameSync(imgPath, path.join(assetsPath, 'img'));
            }

            if (fs.existsSync(jsonPath)) {
                fs.renameSync(jsonPath, path.join(assetsPath, 'json'));
            }

            // Copie tous les fichiers de Vfinal dans le nouveau dossier
            copyRecursiveSync(directoryPath, newDirectoryPath);

            // Supprime le fichier temporaire une fois terminé
            fs.unlinkSync(archivePath);
            const responseUrl = `http://127.0.0.1:5500/${newDirectoryName}/src/index.html`;
            console.log('URL générée:', responseUrl);
            
            // Envoi de l'e-mail
            const mailOptions = {
                from: 'sae501@quentinbrandy.fr', // Remplacez par votre adresse e-mail IONOS
                to: req.body.email, // Utilise l'email du formulaire
                subject: 'Fichier reçu',
                text: `Votre fichier a été reçu avec succès. Vous pouvez le consulter à l'adresse suivante : ${responseUrl}`,
            };

            try {
                await transporter.sendMail(mailOptions); // Attendre l'envoi de l'e-mail
                console.log('E-mail envoyé');
                res.json({ url: responseUrl });
            } catch (error) {
                console.error('Erreur lors de l\'envoi de l\'email:', error);
                res.status(500).send('Erreur lors de l\'envoi de l\'email');
            }
        })
        .on('error', (err) => {
            res.status(500).send(`Error extracting files: ${err.message}`);
        });
});

app.get("/watch" , (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
