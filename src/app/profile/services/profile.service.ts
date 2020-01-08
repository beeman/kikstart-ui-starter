import { Injectable } from '@angular/core';
import { UiUser } from '@kikstart/ui';
import { Observable, of } from 'rxjs';

import { FakerService } from '../../faker.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private faker: FakerService) {}

  getProfile(username: string): Observable<UiUser> {
    return of(this.faker.users.getValue().find(u => u.username === username));
  }
}
