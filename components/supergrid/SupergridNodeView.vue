<template>
    <div ref="rootDiv" :class="'vuety-supergrid-node ' + data.dir + ' ' + cssNodeClass" :style="inlineStyle" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">

        <template v-if="data.children.length > 0" v-for="child of data.children">
            <SupergridNodeView :data="child" :depth="depth + 1" />

        </template>
        <template v-if="data.children.length == 0">
            <div class="panel">
                <!--<button class="close" @click="onCloseClick">X</button> -->

                {{data.title}} {{depth}}
            </div>
        </template>

        <div class="mover" ref="mover"></div>
    </div>
</template>

<script lang="ts">

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import { SupergridNode } from './SupergridNode'

@Component({})
export default class SupergridNodeView extends Vue {


    @Prop()
    data: SupergridNode;

    @Prop()
    depth: number;




    get cssNodeClass(): string {

        if (this.drag) return "on-drag";
        return "";
    }


    get inlineStyle(): string {
        return "background-color: " + this.data.bgColor;
    }

    dragNode: SupergridNodeView | null;

    drag: boolean = false;

    insertMode: string = "top";

    dragOffsetX: number = 0;
    dragOffsetY: number = 0;

    get mover(): HTMLDivElement {
        return <HTMLDivElement>this.$refs.mover;
    }

    get rootDiv(): HTMLDivElement {
        return <HTMLDivElement>this.$refs.rootDiv;
    }





    getPanel(x: number, y: number): SupergridNodeView | null {

        for (let child of this.$children) {

            let ac = <any>child;
            if (ac instanceof SupergridNodeView) {
                let div = ac.rootDiv;

                if (x > div.offsetLeft && x < div.offsetLeft + div.offsetWidth &&
                    y > div.offsetTop && y < div.offsetTop + div.offsetHeight) {

                    if (ac.$children.length > 0) {
                        return ac.getPanel(x, y);
                    }
                    else {
                        return ac;
                    }
                }
            }
        }

        return null;
    }

    getRoot(): SupergridNodeView {
        let result = <SupergridNodeView>this;

        while (result.$parent instanceof SupergridNodeView) {
            result = <SupergridNodeView>result.$parent;
        }

        return result;
    }



    onCloseClick(evt: Event) {
        console.log("close");

        let parent: SupergridNode = <SupergridNode>this.data.parent;
        parent.removeChild(this.data);


    }

    onMouseDown(evt: MouseEvent) {
        //  evt.stopPropagation();

        let root = this.getRoot();


        root.showMover(this, evt);
    }


    onMouseMove(evt: MouseEvent) {

        //console.log(evt.offsetX + " " + evt.offsetY);

        if (this.drag) {

            this.mover.style.left = (evt.clientX - this.dragOffsetX) + 'px';
            this.mover.style.top = (evt.clientY - this.dragOffsetY) + 'px';

            this.resetStyle();

            let panel = this.getPanel(evt.clientX, evt.clientY);

            if (panel != null && panel != this.dragNode) {
                let div = panel.rootDiv;
                //div.style.border = "4px dashed #88f";
                div.style.border = "4px dashed #fff";


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

                else {
                    if (this.dragNode != null) {
                        this.mover.style.width = this.dragNode.rootDiv.offsetWidth + 'px';
                        this.mover.style.height = this.dragNode.rootDiv.offsetHeight + 'px';
                    }
                }
            }
        }
    }

    onMouseUp(evt: MouseEvent) {
        this.drag = false;
        this.mover.style.display = 'none';

        if (this.dragNode == null) {
            return;
        }

        let oldParent: SupergridNode | null = this.dragNode.data.parent;

        let newSibling = this.getPanel(evt.clientX, evt.clientY);

        if (newSibling == null) {
            this.dragNode = null;
            return;
        }


        if (this.dragNode == newSibling) {
            //console.log("Drop on self!");
            this.dragNode = null;
            return;
        }


        if (newSibling.data.parent == null) {
            this.dragNode = null;
            return;
        }


        //################ BEGIN Figure out new parent ###############
        let newParent: SupergridNodeView | null = null;

        if (newSibling.data.parent == this.dragNode.data.parent) {
            newParent = <SupergridNodeView>this.dragNode.$parent;
        }
        else {
            // If new sibling already has other siblings, we need to subdivide:

            if (newSibling.data.parent.children.length > 1) {
                newSibling.data.addChild(newSibling.data.copy());
                newParent = newSibling;

            }
            else {
                newParent = <SupergridNodeView>newSibling.$parent;
            }
        }

        if (newParent == null) {
            this.dragNode = null;
            return;
        }
        //################ END Figure out new parent ###############


        //################ BEGIN Insert node at new location ##################
        // TODO: 2 Do this in the model!

        switch (this.insertMode) {
            case 'bottom':
                newParent.data.addChild(this.dragNode.data);
                newParent.data.dir = "col";
                break;

            case 'top':
                newParent.data.addChild(this.dragNode.data, true);
                newParent.data.dir = "col";
                break;

            case 'right':
                newParent.data.addChild(this.dragNode.data);
                newParent.data.dir = "row";
                break;

            case 'left':
                newParent.data.addChild(this.dragNode.data, true);
                newParent.data.dir = "row";
                break;
        }
        //################ END Insert node at new location ##################

/*
        // TODO: 2 Move this to model
        if (oldParent != null) {
            if (oldParent.children.length == 1) {
                oldParent.title = oldParent.children[0].title;
                oldParent.dir = oldParent.children[0].dir;
                oldParent.bgColor = oldParent.children[0].bgColor;


                oldParent.children = oldParent.children[0].children;

            }
        }
*/
        this.resetStyle();
    }


    resetStyle() {

        for (let child of this.$children) {

            let ac = <any>child;

            if (ac instanceof SupergridNodeView) {
                // TODO: 2 Don't hard-code this
                ac.rootDiv.style.border = 'none';
                ac.resetStyle();
            }
        }
    }


    showMover(panel: SupergridNodeView, evt: MouseEvent) {

        if (this.drag) return;

        this.dragNode = panel;



        let mover = <HTMLDivElement>this.$refs.mover;

        let div = panel.rootDiv;

        mover.style.width = div.offsetWidth + 'px';
        mover.style.height = div.offsetHeight + 'px';

        mover.style.left = div.offsetLeft + 'px';
        mover.style.top = div.offsetTop + 'px';

        mover.style.display = 'block';

        this.dragOffsetX = evt.clientX - div.offsetLeft;
        this.dragOffsetY = evt.clientY - div.offsetTop;


        this.drag = true;
    }
}
</script>

<style lang="scss">
div.vuety-supergrid-node {


  //  background-color: #fff !important;
    align-items: stretch;
    display: flex; // border: 1px solid #000;
    flex-grow: 1;

    width: 100%;
    height: 100%;

 -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */

    >div.panel {
        >button.close {
            background-color: none;
            border: none;
            z-index: 9999;

            padding: 8px;

            &:hover {
                background-color: #aaa;
            }
        }



        border: 1px solid #000;
        padding: 8px;
        font-size: 1.5em;
        width:100%;
        height:100%;
    }

    &.leaf {
        // background-color:#aaf;
    }

    &.col {
        flex-direction: column;
    }

    &.row {
        flex-direction: row;
    }



    div.mover {
        // border: 1px solid #aaa;
        //background-color: rgba(255, 255, 0, 0.5);
        background-color: rgba(255, 255, 255, 0.6);
        display: none;
        position: fixed;
    }
}
</style>