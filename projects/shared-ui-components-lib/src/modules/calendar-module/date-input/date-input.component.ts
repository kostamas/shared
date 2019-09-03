import {
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input, OnChanges,
	OnInit,
	Output, SimpleChanges,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {ISvgIcons, SVG_ICONS} from '../../svg-icon-module/svg-icons.const';
import {CalendarDatePickerService} from '../calendarDatePicker/calendarDatePicker.service';
import * as momentNs from 'moment';
const moment = momentNs;
import {IValidationStatus} from '../../../types/ISelect';
import {Subject} from 'rxjs';
import {DATE_FORMAT} from '../../../constants/shared.constant';

@Component({
	selector: 'app-date-input',
	templateUrl: './date-input.component.html',
	styleUrls: ['./date-input.component.scss'],
	providers: [CalendarDatePickerService],
	encapsulation: ViewEncapsulation.None
})
export class DateInputComponent implements OnInit, OnChanges {
	public SVG_ICONS: ISvgIcons = SVG_ICONS;
	public validationStatus: IValidationStatus = {isValid: true};
	public selectedRangeText: string = '';

	@Input('dateFormat') dateFormat: string;
	@Input('selectedDate') selectedDate: any = ''; // todo - add selected range
	@Input('selectedDateArr') selectedDateArr: string[];
	@Input('withoutDefaultDate') withoutDefaultDate: boolean = false;
	@Input('multiDatePicker') multiDatePicker: boolean = false;
	@Input('calendarDate') calendarDate: string = '';
	@Input('isOpen') isOpen: boolean = false;
	@Input('validationStatus$') validationStatus$: Subject<IValidationStatus>;

	@ViewChild('dateInputElement') dateInputElement: ElementRef;
	@ViewChild('calendarWrapperElement') calendarWrapperElement: ElementRef;

	@Output('dateSelected') dateSelected: EventEmitter<string> = new EventEmitter<string>();
	@Output('rangeSelected') rangeSelected: EventEmitter<any> = new EventEmitter<any>();
	@Output('dateDeleted') dateDeleted: EventEmitter<any> = new EventEmitter<any>();
	@Output('isOpenChanged') isOpenChanged: EventEmitter<any> = new EventEmitter<any>();

	constructor(private calendarDatePickerService: CalendarDatePickerService) {
	}

	ngOnInit(): void {
		if (!this.selectedDate && !this.withoutDefaultDate) {
			this.selectedDate = moment().format(this.dateFormat ? this.dateFormat : DATE_FORMAT);
		}
		if (this.multiDatePicker) {
			if (this.selectedDate && this.selectedDate.from && this.selectedDate.to) {
				this.selectedRangeText = moment(this.selectedDate.from, DATE_FORMAT).format(DATE_FORMAT) + ' - ' + moment(this.selectedDate.to).format(DATE_FORMAT);
			}
		}

		if (this.validationStatus$) {
			this.validationStatus$.subscribe(validationStatus => this.validationStatus = validationStatus);
		}

		this.isOpenChanged.next(this.isOpen);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.selectedDate && changes.selectedDate.currentValue && !changes.selectedDate.firstChange) {
			const selectedDate = changes.selectedDate.currentValue;
			if (this.multiDatePicker) {
				if (this.selectedDate.from && this.selectedDate.to) {
					this.selectedRangeText = moment(selectedDate.from, DATE_FORMAT).format(DATE_FORMAT) + ' - ' + moment(selectedDate.to).format(DATE_FORMAT);
				}
			}
		}
	}

	@HostListener('window:click', ['$event'])
	documentClickHandler = (event: any) => {
		const {dateInputElement} = this;
		if (!dateInputElement.nativeElement.contains(event.target) && !this.calendarWrapperElement.nativeElement.contains(event.target)) {
			this.isOpen = false;
			this.isOpenChanged.next(this.isOpen);
		}
	}

	openDatePicker(): void {
		this.isOpen = true;
		this.isOpenChanged.next(this.isOpen);
		if (this.selectedDate) {
			this.calendarDatePickerService.selectDate$.next(moment(this.selectedDate, DATE_FORMAT));
		}
	}

	onSelectDate(date: string): void {
		this.selectedDate = moment(date, DATE_FORMAT).format(this.dateFormat ? this.dateFormat : DATE_FORMAT);
		this.dateSelected.next(this.selectedDate);
		this.isOpen = false;
		this.isOpenChanged.next(this.isOpen);
	}

	onSelectRange(range: any): void {
		this.rangeSelected.next(range);
		this.isOpen = false;
		this.isOpenChanged.next(this.isOpen);
		this.selectedRangeText = moment(range.from, DATE_FORMAT).format(DATE_FORMAT) + ' - ' + moment(range.to).format(DATE_FORMAT);
	}

	deleteDate(dateToDelete: string, index: number): void {
		this.dateDeleted.next({deletedDate: dateToDelete, index});
		this.selectedDateArr.splice(index, 1);
	}

	selectedDateClickHandler($event: MouseEvent): void {
		$event.stopPropagation();
	}
}
