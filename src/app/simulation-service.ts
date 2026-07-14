import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {i_simulation} from './simulation-component/simulation-interface';

const recurso = "simulacion";
const URL = "https://6a5138efc576c846dcba4183.mockapi.io/" + recurso;

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private currentID= '';
  constructor(private http: HttpClient) { }

  public getAll(): Observable<i_simulation[]> {
    return this.http.get<i_simulation[]>(URL);
  }
  public post(simulation: i_simulation): Observable<HttpEvent<i_simulation>> {
    return this.http.post<i_simulation>(URL, simulation, {
      observe: 'events'
    });
  }
  public getUltima(): Observable<i_simulation | null> {
    return this.getAll().pipe(
      map((simulaciones: i_simulation[]) => {
        if (!simulaciones || simulaciones.length === 0) {
          return null;
        }
        return simulaciones[simulaciones.length - 1];
      })
    );
  }

  /* Dejo constancia de que la siguiente función me hizo sufrir un ratito hasta que vi que hace esto:
  public getUltima(): Observable<i_simulation[]> {
    const params = new HttpParams()
      .set('limit', '1')
      .set('sortBy', 'id')
      .set('order', 'desc');
    return this.http.get<any[]>(URL, { params });
  }simulacion?limit=1&sortBy=id&order=desc y devuelve:
  [{"name":"simi","process_time":0,"context_switches":0,"dispatch_latency":0,"average_turnaround_time":null,"average_waiting_time":null,"average_throughput":null,"algorithm":"first_come_first_serve","quantum":10,"id":"9"},{"name":"simulacion 1","process_time":0,"context_switches":0,"dispatch_latency":0,"average_turnaround_time":null,"average_waiting_time":null,"average_throughput":null,"algorithm":"first_come_first_serve","quantum":10,"id":"8"},{"name":"Juli Alvarez","process_time":0,"context_switches":3,"dispatch_latency":0,"average_turnaround_time":1,"average_waiting_time":1,"average_throughput":null,"algorithm":"first_come_first_serve","quantum":10,"id":"7"},{"name":"simuuuuuuuuuuuuuuuu","process_time":0,"context_switches":3,"dispatch_latency":0,"average_turnaround_time":1,"average_waiting_time":1,"average_throughput":null,"algorithm":"first_come_first_serve","quantum":10,"id":"6"},{"name":"piiii","process_time":0,"context_switches":4,"dispatch_latency":0,"average_turnaround_time":2.25,"average_waiting_time":2,"average_throughput":null,"algorithm":"first_come_first_serve","quantum":10,"id":"5"},{"name":"wiii","process_time":0,"context_switches":0,"dispatch_latency":0,"average_turnaround_time":null,"average_waiting_time":null,"average_throughput":null,"algorithm":"first_come_first_serve","quantum":10,"id":"4"},{"name":"simur","process_time":0,"context_switches":0,"dispatch_latency":0,"average_turnaround_time":null,"average_waiting_time":null,"average_throughput":null,"algorithm":"first_come_first_serve","quantum":10,"id":"3"},{"name":"simuuuuuu","process_time":0,"context_switches":0,"dispatch_latency":0,"average_turnaround_time":null,"average_waiting_time":null,"average_throughput":null,"algorithm":"first_come_first_serve","quantum":10,"id":"2"},{"name":"pato","process_time":0,"context_switches":0,"dispatch_latency":0,"average_turnaround_time":0,"average_waiting_time":0,"average_throughput":0,"algorithm":"first_come_first_serve","quantum":0,"id":"11"},{"name":"laur","process_time":0,"context_switches":0,"dispatch_latency":0,"average_turnaround_time":0,"average_waiting_time":0,"average_throughput":0,"algorithm":"first_come_first_serve","quantum":0,"id":"10"},{"name":"simur","process_time":0,"context_switches":0,"dispatch_latency":0,"average_turnaround_time":null,"average_waiting_time":null,"average_throughput":null,"algorithm":"first_come_first_serve","quantum":10,"id":"1"}]
   Por orden lexicografico, q tiene todo el sentido del mundo pero yo seguia pensando q me diría sisisi,
   te devuelvo el 11 q es el ultimo id, y no que el id 9 es más grande que el 11.... y ademas me devolvió más de un elemento
   cuando le puse limit, todo mal jajaja mockapi siempre haciendo sufrir.
   */



}
