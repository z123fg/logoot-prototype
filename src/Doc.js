import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import prettyPrint from "./prettyPrint";
import {
    Tree,
    allocateId,
    getTreeForTesting,
    traverse,
    insertRemoteAtom,
    deleteRemoteAtom,
} from "./Tree1";
/* document.querySelector("body").innerHTML =
    document.querySelector("body").innerHTML + "<div id='inspect'></div>"; */
//const tree = new Tree();
const siteId = 1;

/* const tree1 = getTreeForTesting(); */
/* traverse(tree1, [3, 7, 8], [8, 1], (node, id) => {
    if (node !== undefined) console.log(node.data, id);
}); */
//allocateId(tree1,[3, 7, 8], [8, 1])
/* prettyPrint(tree1); */

//console.log("getNodeWithId",tree.getNodeWithId([]))

function Doc({ siteId, message, emit }) {
    const [doc, setDoc] = useState([
        ["$", [[0, -1]]],
        ["#", [[10, Infinity]]],
    ]);
    const { current: tree } = useRef(new Tree());
    const inspectEl = useRef();
    const [cursor, setCursor] = useState(0);

    useEffect(() => {
        prettyPrint(inspectEl.current, tree, doc);
    }, [doc]);

    useEffect(() => {
        //console.log(siteId, message);
        if (message?.atom?.length > 0) {
            if (message.action === "insert") {
                console.log("insertAtom", message.atom)
                const nextDoc = insertRemoteAtom(doc, message.atom);
                setDoc(nextDoc);
            } else if (message.action === "delete") {
                const nextDoc = deleteRemoteAtom(message.atom[1], doc);
                setDoc(nextDoc);
            }
        }
    }, [message]);

    const handleChange = (e) => {
        const caret = e.target.selectionEnd;
        if (e.nativeEvent.inputType === "deleteContentBackward") {
            e.target.selectionStart = caret;
            e.target.selectionEnd = caret;
            const targetAtom = doc[caret + 1];
            setDoc((prev) => {
                return [
                    prev[0],
                    ...prev.slice(1, doc.length - 1).slice(0, caret),
                    ...prev
                        .slice(1, doc.length - 1)
                        .slice(caret + 1, prev.length - 2),
                    prev[prev.length - 1],
                ];
            });
            console.log("deleteAtom", targetAtom);

            emit(siteId, {action:"delete", atom:targetAtom});
        } else {
            const prevId = doc[caret - 1][1];
            const nextId = doc[caret][1];
            //console.log("prevNext", prevId, nextId);
            const targetId = allocateId(
                tree,
                prevId,
                nextId,
                e.nativeEvent.data
            );
            setDoc((prev) => {
                return [
                    prev[0],
                    ...prev.slice(1, doc.length - 1).slice(0, caret - 1),
                    [e.nativeEvent.data, targetId.map((id) => [id, siteId])],
                    ...prev
                        .slice(1, doc.length - 1)
                        .slice(caret - 1, prev.length - 2),
                    prev[prev.length - 1],
                ];
            });
            /* console.log("insertAtom", [
                e.nativeEvent.data,
                targetId.map((id) => [id, siteId]),
            ]); */
            emit(siteId, {action:"insert",atom:[e.nativeEvent.data, targetId.map((id) => [id, siteId])]});
        }

        //traverse()
    };

    const handleKeyUp = (e) => {
        console.log(e);
        if (e.keyCode === 8) {
        }
    };

    return (
        <div className="doc">
            <input
                value={doc
                    .slice(1, doc.length - 1)
                    .map((item) => item[0])
                    .join("")}
                onChange={handleChange}
                //onKeyUp={handleKeyUp}
            />
            <span className="inspect" ref={inspectEl}></span>
        </div>
    );
}

export default Doc;
