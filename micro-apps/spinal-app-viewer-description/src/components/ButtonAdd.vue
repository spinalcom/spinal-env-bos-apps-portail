<template >
          <button 
    class="button-add-ticket" @click="$emit('open-dialog')">
        <v-icon class="icon">{{ icon }}</v-icon>
            <div class="text-button">
                <span class="title-button">{{ name }}</span>
            </div>
        </button>


</template>

<script lang="ts">

export default {
        name: 'add-btn',
        props : {
            name: {
                type: String,
                default: 'Ajouter un document'
            },
            icon : {
                type: String,
                default: 'mdi-file-plus'
            }
        }
    }

</script>

<style>
    .icon {
        width: 28px !important;
        height: 28px !important;
        background-color: white !important;
        border-radius: 6px !important;
        padding: 10px !important;
    }
    .name-button::first-letter {
        text-transform: uppercase;
    }
  
</style>