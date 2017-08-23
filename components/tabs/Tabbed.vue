<template>
    <div class="vuety-tabbed">

        <ul role="tablist">
            <li :class="tab.active ? 'active' : ''" v-for="(tab, index) in tabs" @click="onTabClick(tab)">
                {{tab.title}}
            </li>
        </ul>

        <!-- Here go the tabs: -->
        <slot/>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import uuidv4 from 'uuid/v4';
import Tab from './Tab.vue';

@Component({
    props: {
        'name': String
    }


})
export default class Tabbed extends Vue {


    tabs: Array<Tab> = [];

    mounted() {

        for (let tab of this.$children) {
            this.tabs.push(<Tab>tab);
        }

        this.tabs[0].active = true;
    }

    onTabClick(tab: Tab) {

        for (let t of this.tabs) {
            t.active = false;
        }

        tab.active = true;


    }

}
</script>

<style lang="scss">
$background: #f0f0f0;
$tabs-base-color: #eee;

$line: #88f;

div.vuety-tabbed {

    
    >ul {
        list-style: none;

        margin: 0;
        padding: 0;
        >li {


            border-radius: 6px 6px 0 0;
            display: inline-block;
            cursor: pointer;
            padding: 10px 16px;
            position: relative;
            font-size: 1.2em;

            top: 8px;
        }

        >li:hover {
            background-color: darken($background, 5);
        }

        >li.active {
            background-color: $background;

            top: 0px;
            padding-bottom: 16px;
        }
    }

    >div {
        background-color: $background;

        padding: 20px;
    }
}





/*
div.vuety-tabbed {
    border: 1px solid #000;

    position: relative;

    >ul {
        margin: 0;
        padding: 0;

        >li {
            float: left;
            display: block;

            >input[type="radio"] {
                display: none;
            }

            >input:checked+label {

                top: 10px;
                padding-bottom: 18px;
                background: darken($tabs-base-color, 15);
            }

            >input:checked~[class^="tab-content"] {
                display: block;
            }

            // This is the 'tab-content' div: 
            >div {
                z-index: 2;
                display: none;
                overflow: auto;
                width: 100%;

                position: absolute;


                top: 53px;
                left: 0;
                background: darken($tabs-base-color, 15);
            }


            >label {
                outline: none;
                display: block;
                padding: 8px 21px;
                border-radius: 4px 4px 0 0;



                background: $tabs-base-color;
                cursor: pointer;
                position: relative;
                top: 20px;

                &:hover {
                    background: darken($tabs-base-color, 10);
                }
            }
        }
    }
}
*/
</style>

