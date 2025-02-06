<template>
    <div>
        <nav title="Modifier la séléction" @click.stop="showSelection = !showSelection" class="breadcrumbs">
            <a href="#selected_ctx" class="breadcrumbs__item">{{ selected_ctx }}</a>
            <a href="#selected_cat" class="breadcrumbs__item">{{ selected_cat }}</a>
            <div href="#selected_grp" class="breadcrumbs__item_chips">
                <v-chip color="#14202c" style="background-color: #14202c;margin-top: 10px !important; color: white"
                    density="comfortable" size="small" v-for="(item, i) in selected_grp">
                    {{ selected_grp[i] }}
                    <div
                        style="top: -5px;right:-5px;position: absolute;background-color: white;border-radius: 20px;height: 15px;width: 15px;display: flex;justify-content: center;align-items: center;border: 1px solid #14202c; color: #14202c;">
                        <v-icon style="margin-top: 1px;" size="13px" @click.stop="tarrr(i)">mdi-close</v-icon>
                    </div>
                </v-chip>
            </div>
        </nav>

        <div v-if="showSelection" @click="showSelection = !showSelection"
            style="width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.412);position:fixed;z-index: 99;top: 0px;left : 0px;display: flex;justify-content: center;align-items: center;flex-direction: column;">

            <div @click.stop style="display: flex;background-color: white;border-radius: 8px;height: 500px;">

                <div
                    style="border-right: 2px solid rgb(166, 166, 166);margin: 10px;width: 25vw;background-color: white;min-height: 400px;padding: 10px;max-height: 400px;overflow-y: auto;box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">

                    <div
                        style="padding: 5px;border-radius: 5px;background-color: rgba(211, 211, 211, 0.733);width: 100%;font-weight: bold;">
                        Selectionner un contexte:</div>
                    <ul>
                        <div :class="{ 'selected': selected_ctx === ctx.name }" class="choose_li"
                            style="cursor: pointer;" v-for="ctx in ctx_list" :key="ctx.name"
                            @click="emitValue('ctx', ctx); selected_ctx = ctx.name">{{
            ctx.name }}</div>
                    </ul>
                </div>
                <div
                    style="border-right: 2px solid rgb(166, 166, 166);margin: 10px;width: 25vw;background-color: white;min-height: 400px;padding: 10px;max-height: 400px;overflow-y: auto;box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">
                    <div
                        style="padding: 5px;border-radius: 5px;background-color: rgba(211, 211, 211, 0.733);width: 100%;font-weight: bold;">
                        Selectionner une catégorie:</div>
                    <ul>
                        <div :class="{ 'selected': selected_cat === cat.name }" class="choose_li"
                            style="cursor: pointer;" v-for="cat in cat_list" :key="cat.name"
                            @click="emitValue('cat', cat); selected_cat = cat.name">{{
            cat.name }}</div>
                    </ul>
                </div>
                <div
                    style="margin: 10px;width: 25vw;background-color: white;min-height: 400px;padding: 10px;max-height: 400px;overflow-y: auto;box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;">

                    <div
                        style="padding: 5px;border-radius: 5px;background-color: rgba(211, 211, 211, 0.733);width: 100%;font-weight: bold;">
                        Sélectionner un ou plusieurs groupe:</div>
                    <ul>

                        <div @click="toggleSelection(grp.name)" :class="{ 'selected': selected_grp.includes(grp.name) }"
                            class="choose_li" v-for="grp in grp_list" :key="grp.name"><label style="cursor: pointer;"
                                :for="grp.name">{{
            grp.name }}</label></div>

                    </ul>
                </div>
                <div @click="showSelection = !showSelection"
                    style="cursor:pointer; position:relative; top: -10px; right: -10px;height: 21px;width: 21px;border-radius: 20px;background-color: white; display: flex;justify-content: center;align-items: center;font-weight: bold;">
                    X</div>
            </div>
            <div style="width: 78%;display: flex; justify-content: flex-end">

                <div @click="showSelection = !showSelection"
                    style="cursor: pointer;border-radius: 5px;display: flex;justify-content: center;align-items: center;background-color: white;border: 1px solid #14202c;position: relative;width: 100px;height: 40px;transform: translate(0,-150%);color: #14202c;margin: 10px;">
                    Annuler</div>
                <div @click="validate"
                    style="cursor: pointer;border-radius: 5px;display: flex;justify-content: center;align-items: center;background-color: #14202c;position: relative;width: 100px;height: 40px;transform: translate(0,-150%);color: white;margin: 10px;">
                    Valider</div>
            </div>
        </div>
    </div>

</template>
<script>

export default {
    props: ['ctx_list', 'cat_list', 'grp_list'],
    data: () => ({
        selected_ctx: "",
        selected_grp: [],
        selected_cat: "",
        showSelection: true,
    }),

    mounted() {
        // console.warn(ctx_list);
    },

    methods: {

        tarrr(i) {
            this.selected_grp.splice(i, 1);
            this.validate();
        },

        toggleSelection(groupName) {
            const index = this.selected_grp.indexOf(groupName);
            if (index === -1) {
                this.selected_grp.push(groupName);
            } else {
                this.selected_grp.splice(index, 1);
            }
        },
        validate() {
            this.emitValue('grp', this.selected_grp);
            this.showSelection = false;
        },


        emitValue(listType, value) {
            if (listType == 'ctx' || listType == 'cat') {
                this.selected_grp = []
            }
            if (listType == 'ctx') {
                this.selected_cat = ""
            }
            this.$emit('itemSelected', { listType, value });
        },

    },



    watch: {

    }
}


</script>
<style scoped>



.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
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

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
  background: #323f4a;
  color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
  background: white;
  bottom: 0;
  clip-path: polygon(50% 50%, -50% -50%, 0 100%);
  content: "";
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
  border-right: none;
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