import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../models/game';
@Component({
  selector: 'app-game-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './game-edit.component.html',
  styleUrl: './game-edit.component.css',
})
export class GameEditComponent {
  game = {} as Game;

  constructor(
    private apiService: ApiService,
    private router: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.router.snapshot.params['gameId'];

    this.apiService.getSingleGame(id).subscribe((game) => {
      this.game = game;
    });
  }
  addGame(event: Event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target as HTMLFormElement);

    const gameData = {
      _ownerId: this.userService.getCurrentUser().toString(),
      title: formData.get('title')?.toString(),
      imageUrl: formData.get('imageUrl')?.toString(),
      creators: formData.get('creators')?.toString(),
      rating: formData.get('rating')?.toString(),
      downloads: formData.get('downloads')?.toString(),
      description: formData.get('description')?.toString(),
    };
    this.apiService
      .createGame(
        gameData.title,
        gameData.imageUrl,
        gameData.creators,
        gameData.rating,
        gameData.downloads,
        gameData.description
      )
      .subscribe({
        next: (data) => {
          this.router.navigate(['/catalog']);
        },
        error: (err) => {
          console.error('Error creating game:', err);
          // Handle errors (e.g., display error message)
        },
      });
  }
}
