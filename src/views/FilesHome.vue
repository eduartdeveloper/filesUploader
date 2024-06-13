<template>
    <div>
        <Loader :isLoading="isLoading" />
        <div class="h-screen flex flex-col py-2">
            <DownloadLinks
                v-if="downloadLinks.length > 0"
                :links="downloadLinks"
                class="py-4 bg-red-500"
            />
            <UploadSection @open-modal="openModal" />
            <DownloadLinks
                v-if="downloadLinks.length > 0"
                :links="downloadLinks"
                class="py-4 bg-blue-500"
            />
        </div>
        <UploadModal
            :isModalOpen="isModalOpen"
            :fileName="fileName"
            :isDragging="isDragging"
            @file-change="handleFileChange"
            @drag-over="handleDragOver"
            @drag-leave="handleDragLeave"
            @drop="handleDrop"
            @submit="handleSubmit"
            @close="closeModal"
        />
    </div>
</template>
  
  <script>
import Loader from '@/components/BounceLoader.vue';
import DownloadLinks from '@/components/DownloadLinks.vue';
import UploadModal from '@/components/UploadModal.vue';
import UploadSection from '@/components/UploadSection.vue';

import Swal from 'sweetalert2';
import { db, storage } from '@/services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export default {
    name: 'FilesHome',
    components: {
        Loader,
        DownloadLinks,
        UploadModal,
        UploadSection,
    },
    data() {
        return {
            isModalOpen: false,
            fileName: '',
            isDragging: false,
            isLoading: false,
            file: null,
            downloadLinks: [],
        };
    },
    methods: {
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
            this.fileName = '';
        },
        handleFileChange(file) {
            if (file) {
                this.fileName = file.name;
                this.file = file;
            }
        },
        handleDragOver() {
            this.isDragging = true;
        },
        handleDragLeave() {
            this.isDragging = false;
        },
        handleDrop(file) {
            this.fileName = file.name;
            this.file = file;
            this.isDragging = false;
        },
        async generateDownloadLinks(files) {
            const downloadLinks = [];
            for (const file of files) {
                try {
                    let storageRef = ref(storage, `${file}`);
                    let ruta = await getDownloadURL(storageRef);
                    const name = file.match(/[^/]+$/)[0];
                    downloadLinks.push({ ruta, name });
                } catch (error) {
                    console.error(
                        'Error generating download link for:',
                        file,
                        error
                    );
                }
            }
            console.log(downloadLinks);
            return downloadLinks;
        },
        handleSubmit() {
            if (!this.fileName) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivo vacío',
                    text: 'Por favor, selecciona un archivo.',
                });
                return;
            }
            if (this.file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Archivo muy pesado',
                    text: 'Por favor, sube un archivo de menos de 5MB.',
                });
                return;
            }

            // todo: enviar archivoski
            this.closeModal();
            this.isLoading = true;
            // storage
            try {
                const storageRef = ref(storage, `uploads/${this.file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, this.file);

                uploadTask.on(
                    'state_changed',
                    snapshot => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    error => {
                        // error subiendo
                        console.error('Error uploading file:', error);
                        Swal.fire({
                            icon: 'warning',
                            title: 'Error',
                            text: 'No pudimpos cargar el archivo',
                        });
                        this.isLoading = false;
                    },
                    async () => {
                        // subió
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );
                        console.log('url', downloadURL);

                        // functions
                        // Llamar a la función unzipFile
                        const response = await fetch(
                            'https://us-central1-archivos-c36e0.cloudfunctions.net/unzipFile',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*',
                                },
                                body: JSON.stringify({
                                    filePath: `uploads/${this.file.name}`,
                                }),
                            }
                        );

                        if (response.ok) {
                            const result = await response.json();
                            console.log(
                                'Rutas de archivos descomprimidos:',
                                result
                            );
                            const linksHijos = await this.generateDownloadLinks(
                                result.files
                            );
                            this.downloadLinks = linksHijos;

                            // guardar en bd
                            await this.saveFileData(downloadURL, linksHijos);

                            Swal.fire({
                                icon: 'success',
                                title: 'Archivo subido',
                                text: 'Tu archivo ha sido subido exitosamente.',
                            });
                        } else {
                            console.error(
                                'Error descomprimiendo el archivo:',
                                await response.text()
                            );
                            Swal.fire({
                                icon: 'warning',
                                title: 'Error',
                                text: 'No pudimos descomprimir el archivo',
                            });
                        }
                        // functions
                        this.isLoading = false;
                    }
                );
            } catch (error) {
                console.error('Error uploading file:', error);
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: 'Tenemos problemas subiendo el archivo',
                });
                this.isLoading = false;
            }
        },
        async saveFileData(downloadURL, downloadLinks) {
            try {
                await addDoc(collection(db, 'uploads'), {
                    fileURL: downloadURL,
                    downloadLinks,
                });
            } catch (error) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: 'Tenemos problemas guardando en base de datos',
                });
            }
        },
    },
};
</script>
