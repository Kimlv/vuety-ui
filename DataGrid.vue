<template>
    <div class="DataGrid">

        <div class="DataGrid-table-wrapper">
            <!-- NOTE: 'tablindex="1" is required to listen for key events on a table element' -->
            <table ref="table" @wheel="onWheel" @keydown="onKeyDown" tabindex="0">
                <!-- Print headers: -->

                <tr>
                    <th @click="setOrder(column.field)" v-for="(column, colIndex) in columns">{{column.title}}</th>
                </tr>

                <!-- ############################ BEGIN Print data rows ############################## -->
                <!-- ATTENTION: rowIndex starts at 1 !!! -->
                <tr v-for="rowIndex in numDisplayedRows" :class="rowIndex + scrollRow - 1 == pSelectedRow ? 'selected' : ''">
                    <td v-for="(column, colIndex) in columns" :class="(rowIndex + scrollRow - 1 == pSelectedRow) && (colIndex == pSelectedCol) ? 'selected' : ''">

                        <div v-if="rowIndex + scrollRow - 1 == pSelectedRow && colIndex == pSelectedCol && editMode" class="edit">
                            <input ref="editField" @blur="editMode = false" v-on:keyup.esc="editMode = false" v-model="editValue" type="text" size="4" />
                        </div>
                        <div v-else @click="onCellClicked(rowIndex + scrollRow - 1,colIndex)">
                            {{displayedContent[rowIndex + scrollRow - 1][column.field]}}
                        </div>
                    </td>
                </tr>
                <!-- ############################## END Print data rows ############################### -->
            </table>
        </div>
        <Scrollbar v-if="displayedContent.length > numDisplayedRows" @my-scroll="onMyScroll" ref="scrollbar" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Scrollbar from './Scrollbar.vue'

@Component({
    props: {
        columns: Array,
        content: Array

    },

    components: {
        Scrollbar
    }
})
export default class DataGrid extends Vue {

    //####### BEGIN Props ########
    content: Array<any>;
    columns: Array<any>;
    //####### END Props ########

    //########## BEGIN Properties (have get/set methods) ###########
    pEditMode: Boolean = false;
    pScrollRow: number = 0;
    pSelectedRow: number = -1;
    pSelectedCol: number = -1;
    //########## END Properties (have get/set methods) ###########

    //########## BEGIN Other members ###########
    editValue: any = null;
    orderBy: string;
    orderDesc: Boolean = true;
    //########## END Other members ###########


    get displayedContent() {

        // TODO: 3 Update displayedContent only when view parameters (e.g. sorting)
        // have changed.

        let sorted = [];

        for (let obj of this.content) {
            sorted.push(obj);
        }

        let key = this.orderBy;

        let result = sorted.sort(function (a, b) {
            // TODO: 1 Implement case-independent sort of strings

            let keyA = a[key];

            let keyB = b[key];

            if (typeof keyA === 'string' && typeof keyB === 'string') {
                keyA = keyA.toLowerCase();
                keyB = keyB.toLowerCase();
            }

            //return ((a[key] < b[key]) ? -1 : ((a[key] > b[key]) ? 1 : 0));

            return ((keyA < keyB) ? -1 : ((keyA > keyB) ? 1 : 0));

        });

        if (!this.orderDesc) {
            result.reverse();
        }

        return result;
    }

    get displayedFields() {
        let result = [];

        for (let column of this.columns) {
            result.push(column.field);
        }

        return result;
    }

    //################# BEGIN editMode property logic ###################
    get editMode() {
        return this.pEditMode;
    }

    set editMode(v: Boolean) {

        this.pEditMode = v;

        if (this.pEditMode) {
            this.editValue = this.displayedContent[this.selectedRow][this.columns[this.selectedCol].field];
        }

        // Keep focus on table:
        let table = <HTMLTableElement>this.$refs.table;
        table.focus();
    }
    //################# END editMode property logic ###################


    get numDisplayedRows(): number {
        return Math.min(this.displayedContent.length, 6);
    }


    //################# BEGIN scrollRow property logic ###################
    get scrollRow() {
        return this.pScrollRow;
    }

    set scrollRow(v) {

        this.pScrollRow = Math.min(Math.max(0, v), this.displayedContent.length - this.numDisplayedRows);

        if (this.displayedContent.length > this.numDisplayedRows) {
            let scrollbar = <Scrollbar>this.$refs.scrollbar;

            scrollbar.setScrollPos(this.pScrollRow / (this.displayedContent.length - this.numDisplayedRows));
        }
    }
    //################# END scrollRow property logic ###################


    //################# BEGIN selectedCol property logic ###################
    get selectedCol(): number {
        return this.pSelectedCol;
    }

    set selectedCol(v: number) {
        this.pSelectedCol = Math.min(Math.max(0, v), this.columns.length - 1);
    }
    //################# END selectedCol property logic ###################

    //################# BEGIN selectedRow property logic ###################
    get selectedRow(): number {
        return this.pSelectedRow;
    }


    set selectedRow(v: number) {

        // Limit to range of displayed content:
        this.pSelectedRow = Math.min(Math.max(0, v), this.displayedContent.length - 1);

        //################# BEGIN Scroll if neccessary ###################
        if (this.pSelectedRow < this.scrollRow) {
            this.scrollRow = this.pSelectedRow;
        }

        if (this.pSelectedRow >= this.scrollRow + this.numDisplayedRows) {
            this.scrollRow = this.pSelectedRow - this.numDisplayedRows + 1;
        }
        //################# END Scroll if neccessary ###################
    }
    //################# END selectedCol property logic ###################

    mounted() {
        // ATTENTION: This is required to get the correct table height on initial rendering:
        this.$forceUpdate();
    }

    onCellClicked(rowIndex: number, colIndex: number) {

        if (this.selectedRow != rowIndex || this.selectedCol != colIndex) {
            this.selectedRow = rowIndex;
            this.selectedCol = colIndex;
        }
        else {
            //this.editValue = this.displayedContent[this.selectedRow][this.columns[this.selectedCol].field];
            this.editMode = true;
        }
    }

    onMyScroll(evt: any) {
        this.scrollRow = Math.round(evt.pos * (this.displayedContent.length - this.numDisplayedRows));

    }

    onWheel(evt: any) {

        // Prevent scrolling of page when grid is scrolled:
        evt.preventDefault();

        if (evt.deltaY > 0) {
            this.scrollRow++;
        }
        else if (evt.deltaY < 0) {
            this.scrollRow--;
        }
    }

    onKeyDown(evt: any) {

        if (this.editMode) {
            switch (evt.key) {
                case "Enter":
                    this.displayedContent[this.selectedRow][this.columns[this.selectedCol].field] = this.editValue;
                    this.editMode = false;
                    break;
            }

            return;
        }
        else {

            // ATTENTION: Don't prevent default when in edit mode!
            evt.preventDefault();

            switch (evt.key) {
                case "Up":
                case "ArrowUp":
                    this.selectedRow--;
                    break;
                case "Down":
                case "ArrowDown":
                    this.selectedRow++;
                    break;
                case "Right":
                case "ArrowRight":
                    this.selectedCol++;
                    break;
                case "Left":
                case "ArrowLeft":
                    this.selectedCol--;
                    break;
                case "Enter":
                    this.editMode = true;
                    break;
            }
        }
    }

    setOrder(key: string) {
        this.orderBy = key;
        this.orderDesc = !this.orderDesc;

        this.selectedCol = -1;
        this.selectedRow = -1;
    }

    updated() {

        this.updateSizes();

        //########### BEGIN Focus clicked input field #############

        // NOTE: We need to do this here (and not immediately when editMode is enabled) 
        // because the input field only exists after the template was rendered again.
        let field = <HTMLInputElement>this.$refs.editField;

        if (field != null && field[0] != null) {
            field[0].focus();
        }
        //########### END Focus clicked input field #############
    }

    updateSizes() {

        //########## BEGIN Synchronize scrollbar height with table height ############
        let table = <HTMLTableElement>this.$refs.table;
        let th = table.offsetHeight;

        if (this.displayedContent.length > this.numDisplayedRows) {
            let scrollbar = <Scrollbar>this.$refs.scrollbar;
            scrollbar.setHeight(th + 'px');
        }
        //########## END Synchronize scrollbar height with table height ############
    }
}
</script>

<style lang="scss">
div.DataGrid {
    display: flex;

    /* 
    NOTE: The construct of wrapping the table in a <div> wrapper, giving the div wrapper 'flex:1'
    and the table 'width:100%' is required for collect calculation of the horizontal scrollbar position.
    */
    div.DataGrid-table-wrapper {
        flex: 1;

        table {
            border-collapse: collapse;
            width: 100%;

            /* ATTENTION: 'table-layout:fixed' is required for 'overflow-hiddden' on table cells! */
            table-layout: fixed;

            td,
            th {
                border: 1px solid #000;
                white-space: nowrap;
            }

            th {
                background-color: #88c;
                color: #fff;
                padding: 4px;
            }

            td,
            th,
            input[type=text] {
                font-size: 1em;
                font-family: sans-serif;
            }

            td {
                padding: 0;
                margin: 0;

                div {
                    padding: 4px;
                    overflow: hidden;
                    white-space: nowrap;
                }

                div.edit {

                    background-color: #bbf;
                    border: 2px solid #222;
                    padding: 2px;
                }


                input[type=text] {
                    background-color: transparent;

                    outline-width: 0;
                    margin: 0;
                    padding: 0;
                    border: none;
                    width: 100%;
                }
            }

            td.selected {
                background-color: #bbf;
            }

            tr.selected {
                background-color: #dd4;
            }
        }
    }
}
</style>

