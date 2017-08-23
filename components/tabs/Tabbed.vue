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
</style>

