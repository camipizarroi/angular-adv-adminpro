import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BreadcrumsComponent } from './breadcrums/breadcrums.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';




@NgModule({
  declarations: [
    BreadcrumsComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    BreadcrumsComponent,
    SidebarComponent,
    HeaderComponent,
  ],
})
export class SharedModule { }
