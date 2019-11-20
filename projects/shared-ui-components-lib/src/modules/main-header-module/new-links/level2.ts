import {NEW_DISTRIBUTION_RULES_ID} from '../../../constants/main-header.constant';
import {distributionRulesLevel3, searchSimulatorLevel3} from './level3';

export const distributionRulesLevel2 = {
	name: 'Distribution',
	id: NEW_DISTRIBUTION_RULES_ID,
	menus: [
		searchSimulatorLevel3,
		distributionRulesLevel3
	]
};
