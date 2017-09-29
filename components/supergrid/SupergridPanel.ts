import { SupergridNode } from './SupergridNode'

export class SupergridPanel {

    componentName: string;
    componentProps : any = {};
    iconUrl : string = "";
    isCloseable : boolean = false;    
    parent: SupergridNode;
    title: string = "Untitled Panel";

    constructor(title: string, componentName: string = "", componentProps = {}) {
        this.title = title;
        this.componentName = componentName;
        this.componentProps = componentProps;
    }
}