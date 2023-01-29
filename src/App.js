import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import prettyPrint from "./prettyPrint";
import Tree, { traverse } from "./Tree";
document.querySelector("body").innerHTML =
    document.querySelector("body").innerHTML + "<div id='inspect'></div>";
const tree = new Tree("root");
const siteId = 1;

function App() {
    const [doc, setDoc] = useState([
        ["$", [[0, null]]],
        ["#", [[10, null]]],
    ]);
    const [cursor, setCursor] = useState(0);

    useEffect(() => {
        //prettyPrint(doc);
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
            const prevId = doc[caret - 1][1].map(item=>item[0])
            const nextId = doc[caret][1].map(item=>item[0]);
            //console.log("tree", tree)
            const idArr = []
            const cb = (node, id) => {
              if(node === undefined) idArr.push(id)
            }
            traverse(tree.root,cb, prevId, nextId);
            console.log("idArr", idArr)
            setDoc((prev) => {
                return [
                    prev[0],
                    ...prev.slice(1, doc.length - 1).slice(0, caret - 1),
                    [e.nativeEvent.data, [3, 1]],
                    ...prev.slice(1, doc.length - 1).slice(caret - 1, prev.length - 2),
                    prev[prev.length - 1],
                ];
            });
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
