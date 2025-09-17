import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-contenedor',
  templateUrl: './info-contenedor.component.html',
  styleUrl: './info-contenedor.component.css'
})
export class InfoContenedorComponent implements OnInit {

  textoCompleto: string = [
    "¡Bienvenido/a a mi espacio de nutrición consciente! 🌱",
    "Aquí encontrarás todo lo necesario para tu bienestar:\n",
    "1. 📅 Agenda turnos para consultas personalizadas",
    "2. 🛍️ Compra productos naturales y suplementos",
    "3. 🥗 Descubre recetas divertidas y deliciosas",
    "4. 🎮 Y distraete por un rato en la sección de juegos!\n",
    " ❤️❤️❤️ "

  ].join('\n');

  textoVisible: string = '';

  ngOnInit(): void {
    this.escribirTexto();
  }

  escribirTexto() {
    this.textoVisible = '';
    let letra = 0;

    const intervalo = setInterval(() => {
      if (letra < this.textoCompleto.length) {
        if (this.textoCompleto.charAt(letra) === '\n') {
          this.textoVisible += '<br>';
        } else {
          this.textoVisible += this.textoCompleto.charAt(letra);
        }
        letra++;
      } else {
        clearInterval(intervalo);
      }
    }, 35); 
  }
}
