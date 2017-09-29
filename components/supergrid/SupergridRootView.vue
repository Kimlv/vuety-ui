<template>
    <div ref="rootDiv" class="vuety-supergrid-root" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
        <supergrid-node-view ref="nodeView" :data="data" />
        <div ref="mover" class="mover"></div>
    </div>
</template>

<script lang="ts" id="supergrid-root-view">

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import { SupergridNode } from './SupergridNode'
import { SupergridPanel } from './SupergridPanel'
import SupergridNodeView from './SupergridNodeView.vue'
import SupergridPanelView from './SupergridPanelView.vue'

export enum InsertMode {
    bottom,center,left,right,top
}

@Component({
    components: {
        'supergrid-node-view': SupergridNodeView
    }
})
export default class SupergridRootView extends Vue {

    //######### BEGIN Props ##########
    @Prop()
    data: SupergridNode;
    //######### END Props ##########

    //################# BEGIN Misc properties ###################

    // NOTE: pDragPanel must be initialized!!
    pDragPanel: SupergridPanel | null = null;

    insertMode: InsertMode = InsertMode.top;

    dragOffsetX: number = 0;
    dragOffsetY: number = 0;

    fooX: number = 0;
    fooY: number = 0;
    perhapsDragPanel: SupergridPanel | null = null;

    resize: boolean = false;
    resizeNode: SupergridNodeView | null = null;

    dropBorderWidth: number = 0.25;
    panelDragDistTolerance: number = 20;
    //################# END Misc properties ###################


    //################## BEGIN Computed Properties ###################

    get dragPanel(): SupergridPanel | null {
        return this.pDragPanel;
    }

    set dragPanel(v: SupergridPanel | null) {

        if (v != null) {

            this.resizeNode = null;
            this.resize = false;

            this.pDragPanel = v;

            this.mover.style.display = 'block';           
        }
        else {

            this.pDragPanel = v;
            this.mover.style.display = 'none';
        }
    }


    get mover(): HTMLDivElement {
        return <HTMLDivElement>this.$refs.mover;
    }

    get nodeView(): SupergridNodeView {
        return <SupergridNodeView>this.$refs.nodeView;
    }

    get rootDiv(): HTMLDivElement {
        return <HTMLDivElement>this.$refs.rootDiv;
    }
    //################## END Computed Properties ###################

    onMouseDown(evt: MouseEvent) {

        if (this.resizeNode != null) {
            evt.preventDefault();
            this.resize = true;
        }
    }

    onMouseMove(evt: MouseEvent) {

        //################ BEGIN Tab @mousedown prevent drag start tolerance ##############
        let a = Math.abs(this.fooX - evt.offsetX);
        let b = Math.abs(this.fooY - evt.offsetY);

        if (Math.sqrt(a * a + b * b) > this.panelDragDistTolerance && this.perhapsDragPanel != null) {
            console.log("Start drag");
            this.dragPanel = this.perhapsDragPanel;
            this.perhapsDragPanel = null;
        }
        //################ END Tab @mousedown prevent drag start tolerance ##############

        //########################## BEGIN Resize panels #########################
        if (this.resize && this.resizeNode != null) {
            this.dragPanel = null;

            if (this.resizeNode.data.dir == "row") {
                this.resizeNode.data.divider = (evt.clientX - this.resizeNode.rootDiv.offsetLeft) / this.resizeNode.rootDiv.offsetWidth;
            }
            if (this.resizeNode.data.dir == "col") {
                this.resizeNode.data.divider = (evt.clientY - this.resizeNode.rootDiv.offsetTop) / this.resizeNode.rootDiv.offsetHeight;
            }

            this.resizeNode.$forceUpdate();

            return;
        }
        //########################## END Resize panels #########################

        // NOTE: These two are set by getPanelUnder(), so they must be resetted before it is called!
        this.resizeNode = null;
        this.rootDiv.style.cursor = "default";

        // ATTENTION: getPanelUnder() must be called HERE to show the resize cursor!!!
        let panelUnderMouse = <SupergridNodeView | null>this.nodeView.getPanelUnder(evt.clientX, evt.clientY);

        if (this.dragPanel == null || panelUnderMouse == null) {
            return;
        }
        
        //########### BEGIN If we are at a valid drop location, highlight drop location ############
        
        let div = panelUnderMouse.rootDiv;

        let blax = div.offsetWidth * this.dropBorderWidth;
        let blay = div.offsetHeight * this.dropBorderWidth;


        // TODO: 2 Take offset of root Node into account!!
        if (evt.clientX < div.offsetLeft + blax) {

            this.mover.style.left = div.offsetLeft + 'px';
            this.mover.style.top = div.offsetTop + 'px';
            this.mover.style.width = div.offsetWidth / 2 + 'px';
            this.mover.style.height = div.offsetHeight + 'px';

            this.insertMode = InsertMode.left;
        }

        else if (evt.clientX > div.offsetLeft + div.offsetWidth - blax) {

            this.mover.style.left = (div.offsetLeft + div.offsetWidth / 2) + 'px';
            this.mover.style.top = div.offsetTop + 'px';
            this.mover.style.width = div.offsetWidth / 2 + 'px';
            this.mover.style.height = div.offsetHeight + 'px';

            this.insertMode = InsertMode.right;
        }

        else if (evt.clientY < div.offsetTop + blay) {
            this.mover.style.left = (div.offsetLeft) + 'px';
            this.mover.style.top = div.offsetTop + 'px';
            this.mover.style.width = div.offsetWidth + 'px';
            this.mover.style.height = div.offsetHeight / 2 + 'px';

            this.insertMode = InsertMode.top;
        }

        else if (evt.clientY > div.offsetTop + div.offsetHeight - blay) {
            this.mover.style.left = (div.offsetLeft) + 'px';
            this.mover.style.top = div.offsetTop + div.offsetHeight / 2 + 'px';
            this.mover.style.width = div.offsetWidth + 'px';
            this.mover.style.height = div.offsetHeight / 2 + 'px';

            this.insertMode = InsertMode.bottom;
        }
        else {
            this.mover.style.left = (div.offsetLeft) + 'px';
            this.mover.style.top = div.offsetTop + 'px';
            this.mover.style.width = div.offsetWidth + 'px';
            this.mover.style.height = div.offsetHeight + 'px';

            this.insertMode = InsertMode.center;
        }
        //########### END If we are at a valid drop location, highlight drop location ############
    }


    onMouseUp(evt: MouseEvent) {

        this.resize = false;
        this.perhapsDragPanel = null;

        //########################### BEGIN Drop drag panel #############################
        if (this.dragPanel == null) {
            return;
        }

        let dragPanel = this.dragPanel;
        this.dragPanel = null;

        let dropNodeView: SupergridNodeView | null = this.nodeView.getPanelUnder(evt.clientX, evt.clientY);

        if (dropNodeView == null) {
            // No drop node!            
            return;
        }

        let dropNode = dropNodeView.data;

        if (dropNode == dragPanel.parent && dropNode.children.length == 1) {
            // Drop on self!
            return;
        }


        if (this.insertMode == InsertMode.center) {
            dropNode.addChild(dragPanel);
            dropNode.activeTab = dragPanel;
        }
        else {

            if (dropNode.parent == null) {

                dropNode = new SupergridNode();
                dropNode.children = this.data.children;

                for (let child of dropNode.children) {
                    child.parent = dropNode;
                }

                this.data.children = [dropNode];
                dropNode.parent = this.data;
            }


            let grandparent = new SupergridNode();

            let si = dropNode.parent.children.indexOf(dropNode);
            dropNode.parent.children[si] = grandparent;
            grandparent.parent = dropNode.parent;

            grandparent.addChild(dropNode);
            dropNode.parent = grandparent;

            let newParent = new SupergridNode();

            // TODO: 1 Understand why we need this to avoid layout bugs
            newParent.addChild(dragPanel);
            newParent.parent = grandparent;


            switch (this.insertMode) {

                case InsertMode.bottom:
                    grandparent.dir = 'col';
                    grandparent.addChild(newParent, false);
                    break;

                case InsertMode.left:
                    grandparent.dir = 'row';
                    grandparent.addChild(newParent, true);
                    break;

                case InsertMode.right:
                    grandparent.dir = 'row';
                    grandparent.addChild(newParent, false);
                    break;

                case InsertMode.top:
                    grandparent.dir = 'col';
                    grandparent.addChild(newParent, true);
                    break;
            }
        }

        this.data.cleanup();

        // Important!
        dropNodeView.$parent.$forceUpdate();
        //########################### END Drop drag panel #############################
    }

    setDragPanel(evt: MouseEvent, panel: SupergridPanel | null) {
        this.dragPanel = null;
        this.fooX = evt.offsetX;
        this.fooY = evt.offsetY;
        this.perhapsDragPanel = panel;
    }
}
</script>

<style lang="scss">
div.vuety-supergrid-root {
    align-items: stretch;
    display: flex;
    flex: 1;
    height: 100%;

    div.mover {
        background-color: rgba(255, 255, 0, 0.5);
        display: none;
        position: fixed;
        cursor: move;
        z-index: 999;
    }
}
</style>