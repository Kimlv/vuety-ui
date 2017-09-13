import { SupergridNode } from './SupergridNode'


export class SupergridPanel {

    parent: SupergridNode;
    title: string = "Untitled Panel";

    isCloseable : boolean = true;

    componentName: string;
    componentProps : any = {};

    constructor(title: string, componentName: string = "", componentProps = {}) {
        this.title = title;
        this.componentName = componentName;
        this.componentProps = componentProps;
    }
}