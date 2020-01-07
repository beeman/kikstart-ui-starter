import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UiService } from '@kikstart/ui';

import { FeedService } from '../services/feed.service';
import { delay, switchMap, tap } from 'rxjs/operators';
import { FakeStatus, FakeUser } from '../../faker.service';

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
                [avatar]="status.author.avatar"
                [username]="status.author.username"
                [name]="status.author.name"
                [link]="['/feed', status.id]"
                [text]="status.text"
                [time]="status.created"
                [deleteButton]="status.author.id === user.id"
                (delete)="deleteStatus(status)"
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
  public user: FakeUser;
  public statuses$: Observable<FakeStatus[]>;
  public reset = new BehaviorSubject(true);
  public reset$ = this.reset.asObservable();

  constructor(public service: FeedService, private ui: UiService) {}

  ngOnInit() {
    this.ui.setMetaData({ title: 'Feed' });
    this.statuses$ = this.service.status$;
    this.user = this.service.user;
  }

  deleteStatus(comment: any) {
    this.service.deleteStatus(comment);
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
}
