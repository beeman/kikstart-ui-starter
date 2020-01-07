import { Injectable } from '@angular/core';
import * as faker from 'faker';
import { BehaviorSubject, of } from 'rxjs';
import { sortBy } from 'lodash';

export interface FakeUser {
  id: string;
  username: string;
  name: string;
  avatar: string;
}

export interface FakeStatus {
  id: string;
  text: string;
  created: Date;
  author: FakeUser;
  comments?: FakeStatus[];
  commentCount?: number;
}
export interface FakePost {
  id: string;
  title: string;
  slug: string;
  content: string;
  created: Date;
  author: FakeUser;
  comments?: FakeStatus[];
  commentCount?: number;
}

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

@Injectable({ providedIn: 'root' })
export class FakerService {
  public posts = new BehaviorSubject<FakePost[]>([]);
  public status = new BehaviorSubject<FakeStatus[]>([]);
  public user = new BehaviorSubject<FakeUser>(null);
  public users = new BehaviorSubject<FakeUser[]>([]);

  constructor() {
    this.init();
  }

  init() {
    this.updateUsers(25);
    this.updateStatuses(100);
    this.updatePosts(50);
  }

  private getRandomUser(): FakeUser {
    const users = this.users.getValue();

    return users[Math.floor(Math.random() * users.length)];
  }

  public addStatus(status: FakeStatus) {
    this.status.next([status, ...this.status.getValue()]);
  }

  public updateStatus(status: FakeStatus) {
    console.log({ updateStatus: status });
    this.status.next([
      ...this.status.getValue().map(item => {
        return item.id === status.id ? status : item;
      }),
    ]);
  }

  public deleteStatus(id: string) {
    this.status.next([...this.status.getValue().filter(status => status.id !== id)]);
    return of(true);
  }

  private generateUser(id: string): FakeUser {
    // TODO: fixed by this PR https://github.com/DefinitelyTyped/DefinitelyTyped/pull/41453/files
    // @ts-ignore
    const { name, username, avatar } = faker.helpers.contextualCard();
    return { id, name, username, avatar };
  }

  private updateUsers(amount: number) {
    const items: FakeUser[] = [];

    for (let i = 0; i < amount; i++) {
      items.push(this.generateUser(i.toString()));
    }
    this.users.next(items);

    // Assign one of these users as the active user
    this.user.next(this.getRandomUser());
  }

  private generateStatus(id: string, generateComments = false): FakeStatus {
    const comments = generateComments ? this.generateStatuses(randInt(0, 10)) : undefined;

    return {
      id,
      text: faker.hacker.phrase(),
      author: this.getRandomUser(),
      created: faker.date.past(),
      comments,
      commentCount: comments ? comments.length : 0,
    };
  }

  private generateStatuses(amount: number, comments = false) {
    const items: FakeStatus[] = [];

    for (let i = 0; i < amount; i++) {
      items.push(this.generateStatus(i.toString(), comments));
    }
    return sortBy(items, 'created');
  }

  private updateStatuses(amount: number) {
    const items = this.generateStatuses(amount, true);

    this.status.next(items.reverse());
  }

  private generatePost(id: string, generateComments = false): FakePost {
    const comments = generateComments ? this.generateStatuses(randInt(0, 10)) : undefined;
    const { slug, sentence, paragraphs } = faker.lorem;

    return {
      id,
      slug: slug(),
      title: sentence(),
      content: paragraphs(randInt(1, 10), '<br /><br />'),
      author: this.getRandomUser(),
      created: faker.date.past(),
      comments,
      commentCount: comments ? comments.length : 0,
    };
  }

  private generatePosts(amount: number, comments = false) {
    const items: FakePost[] = [];

    for (let i = 0; i < amount; i++) {
      items.push(this.generatePost(i.toString(), comments));
    }
    return sortBy(items, 'created');
  }

  private updatePosts(amount: number) {
    const items = this.generatePosts(amount, true);

    this.posts.next(items.reverse());
  }
}
