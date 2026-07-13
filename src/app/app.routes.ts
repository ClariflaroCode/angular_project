import { Routes } from '@angular/router';
import {SimulationsListComponent} from './simulations-list-component/simulations-list-component';
import {AboutComponent} from './about-component/about-component';
import {GraphComponent} from './graph-component/graph-component';
import {ProcessFormComponent} from './process-form-component/process-form-component';
import {AlgorithmFormComponent} from './algorithm-form-component/algorithm-form-component';
import {ListProcessComponent} from './list-process-component/list-process-component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: "full"
  },
  {
    path: 'home',
    component: GraphComponent
  },
  {
    path: 'estadisticas',
    component: SimulationsListComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'proceso',
    component: ProcessFormComponent
  },
  {
    path: 'algoritmo',
    component: AlgorithmFormComponent
  },
  {
    path: 'processes',
    component: ListProcessComponent
  },
  {
    path: '**', //por defecto
    redirectTo: 'home'  //datazo: si por alguna razon una de estas rutas tiene un / hace f5 y por el /home aca me borraba el clock del scheduler al navegar :D pese a estar en el servicio :')
  }
];
