<template>
  <div class="d-flex flex-column card">
    <div  v-if="title && subtitle" class="card-title card-layer pb-3 flex-shrink-1 justify-space-between" style="height: fit-content !important">
      <p class="mb-0 text-center">
        {{ title }}
        <br>
        <span class="desc" style="margin-left: 0 !important;">{{ subtitle }}</span>
      </p>
    </div>
    <div class="d-flex flex-row card-layer" style="height: 70px;" v-for="d of data" v-if="d.title">

        <div class="d-flex flex-column justify-center stat-value" :style="[{ color: d.color }, {'font-size': (d.root ==true) ?'48px':'30px'}]">{{ shortNumberCall(d.value) }}</div>
        <div class="d-flex flex-column justify-center stat-text">
          <span> <span :style="{ color: d.color }">{{ d.unit }}</span> {{ d.title }}</span>
          <div v-if="d.subtitle === 'today'" class="stat-subtitle orange--text text-uppercase">
              <div class="rounded-circle d-inline-block orange pa-1" ></div>
              Aujourd'hui
          </div>
          <span v-else-if="d.subValue && d.subValue!= 'NaN%' && !d.subValue.includes('Infinity') && d.subtitle!=''" class=""><span style="color: #000000DE;"> {{ d.subValue }} </span>{{ d.subtitle }}</span>

      </div>
    </div>
  </div>
</template>

<script>

export default {
    props: {
        data: {
            required: true
        },
        title: {
          type: String,
          required: false
        },
        subtitle: {
          type: String,
          required: false
        },
    },
    mounted() {
        
    },
    methods: {
        shortNumberCall(n) {
        if (Math.abs(n) >= 1000000000)
            return Math.round(n / 100000000) / 10 + "b";
        if (Math.abs(n) >= 1000000) return Math.round(n / 100000) / 10 + "m";
        if (Math.abs(n) >= 1000) return Math.round(n / 100) / 10 + "k";
        return n === Math.floor(n) ? n : n.toFixed(1);
        },
    },
}

</script>

<style scoped>
.card {
  font-family: "Charlevoix Pro";
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 3px 10px #49545c29 !important;
  border: thin solid #0000001f;
  gap: 0px;
}

.card-layer-root {
  border-bottom: 1px solid #acacac;
}
.card-layer:not(:last-child) {
    border-bottom: 1px solid #ececec;
}

.card-layer {
    width: 100%;
    height: 100%;
}

.stat-value {
  font-family: "Charlevoix Pro";
  font-size: 48px;
  width: 36%;
  text-align: end;
  line-height: normal;
  padding-right: 10px;
}
.stat-subtitle {
  font-family: "Charlevoix Pro";
  font-size: 12px;
  font-weight: bold;
  color: #FF7612 !important;
}
.stat-text {
  font-size: 16px;
  font-family: "Charlevoix Pro";
  width: 60%;
  color: #949da6;
}

.card-title {
  letter-spacing: 1.1px !important;
  color: #000000DE !important;
  font-size: 20px !important;
}

@font-face{font-family:'Charlevoix Pro';src:url('../assets/font/CharlevoixPro-Regular.woff2') format('woff2'),url('../assets/font/CharlevoixPro-Regular.woff') format('woff'),url('../assets/font/CharlevoixPro-Regular.ttf') format('truetype');font-weight:normal;font-style:normal}

</style>