import {
	AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation,
	OnDestroy
} from '@angular/core';
import {ModalService} from '../../../services/modal.service';
import {FavoriteSideBarComponent} from './side-bar-components/favorite-side-bar/favorite-side-bar.component';
import {FavoritesService} from '../../../services/favorites.service';
import {IModal, IModalConfig} from '../../../types/modal';
import {MainHeaderService} from '../../../services/main-header.service';
import {HelpSideBarComponent} from './side-bar-components/help-side-bar/help-side-bar.component';

@Component({
	selector: 'app-side-bar-menu',
	templateUrl: './side-bar-menu.component.html',
	styleUrls: ['./side-bar-menu.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SideBarMenuComponent implements OnInit, AfterViewInit, OnDestroy {
	modalConfig: IModalConfig;
	hasFavoritesInList: boolean = false;
	loadModal: boolean = false;
	showOnlyFavoriteIcon: boolean = true;
	modal: IModal;
	sideBarClass: string = 'side-menu-container';
	unsubscribe: any[] = [];
	menuStyle: any = {};
	helpItems: any[];

	constructor(private modalService: ModalService, public favoritesService: FavoritesService, private mainHeaderService: MainHeaderService) {
	}

	@ViewChild('favoriteIcon') favoriteIcon: ElementRef;
	@ViewChild('helpIcon') helpIcon: ElementRef;

	ngOnInit(): void {
		this.unsubscribe.push(this.favoritesService.favoriteLoaded.subscribe(() => {
			if (this.loadModal && this.modal) {
				this.modal.componentWrapper.style.display = 'block';
			}
		}));

		this.unsubscribe.push(this.mainHeaderService.adfWindowWidth$.subscribe((width: number) =>
		{
			this.menuStyle = {marginRight: `${window.innerWidth - width}px`};
		}));

		this.favoritesService.favoritesList.subscribe(results => {
			this.hasFavoritesInList = results && results.length > 0;
		});

		this.favoritesService.getFavorites();

		if (this.mainHeaderService.mainHeaderConfig && this.mainHeaderService.mainHeaderConfig.sideBarCustomClass) {
			this.sideBarClass += (' ' + this.mainHeaderService.mainHeaderConfig.sideBarCustomClass);
		}
		this.mainHeaderService.helpSubMenuItems$.subscribe(items => {
			this.helpItems = items;
		});
	}

	ngAfterViewInit(): void {
	}


	openFavoriteModal(): void {
		const {x, y, left, top} = this.favoriteIcon.nativeElement.getBoundingClientRect();
		this.modalConfig = {
			modalClass: 'side-bar-modal',
			position: {
				x: (x || left) - 335, y: (y || top) + 25
			},
			closeModalCallback: () => {
				this.loadModal = false;
				setTimeout(() => {
					this.favoritesService.getFavorites();
				}, 500);
			}
		};
		this.loadModal = true;
		const modalData = {};
		this.modal = this.modalService.open(FavoriteSideBarComponent, this.modalConfig, modalData);
		this.modal.componentWrapper.style.display = 'none';
	}


	openHelpModal(): void {
		const {x, y, left, top} = this.helpIcon.nativeElement.getBoundingClientRect();
		this.modalConfig = {
			modalClass: 'side-bar-modal',
			position: {
				x: (x || left) - 335, y: (y || top) + 25
			},
			closeModalCallback: () => {
				this.loadModal = false;
			}
		};
		this.loadModal = true;
		const modalData = {helpItems: this.helpItems};
		this.modal = this.modalService.open(HelpSideBarComponent, this.modalConfig, modalData);
		this.modal.componentWrapper.style.display = 'block';
	}


	favoriteSrc(): string {
		const filePath: string = 'assets/icons/images/';
		return this.hasFavoritesInList ? filePath + 'ico_favorites_on_peq.png' : filePath + 'ico_favorites_peq.png';
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any): void {
		if (this.mainHeaderService && this.mainHeaderService.mainHeaderConfig && this.mainHeaderService.mainHeaderConfig.calcSideBarClass) {
			this.sideBarClass = this.mainHeaderService.mainHeaderConfig.calcSideBarClass(event);
		}

		if (this.loadModal && this.favoriteIcon.nativeElement) {
			const {x, y, left, top} = this.favoriteIcon.nativeElement.getBoundingClientRect();
			this.modal.updateStyle({top: (y || top) + 25 + 'px', left: (x || left) - 335 + 'px'});
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.forEach(subscription => subscription.unsubscribe());
	}
}
