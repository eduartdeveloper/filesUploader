<template>
    <header class="shadow-sm w-screen">
        <nav>
            <nav
                class="flex items-center justify-between flex-wrap bg-blue-400 p-6"
            >
                <div class="flex items-center flex-shrink-0 text-white mr-6">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/126/126477.png"
                        alt="Logo Files Uploader"
                        class="w-12 h-12 filter invert mr-10"
                    />
                    <router-link
                        class="font-semibold text-xl tracking-tight"
                        to="/"
                        >Files Uploader</router-link
                    >
                </div>
                <div
                    class="hidden sm:block w-full block flex-grow lg:flex lg:items-center lg:w-auto"
                >
                    <div class="text-sm lg:flex-grow"></div>
                </div>
            </nav>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'FilesHeader',
};
</script>

<style scoped>
.invert {
    filter: invert(1);
}
</style>