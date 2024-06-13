<template>
    <div class="text-center px-2" v-if="links.length > 0">
        <h1 class="text-white text-2xl mb-4">Descargar archivos descomprimidos</h1>
        <div v-for="(link, index) in links" :key="index" class="mb-2 flex gap-2.5 justify-start flex-wrap">
            <a
                :href="link.ruta"
                class="inline-flex items-center bg-white text-blue-500 font-bold py-2 px-4 rounded hover:bg-blue-100 transition duration-300"
                target="_blank"
                download
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v16h16V4H4zm4 6l4 4m0 0l4-4m-4 4V8" />
                </svg>
                {{ link.name }}
            </a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        links: {
            type: Array,
            required: true
        }
    }
};
</script>
