import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

console.log('wrapper connector');

@Injectable({
	providedIn: 'root'
})
export class WrapperConnectorService
{
	public iframeUrl$: BehaviorSubject<any> = new BehaviorSubject<string>('');
	public officeName$: BehaviorSubject<any> = new BehaviorSubject<string>('');
	public divisionName$: BehaviorSubject<any> = new BehaviorSubject<string>('');
	public server$: BehaviorSubject<any> = new BehaviorSubject<string>('');
	
	constructor()
	{
    console.log('test wrapper connector');
	  
	  // window.addEventListener('message', this.onMessageCallback.bind(this), false); // Listen to iframe handshake
	}
	
	onMessageCallback(event)
	{
		var message, cmd, payload;
    console.log('onMessageCallback');

    if (event && event.source !== window && event.data)
		{
			message = JSON.parse(event.data);
			
			if (message && message.cmd)
			{
				cmd = message.cmd;
				payload = message.payload;
				
				switch (cmd)
				{
					case 'ADF.establish':
						WrapperConnectorService.establishWrapperConnection(event.source);
						break;
					
					case 'ADF.officeNameUpdated':
						console.log('Office name:', payload.officeName);
						this.officeName$.next(payload.officeName);
						break;
					
					case 'ADF.iframeUrl':
						console.log('ADF iFrame URL:', payload.iframeUrl, this.iframeUrl$);
						this.iframeUrl$.next(payload.iframeUrl);
						break;
					
					case 'ADF.initialData':
						console.log('ADF initial data:', payload);
						this.officeName$.next(payload.companyId + '-' + payload.officeId);
						this.divisionName$.next(payload.divisionId);
						this.server$.next(payload.server);
						break;
					
					default:
						console.log('Unsupported command received by the wrapper:', cmd, payload);
				}
				
			}
		}
	}
	
	static establishWrapperConnection(source)
	{
    // payload: {scriptPath: `${location.protocol}//${location.host}/adf-sync/injectable.js`}
    // todo - move the injectable.js from assets to adf-sync


    source.postMessage(JSON.stringify(
		{
			cmd: 'WRP.establish',
			payload: {scriptPath: `${location.protocol}//${location.host}//assets/injectable.js`}
		}), '*');
	}
}
