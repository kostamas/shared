import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FavoritesService} from '../../../favorites.service';
import {MainHeaderService} from '../../../main-header.service';
import {ModalService} from '../../../../modal-module/modal.service';
import {IModal} from '../../../../../types/modal';
import {SVG_ICONS} from '../../../../svg-icon-module/svg-icons.const';

@Component({
  selector: 'app-favorite-side-bar',
  templateUrl: './favorite-side-bar.component.html',
  styleUrls: ['./favorite-side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FavoriteSideBarComponent implements OnInit, OnDestroy {
  favoriteList: IMenuLink[] = [];
  unsubscribe: any[] = [];
  modal: IModal;
  public SVG_ICONS: any = SVG_ICONS;

  @Input('data') data: any;

  constructor(public favoriteService: FavoritesService, public mainHeaderService: MainHeaderService, public modalService: ModalService) {
  }

  ngOnInit(): void {
    this.modal = this.data.modal;

    this.favoriteList = [];

    this.unsubscribe.push(this.favoriteService.favoriteLoad.subscribe(this.getFavorites));
    this.unsubscribe.push(this.favoriteService.favoritesList.subscribe(results => {
      this.favoriteList = results;
      if (this.favoriteList) {
        this.favoriteList.forEach(p =>  {
            if (this.mainHeaderService.pagesPaths$.value[p.id]) {
              const pagePath = this.mainHeaderService.pagesPaths$.value[p.id].path;
              p.path = pagePath[0].name + ' -> ' + pagePath[1].name + ' -> ' + pagePath[2].name;
            }
          }
        );
      }
      this.favoriteService.favoriteLoaded.next();
    }));

    this.getFavorites();
  }

  public getFavorites = () => {
    this.favoriteService.getFavorites();
  };

  favoriteImgSrc(isFavorite: boolean): string {
    return this.favoriteService.favoriteImgSrc(isFavorite);
  }

  favoriteClick(link: IMenuLink): void {
    this.favoriteService.favoriteClick(link);
  }

  pageClickHandler(selectedPage: any): void {
    this.mainHeaderService.pageClick$.next(selectedPage);
    this.mainHeaderService.closeMenu$.next(false);
    this.modalService.closeModal(this.modal);
  }

	closeHandler(): void {
    this.modal.closeModal();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(subscription => subscription.unsubscribe());
  }

}
