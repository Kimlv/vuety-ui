<template>
    <div ref="rootDiv" class="vuety-supergrid-panel">
        
        <h1 class="header" @mousedown="onMouseDown"> {{data.title}}
            <span v-if="data.isCloseable" class="closeButton" @mousedown="onCloseButtonClick">X</span>
        </h1>
                
        <div class="content">            
            <component :is="data.componentName" v-bind="data.componentProps" />   
        </div>        
    </div>
</template>

<script lang="ts">

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import { SupergridPanel } from './SupergridPanel'

import SupergridNodeView from './SupergridNodeView.vue'

@Component({})
export default class SupergridPanelView extends Vue {

    @Prop()
    data: SupergridPanel;

    get rootDiv(): HTMLDivElement {
        return <HTMLDivElement>this.$refs.rootDiv;
    }

    onCloseButtonClick(evt: MouseEvent) {

        evt.stopPropagation();
        evt.stopImmediatePropagation();

        this.data.parent.removeChild(this.data);
    }

    onMouseDown(evt: MouseEvent) {
        evt.preventDefault();
        (<SupergridNodeView>this.$parent).root.dragPanel = this.data;
    }
}
</script>

<style lang="scss">
div.vuety-supergrid-panel {

    border: 2px solid #aaa;
    display: flex;
    flex-direction: column;

    &.dragged {
        border: 4px solid #f00 !important;
    }


    >h1.header {

        color: #fff;
        margin: 0;
        padding: 6px;
        font-size: 1.1em;


        background-color: #88c; //    background-color: #666;
        &:hover {
            background-color: #aaf; //  background-color: #999;
            cursor: move;
        }


        span.closeButton {
            border-radius: 4px;
            background-color: #44a;
            font-size: 0.8em;

            padding: 1px 6px;
            display: block;
            float: right;
            cursor: default;

            &:hover {
                background-color: rgba(255, 255, 255, 0.5);
            }
        }
    }

    >div.content {
        flex: 1;

        overflow: auto;
    }
}
</style>