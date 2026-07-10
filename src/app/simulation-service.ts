import {Injectable} from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import {Observable} from 'rxjs';
import {i_simulation} from './simulation-component/simulation-interface';

const recurso = "simulacion";
const URL = "https://6a5138efc576c846dcba4183.mockapi.io/" + recurso;

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  constructor(private http: HttpClient) { }

  public getAll(): Observable<i_simulation[]> {
    return this.http.get<i_simulation[]>(URL);
  }
  public post(simulation: i_simulation): Observable<HttpEvent<i_simulation>> {
    return this.http.post<i_simulation>(URL, simulation, {
      observe: 'events'
    });
  }


}
