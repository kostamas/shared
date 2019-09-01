import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'lib-shared-ui-components-lib',
  template: `
    <p>
      shared-ui-components-lib works!
    </p>
  `,
  styles: []
})
export class SharedUiComponentsLibComponent implements OnInit
{
  
  constructor() {
  }
  
  ngOnInit() {
    console.log('test');
  }
  
}
