import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TickerComponent } from './ticker.component';


@NgModule({
  declarations: [
    TickerComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports: [
    TickerComponent
  ]
})
export class TickerModule { }
