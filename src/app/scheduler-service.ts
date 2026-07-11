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
  constructor() {

  }
  public getClock(){
    return this.clock;
  }
  public getAlgoritmo() {
    return this.algoritmoElegido;
  }
  public setClock( c: number) {
  this.clock = c;
  }

  public ejecutarSimulacion(newQueue: i_process[]){
    this.setClock(0);

    let ultimaSimulacion = this.getLastSimulacion();

    let  currentQuantum = 0;
    let localReady: i_process[] = [];
    let localWaiting: i_process[] = [];
    let localTerminated: i_process[] = [];
    let localRunning: i_process | null = null;


    while (newQueue.length > 0 ||
            localReady.length > 0 ||
            localRunning != null ||
            localWaiting.length > 0
      )
    {
      let i = 0;
      while (i < newQueue.length) {
        if (newQueue[i].arrivalTime == this.getClock()) {
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
        if (localRunning)
          localRunning.state = "running";
      }

      // Incremento de waiting time
      for (let proceso of localReady){
        proceso.waitingTime++;
      }

      if (localRunning) {
        localRunning.burstTime--;
        //currentQuantum++
        if (localRunning.burstTime == 0) {
          localRunning.state = "terminated";
          //updateProcesoEstado(runningProceso.ID, "terminated") //actualizo en la DB el estado del proceso
          localRunning.completionTime = this.getClock();
        }
        localTerminated.push(localRunning);
        localRunning = null;
        //currentQuantum = 0

      }
      this.clock++;
    }

              /*
              if ultima.Quantum.Valid { //ROUND ROBIN
                if  (currentQuantum == ultima.Quantum.Int32) {
                  runningProceso.Estado = "ready"
                  readyQueue = append(readyQueue, runningProceso)
                  runningProceso = nil
                  currentQuantum = 0
                  if len(readyQueue) > 0 {
                    runningProceso = readyQueue[0]
                    //contextSwitches++
                    runningProceso.Estado = "running"
                    //updateProcesoEstado(readyQueue[0].ID, "running") //actualizo en la DB el estado del proceso
                    readyQueue = readyQueue[1:] //elimino el primer elemento de la lista de ready, la ready queue se volvio la ready queue
                  }
                }
              }*/

    this.readyQueue.set(localReady);
    this.terminatedQueue.set(localTerminated);
    this.runningProceso.set(localRunning);



}

  private getLastSimulacion() {

  }

  private elegirProceso(readyQueue: i_process[]) {

    let proceso=  readyQueue[0];
    return proceso;
  }
//return clock, terminatedQueue

//}
/*
func FirstComeFirstServe(ready []*db.Proceso, running *db.Proceso) (*db.Proceso, []*db.Proceso){ //NOTA: los primeros parentesis son los parametros de entrada, los segundos los de salida

  //Tomo el primer elemento de la lista de ready y lo paso a running si está disponible para ejecutar
  if running != nil {
    return running, ready
  }
  if len(ready) > 0 {
    running = ready[0]
    //contextSwitches++
    running.Estado = "running"
    //updateProcesoEstado(readyQueue[0].ID, "running") //actualizo en la DB el estado del proceso
    ready = ready[1:] //elimino el primer elemento de la lista de ready, la ready queue se volvio la ready queue
    // empezando desde el segundo elemento hasta el final por eso 1:. En go la longitud se indica con min:max
  }
  return running, ready
}*/

}
