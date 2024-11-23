import { Injectable } from '@angular/core';

export interface Question {
  requirement: string;
  variable: {
    options: string[];
    correct: string;
    feedback: string;
  };
  value: {
    options: string[];
    correct: string;
    feedback: string;
  };
  recommendation: {
    options: string[];
    correct: string;
    feedback: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private questions: Question[] = [
    {
      requirement: 'El sistema debe responder a las consultas en menos de 2 segundos bajo una carga de 1000 usuarios simultáneos.',
      variable: {
        options: ['Tiempo de Respuesta', 'Rendimiento', 'Disponibilidad', 'Escalabilidad'],
        correct: 'Tiempo de Respuesta',
        feedback: 'El tiempo de respuesta es la variable correcta ya que se refiere específicamente al tiempo que tarda el sistema en procesar una solicitud.'
      },
      value: {
        options: ['Rápido', 'Aceptable', 'Lento', 'Crítico'],
        correct: 'Rápido',
        feedback: 'Rápido es el valor adecuado ya que 2 segundos representa un tiempo de respuesta ágil para una carga significativa.'
      },
      recommendation: {
        options: [
          'Implementar sistema de caché',
          'Optimizar consultas a la base de datos',
          'Aumentar recursos del servidor'
        ],
        correct: 'Implementar sistema de caché',
        feedback: 'Un sistema de caché es la mejor solución para mejorar los tiempos de respuesta al almacenar resultados frecuentes.'
      }
    },
    {
      requirement: 'La aplicación debe mantener un uptime del 99.9% durante el horario comercial.',
      variable: {
        options: ['Disponibilidad', 'Confiabilidad', 'Mantenibilidad', 'Estabilidad'],
        correct: 'Disponibilidad',
        feedback: 'La disponibilidad es la variable correcta ya que el uptime se refiere directamente al tiempo que el sistema está disponible.'
      },
      value: {
        options: ['Alta', 'Media', 'Baja', 'Crítica'],
        correct: 'Alta',
        feedback: 'Un uptime del 99.9% representa una alta disponibilidad, siendo este un estándar en servicios profesionales.'
      },
      recommendation: {
        options: [
          'Implementar sistema de redundancia',
          'Establecer monitoreo 24/7',
          'Realizar mantenimientos programados'
        ],
        correct: 'Implementar sistema de redundancia',
        feedback: 'La redundancia es clave para mantener alta disponibilidad, permitiendo que el sistema siga funcionando incluso si un componente falla.'
      }
    }
  ];

  private currentQuestionIndex = 0;
  private readonly timePerStep = 30; // 30 seconds per step

  getQuestions() {
    return this.questions;
  }

  getCurrentQuestion(): Question | null {
    if (this.currentQuestionIndex < this.questions.length) {
      return this.questions[this.currentQuestionIndex];
    }
    return null;
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    return this.getCurrentQuestion();
  }

  resetGame() {
    this.currentQuestionIndex = 0;
  }

  calculateScore(timeRemaining: number): number {
    return Math.max(0, timeRemaining);
  }
}