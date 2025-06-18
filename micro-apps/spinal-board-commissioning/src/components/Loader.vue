<template>
    <div class="dialog" v-if="loader">
        <div class="card-loader">
          <div class="header-card">
                    <h1>chargement...</h1>
                </div>
                <div class="content-card">
                    <div style="width: 100%; height: 100px; display: flex; justify-content: center; align-items: center;" v-if="progressLoader.total == 0">
                     <span>{{ progressLoader.message }}</span>
                      <div>
                        <v-icon v-if="progressLoader.isSuccess" style="color: green; margin-left: 7px;" >mdi-check-underline</v-icon>
                        <div v-else style="margin-left: 4px;" class="loader"></div>
                      </div>

                    </div>
                  <div style=" font-size: 16px;" v-if="progressLoader.total > 0">
                      <span style="color: #14202C; font-size: 16px;">{{ progressLoader.message }} {{ progressLoader.completed }} / {{ progressLoader.total }}</span>
                    </div>
                    <div style="width: 100%; height: 10px; margin-top: 10px; padding: 20px;" v-if="progressLoader.total > 0">
                      <div style="width: 100%; height: 10px; background-color: #E0E0E0; border-radius: 5px;">
                        <div :style="{ width: progressLoader.percent + '%', height: '100%', backgroundColor: '#14202C', borderRadius: '5px' }"></div>
                      </div>
                    </div>
                    
                    <!-- <div v-if="logs.length > 0" style="width: 100%; height: 100px; overflow-y: auto; margin-top: 10px;">
                      <transition name="log-item">
                          <div
                            v-if="logs.length"
                            class="log-item"
                            :key="logs[0].chunk"
                            :style="{ color: logs[0].status === 'success' ? 'green' : 'red' }"
                          >
                           group {{ logs[0].chunk }} des éléments {{ logs[0].message}}
                          </div>
                      </transition>

                    </div> -->

                </div>
               
       </div>
</div>

</template>

<script lang="ts">
import { ILoading } from '../interfaces/ILoading';
import { MutationTypes } from '../services/store/appDataStore/mutations';

    export default {
        name: 'Loader',
       
            

        computed: {

            loader() {
                return this.$store.state.appDataStore.Loading;
            },


            progressLoader(): ILoading {
              
              return this.$store.state.appDataStore.progressLoader
            }
        }
    }
</script>


<style scoped>
.dialog {
  width: 100%; 
  height: 100vh;
   display: flex;
    justify-content: center;
     align-items: center;
    background-color: rgba(0, 0, 0, 0.421);
  position: fixed;


  z-index: 9999;
     
}
.header-card {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  border-bottom: 1px solid #14202C;
  border-radius: 2px;
}
.header-card h1 {
  font-size: 16px;
  color: #14202C;
  margin-left: 10px;
}
.card-loader {
  width: 700px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  border: 1px solid #14202C;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
}
.content-card {
  width: 100%;
  height: calc(100% - 35px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.loader {
  width: 25px;
  --b: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px;
  background: conic-gradient(#0000 10%, #14202c) content-box;
  -webkit-mask: repeating-conic-gradient(
      #0000 0deg,
      #000 1deg 20deg,
      #0000 21deg 36deg
    ),
    radial-gradient(
      farthest-side,
      #0000 calc(100% - var(--b) - 1px),
      #000 calc(100% - var(--b))
    );
  -webkit-mask-composite: destination-in;
  mask-composite: intersect;
  animation: l4 1s infinite steps(10);
}

.log-item {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  animation: slideUp 0.5ms ease-out; /* Animation de montée */
}

@keyframes slideUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}


@keyframes l4 {
  to {
    transform: rotate(1turn);
  }
}

</style>