import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BlogService } from '../services/blog.service';

@Component({
  template: `
    <ng-container *ngIf="data$ | async as data">
      <app-post-detail [post]="data"></app-post-detail>
    </ng-container>
  `,
})
export class BlogDetailComponent implements OnInit {
  public id: string;
  public data$: Observable<any>;

  constructor(public route: ActivatedRoute, public service: BlogService) {}

  ngOnInit() {
    this.data$ = this.route.params.pipe(
      map(params => params.id),
      tap(id => console.log(id)),
      tap(id => (this.id = id)),
      switchMap(id => this.service.getPost(id)),
    );
  }
}
