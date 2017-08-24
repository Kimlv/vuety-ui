<template>
    <div class="vuety-drawer">

        <div ref="drawer" :class="cssClass()" @mouseleave="onMouseLeave">

            <button @click="onClick">Peek: {{peek}}</button>

            <div ref="content">
                <slot/>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
    props: {
        'title': String,
        'visible': Boolean,
        
    }
})
export default class Drawer extends Vue {

    visible: boolean;

    

    peek: boolean = false;

   

    // NOTE: This must not be a get property!
    cssClass(): string {

        let vis = this.visible ? 'visible' : 'hidden';
        let peek = this.peek ? 'peek' : ''

        return vis + " " + peek;
    }

 


    onClick(evt: Event) {
        this.peek = !this.peek;
    }


    onMouseLeave(evt: Event) {
        this.$emit('mouseleave', evt);
/*
        let me = this;
        window.setTimeout(function() {
            console.log("Hide");
            me.pVisible = false;
            me.$forceUpdate();

        }, 1000);
        */
    }
}
</script>

<style lang="scss">
div.vuety-drawer {

    >div {
        padding: 16px;

        background-color: #ccc;
        flex-grow: 0;
        flex-shrink: 0;

        flex-basis: auto;

        height: 100%;
        width: 300px;
        z-index: 999;
    }

    >div.peek {
        position: absolute;
    }

    >div.hidden {
        display: none;
    }
}
</style>