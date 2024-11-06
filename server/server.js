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

const transporter = nodemailer.createTransport({
    host: "smtp.ionos.fr", // Serveur SMTP de IONOS
    port: 587, // Port SMTP
    secure: false, // true pour 465, false pour d'autres ports
    auth: {
        user: "sae501@quentinbrandy.fr", // Adresse e-mail IONOS
        pass: "Cw*d1S9kHKxyXNPerfb", // Mot de passe
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

function isImageFile(file) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
    return imageExtensions.includes(path.extname(file).toLowerCase());
}

app.post('/watch', upload.single('archive'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const allowedExtensions = ['.zip', '.rar', '.7z'];
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).send('Invalid file type. Only ZIP, RAR, and 7z files are allowed.');
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
        .on('close', async () => {
            const directories = fs.readdirSync(newDirectoryPath).filter(file => fs.statSync(path.join(newDirectoryPath, file)).isDirectory());
            console.log(directories)
            const requiredDirectories = ['img', 'json' , 'assets'];

            const missingDirectories = requiredDirectories.filter(dir => !directories.includes(dir));
            const extraDirectories = directories.filter(dir => !requiredDirectories.includes(dir));

            if (missingDirectories.length > 0) {
                fs.rmSync(newDirectoryPath, { recursive: true, force: true });
                return res.status(400).send(`The archive is missing required directories: ${missingDirectories.join(', ')}`);
            }

            if (extraDirectories.length > 0) {
                fs.rmSync(newDirectoryPath, { recursive: true, force: true });
                return res.status(400).send(`The archive contains extra directories: ${extraDirectories.join(', ')}`);
            }

            const imgPath = path.join(newDirectoryPath, 'img');
            const jsonPath = path.join(newDirectoryPath, 'json');

            const vrJsonPath = path.join(jsonPath, 'VR.json');

            if (!fs.existsSync(vrJsonPath)) {
                fs.rmSync(newDirectoryPath, { recursive: true, force: true });
                return res.status(400).send('Missing VR.json file in json directory.');
            }

            const jsonFiles = fs.readdirSync(jsonPath);
            if (jsonFiles.length !== 1 || jsonFiles[0] !== 'VR.json') {
                fs.rmSync(newDirectoryPath, { recursive: true, force: true });
                return res.status(400).send('The json directory must contain only one file named VR.json.');
            }

            const imgFiles = fs.readdirSync(imgPath);
            if (!imgFiles.every(isImageFile)) {
                fs.rmSync(newDirectoryPath, { recursive: true, force: true });
                return res.status(400).send('The img directory contains non-image files.');
            }

            fs.renameSync(imgPath, path.join(assetsPath, 'img'));
            fs.renameSync(jsonPath, path.join(assetsPath, 'json'));

            copyRecursiveSync(directoryPath, newDirectoryPath);

            fs.unlinkSync(archivePath);
            const responseUrl = `http://127.0.0.1:5500/${newDirectoryName}/src/index.html`;
            console.log('URL générée:', responseUrl);

            if (!req.body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
                console.error('Invalid or missing email address');
                res.json({ url: responseUrl });
            } else {
                const mailOptions = {
                    from: 'sae501@quentinbrandy.fr',
                    to: req.body.email,
                    subject: 'Fichier reçu',
                    text: `Votre fichier a été reçu avec succès. Vous pouvez le consulter à l'adresse suivante : ${responseUrl}`,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('E-mail envoyé');
                    res.json({ url: responseUrl });
                } catch (error) {
                    console.error('Erreur lors de l\'envoi de l\'email:', error);
                    res.status(500).send('Erreur lors de l\'envoi de l\'email');
                }
            }
        })
        .on('error', (err) => {
            fs.rmSync(newDirectoryPath, { recursive: true, force: true });
            res.status(500).send(`Error extracting files: ${err.message}`);
        });
});

app.get("/watch", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
