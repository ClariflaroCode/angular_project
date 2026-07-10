export interface i_process{
  name: string,
  priority: number,
  burstTime: number,
  arrivalTime: number,
  state: 'new' | 'ready' | 'waiting' | 'terminated' | 'running', // solo admite estos estados.
}
