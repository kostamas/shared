export const deepCopy = (obj) => {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	} else if (Array.isArray(obj)) {
		const clonedArr = [];
		obj.forEach((element) => {
			clonedArr.push(deepCopy(element));
		});
		return clonedArr;
	} else {
		const clonedObj = {};
		for (const prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				clonedObj[prop] = deepCopy(obj[prop]);
			}
		}
		return clonedObj;
	}
};


export const convertDataInObject = (obj, conditionMethod, actionMethod) => {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	} else if (Array.isArray(obj)) {
		obj.forEach(o => {
			o = convertDataInObject(o, conditionMethod, actionMethod);
		});
	} else {
		Object.keys(obj).forEach(o => {
			if ((typeof o !== 'object' || o === null) && conditionMethod(obj, o)) {
				actionMethod(obj, o);
			} else {
				obj[o] = convertDataInObject(obj[o], conditionMethod, actionMethod);
			}
		});
	}
	return obj;
};

export const fastDeepCopy = (src) => {
	return JSON.parse(JSON.stringify(src));
};

export const deepObjectComparision = (o, p) => {
	let i;
	const keysO = Object.keys(o).sort();
	const keysP = Object.keys(p).sort();

	if (keysO.length !== keysP.length) {
		return false; // not the same nr of keys
	}
	if (keysO.join('') !== keysP.join('')) {
		return false; // different keys
	}
	for (i = 0; i < keysO.length; ++i) {
		if (o[keysO[i]] instanceof Array) {
			if (!(p[keysO[i]] instanceof Array)) {
				return false;
			}
			if (p[keysO[i]].sort().join('') !== o[keysO[i]].sort().join('')) {
				return false;
			}
		} else if (o[keysO[i]] instanceof Date) {
			if (!(p[keysO[i]] instanceof Date)) {
				return false;
			}
			if (('' + o[keysO[i]]) !== ('' + p[keysO[i]])) {
				return false;
			}
		} else if (o[keysO[i]] instanceof Function) {
			if (!(p[keysO[i]] instanceof Function)) {
				return false;
			}
		} else if (o[keysO[i]] instanceof Object) {
			if (!(p[keysO[i]] instanceof Object)) {
				return false;
			}
			if (o[keysO[i]] === o) { // self reference?
				if (p[keysO[i]] !== p) {
					return false;
				}
			} else if (deepObjectComparision(o[keysO[i]], p[keysO[i]]) === false) {
				return false; // WARNING: does not deal with circular refs other than ^^
			}
		} else if (o[keysO[i]] !== p[keysO[i]]) { // change !== to != for loose comparison
			return false; // not the same value
		}
	}
	return true;
};

export const isEmpty = (arrayOrObject) => {
	if (Array.isArray(arrayOrObject)) {
		return arrayOrObject.length === 0;
	} else {
		return !arrayOrObject || Object.keys(arrayOrObject).length === 0;
	}
};

export const generateId = () => {
	return 'id-' + Math.random().toString(36).substr(2, 16);
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const arrayToObject = (array, id, withCollisions) =>
	array.reduce((obj, item) => {
		if (withCollisions) {
			if (!obj[item[id]]) {
				obj[item[id]] = [item];
			} else {
				obj[item[id]].push(item);
			}
		} else {
			obj[item[id]] = item;
		}
		return obj;
	}, {});

export const isDefined = (parameter) => typeof parameter !== 'undefined';

export const isDefineAndNotNull = (value) => {
	return isDefined(value) && value !== null;
};

export const undefinedToTrue = (value) => {
	return (isDefined(value) && value !== null) ? value : true;
};

export const undefinedToFalse = (value) => {
	return (isDefined(value) && value !== null) ? value : false;
};

export const undefinedAndNullToEmptyString = (value) => {
	return (isDefined(value) && value !== null) ? value : '';
};

export const getKeyByValue = (obj, value) => {
	const keys = Object.keys(obj);
	const length = keys.length;
	for (let i = 0; i < length; i++) {
		if (obj[keys[i]] === value) {
			return keys[i];
		}
	}
};

export const sortByNames = (n1, n2, desc) => {
	let result = 0;
	if (desc) {
		if (n1 > n2) {
			result = -1;
		}
		if (n1 < n2) {
			result = 1;
		}
	} else {
		if (n1 < n2) {
			result = -1;
		}
		if (n1 > n2) {
			result = 1;
		}
	}
	return result;
};

export const sortByIds = (n1, n2, desc) => {
	let result = 0;
	if (desc) {
		if (+n1 > +n2) {
			result = -1;
		}
		if (+n1 < +n2) {
			result = 1;
		}
	} else {
		if (+n1 < +n2) {
			result = -1;
		}
		if (+n1 > +n2) {
			result = 1;
		}
	}
	return result;
}

export const numberToLatter = (number, uppercase) => {
	return uppercase ? (number + 9).toString(36).toUpperCase() : (number + 9).toString(36);
};

export const letterToNumber = (letter) => {
	return letter.toLowerCase().charCodeAt(0) - 97;
};

export const setElementStyle = (element, styleProps) => {
	for (var prop in styleProps) {
		if (styleProps.hasOwnProperty(prop)) {
			element.style[prop] = styleProps[prop];
		}
	}
};

export const copyToClipboard = (value) => {
	const element = document.createElement('textarea');

	setElementStyle(element, {
		position: 'fixed',
		width: '0px',
		height: '0px',
		left: '-200px',
		top: '-200px'
	});

	element.value = value;

	document.body.appendChild(element);
	element.select();
	document.execCommand('Copy');

	setTimeout(() => document.body.removeChild(element));
};

