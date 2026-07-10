import {Component, Injectable} from '@angular/core';
import {SimulationComponent} from '../simulation-component/simulation-component';
import {ProcessComponent} from '../process-component/process-component';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProcessService} from '../process-service';
import {i_process} from '../process-component/process-interface';

@Component({
  selector: 'app-list-process-component',
  imports: [
    SimulationComponent,
    ProcessComponent
  ],
  templateUrl: './list-process-component.html',
  styleUrl: './list-process-component.css',
})

export class ListProcessComponent {
  procesos:  i_process[] = [];
  constructor(private servicioDeProcesos: ProcessService) {
  }
  ngOnInit(): void {
    this.servicioDeProcesos.getAll()
      .subscribe(procesos => this.procesos = procesos);
  }
}
