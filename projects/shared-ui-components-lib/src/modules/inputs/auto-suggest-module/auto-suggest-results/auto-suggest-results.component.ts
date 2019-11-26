import {
	Component, ElementRef, HostListener, Input, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {SVG_ICONS} from '../../../svg-icon-module/svg-icons.const';

@Component({
	selector: 'app-auto-suggest-results',
	templateUrl: './auto-suggest-results.component.html',
	styleUrls: ['./auto-suggest-results.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AutoSuggestResultsComponent implements OnInit {
	public selectedIndex: number = -1;
	public selectedValue: string = '';
	public SVG_ICONS: any = SVG_ICONS;
	private resultHeight: number = 39;

	private isHovered: boolean = false;

	@Input('data') data: any;

	@ViewChild('resultsWrapper') resultsWrapper: ElementRef;
	@ViewChild('closeIcon') closeIcon: ElementRef;

	constructor() {
	}

	ngOnInit(): void {
		const resultElement = this.resultsWrapper && this.resultsWrapper.nativeElement.firstElementChild;
		this.resultHeight = resultElement && resultElement.clientHeight || this.resultHeight;
	}

	nextIndex(): void {
		if (!this.isHovered && this.selectedIndex + 1 !== this.data.results.length) {
			const nextIndex = this.selectedIndex + 1;
			this.setValue(nextIndex, false);
		}
	}

	firstIndex(): void {
		const firstIndex = 0;
		this.setValue(firstIndex, true);
	}

	endIndex(): void {
		const endIndex = this.data.results.length - 1;
		this.setValue(endIndex, false);
	}

	previousIndex(): void {
		if (!this.isHovered && this.selectedIndex - 1 > -1) {
			const previousIndex = this.selectedIndex - 1;
			this.setValue(previousIndex, false);
		}
	}

	isSelected(itemIndex: number): string {
		return itemIndex === this.selectedIndex ? 'selected' : '';
	}

	setValue(index: number, closeReults: boolean): void {
		if (this.data.results.length > 0) {
			this.selectedIndex = index;
			const selected = this.data.results[index];
			this.selectedValue = selected.value;
			this.data.syncScrollBar(index, this.data.results, this.resultHeight);
			this.data.setValue(selected, closeReults);
		}
	}

	selectResultHandler(index: number): any {
		this.setValue(index, true);
	}

	mouseEnterHandler(): any {
		this.selectedIndex = -1;
		this.isHovered = true;
	}

	mouseLeaveHandler(): any {
		this.isHovered = false;
	}

	onCloseIconClick(): any {
		this.data.onCloseIconClick();
	}
}
