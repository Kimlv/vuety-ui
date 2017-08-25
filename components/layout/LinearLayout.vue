<template>
    <div class="vuety-linear-layout">
        <slot/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
    props: {

    }
})
export default class LinearLayout extends Vue {

}
</script>

<style lang="scss">
div.vuety-linear-layout {
    display: flex;
    align-items: stretch;
    height: 100%;

    >* {
        // 'width:100%'' is SUPER IMPORTANT here to ensure correct rendering in Firefox!!!
        width: 100%;
    }
}
</style>