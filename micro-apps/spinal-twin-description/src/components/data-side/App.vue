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

    <div class="appli">
  
      <div v-if="isapp" class="blocAppStyle">
        <div
          style="width: 100%;height: 50px;text-align: left;padding-left: 22px;padding-top: 22px;margin-bottom: 10px;font-family: Charlevoix Pro !important;font-size: 22px;font-weight: bold;display: flex;justify-content: space-between;padding-right: 20px;border-bottom: 1px solid gray;padding-bottom: 58px;">
          LISTE DES APPLICATIONS
          <div style="cursor: pointer;">
            <v-icon @click="dialog3 = !dialog3" color="#14202c" size="40">mdi-help-box-outline</v-icon>
          </div>
        </div>
        <v-dialog v-model="dialog3" max-width="580px">
          <v-card>
            <v-card-title style="white-space: normal;">
              <span style="font-size: 17px; overflow-wrap: break-word; word-break: normal;">
                Ce menu vous permet d’accéder aux différentes applications disponibles et vous redirige directement vers
                la sélection en cours dans l’application choisie.
              </span>
            </v-card-title>
  
            <v-card-actions>
              <v-btn color="primary" text @click="dialog3 = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  
        <div class="container_cards">
          <div v-for="item in appTab" class="cardDescription">
  
            <div class="iconCardAPp">
              <div
                style="background-color: white;border-radius: 2px;border: 1px solid #ebebeb; width: 50px; height: 50px;display: flex;justify-content: center;align-items: center;">
                <v-icon color="#14202c" size="40">{{ item.icon }}</v-icon>
  
              </div>
            </div>
  
            <div @click="() => {
              $emit('changeRoute', item.id);
            }" style="width: 100%;">
              <div style="margin-left: 10px;display: flex;justify-content: flex-start;" class="">
                <div class="description_data_cardDescription">
                  {{ item.name }}
                </div>
              </div>
              <div style="margin-left: 10px;width: 90%;">{{ item.description }}</div>
  
            </div>
          </div>
        </div>
  
      </div>
  
      <Alert :type_alert="type_alert" :show="alert" :text="alert_ind" />
      <ConfirmDelete :show="showConfirmDelete" @delete-doc="showAlert" @close="updateCloseConfirmDelete"
        :idReference="confirmIdReferenceDelete" :idFile="confirmIdFileDelete" :contextFile="contextFile" />
      <div v-show="showDocvalue" class="doc-vue">
        <ShowDocumentation :referenceId="idDoc" :file_prop="nameFile" :closecomp="ActiveData"
          @closeDialog="closeVueDoc" />
      </div>
  
      <div
      v-if="ActiveData && activeChartData.length > 0 && (selection == 'Indicateur' || selection == 'Points de mesures')"
        class="graphContainer">
  
        <!-- <LineCardComponent :title="'Donnée Insight'" :labels="labelsChart" :datasets="chartData"
          :step="labelsChart.length" :tooltipCallbacks="{
            title: (context) => { },
            label: (tooltipItem) =>
              `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(
                2
              )} `,
            footer: (data) => { },
          }"></LineCardComponent> -->
  
        <FastLineCardComponent :title="'Donnée Insight'" :labels="labelsChart" :datasets="chartData"
          :step="labelsChart.length" :tooltipCallbacks="{
            title: (context) => { },
            label: (tooltipItem) =>
              `${tooltipItem.dataset.label}: ${tooltipItem.parsed.y.toFixed(
                2
              )} `,
            footer: (data) => { },
          }"></FastLineCardComponent>
  
      </div>
      <div
        style="max-height: 100%; display:flex; overflow: hidden ; overflow-y: auto; flex-direction: column; align-content:space-between;"
        :class="{ 'doc-content': showDocvalue, 'w-full': !showDocvalue }">
        <SpriteComponentMobile @close="handleClose"
          style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999;"
          v-if="displaySprite" :data="isSmallScreen">
        </SpriteComponentMobile>
  
        <BreadcrumbSelector :ids="referencedId" :type="referencedType" />
  
        <div class="hide" @click="() => {
          gestionBouton()
        }"
          style="background-color: white;width: 70px;height: 70px;position: absolute;bottom: 2px;right: 90px;z-index: 9999;border-radius: 5px;border: 2px solid #14202c;justify-content: center;align-items: center;display: flex;">
          <v-icon v-if="modefull && !displaySprite">mdi-text-box</v-icon>
          <v-icon v-else-if="!modefull && !displaySprite">mdi-video-3d</v-icon>
          <v-icon v-else>mdi-close-circle-outline</v-icon>
        </div>
  
        <div class="el3d">
          <button @click="() => {
            $emit('buttonClicked', '');
            resize();
          }
          " style="
            position: absolute;
            top: 47.5%;
            left: -20px;
            background-color: white;
            border-radius: 10px;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 5px;
            border-left: 2px solid gainsboro;
            
          " :style="{ left: DActive ? '-35px' : '-20px' }">
            <v-icon v-if="DActive"> mdi-chevron-double-left </v-icon>
            <v-icon v-else-if="ActiveData">mdi-chevron-right</v-icon>
            <v-icon v-else>mdi-chevron-left</v-icon>
          </button>
          <button @click="() => {
            $emit('buttonClicked3D', '');
            resize();
          }
          " style="
            position: absolute;
            top: 52.5%;
            background-color: white;
            border-radius: 10px;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 5px;
            border-left: 2px solid gainsboro;
            
            " :style="{ left: DActive ? '-35px' : '-20px' }">
            <v-icon v-if="ActiveData">mdi-chevron-double-right</v-icon>
            <v-icon v-else-if="DActive">mdi-chevron-left</v-icon>
            <v-icon v-else>mdi-chevron-right</v-icon>
          </button>
        </div>
  
        <div>
          <div style="display: flex;justify-content: space-between;" class="title">
  
            <div class="button  adaptative">
              <v-select :attach="$refs.toto" label="Onglet sélectionné" v-model="selection" :items="dynamicItems" outlined
                :menu-props="{ offsetY: true, nudgeTop: -3 }"></v-select>
  
            </div>
            <div ref="toto"></div>
  
            <div v-if="ActiveData && selection == 'Indicateur' && labelsChart"
              style="display: flex ; flex-wrap: nowrap ; align-items: center;margin-left: 15px; margin-right: 15px;">
              <v-btn style="margin: 10px;" elevation="0" fab small @click="t_index--">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <div style="white-space: nowrap;">{{ timeactuelle }}</div>
              <v-btn style="margin: 10px;" elevation="0" fab small @click="t_index++">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
  
            <div
              style="justify-content: flex-end;align-items: center;display: flex;padding-right: 12px;white-space: nowrap;"
              v-if="floorstaticDetails.length && floorstaticDetails[0].attributsList.length">
              <div style="" v-for="(item, index) in floorstaticDetails[0].attributsList[0].attributs">
                <div v-if="item.label == 'area'">
                  {{ typeof item.value === 'number' ? item.value.toFixed(2) : item.value }} m²
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <ProgressBar v-if="data_loading < 100" :value="data_loading" :size="120" :width="20" />
  
        <div v-show="data_loading >= 100" class="inventory">
  
  
          <div v-if="selection == 'Vue Globale'">
  
            <div v-if="inventoyList">
              <div v-for="(items, categoryName) in inventoyList" :key="categoryName" class="blocInformation"
                style="margin-bottom: 20px;">
                <span
                  style="font-size: 19px; font-family: Arial, Helvetica, sans-serif; font-weight: bold; display: block; margin-bottom: 10px;">
                  Inventaire des équipements ({{ categoryName }})
                </span>
                <div v-if="!items || items.length === 0"
                  style="text-align: center; font-style: italic; color: #888; margin: 10px 0;">
                  PAS DE DONNÉES DISPONIBLES
                </div>
                <div v-else class="inventory-container" style="display: flex; flex-wrap: wrap;">
                  <div v-for="(item, index) in items" :key="index" class="inventory-item"
                    style="display: flex; align-items: center; width: 100%; border: 1px solid #ddd; padding: 14px 5px;border-radius: 5px;">
  
                    <li style="flex: 1; font-size: 16px; font-family: Arial, Helvetica, sans-serif;">{{ item }}</li>
                    <v-icon v-if="!eyes[categoryName] || eyes[categoryName].indexOf(item) === -1"
                      @click="() => { hideelement(item, categoryName); closeeyes(item, categoryName) }"
                      style="cursor: pointer; margin-left: 10px;">
                      mdi-eye-outline
                    </v-icon>
                    <v-icon v-else @click="() => { hideelement(item, categoryName); closeeyes(item, categoryName) }"
                      style="cursor: pointer; margin-left: 10px;">
                      mdi-eye-off-outline
                    </v-icon>
                    <v-icon v-if="!ink[categoryName] || ink[categoryName].indexOf(item) === -1"
                      @click="() => { showIconElement(item, categoryName); closeink(item, categoryName) }"
                      style="cursor: pointer; margin-left: 10px;">
                      mdi-map-marker-circle
                    </v-icon>
                    <v-icon v-else @click="() => { deleteIconElement(item, categoryName); closeink(item, categoryName) }"
                      :style="{ cursor: 'pointer', marginLeft: '10px', color: iconColors[`${categoryName}-${item}`] || '#000' }">
                      mdi-map-marker-remove-variant
                    </v-icon>
  
                    <v-icon v-if="!col[categoryName] || col[categoryName].indexOf(item) === -1"
                      @click="() => { colorElement(item, categoryName); closecol(item, categoryName) }"
                      style="cursor: pointer; margin-left: 10px;">
                      mdi-invert-colors
                    </v-icon>
                    <v-icon v-else @click="() => { descolorElement(item, categoryName); closecol(item, categoryName) }"
                      :style="{ cursor: 'pointer', marginLeft: '10px', color: iconColors[`${categoryName}-${item}`] || '#000' }">
                      mdi-invert-colors-off
                    </v-icon>
  
                  </div>
                </div>
              </div>
            </div>
  
            <div v-if="spaceInventoryData">
              <div v-for="(categoryItem, categoryIndex) in spaceInventoryData" :key="categoryIndex"
                class="blocInformation" style="margin-bottom: 20px;">
  
                <span
                  style="font-size: 19px; font-family: Arial, Helvetica, sans-serif; font-weight: bold; display: block; margin-bottom: 10px;">
                  Inventaire des Espaces ({{ categoryItem.category }})
                </span>
  
                <div v-if="!categoryItem.groups || categoryItem.groups.length === 0"
                  style="text-align: center; font-style: italic; color: #888; margin: 10px 0;">
                  PAS DE DONNÉES DISPONIBLES
                </div>
  
                <div v-else class="inventory-container" style="display: flex; flex-wrap: wrap;">
                  <div v-for="(groupItem, groupIndex) in categoryItem.groups" :key="groupIndex" class="inventory-item"
                    style="display: flex; align-items: center; width: 100%; border: 1px solid #ddd; padding: 14px 5px; border-radius: 5px;">
  
                    <li style="flex: 1; font-size: 16px; font-family: Arial, Helvetica, sans-serif;">
                      {{ groupItem.rooms.length }} {{ groupItem.groupName }} -
                      <strong>{{ getTotalArea(groupItem.rooms) }} m²</strong>
                    </li>
  
                    <!-- Icône Couleur -->
                    <v-icon
                      v-if="!coloredRoom.some(item => item.category === categoryItem.category && item.groupIndex === groupIndex)"
                      @click="() => { colorSpace(categoryItem.category, groupIndex); closecol(categoryItem.category, groupIndex) }"
                      style="cursor: pointer; margin-left: 10px;">
                      mdi-invert-colors
                    </v-icon>
  
                    <v-icon v-else
                      @click="() => { descolorSpace(categoryItem.category, groupIndex); closecol(categoryItem.category, groupIndex) }"
                      :style="{ cursor: 'pointer', marginLeft: '10px', color: getColorForGroup(categoryItem.category, groupIndex) }">
                      mdi-invert-colors-off
                    </v-icon>
                  </div>
                </div>
              </div>
            </div>
  
  
  
  
            <div class="blocInformation">
              <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;">Liste des
                attributs</span>
              <div v-if="attributProfil == null"
                style="justify-content: center;align-items: center;width: 100%;display: flex; margin-top: 10px ; margin-bottom: 10px;">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
              </div>
              <div v-else class="inventory-container">
                <div
                  style="color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                  class="inventory-item" v-for="(item, index) in attributProfil">
                  <li> {{ item.label }}: {{ item.value }}</li>
  
                </div>
              </div>
            </div>
            <!-- endpoint -->
            <div v-if="endpointProfil && endpointProfil.length > 0" class="blocInformation">
  
  
              <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;">Indicateur
              </span>
              <div class="inventory-container">
                <div v-if="endpointProfil == null"
                  style="justify-content: center;align-items: center;width: 100%;display: flex; margin-top: 10px; margin-bottom: 10px;">
                  <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
                </div>
                <div
                  style="color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                  class="inventory-item" v-for="endpoint in endpointProfil">
                  <div> <span>{{ endpoint.name }}: </span>
                    <span v-if="typeof endpoint.value === 'number'">{{ endpoint.value.toFixed(2) }}</span>
                    <span v-else>{{ endpoint.value }} </span>
                    <span v-if="endpoint.unit">{{ endpoint.unit }}</span>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="blocInformation">
              <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;">Tickets
              </span>
              <div v-if="ticketsList && ticketsList[0]" class="inventory-container">
                <div
                  style="color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                  class="inventory-item">
                  <div>Nombre de tickets : {{ ticketsList.length }} </div>
                </div>
              </div>
            </div>
          </div>
  
          <div v-if="selection == 'Liste'">
  
            <div style="margin-left: 10px;" v-if="formattedData.length">
              <!-- Header avec outil de recherche -->
              <div class="inventory-header"
                style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd;">
                <span v-if="formattedData[0].type == 'geographicRoom'" style="font-size: 19px; font-weight: bold;">Liste
                  des pièces </span>
                <span v-else-if="formattedData[0].type == 'geographicFloor'"
                  style="font-size: 19px; font-weight: bold;">Liste des Étages</span>
                <span v-else style="font-size: 19px; font-weight: bold;">Liste des Équipements </span>
                <div style="display: flex;">
                  <v-text-field v-model="searchName" placeholder="Rechercher un nom" dense clearable hide-details solo
                    prepend-inner-icon="mdi-magnify" style="max-width: 250px;"></v-text-field>
                  <div style="display: flex; align-items: center; gap: 5px; cursor: pointer;margin-left: 10px;">
  
                    <v-icon v-if="!allColored" @click="colorAll">mdi-invert-colors</v-icon>
                    <v-icon v-else @click="descolorAll">mdi-invert-colors-off</v-icon>
                  </div>
                </div>
              </div>
  
              <div class="inventory-container">
                <div v-for="item in filteredData" :key="item.dynamicId" class="inventory-item"
                  style="display: flex; align-items: center; width: 100%; border: 1px solid #ddd; padding: 14px 5px; border-radius: 5px;">
  
                  <li :title="item.name"
                    style="flex: 1; font-size: 16px; font-family: Arial, Helvetica, sans-serif;max-width: auto;overflow: hidden;">
                    {{ item.name }}
                  </li>
  
                  <!-- Icône Couleur -->
                  <v-icon v-if="coloredElement && !coloredElement.includes(item.dynamicId)" @click="colorselected(item)"
                    style="cursor: pointer; margin-left: 10px;">
                    mdi-invert-colors
                  </v-icon>
  
                  <v-icon v-if="coloredElement && coloredElement.includes(item.dynamicId)" @click="descolorselected(item)"
                    :style="{ cursor: 'pointer', marginLeft: '10px', color: item.color }">
                    mdi-invert-colors-off
                  </v-icon>
  
                  <!-- Icône Sélection -->
                  <v-icon @click="selectselected(item)" style="cursor: pointer; margin-left: 10px;">
                    mdi-select-place
                  </v-icon>
  
                  <!-- Icône Aller À -->
                  <v-icon @click="gotoselected(item)" style="cursor: pointer; margin-left: 10px;">
                    mdi-arrow-down-left-bold
                  </v-icon>
  
  
                  <!-- Icône Zoom -->
                  <v-icon @click="zoomselected(item)" style="cursor: pointer; margin-left: 10px;">
                    mdi-magnify-plus-outline
                  </v-icon>
                </div>
              </div>
            </div>
  
  
          </div>
  
  
          <div v-if="selection == 'Attribut'">
  
            <FormDocAttr :isDialogOpen="ShowFormDocAttrs == true" @close-dialog="ShowFormDocAttr"
              @validated="handleValidated" :item="selectedAttribut" :id="idEl" :itemOp="itemOp" />
  
            <FormDocCateAttr :isDialogOpen="ShowFormDocCat == true" @close-dialog="ShowFormDocCate"
              @validatedcate="handleValidatedCate" :item="selectedCategory" :id="idCatEl" />
  
            <AddBtn name="Ajouter un attribut" icon="mdi-tag-plus-outline" @open-dialog="ShowFormAttribute" />
            <FormAttribute :show="showFormAttributeValue" :referenceId="selectedZone.dynamicId"
              @close-dialog="ShowFormAttribute" @add-attribute="showAlert" />
  
            <h3>Attribut de la selection</h3>
  
            <div v-for="(item, index) in floorstaticDetails[0].attributsList" class="blocInformation">
              <div
                style="width: 100%; display: flex; justify-content: space-between; align-items:center; padding-inline: 10px; border-radius: 10px; position: relative;">
  
                <span
                  style=" text-wrap: nowrap; font-size: 19px; font-family: Arial, Helvetica, sans-serif; font-weight: bold;">{{
                    item.name }}</span>
                <div
                  style="display: flex; justify-content: space-between; align-items: center;  width: 100%; position: relative; padding-right: 10px;">
                  <OverMenu :show="itemOverflowMenu == item.dynamicId" @close="closeOverMenu" :item="item"
                    @showDoc="showDoc" @editFile="editCattattr(floorstaticDetails[0].dynamicId, item)"
                    @downloadFile="downloadFile" :showDocs="false" :showDownload="false" :editable="true"
                    @DeleteFile="deleteCateAttr(floorstaticDetails[0].dynamicId, item.dynamicId, 'parent')"
                    @changeOverflowItemMenu="changeOverflowItemMenu">
                  </OverMenu>
                </div>
              </div>
              <div v-if="floorstaticDetails[0].attributsList == null"
                style="justify-content: center; align-items: center; width: 100%; display: flex; margin-top: 10px; margin-bottom: 10px;">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
              </div>
              <div v-else class="inventory-container">
                <div class="inventory-item"
                  style=" width: 100%; color:#14202c;overflow: visible; padding: 16px; border-radius: 5px; padding-left: 6px; box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
                  v-for="(attr, index2) in item.attributs">
                  <li v-if="isLink(attr.value)" style="list-style: none; background-color: red; width: 95%;">
                    {{ attr.label }}:
                    <a :href="attr.value" target="_blank" style="color: #3498db;">{{ attr.value }} {{ attr.unit }}</a>
                  </li>
                  <li v-else style="list-style: none; width: 100%; overflow: hidden; overflow-x: auto;">
                    <span style="font-weight: 600;">
                      {{ attr.label }}:
                    </span>
                    <span style="font-weight: 400;">
                      {{ attr.value }} {{ attr.unit }}
                    </span>
                  </li>
  
                  <div
                    style="display: flex; justify-content: space-between; align-items: center;  width: 20px;  position: relative;">
                    <OverMenu :show="itemOverflowMenu == index2 && itemOverflowMenuAttr == item.dynamicId"
                      @close="closeOverMenu" :item="attr" @showDoc="showDoc"
                      @editFile="editattr(attr, floorstaticDetails[0].dynamicId, item)" @downloadFile="downloadFile"
                      :showDocs="false" :showDownload="false" :editable="true"
                      @DeleteFile="DeleteAttribut(floorstaticDetails[0].dynamicId, item.dynamicId, attr.label)"
                      @changeOverflowItemMenu="changeOverflowItemMenuAttr(index2, item.dynamicId)">
                    </OverMenu>
                  </div>
                </div>
              </div>
            </div>
  
            <h3 style="margin-top: 48px; border-bottom: 1px solid #dbdbdb;">Attribut des parents</h3>
  
            <!-- Section pour afficher les parentAttribut -->
            <div v-for="(parentItem, parentIndex) in parentAttribut" class="parentInformation" :key="parentIndex">
              <div v-for="(parentItems, parentIndexs) in parentItem">
                <div class="blocInformation" v-if="parentItems.documentation.categoryAttributes.length > 0">
                  <h3>{{ parentItems.name }}</h3>
                  <div v-for="(category, catIndex) in parentItems.documentation.categoryAttributes"
                    class="category-container" :key="catIndex">
                    <h3
                      style="font-size: 19px; font-family: Arial, Helvetica, sans-serif; font-weight: bold; margin-top: 10px;">
                      {{ category.name }}
                    </h3>
                    <div class="category-attributes"
                      style="color:#14202c;margin: 5px; padding: 16px; border-radius: 5px; padding-left: 6px; background-color: #f9f9f9; box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                      <li v-for="(attr, attrIndex) in category.attributs" :key="attrIndex">{{ attr.label }}: {{
                        attr.value
                        }}
                      </li>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- ONGLET TICKETS -->
          <div v-if="selection == 'Tickets'">
  
            <FormTicket :value="showFormTicket" @close-dialog="ShowDialog()" :selectedZone="selectedZone"
              @add-ticket="showAlert" />
            <AddTicketBtn @open-dialog="ShowDialog()" />
            <TicketTable :data="ticketsList" :config="''" @locate="" @display="" />
  
            <div v-if="ticketsList && ticketsList.length === 0"
              style="width: 100%; height: 200px; font-size: 20px ; display: flex; justify-content: center; align-items: center">
              <p>Aucun ticket disponible.</p>
            </div>
          </div>
  
          <div v-if="selection == 'Points de mesures'">
            <div v-for="(item, index) in floorstaticDetails[0].endpoints" :key="index" class="blocInformation">
              <div v-if="!floorstaticDetails[0].endpoints">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
              </div>
              <div v-else class="inventory-container">
                <div class="inventory-item"
                  style=" color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;width: 100%;">
                  <li style="    width: calc(100% - 30px);
      overflow: hidden;
      text-overflow: ellipsis;"> {{ item.name }}: {{ item.value }} {{ item.unit || '' }}</li>
  
                  <v-icon @click="() => {
                    fullData()
                    addOrRemove(item.dynamicId, item.name);
                    resize();
                  }"
                    v-if="endpointIdToDraw.includes(item.dynamicId) && !activeChartData.includes(item.dynamicId)">mdi-chart-line</v-icon>
                  <v-icon @click="() => {
                    addOrRemove(item.dynamicId, item.name);
                  }" v-if="activeChartData.includes(item.dynamicId)">mdi-close</v-icon>
  
                </div>
              </div>
            </div>
          </div>
  
          <div style="display: flex">
            <div style="width: 100%;" v-if="selection == 'Indicateur'">
              <div v-for="(item, index) in floorstaticDetails[0].controlEndpoint" class="blocInformation">
                <span style="font-size: 19px; font-family: Arial, Helvetica, sans-serif;font-weight: bold;">{{
                  item.profileName }}</span>
                <div v-if="floorstaticDetails[0].controlEndpoint == null"
                  style="justify-content: center;align-items: center;width: 100%;display: flex; margin-top: 10px ; margin-bottom: 10px;">
                  <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
                </div>
                <div v-else>
                  <div class="inventory-container"
                    v-for="(item, index2) in floorstaticDetails[0].controlEndpoint[index].endpoints" :key="index2">
                    <div class=" inventory-item"
                      :style="{ width: '100%', color: '#14202c', padding: '16px', borderRadius: '5px', paddingLeft: '6px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px' }">
                      <li style="    width: calc(100% - 30px);
      overflow: hidden;
      text-overflow: ellipsis;"> {{ item.name }}: {{ typeof item.value === 'number' ? item.value.toFixed(2) : item.value
      }} {{
                          item.unit }} </li>
                      <v-icon @click="() => {
                        fullData()
                        addOrRemove(item.dynamicId, item.name);
                        resize();
                      }"
                        v-if="cpIdToDraw.includes(item.dynamicId) && !activeChartData.includes(item.dynamicId)">mdi-chart-line</v-icon>
                      <v-icon @click="() => {
                        addOrRemove(item.dynamicId, item.name);
                      }" v-if="activeChartData.includes(item.dynamicId)">mdi-close</v-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- ONGLET INVENTAIRE -->
          <div v-if="selection == 'Inventaire'"
            style="display: flex; flex-direction: column; overflow: hidden !important; overflow-y: auto !important;">
  
            <div @click="fshowDialogInventory()" class="btn_inventory">
              <v-icon color="#14202c" size="35px">
                mdi-table-plus
              </v-icon>
              <div v-if="formattedInventory.length < 1" style="margin-top: 3px;margin-left: 10px;">
                Séléctionner un inventaire
              </div>
              <div v-else style="margin-top: 3px;margin-left: 10px;">
                Modifier l'inventaire Séléctionné
              </div>
            </div>
  
            <div class="inventory-wrapper">
              <div v-for="(category, index) in formattedInventory" :key="category.name" class="category-block">
                <div class="category-header" @click="toggle(index)">
                  <span class="category-title">{{ category.name }} ({{ category.groupItems.length }})</span>
                  <div>
                    <v-icon v-if="!groupColored.includes(category.name)" @click.stop="colorCategory(category)"
                      style="cursor: pointer; margin-left: 10px;">
                      mdi-invert-colors
                    </v-icon>
                    <v-icon v-else @click.stop="descolorCategory(category)" style="cursor: pointer; margin-left: 5px;">
                      mdi-invert-colors-off
                    </v-icon>
                    <span class="toggle-arrow">{{ openGroups.includes(index) ? '▲' : '▼' }}</span>
                  </div>
  
                </div>
  
                <!-- Liste déroulante -->
                <div v-if="openGroups.includes(index)" class="item-list">
                  <div v-for="item in category.groupItems" :key="item.id" class="item-row">
                    <span class="item-name">⎯ {{ item.name }}</span>
                    <div class="item-icons">
                      <!-- <v-icon v-if="coloredElement && !coloredElement.includes(item.dynamicId)"
                        @click="colorselected(item)" style="cursor: pointer; margin-left: 10px;">
                        mdi-invert-colors
                      </v-icon>
                      <v-icon v-if="coloredElement && coloredElement.includes(item.dynamicId)"
                        @click="descolorselected(item)"
                        :style="{ cursor: 'pointer', marginLeft: '10px', color: item.color }">
                        mdi-invert-colors-off
                      </v-icon> -->
                      <v-icon @click="zoomselected(item)" style="cursor: pointer; margin-left: 10px;">
                        mdi-magnify-plus-outline
                      </v-icon>
                      <v-icon @click="selectselected(item)" style="cursor: pointer; margin-left: 10px;">
                        mdi-select-place
                      </v-icon>
                      <v-icon @click="gotoselected(item)" style="cursor: pointer; margin-left: 10px;">
                        mdi-arrow-down-left-bold
                      </v-icon>
  
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
  
            <FormInventaire @inventory-loaded="handleInventory" :selectedId="stockedZone" :config="config"
              :typedata="typdata" :value="showDialogInventory" @close-dialog="fcloseDialogInventory"
              :selectedZone="selectedZone" @add-ticket="showAlert" />
          </div>
  
  
          <!-- ONGLET DOCUMENTATION -->
          <div v-if="selection == 'Documentation'"
            style="display: flex; flex-direction: column; overflow: hidden !important; overflow-y: auto !important ;">
            <v-row style="padding: 20px;">
              <AddBtn @open-dialog="ShowFormDoc" name="Ajouter un document" icon="mdi-file-plus-outline" />
            </v-row>
            <FormDoc :isDialogOpen="show_formdoc" @close-dialog="ShowFormDoc" @add-doc="showAlert"
              :referenceid="selectedZone.dynamicId" />
            <div style="width: 100%; flex-direction: column;">
              <h3>{{ floorstaticDetails[0].name }}</h3>
              <div class="blocInformation">
                <div v-if="documentation.element != 0">
  
                  <div
                    style="display: flex; justify-content: space-between; align-items: center;  width: 100%; position: relative;"
                    v-for="(item, index) in documentation.element">
                    <div class="inventory-item"
                      style="width: 100%;  overflow: hidden; color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
  
                      <li style="list-style: none;">
                        <v-icon :style="{ 'color': getIcon(item.Name).color }">{{ getIcon(item.Name).name }}</v-icon>
                        {{ item.Name }}
                      </li>
  
                    </div>
                    <OverMenu :show="itemOverflowMenu == item.dynamicId" @close="closeOverMenu" :item="item"
                      @showDoc="showDoc" @downloadFile="downloadFile"
                      @DeleteFile="DeleteFile(item.dynamicId, selectedZone.dynamicId, 'child')"
                      @changeOverflowItemMenu="changeOverflowItemMenu">
                    </OverMenu>
                  </div>
                  <Loader :showLoader="showLoader_in_child" />
                </div>
                <div v-else style="width: 100%; text-align: center;">
                  <p>Aucun document</p>
                </div>
              </div>
            </div>
  
            <h3 style="border-bottom: 1px solid #d7d7d7; margin-top: 48px">Documents des Parents</h3>
            <br>
            <div v-for="(parent, index) in documentation.parents" :key="index">
              <div v-if="parent.documentation && parent.documentation.length > 0">
                <h3>{{ parent.name }}</h3>
                <div class="blocInformation">
                  <div style="display: flex; position: relative; align-items: center "
                    v-for="(item, index2) in parent.documentation" :key="index2">
                    <div class="inventory-item"
                      style="max-width: 100%; width: 99%;  overflow: hidden; color:#14202c;padding: 16px;border-radius: 5px;padding-left: 6px ;background-color: #f9f9f9;box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;">
                      <li style="list-style: none;">
                        <v-icon :style="{ 'color': getIcon(item.Name).color }">{{ getIcon(item.Name).name }}</v-icon>
                        {{ item.Name }}
                      </li>
                    </div>
  
                    <OverMenu :show="itemOverflowMenu == item.dynamicId" @close="closeOverMenu" :item="item"
                      @showDoc="showDoc" @downloadFile="downloadFile"
                      @DeleteFile="DeleteFile(item.dynamicId, parent.dynamicId, 'parent')"
                      @changeOverflowItemMenu="changeOverflowItemMenu">
                    </OverMenu>
  
                  </div>
                  <Loader :showLoader="showLoader_in_parent" />
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div @click="isapp = !isapp" :title="isapp ? 'Information du bâtiment' : 'Liste des applications'"
          class="description">
          <span class="color-span"
            style="font-size: 19px; font-family: Arial, Helvetica, sans-serif; font-weight: bold; margin-left: 9px;">
            <div class="color"
              style="border: 3px dashed #dbdbdb; width: 71px; height: 71px; border-radius: 5px; display: flex; justify-content: center; align-items: center;">
              <v-icon v-if="!isapp" style="transform: translate(0,1px);" size="58">mdi-apps</v-icon>
              <v-icon v-else style="transform: translate(0,1px);" size="58">mdi-list-box</v-icon>
            </div>
          </span>
  
          <div v-if="filteredApp" class="app_access" @click.stop="handleClick">
            <div class="app_access_fl">
              <v-icon size="25">mdi-application-import</v-icon>
            </div>
            <div>
              ACCÉDER À L'APPLICATION {{ filteredApp.name }}
            </div>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { Prop, Vue, Watch } from "vue-property-decorator";
  import { PAGE_STATES } from "../../interfaces/pageStates";
  import Component from "vue-class-component";
  import SpriteComponentMobile from "./SpriteComponentMobile.vue";
  import { IConfig, ITemporality } from "../../interfaces/IConfig";
  import { ISpaceSelectorItem } from "global-components";
  import { ActionTypes } from "../../interfaces/vuexStoreTypes";
  import lodash from "lodash";
  import { State } from "vuex-class";
  import { MutationTypes } from "../../services/store/appDataStore/mutations";
  import { mapState } from "vuex";
  import SpriteComponent from "./SpriteComponent.vue"
  import SpriteComponent2 from "./SpriteComponent2.vue"
  import GroupDataView from "./groupDataView.vue";
  import BreadcrumbSelector from "./breadcrumb.vue";
  import { computed } from 'vue';
  import Alert from '../Alert.vue'
  import ShowDocumentation from '../Documentation.vue'
  import {
    EmitterViewerHandler,
    VIEWER_AGGREGATE_SELECTION_CHANGED,
  } from "spinal-viewer-event-manager";
  import TicketTable from "./DataTable.vue";
  import LineCardComponent from "./LineCardComponent.vue";
  import FastLineCardComponent from "./FastLineCardComponent.vue";
  import moment from 'moment';
  import FormTicket from "../FormTicket.vue";
  import FormInventaire from "../FormInventaire.vue";
  import AddTicketBtn from "../ButtonAddticket.vue";
  import FormDoc from "../FormDoc.vue";
  import FormDocAttr from "../FormDocAttr.vue";
  import FormDocCateAttr from "../FormDocCateAttr.vue";
  import AddBtn from '../ButtonAdd.vue';
  import Loader from "../Loader.vue";
  import getIcon from "../../services/function/getIcon";
  import FormAttribute from '../FormAttribute.vue';
  import OverMenu from "./OverMenu.vue";
  import ConfirmDelete from "./ConfirmDelete.vue";
  import ProgressBar from "./ProgressBar.vue";
  import { EventBus } from '../../../../../global-components/SpaceSelector/eventBus';
  import { getViewInfoReactive } from '../../../../../global-components/viewer/requests/GeographicContext/ViewInfoMemory';
  
  import { error, log } from "console";
  
  @Component({
    components: {
      GroupDataView,
      SpriteComponentMobile,
      BreadcrumbSelector,
      LineCardComponent,
      FormTicket,
      AddTicketBtn,
      Alert,
      ShowDocumentation,
      FormDoc,
      FormDocAttr,
      AddBtn,
      Loader,
      FormAttribute,
      OverMenu,
      FormDocCateAttr,
      ConfirmDelete,
      ProgressBar,
      TicketTable,
      FormInventaire,
      FastLineCardComponent
    },
    filters: {},
  })
  class dataSideApp extends Vue {
  
    @Prop() config!: IConfig;
    @Prop() selectedZone: ISpaceSelectorItem;
    @Prop() data: any[];
    @Prop() floor: any;
    @Prop() DActive: boolean;
    @Prop() ActiveData: boolean;
    @Prop() changeData: boolean;
  
    showFormTicket: boolean = false;
    isapp: boolean = false;
    showDocvalue: boolean = false;
    PAGE_STATES: typeof PAGE_STATES = PAGE_STATES;
    pageSate: PAGE_STATES = PAGE_STATES.loading;
    isBuildingSelected: boolean = true;
    retry: Function;
    referenceObjects: any[];
    inventory: any;
    openGroups: any[] = [];
    appTab: any[] = [];
    dataListInfo: any[] = [];
    inventoyList: any = null;
    spaceInventoryData: any = null;
    inventoryDbids: any = null;
    floorstaticDetails: any = [];
    endpointProfil: any = null;
    buildingInfo: any;
    attributProfil: any = null;
    formattedInventory: any[] = [];
    selection: string = 'Vue Globale';
    searchName: string = '';;
    documentation: any;
    modefull = false;
    isSmallScreen: any;
    displaySprite: boolean = false;
    parentAttribut: any = [];
    ticketsList: any = [];
    eyes: any = {};
    ink: any = {};
    dialog3: boolean = false;
    col: any = {};
    referencedId: any = 0;
    stockedZone: any = 0;
    referencedType: any = 'building';
    cpIdToDraw: [];
    endpointIdToDraw: [];
    beginDate: any = null
    endDate: any = null
    dataTable: any = [];
    activeChart: any = []
    labelsChart: any = null
    chartData: any = null
    t_index: number = 0;
    timeactuelle: string = "date ?"
    listWorkFlow: any = null;
    alert_ind = ''
    type_alert = ''
    alert = false
    idDoc: number = 0
    nameFile = ''
    show_formdoc = false
    showLoader = false
    showFormAttributeValue = false
    showLoader_in_child = false
    showLoader_in_parent = false
    selectedAttribut = null
    getIcon = getIcon
    itemOverflowMenu = null
    itemOverflowMenuAttr = null
    ShowFormDocAttrs = false
    ShowFormDocCat = false
    allColored = false
    showDialogInventory = false
    idEl = null
    itemOp = null
    selectedCategory = null
    idCatEl = null
    activeChartData: any = []
    coloredElement: any = []
    coloredRoom: any = []
    groupColored: any = []
    confirmIdReferenceDelete: number | null = null
    confirmIdFileDelete: number | null = null
    showConfirmDelete = false
    contextFile = ''
    data_loading = 0
    interval: {}
    formattedInventoryiconColors: Record<string, string> = {};
    iconColors: Record<string, string> = {};
    stockedData: any = []
    typdata = 'building'
    currentId = 0;
    viewInfo = null
    state = getViewInfoReactive();
  
    get dynamicItems(): string[] {
      let items = ['Vue Globale', 'Attribut', 'Documentation', 'Tickets', 'Inventaire'];
      console.log(this.floorstaticDetails, ' les floors');
  
  
      if (this.floorstaticDetails.some(detail =>
        detail?.controlEndpoint?.some(endpoint => endpoint?.endpoints?.length > 0)
      )) {
        items.push('Indicateur');
      }
      if (this.formattedData.length) {
        items.splice(1, 0, 'Liste');
      }
      if (this.floorstaticDetails.some(detail =>
        detail?.endpoints && detail.endpoints.length > 0
      )) {
        items.push('Points de mesures');
      }
  
      return items;
    }
  
    public get selectedZoneType(): ISpaceSelectorItem {
      return this.$store.state.appDataStore.zoneSelected.type;
    }
  
    get dynamicHeaders() {
      const hasValidArea = this.formattedData.some(item => item.area !== 'N/A' && item.area !== null && item.area !== '');
  
      return this.headers.filter(header => {
        if (header.value === 'area') {
          return hasValidArea;
        }
        return true;
      });
    }
  
    get filteredApp(): { name: string; onglet: string; id: string } | null {
      const app = this.appTab.find(app => app.onglet === this.selection);
      return app ? { name: app.name, onglet: app.onglet, id: app.id } : null;
    }
  
    handleClick() {
      if (this.filteredApp) {
        this.$emit('changeRoute', this.filteredApp.id);
      }
    }
  
    toggle(index) {
      if (!this.openGroups.includes(index)) {
        this.openGroups.push(index);
      } else {
        this.openGroups = this.openGroups.filter(i => i !== index);
      }
    }
  
  
    get filteredData() {
      return this.searchName
        ? this.formattedData.filter(item =>
          item.name.toLowerCase().includes(this.searchName.toLowerCase())
        )
        : this.formattedData;
    }
  
  
    get temporality() {
      return this.$store.state.appDataStore.temporalitySelected.name;
    }
  
    get formattedData() {
      const data = (this.dataListInfo?.[0] || []).map(space => {
        let area = null;
  
        if (space.categories && Array.isArray(space.categories)) {
          space.categories.forEach(category => {
            const areaAttr = category.attributs?.find(attr => attr.label === 'area');
            if (areaAttr) {
              const roundedArea = Math.round(parseFloat(areaAttr.value));
              area = `${roundedArea} m²`;
            }
          });
        }
  
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  
        const bimData = space.bimFileId && space.dbid ? { bimFileId: space.bimFileId, dbid: space.dbid } : {};
  
        return {
          name: space.name,
          type: space.type,
          area: area || 'N/A',
          actions: space,
          color: randomColor,
          staticId: space.staticId,
          dynamicId: space.dynamicId,
          ...bimData
        };
      });
  
      this.stockedData = data;
  
      return data;
    }
  
    headers = [
      { text: 'Nom', value: 'name', sortable: false },
      { text: 'Type', value: 'type' },
      { text: 'Surface (m²)', value: 'area' },
      { text: 'Color', value: 'color', sortable: false },
      { text: 'Select', value: 'Select', sortable: false },
      { text: 'GoTo', value: 'GOTO', sortable: false },
      { text: 'Zoom', value: 'Zoom', sortable: false },
    ];
  
    async descolorAll() {
      this.allColored = false
  
      const buildingId = sessionStorage.getItem("idBuilding");
  
      const itemsToDescolor = this.stockedData.map(item => ({
        buildingId: buildingId,
        dynamicId: item.dynamicId,
        color: null,
        floorId: this.$store.state.appDataStore.zoneSelected.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId,
      }));
  
      await this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToDescolor,
        buildingId: buildingId,
      });
  
      this.coloredElement = [];
    }
  
    handleInventory(data) {
  
      if (Array.isArray(data) && data[0]?.inventory) {
        // cas building : on fusionne les inventories avec le floorId comme préfixe
        this.formattedInventory = data.flatMap(d =>
          d.inventory.map(cat => ({
            ...cat,
            name: `${d.floorName} : ${cat.name}`,
          }))
        );
      } else if (Array.isArray(data)) {
        this.formattedInventory = data;
      } else {
        this.formattedInventory = [data];
      }
    }
  
    colorAll() {
      this.allColored = true
  
      const buildingId = sessionStorage.getItem("idBuilding");
  
      const itemsToColor = this.stockedData.map(item => ({
        buildingId: buildingId,
        dynamicId: item.dynamicId,
        color: item.color,
        floorId: this.$store.state.appDataStore.zoneSelected.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId,
      }));
  
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: buildingId,
      });
  
      // Ajoute tous les dynamicId à coloredElement
      this.coloredElement.push(...this.stockedData.map(item => item.dynamicId));
    }
  
    fshowDialogInventory() {
      this.showDialogInventory = true
      this.currentId = this.$store.state.appDataStore.zoneSelected.dynamicId
    }
    fcloseDialogInventory() {
      this.showDialogInventory = false
    }
  
    ShowDialog() {
  
      this.showFormTicket = !this.showFormTicket;
    }
    ShowFormDoc() {
      this.show_formdoc = !this.show_formdoc;
    }
    ShowFormDocAttr() {
      this.ShowFormDocAttrs = !this.ShowFormDocAttrs;
    }
    ShowFormDocCate() {
      this.ShowFormDocCat = !this.ShowFormDocCat;
    }
    ShowFormAttribute() {
      this.showFormAttributeValue = !this.showFormAttributeValue;
      if (this.showFormAttributeValue == false) {
        this.getdataofelement()
      }
    }
    async showAlert(v) {
      const buildingId = sessionStorage.getItem("idBuilding");
      if (v.status === 'success') {
        this.alert = true
        this.alert_ind = v.message
        this.type_alert = v.status
  
        switch (v.context) {
          case 'ticket':
            const parentPromise = [
              this.$store.dispatch(ActionTypes.GET_TICKET, {
                buildingId: buildingId,
                referenceIds: this.selectedZone.dynamicId,
              }),
            ];
            const resultParent = await Promise.all(parentPromise);
            const tickets = resultParent;
            this.ticketsList = tickets[0].reverse();
            break;
          case 'document':
            const parentPromiseDoc = [
              this.$store.dispatch(ActionTypes.GET_PARENT, {
                buildingId: buildingId,
                referenceIds: this.selectedZone.dynamicId,
              }),
            ];
            const resultParentDoc = await Promise.all(parentPromiseDoc);
            const parents = resultParentDoc[0];
  
            const documentationPromise = await this.getfetchDocRetry()
            const documentation = documentationPromise;
  
  
            let parentDocumentation = {};
            for (let parent of parents) {
              const parentDocPromise = [
                this.$store.dispatch(ActionTypes.GET_DOCUMENTATION, {
                  buildingId: buildingId,
                  referenceIds: parent.dynamicId,
                }),
              ];
              const parentDocResult = await Promise.all(parentDocPromise);
              parentDocumentation[parent.dynamicId] = {
                name: parent.name,
                dynamicId: parent.dynamicId,
                documentation: parentDocResult[0]
              };
            }
  
            this.documentation = {
              element: documentation,
              parents: parentDocumentation
            };
            break;
          default:
            break;
        }
  
      } else {
        this.alert = true
        this.alert_ind = v.message
        this.type_alert = v.status
      }
  
    }
    updateCloseConfirmDelete(value) {
      this.showConfirmDelete = false
    }
    async getfetchDocRetry() {
      const max = 10;
      const delay = 1000;
      for (let i = 0; i < max; i++) {
        const result = this.$store.dispatch(ActionTypes.GET_DOCUMENTATION, {
          buildingId: sessionStorage.getItem("idBuilding"),
          referenceIds: this.selectedZone.dynamicId,
        })
        const documentation = await result.then((res => {
          return res
        }))
  
        if (documentation.lenght != 0 && documentation[documentation.length - 1] && documentation[documentation.length - 1].dynamicId) {
          return documentation;
  
        } else if (documentation.length == 0) {
          return documentation;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      throw new Error('Error');
    }
  
  
    async editattr(attr, id, item) {
      this.ShowFormDocAttrs = true
      this.selectedAttribut = attr
      this.idEl = id
      this.itemOp = item
    }
  
    async editCattattr(id, item) {
      this.ShowFormDocCat = true
      this.selectedCategory = item
      this.idCatEl = id
    }
  
    async DeleteFile(fileId: number, referenceId: number, space: string) {
      this.confirmIdFileDelete = fileId
      this.confirmIdReferenceDelete = referenceId
      this.showConfirmDelete = true
      this.contextFile = space
      this.closeOverMenu()
  
    }
  
    async DeleteAttribut(referenceId: number, cateId: number, name: string) {
      const result = await this.$store.dispatch(ActionTypes.DELETE_ATTRIBUT, {
        buildingId: sessionStorage.getItem("idBuilding"),
        referenceId: referenceId,
        cateId: cateId,
        name: name
      })
      result.status == 200 ? this.showAlert({ status: 'success', message: 'Attribut supprimé avec succès', context: 'Attribut' }) :
        this.showAlert({ status: 'error', message: "Erreur lors de la suppression de l'attribut", context: 'document', space_context: name })
      this.getdataofelement()
    }
  
    async UpdateAttribut(referenceId: number, cateId: number, name: string, item: object) {
  
  
      const result = await this.$store.dispatch(ActionTypes.UPDATE_ATTRIBUT, {
        buildingId: sessionStorage.getItem("idBuilding"),
        referenceId: referenceId,
        cateId: cateId,
        name: name,
        item: item
      })
      result.status == 200 ? this.showAlert({ status: 'success', message: 'Attribut modifié avec succès', context: 'Attribut' }) :
        this.showAlert({ status: 'error', message: "Erreur lors de la mise à jour de l'attribut", context: 'document', space_context: name })
      this.getdataofelement()
    }
  
    async deleteCateAttr(referenceId: number, cateId: number, name: string) {
  
  
      const result = await this.$store.dispatch(ActionTypes.DELETE_CATE_ATTRIBUT, {
        buildingId: sessionStorage.getItem("idBuilding"),
        referenceId: referenceId,
        cateId: cateId
      })
      result.status == 200 ? this.showAlert({ status: 'success', message: 'Catégory supprimé avec succès', context: 'catégory attribut' }) :
        this.showAlert({ status: 'error', message: "Erreur lors de la suppression de la catégorie", context: 'cétegory', space_context: name })
      this.getdataofelement()
    }
  
  
    async updateCateAttr(referenceId: number, cateId: number, name: string, item: object) {
  
      const result = await this.$store.dispatch(ActionTypes.UPDATE_CATE_ATTRIBUT, {
        buildingId: sessionStorage.getItem("idBuilding"),
        referenceId: referenceId,
        cateId: cateId,
        item: item
      })
      result.status == 200 ? this.showAlert({ status: 'success', message: 'Catégory edité avec succès', context: 'catégory attribut' }) :
        this.showAlert({ status: 'error', message: "Erreur lors de l'edit de la catégorie", context: 'cétegory', space_context: name })
      this.getdataofelement()
    }
  
    handleValidated(updatedItem, el, dyn, item) {
  
      const formattedItem = {
        attributeLabel: updatedItem.label,
        attributeUnit: updatedItem.unit,
        attributeValue: updatedItem.value,
      };
  
      this.UpdateAttribut(item, el.dynamicId, dyn.label, formattedItem)
    }
  
    handleValidatedCate(id, cateId, item) {
  
  
      const formattedItem = {
        "categoryName": item.name,
      };
  
      this.updateCateAttr(id, cateId, 'category', formattedItem)
    }
  
    showDoc(referencedId, nameFile) {
      if (!this.showDocvalue) {
        this.$emit('buttonClicked', 'vueDoc')
      }
      this.nameFile = nameFile
      this.idDoc = referencedId
      this.showDocvalue = true;
    }
  
    closeVueDoc() {
      if (this.showDocvalue) {
        this.showDocvalue = false;
        this.$emit('buttonClicked', 'vueDocClose')
      }
  
    }
    resize() {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 1);
    }
  
    changeOverflowItemMenu(index) {
      const latItem = this.itemOverflowMenu
      if (latItem === index) {
        this.itemOverflowMenu = null
      } else {
        this.itemOverflowMenu = index
      }
    }
  
    changeOverflowItemMenuAttr(index, item) {
      const latItem = this.itemOverflowMenu
      const itemCateg = item;
      if (latItem === this.itemOverflowMenu && this.itemOverflowMenuAttr === itemCateg) {
        this.itemOverflowMenuAttr = null
      } else {
        this.itemOverflowMenuAttr = itemCateg
        this.itemOverflowMenu = index
      }
  
    }
  
  
    closeOverMenu() {
      this.itemOverflowMenu = null
    }
  
    changeIcon() {
      this.modefull = !this.modefull
    }
  
    isLink(value) {
      return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
    }
  
    async deleteIconElement(item, categoryName) {
      this.$store.dispatch(ActionTypes.REMOVE_SPRITES_BY_GROUP, item + categoryName);
    }
  
    async colorElement(item, categoryName) {
      const element = Object.keys(this.$store.state.appDataStore.rooms)
      const secondKey = element[this.$store.state.appDataStore.zoneSelected.parent - 1];
  
      const itemType = item.substring(item.indexOf(' ') + 1);
  
      const categoryData = this.inventoryDbids[categoryName];
      if (!categoryData || !categoryData[itemType]) {
        console.warn(`⚠ Aucun élément trouvé pour "${item}" dans la catégorie "${categoryName}".`);
        return;
      }
  
      const groupData = categoryData[itemType];
      const buildingId = sessionStorage.getItem("idBuilding");
      const itemsToColor = [];
      for (const [bimFileId, entries] of Object.entries(groupData)) {
        entries.forEach(equipment => {
          this.$set(this.iconColors, `${categoryName}-${item}`, equipment.color);
          itemsToColor.push({
            buildingId: buildingId,
            dynamicId: equipment.dynamicId,
            dbid: equipment.dbid,
            bimFileId,
            color: equipment.color,
            floorId: this.$store.state.appDataStore.zoneSelected.dynamicId || secondKey,
          });
        });
      }
      // console.log(itemsToColor , ' jemaaa');
  
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: buildingId,
      });
    }
  
    async gotoselected(item) {
      if (sessionStorage.getItem("viewer_loaded") != "unload")
        this.$emit("gotoView", item);
    }
  
    async zoomselected(item) {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      this.$store.dispatch(ActionTypes.FIT_TO_VIEW_ITEMS, [{ buildingId: buildingId, dynamicId: item.dynamicId }]);
    }
  
    async selectselected(item) {
  
      const buildingId = sessionStorage.getItem("idBuilding");
  
      if (item.type == "geographicRoom") {
  
        const referenceIds = [item.dynamicId]
        const promises = [
          this.$store.dispatch(ActionTypes.GET_REFERENCE_OBJECT_LIST_MULTIPLE, {
            buildingId,
            referenceIds
          }),
        ];
        const result = await Promise.all(promises);
  
        const solObjects = result[0][0].infoReferencesObjects.filter(refObj => refObj.name.includes("Sol"));
  
        if (solObjects.length === 0) {
          console.warn("Aucun objet contenant 'Sol' trouvé");
          return;
        }
  
        const firstSol = solObjects[0];
  
  
        const itemsToColor = {
          buildingId: buildingId,
          dynamicId: item.dynamicId,
          floorId: this.$store.state.appDataStore.zoneSelected.dynamicId,
          staticId: firstSol.staticId,
          type: firstSol.type,
          name: item.name
        };
  
        console.warn(itemsToColor, 'ite to color');
  
        // Envoi via le store
        await this.$store.dispatch(ActionTypes.SELECT_ITEMS, itemsToColor);
  
      }
      else {
  
        const itemsToColor = {
          buildingId: buildingId,
          dynamicId: item.dynamicId,
          color: item.color,
          floorId: this.$store.state.appDataStore.zoneSelected.dynamicId,
          staticId: item.staticId,
          type: item.type,
          name: item.name
        }
  
        await this.$store.dispatch(ActionTypes.SELECT_ITEMS, itemsToColor);
      }
    }
    async colorselected(item) {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      const itemsToColor = [{
        buildingId: buildingId,
        dynamicId: item.dynamicId,
        color: item.color,
        floorId: this.$store.state.appDataStore.zoneSelected.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId,
      }]
  
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: buildingId,
      });
  
      this.coloredElement.push(item.dynamicId);
  
    }
  
    async descolorselected(item) {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      const itemsToColor = [{
        buildingId: buildingId,
        dynamicId: item.dynamicId,
        color: null,
        floorId: this.$store.state.appDataStore.zoneSelected.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId,
      }]
  
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: buildingId,
      });
      if (this.coloredElement) {
        this.coloredElement = this.coloredElement.filter(id => id !== item.dynamicId);
      }
  
    }
  
  
    async colorCategory(category) {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      // Utilise la couleur du premier item du groupe comme couleur commune
      const commonColor = category.groupItems[0]?.color || '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); // rouge par défaut si aucune couleur définie
  
  
      // Mets à jour tous les items du groupe avec la même couleur
      for (const item of category.groupItems) {
        item.color = commonColor;
      }
  
      const itemsToColor = category.groupItems.map(item => ({
        buildingId: buildingId,
        dynamicId: item.dynamicId,
        color: commonColor,
        floorId: this.$store.state.appDataStore.zoneSelected.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId,
      }));
  
      await this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: buildingId,
      });
  
      for (const item of category.groupItems) {
        if (!this.coloredElement.includes(item.dynamicId)) {
          this.coloredElement.push(item.dynamicId);
        }
      }
  
      if (!this.groupColored.includes(category.name)) {
        this.groupColored.push(category.name);
      }
    }
  
  
  
    async descolorCategory(category) {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      const itemsToColor = category.groupItems.map(item => ({
        buildingId: buildingId,
        dynamicId: item.dynamicId,
        color: null,
        floorId: this.$store.state.appDataStore.zoneSelected.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId,
      }));
  
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: buildingId,
      });
  
      // Supprime les items de coloredElement
      this.coloredElement = this.coloredElement.filter(
        id => !category.groupItems.some(item => item.dynamicId === id)
      );
  
      // Supprime le groupe de groupColored
      this.groupColored = this.groupColored.filter(name => name !== category.name);
    }
  
  
    async descolorElement(item, categoryName) {
  
      const itemType = item.substring(item.indexOf(' ') + 1);
  
      const categoryData = this.inventoryDbids[categoryName];
      if (!categoryData || !categoryData[itemType]) {
        console.warn(`⚠ Aucun élément trouvé pour "${item}" dans la catégorie "${categoryName}".`);
        return;
      }
  
      const groupData = categoryData[itemType];
      const buildingId = sessionStorage.getItem("idBuilding");
      const itemsToColor = [];
      for (const [bimFileId, entries] of Object.entries(groupData)) {
        entries.forEach(equipment => {
          itemsToColor.push({
            buildingId: buildingId,
            dynamicId: equipment.dynamicId,
            dbid: equipment.dbid,
            bimFileId,
            color: null,
            floorId: this.$store.state.appDataStore.zoneSelected.dynamicId,
          });
        });
      }
  
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: buildingId,
      });
    }
  
  
  
  
    getColorForGroup(categoryName, groupIndex) {
      const category = this.spaceInventoryData.find(item => item.category === categoryName);
      return category.groups[groupIndex].color// Retourne la couleur stockée ou noir par défaut
    }
  
    colorSpace(categoryName, groupIndex) {
      const buildingId = sessionStorage.getItem("idBuilding");
      //console.log(this.spaceInventoryData.find(item => item.category === categoryName));
      const category = this.spaceInventoryData.find(item => item.category === categoryName);
      if (!category) return console.warn(`Catégorie "${categoryName}" non trouvée`);
  
      const group = category.groups[groupIndex];
      const infocolor = category.groups[groupIndex].color
      if (!group) return console.warn(`Groupe à l'index ${groupIndex} non trouvé dans "${categoryName}"`);
  
      if (!group.rooms || group.rooms.length === 0) {
        return console.warn(`Aucune room à colorer pour "${group.groupName}"`);
      }
  
      const floorId = this.$store.state.appDataStore.zoneSelected.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId;
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const itemsToColor = group.rooms.map(room => ({
        buildingId: buildingId,
        dynamicId: room.dynamicId,
        color: infocolor || randomColor,
        floorId: floorId,
      }));
  
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToColor,
        buildingId: buildingId,
      });
  
      const color = infocolor || randomColor
  
      this.coloredRoom.push({ category: categoryName, groupIndex, color });
  
    }
  
  
    descolorSpace(categoryName, groupIndex) {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      const category = this.spaceInventoryData.find(item => item.category === categoryName);
      if (!category) return console.warn(`Catégorie "${categoryName}" non trouvée`);
  
      const group = category.groups[groupIndex];
      if (!group) return console.warn(`Groupe à l'index ${groupIndex} non trouvé dans "${categoryName}"`);
  
      if (!group.rooms || group.rooms.length === 0) {
        return console.warn(`Aucune room à décolorer pour "${group.groupName}"`);
      }
  
      const floorId = this.$store.state.appDataStore.zoneSelected.dynamicId || this.$store.state.appDataStore.buildingInfo.dynamicId;
  
      const itemsToDescolor = group.rooms.map(room => ({
        buildingId: buildingId,
        dynamicId: room.dynamicId,
        color: null,
        floorId: floorId,
      }));
  
      this.$store.dispatch(ActionTypes.COLOR_ITEMS, {
        items: itemsToDescolor,
        buildingId: buildingId,
      });
  
      this.coloredRoom = this.coloredRoom.filter(item =>
        !(item.category === categoryName && item.groupIndex === groupIndex)
      );
  
    }
  
  
  
    async showIconElement(item, categoryName) {
  
      const itemType = item.substring(item.indexOf(' ') + 1);
  
      const categoryData = this.inventoryDbids[categoryName];
      if (!categoryData || !categoryData[itemType]) {
        console.warn(`⚠ Aucun élément trouvé pour "${item}" dans la catégorie "${categoryName}".`);
        return;
      }
  
      const groupData = categoryData[itemType];
  
      const equipmentMap = {};
      for (const [bimFileId, entries] of Object.entries(groupData)) {
        entries.forEach(equipment => {
          equipmentMap[equipment.dynamicId] = {
            dbid: equipment.dbid,
            bimFileId,
            color: equipment.color
          };
        });
      }
  
      const uniqueReferenceIds = Object.keys(equipmentMap).map(id => Number(id));
  
      if (uniqueReferenceIds.length === 0) {
        return;
      }
  
      const buildingId = sessionStorage.getItem("idBuilding");
      const batchSize = 50;
      const batchedPromises = [];
  
      for (let i = 0; i < uniqueReferenceIds.length; i += batchSize) {
        const batch = uniqueReferenceIds.slice(i, i + batchSize);
  
        batchedPromises.push(
          this.$store.dispatch(ActionTypes.GET_ATTRIBUT_LIST_MULTIPLE, {
            buildingId,
            referenceIds: batch,
          })
        );
      }
  
      const results = await Promise.all(batchedPromises);
  
      const flatResults = results.flat();
  
      flatResults.forEach(obj => {
        const ref = equipmentMap[obj.dynamicId];
        if (!ref) {
          return;
        }
  
        let center = null;
        obj.categoryAttributes.forEach(category => {
          category.attributs.forEach(attr => {
            if (attr.label === "XYZ center") {
              const values = attr.value.split(";").map(Number);
              if (values.length === 3) {
                center = { x: values[0], y: values[1], z: values[2] };
              }
            }
          });
        });
  
        if (!center) {
          return;
        }
  
  
        const wrappedResult = [obj];
  
        this.$set(this.iconColors, `${categoryName}-${item}`, ref.color);
  
        this.forgeVignette(wrappedResult, buildingId, ref.dbid, ref.bimFileId, center, item, categoryName, ref.color);
      });
    }
  
  
  
  
  
  
    hideelement(item, categoryName) {
  
      this.$store.commit(MutationTypes.REMOVE_ITEM_TO_HIDE);
  
      const itemType = item.substring(item.indexOf(' ') + 1);
  
      const categoryData = this.inventoryDbids[categoryName];
      if (!categoryData || !categoryData[itemType]) {
        console.warn(`Aucun élément trouvé pour "${item}" dans la catégorie "${categoryName}".`);
        return;
      }
  
      const groupData = categoryData[itemType];
  
      const itemToHide = {};
      for (const [bimFileId, entries] of Object.entries(groupData)) {
        itemToHide[bimFileId] = [...new Set(entries.map(equipment => equipment.dbid))];
      }
  
      if (Object.keys(itemToHide).length === 0) {
        console.warn(`Aucun élément trouvé à cacher pour "${item}" dans la catégorie "${categoryName}".`);
        return;
      }
  
      const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query };
      const data = {
        buildingId: this.selectedZone.staticId,
        dynamicId: currentQuery.spaceSelectedId,
        itemToHIde: itemToHide,
      };
  
      this.$store.commit(MutationTypes.SET_ITEM_TO_HIDE, itemToHide);
  
      this.$store.dispatch(ActionTypes.HIDE_ITEMS, {
        items: data,
        buildingId: this.selectedZone.staticId,
      });
    }
  
  
    gestionBouton() {
      if (!this.displaySprite) {
        this.$emit('full3D', 'full3D');
        this.resize();
        this.changeIcon()
      } else {
        this.displaySprite = false
      }
    }
  
    async mounted() {
  
  
      this.watchData();
  
      // if(this.)
      // this.countSpaceInventory()
  
      document.querySelectorAll('.v-input__icon').forEach(el => {
        el.style.width = '150%';
        el.style.height = '50px';
        el.style.position = 'absolute';
        el.style.transform = 'translate(-51%, -28%)';
      });
  
  
      EventBus.$on('vignette', async (data) => {
        const buildingId = sessionStorage.getItem("idBuilding");
        const promises = [
          this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
            buildingId,
            referenceIds: data.dynamicId
          }),
        ];
  
  
        const result = await Promise.all(promises);
        this.forgeItem(result, buildingId, data.dbid, data.bimFileId, data.position)
  
        return;
  
      });
  
      EventBus.$on('loadedviewer', async (data) => {
        this.$store.dispatch(ActionTypes.FIT_TO_VIEW_ITEMS, [{ dynamicId: this.selectedZone.dynamicId }]);
  
      });
  
  
  
      this.timeactuelle = this.getFormattedDateFromTemporalData();
      await this.getBuildingInfo();
  
      if (this.selectedZone.type == "building" || window.parent.router.query.spaceSelectedId == this.buildingInfo[0].dynamicId) {
        this.loadBuildingInfo()
      }
  
      const emitterHandler = EmitterViewerHandler.getInstance();
      emitterHandler.on(VIEWER_AGGREGATE_SELECTION_CHANGED, (data) => {
  
        if (data)
          this.findDynamicIdByDbid(data[0].dbIds[0], data[0]);
  
      });
      this.pageSate = PAGE_STATES.loaded;
      this.isBuildingSelected = true;
  
      this.data_loading += 15
  
  
      // this.$nextTick(() => {
      //   console.warn('je suis monté', this.selectedZone, this.$store.state.appDataStore.zoneSelected.type);
      // });
  
    }
  
    async loadBuildingInfo() {
      await this.getBuildingInfo();
  
      this.typdata = 'building'
  
      if (this.buildingInfo[0].dynamicId) {
  
        const result = await this.getBuildingStaticDetails();
  
        this.floorstaticDetails = result
        this.filteredEndpoints('building')
        this.getDocumentation(result)
        this.getListinfo('building', 0)
        this.getTicket(result)
        this.filtredAttribut('building')
        this.$forceUpdate();
        this.createApp()
  
      }
    }
  
  
    async getTicket(data) {
      const buildingId = sessionStorage.getItem("idBuilding");
      const elementDynamicId = data[0].dynamicId
  
      const parentPromise = [
        this.$store.dispatch(ActionTypes.GET_TICKET, {
          buildingId: buildingId,
          referenceIds: elementDynamicId,
        }),
      ];
  
      const resultParent = await Promise.all(parentPromise);
  
      const tickets = resultParent;
      this.ticketsList = tickets[0].reverse();
  
    }
  
  
  
    getFormattedDateFromTemporalData() {
      const temporality = this.$store.state.appDataStore.temporalitySelected.name;
      const t_index = this.t_index || 0;
      let formattedDate;
  
      switch (temporality) {
        case ITemporality.hour:
          formattedDate = moment().add(t_index, 'hours').startOf('hour').format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.day:
          formattedDate = moment().add(t_index, 'days').startOf('day').format('DD-MM-YYYY');
          break;
        case ITemporality.week:
          const weekStart = moment().add(t_index, 'weeks').startOf('week').format('DD-MM-YYYY');
          const weekEnd = moment().add(t_index, 'weeks').endOf('week').format('DD-MM-YYYY');
          formattedDate = `${weekStart} au ${weekEnd}`;
          break;
        case ITemporality.month:
          formattedDate = moment().add(t_index, 'months').startOf('month').format('MMMM YYYY');
          break;
        case ITemporality.year:
          formattedDate = moment().add(t_index, 'years').format('YYYY');
          break;
        default:
          formattedDate = moment().add(t_index, 'days').startOf('day').format('DD-MM-YYYY');
          break;
      }
  
      return formattedDate;
    }
  
  
    async getDocumentation(data) {
  
      const buildingId = sessionStorage.getItem("idBuilding");
      const elementDynamicId = data[0].dynamicId;
  
      const parentPromise = [
        this.$store.dispatch(ActionTypes.GET_PARENT, {
          buildingId: buildingId,
          referenceIds: elementDynamicId,
        }),
      ];
      const resultParent = await Promise.all(parentPromise);
      const parents = resultParent[0];
  
      const documentationPromise = [
        this.$store.dispatch(ActionTypes.GET_DOCUMENTATION, {
          buildingId: buildingId,
          referenceIds: elementDynamicId,
        }),
      ];
      const result = await Promise.all(documentationPromise);
  
      const documentation = result[0];
  
      let parentDocumentation = {};
      for (let parent of parents) {
        const parentDocPromise = [
          this.$store.dispatch(ActionTypes.GET_DOCUMENTATION, {
            buildingId: buildingId,
            referenceIds: parent.dynamicId,
          }),
        ];
        const parentDocResult = await Promise.all(parentDocPromise);
        parentDocumentation[parent.dynamicId] = {
          name: parent.name,
          dynamicId: parent.dynamicId,
          documentation: parentDocResult[0]
        };
      }
  
      this.documentation = {
        element: documentation,
        parents: parentDocumentation
      };
  
      this.data_loading += 15
      this.$forceUpdate();
    }
  
    fullData() {
      const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query };
  
      if (currentQuery.mode != 'data') {
        this.$emit('buttonClicked');
      }
    }
  
    async getBuildingStaticDetails() {
  
      const promises = [
        this.$store.dispatch(ActionTypes.GET_BUILDING_STATIC_DETAILS, {
          buildingId: sessionStorage.getItem("idBuilding"),
          referenceIds: this.buildingInfo[0].dynamicId
        }),
      ];
      const result = await Promise.all(promises);
      return result
    }
    async downloadFile(referenceIds, name) {
      const promises = [
        this.$store.dispatch(ActionTypes.POST_DOWNLOAD_FILE, {
          buildingId: sessionStorage.getItem("idBuilding"),
          referenceIds: referenceIds
        }),
      ];
      const result = await Promise.all(promises);
      result.forEach(blob => {
        const type = blob.type.split('/', 2);
        const finalType = type[1].split('+', 2) == "vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? "xlsx" : type[1];
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${name}.${finalType}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  
      return result;
    }
  
  
    async getBuildingInfo() {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      const promises = [
        this.$store.dispatch(ActionTypes.GET_BUILDING_INFO, {
          buildingId,
        }),
      ];
      const result = await Promise.all(promises);
      this.buildingInfo = [...result]
      this.data_loading += 15
  
    }
  
  
    async getBIMInfo(referenceIds) {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      const promises = [
        this.$store.dispatch(ActionTypes.GET_BIM_OBJECT_INFO, {
          buildingId,
          referenceIds
        }),
      ];
      const result = await Promise.all(promises);
      return [...result]
    }
  
  
    checkForReferenceObjectRoom(list) {
      return list.some(item => item.name === "hasReferenceObject.ROOM");
    }
  
    async getReferenceObjectRoom(dynamicId: number) {
  
      const buildingId = sessionStorage.getItem("idBuilding");
      // if (!buildingId) {
      //   console.error("Aucun buildingId trouvé dans le sessionStorage");
      //   // return;
      // }
  
  
      const element = [
        {
          dynamicId: dynamicId,
          relations: ["hasReferenceObject.ROOM"]
        }
      ];
  
      try {
        const resultRaw = await this.$store.dispatch(ActionTypes.GET_NODE_PARENTS, {
          buildingId,
          referenceIds: element
        });
  
        return resultRaw?.[0] ?? [];
      } catch (error) {
        console.error("Erreur lors de la récupération des parents :", error);
        return [];
      }
      //FAIRE LA RECHERCHE DE SI IL Y A UN hasReferenceObject.ROOM si oui TODO
  
    }
  
    getDynamicId(dbId, bimFileId) {
      for (const item of this.viewInfo) {
        for (const model of item.data) {
          if (model.bimFileId === bimFileId) {
            const index = model.dbIds.indexOf(dbId);
            if (index !== -1) {
              return model.dynamicIds[index];
            }
          }
        }
      }
      return null; // rien trouvé
    }
  
  
  
  
    async findDynamicIdByDbid(dbidToFind, data) {
  
      const buildingId = sessionStorage.getItem("idBuilding");
      const bimFileId = data.modelId.bimFileId;
  
      const dynamicId = this.getDynamicId(dbidToFind, bimFileId)
  
      // faire getModelsId fair le filtre pour récupéré le dynamicID correspondant au dbids / bimbileId
  
      const isRoom = await this.getReferenceObjectRoom(dynamicId); //renvoi false /  si non sinon renvoi la room de référence 
  
      if (isRoom?.nodes[0]) {
        const resultRaw = await this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS, {
          buildingId,
          referenceIds: isRoom?.nodes[0]?.dynamicId
        });
        const result = [resultRaw];
  
        this.forgeItem(result, buildingId, dbidToFind, bimFileId, data.center);
        return;
      } else {
  
        const resultRaw = await this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
          buildingId,
          referenceIds: dynamicId
        });
  
        const result = [resultRaw];
        this.forgeItem(result, buildingId, data.dbIds[0], data.modelId.bimFileId[0], data.center);
      }
  
    }
  
  
    // async findDynamicIdByDbid(dbidToFind, data) {
  
  
    //   const buildingId = sessionStorage.getItem("idBuilding");
    //   const bimFileId = data.modelId.bimFileId;
    //   const zoneType = this.$store.state.appDataStore.zoneSelected?.type;
  
    //   // Cas où zoneType est "building" ou undefined → ancienne logique complète
    //   if (!zoneType || zoneType === "building") {
    //     const BimObject = [
    //       {
    //         bimFileId: bimFileId,
    //         dbids: data.dbIds
    //       }
    //     ];
  
    //     const referenceResult = await this.getBIMInfo(BimObject);
  
    //     const isRoom = this.checkForReferenceObjectRoom(referenceResult[0][0].bimObjects[0].parent_relation_list);
  
    //     if (isRoom) {
  
    //       const objects = this.referenceObjects;
    //       for (const obj of objects[0]) {
    //         if (Array.isArray(obj.infoReferencesObjects)) {
    //           for (const ref of obj.infoReferencesObjects) {
    //             if (ref.dbid === dbidToFind && bimFileId === obj.bimFileId) {
    //               const referenceIds = obj.dynamicId;
    //               const resultRaw = await this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS, {
    //                 buildingId,
    //                 referenceIds
    //               });
    //               const result = [resultRaw];
  
    //               this.forgeItem(result, buildingId, ref.dbid, obj.bimFileId, data.center);
    //               return;
    //             }
    //           }
    //         }
    //       }
  
    //       return null;
    //     } else {
    //       const referenceIds = referenceResult[0][0].bimObjects[0].dynamicId;
  
    //       const resultRaw = await this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
    //         buildingId,
    //         referenceIds
    //       });
  
    //       const result = [resultRaw];
  
    //       this.forgeItem(result, buildingId, data.dbIds[0], data.modelId.bimFileId[0], data.center);
    //       return;
    //     }
    //   }
  
    //   // Sinon → nouvelle logique via le store
    //   const roomReferenceMap = this.$store.state.appDataStore.roomReferenceObjects;
  
    //   for (const [dynamicId, refs] of Object.entries(roomReferenceMap)) {
    //     const match = refs.find(ref => ref.dbid === dbidToFind && ref.bimfileId === bimFileId);
    //     if (match) {
    //       console.log('→ Room trouvée via le store (zone)');
  
    //       const referenceIds = parseInt(dynamicId, 10);
  
    //       const resultRaw = await this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS, {
    //         buildingId,
    //         referenceIds
    //       });
    //       const result = [resultRaw];
  
    //       this.forgeItem(result, buildingId, dbidToFind, bimFileId, data.center);
    //       return;
    //     }
    //   }
  
    //   // Fallback équipement si non trouvé dans le store
    //   const BimObject = [
    //     {
    //       bimFileId: bimFileId,
    //       dbids: data.dbIds
    //     }
    //   ];
  
    //   const referenceResult = await this.getBIMInfo(BimObject);
  
    //   const referenceIds = referenceResult[0][0].bimObjects[0].dynamicId;
  
    //   const resultRaw = await this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
    //     buildingId,
    //     referenceIds
    //   });
  
    //   const result = [resultRaw];
  
    //   this.forgeItem(result, buildingId, data.dbIds[0], data.modelId.bimFileId[0], data.center);
    // }
  
  
  
    // async findDynamicIdByDbid(dbidToFind, data) {
    //   const buildingId = sessionStorage.getItem("idBuilding");
    //   const bimFileId = data.modelId.bimFileId;
  
    //   // ✅ On vérifie si dbid + bimfileId sont dans le store des rooms
    //   const roomReferenceMap = this.$store.state.appDataStore.roomReferenceObjects;
  
    //   // Recherche du dynamicId d'une room déjà connue
    //   for (const [dynamicId, refs] of Object.entries(roomReferenceMap)) {
    //     const match = refs.find(ref => ref.dbid === dbidToFind && ref.bimfileId === bimFileId);
    //     if (match) {
    //       console.log('cest bien une room haha');
  
    //       const referenceIds = parseInt(dynamicId, 10);
  
    //       const resultRaw = await this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS, {
    //         buildingId,
    //         referenceIds
    //       });
    //       const result = [resultRaw];
  
    //       this.forgeItem(result, buildingId, dbidToFind, bimFileId, data.center);
    //       return;
    //     }
    //   }
  
    //   // ❌ Pas trouvé dans le store → c’est un équipement → ancienne logique
    //   const BimObject = [
    //     {
    //       bimFileId: bimFileId,
    //       dbids: data.dbIds
    //     }
    //   ];
  
    //   const referenceResult = await this.getBIMInfo(BimObject);
  
    //   const referenceIds = referenceResult[0][0].bimObjects[0].dynamicId;
  
    //   const resultRaw = await this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
    //     buildingId,
    //     referenceIds
    //   });
  
    //   const result = [resultRaw];
  
    //   this.forgeItem(result, buildingId, data.dbIds[0], data.modelId.bimFileId[0], data.center);
    // }
  
  
    // async findDynamicIdByDbid(dbidToFind, data) {
  
    //   const buildingId = sessionStorage.getItem("idBuilding");
    //   const BimObject = [
    //     {
    //       "bimFileId": data.modelId.bimFileId,
    //       "dbids": data.dbIds
    //     }
    //   ]
    //   const referenceResult = await this.getBIMInfo(BimObject)
  
    //   const isRoom = this.checkForReferenceObjectRoom(referenceResult[0][0].bimObjects[0].parent_relation_list)
  
    //   if (isRoom) {
    //     const objects = this.referenceObjects;
    //     console.log('this.referenceObjects' , this.referenceObjects);
  
    //     for (const obj of objects[0]) {
    //       if (Array.isArray(obj.infoReferencesObjects)) {
    //         for (const ref of obj.infoReferencesObjects) {
    //           if (ref.dbid === dbidToFind && data.modelId.bimFileId == obj.bimFileId) {
    //             const referenceIds = obj.dynamicId
    //             const promises = [
    //               this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS, {
    //                 buildingId,
    //                 referenceIds
    //               }),
    //             ];
    //             const result = await Promise.all(promises);
    //             this.forgeItem(result, buildingId, ref.dbid, obj.bimFileId, data.center)
  
    //             return;
    //           }
    //         }
    //       }
    //     }
  
    //     return null;
    //   }
    //   else {
    //     const referenceIds = referenceResult[0][0].bimObjects[0].dynamicId
    //     const promises = [
    //       this.$store.dispatch(ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT, {
    //         buildingId,
    //         referenceIds
    //       }),
    //     ];
  
  
    //     const result = await Promise.all(promises);
    //     this.forgeItem(result, buildingId, data.dbIds[0], data.modelId.bimFileId[0], data.center)
  
    //     return;
    //   }
  
  
    // }
  
  
    async getListinfo(typeData, id) {
  
      if (typeData == 'floor') {
        const buildingId = sessionStorage.getItem("idBuilding");
        const patrimoineId = JSON.parse(sessionStorage.getItem("patrimoine"))?.id;
        const promises = [
          this.$store.dispatch(ActionTypes.GET_ROOMS, {
            buildingId,
            patrimoineId,
            floorId: this.selectedZone.staticId,
            id: id || this.$store.state.appDataStore.zoneSelected.dynamicId,
          }),
        ];
        const result = await Promise.all(promises);
        this.dataListInfo = result
      }
      else if (typeData == 'room') {
        const buildingId = sessionStorage.getItem("idBuilding");
        const patrimoineId = JSON.parse(sessionStorage.getItem("patrimoine"))?.id;
        const promises = [
          this.$store.dispatch(ActionTypes.GET_EQUIPMENTS, {
            buildingId,
            patrimoineId,
            roomId: this.selectedZone.staticId,
            id: id,
          }),
        ];
        const result = await Promise.all(promises);
        this.dataListInfo = result
      }
      else if (typeData == 'building') {
        const buildingId = sessionStorage.getItem("idBuilding");
        const patrimoineId = JSON.parse(sessionStorage.getItem("patrimoine"))?.id;
        const promises = [
          this.$store.dispatch(ActionTypes.GET_FLOORS, {
            buildingId,
            patrimoineId,
          }),
        ];
        const result = await Promise.all(promises);
        this.dataListInfo = result
      } else {
        this.dataListInfo = []
      }
  
    }
  
  
    async getStaticDetails(id) {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      let type = '';
      let action = '';
      let referenceId = id || this.$store.state.appDataStore.zoneSelected.dynamicId;
      const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query }
  
      let zoneType = this.selectedZoneType || currentQuery.SpaceSelectedType
  
  
      switch (zoneType) {
        case 'geographicRoom':
          type = 'room';
          action = ActionTypes.GET_STATIC_DETAILS;
          break;
        case 'BIMObject':
          type = 'equipement';
          action = ActionTypes.GET_STATIC_DETAILS_EQUIPEMENT;
          break;
        case 'geographicFloor':
          type = 'floor';
          action = ActionTypes.GET_FLOOR_STATIC_DETAILS;
          break;
        default:
          console.warn('Type de zone non reconnu:', this.selectedZoneType);
          return;
      }
  
      this.referencedType = this.selectedZoneType;
      this.referencedId = id;
  
      const result = await Promise.all([
        this.$store.dispatch(action, {
          buildingId,
          referenceIds: Array.isArray(referenceId) ? referenceId : [referenceId],
        }),
      ]);
  
      this.typdata = type;
      this.floorstaticDetails = result;
      this.filteredEndpoints(type);
      this.getDocumentation(result);
      this.getListinfo(type, id);
      this.getTicket(result);
      this.filtredAttribut(type);
      this.createApp();
      this.$forceUpdate();
    }
  
  
  
    createApp() {
      this.appTab = this.config.application
    }
  
  
    async getParentAttribut() {
      const buildingId = sessionStorage.getItem("idBuilding");
      const elementDynamicId = this.floorstaticDetails[0].dynamicId;
  
      const parentPromise = [
        this.$store.dispatch(ActionTypes.GET_PARENT, {
          buildingId: buildingId,
          referenceIds: elementDynamicId,
        }),
      ];
  
      const resultParent = await Promise.all(parentPromise);
      const parents = resultParent[0];
  
      const parentDynamicIds = parents.map(parent => parent.dynamicId);
  
      const parentDocPromise = [
        this.$store.dispatch(ActionTypes.GET_ATTRIBUT_LIST_MULTIPLE, {
          buildingId,
          referenceIds: parentDynamicIds,
        }),
      ];
  
      const parentDocResult = await Promise.all(parentDocPromise);
      const parentDocumentationResult = parentDocResult[0];
  
      let parentDocumentation = {};
      parents.forEach((parent, index) => {
        parentDocumentation[parent.dynamicId] = {
          name: parent.name,
          documentation: parentDocumentationResult[index]
        };
      });
  
      this.parentAttribut = {
        parents: parentDocumentation
      };
  
    }
  
    filtredAttribut(type) {
      this.getParentAttribut();
      let data = this.floorstaticDetails[0].attributsList
      let attributProfil = [];
  
      if (type === "floor") {
        const floorDetail = data.find(detail => detail.name.toLowerCase() === this.config.floor.profileNameAttribut.toLowerCase());
        if (floorDetail) {
          attributProfil = floorDetail.attributs;
        }
      }
      else if (type === "room") {
        const buildingDetail = data.find(detail => detail.name.toLowerCase() === this.config.room.profileNameAttribut.toLowerCase());
        if (buildingDetail) {
          attributProfil = buildingDetail.attributs;
        }
      }
      else if (type === "equipement") {
        const buildingDetail = data.find(detail => detail.name.toLowerCase() === this.config.equipement.profileNameAttribut.toLowerCase());
        if (buildingDetail) {
          attributProfil = buildingDetail.attributs;
        }
      }
      else {
        const buildingDetail = data.find(detail => detail.name.toLowerCase() === this.config.batiment.profileNameAttribut.toLowerCase());
        if (buildingDetail) {
          attributProfil = buildingDetail.attributs;
        }
      }
      this.attributProfil = attributProfil
      this.data_loading += 15
    }
  
  
    filteredEndpoints(type) {
      if (type == "floor") {
        const profile = this.floorstaticDetails[0].controlEndpoint.find(profile => profile.profileName === this.config.floor.profileNameControlePts);
        this.endpointProfil = profile ? profile.endpoints : [];
      } else if (type == "building") {
        const profile = this.floorstaticDetails[0].controlEndpoint.find(profile => profile.profileName === this.config.batiment.profileNameControlePts);
        this.endpointProfil = profile ? profile.endpoints : [];
      } else if (type == "equipement") {
        const profile = this.floorstaticDetails[0].controlEndpoint.find(profile => profile.profileName === this.config.equipement.profileNameControlePts);
        this.endpointProfil = profile ? profile.endpoints : [];
      } else {
        const profile = this.floorstaticDetails[0].controlEndpoint.find(profile => profile.profileName === this.config.room.profileNameControlePts);
        this.endpointProfil = profile ? profile.endpoints : [];
      }
      this.data_loading += 15
  
    }
  
    forgeVignette(result, buildingId, dbid, bimFileId, center, items, categoryName, color) {
  
      let X = center.x;
      let Y = center.y;
      let Z = center.z;
  
  
      const item = {
        color: color,
        dynamicId: result[0].dynamicId,
        buildingId: buildingId,
        dbid: dbid,
        bimFileId: bimFileId,
        name: result[0].name,
        position: new THREE.Vector3(Number(X), Number(Y), Number(Z)),
        data: result[0],
        config: this.config,
        group: items + categoryName,
        z_index: 0
      }
  
      const screenWidth = window.innerWidth;
      if (screenWidth <= 700) {
        this.displaySprite = false;
        this.isSmallScreen = item;
        this.displaySprite = true;
      } else {
        this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
          items: item,
          buildingId: buildingId,
          component: SpriteComponent2,
        });
      }
    }
  
    forgeItem(result, buildingId, dbid, bimFileId, center) {
  
      let X = center.x;
      let Y = center.y;
      let Z = center.z;
  
      const item = {
        color: '#ded638',
        dynamicId: result[0].dynamicId,
        buildingId: buildingId,
        dbid: dbid,
        bimFileId: bimFileId,
        name: result[0].name,
        position: new THREE.Vector3(Number(X), Number(Y), Number(Z)),
        data: result[0],
        config: this.config,
        group: 'card',
        z_index: 1
      }
  
      this.$store.dispatch(ActionTypes.REMOVE_SPRITES_BY_GROUP, 'card');
  
      const screenWidth = window.innerWidth;
      if (screenWidth <= 700) {
        this.displaySprite = false;
        this.isSmallScreen = item;
        this.displaySprite = true;
      } else {
        this.$store.dispatch(ActionTypes.ADD_COMPONENT_AS_SPRITES, {
          items: item,
          buildingId: buildingId,
          component: SpriteComponent,
        });
      }
    }
  
    handleClose() {
      this.displaySprite = false;
    }
  
    getTotalArea(rooms) {
      if (!rooms || rooms.length === 0) return 0;
  
      let total = 0;
      for (const room of rooms) {
        const area = Number(room.area); // Convertir en nombre
  
        if (!isNaN(area)) {
          total += area;
        } else {
          console.warn('Room with invalid area detected:', room);
        }
      }
  
      return Math.round(total * 100) / 100; // Renvoie un nombre arrondi à 2 décimales
    }
  
  
    extractUniqueInventoryNames() {
      let uniqueNames = new Set();
      const dataArray = this.inventory[0]
      dataArray.forEach(data => {
        if (data.inventories) {
          data.inventories.forEach(inventory => {
            if (inventory.name) {
              uniqueNames.add(inventory.name);
            }
          });
        }
      });
      return Array.from(uniqueNames);
    }
  
    async retriveData() {
      try {
        this.pageSate = PAGE_STATES.loading;
        const buildingId = sessionStorage.getItem("idBuilding");
        const patrimoineId = JSON.parse(sessionStorage.getItem("patrimoine"))?.id;
        const promises = [
          this.$store.dispatch(ActionTypes.GET_ROOMS, {
            buildingId,
            patrimoineId,
            floorId: this.selectedZone.staticId,
            id: this.selectedZone.dynamicId,
          }),
        ];
        const result = await Promise.all(promises);
        this.data_loading += 15
  
        this.$store.commit(MutationTypes.SET_DATA, result[0]);
        this.pageSate = PAGE_STATES.loaded;
      } catch (err) {
        console.log(err);
        this.retry = this.retriveData;
        this.pageSate = PAGE_STATES.error;
      }
      this.data_loading += 15
  
    }
  
    selectDataView(item) {
      this.$emit("clickOnDataView", item);
    }
  
    getDataDynamicIdtab() {
      const dynamicIds = this.data.map(obj => obj.dynamicId);
  
      this.fetchReferenceObjects(dynamicIds)
      this.getInventoryObject(dynamicIds)
    }
  
    async fetchReferenceObjects(referenceIds) {
      const buildingId = sessionStorage.getItem("idBuilding");
  
      const result = await this.$store.dispatch(ActionTypes.GET_REFERENCE_OBJECT_LIST_MULTIPLE, {
        buildingId,
        referenceIds
      });
  
      this.referenceObjects = [...result];
      this.data_loading += 15;
  
      const rooms = result.filter(room => room.type === "geographicRoom");
  
      rooms.forEach(room => {
        const roomId = room.dynamicId;
        const newReferences = room.infoReferencesObjects.map(obj => ({
          dbid: obj.dbid,
          bimfileId: obj.bimFileId,
        }));
  
        const existing = this.$store.state.appDataStore.roomReferenceObjects[roomId] || [];
  
        const merged = [...existing];
        newReferences.forEach(ref => {
          const isDuplicate = merged.some(e =>
            e.dbid === ref.dbid && e.bimfileId === ref.bimfileId
          );
          if (!isDuplicate) merged.push(ref);
        });
  
        this.$store.commit(MutationTypes.SET_ROOM_REFERENCE_OBJET, {
          roomId,
          references: merged
        });
      });
    }
  
  
    async getInventoryObject(referenceIds) {
  
      const buildingId = sessionStorage.getItem("idBuilding");
      const promises = [
        this.$store.dispatch(ActionTypes.GET_INVENTORY_MULTIPLE, {
          buildingId,
          referenceIds
        }),
      ];
      const result = await Promise.all(promises);
      this.inventory = [...result];
  
      this.countInventoryTypes([...result]);
      this.countSpaceInventory();
      this.data_loading += 15
  
    }
  
    async addOrRemove(dyn, name) {
      console.log('super', dyn, name);
  
  
      if (this.activeChartData.includes(dyn)) {
        this.dataTable = this.dataTable.filter(item => item.dynamicId !== dyn);
        this.activeChartData = this.activeChartData.filter(id => id !== dyn);
        this.activeChart = this.activeChart.filter(obj => obj.dynamicId !== dyn);
        this.removegraphInfoCp(dyn)
      }
      else {
        this.addgraphInfoCp(dyn, name)
        const dataSave = {
          dynamicId: dyn,
          label: name,
        }
        this.activeChartData.push(dyn)
        this.activeChart.push(dataSave);
      }
  
      console.log('on va log le truc qui contien les graph :this.activeChartData ', this.activeChart);
  
    }
    async removegraphInfoCp(dyn) {
      const datatable = this.dataTable
      this.chartData = this.chartDataObject(datatable)
    }
  
    parseDateString(dateString) {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-');
      return new Date(`${year}-${month}-${day}T${timePart}`);
    }
  
    async addgraphInfoCp(dyn, name) {
  
      console.log('super 01', dyn, name, this.endpointIdToDraw, dyn, this.cpIdToDraw.includes(dyn), this.endpointIdToDraw.includes(dyn));
  
      if (!this.cpIdToDraw.includes(dyn) && !this.endpointIdToDraw.includes(dyn)) return;
  
      console.log('super 02 passe du passage', dyn, name);
  
      const { begintime, endtime } = this.getBeginAndEndTime();
      const buildingId = sessionStorage.getItem("idBuilding");
      const beginTimestamp = this.parseDateString(begintime).getTime();
      const endTimestamp = this.parseDateString(endtime).getTime();
  
      const result = await this.$store.dispatch(ActionTypes.GET_TIMES_SERIES, {
        buildingId,
        referenceIds: dyn,
        begin: begintime,
        end: endtime,
      });
  
      console.log('super 03 passe du passage', result);
  
  
  
      const actuelleTable = {
        dynamicId: dyn,
        label: name,
        data: result.map(({ date, value }) => ({ x: date, y: value })),
        unit: "kwh",
        name: "le nom du graph",
      };
  
  
      this.dataTable = [...this.dataTable, actuelleTable];
      this.labelsChart = this.labels(begintime, endtime).map(this.toDate);
      this.chartData = this.chartDataObject(this.dataTable);
  
      console.log('super 04 passe du passage', this.dataTable, this.labelsChart, this.chartData);
  
    }
  
    getBeginAndEndTime() {
      const temporality = this.$store.state.appDataStore.temporalitySelected.name;
      const t_index = this.t_index || 0;
      let begintime, endtime;
  
      switch (temporality) {
        case ITemporality.hour:
          begintime = moment().add(t_index, 'hours').startOf('hour').format('DD-MM-YYYY HH:mm:ss');
          endtime = moment().add(t_index, 'hours').endOf('hour').format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.day:
          begintime = moment().add(t_index, 'days').startOf('day').format('DD-MM-YYYY HH:mm:ss');
          endtime = moment().add(t_index, 'days').endOf('day').format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.week:
          begintime = moment().add(t_index, 'weeks').startOf('week').format('DD-MM-YYYY HH:mm:ss');
          endtime = moment().add(t_index, 'weeks').endOf('week').format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.month:
          begintime = moment().add(t_index, 'months').startOf('month').format('DD-MM-YYYY HH:mm:ss');
          endtime = moment().add(t_index, 'months').endOf('month').format('DD-MM-YYYY HH:mm:ss');
          break;
        case ITemporality.year:
          begintime = moment().add(t_index, 'years').startOf('year').format('DD-MM-YYYY HH:mm:ss');
          endtime = moment().add(t_index, 'years').endOf('year').format('DD-MM-YYYY HH:mm:ss');
          break;
        default:
          // Retourner la journée actuelle par défaut, ajustée avec t_index
          begintime = moment().add(t_index, 'days').startOf('day').format('DD-MM-YYYY HH:mm:ss');
          endtime = moment().add(t_index, 'days').endOf('day').format('DD-MM-YYYY HH:mm:ss');
          break;
      }
  
      return { begintime, endtime };
    }
  
  
  
    toDate(date) {
  
      switch (this.$store.state.appDataStore.temporalitySelected.name) {
        case ITemporality.hour:
        case ITemporality.currentValue:
          return moment(date).format('HH:mm');
        case ITemporality.day:
          return moment(date).format('HH[h]');
        case ITemporality.week:
          return moment(date).format('dd');
        case ITemporality.month:
          return moment(date).format('D/M/YY');
        case ITemporality.year:
          return moment(date).format('MMM');
        case ITemporality.custom:
          const { begin, end } =
            this.$store.state.appDataStore.temporalitySelected.range;
          const duration = moment.duration(
            moment(end, 'DD-MM-YYYY HH:mm:ss').diff(
              moment(begin, 'DD-MM-YYYY HH:mm:ss')
            )
          );
          if (duration.asMonths() > 2) return moment(date).format('MMM');
          if (duration.asDays() > 1) return moment(date).format('D/M/YY');
          if (duration.asHours() > 1) return moment(date).format('HH[h]');
          return moment(date).format('HH:mm');
        default:
          return moment(date).format('D/M/YY');
      }
    }
  
    labels(begin, end) {
      if (!this.dataTable) {
        return [];
      }
  
      const parseDate = (dateStr) => {
        const [day, month, yearTime] = dateStr.split('-');
        const [year, time] = yearTime.split(' ');
        const [hours, minutes, seconds] = time.split(':');
  
  
        return new Date(
          parseInt(year, 10),      // Année
          parseInt(month, 10) - 1, // Mois (0 = janvier, donc on soustrait 1)
          parseInt(day, 10),       // Jour
          parseInt(hours, 10),     // Heures
          parseInt(minutes, 10),   // Minutes
          parseInt(seconds, 10)    // Secondes
        );
      };
  
      const beginDate = parseDate(begin);
      const endDate = parseDate(end);
  
      const dates = [];
      const interval = 60 * 1000; // Intervalle d'une journée en millisecondes
  
      for (let date = beginDate; date <= endDate; date = new Date(date.getTime() + interval)) {
        dates.push(new Date(date)); // Ajoute une nouvelle date au tableau
      }
  
      return dates;
    }
  
    async reloadNewChartData() {
      this.dataTable = [];
  
      for (const item of this.activeChart) {
        await this.addgraphInfoCp(item.dynamicId, item.label);
      }
    }
  
  
  
    chartDataObject(dataTable) {
      const l1: any = []
      dataTable.forEach((el, index) => {
        l1.push({ data: [...el.data], label: el.label, color: 'blue', dynamicId: el.dynamicId, specialAxis: index });
      });
  
      return l1;
    }
  
  
    closeeyes(item, categoryName) {
      if (!this.eyes[categoryName]) {
        this.$set(this.eyes, categoryName, []);
      }
  
      const itemIndex = this.eyes[categoryName].indexOf(item);
  
      if (itemIndex === -1) {
        this.eyes[categoryName].push(item);
      } else {
        this.eyes[categoryName].splice(itemIndex, 1);
      }
    }
  
    closeink(item, categoryName) {
      if (!this.ink[categoryName]) {
        this.$set(this.ink, categoryName, []);
      }
  
      const itemIndex = this.ink[categoryName].indexOf(item);
  
      if (itemIndex === -1) {
        this.ink[categoryName].push(item);
      } else {
        this.ink[categoryName].splice(itemIndex, 1);
      }
    }
  
    closecol(item, categoryName) {
      if (!this.col[categoryName]) {
        this.$set(this.col, categoryName, []);
      }
  
      const itemIndex = this.col[categoryName].indexOf(item);
  
      if (itemIndex === -1) {
        this.col[categoryName].push(item);
      } else {
        this.col[categoryName].splice(itemIndex, 1);
      }
    }
  
    async getBuildingInventoryObject(ids) {
      const dynamicIdMap = {};
      const buildingId = sessionStorage.getItem("idBuilding");
      const contextList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_LIST, { buildingId });
  
      // Associer chaque contexte à son dynamicId
      for (const configItem of this.config.inventaire) {
        if (!dynamicIdMap[configItem.ctx]) {
          const matchingContext = contextList.find(
            (context) => context.name === configItem.ctx
          );
          if (matchingContext) {
            dynamicIdMap[configItem.ctx] = matchingContext.dynamicId;
          } else {
            console.warn(`Contexte "${configItem.ctx}" non trouvé dans la liste.`);
          }
        }
      }
  
      // Maintenant, pour chaque objet inventaire (ctx + cat)
      const categoryPromises = this.config.inventaire.map(async (configItem) => {
        const contextId = dynamicIdMap[configItem.ctx];
        if (!contextId) {
          console.warn(`Pas de contextId pour "${configItem.ctx}"`);
          return null;
        }
  
        // On récupère les catégories du contexte
        const categories = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_LIST, {
          buildingId,
          contextId,
        });
  
        // On filtre pour ne garder que la catégorie voulue
        const matchingCategory = categories.find(cat => cat.name === configItem.cat);
        if (!matchingCategory) {
          console.warn(`Catégorie "${configItem.cat}" non trouvée dans le contexte "${configItem.ctx}"`);
        }
  
        return {
          ctx: configItem.ctx,
          cat: configItem.cat,
          category: matchingCategory,
        };
      });
  
      const resultCategory = await Promise.all(categoryPromises);
  
  
      // Tu peux retourner le résultat si besoin
      // return resultCategory.filter(item => item !== null);
    }
  
  
    async countSpaceInventory() {
      this.data_loading = 75;
      const buildingId = sessionStorage.getItem("idBuilding");
      let contextId = this.$store.state.appDataStore.zoneSelected.dynamicId;
  
      if (contextId === 0) {
        contextId = this.$store.state.appDataStore.buildingInfo.dynamicId
      }
  
      if (this.$store.state.appDataStore.zoneSelected.type == "BIMObject" || this.$store.state.appDataStore.zoneSelected.type == "geographicRoom") {
  
        this.spaceInventoryData = [];
        this.data_loading = 100;
  
        return [];
      }
  
  
      // if (this.$store.state.appDataStore.zoneSelected.type != "geographicFloor" && this.$store.state.appDataStore.zoneSelected.type.type != "building" && this.$store.state.appDataStore.zoneSelected.type.type != undefined) {
      //   this.spaceInventoryData = [];
      //   this.data_loading = 100;
      //   return this.spaceInventoryData;
      // }
  
      let floorIds = [];
      if (this.$store.state.appDataStore.zoneSelected.type == "building" || this.$store.state.appDataStore.zoneSelected.type == undefined) {
  
        if (!this.config.BuildingInventory) {
          this.spaceInventoryData = [];
          this.data_loading = 100;
  
          return this.spaceInventoryData;
  
        }
  
        const patrimoineId = JSON.parse(sessionStorage.getItem("patrimoine"))?.id;
        const floorsResult = await this.$store.dispatch(ActionTypes.GET_FLOORS, {
          buildingId,
          patrimoineId,
        });
  
  
        if (!Array.isArray(floorsResult)) {
          this.spaceInventoryData = [];
          this.data_loading = 100;
          return this.spaceInventoryData;
        }
  
        floorIds = floorsResult.map(floor => floor.dynamicId);
      } else {
        floorIds = [contextId];
      }
  
      const spaceInventoryMap = new Map();
  
      if (!Array.isArray(this.config.spaceInventaire)) {
        this.spaceInventoryData = [];
        this.data_loading = 100;
        return this.spaceInventoryData;
      }
  
      for (const floorId of floorIds) {
        for (const configItem of this.config.spaceInventaire) {
          const categoryName = configItem.cat;
          const contextName = configItem.ctx;
          try {
            const inventoryResponse = await this.$store.dispatch(ActionTypes.GET_FLOOR_INVENTORY, {
              id: floorId,
              body: { context: contextName, category: categoryName },
              includeArea: true,
              onlyDynamicId: false,
            });
  
            if (!Array.isArray(inventoryResponse) || !inventoryResponse.length) {
              continue;
            }
  
            const mapKey = `${contextName}-${categoryName}`;
            if (!spaceInventoryMap.has(mapKey)) {
              spaceInventoryMap.set(mapKey, {
                context: contextName,
                category: categoryName,
                groups: new Map(),
              });
            }
  
            const inventoryEntry = spaceInventoryMap.get(mapKey);
  
            for (const inventoryItem of inventoryResponse) {
              if (Array.isArray(inventoryItem.groupItems) && inventoryItem.groupItems.length > 0) {
                if (!inventoryEntry.groups.has(inventoryItem.name)) {
                  inventoryEntry.groups.set(inventoryItem.name, {
                    groupName: inventoryItem.name,
                    color: inventoryItem.color,
                    rooms: [],
                  });
                }
                inventoryEntry.groups.get(inventoryItem.name).rooms.push(
                  ...inventoryItem.groupItems.map(room => ({
                    dynamicId: room.dynamicId,
                    area: room.area,
                  }))
                );
              }
            }
          } catch (error) {
            console.error(`[countSpaceInventory] Erreur récupération inventaire pour ${contextName} - ${categoryName}, floor ${floorId} :`, error);
          }
        }
      }
  
      this.spaceInventoryData = Array.from(spaceInventoryMap.values()).map(entry => ({
        context: entry.context,
        category: entry.category,
        groups: Array.from(entry.groups.values()),
      }));
  
  
      this.data_loading = 100;
      return this.spaceInventoryData;
    }
  
  
    async countInventoryTypes(floors) {
  
  
      const inventoryDbids = {};
      const buildingId = sessionStorage.getItem("idBuilding");
      const contextList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_LIST, { buildingId });
      const dynamicIdMap = {};
  
  
      // if (this.$store.state.appDataStore.zoneSelected.type == "building" || this.$store.state.appDataStore.zoneSelected.type == undefined) {
      //   console.log('on rentre dans le bon element de la lala');
  
      //   if (!this.config.BuildingInventory) {
      //     this.spaceInventoryData = [];
      //     this.data_loading = 100;
  
      //     return this.spaceInventoryData;
  
      //   }
      //   const patrimoineId = JSON.parse(sessionStorage.getItem("patrimoine"))?.id;
      //   const floorsResult = await this.$store.dispatch(ActionTypes.GET_FLOORS, {
      //     buildingId,
      //     patrimoineId,
      //   });
      //   console.log('on rentre dans le bon element de la lala' , );
      //   // floors = floorsResult
      // }
  
  
  
      this.data_loading += 25
  
      for (const configItem of this.config.inventaire) {
        const matchingContext = contextList.find(
          (context) => context.name === configItem.ctx
        );
        if (matchingContext) {
          dynamicIdMap[configItem.ctx] = matchingContext.dynamicId;
        } else {
          console.warn(`Contexte "${configItem.ctx}" non trouvé dans la liste.`);
        }
      }
  
      const categoryPromises = Object.entries(dynamicIdMap).map(([ctx, contextId]) => {
        return this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_LIST, {
          buildingId,
          contextId,
        });
      });
  
      const resultCategory = await Promise.all(categoryPromises);
  
      const categoriesWithGroups = {};
  
      for (const [ctx, contextId] of Object.entries(dynamicIdMap)) {
        const configItems = this.config.inventaire.filter((item) => item.ctx === ctx);
  
        for (const configItem of configItems) {
          const configCatName = configItem.cat;
          const matchingCategory = resultCategory.flat().find(
            (category) => category.name === configCatName
          );
  
          if (!matchingCategory) {
            console.warn(`Catégorie "${configCatName}" non trouvée pour le contexte "${ctx}".`);
            continue;
          }
  
          const categoryDynId = matchingCategory.dynamicId;
  
          const groupList = await this.$store.dispatch(ActionTypes.GET_CONTEXT_CATEGORY_GROUP_LIST, {
            buildingId,
            contextId,
            categoryDynId,
          });
  
          const groupIds = [];
          if (Array.isArray(configItem.grp)) {
            configItem.grp.forEach((groupName) => {
              const matchingGroup = groupList.find((group) => group.name === groupName);
              if (matchingGroup) {
                groupIds.push(matchingGroup.dynamicId);
              }
            });
          } else if (configItem.grp) {
            const matchingGroup = groupList.find((group) => group.name === configItem.grp);
            if (matchingGroup) {
              groupIds.push(matchingGroup.dynamicId);
            }
          } else {
            groupIds.push(...groupList.map((group) => group.dynamicId));
          }
  
          if (!categoriesWithGroups[configCatName]) {
            categoriesWithGroups[configCatName] = [];
          }
  
          categoriesWithGroups[configCatName].push({
            categoryId: categoryDynId,
            groupIds,
          });
        }
      }
  
      const categorizedResults = {};
      floors[0].forEach((floor) => {
  
        if (floor.inventories) {
          for (const [categoryName, categories] of Object.entries(categoriesWithGroups)) {
            if (!categorizedResults[categoryName]) {
              categorizedResults[categoryName] = {};
            }
  
            categories.forEach(({ categoryId, groupIds }) => {
              const matchingCategory = floor.inventories.find(
                (inventory) => inventory.dynamicId === categoryId
              );
  
              if (!matchingCategory) {
                return;
              }
  
              matchingCategory.inventory.forEach((group) => {
                if (!groupIds.includes(group.dynamicId)) {
                  return;
                }
  
                const itemCount = group.equipments?.length || 0;
                if (!categorizedResults[categoryName][group.name]) {
                  categorizedResults[categoryName][group.name] = 0;
                }
  
                categorizedResults[categoryName][group.name] += itemCount;
  
                group.equipments.forEach((equipment) => {
                  const bimFileId = equipment.bimFileId;
  
                  if (!inventoryDbids[categoryName]) {
                    inventoryDbids[categoryName] = {};
                  }
  
                  if (!inventoryDbids[categoryName][group.name]) {
                    inventoryDbids[categoryName][group.name] = {};
                  }
  
                  if (!inventoryDbids[categoryName][group.name][bimFileId]) {
                    inventoryDbids[categoryName][group.name][bimFileId] = [];
                  }
  
                  inventoryDbids[categoryName][group.name][bimFileId].push({
                    dbid: equipment.dbid,
                    dynamicId: equipment.dynamicId,
                    name: equipment.name,
                    color: group.color
                  });
                });
  
              });
            });
          }
        }
      });
  
      this.data_loading += 60
  
      const results = {};
      for (const [categoryName, items] of Object.entries(categorizedResults)) {
        results[categoryName] = Object.entries(items).map(
          ([itemName, itemCount]) => `${itemCount} ${itemName}`
        );
      }
  
      this.inventoyList = results;
      this.inventoryDbids = inventoryDbids;
      this.$forceUpdate();
  
      return results;
    }
  
  
  
    getdataofelement() {
      this.referencedId = 0;
      this.referencedType = ''
      if (this.selectedZone.type != "building") {
        this.getStaticDetails(this.selectedZone.dynamicId);
        if (this.data.length == 0) {
          this.getInventoryObject([this.selectedZone.dynamicId])
        } else {
          this.getDataDynamicIdtab()
        }
      }
      else {
        this.inventoyList = []
      }
  
    }
  
    /**
     * Watch
     */
    @Watch('showConfirmDelete')
    watchShowConfirmDelete(newVal) {
      this.showConfirmDelete = newVal;
    }
    @Watch('temporality')
    @Watch('t_index')
    onTemporalDataChanged() {
      this.timeactuelle = this.getFormattedDateFromTemporalData();
      this.reloadNewChartData();
    }
  
    @Watch('state.viewInfo')
    onViewInfoChanged(newVal: any) {
      this.viewInfo = newVal
    }
  
  
    @Watch("documentation")
    watchDocumentation(newVal) {
      this.documentation = newVal;
    }
  
    @Watch("alert")
    watchAlert(newVal) {
      if (newVal) {
        this.itemOverflowMenu = null
  
        setTimeout(() => {
          this.alert = false;
  
          this.showLoader_in_child = false;
          this.showLoader_in_parent = false;
        }, 2000);
      }
    }
    @Watch("selectedZone")
    watchSelectedZone() {
  
      this.ink = {};
      this.col = {};
      this.coloredElement = [];
      this.coloredRoom = [];
  
      this.itemOverflowMenu = null
      if (this.selectedZone.type === "building") {
        this.loadBuildingInfo()
        this.isBuildingSelected = true;
        this.$store.commit(MutationTypes.SET_DATA, []);
        return;
      } else {
        this.isBuildingSelected = false;
        this.retriveData();
      }
    }
  
    @Watch("showDocvalue")
    watchShowDocvalue(newVal) {
      this.showDocvalue = newVal;
    }
    @Watch("changeData")
    changeDataLoading(oldval, newVal) {
      if (this.stockedZone != this.$store.state.appDataStore.zoneSelected.dynamicId) {
        this.stockedZone = this.$store.state.appDataStore.zoneSelected.dynamicId
        this.data_loading = 10;
      }
    }
  
    @Watch("floorstaticDetails")
    async watchFloorstaticDetails(newVal, oldVal) {
  
      const buildingId = sessionStorage.getItem("idBuilding");
  
      // Récupération des dynamicIds depuis controlEndpoint
      const dynamicIds = newVal[0]?.controlEndpoint?.flatMap(profile =>
        profile.endpoints.map(endpoint => endpoint.dynamicId)
      ) || [];
  
      const attribut = await this.$store.dispatch(ActionTypes.GET_ATTRIBUT_LIST_MULTIPLE, {
        buildingId,
        referenceIds: dynamicIds,
      });
  
  
      const attributs = attribut.filter(element => {
        const allAttrs = element.categoryAttributes.flatMap(cat => cat.attributs);
        const save = allAttrs.find(attr => attr.label === "saveTimeSeries");
        const maxDay = allAttrs.find(attr => attr.label === "timeSeries maxDay");
  
        return (save && save.value == 1) || (maxDay && maxDay.value !== undefined && maxDay.value !== '0');
      }).map(element => element.dynamicId);
  
      this.cpIdToDraw = attributs;
      console.log('cpIdToDraw:', this.cpIdToDraw);
  
      if (this.selectedZone?.type === 'building') {
        this.data_loading += 100;
      }
  
      // Partie endpoints
      const endpointsDyn = newVal[0]?.endpoints?.map(obj => obj.dynamicId) || [];
      console.warn('endpointsDyn:', endpointsDyn);
  
      const attributEndpoints = await this.$store.dispatch(ActionTypes.GET_ATTRIBUT_LIST_MULTIPLE, {
        buildingId,
        referenceIds: endpointsDyn,
      });
  
      console.log(attributEndpoints, 'attributEndpoints');
  
  
      const attributsEnd = attributEndpoints.filter(element => {
        const allAttrs = element.categoryAttributes.flatMap(cat => cat.attributs);
        const save = allAttrs.find(attr => attr.label === "saveTimeSeries");
        const maxDay = allAttrs.find(attr => attr.label === "timeSeries maxDay");
  
        return (save && save.value == 1) || (maxDay && maxDay.value !== undefined && maxDay.value !== '0');
      }).map(element => element.dynamicId);
  
      this.endpointIdToDraw = attributsEnd;
      console.log('endpointIdToDraw:', this.endpointIdToDraw);
    }
  
  
  
    @Watch("dynamicItems")
    editSelection() {
      if (!this.formattedData.length) {
        this.selection = "Vue Globale";
  
      }
    }
  
    @Watch("data")
    async watchData() {
  
      this.referencedId = this.selectedZone.dynamicId;
      const currentQuery = { ...window.parent.routerFontion.apps[0]._route.query };
  
      this.referencedType = this.selectedZone.type;
      if (this.selectedZoneType === 'geographicFloor' || currentQuery.SpaceSelectedType == 'geographicFloor') {
        this.getStaticDetails(this.floor);
        this.getDataDynamicIdtab();
      } else if (this.selectedZoneType === 'geographicRoom' || this.selectedZoneType === 'BIMObject' || currentQuery.SpaceSelectedType == 'BIMObject' || currentQuery.SpaceSelectedType == 'geographicRoom') {
        this.getInventoryObject([this.selectedZone.dynamicId]);
        this.getStaticDetails(this.selectedZone.dynamicId);
      } else {
        this.inventoyList = [];
      }
  
      if (currentQuery.SpaceSelectedType == 'building' || currentQuery.SpaceSelectedTypee == undefined) {
        this.typdata = 'building';
        this.referencedType = 'building';
        // this.getInventoryObject([this.selectedZone.dynamicId]);
        const buildingId = sessionStorage.getItem("idBuilding");
  
        const patrimoineId = JSON.parse(sessionStorage.getItem("patrimoine"))?.id;
        const floorsResult = await this.$store.dispatch(ActionTypes.GET_FLOORS, {
          buildingId,
          patrimoineId,
        });
        const floorIds = floorsResult.map(floor => floor.dynamicId);
        // this.getBuildingInventoryObject(floorIds);
        this.countSpaceInventory();
        this.inventoyList = [];
        return;
      }
  
    }
  
  
  }
  
  export { dataSideApp };
  export default dataSideApp;
  </script>
  <style>
  .title div .v-menu__content {
    margin-left: 20px;
    margin-top: 15px;
  }
  </style>
  <style lang="scss" scoped>
  .v-select__selection--comma {
    font-size: 20px !important;
  }
  
  .v-menu__content {
    margin-left: 500px !important;
  }
  
  .btn_inventory {
    border: 1px solid #d1d1d1;
    background-color: #ffffff;
    color: #14202c;
    cursor: pointer;
    padding: 8px;
    border-radius: 5px;
    font-size: 18px;
    display: flex;
    user-select: none;
    margin-left: 7px;
    margin-top: 5px;
    margin-bottom: 12px;
    // font-weight: 700;
  }
  
  .app_access_fl {
    border-right: 1px solid #cecece;
    height: 100%;
    /* background: red; */
    width: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
  }
  
  .app_access {
    position: relative;
    width: 100%;
    /* background: red; */
    border: 1px solid #b8b8b8;
    border-radius: 5px;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    // padding-left: 15px;
    font-size: 16px;
    font-weight: bold;
    transition: 0.3s;
    user-select: none;
  }
  
  .blocAppStyle {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 8;
    background-color: white;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    -webkit-animation: tilt-in-fwd-tr 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: tilt-in-fwd-tr 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }
  
  @-webkit-keyframes tilt-in-fwd-tr {
    0% {
      -webkit-transform: rotateY(20deg) rotateX(35deg) translate(300px, -300px) skew(-35deg, 10deg);
      transform: rotateY(20deg) rotateX(35deg) translate(300px, -300px) skew(-35deg, 10deg);
      opacity: 0;
    }
  
    100% {
      -webkit-transform: rotateY(0) rotateX(0deg) translate(0, 0) skew(0deg, 0deg);
      transform: rotateY(0) rotateX(0deg) translate(0, 0) skew(0deg, 0deg);
      opacity: 1;
    }
  }
  
  @keyframes tilt-in-fwd-tr {
    0% {
      -webkit-transform: rotateY(20deg) rotateX(35deg) translate(300px, -300px) skew(-35deg, 10deg);
      transform: rotateY(20deg) rotateX(35deg) translate(300px, -300px) skew(-35deg, 10deg);
      opacity: 0;
    }
  
    100% {
      -webkit-transform: rotateY(0) rotateX(0deg) translate(0, 0) skew(0deg, 0deg);
      transform: rotateY(0) rotateX(0deg) translate(0, 0) skew(0deg, 0deg);
      opacity: 1;
    }
  }
  
  .graphDataContainer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  
  }
  
  .graphContainer {
    border-radius: 0px;
    width: 160%;
    height: 100%;
    display: flex;
    padding: 10px;
  }
  
  .back_blanc {
    margin: 6px;
    color: #14202c;
    padding: 9px;
    border-radius: 5px;
    padding-left: 6px;
    background-color: #f9f9f9;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  }
  
  .title_attribut {
    font-size: 1.5rem;
  }
  
  .cardContainer {
    padding: 10px;
  }
  
  .displaydataCss {
    display: none;
  }
  
  .entrence {
    -webkit-animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  
  }
  
  @-webkit-keyframes fade-in {
    0% {
      opacity: 0;
    }
  
    100% {
      opacity: 1;
    }
  }
  
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
  
    100% {
      opacity: 1;
    }
  }
  
  .area {
    transform: translate(0, -15px);
  }
  
  .w-full {
    width: 100%;
  }
  
  .inactiveTable {
    -webkit-animation: fade-out 0.3s ease-out both;
    animation: fade-out 0.3s ease-out both;
  }
  
  @-webkit-keyframes fade-out {
    0% {
      opacity: 1;
    }
  
    100% {
      opacity: 0;
    }
  }
  
  @keyframes fade-out {
    0% {
      opacity: 1;
    }
  
    100% {
      opacity: 0;
    }
  }
  
  a {
    text-decoration: none;
  
  }
  
  .inventory-container {
    display: flex;
    flex-wrap: wrap;
    height: calc(100% - 260px);
    //padding: 40px;
    margin-top: 5px;
  }
  
  .attribut {
    position: relative;
    font-size: 18px;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    padding-left: 20px;
    cursor: pointer;
  }
  
  .v-input__icon {
    background-color: red !important;
  }
  
  .attribut::before {
    content: "";
    position: absolute;
    top: -10px;
    bottom: 0;
    left: 0;
    width: 2px;
    height: 176%;
    background-color: rgb(223, 223, 223);
    transform: rotate(25deg);
    transform-origin: left top;
  }
  
  .inventory-item {
    width: 48%;
    margin: 5px;
    height: 18px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    justify-content: space-between;
    background-color: white;
  }
  
  @media (max-width: 960px) {
    .inventory-item {
      width: 100%;
    }
  
    .area {
      transform: translate(10px, -15px);
    }
  
    .el3d {
      display: none;
    }
  }
  
  .doc-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px;
    width: calc(100% - 55%)
  }
  
  .blocInformation {
    background-color: #f8f8f8d0;
    border-radius: 2px;
    margin-top: 10px;
    margin-bottom: 20px;
    margin-left: 11px;
    padding: 5px;
    box-shadow: 0 6px 24px #0000000d, 0 0 0 1px #00000014;
    border: 2px dashed #dbdbdb;
    border-radius: 6px;
  }
  
  .Spinal_card {
    font-family: Charlevoix Pro !important;
    cursor: pointer;
    width: 250px;
    height: 100px;
    border-radius: 5px;
    background: linear-gradient(45deg, rgb(209, 209, 209) 0%, rgb(233, 233, 233) 100%);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    margin: 5px
  }
  
  .inventory:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 120px;
    border-top: 2px solid rgb(235, 234, 234);
    width: auto;
  }
  
  .Spinal_card::before {
    content: "";
    height: 100px;
    width: 100px;
    position: absolute;
    top: -100%;
    left: 100%;
    background: url('../../assets/tets.svg') no-repeat center center;
    background-size: contain;
    transition: all .4s ease;
    filter: invert(1) saturate(5) hue-rotate(200deg) opacity(0.1);
    filter: blur(.5rem);
  }
  
  .Spinal_card:hover::before {
    top: 50%;
    left: 50%;
    transform: translate(30%, -0%);
    filter: blur(0rem);
  }
  
  .Spinal_card:hover::before {
    width: 140px;
    height: 140px;
    top: -30%;
    left: 50%;
    filter: blur(0rem);
  }
  
  .text {
    flex-grow: 1;
    padding: 10px;
    display: flex;
    flex-direction: column;
    color: #14202c;
    font-weight: 900;
    font-size: 1.2em;
    height: 30px
  }
  
  .subtitle {
    font-size: .6em;
    font-weight: 300;
    color: #14202c;
  }
  
  .icons {
    display: flex;
    justify-items: center;
    align-items: center;
    width: 250px;
    border-radius: 0px 0px 5px 5px;
    overflow: hidden;
  }
  
  .btn {
    z-index: 1;
    border: none;
    width: 100%;
    height: 35px;
    background-color: #ececec;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.4s
  }
  
  .adaptative {
    width: 80%;
    overflow: hidden;
    height: 50px;
    position: relative;
    right: 0px;
  }
  
  .svg-icon {
    width: 25px;
    height: 25px;
    stroke: #14202c;
  }
  
  .btn:hover {
    background-color: rgb(199, 199, 199);
  }
  
  .button {
    display: inline-block;
    padding: 5px;
    text-decoration: none;
    height: 62px;
    padding-left: 10px;
    padding-right: 10px;
    transition: 0.2s;
    white-space: nowrap;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 11px;
    font-size: xx-large;
    cursor: pointer;
    padding-left: 0px;
    width: 100%;
    position: relative;
  }
  
  .button:hover {
    background-color: rgb(228, 228, 228);
  }
  
  .v-text-field>.v-input__control>.v-input__slot:before {
    border-style: none !important;
  }
  
  .parallelogram {
    transform: skew(-20deg);
  }
  
  .skew-fix {
    display: inline-block;
    transform: skew(30deg);
    font-size: 14px;
  }
  
  .appli {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    background-color: #fff;
    width: 100%;
    height: calc(100% - 10px);
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-content: space-between;
  }
  
  .title {
    position: relative;
    width: 100%;
    display: flex;
  }
  
  .inventory {
    position: relative;
    padding: 10px;
    height: calc(100% - 30%);
    overflow: auto;
    overflow-x: hidden;
    height: 100%;
  }
  
  .inventory:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    border-top: 1px solid rgb(212, 212, 212);
    width: 100%;
  }
  
  
  
  .description {
    cursor: pointer;
    flex-direction: row-reverse;
    // padding: 10px;
    padding-top: 10px;
    background-color: #fff;
    border-top: 2px solid rgb(201, 201, 201);
    overflow: hidden;
    // overflow-y: auto;
    height: 110px;
    bottom: 0;
    display: flex;
    z-index: 10;
  }
  
  .description .color-span .color {
    border: 3px dashed #dbdbdb;
    width: 71px;
    height: 70px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.5s;
    /* Transition fluide */
  }
  
  .app_access:hover {
    background-color: rgb(228, 228, 228);
  }
  
  .app_access:hover .color .description .color-span {
    background-color: white !important;
  }
  
  
  .color:hover {
    background-color: rgb(218, 218, 218);
    /* Changement de couleur au hover */
  }
  
  .container_cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
    width: 100%;
    justify-content: center;
    align-items: center;
    max-height: 100%;
    overflow-y: auto;
    padding-bottom: 100px;
  
  }
  
  .iconCardAPp {
    border-right: 1px solid rgb(197, 197, 197);
    width: 74px;
    background-color: #f7f8f8;
    display: flex;
    justify-content: center;
    padding-top: 5px;
  }
  
  .cardDescription {
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    background-color: #fff;
    border-radius: 5px;
    width: 95%;
    height: 150px;
    margin-top: 8px;
    margin-bottom: 10px;
    transition: all .2s;
    display: flex;
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 2px #3c40434d, 0 1px 3px 1px #3c404326;
    // margin-left: 10px;
  }
  
  @media (max-width: 970px) {
    .cardDescription {
      width: 100vw;
    }
  }
  
  @media (min-width: 970px) {
    .hide {
      display: none;
      visibility: hidden;
    }
  }
  
  .cardDescription:hover {
    background-color: rgb(221, 221, 221);
  }
  
  .cardDescription:hover .gotoApp {
    background-color: rgb(218, 218, 218);
  }
  
  .data_cardDescription {
    width: 100%;
    height: 100%;
    display: flex;
    padding-left: 30px;
  }
  
  .gotoApp {
    justify-content: center;
    align-items: center;
    display: flex;
    // width: 13%;
    width: 50px;
    background-color: rgb(243, 243, 243);
    transition: 0.2s;
    z-index: 1;
  }
  
  .nombre_data_cardDescription {
    width: 40%;
    display: flex;
    align-items: center;
    font-size: 40px;
    height: 100%;
  
  }
  
  .description_data_cardDescription {
    width: 90%;
    justify-content: flex-start;
    align-items: center;
    display: flex;
    color: #14202c;
    padding-right: 5px;
    font-size: 18px;
    font-weight: bold;
    font-family: Charlevoix Pro !important;
    padding-top: 10px;
  
  }
  
  .microinfo {
    margin-bottom: 40px;
    font-size: 9px;
    transform: translate(-20px);
    white-space: nowrap;
    font-weight: bold;
  }
  
  .cardDescription::before {
    content: "";
    height: 100px;
    width: 100px;
    position: absolute;
    top: -100%;
    left: 100%;
    background-size: contain;
    transition: all .4s ease;
    filter: invert(1) saturate(5) hue-rotate(200deg) opacity(0.1);
    filter: blur(.5rem);
  }
  
  .cardDescription:hover::before {
    top: 50%;
    left: 50%;
    transform: translate(30%, -0%);
    filter: blur(0rem);
  }
  
  .cardDescription:hover::before {
    width: 140px;
    height: 140px;
    top: -10%;
    left: 50%;
    filter: blur(0.05rem);
  }
  
  .doc-vue {
    width: 55%;
    height: 100%;
    background: #14202c;
  }
  
  
  
  @media (max-width: 1024px) and (min-width: 768px) {
    .doc-vue {
      width: 100%;
      height: 50%;
    }
  
    .doc-content {
      width: 100%;
      height: 50%;
    }
  }
  
  .inventory-wrapper {
    display: flex;
    flex-direction: column;
    padding-left: 8px;
  }
  
  .category-block {
    border: 1px solid #ddd;
    overflow: hidden;
  }
  
  .category-header {
    padding: 12px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  
  .category-title {
    font-size: 16px;
  }
  
  .toggle-arrow {
    font-size: 18px;
  }
  
  .item-list {
    display: flex;
    flex-direction: column;
    // padding: 10px 0;
    background-color: #fff;
  }
  
  .item-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    border-top: 1px solid #eee;
    align-items: center;
    background-color: #f5f5f5;
    transition: 0.2s
  }
  
  .item-row:hover {
    background-color: #e0e0e0;
  }
  
  .item-name {
    font-size: 14px;
    font-family: Arial, sans-serif;
  }
  
  .item-icons {
    display: flex;
    gap: 10px;
  }
  
  .icon {
    font-size: 16px;
  }
  </style>
  