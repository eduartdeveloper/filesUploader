<template>
    <div class="relative flex w-full max-w-[48rem] flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div class="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700 h-60">
            <img src="https://images.pexels.com/photos/3791242/pexels-photo-3791242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="image" class="h-full w-full object-cover" />
        </div>
        <div class="p-6">
            <slot></slot>
        </div>
    </div>
</template>
