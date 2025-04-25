import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { OrderBookSnapshot } from '../models/snapshot.model';

@Injectable({
  providedIn: 'root'
})
export class OrderBookService {
  private readonly dataUrl = 'assets/sample.json';

  constructor(private http: HttpClient) {}

  loadSnapshots(): Observable<OrderBookSnapshot[]> {
    return this.http.get<OrderBookSnapshot[]>(this.dataUrl).pipe(
      shareReplay(1)
    );
  }
}
