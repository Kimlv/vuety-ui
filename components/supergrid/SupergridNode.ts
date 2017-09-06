export class SupergridNode {

    dir: string = "row";

    parent: SupergridNode | null;

    title: string = "Untitled Panel";
    children: Array<SupergridNode> = [];

    image: string;
    bgColor: string;

    constructor(title: string, bgcolor: string) {
        this.title = title;
        this.bgColor = bgcolor;
    }



    addChild(node: SupergridNode, front: boolean = false) {

        // NOTE: We must not check here if 'this' already has 'node' as a child,
        // since event if it has, the order might be changed.

        // Remove node from old parent:
        if (node.parent != null) {


            node.parent.removeChild(node);
        }

        // Set new parent:
        node.parent = this;

        if (front) {
            this.children.unshift(node);
        }
        else {
            this.children.push(node);
        }
    }


    copy(): SupergridNode {

        let result = new SupergridNode(this.title, this.bgColor);
        return result;
    }

    hasChild(node: SupergridNode): boolean {
        var index = this.children.indexOf(node);

        return index > -1;
    }

    removeChild(node: SupergridNode) {
        var index = this.children.indexOf(node);

        if (index > -1) {
            this.children.splice(index, 1);
            node.parent = null;
        }


        //########## BEGIN Remove empty node ##########        
        if (this.children.length == 0) {

            if (this.parent != null) {
                this.parent.removeChild(this);
                this.parent = null;
            }
        }
        //########## END Remove empty node ##########


    }


}