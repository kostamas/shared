import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAudit} from '../types/audit';
import {ApiSrv} from './providersTokens';

@Injectable()
export class AuditService implements IAudit {
	constructor(private http: HttpClient,  @Inject(ApiSrv) public apiService: any) {
	}

	report(menuId: number): void {

		this.apiService.getEndpoints((endPoints: any) => {

			this.http.post(endPoints.audit, {menuId}).subscribe();
		});
	}
}
