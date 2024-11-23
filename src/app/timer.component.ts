import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timer" [ngClass]="{'timer-warning': timeRemaining <= 10}">
      Tiempo restante: {{ timeRemaining }} segundos
    </div>
  `,
  styles: [`
    .timer {
      font-size: 1.2em;
      font-weight: bold;
      margin: 10px 0;
      padding: 10px;
      border-radius: 4px;
      background-color: #e8f5e9;
    }
    .timer-warning {
      background-color: #ffebee;
      color: #c62828;
      animation: pulse 1s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  `]
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() duration: number = 60;
  @Output() timeUp = new EventEmitter<void>();
  @Output() timeRemaining = new EventEmitter<number>();
  
  timeRemaining: number = 60;
  private timer: any;

  ngOnInit() {
    this.timeRemaining = this.duration;
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.timeRemaining.emit(this.timeRemaining);
      
      if (this.timeRemaining <= 0) {
        this.stopTimer();
        this.timeUp.emit();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  resetTimer() {
    this.stopTimer();
    this.timeRemaining = this.duration;
    this.startTimer();
  }
}