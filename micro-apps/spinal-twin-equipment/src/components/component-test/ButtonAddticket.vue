<template>
    <button elevation="4" class="button-add-ticket" @click="$emit('open-dialog')">
        <v-icon class="icon-add-ticket"></v-icon>
        <div class="text-button">
            <span class="title-button">Ajouter un ticket</span>
        </div>
    </button>
</template>

<script lang="ts">
export default {
    name: 'add-ticket-btn',
};
</script>