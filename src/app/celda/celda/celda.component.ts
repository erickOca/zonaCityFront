import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-celda',
  template: `
    <td [style.background-color]="fondoColor">
      <div *ngIf="mostrarCirculo" class="circulo"></div>
      <span>{{ index + 1 }}</span>
    </td>
  `,
  styles: [`
    .circulo {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: black;
      display: inline-block;
    }
  `]
})
export class CeldaComponent {
  @Input() fondoColor: string = 'transparent';
  @Input() mostrarCirculo: boolean = false;
  @Input() index: number = 0;
}
