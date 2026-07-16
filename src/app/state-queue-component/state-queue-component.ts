import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SchedulerService} from '../scheduler-service';

@Component({
  selector: 'app-state-queue-component',
  imports: [
    RouterLink
  ],
  templateUrl: './state-queue-component.html',
  styleUrl: './state-queue-component.css',
})
export class StateQueueComponent {
  @Input() queueName: string = ''; //lo recibe del padre.
  protected currentID = '';
  constructor(private schedulerService: SchedulerService) {
    this.currentID = schedulerService.getCurrentSimulationID();
    console.log(this.currentID);
  }
  getQueueName(){
    return this.queueName;
  }
}
