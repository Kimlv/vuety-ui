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

        if (typeof options.isCloseable != "undefined") {
            this.isCloseable = options.isCloseable;
        }
    }    

}