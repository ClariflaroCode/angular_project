import {Component, signal} from '@angular/core';
import {SimulationComponent} from '../simulation-component/simulation-component';
import {i_process} from '../process-component/process-interface';
import {i_simulation} from '../simulation-component/simulation-interface';
import {ProcessService} from '../process-service';
import {SimulationService} from '../simulation-service';

@Component({
  selector: 'app-simulations-list-component',
  imports: [
    SimulationComponent
  ],
  templateUrl: './simulations-list-component.html',
  styleUrl: './simulations-list-component.css',
})
export class SimulationsListComponent {
  simulaciones = signal<i_simulation[]>([]);
  constructor(private servicioDeSimulaciones: SimulationService) {

  }
  ngOnInit(): void {

    this.servicioDeSimulaciones.getAll()
      .subscribe(simulaciones => {
        this.simulaciones.set(simulaciones);
        //this.cdr.detectChanges();
      });

  }
}
