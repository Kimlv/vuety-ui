export class SupergridNode {

    dir: string = "row";

    parent: SupergridNode | null;

    title: string = "Untitled Panel";
    children: Array<SupergridNode> = [];


    constructor(title: string) {
        this.title = title;
    }

    addChild(node: SupergridNode, front: boolean = false) {

        if (front) {
            this.children.unshift(node);
        }
        else {
            this.children.push(node);
        }

        node.parent = this;
    }

    removeChild(node: SupergridNode) {
        var index = this.children.indexOf(node);


        if (index > -1) {
            console.log("yay");
            this.children.splice(index, 1);
            node.parent = null;
        }

    }
}