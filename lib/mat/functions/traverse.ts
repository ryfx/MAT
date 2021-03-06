
import PointOnShape from '../../geometry/classes/point-on-shape';
import MatTree      from  '../classes/mat-tree';
import MatNode      from  '../classes/mat-node';

/**
 * Traverses the MAT tree and calls a function on each node. This
 * function must have side effects to be useful.
 * 
 * @param mat
 */
function traverse(
        mat: MatTree, 
        f: (matNode: MatNode, priorNode: MatNode) => void) {
	
	g(mat.startNode);
	
	function g(matNode: MatNode, priorNode?: MatNode) {
		f(matNode, priorNode);
		
		//for (let node of matNode.branches) {
		for (let i=0; i<matNode.branches.length; i++) {
			let node = matNode.branches[i];
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}
			
			g(node, matNode);
		}			
	}
}


export default traverse;