<template>
    <div :class="cssClass" role="tabpanel">
        <slot/>
    </div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class Tab extends Vue {

    @Prop({ default: "Tab" })
    title: string;

    active: Boolean = false;

    get cssClass(): string {
        let result = "vuety-tab";

        if (this.active) { result += " active" }

        return result;
    }
}
</script>

<style lang="scss">
div.vuety-tab {

    display: none;

    &.active {
        display: block;
    }
}
</style>