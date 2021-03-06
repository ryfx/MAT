
import Vector        from 'flo-vector2d';
import Bezier3       from 'flo-bezier3';

import MAT_CONSTANTS from '../../mat-constants';
import Circle        from '../../geometry/classes/circle';
import PointOnShape  from '../../geometry/classes/point-on-shape';
import ListNode      from '../../linked-list/list-node';
import PathCurve     from '../classes/path-curve';
import Corner        from '../classes/corner';

// Angle in degrees
const DEGREES = {
		'0'    : 0.0000,
		'0.25' : 0.0050,
		'1'    : 0.0167,
		'4'    : 0.0698,
		'15'   : 0.2588,
		'16'   : 0.2756,
};

const CROSS_TANGENT_LIMIT = DEGREES[0.25]; 


/** 
 * Get the circles at the bezier-bezier interface points with circle
 * curvature coinciding with the bezier curvature at those points. 
 * 
 * @param bezierNodes - The two bezier nodes.
 **/
// TODO dullCornerHash should not be modified inside the function
function getContactCirclesAtBezierBezierInterface(
        bezierNodes: ListNode<PathCurve>[], 
        dullCornerHash: { [index:string]: Corner }): PointOnShape[] {
	
	const ts = [1,0];
	
	let beziers = [0,1].map((i: number) => bezierNodes[i].item.bezier3 );
	let tans    = [0,1].map((i: number) => Bezier3.tangent(beziers[i], ts[i]));  

	let crossTangents = +Vector.cross(tans[0], tans[1]);
	let negDot        = -Vector.dot  (tans[0], tans[1]);
	
	// The if below is important. Due to floating point approximation
	// it sometimes happen that crossTangents !== 0 but
	// negDot === -1. Remove the if and see what happens. :)
	if (crossTangents === 0 || negDot === -1) {
		// Too close to call 
		return [];
	}
	
	let p = beziers[0][3];
	
	
	if (crossTangents < -CROSS_TANGENT_LIMIT) {  
		// Sharp corner
		let pos = new PointOnShape(
			bezierNodes[0], 
			1, 
			MAT_CONSTANTS.pointType.sharp, 
			0,
			0
		); 

		return [pos];
	} 
	
	
	if (crossTangents > 0) {
		let key = PointOnShape.makeSimpleKey(p);
		dullCornerHash[key] = new Corner(beziers, tans);
	}
	
	if (crossTangents <= CROSS_TANGENT_LIMIT) {
		// The interface is too straight, but put a point close-by.
		// TODO - this point may be order wrong in the end causing 
		// disaster. Fix.
		let pos = new PointOnShape(
				bezierNodes[0], 
				0.9, 
				MAT_CONSTANTS.pointType.standard, 
				0,
				0
			);
		
		return [pos];
	}
	

	//---- Dull corner
	let pointsOnShape = [];
	
	let orders = [-1, negDot];
	for (let i=0; i<2; i++) {
		let pos = new PointOnShape(
			bezierNodes[i], 
			ts[i], 
			MAT_CONSTANTS.pointType.dull, 
			orders[i],
			0
		);
		
		pointsOnShape.push(pos);	
	}
	
	return pointsOnShape;
}


export default getContactCirclesAtBezierBezierInterface;
