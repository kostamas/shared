import {NEW_DISTRIBUTION_RULES_ID, NEW_SEARCH_SIMULATOR_ID} from '../main-header.const';
import {distributionRulesLevel4, searchSimulatorLevel4} from './level4';

export const searchSimulatorLevel3 = {
	name: 'Availability',
	id: NEW_SEARCH_SIMULATOR_ID,
	menus: [
		searchSimulatorLevel4
	]
};

export const distributionRulesLevel3 = {
	name: 'Distribution Business',
	id: NEW_DISTRIBUTION_RULES_ID,
	menus: [
		distributionRulesLevel4
	]
};
