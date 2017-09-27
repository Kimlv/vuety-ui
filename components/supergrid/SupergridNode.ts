import { SupergridPanel } from './SupergridPanel'

export class SupergridNode {

    divider: number = 0.5;
    pActiveTab: SupergridPanel | null = null;
    parent: SupergridNode | null;

    children: Array<SupergridNode | SupergridPanel> = [];

    // TODO: 2 Make dir an enum
    private pDir: string = "row";

    //################### BEGIN Computed Properties ##################
    get activeTab(): SupergridPanel {
        if (this.pActiveTab != null) {
            return this.pActiveTab;
        }

        return this.childPanels[0];
    }

    set activeTab(v: SupergridPanel) {
        this.pActiveTab = v;
    }


    get dir(): string {
        return this.pDir;
    }

    set dir(v: string) {
        this.pDir = v;
    }


    get childPanels(): Array<SupergridPanel> {
        let result: Array<SupergridPanel> = [];

        for (let child of this.children) {
            if (child instanceof SupergridPanel) {
                result.push(child);
            }
        }

        return result;
    }


    get root(): SupergridNode {

        let result: SupergridNode = this;

        while (result.parent != null) {
            result = result.parent;
        }

        return result;
    }
    //################### END Computed Properties ###################


    addChild(child: SupergridNode | SupergridPanel, front: boolean = false): SupergridNode | SupergridPanel {
      
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

        return child;
    }


    cleanup() {

        //################ BEGIN Remove empty child nodes ###################
        let children = [];

        for (let child of this.children) {
            if (!(child instanceof SupergridNode && child.children.length == 0)) {
                children.push(child);
            }
        }

        this.children = children;
        //################ END Remove empty child nodes ###################

        for (let child of this.children) {

            if (child instanceof SupergridNode) {
                child.cleanup();
            }
        }

        if (this.children.length == 1 && this.children[0] instanceof SupergridNode) {
            if (this.parent != null) {
                let si = this.parent.children.indexOf(this);

                this.parent.children[si] = this.children[0];
                this.parent.children[si].parent = this.parent;
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


        if (this.activeTab == child) {
            this.pActiveTab = null;
        }
    }
}
