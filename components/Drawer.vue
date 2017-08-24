<template>
    <div class="vuety-drawer">

        <div ref="drawer" :class="cssClass()" @mouseover="onMouseOver" @mouseleave="onMouseLeave">

            <div ref="content">

                <p>
                    <button @click="onClick">Peek: {{peek}}</button>
                </p>
                <slot/>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
    props: {


    }
})
export default class Drawer extends Vue {

    pVisible: boolean;
    peek: boolean = true;

     hideTimerHandle : any;

    // ATTENTION: Must not be a property!
    visible(): boolean {
        return this.pVisible;
    }

    setVisible(v: boolean) {
        this.pVisible = v;
        this.$forceUpdate();
    }

    // NOTE: This must not be a get property!
    cssClass(): string {

        let vis = this.visible() ? 'visible' : 'hidden';
        let peek = this.peek ? 'peek' : ''

        return vis + " " + peek;
    }



    onClick(evt: Event) {
        this.peek = !this.peek;
    }


    onMouseLeave(evt: Event) {

        let me = this;
        this.hideTimerHandle = window.setTimeout(function() {

            if (me.peek) {
                me.setVisible(false);
            }
        }, 1000);

    }

    onMouseOver(evt: Event) {
        window.clearInterval(this.hideTimerHandle);
        if (!this.visible()) {
            this.setVisible(true);
            
            this.peek = true;
        }
    }


    toggleShow() {
        this.setVisible(!this.visible());
        this.peek = false;
    }
}
</script>

<style lang="scss">
div.vuety-drawer {

    z-index: 999;
    >div {
        padding: 16px;
        
        background-color: #eee;
        flex-grow: 0;
        flex-shrink: 0;

        flex-basis: auto;

        height: 100%;
        width: 300px;
    }

    >div.peek {
        position: absolute;
    }

    >div.hidden {
        width: 8px;
        padding: 0;
        overflow: hidden;
    }

    >div.hidden>div {
        display: none;
    }
}
</style>