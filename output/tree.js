"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tree {
    constructor(util) {
        this.$u = util;
    }
    *nodeGenerator(tree, parentNode) {
        for (let node of this.$u.as.array(tree)) {
            yield { node, parentNode };
            yield* this.nodeGenerator(node.children, node);
        }
    }
    *filterGenerator(tree, fn) {
        for (let item of this.$u.as.array(tree)) {
            if (fn(item)) {
                yield item;
            }
            yield* this.filterGenerator(item.children, fn);
        }
    }
    *getNodePathGenerator(tree, fn, parent) {
        for (let node of this.$u.as.array(tree)) {
            if (fn(node)) {
                if (parent) {
                    yield parent;
                }
                yield node;
            }
            else {
                let isParentSent = false;
                for (let subItem of this.getNodePathGenerator(node.children, fn, node)) {
                    if (!isParentSent && parent) {
                        yield parent;
                        isParentSent = true;
                    }
                    yield subItem;
                }
            }
        }
    }
    includes(children, item) {
        if (this.$u.is.empty(children))
            return false;
        if (this.$u.includes(children, item))
            return true;
        return this.$u.as.array(children).some((p) => {
            const subChildren = this.$u.get(p, 'children');
            return this.includes(subChildren, item);
        });
    }
    find(tree, fn) {
        for (let item of this.$u.as.array(tree)) {
            if (fn(item)) {
                return item;
            }
            var found = this.find(item.children, fn);
            if (found)
                return found;
        }
    }
    getNodePath(tree, fn) {
        return Array.from(this.getNodePathGenerator(tree, fn, null));
    }
    filter(tree, fn) {
        return Array.from(this.filterGenerator(tree, fn));
    }
    toNodeMap(tree) {
        const result = new Map();
        tree = this.$u.as.array(tree);
        for (let item of this.nodeGenerator(tree, null)) {
            result.set(this.$u.as.id(item.node), item);
        }
        return result;
    }
    getNodes(tree) {
        const result = Array.from(this.nodeGenerator(tree, null));
        return result;
    }
}
exports.default = Tree;
//# sourceMappingURL=tree.js.map