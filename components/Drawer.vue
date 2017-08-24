<template>
    <div ref="drawer" :class="cssClass()" @mouseover="onMouseOver" @mouseleave="onMouseLeave">

        <div ref="content">

            <p>
                <button @click="onClick">Keep open: {{!peek}}</button>
            </p>
            <slot/>
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

    pVisible: boolean = false;
    peek: boolean = false;

    hideTimerHandle: any;

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

        return 'vuety-drawer ' + vis + " " + peek;
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

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;    

    padding: 16px;

    background-color: #ddd;
    height: 100%; // NOTE: For Internet Explorer, z-index must be defined here, not in the parent DIV!
    z-index: 99;
}

div.vuety-drawer.peek {
    position: absolute;
}

div.vuety-drawer.hidden {
    width: 8px !important;
    padding: 0;    
    * {
        display: none;
    }
}
</style>