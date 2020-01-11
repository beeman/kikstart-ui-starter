import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { FakerService, FakePost } from '../../faker.service';

@Injectable({ providedIn: 'root' })
export class BlogService {
  public posts: BehaviorSubject<FakePost[]>;
  public posts$: Observable<FakePost[]>;

  constructor(private faker: FakerService) {
    this.posts = this.faker.posts;
    this.posts$ = this.faker.posts.asObservable();
  }

  getPost(id: string) {
    const posts = this.faker.posts.getValue();
    return of(posts.find(post => post.id === id));
  }
}
