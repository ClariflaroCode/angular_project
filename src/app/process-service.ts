import {Injectable, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProcessComponent} from './process-component/process-component';
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

  /** Consume la API de cervezas y devuelve un observable a la respuesta. */
  public getAll(): Observable<i_process[]> {
    // fetch('url', {method: 'GET'})
    return this.http.get<i_process[]>(URL);
  }

}
