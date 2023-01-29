export class Node {
    data;
    parent;
    children;
    constructor(data, parent = null, children = []) {
        this.data = data;
        this.preant = parent;
        this.children = [];
    }
}

class Tree {
    root;
    constructor() {
        this.root = new Node("root");
        this.root.children[0] = new Node("$");
        this.root.children[10] = new Node("#");
    }
    getNodeWithId(id) {
        return id.reduce((acc, cur) => {
            return acc.children[cur[0]];
        }, this.root);
    }

    generateId(prevId, nextId) {
        const prevNode = this.getNodeWithId(prevId);
        const nextNode = this.getNodeWithId(nextId);
        const prevNodeIndex = prevId[prevId.length - 1][0];
        const nextNodeIndex = nextId[nextId.length - 1][0];
        prevNode.parent.slice(prevNodeIndex + 1);
    }

    traverse(node, cb = () => {}, start = [[0]], end = [[10]]) {
        start.length === 0 && (start = [[0]]);
        end.length === 0 && (end = [[10]]);

        var currentNode = node;
        if (currentNode) {
            cb(currentNode);
            for (var i = 0; i < currentNode.children.length; i++) {
                if (i < start[0][0]) continue;
                if (i >= end[0][0]) break;
                currentNode.children.length &&
                    this.traverse(currentNode.children[i], cb, start.slice(1), end.slice(1));
            }
        }
    }
    /* 
    3.7.9
    8.2
  */

    /* 
    id1 >  id2 true, otherwise false
  */
    compareTwoId(id1, id2) {
        for (let i = 0; i <= id1.length; i++) {
            if ((id1[i]?.[0] || -1) > (id2[i]?.[0] || -1)) return true;
        }
        return false;
    }
}
export const traverse1 = (root, cb, start, end, curIndex = [0]) => {
    

    let startIndex;
    let nextStart;
    if (curIndex[curIndex.length - 1] === start[0]) {
        nextStart = start.slice(1);
        if (start[1] === undefined) {
            cb?.(root, curIndex);
            startIndex = 0;
        } else {
            startIndex = start[1];
        }
    } else {
        nextStart = [0];
        cb?.(root, curIndex);
        startIndex = 0;
    }
    let endIndex;
    let nextEnd;
    if (curIndex[curIndex.length - 1] === end[0]) {
        nextEnd = end.slice(1);
        if (end[1] === undefined) {
            endIndex = 0;
        } else {
            endIndex = end[1];
        }
    } else {
        nextEnd = [10];
        endIndex = 10;
    }
    if (!root) return;
    for (let i = startIndex; i <= endIndex; i++) {
        //console.log("loop")
        traverse1(root.children[i], cb, nextStart, nextEnd, [...curIndex, i]);
    }
};

export const traverse = (root, cb, start, end) => {
    for (let i = start[0]; i <= end[0]; i++) {
        traverse1(root.children[i], cb, start, end, [i]);
    }
};

export default Tree;
