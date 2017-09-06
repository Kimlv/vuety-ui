<template>
    <div ref="rootDiv" :class="'vuety-supergrid-node ' + data.dir" @click="onClick" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">

        <template v-if="data.children.length > 0" v-for="child of data.children">
            <SupergridNodeView :data="child" :depth="depth + 1" />

        </template>
        <template v-if="data.children.length == 0">
            {{data.title}} {{depth}}
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

    onClick(evt: MouseEvent) {
        evt.stopPropagation();

        /*
                console.log("la");
        
                var index = this.data.parent.children.indexOf(this.data);
        
        
                if (index > -1) {
                    this.data.parent.children.splice(index, 1);
                }
        */
    }


    onMouseDown(evt: MouseEvent) {
        evt.stopPropagation();

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

            if (panel != null) {
                let div = panel.rootDiv;
                div.style.border = "4px dashed #88f";


                let bla = 32;

                // TODO: 2 Take offset of root Node into account!!
                if (evt.clientX < div.offsetLeft + bla) {
                    //div.style.backgroundColor = '#ccc';

                    this.mover.style.left = div.offsetLeft + 'px';
                    this.mover.style.top = div.offsetTop + 'px';
                    this.mover.style.width = div.offsetWidth / 2 + 'px';
                    this.mover.style.height = div.offsetHeight + 'px';

                    this.insertMode = "left";
                }

                else if (evt.clientX > div.offsetLeft + div.offsetWidth - bla) {
                    //div.style.backgroundColor = '#ccc';

                    this.mover.style.left = (div.offsetLeft + div.offsetWidth / 2) + 'px';
                    this.mover.style.top = div.offsetTop + 'px';
                    this.mover.style.width = div.offsetWidth / 2 + 'px';
                    this.mover.style.height = div.offsetHeight + 'px';

                    this.insertMode = "right";
                }


                else if (evt.clientY < div.offsetTop + bla) {
                    this.mover.style.left = (div.offsetLeft) + 'px';
                    this.mover.style.top = div.offsetTop + 'px';
                    this.mover.style.width = div.offsetWidth + 'px';
                    this.mover.style.height = div.offsetHeight / 2 + 'px';

                    this.insertMode = "top";
                }

                else if (evt.clientY > div.offsetTop + div.offsetHeight - bla) {
                    this.mover.style.left = (div.offsetLeft) + 'px';
                    this.mover.style.top = div.offsetTop + div.offsetHeight / 2 + 'px';
                    this.mover.style.width = div.offsetWidth + 'px';
                    this.mover.style.height = div.offsetHeight / 2 + 'px';

                    this.insertMode = "bottom";
                }

            }

        }
    }

    onMouseUp(evt: MouseEvent) {
        this.drag = false;
        this.mover.style.display = 'none';

        if (this.dragNode != null) {

            let newSibling = this.getPanel(evt.clientX, evt.clientY);

            if (newSibling != null) {

                let oldParent = this.dragNode.data.parent;
                let newParent = <SupergridNodeView | null>newSibling.$parent;

                

                if (oldParent != newParent) {
                    if (oldParent != null && newParent != null) {
                        oldParent.removeChild(this.dragNode.data);





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

                    }
                }
            }

            this.dragNode = null;
            this.resetStyle();
        }



    }


    resetStyle() {

        for (let child of this.$children) {

            let ac = <any>child;

            if (ac instanceof SupergridNodeView) {
                ac.rootDiv.style.border = '1px solid #000';
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
    background-color: #fff;
    align-items: stretch;
    display: flex;
    border: 1px solid #000;
    flex-grow: 1;

    width: 100%;
    height: 100%;

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
    }
}
</style>