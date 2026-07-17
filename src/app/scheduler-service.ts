import {Injectable, signal} from '@angular/core';
import {i_process} from './process-component/process-interface';
import {ProcessService} from './process-service';
import {i_simulation} from './simulation-component/simulation-interface';
import {popResultSelector} from 'rxjs/internal/util/args';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  clock = 0;
  newQueue = signal<i_process[]>([]);
  readyQueue = signal<i_process[]>([]);
  runningProceso = signal<i_process | null>(null);
  waitingQueue = signal<i_process[]>([]);
  terminatedQueue = signal<i_process[]>([]);
  public necesitaRefresco = signal<boolean>(false);


  algoritmoElegido = "FIFO";
  currentSimulation = "ejemplo";
  private currentSimulationID: string = '';

  constructor(private processService: ProcessService) {

  }

  public getClock() {
    return this.clock;
  }

  public getAlgoritmo() {
    return this.algoritmoElegido;
  }
  public setAlgoritmo(algoritmo : string){
    this.algoritmoElegido = algoritmo;
    //COMO CAMBIAR EL NOMBRE O EL ALGORITMO IMPLICA UNA NUEVA SIMULACION, TENGO QUE LIMPIAR LAS SEÑALES.
    this.reset();
  }
  public getCurrentSimulationName(){
    return this.currentSimulation;
  }
  public setCurrentSimulationName(name : string){
    this.currentSimulation = name;
    this.reset();
  }
  public setCurrentSimulationID(id: string) {
    this.currentSimulationID = id;
    console.log("se seteo el nuevo id: "+ this.currentSimulationID);
  }
  public getCurrentSimulationID(){
    return this.currentSimulationID;
  }
  public setClock(c: number) {
    this.clock = c;
  }
  public ejecucionSimulacion(){
    let sim: i_simulation = {
      algorithm: this.getAlgoritmo(),
      average_throughput: 0,
      average_turnaround_time: 0,
      average_waiting_time: 0,
      context_switches: 0,
      dispatch_latency: 0,
      id: null,
      name: this.getCurrentSimulationName(),
      process_time: 0,
      quantum: 0
    };
    let sim2: i_simulation | null = null;
    while (
      (this.newQueue().length > 0 ||
        this.readyQueue().length > 0 ||
        this.runningProceso() != null ||
        this.waitingQueue().length > 0)
      ) {
      const resultadoPaso = this.pasitoAPasitoSimulacion(false);
      if (resultadoPaso !== null) {
        sim2 = resultadoPaso;
        break;
      }
    }
    if (sim2)
      return sim2;
    else
      return sim; //nunca deberia entrar aca pero bueno..

  }
  public iniciarSimulacion(procesos: i_process[]) {
    this.newQueue.set([...procesos]);
    this.reset();

  }
  private reset(){
    this.clock = 0;

    this.readyQueue.set([]);
    this.waitingQueue.set([]);
    this.runningProceso.set(null);
    this.terminatedQueue.set([]);
  }
  public pasitoAPasitoSimulacion(guardarPasosIntermedios: boolean = true){
    //acá hace el pasito a pasito y el usuario tiene que ir tocando el boton para que avance el scheduler.
    console.log("ANTES", {
      clock: this.clock,
      new: this.newQueue().length,
      ready: this.readyQueue().length,
      running: this.runningProceso(),
      waiting: this.waitingQueue().length,
      terminated: this.terminatedQueue().length
    });
    let newQueue: i_process[] = [...this.newQueue()];
    let localReady: i_process[] = [...this.readyQueue()];
    let localWaiting: i_process[] = [...this.waitingQueue()];
    let localTerminated: i_process[] = [...this.terminatedQueue()];
    let localRunning: i_process | null = this.runningProceso() ? { ...this.runningProceso()! } : null;

      let i = 0;
      while (i < newQueue.length) {

        if (newQueue[i].arrivalTime == this.getClock()) {
          newQueue[i].state = 'ready';

          localReady.push(newQueue[i]);

          newQueue.splice(i, 1); //elimina a partir de la posicion i UN sólo elemento
          i--; //porque se hace un corrimiento, no quiero moverme de la pos.
        }
        i++;
      }
      //Mientras que haya procesos en new o ready o running o waiting debo seguir simulando. La simulacion termina cuando todos los procesos estan en terminated.

      // acá se ejecuta la funcion elegir que me hayan pasado por parámetro, dependiendo el algoritmo va a cambiar.
      if (!localRunning && localReady.length > 0) {
        localRunning = this.elegirProceso(localReady); // Asignamos el retorno
        if (localRunning) {
          localRunning.state = "running";

        }
      }

      // Incremento de waiting time
      for (let proceso of localReady) {
        proceso.waitingTime++;
      }

      if (localRunning) {
        localRunning.burstTime--;
        if (localRunning.burstTime == 0) {

          localRunning.state = 'terminated';
          localRunning.completionTime = this.getClock();
          localTerminated.push(localRunning);

          localRunning = null;
        }
      }
      this.clock++;

    this.newQueue.set(newQueue);
    this.readyQueue.set(localReady);
    this.terminatedQueue.set(localTerminated);
    this.runningProceso.set(localRunning);

    if (guardarPasosIntermedios) {
      this.actualizarProcesos(
        localReady,
        localRunning,
        localTerminated
      );
    }
    //this.actualizarProcesos();

    console.log("DESPUÉS", {
      clock: this.clock,
      new: this.newQueue().length,
      ready: this.readyQueue().length,
      running: this.runningProceso(),
      waiting: this.waitingQueue().length,
      terminated: this.terminatedQueue().length
    });
    if (
      this.newQueue().length == 0 &&
      this.readyQueue().length == 0 &&
      this.runningProceso() == null &&
      this.waitingQueue().length == 0){
      console.log("TERMINÓ LA SIMULACIÓN");
      //this.setClock(0);
      const ultima = this.calcularEstadisticasSimulacion();
      this.setClock(0);
      console.log(ultima);
      return ultima;
    }
    return null;
  }

 private actualizarProcesos(
    ready: i_process[],
    running: i_process | null,
    terminated: i_process[]
  ) {
    this.necesitaRefresco.set(false);

    const listaAActualizar: i_process[] = [];

    ready.forEach(p => listaAActualizar.push(p));
    if (running) listaAActualizar.push(running);
    terminated.forEach(p => listaAActualizar.push(p));

    if (listaAActualizar.length === 0) {
      this.necesitaRefresco.set(true);
      return;
    }

    const enviarSiguiente = (index: number) => {
      if (index >= listaAActualizar.length) {
        console.log("¡TODOS los procesos se guardaron secuencialmente en MockAPI!");
        this.necesitaRefresco.set(true); // Recién acá le avisamos al componente que refresque
        return;
      }

      const proceso = listaAActualizar[index];

      if (proceso.id) {
        this.processService.update(proceso.id, structuredClone(proceso)).subscribe({
          next: () => {
            console.log(`MockAPI guardó con éxito el ID ${proceso.id} -> Estado: ${proceso.state}`);
            enviarSiguiente(index + 1);
          },
          error: (err) => {
            console.error(`Error al guardar ID ${proceso.id}:`, err);
            enviarSiguiente(index + 1);
          }
        });
      } else {
        enviarSiguiente(index + 1);
      }
    };

    enviarSiguiente(0);
  }

  private elegirProceso(readyQueue: i_process[]) {
    let proceso;
    switch (this.algoritmoElegido) {
      case 'first_come_first_serve':
        proceso = this.FirstComeFirstServe(readyQueue);
        break;
      case 'shortest_job_first':
        proceso = this.shortestJobFirst(readyQueue);
        break;
      case 'priority':
        proceso = this.PriorityAlgorithm(readyQueue);
        break;//aca se supone que irían todos, es demo muchachos :D
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

  private buscaPosMenor(readyQueue: i_process[]) {
    let posMenor: number  = 0;
    for (let i=0; i < readyQueue.length; i++){
      if (readyQueue[i].burstTime < readyQueue[posMenor].burstTime){
        posMenor = i;
      }
    }
    return posMenor;
  }
  private shortestJobFirst(readyQueue: i_process[]) {
    //sin desalojo
    let posMin = this.buscaPosMenor(readyQueue);
    let proceso = readyQueue[posMin];
    readyQueue.splice(posMin,1);
    return proceso;
  }
/*func ShortestJobFirstPreemptive(ready []*db.Proceso, running *db.Proceso) (*db.Proceso, []*db.Proceso) {
  if len(ready) > 0{ //como es con desalojo, no importa si hay o no un proceso en ejecución en el scheduler, se desaloja si llega alguno con menos burst time.
    posMin := buscaMenor(ready)
    if running != nil {
      if running.BurstTime > ready[posMin].BurstTime {
        running.Estado = "ready"
        ready = append(ready, running) //el proceso que estaba en ejecución vuelve a la fila de ready
      } else {
        return running, ready
      }
    }

    running = ready[posMin]
    running.Estado = "running"
    ready = append(ready[:posMin], ready[posMin+1:]...) //elimina el elemento minimo de ready.

  }
  return running, ready
}

 */
  private  buscarProcesoDeMayorPrioridad(readyQueue: i_process[]) {
    let posMayor: number = 0;
    for (let i = 0; i < readyQueue.length; i++){
      if (readyQueue[i].prioridad < readyQueue[posMayor].prioridad){
        posMayor = i;
      }
    }
    return posMayor;
  }
  private PriorityAlgorithm(readyQueue: i_process[]){
    let posMayor = this.buscarProcesoDeMayorPrioridad(readyQueue);
    let proceso = readyQueue[posMayor];
    readyQueue.splice(posMayor, 1);
    return proceso;
  }

  private calcularEstadisticasSimulacion() {

    let turnaround_time = 0;
    let waiting_time = 0;
    let contextSwitches = 0;

    let localTerminated = this.terminatedQueue();

    for (let proceso of localTerminated) {
      turnaround_time += proceso.completionTime - proceso.arrivalTime;
      waiting_time += proceso.waitingTime;
      contextSwitches++;
      console.log('turnaround' + turnaround_time);
      console.log('waiting'+waiting_time);
      console.log('context switches'+contextSwitches);
    }
    console.log('reloj' + this.clock);
    let averageTurnaroundTime = turnaround_time / localTerminated.length;
    let averageWaitingTime = waiting_time /localTerminated.length;
    let averageThroughput = localTerminated.length / this.getClock();

    console.log('cantidad de procesos terminados:' + localTerminated.length);

      const ultimaSimulacion = {
        id: null,
        name: this.getCurrentSimulationName(),
        process_time: this.getClock(),
        context_switches: contextSwitches,
        dispatch_latency: 0,
        average_turnaround_time: averageTurnaroundTime,
        average_waiting_time: averageWaitingTime,
        average_throughput: averageThroughput,
        algorithm: this.getAlgoritmo(),
        quantum: 0,
      }
      return ultimaSimulacion;
    }


}
