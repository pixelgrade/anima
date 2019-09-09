// checks if box1 and box2 overlap
export function overlapping( box1, box2 ) {
	const overlappingX = box1.x + box1.width >= box2.x && box2.x + box2.width >= box1.x;
	const overlappingY = box1.y + box1.height >= box2.y && box2.y + box2.height >= box1.y;
	return overlappingX && overlappingY;
}

// chechks if box1 is completely inside box2
export function inside( box1, box2 ) {
	const insideX = box1.x >= box2.x && box1.x + box1.width <= box2.x + box2.width;
	const insideY = box1.y >= box2.y && box1.y + box1.height <= box2.y + box2.height;
	return insideX && insideY;
}

// chechks if box1 is completely inside box2
export function insideHalf( box1, box2 ) {
	const insideX = box1.x + box1.width / 2 >= box2.x && box2.x + box2.width >= box1.x + box1.width / 2;
	const insideY = box1.y + box1.height / 2 >= box2.y && box2.y + box2.height >= box1.y + box1.height / 2;
	return insideX && insideY;
}