import { Component, Input, signal} from '@angular/core';
import {ProcessComponent} from '../process-component/process-component';
import {ProcessService} from '../process-service';
import {i_process} from '../process-component/process-interface';
import {ActivatedRoute } from '@angular/router';
import {SchedulerService} from '../scheduler-service';

@Component({
  selector: 'app-list-process-component',
  imports: [
    ProcessComponent
  ],
  standalone: true,
  templateUrl: './list-process-component.html',
  styleUrl: './list-process-component.css',
})

export class ListProcessComponent {
  procesos = signal<i_process[]>([]);
  @Input() estadoParticular = '';

  constructor(
    private schedulerService: SchedulerService,
    private processService: ProcessService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    console.log(this.schedulerService.getCurrentSimulationID());

    this.route.queryParamMap.subscribe(params => {
      this.processService
        .getBySimulacion(params.get('state'), this.schedulerService.getCurrentSimulationID())
        .subscribe(procesos => this.procesos.set(procesos));
    });
  }
}
