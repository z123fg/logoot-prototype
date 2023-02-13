export class Node {
    constructor(data, id) {
        this.children = null;
        this.data = data;
        this.id = id;
    }
}

export class Tree {
    constructor() {
        this.root = new Node("root");
        this.root.children = new Array(11).fill();
        this.root.children[0] = new Node("$", [0]);
        this.root.children[10] = new Node("#", [10]);
    }
}

//const traverseNode = (node, startId, endId, cb) => {};
const traverseInnerNode = (node, cb, id) => {
    cb(node, id);
    if (!node || !node.children) return;
    for (let i = 0; i <= node.children.length; i++) {
        const childNode = node.children[i];
        traverseInnerNode(childNode, cb, [...id, i]);
    }
};

const traverseFrontBottom = (node, cb, id) => {
    //console.log("node", node)
    cb(node, id);
    if (!node || !node.children) return;
    for (let i = 0; i <= node.children.length; i++) {
        const childNode = node.children[i];
        traverseInnerNode(childNode, cb, [...id, i]);
    }
};

const traverseFront = (node, startId, cb, id) => {
    const startIndex = startId[0];
    if (!node || !node.children) return;
    for (let i = startIndex; i <= 10; i++) {
        const childNode = node.children[i];
        if (i === startIndex) {
            if (startId.length <= 1) {
                // front-bottom
                traverseFrontBottom(childNode, cb, [...id, i]);
            } else {
                //front
                traverseFront(childNode, startId.slice(1), cb, [...id, i]);
            }
        } else {
            traverseInnerNode(childNode, cb, [...id, i]);
        }
    }
};

const traverseEnd = (node, endId, cb, id) => {
    let endIndex = endId[0];
    cb(node, id);
    if (!node || !node.children) return;
    for (let i = 0; i <= endIndex; i++) {
        const childNode = node.children[i];
        if (i === endIndex) {
            if (endId.length <= 1) {
                return;
                // end-bottom
            } else {
                //end
                traverseEnd(childNode, endId.slice(1), cb, [...id, i]);
            }
        } else {
            traverseInnerNode(childNode, cb, [...id, i]);
        }
    }
};

const traverseFrontBotomEnd = (node, endId, cb, id) => {
    const endIndex = endId[0];
    cb(node, id);
    if (!node || !node.children) return;
    for (let i = 0; i <= endIndex; i++) {
        const childNode = node.children[i];
        if (i === endIndex) {
            if (endId.length <= 1) {
                return;
                // end-bottom
            } else {
                //end
                traverseEnd(childNode, endId.slice(1), cb, [...id, i]);
            }
        } else {
            traverseInnerNode(childNode, cb, [...id, i]);
        }
    }
};

const traverseFrontEnd = (node, startId, endId, cb, id) => {
    const startIndex = startId[0];
    const endIndex = endId[0];
    if (!node || !node.children) return;
    for (let i = startIndex; i <= endIndex; i++) {
        const childNode = node.children[i];
        if (i > startIndex && i < endIndex) {
            traverseInnerNode(childNode, cb, [...id, i]);
        } else {
            if (i === startIndex && i !== endIndex) {
                if (startId.length <= 1) {
                    // front-bottom
                    traverseFrontBottom(childNode, cb, [...id, i]);
                } else {
                    //front
                    traverseFront(childNode, startId.slice(1), cb, [...id, i]);
                }
            } else if (i !== startIndex && i === endIndex) {
                if (endId.length <= 1) {
                    return;
                    // end-bottom
                } else {
                    //end
                    traverseEnd(childNode, endId.slice(1), cb, [...id, i]);
                }
            } else {
                //both start and end
                if (startId.length <= 1 && !(endId.length <= 1)) {
                    //front-bottom, end
                    traverseFrontBotomEnd(childNode, endId.slice(1), cb, [...id, i]);
                } else if (!(startId.length <= 1) && !(endId.length <= 1)) {
                    //front, end
                    traverseFrontEnd(childNode, startId.slice(1), endId.slice(1), cb, [...id, i]);
                } else {
                    //front-bottom, end-bottom
                    return;
                }
            }
        }
    }
};

export const traverse = (tree, startId, endId, cb) => {
    const root = tree.root;
    const startIndex = startId[0];
    const endIndex = endId[0];
    if (!root.children) return;
    for (let i = startIndex; i <= endIndex; i++) {
        const childNode = root.children[i];
        if (i > startIndex && i < endIndex) {
            traverseInnerNode(childNode, cb, [i]);
        } else {
            if (i === startIndex && i !== endIndex) {
                if (startId.length <= 1) {
                    // front-bottom
                    traverseFrontBottom(childNode, cb, [i]);
                } else {
                    //front
                    traverseFront(childNode, startId.slice(1), cb, [i]);
                }
            } else if (i !== startIndex && i === endIndex) {
                if (endId.length <= 1) {
                    return;
                    // end-bottom
                } else {
                    //end
                    traverseEnd(childNode, endId.slice(1), cb, [i]);
                }
            } else {
                //both start and end
                if (startId.length <= 1 && !(endId.length <= 1)) {
                    //front-bottom, end
                    traverseFrontBotomEnd(childNode, endId.slice(1), cb, [i]);
                } else if (!(startId.length <= 1) && !(endId.length <= 1)) {
                    //front, end
                    traverseFrontEnd(childNode, startId.slice(1), endId.slice(1), cb, [i]);
                } else {
                    //front-bottom, end-bottom
                    return;
                }
            }
        }
    }
};

const getNodeById = (root, id) => {
    return id.reduce((acc, cur) => {
        return acc.children[cur];
    }, root);
};

export const allocateId = (tree, startId, endId, data) => {
    const reducedStartId = startId.map((item) => item[0]);
    const  reducedEndId = endId.map((item) => item[0]);
    const emptySlotArr = [];
    const idArr = [];
    const cb = (node, id) => {
        if (node === undefined) {
            emptySlotArr.push(id);
        } else {
            idArr.push([id, node]);
        }
    };
    traverse(tree, reducedStartId, reducedStartId, cb);
    if (emptySlotArr.length > 0) {
        //id for undefined slot
        const targetId = emptySlotArr[Math.floor((emptySlotArr.length - 1) / 2)];
        const parentNode = getNodeById(tree.root, targetId.slice(0, -1));
        if (parentNode[targetId[targetId.length - 1]] === undefined) {
            parentNode[targetId[targetId.length - 1]] = new Node(data, targetId);
            return targetId
        }
        console.log("failed to generate id");
    } else {
        //node for creating a new depth
        const targetNode = idArr[Math.floor((idArr.length - 1) / 2)];
        if (targetNode.children === null) {
            targetNode.children = new Array(11).fill();
            targetNode.children[5] = new Node(data, [...targetNode.id, 5]);
            return [...targetNode.id, 5];
        }
        console.log("failed to generate id");
    }
};

export const getTreeForTesting = () => {
    const treeForTesting = new Tree();
    treeForTesting.root.children[3] = new Node(3);
    treeForTesting.root.children[4] = new Node(4);
    treeForTesting.root.children[5] = new Node(5);

    treeForTesting.root.children[5].children = new Array(11).fill();
    treeForTesting.root.children[5].children[6] = new Node(6);
    treeForTesting.root.children[5].children[7] = new Node(7);

    treeForTesting.root.children[5].children[7].children = new Array(11).fill();
    treeForTesting.root.children[5].children[7].children[9] = new Node(9);
    treeForTesting.root.children[5].children[7].children[10] = new Node(10);

    treeForTesting.root.children[3].children = new Array(11).fill();
    treeForTesting.root.children[3].children[5] = new Node(5);
    treeForTesting.root.children[3].children[6] = new Node(6);
    treeForTesting.root.children[3].children[7] = new Node(7);

    treeForTesting.root.children[3].children[7].children = new Array(11).fill();
    treeForTesting.root.children[3].children[7].children[7] = new Node(7);
    treeForTesting.root.children[3].children[7].children[8] = new Node(8);
    treeForTesting.root.children[3].children[7].children[9] = new Node(9);

    treeForTesting.root.children[3].children[7].children[9].children = new Array(11).fill();
    treeForTesting.root.children[3].children[7].children[9].children[3] = new Node(3);
    treeForTesting.root.children[3].children[7].children[9].children[4] = new Node(4);

    treeForTesting.root.children[8] = new Node(8);
    treeForTesting.root.children[8].children = new Array(11).fill();
    treeForTesting.root.children[8].children[1] = new Node(1);
    treeForTesting.root.children[8].children[2] = new Node(2);
    treeForTesting.root.children[9] = new Node(9);
    return treeForTesting;
};

const tree = getTreeForTesting();

//traverse(tree.root, [3,7,8],[8,1], (node)=>{console.log(node)})
