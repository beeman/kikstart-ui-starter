import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UiModule } from '@kikstart/ui';
import { ProfileDetailComponent } from './containers/profile-detail.component';

const routes: Routes = [{ path: ':id', component: ProfileDetailComponent }];

@NgModule({
  declarations: [ProfileDetailComponent],
  imports: [UiModule, RouterModule.forChild(routes)],
})
export class ProfileModule {}
