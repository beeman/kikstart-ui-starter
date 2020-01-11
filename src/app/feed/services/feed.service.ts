import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ButtonHelper, UiComment, UiUser } from '@kikstart/ui';

import { FakerService } from '../../faker.service';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FeedService {
  user: UiUser;

  public status: BehaviorSubject<UiComment[]>;
  public status$: Observable<UiComment[]>;

  constructor(private faker: FakerService) {
    this.status = this.faker.status;
    this.status$ = this.status.asObservable();

    this.user = this.faker.user.getValue();
  }

  static prepComment(comment: UiComment): UiComment {
    return {
      ...comment,
      author: {
        ...comment.author,
        path: '/profile/' + comment.author.username,
      },
      buttons: [ButtonHelper.like({ label: 'Like' })],
    };
  }

  static prepStatus(comment: UiComment): UiComment {
    const { comments = [] } = comment;
    return {
      ...comment,
      author: {
        ...comment.author,
        path: '/profile/' + comment.author.username,
      },
      path: '/feed/' + comment.id,
      comments: comments.length ? comments.map(c => FeedService.prepComment(c)) : null,
      buttons: [
        ButtonHelper.like({ label: 'Like' }),
        ButtonHelper.comment({
          label: (comment.commentCount ? comment.commentCount : 0) + ' Comments',
          path: '/feed/' + comment.id,
        }),
      ],
    };
  }

  getStatus(id: string) {
    return of(this.status.getValue().find(i => i.id === id));
  }

  createStatus({ text }: { text: string }) {
    const status: UiComment = {
      id: new Date().getTime().toString(),
      created: new Date(),
      author: this.user,
      text,
    };
    this.faker.addStatus(status);
    return of(true);
  }

  createComment({ statusId, text }: { statusId: string; text: string }) {
    const comment: UiComment = {
      id: new Date().getTime().toString(),
      created: new Date(),
      author: this.user,
      text,
    };

    return this.getStatus(statusId).pipe(
      map(status => {
        const comments = [...(status.comments || []), comment];
        return { ...status, comments, commentCount: comments.length };
      }),
      tap(status => this.faker.updateStatus(status)),
    );
  }

  deleteComment({ statusId, id }) {
    return this.getStatus(statusId).pipe(
      map(status => ({ ...status })),
      tap(status => {
        console.log(status);
        this.faker.updateStatus(status);
      }),
    );

    // const newStatus = { ...status, comments: status.comments.find() }
    // return this.faker.deleteStatus(id);
  }

  deleteStatus({ id }) {
    return this.faker.deleteStatus(id);
  }
}
