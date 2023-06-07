<!--
Copyright 2023 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="digital_Info">
    <div class="description">
      <div class="digitaltwin_div">
        <div class="icon">
          <v-icon size="100px" color="success"
            >mdi-checkbox-marked-circle-outline</v-icon
          >

          <div class="message"> Jumeau numérique utilisé </div>
        </div>

        <div class="item-list">
          <ListItem
            :title="'Nom du jumeau numérique'"
            :subTitle="digitalTwin.name"
          />

          <ListItem
            :title="'URL du jumeau numérique'"
            :subTitle="digitalTwin.url"
          />
        </div>
      </div>
    </div>
    <div class="actions">
      <v-btn depressed large color="#14202c" style="color: #fff" @click="edit">
        Changer
      </v-btn>
    </div>
  </div>
</template>

<script>
import ListItem from './listItem.vue';

export default {
  components: {
    ListItem,
  },
  props: {
    digitalTwin: {},
  },
  methods: {
    edit() {
      this.$emit('edit');
    },
  },
};
</script>

<style scoped lang="scss">
.digital_Info {
  width: 100%;
  height: 100%;
  .description {
    width: 100%;
    height: calc(100% - 60px);

    .digitaltwin_div {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon {
        width: 100%;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        .message {
          font-size: 1.5em !important;
          color: #2e7d32;
        }
      }
      .item-list {
        width: 70%;
        margin-bottom: 30px;
      }
    }
  }
  .actions {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }
}
</style>
