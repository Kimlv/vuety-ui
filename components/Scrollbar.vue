<template>
    <div ref="outer" @scroll="onScroll" class="vuety-scrollbar">
        <div ref="inner"></div>
    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class Scrollbar extends Vue {

    get innerElem(): HTMLDivElement {
        return <HTMLDivElement>this.$refs.inner;
    }

    get outerElem(): HTMLDivElement {
        return <HTMLDivElement>this.$refs.outer;
    }

    onScroll() {
        this.$emit('my-scroll', { 'pos': this.getScrollPos() });
    }

    getScrollPos(): number {
        return this.outerElem.scrollTop / (this.innerElem.offsetHeight - this.outerElem.offsetHeight);
    }

    setHeight(h: string) {
        this.outerElem.style.height = h;
        
        this.innerElem.style.height = (this.outerElem.offsetHeight * 10) + 'px !important';
    }

    setScrollPos(p: number) {
        this.outerElem.scrollTop = p * (this.innerElem.offsetHeight - this.outerElem.offsetHeight);
    }
}
</script>

<style lang="scss">
div.vuety-scrollbar {
    overflow-x: hidden;
    overflow-y: scroll;
    min-height: 20px;
    div {
        // A width > 0 is required by Firefox to see the need for scrolling:
        width: 1px !important; 
        
        // An initial height larger than the scrollbar height seems to be
        // required to display the scrollbar by both Firefox and Chrome:
        height: 10000px;
    }
}
</style>

