import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UiService } from '@kikstart/ui';

import { BlogService } from '../services/blog.service';

@Component({
  template: `
    <ui-hero title="Blog" description="This is what a blog would look like..."></ui-hero>
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2">
        <app-post-list [posts]="posts$ | async"></app-post-list>
      </div>
    </div>
  `,
})
export class BlogIndexComponent implements OnInit {
  public posts$: Observable<any>;

  constructor(public service: BlogService, private ui: UiService) {}

  ngOnInit() {
    this.ui.setMetaData({ title: 'Blog' });
    this.posts$ = this.service.posts$;
  }
}
