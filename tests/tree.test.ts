import Utility from '../src/main';

const treeData = [
  { id: 1, children: [{ id: 2, children: [] }] },
  { id: 3, children: [] },
];

describe('Tree', () => {
  let tree=Utility.tree;
  
  test('includes should return true if item is in children', () => {
    expect(tree.deepIncludes(treeData, { id: 2 })).toBe(true);
  });

  test('includes should return false if item is not in children', () => {
    expect(tree.deepIncludes(treeData, { id: 4 })).toBe(false);
  });

  test('find should return the correct node', () => {
    const result = tree.findNode(treeData, (node: any) => node.id === 2);
    expect(result).toEqual({ id: 2, children: [] });
  });

  test('getNodePath should return the correct path', () => {
    const result = tree.getNodePath(treeData, (node: any) => node.id === 2);
    expect(result).toEqual([{ id: 1, children: [{ id: 2, children: [] }] }, { id: 2, children: [] }]);
  });

  test('filter should return the correct nodes', () => {
    const result = tree.filter(treeData, (node: any) => node.id > 1);
    expect(result).toEqual([{ id: 2, children: [] }, { id: 3, children: [] }]);
  });

  test('toNodeMap should return a map of nodes', () => {
    const result = tree.toNodeMap(treeData);
    expect(result.size).toBe(3);
    expect(result.get(1)).toEqual({ node: { id: 1, children: [{ id: 2, children: [] }] }, parentNode: null });
  });

  test('getNodes should return all nodes', () => {
    const result = tree.getNodes(treeData);
    expect(result.length).toBe(3);
  });
});
