import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-separador-info',
  templateUrl: './separador-info.component.html',
  styleUrl: './separador-info.component.css'
})
export class SeparadorInfoComponent {
  @Input() activeSection: 'posts' | 'juegos' | 'turnos' | 'productos' = 'posts';
  @Output() sectionChange = new EventEmitter<'posts' | 'juegos' | 'turnos' | 'productos'>();

  selectSection(section: 'posts' | 'juegos' | 'turnos' | 'productos') {
    this.sectionChange.emit(section);
  }
}
