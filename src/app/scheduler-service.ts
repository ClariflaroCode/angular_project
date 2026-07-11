import {Injectable, Service, signal} from '@angular/core';
import {i_process} from './process-component/process-interface';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  clock = 0;
  readyQueue = signal<i_process[]>([]);
  runningProceso = signal<i_process | null>(null);
  waitingQueue = signal<i_process[]>([]);
  terminatedQueue = signal<i_process[]>([]);

  algoritmoElegido = "FIFO";
  currentSimulation = "ejemplo";

  constructor() {

  }

  public getClock() {
    return this.clock;
  }

  public getAlgoritmo() {
    return this.algoritmoElegido;
  }
  public setAlgoritmo(algoritmo : string){
    this.algoritmoElegido = algoritmo;
  }
  public getCurrentSimulationName(){
    return this.currentSimulation;
  }
  public setCurrentSimulationName(name : string){
    this.currentSimulation = name;
  }

  public setClock(c: number) {
    this.clock = c;
  }

  public ejecutarSimulacion(newQueue: i_process[]) {
    this.setClock(0);

    let ultimaSimulacion = this.getLastSimulacion();

    let currentQuantum = 0;
    let localReady: i_process[] = [];
    let localWaiting: i_process[] = [];
    let localTerminated: i_process[] = [];
    let localRunning: i_process | null = null;

    console.log('entramos al ejecutar');
    while (
      (newQueue.length > 0 ||
        localReady.length > 0 ||
        localRunning != null ||
        localWaiting.length > 0) &&
      this.clock < 50
      ) {
      console.log('seguro bucle infinito aca');
      console.log(
        "clock:", this.clock,
        "new:", newQueue.length,
        "ready:", localReady.length,
        "running:", localRunning,
        "waiting:", localWaiting.length
      );
      console.log(newQueue);
      console.log("clock inicial:", this.getClock());

      for (const p of newQueue) {
        console.log(
          p.name,
          p.arrivalTime,
          typeof p.arrivalTime
        );
      }


      let i = 0;
      while (i < newQueue.length) {
        console.log(
          "clock:", this.getClock(),
          "arrival:", newQueue[i].arrivalTime
        );
        if (newQueue[i].arrivalTime == this.getClock()) {
          console.log("Eliminando", newQueue[i]);
          localReady.push(newQueue[i]);
          newQueue.splice(i, 1); //elimina a partir de la posicion i UN sólo elemento
          console.log("Nuevo tamaño:", newQueue.length);
          i--; //porque se hace un corrimiento, no quiero moverme de la pos.
        }
        i++;
      }
      //Mientras que haya procesos en new o ready o running o waiting debo seguir simulando. La simulacion termina cuando todos los procesos estan en terminated.

      // acá se ejecuta la funcion elegir que me hayan pasado por parámetro, dependiendo el algoritmo va a cambiar.
      if (!localRunning && localReady.length > 0) {
        localRunning = this.elegirProceso(localReady); // Asignamos el retorno
        if (localRunning)
          localRunning.state = "running";
      }

      // Incremento de waiting time
      for (let proceso of localReady) {
        proceso.waitingTime++;
      }

      if (localRunning) {
        localRunning.burstTime--;
        //currentQuantum++
        if (localRunning.burstTime == 0) {
          localRunning.state = "terminated";
          //updateProcesoEstado(runningProceso.ID, "terminated") //actualizo en la DB el estado del proceso
          localRunning.completionTime = this.getClock();
          localTerminated.push(localRunning);
          localRunning = null;
        }

        //currentQuantum = 0

      }
      this.clock++;
    }

    this.readyQueue.set(localReady);
    this.terminatedQueue.set(localTerminated);
    this.runningProceso.set(localRunning);

    return this.calcularEstadisticasSimulacion();
  }

  private getLastSimulacion() {

  }

  private elegirProceso(readyQueue: i_process[]) {
    let proceso;
    switch (this.algoritmoElegido) {
      case 'first_come_first_serve':
        proceso = this.FirstComeFirstServe(readyQueue);
        break;
      //aca se supone que irían todos, es demo muchachos :D
      default:
        proceso = this.FirstComeFirstServe(readyQueue);
        break;
    }
    return proceso;
  }

  private FirstComeFirstServe(readyQueue: i_process[]) {
    let proceso = readyQueue[0]; //nos guardamos el proceso elegido.
    readyQueue.splice(0, 1); //eliminamos el elemento de la fila de listos
    return proceso;
  }

//return clock, terminatedQueue


  private calcularEstadisticasSimulacion() {

    //TO-DO calcular avg waiting time, avg turnaround time, avg response time, cpu utilization, throughput
    //y guardar en la tabla estadisticas_simulacion
    let turnaround_time = 0;
    let waiting_time = 0;
    let contextSwitches = 0;

    let localTerminated = this.terminatedQueue();

    for (let proceso of localTerminated) {
      turnaround_time += proceso.completionTime - proceso.arrivalTime;
      waiting_time += proceso.waitingTime;
      contextSwitches++;

    }
    let averageTurnaroundTime = turnaround_time / localTerminated.length;
    let averageWaitingTime = waiting_time /localTerminated.length;
    let averageThroughput = localTerminated.length / this.getClock();

  /*
  ultima, err := queries.GetLastSimulacion(context.Background())
  if err != nil {
    log.Println("Error al obtener la última simulación:", err)
    return
  }*/
      const ultimaSimulacion = {
        name: this.getCurrentSimulationName(),
        process_time: this.getClock(),
        context_switches: contextSwitches,
        dispatch_latency: 0,
        average_turnaround_time: averageTurnaroundTime,
        average_waiting_time: averageWaitingTime,
        average_throughput: averageThroughput,
        algorithm: this.getAlgoritmo(),
        quantum: 10,
      }
      return ultimaSimulacion;
    }
}
