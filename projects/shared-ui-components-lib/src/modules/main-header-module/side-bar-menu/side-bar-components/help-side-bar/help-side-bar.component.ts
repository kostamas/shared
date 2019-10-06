import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {IModal} from '../../../../../types/modal';
import {SVG_ICONS} from '../../../../svg-icon-module/svg-icons.const';
import {HttpClient} from '@angular/common/http';

@Component({
	selector: 'app-help-side-bar',
	templateUrl: './help-side-bar.component.html',
	styleUrls: ['./help-side-bar.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class HelpSideBarComponent implements OnInit, OnDestroy {
	unsubscribe: any[] = [];
	modal: IModal;
	public PDF_PATH: string = 'assets/pdf';
	public SVG_ICONS: any = SVG_ICONS;
	@Input('data') data: any;

	helpItems: any[];

	constructor(private httpClient: HttpClient) {
	}

	ngOnInit(): void {
		this.modal = this.data.modal;
		this.helpItems = this.data.helpItems;
	}

	closeHandler(): void {
		this.modal.closeModal();
	}

	ngOnDestroy(): void {
	}


	pageClickHandler(helpItem: any): void {
		this.httpClient.get(`${window.location.origin}/${this.PDF_PATH}/${helpItem.link}`, {responseType: 'blob'}).subscribe(pdfFile => {
			const blobFile: Blob = new Blob([pdfFile], {type: 'application/pdf'});
			const downloadURL = window.URL.createObjectURL(blobFile);
			const link = document.createElement('a');
			link.href = downloadURL;
			link.download = helpItem.link;
			link.click();
		});
	}
}
