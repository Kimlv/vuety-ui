<template>
    <div ref="rootDiv" :class="'vuety-supergrid-node ' + data.dir">

        <!--#################### BEGIN Stacked (tabs) view #########################-->

        <!-- NOTE: Whenever a node has panel children, the node will be displayed as tabbed child panels. -->
        <div class="tabs" v-if="data.childPanels.length > 0">

            <ul role="tablist">
                <li v-for="(panel, index) in data.childPanels" :class="getPanelCssClass(panel)" @mousedown="onTabMouseDown($event, panel)">

                    <h1 :style="getTabInlineStyle(panel)">{{panel.title}} <span v-if="panel.isCloseable" class="close" @click="onTabCloseClick($event, panel)"></span></h1>

                    
                </li>
            </ul>

            <!-- Here go the tabs: -->
            <template v-for="(panel, index) of data.childPanels">
                <component :is="panel.componentName" v-bind="panel.componentProps" class="tab" :style="getPanelInlineStyle(panel)" />
            </template>
        </div>
        <!--#################### END Stacked (tabs) view #########################-->

        <!--#################### BEGIN subdivision view #########################-->
        <!-- ATTENTION: The 'v-for' must really be in the template! -->
        <template v-else v-for="(child, index) of data.children">
            <component :is="getComponentClass(child)" :data="child" :style="getNodeInlineStyle(index)" />
        </template>
        <!--#################### END subdivision view #########################-->

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


    getPanelCssClass(panel: SupergridPanel) {
        if (panel == this.data.activeTab) {
            return "active";
        }

        return "";
    }

    getPanelUnder(x: number, y: number): SupergridNodeView | null {

        //#################### BEGIN Update active resize node #######################
        // Horizontal:

        if (this.data.childNodes.length > 1) {
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
        }
        //#################### END Update active resize node #######################

        //######################## BEGIN Allow attach to outer borders on root level ###################


        // NOTE: Enabling this for child nodes works, but is confusing to the user due to misleading visualization.
        if (this.$parent == this.root) {

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
        }

        //######################## END Allow attach to outer borders on root level ###################

        if (this.data.childPanels.length > 0) {
            return this;
        }

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

            }
        }
        //################### END Recursive search for panel under mouse ###################

        return null;
    }


    getNodeInlineStyle(index: number) {

        let size = (index == 0) ? this.data.divider * 100 : (1 - this.data.divider) * 100;

        if (this.data.children.length == 1) {
            size = 100;
        }

        let dir1 = this.data.dir == "col" ? "height" : "width";
        let dir2 = this.data.dir == "col" ? "width" : "height";

        return dir1 + ": " + size + "%;" + dir2 + ": 100%";
    }


    getPanelInlineStyle(panel: SupergridPanel): string {

        if (this.data.activeTab == panel) {
            return "display:block;";
        }
        return "display:none";
    }


    getTabInlineStyle(panel: SupergridPanel): string {

        let result = "";

        if (typeof panel.iconUrl != "undefined") {
            result += "background-image:url('" + panel.iconUrl + "');";
            result += "padding-left:1.3em";
        }

        return result;
    }


    onTabCloseClick(evt: MouseEvent, panel: SupergridPanel) {
        evt.preventDefault();

        this.data.removeChild(panel);
    }


    onTabMouseDown(evt: MouseEvent, panel: SupergridPanel) {
        evt.preventDefault();

        this.data.activeTab = panel;
        this.root.setDragPanel(evt, panel);
    }
}
</script>

<style lang="scss">
div.vuety-supergrid-node {

    align-items: stretch;
    display: flex;
    flex: 1; // Important!
    flex-basis: auto; // Important!
    min-height: 0; // ATTENTION: 'min-height:0' is required for "overflow:auto/scroll" on child elements to work in Firefox!!!
    &.col {
        flex-direction: column;
    }

    &.row {
        flex-direction: row;
    }

    >div.tabs {
        border: 1px solid #bbb;

        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;

        >.tab {
            overflow: auto;
            background-color: #fff;
            z-index: 3;
        }

        >ul {
            background-color: #88f;
            list-style: none;
            margin: 0;
            padding: 0;

            >li {



                background-color: #efefef;
                
                border-radius: 5px 5px 0 0;

                display: inline-block;

                margin: 0px 2px 0px 0px;
                padding: 6px 8px;
                position: relative;
                top: 5px;
                z-index: 1;

                &.active {
                    background-color: #fff;
                    color: #44b;
                    cursor: move !important;
                    top: 0px;
                    padding-bottom: 11px;
                    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.7);
                    z-index: 2;
                }

                &:hover {
                    cursor: pointer;
                }

                .close {
                    background-image: url("/images/close.svg");
                    background-size: 90% 90%;
                    background-repeat: no-repeat;
                    background-position: bottom;
                    cursor: pointer;


                    width: 16px;
                    height: 16px;
                    display: inline-block;
                    margin-bottom: 0px;
                    margin-left: 2px;
                }

                >h1 {
                    background-size: 1em;
                    background-repeat: no-repeat;
                    background-position: left center;
                    font-size: 1.1em;
                    font-weight:normal;                    
                    margin: 0;
                    padding: 0;
                }
            }
        }
    }
}
</style>