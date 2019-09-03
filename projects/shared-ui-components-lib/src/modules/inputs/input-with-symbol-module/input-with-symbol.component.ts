import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {OneContractService} from '../../../../components/one-contract/one-contract.service';
import {isRangeValue, preventPasteValue} from '../input-utils';

@Component({
	selector: 'app-input-with-symbol',
	templateUrl: './input-with-symbol.component.html',
	styleUrls: ['./input-with-symbol.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class InputWithSymbolComponent {
	public isRangeValue: any = isRangeValue;
	public preventPasteValue: any = preventPasteValue;

	@Input() svg: string;
	@Input() inputValue: string;
	@Input() symbol: string = null;
	@Input() isFloat: boolean = false;
	@Input() hideSymbol: boolean = false;
	@Input() isRequired: boolean = false;
	@Input() isDisabled: boolean = false;
	@Input() valueMaxRange: number = null;
	@Input() valueMinRange: number = null;
	@Input() tabIndex: number;

	@Output() inputValueChange: EventEmitter<string> = new EventEmitter();

	constructor(public oneContractService: OneContractService) {
	}

	ngModelChange(): void {
		this.inputValueChange.next(this.inputValue);
	}
}
