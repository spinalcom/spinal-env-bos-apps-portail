<template>
    <div>
        <!--Dialog background-->
        <div v-show="value" class="dialog-background" @click="closePopUp"></div>

        <!--Dialog box to display the details of the tcket-->
        <v-card v-if="detailedTicket" elevation="24" v-show="value" class="dialog-box">
            <v-card-title style="max-height: 80px; overflow: hidden;justify-content: space-between;padding: 12px;"
                class="bold px-4 d-flex flex-row align-items-center">
                <div class="overflow-hidden d-flex" style="min-width: 150px;flex-direction: row;">
                    <!-- {{ detailedTicket.name || "Nom" }} -->
                    <div class="details-card-ticket-id">Ticket n°: {{ detailedTicket.dynamicId }}</div>
                    <div :class="['details-card-ticket-prio', priorityClass]" :style="priorityStyle">
                        {{ priorityLabel }}
                    </div>
                </div>
                <div class="details-card-ticket-date" style="min-width: 200px;">
                    <template v-if="isSameDate">
                        Créé le: {{ dispDateCreation }}
                    </template>
                    <template v-else>
                        Modifié le: {{ dispDateModif }}
                    </template>
                </div>
                <!-- <div class="flex-grow-1 text-right overflow-hidden" style="min-width: 150px;">
                    Priorité: {{ detailedTicket.priority }}
                </div> -->
            </v-card-title>


            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 130px)"
                class="d-flex flex-column overflow-y-auto overflow-x-hidden">
                <div style="height: 60%" class="d-flex flex-row pb-4 justify-space-between">
                    <div style="width: 40%" class="d-flex flex-column">
                        <div class="d-flex flex-row" style="justify-content: space-between;">
                            <div class="mb-4" style="width: 49%;">
                                <div class="font-weight-bold d-flex align-items-center">
                                    <v-icon>mdi-account</v-icon>
                                    <span style="margin-left: 8px;">Titre</span>
                                </div>
                                <div class="">
                                    <input type="text" :disabled="!isEditing" v-model="detailedTicket.name"
                                        placeholder="Non défini" :class="{ 'editable': isEditing }"
                                        style="width: 100%; font-size: 12px; border: 1px solid lightgrey; border-radius: 4px; padding: 4px 8px; color: grey;" />
                                </div>
                            </div>
                            <div class="mb-4" style="width: 49%;">
                                <div class="font-weight-bold d-flex align-items-center">
                                    <v-icon>mdi-map-marker</v-icon>
                                    <span style="margin-left: 8px;">Éspace</span>
                                </div>
                                <div class="input-style"
                                    style="width: 100%; font-size: 12px; border: 1px solid lightgrey; border-radius: 4px; padding: 4px 8px; color: grey; background-color: #f9f9f9; display: flex; align-items: center;">
                                    <span style="cursor: pointer; color: rgb(101, 100, 179);"
                                        @click="changeRoute(detailedTicket.elementSelected.position.building.dynamicId, detailedTicket.elementSelected.position.building.name)">
                                        {{ detailedTicket.buildingName }}
                                    </span>
                                    /
                                    <span
                                        v-if="detailedTicket.elementSelected.position.floor.name != detailedTicket.elementSelected.name"
                                        style="cursor: pointer; color: rgb(101, 100, 179);"
                                        @click="changeRoute(detailedTicket.elementSelected.position.floor.dynamicId, detailedTicket.elementSelected.position.floor.name)">
                                        {{ detailedTicket.elementSelected.position.floor.name }}
                                    </span>
                                    /
                                    <span style="cursor: pointer; color: rgb(101, 100, 179);"
                                        @click="changeRoute(detailedTicket.elementSelected.dynamicId, detailedTicket.elementSelected.name)">
                                        {{ detailedTicket.elementSelected.name }}
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div class="mb-4" style="width: 100%;">
                            <div class="font-weight-bold d-flex align-items-center">
                                <v-icon>mdi-account</v-icon>
                                <span style="margin-left: 8px;">Description</span>
                            </div>
                            <div>
                                <textarea :disabled="!isEditing" v-model="detailedTicket.description"
                                    placeholder="Non défini" :class="{ 'editable': isEditing }"
                                    style="width: 100%; height: 70px; font-size: 12px; border: 1px solid lightgrey; border-radius: 4px; padding: 5px; color: grey; resize: none; overflow: auto; text-align: left; line-height: 1.5;"></textarea>
                            </div>
                        </div>
                        <div class="d-flex flex-row" style="justify-content: space-between;">
                            <!-- Workflow & Process -->
                            <div class="mb-4" style="width: 49%;">
                                <div class="font-weight-bold d-flex align-items-center">
                                    <v-icon>mdi-sitemap</v-icon>
                                    <span style="margin-left: 8px;">Workflow & Process</span>
                                </div>
                                <div class="">
                                    <v-select v-model="selectedWorkflow" :items="workflows" label="Select Workflow"
                                        outlined dense :disabled="!isEditing" style="font-size: 12px; color: grey;">
                                    </v-select>
                                    <v-select v-model="selectedProcess" :items="processes" label="Select Process"
                                        outlined dense :disabled="!isEditing"
                                        style="font-size: 12px; color: grey; margin-top: 8px;">
                                    </v-select>
                                </div>
                            </div>

                            <!-- Étape -->
                            <div class="mb-4" style="width: 49%;">
                                <div class="font-weight-bold d-flex align-items-center">
                                    <v-icon>mdi-step-forward</v-icon>
                                    <span style="margin-left: 8px;">Étape</span>
                                </div>
                                <div class="">
                                    <v-select v-model="selectedStep" :items="steps" label="Select Étape" outlined dense
                                        :disabled="!isEditing" style="font-size: 12px; color: grey;">
                                    </v-select>
                                </div>
                            </div>
                        </div>


                        <div class="mb-4">
                            <div class="font-weight-bold">
                                <v-icon>mdi-account</v-icon>
                                Declarant
                            </div>
                            <div class="pl-8" style="font-size: 12px; letter-spacing: -0.5px; line-height: 1.2;">
                                {{ detailedTicket.userName || "Non défini" }}
                            </div>

                        </div>
                        <!-- <div class="mb-4">
                            <div class="font-weight-bold">
                                <v-icon>mdi-map-marker</v-icon>
                                Espace
                            </div>
                            <div class="pl-4">
                                <span style="cursor: pointer;color: rgb(101, 100, 179)"
                                    @click="changeRoute(detailedTicket.elementSelected.position.building.dynamicId, detailedTicket.elementSelected.position.building.name)">{{
                                        detailedTicket.buildingName }}</span> /
                                <span
                                    v-if="detailedTicket.elementSelected.position.floor.name != detailedTicket.elementSelected.name"
                                    style="cursor: pointer;color: rgb(101, 100, 179)"
                                    @click="changeRoute(detailedTicket.elementSelected.position.floor.dynamicId, detailedTicket.elementSelected.position.floor.name)">{{
                                        detailedTicket.elementSelected.position.floor.name }} /</span>
                                <span style="cursor: pointer;color: rgb(101, 100, 179)"
                                    @click="changeRoute(detailedTicket.elementSelected.dynamicId, detailedTicket.elementSelected.name,)">{{
                                        detailedTicket.elementSelected.name }}</span>
                               
                            </div>

                        </div> -->
                        <!-- <div class="mb-4">
                            <div class="font-weight-bold">
                                <v-icon>mdi-sitemap</v-icon>
                                Workflow & Process
                            </div>
                            <div class="pl-4" style="font-size: 12px; letter-spacing: -0.5px; line-height: 1.2;">
                                {{ detailedTicket.workflowName }} |
                                {{ detailedTicket.process.name }}
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="font-weight-bold">
                                <v-icon>mdi-step-forward</v-icon>
                                Étape
                            </div>
                            <div class="pl-4" style="font-size: 12px; letter-spacing: -0.5px; line-height: 1.2;">
                                <div class="mr-1 rounded-circle ps-3 pt-3 d-inline-block" :style="{
                                    background:
                                        detailedTicket.step.color + ' no-repeat padding-box',
                                }"></div>
                                {{ detailedTicket.step.name }}
                            </div>
                        </div> -->
                        <!-- <div class="d-flex flex-column overflow-y-hidden">
                            <div class="font-weight-bold">
                                <v-icon>mdi-text-box</v-icon>
                                Description
                            </div>
                            <div class="pl-8 overflow-y-auto">
                                {{ detailedTicket.description }}
                            </div>
                        </div> -->
                    </div>
                    <!--carousel-->
                    <carousel-component v-if="images_loaded" style="width: 59%"
                        :image_list="images"></carousel-component>
                    <div ref="loader" v-else style="width: 59%; background-color: #eee"
                        class="d-flex align-center justify-center">
                        <v-progress-circular indeterminate :size="loader_size"></v-progress-circular>
                    </div>
                </div>
                <!--Tableaux-->
                <div style="height: 40%" class="flexdisplay">
                    <div class="text-center py-1 infograph">
                        <div style="background-color: gray" class="py-2 font-weight-bold rounded-t-lg">
                            LOGS
                        </div>
                        <v-data-table style="border: 1px solid gray" :headers="logsHeaders" :items="logsValues"
                            :items-per-page="5" :height="169" fixed-header :footer-props="{
                                'disable-items-per-page': true,
                            }">
                        </v-data-table>
                    </div>
                    <div class="text-center py-1 infograph">
                        <div style="background-color: gray" class="py-2 font-weight-bold rounded-t-lg">
                            ANNOTATIONS
                        </div>
                        <v-data-table style="border: 1px solid gray" :headers="annotationsHeaders"
                            :items="annotationsValues" :items-per-page="5" :height="169" fixed-header :footer-props="{
                                'disable-items-per-page': true,
                            }"></v-data-table>
                    </div>
                </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions style="height: 64px;width: 100%;">
                <div class="button-row" style="width: 100%;">
                    <!-- Left button -->
                    <button style="width: 20%;" class="btn btn-delete" @click="deleteTicket">Supprimer le
                        ticket</button>

                    <!-- Right buttons -->
                    <div class="btn-group" style="width: 30%;">
                        <button class="btn btn-archive" v-if="!isEditing" @click="archiveTicket">Archiver le
                            ticket</button>
                        <button class="btn btn-annuler" v-else @click="cancelEdit">Annuler</button>

                        <button class="btn btn-edit" @click="toggleEdit">
                            {{ isEditing ? 'Sauvegarder' : 'Modifier le ticket' }}
                        </button>
                    </div>
                </div>

                <!-- <v-btn class="hide" text color="red" @click="downloadPDF">
                    Imprimer le ticket
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="closePopUp" color="blue darken-4" text class="bold">
                    FERMER
                </v-btn> -->
            </v-card-actions>
        </v-card>

        <!--Content of the pdf file to be downloaded-->
        <div id="pdf-div" v-if="detailedTicket" v-show="showPDF" class="pa-4 overflow-y-hidden">
            <div class="text-center title font-weight-bold mb-10 downloadable">
                Détails du ticket
            </div>
            <div class="mb-4 downloadable">
                <div class="font-weight-bold">
                    <v-icon>mdi-ticket</v-icon>
                    Nom du ticket
                </div>
                <div class="pl-8">
                    {{ detailedTicket.name }}
                </div>
            </div>
            <div class="mb-4 downloadable">
                <div class="font-weight-bold">
                    <v-icon>mdi-calendar-range</v-icon>
                    Date de création
                </div>
                <div class="pl-8">
                    {{ dispDateCreation }}
                </div>
            </div>
            <div class="mb-4 downloadable">
                <div class="font-weight-bold">
                    <v-icon>mdi-update</v-icon>
                    Dernière mise à jour
                </div>
                <div class="pl-8">
                    {{ dispDateModif }}
                </div>
            </div>
            <div class="mb-4 downloadable">
                <div class="font-weight-bold">
                    <v-icon>mdi-priority-high</v-icon>
                    Priorité
                </div>
                <div class="pl-8">
                    {{ detailedTicket.priority }}
                </div>
            </div>
            <div class="mb-4 downloadable">
                <div class="font-weight-bold">
                    <v-icon>mdi-account</v-icon>
                    Déclarant
                </div>
                <div class="pl-8">
                    {{ detailedTicket.userName || "Non défini" }}
                </div>
            </div>
            <div class="mb-4 downloadable">
                <div class="font-weight-bold">
                    <v-icon>mdi-map-marker</v-icon>
                    Espace
                </div>
                <div class="pl-8">
                    {{
                        detailedTicket.buildingName +
                        " : " +
                        detailedTicket.elementSelected.name
                    }}
                </div>
            </div>
            <div class="mb-4 downloadable">
                <div class="font-weight-bold">
                    <v-icon>mdi-sitemap</v-icon>
                    Workflow & Process
                </div>
                <div class="pl-8">
                    {{ detailedTicket.workflowName }} |
                    {{ detailedTicket.process.name }}
                </div>
            </div>
            <div class="mb-8 downloadable ">
                <div class="font-weight-bold">
                    <v-icon>mdi-step-forward</v-icon>
                    Étape
                </div>
                <div class="pl-8">
                    <div class="mr-1 rounded-circle ps-3 pt-3 d-inline-block" :style="{
                        background: detailedTicket.step.color + ' no-repeat padding-box',
                    }"></div>
                    {{ detailedTicket.step.name }}
                </div>
            </div>
            <div class="downloadable">
                <div class="font-weight-bold">
                    <v-icon>mdi-text-box</v-icon>
                    Description
                </div>
                <div class="pl-8">{{ detailedTicket.description }}</div>
            </div>

            <div class="my-4 downloadable">
                <div class="font-weight-bold">LOGS</div>
                <v-simple-table class="text-left">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th v-for="item in logsHeaders" :key="item.value" style="border: 1px solid gray">
                                    {{ item.text }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in logsValues" :key="i">
                                <td style="border: 1px solid gray">{{ item.event }}</td>
                                <td style="border: 1px solid gray">{{ item.date }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </div>
            <div v-if="detailedTicket.annotation_list.length > 0" class="my-4 downloadable">
                <div class="font-weight-bold">ANNOTATIONS</div>
                <v-simple-table class="text-left">
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th v-for="item in annotationsHeaders" :key="item.value" style="border: 1px solid gray">
                                    {{ item.text }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in annotationsValues" :key="i">
                                <td style="border: 1px solid gray">{{ item.userName }}</td>
                                <td style="border: 1px solid gray">{{ item.date }}</td>
                                <td style="border: 1px solid gray">{{ item.message }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </div>

            <div v-if="detailedTicket.file_list.length > 0" class="mt-4">
                <div class="font-weight-bold my-3 downloadable">PIÈCES JOINTES</div>
                <img v-for="(image, i) in images" :key="i" :src="image.src" class="pa-3 downloadable"
                    style="max-width: 100%; height: auto" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { displayDate } from "../date";
import html2canvas from "html2canvas";
import CarouselComponent from "./CarouselComponent.vue";
export default {
    components: { CarouselComponent },

    props: {
        value: {
            type: Boolean,
            default: false,
        },

        detailedTicket: {
            type: Object,
            required: true,
        },

        baseURL: {
            type: String,
            required: true,
        },

        token: {
            type: String,
            required: false,
        },
    },

    data: () => ({
        images_loaded: false,
        images: undefined,
        showPDF: false,
        PDFparts: [],
        loader_size: 100,
        isEditing: false,
        workflows: ["Workflow 1", "Workflow 2", "Workflow 3"],
        processes: ["Process 1", "Process 2", "Process 3"],
        steps: ["Step 1", "Step 2", "Step 3"],
        selectedWorkflow: "",
        selectedProcess: "",
        selectedStep: "",
    }),

    computed: {
        dispDateCreation() {
            return displayDate(this.detailedTicket.creationDate);
        },
        dispDateModif() {
            return this.detailedTicket.log_list.length > 0
                ? displayDate([...this.detailedTicket.log_list].reverse()[0]?.date)
                : this.dispDateCreation;
        },
        isSameDate() {
            return this.dispDateCreation === this.dispDateModif;
        },
        logsHeaders() {
            return [
                { text: "Évenement", value: "event" },
                { text: "Date", value: "date", sort: (a, b) => this.compareDate(a, b) },
            ];
        },
        logsValues() {
            return this.detailedTicket.log_list.map((l) => ({
                event: l.event,
                date: displayDate(l.date),
            }));
        },
        annotationsHeaders() {
            return [
                { text: "Déclarant", value: "userName" },
                { text: "Date", value: "date", sort: (a, b) => this.compareDate(a, b) },
                { text: "Message", value: "message", width: "70%" },
            ];
        },
        annotationsValues() {
            return this.detailedTicket.annotation_list.map((a) => ({
                userName: a.userName || "Non défini",
                date: displayDate(a.date),
                message: a.message,
            }));
        },
        isDownloadable() {
            const requiredLength = document.querySelectorAll(".downloadable").length;
            const currentLength = this.PDFparts.length;
            return requiredLength > 0 && currentLength === requiredLength;
        },
        url() {
            let url = this.baseURL;
            if (!url.endsWith("/")) url += "/";
            return url;
        },
        priorityLabel() {
            const labels = ['Priorité Élevé', 'Priorité Moyenne', 'Priorité Faible'];
            return labels[this.detailedTicket.priority] || 'Priorité Inconnue';
        },
        priorityClass() {
            return {
                'low-priority': this.detailedTicket.priority === 2,
                'medium-priority': this.detailedTicket.priority === 1,
                'high-priority': this.detailedTicket.priority === 0,
            };
        },
        priorityStyle() {
            const colors = ['#FF000020', '#FFA50020', '#00800020'];
            return {
                backgroundColor: `${colors[this.detailedTicket.priority]}`,
            };
        },
    },

    methods: {
        changeRoute(id, name) {
            const route = {
                'dynamicId': id,
                'name': name
            }
            this.$emit("changeRoute", route);
        },

        closePopUp() {
            this.$emit("input", false);
        },

        downloadPDF() {
            this.showPDF = true;
            setTimeout(() => {
                const docs = document.querySelectorAll(".downloadable");
                this.showPDF = !this.showPDF;
                for (const el of docs)
                    html2canvas(el).then((canvas) => {
                        const b64 = canvas.toDataURL();
                        this.PDFparts.push(
                            `<div><img style="margin-bottom: 12px; max-width: 100%; height: auto" src="${b64}" /></div>`
                        );
                    });
            }, 10);
        },

        async getFileAsync(nodeId) {
            const result = await axios.post(
                `${this.url}${nodeId}/download_file`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                    responseType: "blob",
                }
            );
            return window.URL.createObjectURL(result.data);
        },
        deleteTicket() {
            // alert("Ticket supprimé !");
            // Add logic to handle ticket deletion
        },
        archiveTicket() {
            // alert("Ticket archivé !");
            // Add logic to handle ticket archiving
        },
        cancelEdit() {
            this.isEditing = false;
            // alert("Modification annulée !");
        },
        toggleEdit() {
            this.isEditing = !this.isEditing;
            if (this.isEditing) {
                // alert("Modification activée !");
                console.log("Workflow:", this.selectedWorkflow);
                console.log("Process:", this.selectedProcess);
                console.log("Étape:", this.selectedStep);
            } else {
                // alert("Modifications sauvegardées !");
                // Add logic to save changes
                console.log("Workflow:", this.selectedWorkflow);
                console.log("Process:", this.selectedProcess);
                console.log("Étape:", this.selectedStep);
            }
        },
    },

    async mounted() {
        const { loader } = this.$refs;
        const size =
            loader.clientWidth < loader.clientHeight
                ? loader.clientWidth
                : loader.clientHeight;
        this.loader_size = size * 0.4;

        window.onresize = () => {
            const size =
                loader.clientWidth < loader.clientHeight
                    ? loader.clientWidth
                    : loader.clientHeight;
            this.loader_size = size * 0.4;
        };

        if (this.detailedTicket)
            this.images = (
                await Promise.all(
                    this.detailedTicket.file_list.map(async (file) => {
                        try {
                            const img = await this.getFileAsync(file.dynamicId);
                            return { name: file.Name, src: img };
                        } catch {
                            return undefined;
                        }
                    })
                )
            ).filter((i) => i);
        this.images_loaded = true;
    },

    watch: {
        async isDownloadable(v) {
            if (v) {
                const mywindow = window.open("", "PRINT", "height=600,width=900");
                mywindow.document.write(
                    `<html><head><title> ${this.detailedTicket.name} </title>`
                );
                mywindow.document.write("</head><body >");
                for (const part of this.PDFparts) {
                    mywindow.document.writeln(part);
                }
                await mywindow.document.writeln("</body></html>");

                mywindow.document.close();
                mywindow.focus();
                mywindow.print();
                mywindow.close();
                this.PDFparts = [];
            }
        },
        async value(v) {
            if (v) {
                this.images_loaded = false;
                this.images = (
                    await Promise.all(
                        this.detailedTicket.file_list.map(async (file) => {
                            try {
                                const img = await this.getFileAsync(file.dynamicId);
                                return { name: file.Name, src: img };
                            } catch {
                                return undefined;
                            }
                        })
                    )
                ).filter((i) => i);
                this.images_loaded = true;
            }
        },
    },
};
</script>

<style scoped>
.dialog-background {
    position: fixed;
    width: 3000px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);

}

.dialog-box {
    position: absolute;
    width: 85%;
    height: calc(100% - 120px);
    top: 70px;
    left: 7.5%;
}

.flexdisplay {
    display: flex !important;
    flex-direction: row !important;
    /* background-color: red; */
}

.infograph {
    width: 49%;
    margin: 5px;
}

input {
    transition: all 0.3s ease-in-out;
}

/* Styles when in editable mode */
input.editable {
    border: 2px solid;
    border-color: #14202c;
    background-color: #fff;
    color: white;
}

.details-card-ticket-id {
    font-size: 14px;
    font-weight: bold;
    color: #14202c;
    margin-right: 10px;
}

.details-card-ticket-prio {
    background-color: #f0f0f0;
    padding: 0px 5px;
    border-radius: 5px;
    font-size: 13px;
    font-weight: bold;
}

.low-priority {
    color: #008000;
}

.medium-priority {
    color: #FFA500;
}

.high-priority {
    color: #FF0000;
}

.details-card-ticket-date {
    font-size: 14px;
    font-weight: bold;
    color: #14202c;
    text-align: right
}


/* Buttons */
.button-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
}

.btn-group {
    display: flex;
    gap: 10px;
}

.btn {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
}

.btn-delete {
    background-color: #ffcccc;
    color: #ff0000;
}

.btn-delete:hover {
    background-color: #ff9999;
}

.btn-edit {
    background-color: #14202c !important;
    color: #fff !important;
}

.btn-edit:hover {
    background-color: #333 !important;
}

.btn-archive {
    background-color: #f2f2f2;
    color: #14202c;
    border: 2px solid #14202c;
}

.btn-annuler {
    background-color: #f2f2f2;
    color: #14202c;
    border: 2px solid #14202c;
}

.btn-group .btn {
    background-color: #f2f2f2;
    color: #000;
}

.btn-group .btn:hover {
    background-color: #e0e0e0;
}


@media (max-width: 900px) {
    .hide {
        display: none !important;
        visibility: hidden !important;
    }


}



@media (max-width: 900px) {

    .flexdisplay {
        display: flex !important;
        flex-direction: column !important;
        /* background-color: red; */
    }

    .infograph {
        width: 100%;
        margin: 0px;
        margin-top: 15px;
    }
}
</style>