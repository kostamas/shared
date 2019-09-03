import {
	Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {ISelectItem} from '../../../../../types/ISelect';
import {SelectInputService} from '../../select-input.service';

@Component({
	selector: 'app-select-regular-options',
	templateUrl: './select-regular-options.component.html',
	styleUrls: ['./select-regular-options.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SelectRegularOptionsComponent implements OnInit, OnDestroy {
	public selectList: ISelectItem[];
	private stringToSearch: string = '';
	private suggestedIndex: number = -1;
	private timeout: NodeJS.Timer = null;
	private optionHeight: number = 39;

	@Input('data') data: any;

	@ViewChild('optionsWrapper') optionsWrapper: ElementRef;

	constructor(private selectInputService: SelectInputService) {
	}

	ngOnInit(): void {
		this.selectList = this.data ? this.data.selectList : [];
		const optionElement = this.optionsWrapper && this.optionsWrapper.nativeElement.firstElementChild;
		this.optionHeight = optionElement && optionElement.clientHeight || this.optionHeight;
		if (this.data && this.data.withEmptyOption && !this.selectInputService.isContains(this.selectList, null, null)) {
			this.selectList.unshift({id: null, name: ''});
		}
	}


	@HostListener('document:keyup', ['$event'])
	keyUpHandler(keyEvent: KeyboardEvent): void {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(this.clearStringSuggestion, 1000);
		const key = keyEvent.key;

		switch (key.toUpperCase()) {
			case 'ENTER':
				if (this.suggestedIndex > -1) {
					this.selectValue(String(this.suggestedIndex));
				}
				break;
			case 'ARROWDOWN':
				this.nextIndex();
				break;
			case 'ARROWUP':
				this.previousIndex();
				break;
			case 'ARROWLEFT':
				break;
			case 'ARROWRIGHT':
				break;
			case 'ESCAPE':
				break;
			case 'PAGEUP':
				break;
			case 'PAGEDOWN':
				break;
			case 'HOME':
				this.firstIndex();
				break;
			case 'END':
				this.endIndex();
				break;
			default:
				this.stringToSearch += key;
				this.suggestedIndex = this.suggestItemIndex(this.stringToSearch);
				if (this.suggestedIndex > -1) {
					this.data.syncScrollBar(this.suggestedIndex, this.selectList, this.optionHeight);
				}
		}
	}

	nextIndex(): void {
		if (this.suggestedIndex + 1 !== this.data.selectList.length) {
			this.suggestedIndex++;
			this.clearStringSuggestion();
			this.data.syncScrollBar(this.suggestedIndex, this.selectList, this.optionHeight);
		}
	}

	firstIndex(): void {
		this.suggestedIndex = 0;
		this.clearStringSuggestion();
		this.data.syncScrollBar(this.suggestedIndex, this.selectList, this.optionHeight);
	}

	endIndex(): void {
		this.suggestedIndex = this.data.selectList.length - 1;
		this.clearStringSuggestion();
		this.data.syncScrollBar(this.suggestedIndex, this.selectList, this.optionHeight);
	}

	previousIndex(): void {
		if (this.suggestedIndex - 1 > -1) {
			this.suggestedIndex--;
			this.clearStringSuggestion();
			this.data.syncScrollBar(this.suggestedIndex, this.selectList, this.optionHeight);
		}
	}

	selectValue(index: string): void {
		this.selectInputService.resetOptionsList(this.selectList);
		this.selectList[index].isSelected = true;
		this.data.onSelectItem(index, this.selectList[index].id, true);
	}

	suggestItemIndex(str: string): number {
		const regex = new RegExp(`^${str}`, 'i');
		const relevantItems = this.selectList.reduce((accumulator, item, index) => {
			if (regex.test(String(item.name))) {
				return [...accumulator, {index: index, item: item}];
			} else {
				return accumulator;
			}
		}, []);

		if (relevantItems.length) {
			const nextSuggestions: any = relevantItems.filter(itemWithIndex => itemWithIndex.index > this.suggestedIndex);
			return nextSuggestions.length ? nextSuggestions[0].index : relevantItems[0].index;
		} else {
			return -1;
		}
	}

	clearStringSuggestion = () => {
		this.stringToSearch = '';
		this.timeout = null;
	}

	ngOnDestroy(): void {
		if (this.data && this.data.withEmptyOption && this.selectList[0].id === null) {
			this.data.selectList.shift();
		}

		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	}
}
