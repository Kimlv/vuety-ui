import { SupergridNode } from './SupergridNode'


export class SupergridPanel {

    parent: SupergridNode;
    title: string = "Untitled Panel";

    image: string;
    bgColor: string;

    component: string;


    constructor(title: string, component: string = "") {
        this.title = title;
        this.component = component;
    }

    get root(): SupergridNode {

        let result: SupergridNode = this.parent;

        while (result.parent != null) {
            result = result.parent;
        }

        return result;
    }
}