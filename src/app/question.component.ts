import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimerComponent } from './timer.component';
import { Question } from './game.service';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, FormsModule, TimerComponent],
  template: `
    <div class="card question-card">
      <app-timer
        [duration]="30"
        (timeUp)="onTimeUp()"
        (timeRemaining)="updateTimeRemaining($event)">
      </app-timer>

      <div class="requirement-text">
        <h3>Requisito No Funcional:</h3>
        <p>{{ question.requirement }}</p>
      </div>

      <div [ngSwitch]="currentStep" class="step-container">
        <!-- Step 1: Variable -->
        <div *ngSwitchCase="'variable'" class="step">
          <h4>Paso 1: Identifica la Variable No Funcional</h4>
          <div class="options-grid">
            <button *ngFor="let option of question.variable.options"
                    [class.selected]="selectedOption === option"
                    (click)="selectOption(option)"
                    class="option-button"
                    [disabled]="!!feedback">
              {{ option }}
            </button>
          </div>
        </div>

        <!-- Step 2: Value -->
        <div *ngSwitchCase="'value'" class="step">
          <h4>Paso 2: Identifica el Valor No Funcional</h4>
          <div class="options-grid">
            <button *ngFor="let option of question.value.options"
                    [class.selected]="selectedOption === option"
                    (click)="selectOption(option)"
                    class="option-button"
                    [disabled]="!!feedback">
              {{ option }}
            </button>
          </div>
        </div>

        <!-- Step 3: Recommendation -->
        <div *ngSwitchCase="'recommendation'" class="step">
          <h4>Paso 3: Selecciona la Mejor Recomendación Técnica</h4>
          <div class="options-grid">
            <button *ngFor="let option of question.recommendation.options"
                    [class.selected]="selectedOption === option"
                    (click)="selectOption(option)"
                    class="option-button"
                    [disabled]="!!feedback">
              {{ option }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="feedback" class="feedback" [class.feedback-correct]="isCorrect" [class.feedback-incorrect]="!isCorrect">
        <p>{{ feedback }}</p>
        <div *ngIf="showNextButton" class="next-button-container">
          <button (click)="nextStep()" class="btn btn-primary">
            {{ isLastStep ? 'Siguiente Pregunta' : 'Siguiente Paso' }}
          </button>
        </div>
      </div>

      <div class="progress-bar">
        <div class="progress-step" [class.active]="currentStep === 'variable'">1</div>
        <div class="progress-line"></div>
        <div class="progress-step" [class.active]="currentStep === 'value'">2</div>
        <div class="progress-line"></div>
        <div class="progress-step" [class.active]="currentStep === 'recommendation'">3</div>
      </div>
    </div>
  `,
  styles: [`
    .question-card {
      max-width: 800px;
      margin: 0 auto;
    }

    .requirement-text {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin: 15px 0;
    }

    .option-button {
      padding: 15px;
      border: 2px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .option-button:hover:not([disabled]) {
      background: #f0f0f0;
      transform: translateY(-2px);
    }

    .option-button.selected {
      border-color: #1976d2;
      background: #e3f2fd;
    }

    .feedback {
      padding: 15px;
      margin-top: 20px;
      border-radius: 8px;
    }

    .feedback-correct {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .feedback-incorrect {
      background-color: #ffebee;
      color: #c62828;
    }

    .progress-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
    }

    .progress-step {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .progress-step.active {
      background: #1976d2;
      color: white;
    }

    .progress-line {
      height: 2px;
      width: 50px;
      background: #ddd;
    }

    .next-button-container {
      margin-top: 15px;
      text-align: right;
    }
  `]
})
export class QuestionComponent {
  @Input() question!: Question;
  @Output() completed = new EventEmitter<number>();
  @ViewChild(TimerComponent) timer!: TimerComponent;

  currentStep: 'variable' | 'value' | 'recommendation' = 'variable';
  selectedOption: string = '';
  feedback: string = '';
  isCorrect: boolean = false;
  showNextButton: boolean = false;
  currentTimeRemaining: number = 30;

  updateTimeRemaining(time: number) {
    this.currentTimeRemaining = time;
  }

  onTimeUp() {
    if (!this.feedback) {
      this.checkAnswer(true);
    }
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.checkAnswer();
  }

  checkAnswer(timeUp: boolean = false) {
    if (timeUp && !this.selectedOption) {
      this.feedback = '¡Se acabó el tiempo! Debes seleccionar una opción más rápido.';
      this.isCorrect = false;
      this.showNextButton = true;
      return;
    }

    const currentStepData = this.question[this.currentStep];
    this.isCorrect = this.selectedOption === currentStepData.correct;
    this.feedback = currentStepData.feedback;
    this.showNextButton = true;
  }

  get isLastStep(): boolean {
    return this.currentStep === 'recommendation';
  }

  nextStep() {
    const score = this.isCorrect ? this.currentTimeRemaining : 0;

    if (this.isLastStep) {
      this.completed.emit(score);
    } else {
      this.selectedOption = '';
      this.feedback = '';
      this.showNextButton = false;
      
      if (this.currentStep === 'variable') {
        this.currentStep = 'value';
      } else if (this.currentStep === 'value') {
        this.currentStep = 'recommendation';
      }
      
      this.timer.resetTimer();
    }
  }
}