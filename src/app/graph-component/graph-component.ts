import { Component } from '@angular/core';
import {StateQueueComponent} from '../state-queue-component/state-queue-component';
import {Router, RouterLink} from '@angular/router';
import {SchedulerService} from '../scheduler-service';
import {ProcessService} from '../process-service';
import {i_simulation} from '../simulation-component/simulation-interface';
import {SimulationService} from '../simulation-service';

@Component({
  selector: 'app-graph-component',
  imports: [StateQueueComponent, RouterLink],
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
  console.log('entre al componente');
    this.processService.getAll().subscribe({
      next: (newQueue) => {
        console.log('pase el primer get');
        const ultimaSimulacion = this.schedulerService.ejecutarSimulacion(newQueue);
        console.log("pase el ejecutar simulacion");
        this.simulationService.post(ultimaSimulacion).subscribe({
          next: (data) => {
            console.log("entramos al segundo suscribe");

            console.log('Simulación guardada:', data);

            this.router.navigate(['/estadisticas']);
          },
          error: (err) => console.error('Error al guardar:', err)
        });
      },
      error: (err) => console.error('Error al traer procesos:', err)
    });
  }
}
