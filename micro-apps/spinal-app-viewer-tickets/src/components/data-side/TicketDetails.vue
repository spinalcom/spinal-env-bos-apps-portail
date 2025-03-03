<template>
    <div>
        <!--Dialog background-->
        <div v-show="value" class="dialog-background" @click="closePopUp"></div>

        <!--Dialog box to display the details of the tcket-->
        <v-card v-if="detailedTicket" elevation="24" v-show="value" class="dialog-box">
            <v-card-title style="max-height: 80px; overflow: hidden;" class="bold px-4 d-flex flex-wrap align-items-center">
    <div class="flex-grow-1 overflow-hidden" style="min-width: 150px;">
        {{ detailedTicket.name || "Nom" }}
    </div>
    <div class="flex-shrink-0 text-center mx-3" style="min-width: 200px;">
        Créé le: {{ dispDateCreation }}<br>Modifié le: {{ dispDateModif }}
    </div>
    <div class="flex-grow-1 text-right overflow-hidden" style="min-width: 150px;">
        Priorité: {{ detailedTicket.priority }}
    </div>
</v-card-title>


            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 130px)"
                class="d-flex flex-column overflow-y-auto overflow-x-hidden">
                <div style="height: 60%" class="d-flex flex-row pb-4 justify-space-between">
                    <div style="width: 40%" class="d-flex flex-column">
                        <div class="mb-4">
                            <div class="font-weight-bold">
                                <v-icon>mdi-account</v-icon>
                                Déclarant
                            </div>
                            <div class="pl-8" style="font-size: 12px; letter-spacing: -0.5px; line-height: 1.2;">
                                {{ detailedTicket.userName || "Non défini" }}
                            </div>

                        </div>
                        <div class="mb-4">
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
                                <!-- {{
                    detailedTicket.buildingName +
                    " : " +
                    detailedTicket.elementSelected.name
                  }} -->
                            </div>

                        </div>
                        <div class="mb-4">
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
                        </div>
                        <div class="d-flex flex-column overflow-y-hidden">
                            <div class="font-weight-bold">
                                <v-icon>mdi-text-box</v-icon>
                                Description
                            </div>
                            <div class="pl-8 overflow-y-auto">
                                {{ detailedTicket.description }}
                            </div>
                        </div>
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
                    <div  class="text-center py-1 infograph">
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
            <v-card-actions class="pa-4" style="height: 64px">
                <v-btn class="hide" text color="red" @click="downloadPDF">
                    Imprimer le ticket
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="closePopUp" color="blue darken-4" text class="bold">
                    FERMER
                </v-btn>
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
    },

    methods: {
        changeRoute(id, name) {
            const route = {
                'dynamicId': id,
                'name': name
            }
            // console.log(route);
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
    background-color: rgba(0, 0, 0, 0.1);

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
        margin-top:15px ; 
    }
}
</style>