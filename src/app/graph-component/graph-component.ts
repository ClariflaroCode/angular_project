import { Component } from '@angular/core';
import {StateQueueComponent} from '../state-queue-component/state-queue-component';
import {Router} from '@angular/router';
import {SchedulerService} from '../scheduler-service';
import {ProcessService} from '../process-service';
import {SimulationService} from '../simulation-service';

@Component({
  selector: 'app-graph-component',
  imports: [StateQueueComponent],
  templateUrl: './graph-component.html',
  styleUrl: './graph-component.css',
})
export class GraphComponent {
  states = ['new', 'ready', 'running', 'waiting', 'terminated'];
  constructor(
    private schedulerService: SchedulerService,
    private simulationService: SimulationService,
    private processService: ProcessService,
    private router: Router
  ) {}

  protected onclick(){

    //TO-DO implementar metodo que busque por estado.

    this.processService.getAll().subscribe({
      next: (newQueue) => {
        const ultimaSimulacion = this.schedulerService.ejecutarSimulacion(newQueue);
        this.simulationService.post(ultimaSimulacion).subscribe({
          next: (data) => {
            this.router.navigate(['/estadisticas']);
          },
          error: (err) => console.error('Error al guardar:', err)
        });
      },
      error: (err) => console.error('Error al traer procesos:', err)
    });
  }
}
