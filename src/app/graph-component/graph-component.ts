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
// El effect se ejecuta automáticamente cada vez que 'necesitaRefresco' cambia
    /*effect(() => { //esta cosita linda me acaba de solucionar un problema que llevo más de 10 horas peleando q es saber cuando pindonga se actualizó las cosas en mockapi,bah, ni siquiera sé si fue ese el problema, inicialmente eran race conditions, desp en el inspeccionar impecable en mockapi como el tuje y no se porq pero anduvo bien con esto que entiendo no hace mucha mas cosa q esperar y renderizar cuando terminaron las solicitudes http con los nuevos componentes, la verdad es q creo q intenté hacer esa cosita simple por demasiado mas rato del q queria :D
      const debeRefrescar = this.schedulerService.necesitaRefresco();

      if (debeRefrescar) {
        console.log("El backend terminó de actualizarse. Volviendo a pedir los datos actualizados...");

        this.cargarProcesosDesdeBackend();
      }
    });*/
  }
  cargarProcesosDesdeBackend() {
    this.processService.getAll().subscribe(procesos => {
      this.procesos.set(procesos);
    });
  }
  private iniciarSimulacion() {
    this.processService.getAll("new").subscribe({
      next: procesos => {
        this.schedulerService.iniciarSimulacion(procesos);
        console.log(procesos);
        this.schedulerService.pasitoAPasitoSimulacion();
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
