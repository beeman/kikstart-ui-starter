import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UiUser } from '@kikstart/ui';

import { ProfileService } from '../services/profile.service';

@Component({
  template: `
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2">
        <ng-container *ngIf="data$ | async as profile">
          <ui-hero [avatar]="profile.avatar" [title]="profile.name" [description]="profile.username"> </ui-hero>
        </ng-container>
      </div>
    </div>
  `,
})
export class ProfileDetailComponent implements OnInit {
  public data$: Observable<UiUser>;

  constructor(public route: ActivatedRoute, public service: ProfileService) {}

  ngOnInit() {
    this.data$ = this.route.params.pipe(
      map(params => params.id),
      switchMap(id => this.service.getProfile(id)),
    );
  }
}
