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

@Component({
    components: {
        'supergrid-node-view': SupergridNodeView,
    }
})
export default class SupergridRootView extends Vue {

    //######### BEGIN Props ##########
    @Prop()
    data: SupergridNode;
    //######### END Props ##########


    dragPanel: SupergridPanelView | null;

    insertMode: string = "top";

    dragOffsetX: number = 0;
    dragOffsetY: number = 0;

    resize: boolean = false;
    resizeNode: SupergridNodeView | null = null;


    //################## BEGIN Computed Properties ###################
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

            let mover = <HTMLDivElement>this.$refs.mover;

            let div = this.dragPanel.rootDiv;

            mover.style.width = div.offsetWidth + 'px';
            mover.style.height = div.offsetHeight + 'px';

            mover.style.left = div.offsetLeft + 'px';
            mover.style.top = div.offsetTop + 'px';

            mover.style.display = 'block';

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

        //############### BEGIN Update drag panel style ###################
        this.dragPanel.rootDiv.style.border = '4px solid #f00';
        //############### END Update drag panel style ###################


        //############ BEGIN Update mover size and position ###############
        this.mover.style.width = this.dragPanel.rootDiv.offsetWidth + 'px';
        this.mover.style.height = this.dragPanel.rootDiv.offsetHeight + 'px';

        this.mover.style.left = (evt.clientX - this.dragOffsetX) + 'px';
        this.mover.style.top = (evt.clientY - this.dragOffsetY) + 'px';
        //############ END Update mover size and position ###############


        //########### BEGIN If we are at a valid drop location, highlight new sibling and update mover ############

        if (panelUnderMouse == null || panelUnderMouse == this.dragPanel) {
            return;
        }

        let div = panelUnderMouse.rootDiv;

        let blax = div.offsetWidth * 0.3;
        let blay = div.offsetHeight * 0.3;

        this.insertMode = '';

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
        //########### END If we are at a valid drop location, highlight new sibling and update mover ############
    }


    onMouseUp(evt: MouseEvent) {

        this.resize = false;

        this.mover.style.display = 'none';


        if (this.dragPanel == null) {
            return;
        }

        // TODO: 3 Don't hard-code styles here
        this.dragPanel.rootDiv.style.border = "1px solid #000";

        let foo = this.nodeView.getPanelUnder(evt.clientX, evt.clientY);

        if (foo == null) {
            console.log("No panel!");
            return;
        }

        let newSibling = foo.data;

        if (newSibling == this.dragPanel.data) {
            //console.log("Drop on self!");
            this.dragPanel = null;
            return;
        }


        let grandparent = newSibling.parent;
        

        //########### BEGIN If newSibling is the root element, add a new root to the hierarchy ###########
        if (grandparent == null) {

            grandparent = this.data.root;

            newSibling = new SupergridNode();

            newSibling.children = grandparent.children;
            newSibling.dir = grandparent.dir;
            newSibling.divider = grandparent.divider;

            for (let child of newSibling.children) {
                child.parent = newSibling;
            }

            grandparent.children = [newSibling];
            grandparent.divider = 0.5;
        }
        //########### END If newSibling is the root element, add a new root to the hierarchy ###########

        let si = grandparent.children.indexOf(newSibling);


        if (si < 0) {
            this.dragPanel = null;
            return;
        }

        let newParent = new SupergridNode();

        let dp = (<SupergridPanelView>this.dragPanel).data;

        switch (this.insertMode) {
            case 'top':
                grandparent.children[si] = newParent;
                newParent.dir = 'col';
                newParent.addChild(dp, false);
                newParent.addChild(newSibling);
                break;

            case 'bottom':
                grandparent.children[si] = newParent;
                newParent.dir = 'col';
                newParent.addChild(newSibling);
                newParent.addChild(dp, false);
                break;

            case 'left':
                grandparent.children[si] = newParent;
                newParent.dir = 'row';
                newParent.addChild(dp);
                newParent.addChild(newSibling);
                break;

            case 'right':
                grandparent.children[si] = newParent;
                newParent.dir = 'row';
                newParent.addChild(newSibling);
                newParent.addChild(dp);
                break;
        }

        this.data.cleanup();

        // This is important!:
        foo.$parent.$forceUpdate();

        this.dragPanel = null;
    }
}
</script>

<style lang="scss">
div.vuety-supergrid-root {
    //  border: 1px dashed #00f; //  background-color: #fff !important;
    align-items: stretch;
    display: flex;


    &.col {
        flex-direction: column;
    }

    &.row {
        flex-direction: row;
    }

    div.mover {
        // border: 1px solid #aaa;
        background-color: rgba(255, 255, 0, 0.5);
        display: none;
        position: fixed;
        cursor: move;
    }
}
</style>