<template>
  <v-row
    style="display: flex; flex-wrap: nowrap; align-items: center; justify-content: flex-end; gap: 10px; padding: 10px; width: max-content;">
    <v-icon style="cursor: pointer;" ref="btn"
      @click="changeOverflowItemMenu(item.dynamicId)">mdi-dots-vertical</v-icon>
    <div class="over-menu" ref="over_content" v-if="show">
      <ul class="over-menu__content"
        style="width: 100%; padding-top: 10px; padding-left: 0px; display: flex; flex-direction: column; gap: 10px; ">
        <li  v-if="showDocs || !noWatch" class="list-menu" @click="showDoc(item.dynamicId, item.Name)">
          <v-icon
            style="width: max-content; height: max-content; background-color: rgba(203 213 225 0.5); border-radius: 50%; font-size: 15px; color: #14202c; cursor: pointer;">
            mdi-eye
          </v-icon>
          <span>Voir le document</span>
        </li>
        <li v-if="editable" class="list-menu" @click="editFile(item.dynamicId)">
          <v-icon style="cursor: pointer; font-size: 16px;" color="#14202C">
            mdi-file-edit-outline
          </v-icon>
          <span> Modifier </span>
        </li>
        <li v-if="showDownload" class="list-menu" @click="downloadFile(item.dynamicId, item.Name)">
          <v-icon style="cursor: pointer; font-size: 16px;" color="#14202C">
            mdi-download-box
          </v-icon>
          <span> Télécharger </span>
        </li>
        <li class="list-menu" @click="DeleteFile()">
          <v-icon style="cursor: pointer; font-size: 16px;" color="#14202C">
            mdi-delete-sweep
          </v-icon>
          <span> Supprimer </span>
        </li>
      </ul>
    </div>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'OverMenu',
  props: {
    item: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    showDocs: {
      type: Boolean,
      default: true
    }
    ,
    editable: {
      type: Boolean,
      default: false
    },
    noWatch: {
      type: Boolean,
      default: true
    },
    showDownload: {
      type: Boolean,
      default: true
    }

  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
    
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },


  methods: {
    showDoc(dynamicId: number, name: string) {
      this.$emit('showDoc', dynamicId, name);
    },
    downloadFile(dynamicId: number, name: string) {
      this.$emit('downloadFile', dynamicId, name);
    },
    editFile(dynamicId: number) {
      this.$emit('editFile', dynamicId);
    },
    DeleteFile() {
      this.$emit('DeleteFile');
    },
    changeOverflowItemMenu(dynamicId: any) {
      this.$emit('changeOverflowItemMenu', dynamicId);
    },

    handleClickOutside(event: any) {
          if (this.$refs.over_content &&  this.$refs.btn && !this.$refs.over_content.contains(event.target) && !this.$refs.btn.$el.contains(event.target)) {
            this.$emit('close');
     
          }
        }

  },
  watch: {
    showDocs: {
      immediate: true,
      handler(newVal) {
        console.log('showDocs updated:', newVal);
      }
    }
  }
}

</script>

<style scoped>
.over-menu {
  position: absolute;
  top: 20px;
  right: 24px;
  min-width: max-content;
  min-height: max-content;
  width: 200px;
  height: max-content;
  padding: 10px 0;
  border-radius: 5px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  z-index: 1000;
  user-select: none;
}

.over-menu::after {
  content: '';
  position: absolute;
  top: 1px;
  right: -2px;
  width: 10;
  height: 10;
  transform: rotate(-70deg);
  background-color: transparent;
  border-bottom: 4px solid #ffffff;
  border-right: 4px solid #ffffff;
}


.list-menu {
  width: 100%;
  padding: 0 7px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  padding: 10px
}

.list-menu>span {
  font-size: 14px;
  font-weight: 600;
  color: rgb(30 41 59);
}

.list-menu:hover {
  background-color: rgba(228, 228, 231, 0.767);
}
</style>