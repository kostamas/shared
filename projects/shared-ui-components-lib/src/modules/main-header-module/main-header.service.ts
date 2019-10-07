import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';
import {IHeaderTab, IMainHeaderConfig} from '../../types/main-header';
import {ApiSrv} from '../../services/providersTokens';

export const MainHeaderConfig = new InjectionToken<any>(null);

@Injectable({
	providedIn: 'root'
})
export class MainHeaderService {

	public menuLoaded$: Subject<boolean> = new Subject<boolean>();
	public pageClick$: Subject<any> = new Subject();
	public pagesPaths$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	public closeMenu$: Subject<boolean> = new Subject();
	public adfWindowWidth$: Subject<number> = new Subject();
	public helpSubMenuItems$: BehaviorSubject<any> = new BehaviorSubject<any>(null);


	constructor(private http: HttpClient,
              @Optional() @Inject(MainHeaderConfig) public mainHeaderConfig: IMainHeaderConfig,
              @Inject(ApiSrv) public apiService: any) {
		this.menuLoaded$.next(false);
	}

	getMenus(cb: (HeaderTabs: IHeaderTab[]) => any): void {
		this.apiService.getEndpoints(endpoints => endpoints && this.http.get(endpoints.menus).subscribe(cb));
	}
}
