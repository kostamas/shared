import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAudit} from '../types/audit';
import {ApiService} from '../../services/api.service';

@Injectable()
export class AuditService implements IAudit {
	constructor(private http: HttpClient, private apiService: ApiService) {
	}
	
	report(menuId: number): void {
		
		this.apiService.getEndpoints((endPoints: IEndpoints) => {
			
			this.http.post(endPoints.audit, {menuId}).subscribe();
		});
	}
}
