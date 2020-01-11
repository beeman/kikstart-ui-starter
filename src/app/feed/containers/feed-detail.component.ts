import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { UiComment, UiUser } from '@kikstart/ui';

import { FeedService } from '../services/feed.service';

@Component({
  template: `
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2">
        <ui-card>
          <ui-card-body>
            <ng-container *ngIf="data$ | async as status">
              <ui-comment
                class="mb-3"
                [comment]="status"
                [deleteButton]="status.author.id === user.id"
                (action)="handleStatusAction($event)"
              >
              </ui-comment>

              <h4>Comments</h4>
              <div class="alert alert-info" *ngIf="!status.commentCount">
                No comments yet! Be the first to leave a comment!
              </div>

              <ng-container *ngFor="let comment of status.comments">
                <ui-comment
                  class="mb-3"
                  [comment]="comment"
                  [deleteButton]="comment.author.id === user.id"
                  (action)="deleteComment(status.id, comment.id)"
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
  public user: UiUser;
  public data$: Observable<UiComment>;
  public reset = new BehaviorSubject(true);
  public reset$ = this.reset.asObservable();

  constructor(public route: ActivatedRoute, public router: Router, public service: FeedService) {}

  ngOnInit() {
    this.user = this.service.user;
    this.data$ = this.route.params.pipe(
      map(params => params.id),
      tap(id => (this.id = id)),
      switchMap(url => this.service.getStatus(url).pipe(map(FeedService.prepStatus))),
    );
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

  handleStatusAction({ type, payload }) {
    switch (type) {
      case 'DELETE':
        return this.service.deleteStatus(payload).subscribe(() => {
          this.router.navigate(['/feed']);
        });
      case 'LIKE':
        return console.log('LIKE not implemented yet');
      default:
        console.log(`Unhandled action ${type}`, payload);
    }
  }
}
