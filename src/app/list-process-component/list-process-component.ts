import {ChangeDetectorRef, Component, Injectable, Input, signal} from '@angular/core';
import {SimulationComponent} from '../simulation-component/simulation-component';
import {ProcessComponent} from '../process-component/process-component';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProcessService} from '../process-service';
import {i_process} from '../process-component/process-interface';
import {ActivatedRoute, Route, Router} from '@angular/router';
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

    this.route.queryParamMap.subscribe(params => {
      this.processService
        .getBySimulacion(params.get('state'), this.schedulerService.getCurrentSimulationID())
        .subscribe(procesos => this.procesos.set(procesos));
    });
  }
}
