import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    BranchComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FormsModule,
    NgSelectModule,
    
  ]
})
export class BranchModule { }
