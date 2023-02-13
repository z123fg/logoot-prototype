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
            return acc.children[cur];
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
            //endIndex = 0;
            return
        } else {
            endIndex = end[1];
        }
    } else {
        nextEnd = [10];
        endIndex = 10;
    }
    console.log("curIndex",curIndex, startIndex, endIndex)
    if (!root || root.children.length === 0) return;
    
    for (let i = startIndex; i <= endIndex; i++) {
        //console.log("loop")
        traverse1(root.children[i], cb, nextStart, nextEnd, [...curIndex, i]);
    }
};

export const traverse = (root, cb, start, end) => {
    //if(end[0] === 10) end[0] = 9
    for (let i = start[0]; i <= end[0]; i++) {
        traverse1(root.children[i], cb, start, end, [i]);
    }
};

export const allocateId = (tree, prevId, nextId, char) => {
    const idArr = [];
    const emptySlotArr = [];
    const cb = (node, id) => {
        if (node === undefined) {
            emptySlotArr.push(id);
        }
        idArr.push(id);
    };
    console.log(
        "prev",
        prevId.map((item) => item[0]),
        nextId.map((item) => item[0])
    );
    traverse(
        tree.root,
        cb,
        prevId.map((item) => item[0]),
        nextId.map((item) => item[0])
    );

    if (emptySlotArr.length === 0) {
        console.log(idArr);
        const targetId = idArr[Math.floor((idArr.length - 1) / 2)];

        const targetNode = tree.getNodeWithId(targetId);
        targetNode.children = new Array(11).fill();
        targetNode.children[5] = new Node(char);
        return [...prevId, [5, 1]];
    } else {
        console.log("empty", emptySlotArr);
        const targetId = emptySlotArr[Math.floor(emptySlotArr.length / 2)];
        const parentNode = tree.getNodeWithId(targetId.slice(0, targetId.length - 1));
        parentNode.children[targetId[targetId.length - 1]] = new Node(char);
        return [...prevId.slice(0, prevId.length - 1), [targetId[targetId.length - 1], 1]];
    }
};

export default Tree;
