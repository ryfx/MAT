
import Vector   from 'flo-vector2d';

import Circle   from './circle';
import Geometry from '../geometry';


class Arc {
    circle:     Circle; 
    sinAngle1:  number; 
    cosAngle1:  number; 
    sinAngle2:  number; 
    cosAngle2:  number;
    startpoint: number[]; 
    endpoint:   number[];

    /** 
     * Arc class.
     * If circle === null then the arc degenerates into a line segment 
     * given by sinAngle1 and cosAngle2 which now represent points.
     * The arc curve is always defined as the piece from angle1 -> angle2.
     * Note: startpoint and endpoint is redundant 
     */
    constructor(
            circle: Circle, 
		    sinAngle1: number, cosAngle1: number, 
		    sinAngle2: number, cosAngle2: number,
		    startpoint: number[], endpoint: number[]) {
	
        // Intrinsic
        this.circle = circle;
        this.sinAngle1 = sinAngle1;
        this.sinAngle2 = sinAngle2;
        this.cosAngle1 = cosAngle1;
        this.cosAngle2 = cosAngle2;
        
        // Cache
        this.startpoint = startpoint; // Redundant but useful
        this.endpoint   = endpoint;	  // Redundant but useful
    }


    /** 
     * Returns the closest point on the arc.
     * NOTE: Not currently used. 
     * @private
     */
    static closestPointOnArc(p: number[], arc: Arc) {
        if (arc.circle !== null) { // else the arc is degenerate into a line
            // First move arc circle onto origin
            let x = arc.circle.center[0];
            let y = arc.circle.center[1];
            
            let translate = Vector.translate([-x,-y]);

            let arco = new Arc(
                new Circle([0,0], arc.circle.radius), 
                arc.sinAngle1, 
                arc.cosAngle1, 
                arc.sinAngle2, 
                arc.cosAngle2,
                translate(arc.startpoint), 
                translate(arc.endpoint)                
            );
            
            let pp = translate(p);
            let l = Vector.len(pp);
            let sin_pp = -pp[1] / l; 			
            let cos_pp = pp[0] / l;
            
            if (Geometry.isAngleBetween(
                    sin_pp, cos_pp, 
                    arco.sinAngle1, arco.cosAngle1, 
                    arco.sinAngle2, arco.cosAngle2)) {
                let r_o_l = arco.circle.radius;
                let res = { p: Vector.translate([x,y], [r_o_l * cos_pp, r_o_l * -sin_pp]), position: 0 };
                
                return res;
            } else {
                let asp = arc.startpoint;
                let aep = arc.endpoint;
                
                let d1 = Vector.distanceBetween(asp, p);
                let d2 = Vector.distanceBetween(aep, p);
                
                if (d1 < d2) { return { p: asp, position: 1 }; }
                
                return { p: aep, position: 2 };
            }
        }
        
        // Line degenerate case - this is exactly a routine for 
        // distance (and closest point) between point and line segment.
        let asp = arc.startpoint;
        let aep = arc.endpoint;

        let d1 = Vector.distanceBetween(asp, p);
        let d2 = Vector.distanceBetween(aep, p);
        let ds = Math.sqrt(Vector.squaredDistanceBetweenPointAndLineSegment(p, [asp, aep]));
        
        if (d1 <= d2 && d1 <= ds) { 
            return { p: asp, position: 1 }; 
        } else if (d2 <= d1 && d2 <= ds) { 
            return { p: aep, position: 2 }; 
        }
        
        // else ds is shortest
        let v = Vector.fromTo(asp,aep);
        
        
        let l1p2 = [p[0] + v[1], p[1] + -v[0]];
        let res = { 
            p: Geometry.lineLineIntersection([p, l1p2], [asp, aep]), 
            position: 0, 
        };

        return res; 
    }
}
	
export default Arc;
