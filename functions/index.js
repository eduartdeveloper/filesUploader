const functions = require('firebase-functions');
const admin = require('firebase-admin');
const unzipper = require('unzipper');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const os = require('os');
const fs = require('fs');
const cors = require("cors")({ origin: true });

admin.initializeApp();
const storage = new Storage();



exports.unzipFile = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const filePath = req.body.filePath;
            if (!filePath) {
                res.status(400).send('Missing filePath in request body');
                return;
            }

            const bucketName = 'archivos-c36e0.appspot.com'; // Reemplaza con el nombre de tu bucket
            const bucket = storage.bucket(bucketName);
            const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));

            // Descargar archivo desde storage a un directorio temporal
            await bucket.file(filePath).download({ destination: tempFilePath });

            const fileStream = fs.createReadStream(tempFilePath);
            const files = [];
            let urls = [];

            // Descomprimir el archivo
            fileStream.pipe(unzipper.Parse())
                .on('entry', async entry => {
                    const fileName = entry.path;
                    const fileType = entry.type; // 'Directory' or 'File'
                    if (fileType === 'File') {
                        const tempFileOutputPath = path.join(os.tmpdir(), fileName);
                        entry.pipe(fs.createWriteStream(tempFileOutputPath))
                            .on('finish', async () => {
                                // Subir archivo extraído de nuevo a storage
                                const newFilePath = `extracted/${fileName}`;
                                await bucket.upload(tempFileOutputPath, { destination: newFilePath });
                                files.push(newFilePath);

                                // Limpiar archivo temporal
                                fs.unlinkSync(tempFileOutputPath);
                                // Generar URLs para los archivos
                                urls.push( await Promise.all(files.map(async file => {
                                    const [lsUrl] = await bucket.file(file).getSignedUrl({
                                        action: 'read',
                                        expires: '03-01-2500'
                                    });
                                    return lsUrl;
                                })));

                                res.status(200).send({ files: files, urls: urls });
                                // Enviar respuesta con lista de URLs
                                
                            });
                    } else {
                        entry.autodrain();
                    }
                })
                .on('close', async () => {
                })
                .on('error', err => {
                    console.error(err);
                    res.status(500).send('Error unzipping file');
                });

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
});
