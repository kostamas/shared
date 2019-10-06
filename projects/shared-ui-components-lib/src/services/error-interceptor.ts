import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {PopupService} from '../modules/popup-module/popup.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {IPopupData} from '../types/modal';


/** Pass untouched request through to the next request handler. */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private urlsNotIntercept: string[] = [], private popupService: PopupService) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const toSkip = this.urlsNotIntercept.filter(urlToSkip => req.url.includes(urlToSkip)).length > 0;

		if (toSkip) {
			return next.handle(req);
		} else {
			return next.handle(req).pipe(catchError((err): Observable<any> => {

				if (err.error && err.error.code === 'PRODUCT_ERROR' && err.error.serviceName === 'common-back-booking-service') {
					throw(err);
				}

				const errorPopupData: IPopupData = {
					data: err,
					buttons: [{text: 'OK', handler: closeFn => closeFn()}]
				};

				this.popupService.showError(errorPopupData);

				throw(err);
			}));
		}

	}
}
