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
    console.log("node", node, id)
    cb(node, id);
    if (!node.children) return;
    for (let i = 0; i <= node.children.length; i++) {
        const childNode = node.children[i];
        traverseInnerNode(childNode, cb, [...id, i]);
    }
};

const traverseFront = (node, startId, cb, id) => {
    const startIndex = startId[0];
    if (!node.children) {
        node.children = new Array(11).fill();
    }
    for (let i = startIndex; i <= 10; i++) {
        const childNode = node.children[i];
        if (i === startIndex) {
            if(!childNode) node.children[i] = new Node(null, [...id,i]);
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
   // if (!root.children) return;
    for (let i = startIndex; i <= endIndex; i++) {
        const childNode = root.children[i];
        if (i > startIndex && i < endIndex) {
            traverseInnerNode(childNode, cb, [i]);
        } else {
            if (i === startIndex && i !== endIndex) {
                if(!childNode) root.children[i] = new Node(null, [i])
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
    const reducedEndId = endId.map((item) => item[0]);
    /* if (getNodeById(tree.root,reducedStartId) === undefined) {

        const parentNode = getNodeById(tree.root, reducedStartId.slice(0, -1));
        parentNode.children[reducedEndId[reducedStartId - 1]] = new Node(null, reducedStartId);
    } */
    const emptySlotArr = [];
    const idArr = [];
    const cb = (node, id) => {
        if (node === undefined && id[id.length - 1] !== 0) {
            emptySlotArr.push(id);
        } else {
            idArr.push([id, node]);
        }
    };

    traverse(tree, reducedStartId, reducedEndId, cb);
    console.log("arrs", emptySlotArr, idArr)
    if (emptySlotArr.length > 0) {
        //id for undefined slot
        const targetId = emptySlotArr[Math.floor((emptySlotArr.length - 1) / 2)];
        const parentNode = getNodeById(tree.root, targetId.slice(0, -1));
        if (parentNode.children[targetId[targetId.length - 1]] === undefined) {
            parentNode.children[targetId[targetId.length - 1]] = new Node(data, targetId);
            return targetId;
        }
        console.log("failed to generate id");
    } else {
        //node for creating a new depth
        //console.log("idArr", reducedStartId, reducedEndId)
        const targetNode = idArr[Math.floor((idArr.length - 1) / 2)][1];
        const targetId = idArr[Math.floor((idArr.length - 1) / 2)][0];
        if (targetNode.children === null) {
            targetNode.children = new Array(11).fill();
            targetNode.children[5] = new Node(data, [...targetId, 5]);
            return [...targetId, 5];
        }
        console.log("failed to generate id");
    }
};

export const compareIds = (id1, id2) => {
    for (let i = 0; i < id1.length; i++) {
        if (id2[i] === undefined) return 1;
        if (id1[i][0] > id2[i][0]) return 1;
        if (id1[i][0] < id2[i][0]) return -1;
    }
    if (id1.length === id2.length) {
        if (id1[id1.length - 1][1] > id2[id2.length - 1][1]) {
            return 1;
        } else if (id1[id1.length - 1][1] < id2[id2.length - 1][1]) {
            return -1;
        } else {
            return 0;
        }
    }
    return -1;
};

export const compareExactId = (id1, id2) => {
    if (id1.length !== id2.length) return false;
    for (let i = 0; i < id1.length; i++) {
        if (id1[i][0] !== id2[i][0] || id1[i][1] !== id2[i][1]) return false;
    }
    return true;
};

/* export const insertRemoteAtom = (doc, atom) => {
    const id = atom[1];

    let a = 0;
    let b = doc.length - 1;
    let midLeftIndex = Math.floor((a + b) / 2);
    let midRightIndex = Math.floor((a + b) / 2) + 1;
    while (true) {
        console.log("insert", doc, midRightIndex);
        const midLeftId = doc[midLeftIndex][1];
        const midRightId = doc[midRightIndex][1];
        console.log("compare", midLeftId, id);
        const leftCompare = compareIds(midLeftId, id);
        const rightCompare = compareIds(midRightId, id);

        if (leftCompare === 1) {
            b = midLeftIndex;
            midLeftIndex = Math.floor((a + b) / 2);
            console.log("ab", a, b);
            midRightIndex = Math.floor((a + b) / 2) + 1;
        } else if (rightCompare === 1) {
            a = midRightIndex;
            midLeftIndex = Math.floor((a + b) / 2);
            console.log("ab", a, b);

            midRightIndex = Math.floor((a + b) / 2) + 1;
        } else {
            const nextDoc = [...doc];
            const remoteSiteId = id[id.length - 1][0];
            const midLeftSiteId = doc[midLeftIndex][0];
            const midRightSiteId = doc[midRightIndex][0];
            if (leftCompare === 0) {
                if (remoteSiteId > midLeftSiteId) {
                    nextDoc.splice(midLeftIndex + 1, 0, atom);
                } else if (remoteSiteId < midLeftSiteId) {
                    nextDoc.splice(midLeftIndex, 0, atom);
                } else {
                    console.log("id conflicts with midLeft");
                }
            } else if (rightCompare === 0) {
                if (remoteSiteId > midRightSiteId) {
                    nextDoc.splice(midRightIndex + 1, 0, atom);
                } else if (remoteSiteId < midRightSiteId) {
                    nextDoc.splice(midRightIndex, 0, atom);
                } else {
                    console.log("id conflicts with midRight");
                }
            } else {
                nextDoc.splice(midRightIndex, 0, atom);
            }
            return nextDoc;
        }
    }
}; */

export const insertRemoteAtom = (doc, atom, tree) => {
    const id = atom[1];
    let a = 0;
    let b = doc.length - 1;
    let mid = Math.floor((a + b) / 2);
    const nextDoc = [...doc];
    while (a <= b) {
        if (a === b) {
            if (compareIds(id, doc[a][1]) === 1) {
                nextDoc.splice(a + 1, 0, atom);
            } else if (compareIds(id, doc[a][1]) === -1) {
                nextDoc.splice(a, 0, atom);
            }
            return nextDoc;
        }
        if (compareIds(id, doc[mid][1]) === 1) {
            a = mid + 1;
            mid = Math.floor((a + b) / 2);
        } else if (compareIds(id, doc[mid][1]) === -1) {
            b = mid;
            mid = Math.floor((a + b) / 2);
        } /* else {
            const remoteSiteId = id[id.length - 1][1];
            const midSiteId = doc[mid][1][doc[mid][1].length - 1][1];
            if (remoteSiteId > midSiteId) {
                nextDoc.splice(mid + 1, 0, atom);
            } else if (remoteSiteId < midSiteId) {
                nextDoc.splice(mid, 0, atom);
            } else {
                console.log("id conflicts with", doc[mid]);
            }
            return nextDoc;
        } */
    }

    /*     const remoteSiteId = id[id.length - 1][1];
    const midSiteId = doc[a][1][doc[a][1].length - 1][1];
console.log("ab", a, b, remoteSiteId, midSiteId);
    if (remoteSiteId > midSiteId) {
        
        nextDoc.splice(a + 1, 0, atom);
    } else if (remoteSiteId < midSiteId) {
        nextDoc.splice(a, 0, atom);
    } else {
        console.log("id conflicts with", doc[a]);
    }
    return nextDoc; */
};

export const deleteRemoteAtom = (id, doc) => {
    let nextDoc = [...doc];
    nextDoc = nextDoc.filter((atom) => {
        return compareIds(atom[1], id) !== 0;
    });
    return nextDoc;
};
const compareMessages = (message1, message2) => {};
const insertMessage = (message, messageQ) => {
    const nextMessageQ = [...messageQ];
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

const binaryInsert = (element, array, compareFunc, canEqual = false) => {
    if (array.length === 0) {
        array.push(element);
        return array;
    }
    let a = 0;
    let b = array.length - 1;
    let mid = Math.floor((a + b) / 2);
    while (a !== b) {
        const comp = compareFunc(element, array[mid]);
        if (comp === 1) {
            a = mid + 1;
            mid = Math.floor((a + b) / 2);
        } else if (comp === -1) {
            b = mid;
            mid = Math.floor((a + b) / 2);
        } else {
            if (canEqual) {
                array.splice(mid + 1, 0, element);
            } else {
                console.log("conflict element!");
            }
            return array;
        }
    }
    const comp = compareFunc(element, array[mid]);
    if (comp === 1) {
        array.splice(mid + 1, 0, element);
    } else if (comp === -1) {
        array.slice(mid, 0, element);
    } else {
        if (canEqual) {
            array.splice(mid + 1, 0, element);
        } else {
            console.log("conflict element!");
        }
    }
    return array;
};

export const MessageQ = (siteId) => {
    const clock = {
        [siteId]: 1,
    };

    const messageQ = {};

    const insertMessage = (message, messageQ) => {
        const {
            action,
            atom: [data, remoteId, remoteClock],
        } = message;
        const remoteSiteId = remoteId[remoteId.length - 1][1];
        const queue = messageQ[remoteSiteId];
        const compareFun = (message1, message2) => {
            const clock1 = message1.atom[3];
            const clock2 = message2.atom[3];
            return clock1 > clock2 ? 1 : clock2 > clock1 ? -1 : 0;
        };
        binaryInsert(message, queue, compareFun);
    };

    const performAction = (message, doc, tree) => {
        if (message.action === "insert") {
            return insertRemoteAtom(doc, message.atom, tree);
        } else if (message.action === "delete") {
            return deleteRemoteAtom(message.atom[1], doc);
        }
    };

    const receive = (message, doc, tree) => {
        const {
            action,
            atom: [data, remoteId, remoteClock],
        } = message;
        const remoteSiteId = remoteId[remoteId.length - 1][1];
        if (messageQ[remoteSiteId] === undefined) messageQ[remoteSiteId] = [];
        if (clock[remoteSiteId] === undefined) {
            clock[remoteSiteId] = remoteClock;
            console.log("undefined", siteId, remoteSiteId, clock);
            doc = performAction(message, doc, tree);
        } else {
            if (remoteClock !== clock[remoteSiteId] + 1) {
                insertMessage(message, messageQ);
            } else {
                console.log("receive", siteId, message, clock);

                clock[remoteSiteId]++;
                doc = performAction(message, doc, tree);
                while (messageQ[remoteSiteId].length > 0) {
                    const curMessage = messageQ[remoteSiteId][0];
                    const {
                        action,
                        atom: [data, curId, curClock],
                    } = curMessage;

                    if (curClock !== curClock[remoteSiteId] + 1) {
                        break;
                    } else {
                        messageQ[remoteSiteId].shift();
                        clock[remoteSiteId]++;
                        doc = performAction(curMessage, doc, tree);
                    }
                }
            }
        }
        return doc;
    };
    return {
        clock,
        messageQ,
        receive,
    };
};

/* const tree = getTreeForTesting();

traverse(tree, [3, 7, 8], [8, 1], (node, id) => {
    console.log(id, node);
});
 */
