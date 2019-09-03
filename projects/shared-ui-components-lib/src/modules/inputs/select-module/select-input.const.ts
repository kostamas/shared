import {SelectRegularOptionsComponent} from './options/select-regular-options/select-regular-options.component';
import {MultiSelectColorfulOptionsComponent} from './options/multi-select-colorful-options/multi-select-colorful-options.component';
import {ISelectOptionsComponentsTypes} from '../../../types/ISelect';

export const OPTIONS_TYPES: ISelectOptionsComponentsTypes = {
	regular: 'regular',
	multiSelection: 'multiSelection'
}

export const OPTIONS_TYPES_COMPONENTS = {
	[OPTIONS_TYPES.regular]: SelectRegularOptionsComponent,
	[OPTIONS_TYPES.multiSelection]: MultiSelectColorfulOptionsComponent
}