import {Injectable} from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
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
  constructor(private http: HttpClient) { }


  public getAll(): Observable<i_process[]> {

    return this.http.get<i_process[]>(URL);
  }
  public post(process: i_process): Observable<HttpEvent<i_process>> {
    return this.http.post<i_process>(URL, process, {
      observe: 'events'
    });
  }


}
