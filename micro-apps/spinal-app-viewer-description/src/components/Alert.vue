<template>
    <div v-show="show_alert" class="alert-content">
        <div style="width: 100%; padding: 10px; display: flex; align-items: center; gap: 10px;">
            <v-icon
                :color="currentIcon.color"
                :style="{ border: '1px solid ' + currentIcon.color, borderRadius: '50%' }"
            >
                mdi-check
            </v-icon>
            <span class="message">{{ text }}</span>
            <v-icon @click="hideAlert" style="cursor: pointer;">
                mdi-close
            </v-icon>
        </div>
    </div>
</template>


<script lang="ts">
export default {
    name: 'alert',
    props: {
        type_alert: {
            type: String,
            default: 'success',
        },
        show: {
            type: Boolean,
            default: false,
        },
        text: {
            type: String,
            default: 'Success',
        }
    },
    data() {
        return {
            icons: {
                success: { color: '#4CAF50' },
                error: { color: '#FF5252' },
                warning: { color: '#FFC107' },
                info: { color: '#2196F3' },
            },
            show_alert: this.show,
        }
    },
    computed: {
        currentIcon() {
            return this.icons[this.type_alert] || { color: '#000000' }; // Couleur par défaut (noir)
        }
    },
    watch: {
        show(newVal: boolean) {
            this.show_alert = newVal;
            if (newVal) {
                setTimeout(() => {
                    this.show_alert = false;
                    this.$emit('update:show', false);
                }, 5000); // Notification disparait après 5 secondes
            }
        }
    },
    methods: {
        hideAlert() {
            this.show_alert = false;
            this.$emit('update:show', false);
        },
    }
}
</script>


<style scoped>
.alert-content {
    min-width: max-content;
    position: fixed;
    top: 100px;
    left: 45%;
    transform: translateX(-55%);
    color: #14202C;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1.1px;
    background-color: #fff;
    font: normal normal normal Charlevoix Pro !important;
    z-index: 99999; /* Augmenter pour s'assurer qu'il est au-dessus de tout */
    border-radius: 16px;
    align-items: center;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    display: flex;
    justify-content: space-between;
    padding: 10px;
    opacity: 0;
    animation: slideIn 0.5s ease-out forwards;
} 
.message::first-letter {
    text-transform: uppercase;
    font-weight: bold;
}

/* Animation pour l'apparition et disparition */
@keyframes slideIn {
    0% {
        opacity: 0;
        top: 0;
    }
    100% {
        opacity: 1;
        top: 50px;
    }
}

/* Animation de disparition après le timeout */
.alert-content.fade-out {
    animation: fadeOut 1s ease-out forwards;
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        top: 0;
    }
}
</style>
