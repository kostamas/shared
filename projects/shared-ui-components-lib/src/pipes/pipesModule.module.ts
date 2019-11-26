import {NgModule} from '@angular/core';
import {EllipsisPipe} from './ellipsis.pipe';
import {FilterPipe} from './filter.pipe';

@NgModule({
  imports: [],
  declarations: [
    EllipsisPipe,
    FilterPipe
  ],
  exports: [
    EllipsisPipe,
    FilterPipe
  ]
})
export class PipesModuleModule {
}
