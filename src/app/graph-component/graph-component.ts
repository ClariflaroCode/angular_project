import {Component, effect, signal} from '@angular/core';
import {StateQueueComponent} from '../state-queue-component/state-queue-component';
import {ActivatedRoute, Router} from '@angular/router';
import {SchedulerService} from '../scheduler-service';
import {ProcessService} from '../process-service';
import {SimulationService} from '../simulation-service';
import {i_process} from '../process-component/process-interface';

@Component({
  selector: 'app-graph-component',
  imports: [StateQueueComponent],
  templateUrl: './graph-component.html',
  styleUrl: './graph-component.css',
})
export class GraphComponent {
  states = ['new', 'ready', 'running', 'waiting', 'terminated'];
  private firstTime: boolean = true;

  procesos = signal<i_process[]>([]);
  constructor(
    private schedulerService: SchedulerService,
    private simulationService: SimulationService,
    private processService: ProcessService,
    private router: Router,
    private route: ActivatedRoute,

  ) {
  }
  private iniciarSimulacion() {
    this.processService.getAll("new").subscribe({
      next: procesos => {
        this.schedulerService.iniciarSimulacion(procesos);
        console.log(procesos);
        this.schedulerService.pasitoAPasitoSimulacion();
      },
      error: (err) => {
        if (err.status === 404) {
          //MOCKAPI TIRA ERROR DE ESTO SI ESTA VACIO EL RESULTADO, esta mal implementada
          //como angular me tira al tacho los componentes y me reinicia lo de first time tengo q usar esto porq al cambiar la
          //ruta me lo vuela y me da error porq se quiere meter aca..
          this.schedulerService.pasitoAPasitoSimulacion();
        }
        }
    });
  }
  protected siguientePaso(){
    if (this.firstTime){
       this.iniciarSimulacion();
       this.firstTime = false;
       return;
    }
    let ultimaSimulacion = this.schedulerService.pasitoAPasitoSimulacion();

    if(ultimaSimulacion){
      this.simulationService.post(ultimaSimulacion).subscribe({
        next: (data) => {
          this.router.navigate(['/estadisticas']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    } else {
      this.router.navigate(['/home']);
    }
  }

  protected ejecucionCompleta(){

    const ultimaSimulacion = this.schedulerService.ejecucionSimulacion();
    this.simulationService.post(ultimaSimulacion).subscribe({
      next: (data) => {
        this.router.navigate(['/estadisticas']);
      },
      error: (err) => console.error('Error al guardar:', err)
    });

  }
  public getClock(){
    return this.schedulerService.getClock();
  }
  public getNombreSimulacion(){
    return this.schedulerService.getCurrentSimulationName();
  }
  public getAlgoritmo(){
    return this.schedulerService.getAlgoritmo();
  }
}
