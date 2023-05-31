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
  <div class="state_container">
    <!-- <div class="stat-element px-4 py-1"> -->
    <div class="icon-box">
      <v-icon size="x-large" :color="color">{{ icon }}</v-icon>
    </div>
    <div class="count" :style="{color}">
      {{ count }}
    </div>
    <div class="text-box" :style="{color}">
      <div class="title-text">{{ title }}</div>
      <div class="subtitle-text">{{ subtitle }}</div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#000',
    },
    icon: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '0',
    },
  },
};
</script>

<style scoped lang="scss">
.state_container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  .icon-box {
    height: 30px;
    width: 30px;
    margin: 0 10px 0 10px;
    // background-color: #555;
    border-radius: 6px;
  }

  .count {
    padding-right: 0.5em;
    font-weight: 400;
    // color: #374063;
    font-size: 36px;
    letter-spacing: 2px;
  }

  .text-box {
    display: flex;
    flex-flow: column;
    .title-text {
      letter-spacing: 2px;
      font-size: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .subtitle-text {
      letter-spacing: 2px;
      font-size: 10px;
      white-space: nowrap;
    }
  }
}
</style>
