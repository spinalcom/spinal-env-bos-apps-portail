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
  <div class="itemContent">
    <div class="title"
         :title="title">
      {{ title }} :
    </div>

    <div class="subTitle"
         :title="subTitle">
      {{ subTitle }}
    </div>
  </div>
</template>
  
<script>
export default {
  name: "listItem",
  props: ["title", "subTitle"],
};
</script>

  <style scoped lang="scss">
.itemContent {
  display: flex !important;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  .title,
  .subTitle {
    width: calc(50% - 5px);
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden;
  }
  .title {
    font-size: 0.9em !important;
  }
  .subTitle {
    font-size: 1em;
    color: #607d8b;
    /* color: #2e7d32 !important; */
  }
}
</style>