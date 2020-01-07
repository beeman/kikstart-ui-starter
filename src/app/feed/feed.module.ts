import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UiModule } from '@kikstart/ui';
import { FeedIndexComponent } from './containers/feed-index.component';
import { FeedDetailComponent } from './containers/feed-detail.component';

const routes: Routes = [
  { path: '', component: FeedIndexComponent },
  { path: ':id', component: FeedDetailComponent },
];

@NgModule({
  declarations: [FeedIndexComponent, FeedDetailComponent],
  imports: [UiModule, RouterModule.forChild(routes)],
})
export class FeedModule {}
