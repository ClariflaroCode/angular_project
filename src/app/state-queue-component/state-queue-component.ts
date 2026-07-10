import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-state-queue-component',
  imports: [
    RouterLink
  ],
  templateUrl: './state-queue-component.html',
  styleUrl: './state-queue-component.css',
})
export class StateQueueComponent {
  @Input() queueName: string = '';
  constructor() {
    //private queueName: string; me sigue pareciendo mágico y loco que lo de arriba haga la declaracion del atributo, cree el parametro formal y a su vez lo asigne.
  }
  getQueueName(){
    return this.queueName;
  }
}
