<template>
   
    <div v-if="active" class="vuety-tab" role="tabpanel">

        
        <div>
            <slot/>
        </div>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Tabbed from './Tabbed.vue'

@Component({


    props: {

        'title': String
    }
})
export default class Tab extends Vue {

    active: Boolean = false;

    title: string;   
}
</script>

<style lang="scss">
div.vuety-tab {
    line-height:1.5em;

}
</style>

