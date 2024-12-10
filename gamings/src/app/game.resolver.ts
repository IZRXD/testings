import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Game } from './models/game';

@Injectable({ providedIn: 'root' })
export class GameResolver implements Resolve<Game | null> {
  constructor(private apiService: ApiService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Game | null> {
    const gameId = route.params['gameId'];
    if (gameId) {
      return this.apiService.getSingleGame(gameId);
    } else {
      return of(null); // Return null if gameId is not found
    }
  }
}
