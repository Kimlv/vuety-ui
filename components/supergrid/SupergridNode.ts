export class SupergridNode {

    dir: string = "row";

    parent: SupergridNode | null;
    title: string = "Untitled Panel";
    children: Array<SupergridNode> = [];

    image: string;
    bgColor: string;


    get root(): SupergridNode {

        let result: SupergridNode = this;

        while (result.parent != null) {
            result = result.parent;
        }

        return result;
    }


    constructor(title: string, bgcolor: string) {
        this.title = title;
        this.bgColor = bgcolor;
    }


    cleanup() {
      
        if (this.parent != null) {
            if (this.children.length == 1) {

                let index = this.parent.children.indexOf(this);
                this.children[0].parent = this.parent;
                this.parent.children[index] = this.children[0];
              
            }
        }

        for (let child of this.children) {
            child.cleanup();
        }
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


    attach(node: SupergridNode, insertMode: string) {

        if (this == node) {
            console.log("Drop on self!");
            return;
        }

        let oldParent = node.parent;

        //################ BEGIN Figure out new parent ###############
        let newParent: SupergridNode | null = this.parent;

        if (this.parent != node.parent) {

            // If new sibling already has other siblings, we need to subdivide:
            if (this.parent != null && this.parent.children.length > 1) {
                this.addChild(this.copy());
                newParent = this;
            }
        }

        if (newParent == null) {
            return;
        }
        //################ END Figure out new parent ###############


        //################ BEGIN Insert node at new location ##################

        switch (insertMode) {
            case 'bottom':
                newParent.addChild(node);
                newParent.dir = "col";
                break;

            case 'top':
                newParent.addChild(node, true);
                newParent.dir = "col";
                break;

            case 'right':
                newParent.addChild(node);
                newParent.dir = "row";
                break;

            case 'left':
                newParent.addChild(node, true);
                newParent.dir = "row";
                break;
        }
        //################ END Insert node at new location ##################

        this.root.cleanup();
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