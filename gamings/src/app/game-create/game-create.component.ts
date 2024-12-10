import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-create',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css',
})
export class GameCreateComponent {
  constructor(private apiService: ApiService) {}

  addGame(
    event: Event,
    title: string,
    imageUrl: string,
    downloads: string,
    rating: string,
    description: string,
    creators: string
  ) {
    event.preventDefault();

    this.apiService
      .createGame(title, imageUrl, downloads, rating, creators, description)
      .subscribe((data: any) => {
        console.log(data);
      });
    console.log({
      title,
      imageUrl,
      downloads,
      rating,
      creators,
      description,
    });
  }
}
