import {
	Component,
	ComponentFactoryResolver,
	ElementRef,
	EventEmitter,
	HostListener,
	Injector,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation
} from '@angular/core';
import {ModalService} from '../../../modal-module/modal.service';
import {IModal, IModalConfig} from '../../../../types/modal';
import {ISelectItem, IValidationStatus} from '../../../../types/ISelect';
import {ISvgIcons, SVG_ICONS} from '../../../svg-icon-module/svg-icons.const';
import {Subject} from 'rxjs';
import {isDefined} from '../../../../utils/jsUtils';
import {OPTIONS_TYPES, OPTIONS_TYPES_COMPONENTS} from '../select-input.const';
import {SelectInputService} from '../select-input.service';

@Component({
	selector: 'app-select-input',
	templateUrl: './select-input.component.html',
	styleUrls: ['./select-input.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SelectInputComponent implements OnInit, OnChanges, OnDestroy {
	public modalConfig: IModalConfig;
	public modal: IModal;
	public isOptionsOpen: boolean = false;
	public optionsComponentRef: any = false;
	public SVG_ICONS: ISvgIcons = SVG_ICONS;
	public unsubscribeArr: any[] = [];
	public validationStatus: any = {message: '', isValid: true};
	public isSingleSelection: boolean = false;

	@Input() validationStatus$: Subject<IValidationStatus>;
	@Input() setTextManually$: Subject<string>;
	@Input() inputTextHandler: (p: any, list: any[]) => any;
	@Input() dataTransformation: (p: any) => any;
	@Input() validators: ((x?: any) => any)[];
	@Input() optionsComponent: any;
	@Input() selectList: any[];
	@Input() optionsClass: string | string[];
	@Input() componentInputs: any = {};
	@Input() calcOptionsModalPosition: any;
	@Input() isDisabled: boolean = false;
	@Input() openOptionsInModal: boolean = false;
	@Input() optionsType: string = OPTIONS_TYPES.regular;
	@Input() tabIndex: number;

	@Output('onSelectItem') onSelectItem: EventEmitter<ISelectItem> = new EventEmitter();
	@Output('onListChange') onListChange: EventEmitter<ISelectItem[]> = new EventEmitter();
	@Output('optionsClosed') optionsClosed: EventEmitter<any> = new EventEmitter();

	@ViewChild('optionsContainer', {read: ViewContainerRef}) optionsContainer: ViewContainerRef;
	@ViewChild('optionsWrapperElement') optionsWrapperElement: ElementRef;
	@ViewChild('optionsElement') optionsElement: ElementRef;
	@ViewChild('selectInput') selectInput: ElementRef;
	@ViewChild('title') title: ElementRef;

	constructor(public modalService: ModalService, private zone: NgZone, private injector: Injector,
	            private componentFactoryResolver: ComponentFactoryResolver,
	            private selectInputService: SelectInputService) {
	}

	ngOnInit(): void {
		this.initSelectList(this.selectList);

		if (this.dataTransformation) {
			this.dataTransformation(this.selectList);
		}

		this.initText(this.selectList);

		this.initValidators();

		if (this.validationStatus$) {
			this.unsubscribeArr.push(this.validationStatus$.subscribe(validationStatus => this.validationStatus = validationStatus));
		}

		this.zone.runOutsideAngular(() => window.addEventListener('resize', this.resizeHandler.bind(this)));

		if (this.setTextManually$) {
			this.unsubscribeArr.push(this.setTextManually$.subscribe(text => this.setValue(text)));
		}

		if (!this.optionsComponent) {
			this.optionsComponent = OPTIONS_TYPES_COMPONENTS[this.optionsType];
		}

		if (this.optionsClass) {
			this.optionsClass = Array.isArray(this.optionsClass) ? this.optionsClass : [this.optionsClass];
		}

		this.isSingleSelection = isDefined(this.componentInputs.isSingleSelecton) ? this.componentInputs.isSingleSelection : false;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes && changes.selectList && !changes.selectList.firstChange) {
			if (this.dataTransformation) {
				this.dataTransformation(this.selectList);
			}
			this.initSelectList(changes.selectList.currentValue);
			this.initText(changes.selectList.currentValue);
		}
	}

	@HostListener('window:resize')
	initializeLeftPane(): void {
		this.resizeHandler();
	}

	initText(selectList: ISelectItem[]): void {
		let text = '';
		if (this.inputTextHandler) {
			const selectedOption = selectList.filter(option => option.isSelected)[0];
			text = this.inputTextHandler(selectedOption, this.selectList);
		} else {
			this.selectList.forEach(option => option.isSelected ? text = option.name : '');
		}
		this.setValue(text);
	}

	initSelectList(selectList: any): void {
		if (typeof selectList[0] === 'string' || typeof selectList[0] === 'number') {
			const newSelectList = [];
			selectList.forEach(item => newSelectList.push({name: item, id: item, isSelected: false}));
			this.selectList = newSelectList;
			this.selectList[0].isSelected = true;
		}
	}

	initValidators(): void {
		this.validationStatus = {message: '', isValid: true};
		if (this.validators) {
			if (!Array.isArray(this.validators)) {
				this.validators = <((x?: any) => any)[]>[this.validators];
			}
		}
	}

	resizeHandler(): void {
		if (this.openOptionsInModal && this.modal && this.modalService.isModalOpen(this.modal.id)) {
			this.modal.closeModal(true);
		}
	}

	selectInputClickHandler(): void {
		if (this.isOptionsOpen || this.isDisabled) {
			return;
		}
		setTimeout(() => {  // catch page click first.
			if (!this.isOptionsOpen) {
				this.isOptionsOpen = true;
				this.openOptions();
			}
		});
	}

	openOptions(): void {
		const data: any = this.buildOptionsData();
		Object.keys(this.componentInputs).forEach(inputKey => data[inputKey] = this.componentInputs[inputKey]);
		data.isSingleSelection = this.isSingleSelection; // todo: find & fix, move to componentInputs.
		data.syncScrollBar = this.syncScrollBar.bind(this);
		if (data.validationStatus$) {
			this.unsubscribeArr.push(data.validationStatus$.subscribe(r => this.validationStatus = r));
		}

		if (this.openOptionsInModal) {
			const {x, y, width, left, top} = this.selectInput.nativeElement.getBoundingClientRect();
			let position = {x: x || left, y: (y || top) + 35};
			if (this.calcOptionsModalPosition) {
				position = this.calcOptionsModalPosition(x || left, y || top);
			}
			this.modalConfig = {
				modalClass: this.optionsClass ? ['select-options-modal', ...<string[]>this.optionsClass] : 'select-options-modal',
				position,
				style: {width: `${width - 2}px`},
				closeModalCallback: () => {
					this.modal = null;
					this.isOptionsOpen = false;
				}
			};
			this.modal = this.modalService.open(this.optionsComponent, this.modalConfig, data);
		} else {
			this.optionsComponentRef = this.componentFactoryResolver
				.resolveComponentFactory(this.optionsComponent)
				.create(this.injector);

			this.optionsComponentRef.instance.data = data;
			this.optionsContainer.insert(this.optionsComponentRef.hostView);
			this.optionsComponentRef.changeDetectorRef.detectChanges();
		}
		setTimeout(this.calcOptionsPosition);
	}

	calcOptionsPosition = () => {
		if (this.openOptionsInModal) {
			this.calcPositionOptionsModal();
		} else {
			this.calcPositionOptionsInternal();
		}
	};

	calcPositionOptionsInternal(): void {
		const optionsWrapperElement = this.optionsWrapperElement.nativeElement;
		const inputClientRect = this.selectInput.nativeElement.getBoundingClientRect();
		const optionsElementClientRec = optionsWrapperElement.getBoundingClientRect();
		const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		const inputY = inputClientRect.y || inputClientRect.top;

		if (viewportHeight - (inputY + optionsElementClientRec.height) < 40) {
			if (viewportHeight - inputY > 100 || inputY < 200) {
				optionsWrapperElement.style['overflow-y'] = 'auto';
				if ((viewportHeight - inputY) < 200) {
					optionsWrapperElement.style['max-height'] = `${Math.min(inputY - 60, 230)}px`;
					setTimeout(() => {
						const newOptionsElementClientRec = optionsWrapperElement.getBoundingClientRect();
						optionsWrapperElement.style['top'] = (-newOptionsElementClientRec.height - 1) + 'px';
						optionsWrapperElement.style.opacity = '1';
					});
				} else {
					optionsWrapperElement.style['max-height'] = `${Math.min((viewportHeight - inputY) - 60, 230)}px`;
					optionsWrapperElement.style.opacity = '1';
				}
			} else {
				optionsWrapperElement.style['top'] = (inputY - optionsElementClientRec.height) + 'px';
				optionsWrapperElement.style.opacity = '1';
			}
		} else {
			optionsWrapperElement.style.opacity = '1';
		}
	}

	calcPositionOptionsModal = () => {
		const optionsElement = this.modal.componentWrapper;
		const inputClientRect = this.selectInput.nativeElement.getBoundingClientRect();
		const optionsElementClientRec = optionsElement.getBoundingClientRect();

		const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		const inputY = inputClientRect.y || inputClientRect.top;

		if (viewportHeight - (inputY + optionsElementClientRec.height) < 40) {
			if (viewportHeight - inputY > 100 || inputY < 200) {
				optionsElement.style['overflow-y'] = 'auto';
				if ((viewportHeight - inputY) < 200) {
					optionsElement.style['max-height'] = `${Math.min(inputY - 60, 230)}px`;
					setTimeout(() => {
						const newOptionsElementClientRec = optionsElement.getBoundingClientRect();
						optionsElement.style['top'] = (inputY - newOptionsElementClientRec.height) + 'px';
						optionsElement.style.opacity = '1';
						this.modal.modalContainer.style.overflow = 'visible';
					});
				} else {
					optionsElement.style['max-height'] = `${Math.min((viewportHeight - inputY) - 60, 230)}px`;
					optionsElement.style.opacity = '1';
					this.modal.modalContainer.style.overflow = 'visible';
				}
			} else {
				optionsElement.style['top'] = (inputY - optionsElementClientRec.height) + 'px';
				optionsElement.style.opacity = '1';
				this.modal.modalContainer.style.overflow = 'visible';
			}
		} else {
			optionsElement.style.opacity = '1';
			this.modal.modalContainer.style.overflow = 'visible';
		}
	};

	blurHandler(): void {
		if (!this.openOptionsInModal) {
			setTimeout(() => this.closeOptions(), 100);
		}
	}


	closeOptions(): void {
		if (this.isOptionsOpen) {
			this.isOptionsOpen = false;
			this.openOptionsInModal ? this.modal.closeModal(true) : this.destroyOptionsComponent();
			this.optionsClosed.emit(null);
			const selectedItem = <ISelectItem>this.selectInputService.getSelectedItem(this.selectList);
			this.validate(selectedItem);
			this.selectInput.nativeElement.blur();
		}
	}

	destroyOptionsComponent(): void {
		this.optionsWrapperElement.nativeElement.style.opacity = '0';
		this.optionsWrapperElement.nativeElement.style['max-height'] = '350px';
		this.optionsWrapperElement.nativeElement.style['top'] = '34px';
		if (this.optionsComponentRef) {
			this.optionsComponentRef.destroy();
		}
		this.optionsContainer.clear();
	}

	buildOptionsData(): any {
		return {
			selectList: this.selectList,
			onSelectItem: (key, value, closeOnSelect?: boolean) => {
				this.onSelectItem.emit(this.selectList[key]);
				let inputText = this.selectList[key].name;
				if (this.inputTextHandler) {
					inputText = this.inputTextHandler(this.selectList[key], this.selectList);
				}
				this.setValue(inputText);
				if (closeOnSelect) {
					setTimeout(this.closeOptions.bind(this));
				}
			},
			onListChange: (selectList: ISelectItem[]) => {
				this.onListChange.emit(selectList);
				let text: string;
				if (this.inputTextHandler) {
					text = this.inputTextHandler(null, selectList);
				} else {
					text = selectList.reduce((prev: string, current: ISelectItem) => {
						if (current.isSelected) {
							return prev ? prev + ', ' + current.name : current.name;
						} else {
							return prev;
						}
					}, '');
				}
				this.setValue(text);
			},
			setStatus: (status: any) => {
				this.validationStatus = status;
			}
		};
	}


	@HostListener('document:keydown')
	scrollHandling($event: any): void {
		// space and arrow keys
		if ([32, 37, 38, 39, 40].indexOf($event.keyCode) > -1 && this.isOptionsOpen) {
			$event.preventDefault();
		}
	}


	@HostListener('document:keyup')
	keyUpHandler(keyEvent: KeyboardEvent): void {
		const key = keyEvent.key;
		switch (key.toUpperCase()) {
			case 'TAB':
				setTimeout(() => {
					if (this.isOptionsOpen && this.openOptionsInModal && this.selectInput.nativeElement !== document.activeElement) {
						this.closeOptions();
					}
				}, 10);
				break;
		}
	}


	validate(selectedItem: ISelectItem): void {
		if (this.validators) {
			this.validationStatus = {message: '', isValid: true};
			this.validators.forEach(cb => {
				const validationResult = cb(selectedItem);
				if (!validationResult.isValid) {
					this.validationStatus = validationResult;
				}
			});
		}
	}

	syncScrollBar(selectedIndex: number, options: ISelectItem[], optionHeight: number): void {
		const optionsElement: any = this.openOptionsInModal ? this.modal.componentWrapper : this.optionsWrapperElement.nativeElement;
		const optionsElementHeight: any = optionsElement.getBoundingClientRect().height;
		const scrollPercentage = (selectedIndex * optionHeight) - optionsElementHeight / 2;
		optionsElement.scrollTop = scrollPercentage;
	}

	setValue = (text: any) => {
		this.title.nativeElement.innerHTML = text;
	};

	ngOnDestroy(): void {
		this.unsubscribeArr.forEach(subscription => subscription.unsubscribe());
	}
}
