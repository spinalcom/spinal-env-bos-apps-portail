<!--
Copyright 2022 SpinalCom - www.spinalcom.com

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
  <v-card class="appCardContainer" :href="appHref">
    <div class="cardContent">
      <div class="left">
        <v-card class="iconDiv">
          <v-icon color="#000000">{{ data.icon }}</v-icon>
        </v-card>
      </div>

      <div class="right">
        <div class="name" :title="data.name">
          {{ data.name }}
        </div>

        <div class="description" :title="data.description">
          {{ data.description }}
        </div>

        <div class="tags" ref="tagsscroll" :title="getTagsTitle">
          <div :style="tagsScrollStyle">
            <v-chip
              class="chip"
              label
              color="#6699cc"
              v-for="(tag, index) in data.tags"
              :key="index"
              small
            >
              <v-icon left color="#ffffff"> mdi-circle-small </v-icon>
              {{ tag.toUpperCase() }}
            </v-chip>
          </div>
        </div>

        <div class="actions">
          <div>
            <v-btn
              icon
              class="favorisBtn"
              outlined
              title="ajouter aux favoris"
              :class="{ isFavorite: isFavorite }"
              @click.stop.prevent="addAppToFavoris"
            >
              <v-icon>mdi-star</v-icon>
            </v-btn>

            <v-btn
              class="favorisBtn"
              icon
              outlined
              title="Aller à la documentation"
              v-if="data.documentationLink"
              :data="data.documentationLink"
              target="_blank"
            >
              <v-icon>mdi-information-variant</v-icon>
            </v-btn>

            <v-btn icon @click.stop.prevent="show = !show" small>
              <v-icon
                >{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          {{ data.description }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'applicationCard',
  props: {
    data: {},
    isFavorite: { type: Boolean, default: () => false },
  },
  data() {
    return {
      show: false,
      tagsScrollStyle: {
        display: 'inline-block',
        animation: '',
      },
    };
  },
  mounted() {
    if (this.data) this.getTagsScrollStyle();
  },
  methods: {
    addAppToFavoris() {
      this.$emit('addAppToFavoris', {
        item: this.data,
        isFavorite: this.isFavorite,
      });
    },
    getTagsScrollStyle() {
      if (
        !this.$refs['tagsscroll'] ||
        this.$refs['tagsscroll'].scrollWidth >
          this.$refs['tagsscroll'].clientWidth
      ) {
        const nbTags = this.data.tags.length;
        const size = this.getTagsTitle.length * 10 + nbTags * 10;
        this.tagsScrollStyle.animation = `scroll-text ${
          size / 50
        }s linear infinite paused`;
        return;
      }
      this.tagsScrollStyle.animation = '';
    },
  },
  computed: {
    ...mapState('appDataStore', ['viewportSize']),
    getTagsTitle() {
      return this.data.tags.join(', ');
    },
    appHref() {
      let routeData = this.$router.resolve({
        name: 'App',
        query: { app: this.data?.name },
      });
      return routeData.href;
    },
  },
  watch: {
    data: {
      handler() {
        if (this.data) this.getTagsScrollStyle();
      },
      immediate: false,
    },
    ['viewportSize.width']: {
      handler() {
        if (this.data) this.getTagsScrollStyle();
      },
      immediate: false,
    },
  },
};
</script>

<style lang="scss">
.appCardContainer {
  width: 100%;
  min-height: 113px;
  background: #ffffff;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  .cardContent {
    width: 100%;
    height: 100%;
    display: flex;

    .left {
      width: 40px;
      background: #f7f8f8;
      display: flex;
      flex-direction: column;
      align-items: center;
      .iconDiv {
        height: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /* background: #ffffff; */
        padding: 5px;
        margin-top: 5px;
      }
    }

    .right {
      width: calc(100% - 40px);
      height: 100%;
      padding: 5px;
      .name,
      .description,
      .tags,
      .actions {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        /* margin-bottom: 5px; */
      }

      .name {
        height: 30px;
        font-size: 0.9em;
        color: #000000;
        text-transform: uppercase;
        font-weight: 900;
        display: flex;
        align-items: center;
      }

      .description {
        height: 20px;
        font-size: 0.7em;
        display: flex;
        align-items: center;
      }

      .tags {
        height: 25px;
        position: relative;
        .chip {
          height: 16px;
          color: #ffffff;
          font-size: 0.7em;
          margin-right: 4px;

          i {
            min-width: none !important;
            width: 5px;
          }
        }
      }

      .actions {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .favorisBtn {
          min-width: unset !important;
          width: 25px;
          height: 25px !important;
          border-radius: 5px;
          color: #bdbdbd;

          i {
            font-size: 23px;
          }
        }

        .favorisBtn.isFavorite {
          i {
            color: #ffd700 !important;
          }
        }
      }
    }
  }
}
@keyframes scroll-text {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

.appCardContainer:hover {
  cursor: pointer;
}
</style>
<style>
.appCardContainer .cardContent .right .tags > div {
  animation-play-state: paused !important;
}
.appCardContainer:hover .cardContent .right .tags > div {
  animation-play-state: running !important;
}
</style>
