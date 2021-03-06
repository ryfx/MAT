"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Representation of a linked loop vertex (i.e. node) having various edges, two
 * of which enforce an ordering on the nodes, i.e. 'prev' and 'next'.
 * @param loop - The linked loop this node belongs to.
 * @param item - The actual item stored at a node.
 * @param prev - The previous item.
 * @param next - The next item.
 */
class ListNode {
    constructor(loop, item, prev, next) {
        // TODO - we should really subclass linked-loop and/or list-node as the 
        // below only applies to the segregated shape pieces
        this.prevOnCircle = undefined;
        this.nextOnCircle = undefined;
        this.loop = loop;
        this.item = item;
        this.prev = prev;
        this.next = next;
    }
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */
    static advanceNSteps(node, n) {
        for (let i = 0; i < n; i++) {
            node = node.next;
        }
        return node;
    }
}
exports.default = ListNode;
