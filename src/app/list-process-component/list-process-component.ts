import {ChangeDetectorRef, Component, Injectable, Input, signal} from '@angular/core';
import {SimulationComponent} from '../simulation-component/simulation-component';
import {ProcessComponent} from '../process-component/process-component';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProcessService} from '../process-service';
import {i_process} from '../process-component/process-interface';
import {ActivatedRoute, Route, Router} from '@angular/router';

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
    private servicioDeProcesos: ProcessService,
    private processService: ProcessService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
/*
    this.servicioDeProcesos.getAll()
      .subscribe(procesos => {
        this.procesos.set(procesos);
        //this.cdr.detectChanges();
      });
*/
    this.route.queryParamMap.subscribe(params => {
      this.processService
        .getAll(params.get('state'))
        .subscribe(procesos => this.procesos.set(procesos));
    });
  }
}
