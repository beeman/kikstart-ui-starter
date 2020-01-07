import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { FakerService, FakeStatus, FakeUser } from '../../faker.service';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FeedService {
  user: FakeUser;

  public status: BehaviorSubject<FakeStatus[]>;
  public status$: Observable<FakeStatus[]>;

  constructor(private faker: FakerService) {
    this.status = this.faker.status;
    this.status$ = this.status.asObservable();

    this.user = this.faker.user.getValue();
  }

  getStatus(id: string) {
    return of(this.status.getValue().find(i => i.id === id));
  }

  createStatus({ text }: { text: string }) {
    const status: FakeStatus = {
      id: new Date().getTime().toString(),
      created: new Date(),
      author: this.user,
      text,
    };
    this.faker.addStatus(status);
    return of(true);
  }

  createComment({ statusId, text }: { statusId: string; text: string }) {
    const comment: FakeStatus = {
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
