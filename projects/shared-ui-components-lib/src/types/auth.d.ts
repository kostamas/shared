import {BehaviorSubject} from 'rxjs';

export interface IAuthConfig {
  onLoginSuccessRedirect: string;
  showOfficeData: boolean;
  logoutFromHotelBeds: boolean;
  api$: BehaviorSubject<any>;
}

interface ILoginConfigConstructor {
  new(...args: any[]): IAuthConfig;
}

export interface IPermissionsTypes {
  read: string;
  write: string;
  read_write: string;
}
