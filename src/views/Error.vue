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
  <div class="error_container">
    <v-card elevation="4" width="500px">
      <v-card-title>Oups ! une erreur s'est produite</v-card-title>
      <v-card-text>
        Votre profile est introuvable sur ce bâtiment. pour plus d'informations,
        veuillez contacter votre administrateur.
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss">
.error_container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
