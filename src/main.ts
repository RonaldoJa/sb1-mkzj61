import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './app/question.component';
import { GameService } from './app/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, QuestionComponent],
  template: `
    <div class="container">
      <header class="header">
        <h1>Identificación de Requisitos No Funcionales</h1>
        <div class="score-display">Puntuación: {{ totalScore }}</div>
      </header>

      <main>
        <app-question
          *ngIf="currentQuestion && !gameCompleted"
          [question]="currentQuestion"
          (completed)="onQuestionCompleted($event)">
        </app-question>

        <div *ngIf="gameCompleted" class="completion-card card">
          <h2>¡Juego Completado!</h2>
          <p class="final-score">Puntuación Final: {{ totalScore }}</p>
          <button class="btn btn-primary" (click)="restartGame()">
            Jugar de Nuevo
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .score-display {
      font-size: 1.5em;
      font-weight: bold;
      color: #1976d2;
    }

    .completion-card {
      text-align: center;
      padding: 40px;
    }

    .final-score {
      font-size: 2em;
      color: #1976d2;
      margin: 20px 0;
    }
  `]
})
export class App {
  currentQuestion = this.gameService.getCurrentQuestion();
  totalScore = 0;
  gameCompleted = false;

  constructor(private gameService: GameService) {}

  onQuestionCompleted(score: number) {
    this.totalScore += score;
    this.currentQuestion = this.gameService.nextQuestion();
    
    if (!this.currentQuestion) {
      this.gameCompleted = true;
    }
  }

  restartGame() {
    this.gameService.resetGame();
    this.currentQuestion = this.gameService.getCurrentQuestion();
    this.totalScore = 0;
    this.gameCompleted = false;
  }
}

bootstrapApplication(App, {
  providers: [GameService]
});