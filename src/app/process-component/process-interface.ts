export interface i_process{

  name: string,
  priority: number,
  burstTime: number,
  arrivalTime: number,
  waitingTime: number,
  completionTime: number,
  state: string, // solo admite estos estados.
}
