export interface i_process{
  id: string | null,
  name: string,
  prioridad: number,
  burstTime: number,
  arrivalTime: number,
  waitingTime: number,
  completionTime: number,
  id_simulacion: string,
  state: string, // solo admite estos estados.
}
