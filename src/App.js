import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import prettyPrint from "./prettyPrint";
import { Tree, allocateId, getTreeForTesting, traverse } from "./Tree1";
document.querySelector("body").innerHTML =
    document.querySelector("body").innerHTML + "<div id='inspect'></div>";
const tree = new Tree();
const siteId = 1;

const tree1 = getTreeForTesting();
/* traverse(tree1, [3, 7, 8], [8, 1], (node, id) => {
    if (node !== undefined) console.log(node.data, id);
}); */
//allocateId(tree1,[3, 7, 8], [8, 1])
prettyPrint(tree1);

//console.log("getNodeWithId",tree.getNodeWithId([]))

function App() {
    const [doc, setDoc] = useState([
        ["$", [[0, null]]],
        ["#", [[10, null]]],
    ]);
    const [cursor, setCursor] = useState(0);

    useEffect(() => {
        prettyPrint(tree,doc);
    }, [doc]);

    const handleChange = (e) => {
        const caret = e.target.selectionEnd;
        if (e.nativeEvent.inputType === "deleteContentBackward") {
            e.target.selectionStart = caret;
            e.target.selectionEnd = caret;
            setDoc((prev) => {
                return [
                    prev[0],
                    ...prev.slice(1, doc.length - 1).slice(0, caret),
                    ...prev.slice(1, doc.length - 1).slice(caret + 1, prev.length - 2),
                    prev[prev.length - 1],
                ];
            });
        } else {
            const prevId = doc[caret - 1][1]
            const nextId = doc[caret][1];

            const targetId = allocateId(tree, prevId, nextId, e.nativeEvent.data);
            /* setDoc((prev) => {
                return [
                    prev[0],
                    ...prev.slice(1, doc.length - 1).slice(0, caret - 1),
                    [e.nativeEvent.data, targetId],
                    ...prev.slice(1, doc.length - 1).slice(caret - 1, prev.length - 2),
                    prev[prev.length - 1],
                ];
            }); */
        }

        //traverse()
    };

    const handleKeyUp = (e) => {
        console.log(e);
        if (e.keyCode === 8) {
        }
    };

    return (
        <>
            <input
                value={doc
                    .slice(1, doc.length - 1)
                    .map((item) => item[0])
                    .join("")}
                onChange={handleChange}
                //onKeyUp={handleKeyUp}
            />
        </>
    );
}

export default App;
