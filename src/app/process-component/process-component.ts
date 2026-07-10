import {Component, Input, input} from '@angular/core';
import {i_process} from './process-interface';

@Component({
  selector: 'app-process-component',
  imports: [],
  templateUrl: './process-component.html',
  styleUrl: './process-component.css',
})

export class ProcessComponent {
  @Input()processData!: i_process;
  constructor() {
  }
}
