<template>
    <v-card class="table-container spinal-scrollbar">
        <!--div @click="moveRandomTicketsToTop()">
            Move tickets up
        </div>
        <div @click="resetTickets()" style="margin-top: 10px; cursor: pointer; color: blue;">
            Reset Tickets
        </div-->

        <v-simple-table>
            <thead>
                <tr>
                    <th style="width: 13%;">
                        <div class="d-flex flex-row"
                            style="justify-content: start; align-items: center; background-color: #F6F7F9;"
                            @click="changeSort('priority')">
                            <div class="prio-header">Priorité</div>
                            <div>#ID</div>
                            <div class="sort-icon" :class="{
                                'sort-icon-asc': sortKey === 'priority' && sortOrder === 'asc',
                                'sort-icon-desc': sortKey === 'priority' && sortOrder === 'desc',
                                'sort-icon-default': sortKey !== 'priority'
                            }"></div>
                        </div>
                    </th>
                    <th style="width: 16%;" @click="changeSort('creationDate')">
                        <div style="width: 100%; display: flex; flex-direction: row;">
                            <div>Créé le</div>
                            <div class="sort-icon" :class="{
                                'sort-icon-asc': sortKey === 'creationDate' && sortOrder === 'asc',
                                'sort-icon-desc': sortKey === 'creationDate' && sortOrder === 'desc',
                                'sort-icon-default': sortKey !== 'creationDate'
                            }"></div>
                        </div>
                    </th>
                    <th style="width: 36%;" @click="changeSort('name')">
                        <div style="width: 100%; display: flex; flex-direction: row;">
                            <div>Libellé</div>
                            <div class="sort-icon" :class="{
                                'sort-icon-asc': sortKey === 'name' && sortOrder === 'asc',
                                'sort-icon-desc': sortKey === 'name' && sortOrder === 'desc',
                                'sort-icon-default': sortKey !== 'name'
                            }"></div>
                        </div>
                    </th>

                    <th style="width: 22%;" @click="changeSort('step.name')">
                        <div style="width: 100%; display: flex; flex-direction: row;">
                            <div>Status</div>
                            <div class="sort-icon" :class="{
                                'sort-icon-asc': sortKey === 'step.name' && sortOrder === 'asc',
                                'sort-icon-desc': sortKey === 'step.name' && sortOrder === 'desc',
                                'sort-icon-default': sortKey !== 'step.name'
                            }"></div>
                        </div>
                    </th>
                    <th style="width: 13%; text-align: center;">Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(ticket, index) in sortedData" :data-id="ticket.dynamicId" :key="index"
                    @click="handleClickOfLocate(ticket)"
                    :class="{ 'selectedTicket-class': (selectedTicket && selectedTicket.dynamicId == ticket.dynamicId) || ticket.isSelected, 'selected-ticket-item': selectedTicket && selectedTicket.dynamicId == ticket.dynamicId }">

                    <td style="width: 13%;">
                        <div class="d-flex flex-row row-style">
                            <div class="priority-indicator" :style="{ background: getPriorityColor(ticket.priority) }">
                            </div>
                            <div :style="{ fontWeight: ticket.step.order === 0 ? 'bold' : 'normal' }">
                                #{{ ticket.dynamicId }}</div>
                        </div>
                    </td>
                    <td style="width: 16%;">{{ formatDate(ticket.creationDate) }}</td>
                    <td style="width: 36%;">
                        <div class="d-flex flex-row ">
                            <!-- <div v-if="ticket.elementSelected.type === 'geographicRoom'"
                                :style="{ background: getPriorityColor(ticket.priority) }"
                                style="margin-right:5px; width: 12px;height: 12px;border-radius: 50%;align-items: center;justify-content: center;"
                                class="d-flex flex-row">
                                <div style="background-color: #fff; width: 8px;height: 8px;border-radius: 50%;"></div>
                            </div>
                            <div v-else-if="ticket.elementSelected.type === 'geographicFloor'"
                                :style="{ background: getPriorityColor(ticket.priority) }"
                                style="margin-right:5px; width: 12px;height: 12px;align-items: center;justify-content: center;"
                                class="d-flex flex-row">
                                <div style="background-color: #fff; width: 8px;height: 8px;"></div>
                            </div> -->
                            <div  class="triangle-outer"
                                :style="{ background: getPriorityColor(ticket.priority) }">
                                <div class="triangle-inner"></div>
                            </div>
                            <div class="ticket-name-data" style="margin-bottom: 3px;"
                                :style="{ fontWeight: ticket.step.order === 0 ? 'bold' : 'normal' }">
                                {{ ticket.name.length > 25 ? ticket.name.substring(0, 25) + '...' :
                                    ticket.name }}</div>
                        </div>
                        <div class="process-type-data">{{ ticket.process.name }}</div>
                    </td>
                    <td style="width: 22%;">
                        <div class="d-flex flex-row justify-content-start status-indicator"
                            :style="{ background: `${ticket.step.color}20` }">
                            <div class="status-indicator-point" :style="{ background: ticket.step.color }"></div>
                            <span>
                                {{ ticket.step.name.length > 25 ? ticket.step.name.substring(0, 25) + '...' :
                                    ticket.step.name }}
                            </span>
                        </div>
                    </td>
                    <td style="width: 13%;">
                        <div class="d-flex flex-row" style="justify-content: space-around;align-items: center;">
                            <div @click="handleClickOfDetails(ticket)" class="action-button">
                                <div class="action-icon"></div>
                                <div v-if="config !== 'Admin'" cla1ss="action-text">Details</div>
                            </div>
                            <div v-if="config === 'Admin'" @click="handleClickOfLocate(ticket)" class="action-button">
                                <div class="more-action-icon"></div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
    </v-card>
</template>

<script lang="ts">
import { Vue, Prop, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
// import { EventBus } from '../../SpaceSelector/eventBus';

@Component({
    name: "TicketTable",
})
class TicketTable extends Vue {
    @Prop({ required: true }) data!: Array<any>;
    @Prop({ required: false }) config!: any;
    localData: Array<any> = [];


    sortKey: string = ""; // Column being sorted
    sortOrder: "asc" | "desc" = "asc"; // Sorting order
    isSearchActive: boolean = false; // Search state
    searchQuery: string = ""; // Search query
    selectedTicket: any = null;


    // Maps priority to color
    getPriorityColor(priority: number): string {
        const colors = ["red", "orange", "green"];
        return colors[priority] || "gray";
    }

    get filteredData() {
        const searchQueryLower = this.searchQuery.toLowerCase();
        return this.localData.filter((ticket) =>
            ticket.name.toLowerCase().includes(searchQueryLower)
        );
    }

    activateSearch() {
        this.isSearchActive = true;
    }

    resetSearch() {
        this.isSearchActive = false;
        this.searchQuery = "";
    }
    handleSearch() {
        // Filter logic is handled by the computed property
    }

    // Formats the creation date
    formatDate(timestamp: number): string {
        const date = new Date(timestamp);
        const currentYear = new Date().getFullYear();

        const options: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };

        if (date.getFullYear() !== currentYear) {
            options.year = "numeric";
        }

        return date.toLocaleDateString("fr-FR", options);
    }
    // get sortedData() {
    //     if (!this.sortKey) return this.data;

    //     return [...this.data].sort((a, b) => {
    //         const valueA = this.getNestedValue(a, this.sortKey);
    //         const valueB = this.getNestedValue(b, this.sortKey);

    //         if (valueA < valueB) return this.sortOrder === "asc" ? -1 : 1;
    //         if (valueA > valueB) return this.sortOrder === "asc" ? 1 : -1;
    //         return 0;
    //     });
    // }
    get sortedData() {
        if (!this.sortKey) return this.localData;

        return [...this.localData].sort((a, b) => {
            const valueA = this.getNestedValue(a, this.sortKey);
            const valueB = this.getNestedValue(b, this.sortKey);

            if (valueA < valueB) return this.sortOrder === "asc" ? -1 : 1;
            if (valueA > valueB) return this.sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }


    // Change the sorting key and order
    changeSort(key: string) {
        if (this.sortKey === key) {
            this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
        } else {
            this.sortKey = key;
            this.sortOrder = "asc";
        }
    }

    // Helper method for nested properties
    getNestedValue(object: any, key: string): any {
        return key.split('.').reduce((o, k) => (o || {})[k], object);
    }
    moveRandomTicketsToTop() {
        if (this.data.length === 0) return;

        // Shuffle the data array and select the first 5 tickets
        const shuffledTickets = [...this.data].sort(() => 0.5 - Math.random());
        const randomTickets = shuffledTickets.slice(0, 5);

        this.moveTicketsToTop(randomTickets);
    }

    moveTicketsToTop(ticketsToMove: Array<any>) {
        this.resetTickets();
        const selectedIds = ticketsToMove.map(ticket => ticket.dynamicId);

        // Separate the tickets to move from the rest
        const selectedTickets = this.localData.filter(ticket => selectedIds.includes(ticket.dynamicId));
        const remainingTickets = this.localData.filter(ticket => !selectedIds.includes(ticket.dynamicId));

        // Update localData with selected tickets on top
        this.localData = [...selectedTickets, ...remainingTickets];

        // Mark all selected tickets
        this.selectedTicket = null;  // Clear any existing selection
        this.selectedTicket = selectedTickets[0];  // Select the first ticket
        selectedTickets.forEach(ticket => {
            this.$set(ticket, 'isSelected', true);
        });
        // EventBus.$emit("call-card", selectedTickets[0]);
    }
    resetTickets() {
        // this.localData = [...this.data]; // Reset localData to the original prop value

        // Clear the selected tickets
        this.selectedTicket = null;
        this.localData.forEach(ticket => {
            this.$set(ticket, 'isSelected', false);
        });
    }

    nextCardTable(ticket: any) {
        const currentIndex = this.localData.findIndex(t => t.dynamicId === ticket.dynamicId);
        if (currentIndex !== -1 && currentIndex < this.localData.length - 1) {
            this.setSelectedTicket(this.localData[currentIndex]);
        }
    }

    prevCardTable(ticket: any) {
        const currentIndex = this.localData.findIndex(t => t.dynamicId === ticket.dynamicId);
        if (currentIndex > 0) {
            this.setSelectedTicket(this.localData[currentIndex]);
        }
    }

    // Helper function to set the selected ticket
    setSelectedTicket(ticket: any) {
        // this.localData.forEach(t => {
        //     this.$set(t, 'isSelected', false);
        // });

        this.selectedTicket = ticket;
        // this.$set(ticket, 'isSelected', true);

        // Emit event if needed
        // this.$emit("locate", ticket);
    }


    mounted() {
        // EventBus.$on("move-tickets-top", this.moveTicketsToTop);
        // EventBus.$on("reset-tickets", this.resetTickets);
        // EventBus.$on("next-card-table", this.nextCardTable);
        // EventBus.$on("prev-card-table", this.prevCardTable);
        
        this.localData = [...this.data];
        console.log(this.localData , 'the local data');
        
    }
    // beforeDestroy() {
    //     EventBus.$off("move-tickets-top", this.moveTicketsToTop);
    //     EventBus.$on("reset-tickets", this.resetTickets);
    //     EventBus.$off("next-card-table", this.nextCardTable);
    //     EventBus.$off("prev-card-table", this.prevCardTable);

    // }

    handleClickOfDetails(ticket: any) {
        this.$emit("display", ticket);
    }

    handleClickOfLocate(ticket: any) {
        this.localData.forEach(ticket => {
            this.$set(ticket, 'isSelected', false);
        });
        this.selectedTicket = ticket;
        this.$emit("locate", ticket);
    }
    @Watch('data', { immediate: true, deep: true })
    onDataChange(newData) {
        // Preserve selected state
        const selectedIds = new Set(this.localData.filter(t => t.isSelected).map(t => t.dynamicId));

        // Merge new data while keeping selections
        let updatedData = newData.map(ticket => ({
            ...ticket,
            isSelected: selectedIds.has(ticket.dynamicId),
        }));

        // Move selected tickets to the top
        this.localData = [
            ...updatedData.filter(ticket => ticket.isSelected),
            ...updatedData.filter(ticket => !ticket.isSelected),
        ];
        // this.localData = this.localData.map(existingTicket => {
        //     const newTicket = newData.find(t => t.dynamicId === existingTicket.dynamicId);
        //     return newTicket ? { ...newTicket, isSelected: selectedIds.has(newTicket.dynamicId) } : existingTicket;
        // });

        // // Append any new tickets that were not already in localData
        // const newTickets = newData.filter(ticket => !this.localData.some(t => t.dynamicId === ticket.dynamicId));
        // this.localData = [...this.localData, ...newTickets];
    }
    @Watch('selectedTicket', { immediate: true })
    onSelectedTicketChange(newTicket) {
        this.$nextTick(() => {
            if (newTicket) {
                const selectedRow = this.$el.querySelector(
                    `tr[data-id="${newTicket.dynamicId}"]`
                );
                if (selectedRow) {
                    selectedRow.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        });
    }

}

export { TicketTable };
export default TicketTable;
</script>


<style scoped>
.table-container {
    overflow-y: auto;
    overflow-x: hidden;
    margin-left: 10px;
}

.sort-icon {
    background-color: white;
    width: 10px;
    height: 10px;
    margin-left: 5px;
    margin-top: 2px;
    cursor: pointer;
    transition: transform 0.3s;
    background-size: 250%;
    background-repeat: no-repeat;
    background-position: center;
}

.sort-icon-asc {
    background-image: url(../../assets/sort-active.svg);
    transform: rotate(90deg);
    font-weight: bold;
}

.sort-icon-desc {
    background-image: url(../../assets/sort-active.svg);
    transform: rotate(270deg);
    font-weight: bold;
}

.sort-icon-default {
    background-image: url(../../assets/sort.svg);
    transform: rotate(-90deg);
    font-weight: normal;
}

.prio-header {
    margin-right: 5px;
    padding: 5px;
    background-color: rgba(232, 65, 65, 0.19);
    color: rgb(232, 65, 65);
    height: 23px;
    border-radius: 5px;
}

.priority-indicator {
    border-radius: 3px;
    width: 9px;
    height: 24px;
    margin-right: 5px;
    display: inline-block;
}

.status-indicator {
    padding: 5px;
    border-radius: 5px;
    color: #14202c;
    font-size: 11px;
    align-items: center;
}

.status-indicator-point {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
}

.icon-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.search-input {
    width: 100%;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 4px;
    font-size: 12px;
}

.search-icon {
    width: 15px;
    height: 15px;
    background-image: url(../../assets/seach.svg);
    background-size: cover;
    cursor: pointer;
}

.close-icon {
    width: 15px;
    height: 15px;

    /* background-image: url(../assets/close.svg); */
    /* background-image: url("../assets/close.svg"); */
    background-size: cover;
    cursor: pointer;
    margin-left: 5px;
}

.row-style {
    align-items: center;
}

td,
th {
    font: normal normal normal 11px/13px Charlevoix Pro;
    border-bottom: 0 !important;
    border: 0.5px solid #0000001f !important;
    padding: 10px 10px !important;
    font-size: 11px !important;
}

th {
    background-color: #F6F7F9;
}

.process-type-data {
    color: #14202c65;
    opacity: 1;
    font-size: 10px;
}

.ticket-name-data {
    font-size: 13px;
    color: #14202c;
}

.action-icon {
    margin-right: 2px;
    width: 15px;
    height: 15px;
    color: #14202c;
    background-image: url("../../assets/eye.svg");
    background-size: 70%;
    background-position: center;
    background-repeat: no-repeat;
}

.more-action-icon {
    margin-right: 2px;
    width: 15px;
    height: 15px;
    color: #14202c;
    background-image: url("../../assets/more.svg");
    background-size: 70%;
    background-position: center;
    background-repeat: no-repeat;
}

.action-text {
    font-size: 12px;
    color: #fff;
}

.action-button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    /* width: 80%; */
    padding: 5px;
    border-radius: 5px;
    background-color: #14202c;
    color: #f4f4f4;
    font-size: 10px;
    font-weight: 500;
    transition: all 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.spinal-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #14202c15 !important;
}

.spinal-scrollbar::-webkit-scrollbar-thumb {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    background: #14202c !important;
}

.spinal-scrollbar::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
    -webkit-border-radius: 5px;
    border-radius: 5px;
}

/* .selectedTicket-class {
    -webkit-box-shadow: inset 0px 0px 0px 2px blue;
    -moz-box-shadow: inset 0px 0px 0px 2px blue;
    box-shadow: inset 0px 0px 0px 2px blue;
    box-sizing: border-box;
} */
/* General selected item border */
.selectedTicket-class {
    box-shadow: inset 1px 0px 0px 1px blue;
}

/* Remove top border when the previous item is also selected */
.selectedTicket-class+.selectedTicket-class {
    box-shadow: inset 1px -1px 0px 1px blue;
    /* Keeps only the bottom border */
}

/* Remove bottom border when the next item is also selected */
.selectedTicket-class:has(+ .selectedTicket-class) {
    box-shadow: inset 1px 1px 0px 1px blue;
    /* Keeps only the top border */
}

/* Ensure the last selected item in a sequence has a bottom border */
.selectedTicket-class:not(:has(+ .selectedTicket-class)) {
    box-shadow: inset 1px 1px 0px 1px blue, inset 0px -1px 0px 1px blue;
}

.selected-ticket-item {
    background-color: rgba(0, 0, 255, 0.1);
    /* Light blue with low opacity */
}


.triangle-outer {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    width: 12px;
    height: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
}

.triangle-inner {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    width: 7px;
    height: 7px;
    background-color: #fff;
    margin-top: 1px;
}
</style>
