import { Injectable } from '@angular/core';
import * as faker from 'faker';
import { BehaviorSubject, of } from 'rxjs';
import { UiComment, UiUser } from '@kikstart/ui';
import { sortBy } from 'lodash';

export interface FakePost {
  id: string;
  title: string;
  slug: string;
  content: string;
  created: Date;
  author: UiUser;
  comments?: UiComment[];
  commentCount?: number;
}

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

@Injectable({ providedIn: 'root' })
export class FakerService {
  public posts = new BehaviorSubject<FakePost[]>([]);
  public status = new BehaviorSubject<UiComment[]>([]);
  public user = new BehaviorSubject<UiUser>(null);
  public users = new BehaviorSubject<UiUser[]>([]);

  constructor() {
    this.init();
  }

  init() {
    this.updateUsers(25);
    this.updateStatuses(100);
    this.updatePosts(50);
  }

  private getRandomUser(): UiUser {
    const users = this.users.getValue();

    return users[Math.floor(Math.random() * users.length)];
  }

  public addStatus(status: UiComment) {
    this.status.next([status, ...this.status.getValue()]);
  }

  public updateStatus(status: UiComment) {
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

  private generateUser(id: string): UiUser {
    const { name, username, avatar } = faker.helpers.contextualCard();
    return { id, name, username, avatar };
  }

  private updateUsers(amount: number) {
    const items: UiUser[] = [];

    for (let i = 0; i < amount; i++) {
      items.push(this.generateUser(i.toString()));
    }
    this.users.next(items);

    // Assign one of these users as the active user
    this.user.next(this.getRandomUser());
  }

  private generateStatus(id: string, generateComments = false): UiComment {
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
    const items: UiComment[] = [];

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
