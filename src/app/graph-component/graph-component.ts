import {Component, signal} from '@angular/core';
import {StateQueueComponent} from '../state-queue-component/state-queue-component';
import {Router} from '@angular/router';
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
  protected firstTime: boolean = true;

  procesos = signal<i_process[]>([]);
  constructor(
    private schedulerService: SchedulerService,
    private simulationService: SimulationService,
    private processService: ProcessService,
    private router: Router,

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
    if (!this.datosSimulacionValidos()) {
      alert('Falta completar el formulario de simulacion');
      return;
    }
    if (this.firstTime){
       this.iniciarSimulacion();
       this.firstTime = false;
       return;
    }
    let ultimaSimulacion = this.schedulerService.pasitoAPasitoSimulacion();

    if(ultimaSimulacion){
      this.simulationService.post(ultimaSimulacion).subscribe({
        next: () => {
          this.router.navigate(['/estadisticas']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    } else {
      this.router.navigate(['/home']);
    }
  }

  protected ejecucionCompleta(){
    if (!this.datosSimulacionValidos()) {
      console.log(this.getNombreSimulacion() +' , '+ this.getAlgoritmo());
      alert('Falta completar el formulario de simulacion');
      return;
    }
    this.processService.getAll("new").subscribe({
      next: (procesos) => {
        if (procesos.length === 0) {
          alert("No hay procesos nuevos para simular.");
          //jajaja sí me estoy dando cuenta q definitivamente sería mejor que puedas ejecutar un siguiente paso
          //y si te aburris tocar el ejecucion completa para que termine sola, pero eso
          //no fue planeado desde un inicio en el diseño. Para que quede claro que esa genial idea no la pensé
          // veré si puedo ponerle el boton celeste.
          return;
        }

        this.schedulerService.iniciarSimulacion(procesos);

        const ultimaSimulacion = this.schedulerService.ejecucionSimulacion();
        this.simulationService.post(ultimaSimulacion).subscribe({
          next: () => {
            this.router.navigate(['/estadisticas']);
          },
          error: (err) => console.error('Error al guardar:', err)
        });
      }
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


  protected datosSimulacionValidos() {
    if (this.getAlgoritmo() == "FIFO" ||
      (this.getNombreSimulacion() == "ejemplo" || this.getNombreSimulacion() == '' ))
    {
      return false;
    }
    return true;
  }
}
