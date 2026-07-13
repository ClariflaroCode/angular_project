import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {i_process} from './process-component/process-interface';

const recurso = "proceso";
const URL = "https://6a5138efc576c846dcba4183.mockapi.io/" + recurso;

@Injectable({
  providedIn: 'root'
}) //en vez de hacer new, se inyecta el servicio por inyeccion de dependencias


//@Service()  //SUPUESTAMENTE no necesita usar el decorador @Injectable y este nuevo decorador hace lo mismo que arriba, lo veremos en el próximo capítulo muchachos. :D PD: Se rompió todo :D
//[ERROR] NG2028: @Service class cannot use constructor dependency injection. Use the `inject` function instead. <--adjunto error por si les pasa con otro alumno, tamb tira error si tenes los dos. automaticamente te crea el de @service con el comando
export class ProcessService {
  constructor(
    private http: HttpClient,

  ) { }

  public post(process: i_process): Observable<HttpEvent<i_process>> {
    return this.http.post<i_process>(URL, process, {
      observe: 'events'
    });
  }

  public getAll(estado: string | null = null): Observable<i_process[]> {
      // NOTA: ES IMPORTANTE RECORDAR QUE MOCKAPI ME VA A TIRAR ERROR 404 CADA VEZ Q TENGA UN ARRAY VACIO, PORQUE RESPONDE
    //ASI LA API, ESTA MAL QUE RESPONDA ASI PERO NO LA PROGRAMÉ YO WEY :d ESTO LO VIMOS EN WEB 1.
    let params = new HttpParams();

    if (estado) {
      params = params.set('state', estado);
    }

    return this.http.get<i_process[]>(URL, { params });
  }
  public update(id: string, processData: i_process): Observable<i_process> {
    console.log("PUT", id, structuredClone(processData));
    return this.http.put<i_process>(URL + "/" + id, processData);
  }
}
