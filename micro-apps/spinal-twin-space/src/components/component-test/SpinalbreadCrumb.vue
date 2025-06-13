<template>
  <div>
    <nav class="breadcrumbs">
      <a
        title="Revenir à la selection de contextes"
        href="#selected_ctx"
        @click.stop="goBackToContextSelection"
        class="breadcrumbs__item"
        ><</a>
      <a
        title="Revenir à la selection de catégories"
        href="#selected_ctx"
        @click.stop="goBackToContext"
        class="breadcrumbs__item"
        >{{
          $store.state.appDataStore.user_selected.ctx ||
            'Selectionnez un contexte'
        }}</a
      >
      <a
        title="Revenir à la selection de groupes"
        href="#selected_cat"
        @click.stop="goBackToCategory"
        class="breadcrumbs__item"
        v-if="$store.state.appDataStore.user_selected.cat"
        >{{ $store.state.appDataStore.user_selected.cat }}</a
      >
      <a
        title="Revenir à la selection d'équipements"
        href="#selected_grp"
        @click.stop="goBackToGroup"
        class="breadcrumbs__item"
        v-if="$store.state.appDataStore.user_selected.grp"
        >{{ $store.state.appDataStore.user_selected.grp }}</a
      >
      <a v-if="selected_item" href="#selected_item" class="breadcrumbs__item">
        {{ selected_item }}
      </a>
    </nav>

    <div
      v-if="showSelection"
      @click="showSelection = !showSelection"
      style="
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.412);
        position: fixed;
        z-index: 99;
        top: 0px;
        left: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      "
    >
      <div
        @click.stop
        style="
          display: flex;
          background-color: white;
          border-radius: 8px;
          height: 500px;
        ">
        <div
          style="
            border-right: 2px solid rgb(166, 166, 166);
            margin: 10px;
            width: 25vw;
            background-color: white;
            min-height: 400px;
            padding: 10px;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
              rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
          "
        >
          <div
            style="
              padding: 5px;
              border-radius: 5px;
              background-color: rgba(211, 211, 211, 0.733);
              width: 100%;
              font-weight: bold;
            "
          >
            Selectionner un contexte:</div
          >
          <ul>
            <div
              :class="{ selected: selected_ctx === ctx.name }"
              class="choose_li"
              style="cursor: pointer"
              v-for="ctx in ctx_list"
              :key="ctx.name"
              @click="
                emitValue('ctx', ctx);
                selected_ctx = ctx.name;
              "
              >{{ ctx.name }}</div
            >
          </ul>
        </div>
        <div
          style="
            border-right: 2px solid rgb(166, 166, 166);
            margin: 10px;
            width: 25vw;
            background-color: white;
            min-height: 400px;
            padding: 10px;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
              rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
          "
        >
          <div
            style="
              padding: 5px;
              border-radius: 5px;
              background-color: rgba(211, 211, 211, 0.733);
              width: 100%;
              font-weight: bold;
            "
          >
            Selectionner une catégorie:</div
          >
          <ul>
            <div
              :class="{ selected: selected_cat === cat.name }"
              class="choose_li"
              style="cursor: pointer"
              v-for="cat in cat_list"
              :key="cat.name"
              @click="
                emitValue('cat', cat);
                selected_cat = cat.name;
              "
              >{{ cat.name }}</div
            >
          </ul>
        </div>
        <div
          style="
            margin: 10px;
            width: 25vw;
            background-color: white;
            min-height: 400px;
            padding: 10px;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
              rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
          "
        >
          <div
            style="
              padding: 5px;
              border-radius: 5px;
              background-color: rgba(211, 211, 211, 0.733);
              width: 100%;
              font-weight: bold;
            "
          >
            Sélectionner un groupe:</div
          >
          <ul>
            <div
              @click="
                emitValue('grp', grp);
                selected_grp = grp.name;
              "
              :class="{ selected: selected_grp === grp.name }"
              class="choose_li"
              v-for="grp in grp_list"
              :key="grp.name"
              ><label style="cursor: pointer" :for="grp.name">{{
                grp.name
              }}</label></div
            >
          </ul>
        </div>
        <div
          @click="showSelection = !showSelection"
          style="
            cursor: pointer;
            position: relative;
            top: -10px;
            right: -10px;
            height: 21px;
            width: 21px;
            border-radius: 20px;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
          "
        >
          X</div
        >
      </div>

      <div style="width: 78%; display: flex; justify-content: flex-end">
        <div
          @click="showSelection = !showSelection"
          style="
            cursor: pointer;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            border: 1px solid #14202c;
            position: relative;
            width: 100px;
            height: 40px;
            transform: translate(0, -150%);
            color: #14202c;
            margin: 10px;
          "
        >
          Annuler</div
        >
        <div
          @click="validate"
          style="
            cursor: pointer;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #14202c;
            position: relative;
            width: 100px;
            height: 40px;
            transform: translate(0, -150%);
            color: white;
            margin: 10px;
          "
        >
          Valider</div
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['ctx_list', 'cat_list', 'grp_list', 'selected_item'],
  data: () => ({
    selected_ctx: '',
    selected_grp: '',
    selected_cat: '',
    showSelection: false,
  }),

  mounted() {},

  computed:{
    selectedZone(){
      return this.$store.state.appDataStore.zoneSelected;
    }
  },


  methods: {
    deselectItem() {
      // this.emitValue('item', '');
      this.$emit('deselectItem')
    },
    validate() {
      //this.emitValue('grp', this.selected_grp);
      this.showSelection = false;
    },

    goBackToContextSelection(){
      this.goBackToContext();
      if(this.$store.state.appDataStore.user_selected.ctx){
        this.$emit('goBack');
      }
    },

    goBackToContext() {
      this.goBackToCategory();
      if(this.$store.state.appDataStore.user_selected.cat){
        this.$emit('goBack');
      }
    },
    goBackToCategory() {
      console.log('goBackToCategory');
      console.log('selected_grp', this.selected_grp);
      if(this.selected_item){
        this.deselectItem();
      }
      if(this.$store.state.appDataStore.user_selected.grp){
        this.$emit('goBack');
      }
      
    },
    goBackToGroup() {
      this.deselectItem();
    },


    emitValue(listType, value) {
      if (listType == 'ctx' || listType == 'cat') {
        this.selected_grp = '';
      }
      if (listType == 'ctx') {
        this.selected_cat = '';
      }
      this.$emit('itemSelected', { listType, value });
    },
  },

  watch: {
    selectedZone(newVal, oldVal) {
      this.goBackToCategory();
    }
  },
};
</script>
<style scoped>
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
  min-height: 75px;
  min-width: 128px;
  background: #fff;
  color: #333;
  outline: none;
  padding: 0.75em 0.75em 0.75em 1.25em;
  position: relative;
  text-decoration: none;
  transition: background 0.2s linear;
  justify-content: center;
  display: flex;
  align-items: center;
}

.breadcrumbs__item_chips {
  background: #fff;
  color: #333;
  outline: none;
  padding: 0.75em 0.75em 0.75em 1.25em;
  position: relative;
  text-decoration: none;
  transition: background 0.2s linear;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
  background: #edf1f5;
}

/* .breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
  background: #323f4a;
  color: #fff;
} */

.breadcrumbs__item:after,
.breadcrumbs__item:before {
  background: white;
  bottom: 0;
  clip-path: polygon(50% 50%, -50% -50%, 0 100%);
  content: '';
  left: 100%;
  position: absolute;
  top: 0;
  transition: background 0.2s linear;
  width: 1em;
  z-index: 1;
}

.breadcrumbs__item:before {
  background: #cbd2d9;
  margin-left: 1px;
}

.breadcrumbs__item:last-child {
}

.breadcrumbs__item:first-child {
  max-width: 10px;
  min-width: 10px;
  padding: 0.75em 0.75em 0.75em 0.75em;
  background-color: rgb(252, 114, 114);
}
.breadcrumbs__item:first-child:after {
  background-color: rgb(252, 114, 114);
}


.breadcrumbs__item.is-active {
  background: #edf1f5;
}

.choose_li {
  margin: 5px;
  padding: 5px;
  cursor: pointer;
}

.choose_li:hover {
  background-color: rgb(229, 229, 229);
  border-radius: 5px;
}
.selected {
  background-color: #e9e9e98f;
  border-radius: 5px;
  border: 1px solid #14202c;
}
</style>
