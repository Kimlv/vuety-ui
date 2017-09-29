import { SupergridNode } from './SupergridNode'

export class SupergridPanel {

    componentName: string;
    componentProps : any = {};
    iconUrl : string = "";
    isCloseable : boolean = false;    
    parent: SupergridNode;
    title: string = "Untitled Panel";

    constructor(options : any) {
        this.componentName = options.componentName;
        this.componentProps = options.componentProps;
        this.iconUrl = options.iconUrl;
        this.title = options.title;
        
    }    
/*    
    constructor(title: string, componentName: string = "", componentProps = {}) {
        this.title = title;
        this.componentName = componentName;
        this.componentProps = componentProps;
    }    
    */
}