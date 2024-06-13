<template>
    <div
        v-if="isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
        <bounce-loader :loading="isLoading" :color="'#63b3ed'" :size="100" />
    </div>
</template>

<script>
export default {
    props: {
        isLoading: {
            type: Boolean,
            required: true
        }
    }
};
</script>
