<template>
    <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div class="sm:max-w-lg w-full px-10 bg-white rounded-xl z-10">
                <div class="text-center">
                    <h2 class="mt-5 text-3xl font-bold text-gray-900">
                        Subir archivo
                    </h2>
                </div>
                <form class="mt-8 space-y-3" @submit.prevent="handleSubmit">
                    <div class="grid grid-cols-1 space-y-2">
                        <label
                            class="text-sm font-bold text-gray-500 tracking-wide"
                            >archivos</label
                        >
                        <div
                            class="flex items-center justify-center w-full"
                            @dragover.prevent="handleDragOver"
                            @dragleave.prevent="handleDragLeave"
                            @drop.prevent="handleDrop"
                        >
                            <label
                                :class="[
                                    'flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center',
                                    isDragging
                                        ? 'border-blue-500 bg-blue-100'
                                        : 'border-gray-300',
                                ]"
                            >
                                <div
                                    class="h-full w-full text-center flex flex-col items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-10 h-10 text-blue-400 group-hover:text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    <p class="pointer-none text-gray-500">
                                        Arrastra y suelta tu archivo<br />
                                        o
                                        <a
                                            href="#"
                                            class="text-blue-600 hover:underline"
                                            @click.prevent="triggerFileInput"
                                            >Selecciona tu archivo</a
                                        >
                                        desde tu computador
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    class="hidden"
                                    ref="fileInput"
                                    accept=".zip"
                                    @change="handleFileChange"
                                />
                            </label>
                        </div>
                        <p v-if="fileName" class="text-sm text-gray-500 mt-2">
                            Archivo seleccionado: {{ fileName }}
                        </p>
                    </div>
                    <p class="text-sm text-gray-300">
                        <span>Extensiones aceptadas: zip</span>
                    </p>
                    <div>
                        <button
                            type="submit"
                            class="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
                        >
                            Subir
                        </button>
                        <button
                            type="button"
                            class="my-5 w-full flex justify-center bg-black text-white p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-black-600 shadow-lg cursor-pointer transition ease-in duration-300"
                            @click="closeModal"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
  
  <script>
export default {
    props: {
        isModalOpen: {
            type: Boolean,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        isDragging: {
            type: Boolean,
            required: true,
        },
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            this.$emit('file-change', event.target.files[0]);
        },
        handleDragOver() {
            this.$emit('drag-over');
        },
        handleDragLeave() {
            this.$emit('drag-leave');
        },
        handleDrop(event) {
            this.$emit('drop', event.dataTransfer.files[0]);
        },
        handleSubmit() {
            this.$emit('submit');
        },
        closeModal() {
            this.$emit('close');
        },
    },
};
</script>
