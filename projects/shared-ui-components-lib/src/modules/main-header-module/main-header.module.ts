import {ModuleWithProviders, NgModule} from '@angular/core';
import {MainHeaderConfig, MainHeaderService} from './main-header.service';
import {MainHeaderComponent} from './main-header.component';
import {SubMenuItemComponent} from './sub-menu-item/sub-menu-item.component';
import {MenuItemComponent} from './menu-item/menu-item.component';
import {BrowserModule} from '@angular/platform-browser';
import {SideBarMenuComponent} from './side-bar-menu/side-bar-menu.component';
import {FavoriteSideBarComponent} from './side-bar-menu/side-bar-components/favorite-side-bar/favorite-side-bar.component';
import {FavoritesService} from './favorites.service';
import {SharedConstants} from '../../services/shared-constants.service';
import {NewLinksService} from './new-links/new-links.service';
import {SvgIconModule} from '../svg-icon-module/svg-icon.module';
import { HelpSideBarComponent } from './side-bar-menu/side-bar-components/help-side-bar/help-side-bar.component';
import {IMainHeaderConfigConstructor} from '../../types/main-header';

@NgModule({
	imports: [
		BrowserModule,
		SvgIconModule
	],
	declarations: [
		MainHeaderComponent,
		SubMenuItemComponent,
		MenuItemComponent,
		SideBarMenuComponent,
		FavoriteSideBarComponent,
		HelpSideBarComponent
	],
	entryComponents: [
		FavoriteSideBarComponent,
		HelpSideBarComponent
	],
	exports: [
		MainHeaderComponent,
		SideBarMenuComponent
	],
	providers: [
		MainHeaderService,
		FavoritesService,
		SharedConstants,
		NewLinksService
	],
})
export class MainHeaderModule {
	static config(mainHeaderConfig: IMainHeaderConfigConstructor): ModuleWithProviders {
		return {
			ngModule: MainHeaderModule,
			providers: [{provide: MainHeaderConfig, useClass: mainHeaderConfig}]
		};
	}
}
