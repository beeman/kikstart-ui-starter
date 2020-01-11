import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonHelper, UiComment, UiService, UiUser } from '@kikstart/ui';

import { FeedService } from '../services/feed.service';
import { delay, map, tap } from 'rxjs/operators';
import { log } from 'util';

@Component({
  template: `
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2">
        <ui-card>
          <ui-card-body>
            <ui-comment-form
              class="mb-3"
              placeholder="What's happening?"
              submitButton="Post"
              (action)="createStatus($event)"
              [avatar]="user.avatar"
              [reset$]="reset$"
            >
            </ui-comment-form>
            <ng-container *ngIf="statuses$ | async as statuses">
              <ui-comment
                *ngFor="let status of statuses"
                class="mb-3"
                [comment]="status"
                [deleteButton]="status.author.id === user.id"
                (action)="handleAction($event)"
              >
              </ui-comment>
            </ng-container>
          </ui-card-body>
        </ui-card>
      </div>
    </div>
  `,
})
export class FeedIndexComponent implements OnInit {
  public user: UiUser;
  public statuses$: Observable<UiComment[]>;
  public reset = new BehaviorSubject(true);
  public reset$ = this.reset.asObservable();

  constructor(public service: FeedService, private ui: UiService) {}

  ngOnInit() {
    this.ui.setMetaData({ title: 'Feed' });
    this.statuses$ = this.service.status$.pipe(map(items => items.map(FeedService.prepStatus)));
    this.user = this.service.user;
  }

  createStatus({ payload }) {
    return this.service
      .createStatus(payload)
      .pipe(
        delay(100),
        tap(() => this.reset.next(true)),
      )
      .subscribe();
  }

  handleAction({ type, payload }) {
    switch (type) {
      case 'DELETE':
        return this.service.deleteStatus(payload);
      case 'LIKE':
        return console.log('LIKE not implemented yet');
      default:
        console.log(`Unhandled action ${type}`, payload);
    }
  }
}
