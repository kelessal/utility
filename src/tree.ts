import { IUtility,ITree } from './types'
export default class Tree implements ITree {
    private readonly $u: IUtility
    constructor(util: IUtility) {
      this.$u = util
    }
    private *nodeGenerator(tree: any, parentNode: any): any {
      for (let node of this.$u.as.array(tree)) {
        yield { node, parentNode }
        yield* this.nodeGenerator(node.children, node)
      }
    }
    private *filterGenerator(tree: any, fn: any): any {
      for (let item of this.$u.as.array(tree)) {
        if (fn(item)) {
          yield item
        }
        yield* this.filterGenerator(item.children, fn)
      }
    }
    private *getNodePathGenerator(tree: any, fn: any, parent: any): any {
      for (let node of this.$u.as.array(tree)) {
        if (fn(node)) {
          if (parent) {
            yield parent
          }
          yield node
        } else {
          let isParentSent = false
          for (let subItem of this.getNodePathGenerator(node.children, fn, node)) {
            if (!isParentSent && parent) {
              yield parent
              isParentSent = true
            }
            yield subItem
          }
        }
      }
    }
    public deepIncludes(children: any, item: any): boolean {
      if (this.$u.is.empty(children)) return false
      if (this.$u.includes(children, item)) return true
      return this.$u.as.array(children).some((p) => {
        const subChildren = this.$u.get(p, 'children')
        return this.deepIncludes(subChildren, item)
      })
    }
    public findNode(tree: any, fn: Function): any {
      for (let item of this.$u.as.array(tree)) {
        if (fn(item)) {
          return item
        }
        var found = this.findNode(item.children, fn)
        if (found) return found
      }
    }
    public getNodePath(tree: any, fn: Function): any[] {
      return Array.from(this.getNodePathGenerator(tree, fn, null))
    }
    public filter(tree: any, fn: Function): any[] {
      return Array.from(this.filterGenerator(tree, fn))
    }
    public toNodeMap(tree: any) {
      const result = new Map()
      tree = this.$u.as.array(tree)
      for (let item of this.nodeGenerator(tree, null)) {
        result.set(this.$u.as.id(item.node), item)
      }
      return result
    }
    public getNodes(tree: any) {
      const result = Array.from(this.nodeGenerator(tree, null))
      return result
    }
  }

