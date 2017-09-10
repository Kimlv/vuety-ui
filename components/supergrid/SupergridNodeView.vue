<template>
    <div ref="rootDiv" :class="'vuety-supergrid-node ' + data.dir">
        <template v-for="(child, index) of data.children">
            <compontent :is="getComponentClass(child)" :data="child" :style="inlineStyle(index)" />
        </template>
    </div>
</template>

<script lang="ts" id="supergrid-node-view">

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

import { SupergridNode } from './SupergridNode'
import { SupergridPanel } from './SupergridPanel'

import SupergridRootView from './SupergridRootView.vue'
import SupergridPanelView from './SupergridPanelView.vue'

@Component({

    components: {
        'supergrid-panel-view': SupergridPanelView
    },

    name: 'supergrid-node-view'
})
export default class SupergridNodeView extends Vue {
    
    //######### BEGIN Props ##########
    @Prop()
    data: SupergridNode;
    //######### END Props ##########

    resizeHandleWidth: number = 5;


    //################## BEGIN Computed Properties ###################
    get root(): SupergridRootView {
        let result: SupergridNodeView = this;

        while (result.$parent instanceof SupergridNodeView) {
            result = <SupergridNodeView>result.$parent;
        }

        return <SupergridRootView>result.$parent;
    }


    get rootDiv(): HTMLDivElement {
        return <HTMLDivElement>this.$refs.rootDiv;
    }
    //################## END Computed Properties ###################


    getComponentClass(child: any): string {

        if (child instanceof SupergridNode) {
            return "supergrid-node-view";
        }

        if (child instanceof SupergridPanel) {
            return "supergrid-panel-view";
        }

        return "";
    }

    getPanelUnder(x: number, y: number): SupergridNodeView | SupergridPanelView | null {

        //#################### BEGIN Update active resize node #######################
        // Horizontal:
        let foo = (x - (this.rootDiv.offsetLeft + this.rootDiv.offsetWidth * this.data.divider));


        if (Math.abs(foo) < this.resizeHandleWidth && this.data.dir == "row") {
            this.root.resizeNode = this;
            this.root.rootDiv.style.cursor = "ew-resize";
        }

        // Vertical:
        let foo2 = (y - (this.rootDiv.offsetTop + this.rootDiv.offsetHeight * this.data.divider));

        if (Math.abs(foo2) < this.resizeHandleWidth && this.data.dir == "col") {
            this.root.resizeNode = this;
            this.root.rootDiv.style.cursor = "ns-resize";
        }
        //#################### END Update active resize node #######################

        //######################## BEGIN Allow attach to outer borders on root level ###################

        // TODO: 2 Move this to SupergridRootView
        let myDiv = this.rootDiv;
        let border = 20;

        if ((x > myDiv.offsetLeft && x < myDiv.offsetLeft + border) ||
            (x > myDiv.offsetLeft + myDiv.offsetWidth - border && x < myDiv.offsetLeft + myDiv.offsetWidth)

            ||

            (y > myDiv.offsetTop && y < myDiv.offsetTop + border) ||
            (y > myDiv.offsetTop + myDiv.offsetHeight - border && y < myDiv.offsetTop + myDiv.offsetHeight)

        ) {
            return this;
        }
        //######################## END Allow attach to outer borders on root level ###################


        //################### BEGIN Recursive search for panel under mouse ###################
        for (let child of this.$children) {

            let ac = <SupergridNodeView | SupergridPanelView>child;

            let div = ac.rootDiv;

            // ATTENTION: This only works because the x/y coordinates that are initially passed to the
            // first recursion step of getPanelUnder() are already relative to the DIV that is eventually
            // found (i.e. the one that is under the mouse!)
            if (x > div.offsetLeft && x < div.offsetLeft + div.offsetWidth &&
                y > div.offsetTop && y < div.offsetTop + div.offsetHeight) {

                if (ac instanceof SupergridNodeView) {

                    let bla = ac.getPanelUnder(x, y);

                    if (bla != null) {
                        return bla;
                    }
                }
                else if (ac instanceof SupergridPanelView) {
                    return ac;
                }
            }
        }
        //################### END Recursive search for panel under mouse ###################

        return null;
    }


    inlineStyle(index: number) {

        let size = (index == 0) ? this.data.divider * 100 : (1 - this.data.divider) * 100;

        if (this.data.children.length == 1) {
            size = 100;
        }

        let dir1 = this.data.dir == "col" ? "height" : "width";
        let dir2 = this.data.dir == "col" ? "width" : "height";

        return dir1 + ": " + size + "%;" + dir2 + ": 100%";
    }
}
</script>

<style lang="scss">
div.vuety-supergrid-node {

    align-items: stretch;
    display: flex; 
    flex:1;
    flex-basis:auto; // Important!
    

    &.col {
        flex-direction: column;
    }

    &.row {
        flex-direction: row;
    }
}
</style>