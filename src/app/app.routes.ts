import { Routes } from '@angular/router';
import {SimulationsListComponent} from './simulations-list-component/simulations-list-component';
import {AboutComponent} from './about-component/about-component';
import {CurrentSimulationGraph} from './current-simulation-graph/current-simulation-graph';
import {GraphComponent} from './graph-component/graph-component';

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
    path: 'procesos',
    component: AboutComponent
  },

];
