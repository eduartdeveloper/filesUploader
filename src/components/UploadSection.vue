<template>
    <div
        class="relative flex w-full max-w-[48rem] flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md"
    >
        <div
            class="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700 h-60"
        >
            <img
                src="https://images.pexels.com/photos/3791242/pexels-photo-3791242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="image"
                class="h-full w-full object-cover"
            />
        </div>
        <div class="p-6">
            <h4
                class="mb-2 block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased"
            >
                Subir archivos
            </h4>
            <p
                class="mb-8 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased"
            >
                Podrás subir tus archivos comprimidos y compartirlos con tus
                amigos para que los descarguen
            </p>
            <button
                @click="openModal"
                class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
                Subir Archivo
            </button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        openModal() {
            this.$emit('open-modal');
        },
    },
};
</script>
