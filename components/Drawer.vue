<template>
    <div ref="drawer" :class="cssClass" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
        <button v-if="peekSwitch" @click="onClick">Keep Open: {{!peek}}</button>
        <div ref="content">

            <slot/>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
    props: {
        'hidden': Boolean,
        'peekSwitch': Boolean
    }
})
export default class Drawer extends Vue {

    //######## BEGIN Props #########
    hidden: boolean;
    peekSwitch: boolean;
    //######## END Props #########

    peek: boolean = false;
    pHidden: boolean = false;

    hideTimerHandle: any;


    get cssClass(): string {

        let vis = this.pHidden ? 'hidden' : 'visible';
        let peek = this.peek ? 'peek' : ''

        return 'vuety-drawer ' + vis + " " + peek;
    }


    mounted() {

        if (typeof this.hidden != "undefined") {
            this.pHidden = this.hidden;
        }
    }

    onClick(evt: Event) {
        this.peek = !this.peek;
    }


    onMouseLeave(evt: Event) {

        this.hideTimerHandle = window.setTimeout(() => {

            if (this.peek) {
                this.pHidden = true;
            }

        }, 1000);
    }

    onMouseOver(evt: Event) {
        window.clearInterval(this.hideTimerHandle);
        if (this.pHidden) {

            this.pHidden = false;
            this.peek = true;
        }
    }
}
</script>

<style lang="scss">
div.vuety-drawer {

    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;

    box-shadow: 0px 0 5px rgba(0, 0, 0, 0.4); 
    
    // NOTE: 'position:relative' prevents the narrow 8px handle of the collapsed 
    // sidebar from overlapping with neighbour regions, but it also causes 
    // a 8px shift/"jump" of the neighbour content when the sidebar is shown/hidden:
    //position:relative;
    position: absolute;

    background-color: #f0f0f0;

    // Drawer default width:
    width:250px;

    // ATTENTION: 'height:100%' is required to keep the 100% height with absolute positioning (peek mode):
    height:100%;
    
    // NOTE: For Internet Explorer, z-index must be defined here, not in the parent DIV!
    z-index: 99;

    > button {
        margin:8px;        
    }
}

div.vuety-drawer.hidden {
    width: 8px !important;
    padding: 0;
    * {
        display: none;
    }
}

div.vuety-drawer.visible {
    position: relative;
}

div.vuety-drawer.peek {
    position: absolute;
}
</style>