import { Component, Input, OnInit } from '@angular/core';
import { FakePost } from '../../faker.service';

@Component({
  selector: 'app-post-detail',
  template: `
    <ui-hero [title]="post.title" [description]="post.created.getTime() | timeago"></ui-hero>
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2">
        <ui-card>
          <ui-card-body>
            <div [innerHTML]="post.content"></div>
          </ui-card-body>
        </ui-card>
      </div>
    </div>
  `,
})
export class PostDetailComponent implements OnInit {
  @Input() post: FakePost;
  constructor() {}

  ngOnInit() {}
}
