import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { FeedService } from '../services/feed.service';
import { FakeStatus, FakeUser } from '../../faker.service';

@Component({
  template: `
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2">
        <ui-card>
          <ui-card-body>
            <ng-container *ngIf="data$ | async as status">
              <ui-comment
                class="mb-3"
                [avatar]="status.author.avatar"
                [username]="status.author.username"
                [name]="status.author.name"
                [link]="['/feed', status.id]"
                [text]="status.text"
                [time]="status.created"
                [deleteButton]="status.author.id === user.id"
                (delete)="deleteStatus(status.id)"
              >
              </ui-comment>

              <h4>Comments</h4>
              <div class="alert alert-info" *ngIf="!status.commentCount">
                No comments yet! Be the first to leave a comment!
              </div>

              <ng-container *ngFor="let comment of status.comments">
                <ui-comment
                  class="mb-3"
                  [avatar]="comment.author.avatar"
                  [username]="comment.author.username"
                  [name]="comment.author.name"
                  [text]="comment.text"
                  [time]="comment.created"
                  [deleteButton]="comment.author.id === user.id"
                  (delete)="deleteComment(status.id, comment.id)"
                >
                </ui-comment>
              </ng-container>

              <ui-comment-form
                class="mb-3"
                placeholder="Write your reply"
                submitButton="Comment"
                (action)="createComment($event)"
                [avatar]="user.avatar"
                [reset$]="reset$"
              >
              </ui-comment-form>
            </ng-container>
          </ui-card-body>
        </ui-card>
      </div>
    </div>
  `,
})
export class FeedDetailComponent implements OnInit {
  public id: string;
  public user: FakeUser;
  public data$: Observable<FakeStatus>;
  public reset = new BehaviorSubject(true);
  public reset$ = this.reset.asObservable();

  constructor(public route: ActivatedRoute, public service: FeedService) {}

  ngOnInit() {
    this.user = this.service.user;
    this.data$ = this.route.params.pipe(
      map(params => params.id),
      tap(id => (this.id = id)),
      switchMap(url => this.service.getStatus(url)),
    );
  }

  deleteStatus(id: string) {
    this.service.deleteStatus({ id }).subscribe(res => {
      console.log('status deleted', res);
    });
  }

  deleteComment(statusId: string, id: string) {
    this.service.deleteComment({ statusId, id }).subscribe(res => {
      console.log('comment deleted', res);
    });
  }

  createComment({ payload }) {
    return this.service
      .createComment({ statusId: this.id, text: payload.text })
      .pipe(
        delay(100),
        tap(() => this.reset.next(true)),
      )
      .subscribe();
  }
}
