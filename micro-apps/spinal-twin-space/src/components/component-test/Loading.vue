<template>
    <div v-show="loading || showCheckmark" class="loading-container">
        <div v-if="loading" class="spinner"></div>
        <v-icon v-else class="checkmark-icon" color="#4CAF50">mdi-check</v-icon>
        <span class="loading-message">{{ message }}</span>
        <span class="loading-count" v-if="loadingCount > 0">
            Nombre de tâches en cours : {{ loadingCount }}
        </span>
    </div>
</template>

<script lang="ts">
export default {
    name: 'LoadingSpinner',
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        message: {
            type: String,
            default: 'Loading...'
        },
        loadingCount: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            showCheckmark: false,
        };
    },
    watch: {
        loading(newValue) {
            if (!newValue) {
                this.showCheckmark = true;
                setTimeout(() => {
                    this.showCheckmark = false;
                }, 1000);
            }
        }
    }
}
</script>

<style scoped>
.loading-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
}

.spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-message {
    font-weight: bold;
    color: #333;
}

.checkmark-icon {
    font-size: 24px;
}

.loading-count {
    font-size: 14px;
    color: #555;
    font-weight: normal;
}
</style>
