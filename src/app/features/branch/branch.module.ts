import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateBranchComponent } from './create-branch/create-branch.component';

@NgModule({
  declarations: [
    BranchComponent,
    CreateBranchComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FormsModule,
    NgSelectModule,
    
  ]
})
export class BranchModule { }
