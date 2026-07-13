export interface i_process{
  id: string | null,
  name: string,
  priority: number,
  burstTime: number,
  arrivalTime: number,
  waitingTime: number,
  completionTime: number,
  state: string, // solo admite estos estados.
}
