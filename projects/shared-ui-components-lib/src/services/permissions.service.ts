import {Injectable, Optional} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../../services/api.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {PermissionHandlerService} from '../../sharedConfiguration/permission-handler.service';

@Injectable({providedIn: 'root'})
export class PermissionsService implements CanActivate {
	public permissions$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);
	public permissions: any;

	constructor(private http: HttpClient, private apiService: ApiService,
							@Optional() private permissionHandlerService: PermissionHandlerService) {
	}

	initPermissions(permissionsRequest: string[]): void {
		this.apiService.getEndpoints((endPoints: IEndpoints) => {
			this.http.post(endPoints.hasRoles, permissionsRequest)
				.subscribe((permissions: string[]) => {
					const permissionsHashTable = {};
					
					for (let i = 0, l = permissions.length; i < l; i++) {
						permissionsHashTable[permissions[i]] = true;
					}
					
					this.permissions = permissionsHashTable;
					
					return this.permissions$.next(permissions);
				});
		});
	}

	canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean> {
		const canActivate$: Subject<boolean> = new Subject<boolean>();
		const page = activatedRouteSnapshot.data && activatedRouteSnapshot.data.page;
		setTimeout(() => this.permissions$.subscribe(permissions => {
				if (permissions) {
					if (this.permissionHandlerService && this.permissionHandlerService.permissionHandler) {
						const canActivate = this.permissionHandlerService.permissionHandler(permissions, page, this.checkPermissions);
						canActivate$.next(canActivate);
					} else {
						canActivate$.next(false);
					}
				} else {
					if (permissions !== null) { // null is the first value of BehaviorSubject.
						canActivate$.next(false);
					}
				}
			})
		);
		return canActivate$;
	}

	checkPermissions(permissions: string[], permissionsToCheck: string | string[]): boolean {
		permissionsToCheck = Array.isArray(permissionsToCheck) ? permissionsToCheck : [permissionsToCheck];
		
		for (let i = 0, l = permissionsToCheck.length; i < l; i++) {
			if (permissions.indexOf(permissionsToCheck[i]) > -1) {
				return true;
			}
		}
		
		return false;
	}
	
	hasPermissions(permissionsToCheck: string | string[]): boolean {
		permissionsToCheck = Array.isArray(permissionsToCheck) ? permissionsToCheck : [permissionsToCheck];
		
		for (let i = 0, l = permissionsToCheck.length; i < l; i++) {
			if (this.permissions[permissionsToCheck[i]]) return true;
		}
		
		return false;
	}
}
