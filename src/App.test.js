import App from "./App";
import Tree, { Node, traverse } from "./Tree";
const getTreeForTesting = ()=>{
 const  treeForTesting = new Tree(1);
treeForTesting.root.children[3] = new Node(3);
treeForTesting.root.children[4] = new Node(4);
treeForTesting.root.children[5] = new Node(5);
treeForTesting.root.children[5].children[6] = new Node(6);
treeForTesting.root.children[5].children[7] = new Node(7);
treeForTesting.root.children[5].children[7].children[9] = new Node(9);
treeForTesting.root.children[5].children[7].children[10] = new Node(10);

treeForTesting.root.children[3].children[5] = new Node(5);
treeForTesting.root.children[3].children[6] = new Node(6);
treeForTesting.root.children[3].children[7] = new Node(7);
treeForTesting.root.children[3].children[7].children[7] = new Node(7);
treeForTesting.root.children[3].children[7].children[8] = new Node(8);
treeForTesting.root.children[3].children[7].children[9] = new Node(9);
treeForTesting.root.children[3].children[7].children[9].children[3] = new Node(3);
treeForTesting.root.children[3].children[7].children[9].children[4] = new Node(4);

treeForTesting.root.children[8] = new Node(8);
treeForTesting.root.children[8].children[1] = new Node(1);
treeForTesting.root.children[8].children[2] = new Node(2);
treeForTesting.root.children[9] = new Node(9);
return treeForTesting
}
test("tree1", () => {
    const tree = getTreeForTesting()
    const start = [3, 7, 9];
    const end = [8, 2];
    const result = [];
    traverse(
        tree.root,
        (node, curIndex) => {
            result.push(curIndex)
        },
        start,
        end
    );
      expect(result).toEqual([
        [ 3, 7, 9 ],    [ 3, 7, 9, 3 ],
        [ 3, 7, 9, 4 ], [ 4 ],
        [ 5 ],          [ 5, 6 ],
        [ 5, 7 ],       [ 5, 7, 9 ],
        [ 5, 7, 10 ],   [ 8 ],
        [ 8, 1 ],       [ 8, 2 ]
      ])
});

test("tree2", () => {
    const tree = getTreeForTesting();
    console.log(tree)
    tree.root.children[8].children[7] = new Node(7)
    tree.root.children[8].children[7].children[9] = new Node(9)
    tree.root.children[8].children[7].children[10] = new Node(10)
  const start = [3, 7, 9];
  const end = [8, 2];
  const result = [];
  traverse(
      tree.root,
      (node, curIndex) => {
          result.push(curIndex)
      },
      start,
      end
  );
    expect(result).toEqual([
      [ 3, 7, 9 ],    [ 3, 7, 9, 3 ],
      [ 3, 7, 9, 4 ], [ 4 ],
      [ 5 ],          [ 5, 6 ],
      [ 5, 7 ],       [ 5, 7, 9 ],
      [ 5, 7, 10 ],   [ 8 ],
      [ 8, 1 ],       [ 8, 2]
    ])
});
