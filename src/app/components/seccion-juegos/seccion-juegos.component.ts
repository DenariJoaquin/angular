import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

interface IComida {
  strMealThumb: string;
  idMeal: number;
  strMeal: string;
}
interface IComidasApiResponse {
  meals: IComida[];
}

interface ICartas {
  UrlImagen: string;
  volteada: boolean;
  encontrada: boolean;
}

@Component({
  selector: 'app-seccion-juegos',
  templateUrl: './seccion-juegos.component.html',
  styleUrl: './seccion-juegos.component.css'
})


export class SeccionJuegosComponent {

  juegoIniciado: boolean = false;
  juegoGanado: boolean = false;
  cargando: boolean = false;

  cartas: {
    UrlImagen: string; 
    volteada: boolean; 
    encontrada: boolean 
  }[] = [];

  cartasVolteadas: {
    UrlImagen: string; 
    volteada: boolean; 
    encontrada: boolean 
  }[] = [];

  paresEncontrados:number = 0;
  comidasDisponibles: IComida[] = [];

  constructor(private http: HttpClient) {}
  
  obtenerTodasLasComidas(): Observable<IComida[]> {
    return this.http.get<IComidasApiResponse>('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian')
      .pipe(
        catchError(error => {
          console.error('Error al obtener las comidas:', error);
          return of({meals :[]});
        }),
        map(response => response.meals)
    );
  }

  private getRandomImagesFromAvailable(): string[] {
    const comidasMezcladas = [...this.comidasDisponibles].sort(() => Math.random() - 0.5);
    return comidasMezcladas.slice(0, 6).map(comida => comida.strMealThumb);
  }

  obtenerImagenesAleatorias() : Observable<string[]> {
    if (this.comidasDisponibles.length > 0) {
      return of(this.getRandomImagesFromAvailable());
    }

    else {
      return this.obtenerTodasLasComidas().pipe(
        map(comidas => {
          this.comidasDisponibles = comidas;
          return this.getRandomImagesFromAvailable();
        })
      );
    }
  }


  iniciarJuego(): void {
    this.cargando = true;
    this.cartasVolteadas = [];
    this.paresEncontrados = 0;
    this.juegoIniciado = true;
    this.juegoGanado = false;

    this.obtenerImagenesAleatorias().subscribe({
      next: imagenes => {
        if (imagenes.length === 0) {
          alert("No se pudieron cargar las imágenes. Intenta de nuevo.");
          this.cargando = false;
          return;
        }

        this.cartas = [...imagenes, ...imagenes]
          .sort(() => Math.random() - 0.5)
          .map(UrlImagen => ({
            UrlImagen,
            volteada: false,
            encontrada: false
          }));
        this.cargando = false;
      },
      error: (error: string) => {
        console.error("Error al iniciar juego:", error);
        alert("Ocurrió un error al iniciar el juego.");
        this.cargando = false;
      }
    });
  }
  

  voltearCarta(carta: ICartas) {
    if (this.cartasVolteadas.length < 2 && !carta.volteada && !carta.encontrada) {
      carta.volteada = true;
      this.cartasVolteadas.push(carta);

      if (this.cartasVolteadas.length === 2) {
        setTimeout(() => this.verificarPareja(), 800);
      }
    }
  }

  verificarPareja(): void {
    const [carta1, carta2] = this.cartasVolteadas;
    if (carta1.UrlImagen === carta2.UrlImagen) {
      carta1.encontrada = true;
      carta2.encontrada = true;
      this.paresEncontrados++;
      

      if (this.paresEncontrados === this.cartas.length / 2) {
        this.juegoGanado = true;
      }
    } else {
      carta1.volteada = false;
      carta2.volteada = false;
    }
    this.cartasVolteadas = [];
  }

  private resetearJuego(): void {
    this.juegoIniciado = false;
    this.juegoGanado = false;
    this.cartas = [];
    this.cartasVolteadas = [];
    this.paresEncontrados = 0;
  }

  reiniciarJuego(): void {
    this.resetearJuego();
  }

  jugarNuevamente(): void {
    this.juegoGanado = false;
    this.iniciarJuego();
  }
}
