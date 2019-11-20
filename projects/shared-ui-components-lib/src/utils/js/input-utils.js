import {isDefineAndNotNull, undefinedAndNullToEmptyString} from './jsUtils';
import {isNumber} from 'util';

export const displayFormatNameAndIdOrEmptyString = (name, id) => {
	let idName = '';
	if (isNumber(id)) {
		idName = isDefineAndNotNull(id) ? ` (${id})` : '';
	} else {
		idName = undefinedAndNullToEmptyString(id) !== '' ? ` (${id})` : '';
	}
	return `${undefinedAndNullToEmptyString(name)}${idName}`;
};

export const multipleNamesOrIdTextHandler = (byId) => (selectedOption, optionsList) => {
	let text = '';
	optionsList.forEach(option => {
		if (option.isSelected && option.id !== 'All') {
			if (text) {
				text += ', ' + (byId ? option.id : option.name);
			} else {
				text = byId ? option.id : option.name;
			}
		}
	});
	return text;
}

export const numberOnly = (event) => {
	const charCode = event.which ? event.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}

export const isRangeValue = (event, minValue, maxValue, isFloat) => {
	const charCode = event.which ? event.which : event.keyCode;
	let result = true;
	if (!numberOnly(event) && charCode === 46 && !isFloat) {
		result = false;
	}
	const cursorPoint = event.srcElement.selectionStart;
	let value;
	if (cursorPoint === 0) { // start of string
		value = event.key + event.srcElement.value;
	} else if (cursorPoint < event.srcElement.value.length) { //middle of string
		value = event.srcElement.value.toString().slice(0, cursorPoint) + event.key.toString() + event.srcElement.value.toString().slice(cursorPoint);
	} else { // end of string
		value = event.srcElement.value + event.key;
	}
	const numValue = isFloat ? parseFloat(value) : Number(value);
	if (value.length > 1 && value.length <= 2 && value.charCodeAt(0) === 48 && charCode !== 46) {
		result = false;
	} else if (charCode === 46 && value.split('.').length - 1 > 1 || value[0] === '.') {
		result = false;
	} else if (isDefineAndNotNull(maxValue) && charCode === 46 && numValue >= maxValue) {
		result = false;
	} else if (charCode !== 46 && !numberOnly(event)) {
		result = false;
	}

	if (numValue === undefined || isNaN(numValue)) {
		result = false;
	}
	if ((isDefineAndNotNull(minValue) && numValue < minValue) || (isDefineAndNotNull(maxValue) && numValue > maxValue)) {
		result = false;
	}
	return result;
}

export const preventPasteValue = () => {
	return false;
}

