import {Injectable, Service, signal} from '@angular/core';
import {i_process} from './process-component/process-interface';
import {ProcessService} from './process-service';
import {i_simulation} from './simulation-component/simulation-interface';

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
    //el problema debe estar en la linea de abajo. CORREGIR :d
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
    //const simulacion = this.calcularEstadisticasSimulacion();
    //this.setClock(0);

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
  ) {  //Esta funcion realmente no sé si está salvando algo, la idea era controlar un poco mejor las solicitudes http porq creo que tuve problemas de race conditions..
    // 1. Apagamos el refresco temporalmente
    this.necesitaRefresco.set(false);

    // 2. Juntamos todos los procesos que cambiaron en una lista única plana
    const listaAActualizar: i_process[] = [];

    ready.forEach(p => listaAActualizar.push(p));
    if (running) listaAActualizar.push(running);
    terminated.forEach(p => listaAActualizar.push(p));

    // Si no hay nada que actualizar, nos vamos
    if (listaAActualizar.length === 0) {
      this.necesitaRefresco.set(true);
      return;
    }

    // 3. FUNCIÓN MÁGICA: Envía un proceso a la vez en fila
    const enviarSiguiente = (index: number) => {
      // Si ya enviamos todos los procesos de la lista...
      if (index >= listaAActualizar.length) {
        console.log("¡TODOS los procesos se guardaron secuencialmente en MockAPI!");
        this.necesitaRefresco.set(true); // Recién acá le avisamos al componente que refresque
        return;
      }

      const proceso = listaAActualizar[index];

      if (proceso.id) {
        // Mandamos el PUT del proceso actual
        this.processService.update(proceso.id, structuredClone(proceso)).subscribe({
          next: () => {
            console.log(`MockAPI guardó con éxito el ID ${proceso.id} -> Estado: ${proceso.state}`);
            // CUANDO TERMINA ESTE, recién ahí llamamos al siguiente de la fila
            enviarSiguiente(index + 1);
          },
          error: (err) => {
            console.error(`Error al guardar ID ${proceso.id}:`, err);
            // Si falla uno, seguimos con el siguiente para que no se trabe la app
            enviarSiguiente(index + 1);
          }
        });
      } else {
        enviarSiguiente(index + 1);
      }
    };

    enviarSiguiente(0);
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
