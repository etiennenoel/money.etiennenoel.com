import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class EventStore {
  public readonly expenseCreatedOrModified: Subject<void> = new Subject();
}
