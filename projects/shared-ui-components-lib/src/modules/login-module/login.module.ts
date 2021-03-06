import {ModuleWithProviders, NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {AuthService} from '../../services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LoaderModule} from '../loader-module/loader.module';
import {PopupModule} from '../popup-module/popup.module';
import {ILoginConfigConstructor} from '../../types/auth';
import {AuthConfig} from '../../services/providersTokens';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderModule,
    PopupModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    AuthService
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule {
  static config(loginConfig: ILoginConfigConstructor): ModuleWithProviders {
    return {
      ngModule: LoginModule,
      providers: [{provide: AuthConfig, useClass: loginConfig}]
    };
  }
}
