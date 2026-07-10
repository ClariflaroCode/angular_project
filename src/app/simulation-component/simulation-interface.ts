export interface i_simulation{
  id: number,
  simulation_name: string,
  process_time: number,
  context_switches: number,
  dispatch_latency: number,
  average_turnaround_time: number,
  average_waiting_time: number,
  average_throughput: number,
  algorithm: string,
  quantum: number,
}
