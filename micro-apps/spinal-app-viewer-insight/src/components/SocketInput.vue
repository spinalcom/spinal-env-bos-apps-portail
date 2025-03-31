<template>
    <label class="checkbox-container">
      <input
        type="checkbox"
        :checked="checked"
        @change="toggleCheck"
      />
      <span class="checkmark"></span>
      <span class="label" :class="{ checked: checked }">{{ label }}</span>
    </label>
  </template>
  
  <script>
import { ActionTypes } from '../interfaces/vuexStoreTypes';
import { MutationTypes } from '../services/store/appDataStore/mutations';

  export default {
    props: {
      label: String
    },
    data() {
      return {
        checked: false // Initialisé à faux (non connecté)
      };
    },
    methods: {
      async toggleCheck(event) {
        if (event.target.checked) {
          try {
            const response = await this.$store.dispatch(ActionTypes.ENABLE_SOCKET, {
                enable: true
            } )
            console.log('respons to enable socket', response);
            
            if (response) {
                this.checked = true; // Connexion réussie -> coche la case
                this.$emit('socketEnabled', true);
            } else {
                this.$emit('socketEnabled', false);
              this.checked = false; // Connexion échouée -> reste décoché
            }
          } catch (error) {
            console.error("Erreur de connexion :", error);
            this.checked = false;
          }
        } else {
          this.checked = false; // Déconnexion -> décocher
        }
      },
      async connect() {
        return new Promise((resolve) => {
          setTimeout(() => {
            const success = Math.random() > 0.5; // Simulation d'une connexion aléatoire
            resolve({ success });
          }, 1000);
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  input[type="checkbox"] {
    display: none;
  }
  
  .checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid #333;
    display: inline-block;
    position: relative;
    margin-right: 8px;
    border-radius: 4px;
  }
  
  input:checked + .checkmark {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  input:checked + .checkmark::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 2px;
    width: 6px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  .label {
    font-size: 16px;
    color: #333;
  }
  
  .checked {
    font-weight: bold;
  }
  </style>
  