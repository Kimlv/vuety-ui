import { SupergridPanel } from './SupergridPanel'

export class SupergridNode {

    dir: string = "row";
    divider : number = 0.5;


    parent: SupergridNode | null;


    private pChildren: Array<SupergridNode | SupergridPanel> = [];


    
    get children() : Array<SupergridNode | SupergridPanel> {
        return this.pChildren;
    }

    set children(v : Array<SupergridNode | SupergridPanel>) {
        this.pChildren = v;

        for (let child of this.pChildren) {
            child.parent = this;
        }

    }

    get root(): SupergridNode {

        let result: SupergridNode = this;

        while (result.parent != null) {
            result = result.parent;
        }

        return result;
    }

    addChild(child: SupergridNode | SupergridPanel, front: boolean = false) {

        if (child.parent != null) {
            child.parent.removeChild(child);
        }

        if (front) {
            this.children.unshift(child);
        }
        else {
            this.children.push(child);
        }

        child.parent = this;
    }


    cleanup() {
        if (this.children.length == 1 && this.children[0] instanceof SupergridNode) {

            let child = <SupergridNode>this.children[0];

            this.children = child.children;
            this.dir = child.dir;
        }

        for (let child of this.children) {

            child.parent = this;

            if (child instanceof SupergridNode) {
                child.cleanup();
            }
        }
    }

    removeChild(child: SupergridNode | SupergridPanel) {
        let index = this.children.indexOf(child);

        if (index > -1) {
            this.children.splice(index, 1);
        }

        child.parent = null;

        if (this.children.length == 0 && this.parent != null) {
            this.parent.removeChild(this);
        }
    }
}
