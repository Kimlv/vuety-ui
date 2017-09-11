<template>
    <div ref="rootDiv" class="vuety-supergrid-root" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
        <supergrid-node-view ref="nodeView" :data="data" />
        <div ref="mover" class="mover"></div>
    </div>
</template>

<script lang="ts" id="supergrid-root-view">

// TODO: 2 Convert insert mode to enum

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

import { SupergridNode } from './SupergridNode'
import { SupergridPanel } from './SupergridPanel'

import SupergridNodeView from './SupergridNodeView.vue'
import SupergridPanelView from './SupergridPanelView.vue'

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
    pDragPanel: SupergridPanelView | null = null;

    insertMode: string = "top";

    dragOffsetX: number = 0;
    dragOffsetY: number = 0;

    resize: boolean = false;
    resizeNode: SupergridNodeView | null = null;

    dropBorderWidth: number = 0.25;
    //################# END Misc properties ###################


    //################## BEGIN Computed Properties ###################

    get dragPanel(): SupergridPanelView | null {
        return this.pDragPanel;
    }

    set dragPanel(v: SupergridPanelView | null) {

        if (v != null) {
            this.resizeNode = null;
            this.resize = false;

            this.pDragPanel = v;
            this.pDragPanel.rootDiv.classList.add('dragged');

            //########## BEGIN Update mover style #############
            let div = this.pDragPanel.rootDiv;

            this.mover.style.display = 'block';
            this.mover.style.width = div.offsetWidth + 'px';
            this.mover.style.height = div.offsetHeight + 'px';
            this.mover.style.left = div.offsetLeft + 'px';
            this.mover.style.top = div.offsetTop + 'px';
            //########## END Update mover style #############
        }
        else {
            if (this.pDragPanel != null) {
                this.pDragPanel.rootDiv.classList.remove('dragged');
            }

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
            this.resize = true;
        }

        if (this.dragPanel != null && this.resizeNode == null) {

            let div = this.dragPanel.rootDiv;

            this.dragOffsetX = evt.clientX - div.offsetLeft;
            this.dragOffsetY = evt.clientY - div.offsetTop;
        }
    }

    onMouseMove(evt: MouseEvent) {

        //########################## BEGIN Resize panels #########################
        if (this.resize && this.resizeNode != null) {
            this.dragPanel = null;

            if (this.resizeNode.data.dir == "row") {
                this.resizeNode.data.divider = (evt.clientX - this.resizeNode.rootDiv.offsetLeft) / this.resizeNode.rootDiv.offsetWidth;
            }
            if (this.resizeNode.data.dir == "col") {
                this.resizeNode.data.divider = (evt.clientY - this.resizeNode.rootDiv.offsetTop) / this.resizeNode.rootDiv.offsetHeight;
            }

            return;
        }
        //########################## END Resize panels #########################

        // NOTE: These two are set by getPanelUnder(), so they must be resetted before it is called!
        this.resizeNode = null;
        this.rootDiv.style.cursor = "default";

        // ATTENTION: getPanelUnder() must be called HERE to show the resize cursor!!!
        let panelUnderMouse = <SupergridPanelView | null>this.nodeView.getPanelUnder(evt.clientX, evt.clientY);


        if (this.dragPanel == null) {
            return;
        }

        //############ BEGIN Update mover size and position ###############

        // NOTE: Updating mover width and height here is REQUIRED because it is changed by "snapping".
        this.mover.style.width = this.dragPanel.rootDiv.offsetWidth + 'px';
        this.mover.style.height = this.dragPanel.rootDiv.offsetHeight + 'px';

        this.mover.style.left = (evt.clientX - this.dragOffsetX) + 'px';
        this.mover.style.top = (evt.clientY - this.dragOffsetY) + 'px';
        //############ END Update mover size and position ###############


        //########### BEGIN If we are at a valid drop location, highlight new sibling and update mover ############

        this.insertMode = '';

        if (panelUnderMouse == null || panelUnderMouse == this.dragPanel) {
            return;
        }

        let div = panelUnderMouse.rootDiv;

        let blax = div.offsetWidth * this.dropBorderWidth;
        let blay = div.offsetHeight * this.dropBorderWidth;


        // TODO: 2 Take offset of root Node into account!!
        if (evt.clientX < div.offsetLeft + blax) {

            this.mover.style.left = div.offsetLeft + 'px';
            this.mover.style.top = div.offsetTop + 'px';
            this.mover.style.width = div.offsetWidth / 2 + 'px';
            this.mover.style.height = div.offsetHeight + 'px';

            this.insertMode = "left";
        }

        else if (evt.clientX > div.offsetLeft + div.offsetWidth - blax) {

            this.mover.style.left = (div.offsetLeft + div.offsetWidth / 2) + 'px';
            this.mover.style.top = div.offsetTop + 'px';
            this.mover.style.width = div.offsetWidth / 2 + 'px';
            this.mover.style.height = div.offsetHeight + 'px';

            this.insertMode = "right";
        }

        else if (evt.clientY < div.offsetTop + blay) {
            this.mover.style.left = (div.offsetLeft) + 'px';
            this.mover.style.top = div.offsetTop + 'px';
            this.mover.style.width = div.offsetWidth + 'px';
            this.mover.style.height = div.offsetHeight / 2 + 'px';

            this.insertMode = "top";
        }

        else if (evt.clientY > div.offsetTop + div.offsetHeight - blay) {
            this.mover.style.left = (div.offsetLeft) + 'px';
            this.mover.style.top = div.offsetTop + div.offsetHeight / 2 + 'px';
            this.mover.style.width = div.offsetWidth + 'px';
            this.mover.style.height = div.offsetHeight / 2 + 'px';

            this.insertMode = "bottom";
        }
        else {
            this.mover.style.left = (div.offsetLeft) + 'px';
            this.mover.style.top = div.offsetTop + 'px';
            this.mover.style.width = div.offsetWidth + 'px';
            this.mover.style.height = div.offsetHeight + 'px';

            this.insertMode = "center";
        }
        //########### END If we are at a valid drop location, highlight new sibling and update mover ############
    }

    onMouseUp(evt: MouseEvent) {

        this.resize = false;


        //########################### BEGIN Drop drag panel #############################

        //#################### BEGIN Validate the drag & drop action #######################
        if (this.dragPanel == null) {
            return;
        }

        let dragPanel = (<SupergridPanelView>this.dragPanel).data;

        this.dragPanel = null;

        if (['bottom', 'center', 'left', 'right', 'top'].indexOf(this.insertMode) < 0) {
            console.log("Invalid insert mode!");
            return;
        }

        let dropTarget = this.nodeView.getPanelUnder(evt.clientX, evt.clientY);

        if (dropTarget == null) {
            console.log("No panel!");
            return;
        }

        let newSibling = dropTarget.data;

        if (newSibling == dragPanel) {
            console.log("Drop on self!");
            return;
        }
        //#################### END Validate the drag & drop action #######################


        let grandparent = newSibling.parent;

        //########### BEGIN If newSibling is the root element, add a new root to the hierarchy ###########
        if (grandparent == null) {

            grandparent = this.data.root;
            grandparent.divider = 0.5;

            newSibling = new SupergridNode();

            newSibling.dir = grandparent.dir;

            newSibling.children = grandparent.children;
            // ATTENTION: The order of children array assignments matters here!
            // FIRST assign grandparent's children to newSibling, THEN
            // overwrite grandparent's children: 
            grandparent.children = [newSibling];
        }
        //########### END If newSibling is the root element, add a new root to the hierarchy ###########

        if (this.insertMode == 'center') {

        }
        else {
        
            let newParent = new SupergridNode();

            let si = grandparent.children.indexOf(newSibling);
            grandparent.children[si] = newParent;

            newParent.addChild(newSibling);

            switch (this.insertMode) {

                case 'bottom':
                    newParent.dir = 'col';
                    newParent.addChild(dragPanel, false);
                    break;

                case 'left':
                    newParent.dir = 'row';
                    newParent.addChild(dragPanel, true);
                    break;

                case 'right':
                    newParent.dir = 'row';
                    newParent.addChild(dragPanel, false);
                    break;

                case 'top':
                    newParent.dir = 'col';
                    newParent.addChild(dragPanel, true);
                    break;
            }
        }

        this.data.cleanup();

        // This is important!:
        dropTarget.$parent.$forceUpdate();

        //########################### END Drop drag panel #############################
    }
}
</script>

<style lang="scss">
div.vuety-supergrid-root {
    align-items: stretch;
    display: flex;
    flex: 1;

    div.mover {
        background-color: rgba(255, 255, 0, 0.5);
        display: none;
        position: fixed;
        cursor: move;
    }
}
</style>