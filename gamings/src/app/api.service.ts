import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development'; //http://localhost:3030/jsonstore
import { Game } from './models/game';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getAllGames() {
    return this.http.get<Game[]>(`${this.apiUrl}/games`);
  }

  getLastThreeGames() {
    return this.http.get<Game[]>(
      `${this.apiUrl}/games?sortBy=_createdOn%20desc&pageSize=3`
    );
  }

  getSingleGame(id: string) {
    return this.http.get<Game>(`${this.apiUrl}/games/${id}`);
  }

  createGame(
    title: string,
    imageUrl: string,
    creator: string,
    rating: string,
    downloads: string,
    description: string
  ) {
    const payload = {
      title,
      imageUrl,
      downloads,
      rating,
      creator,
      description,
    };
    return this.http.put<Game>(`${this.apiUrl}/games`, payload);
  }
}
