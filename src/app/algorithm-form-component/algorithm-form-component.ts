import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ValidationError} from '@angular/forms/signals';
import { Router} from '@angular/router';
import {SimulationService} from '../simulation-service';
import {SchedulerService} from '../scheduler-service'; // Importamos Router

@Component({
  selector: 'app-algorithm-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './algorithm-form-component.html',
  styleUrl: './algorithm-form-component.css',
})
export class AlgorithmFormComponent {

  constructor(protected router: Router,
              protected simulationService: SimulationService,
              private schedulerService: SchedulerService,) {
  }
  algorithmForm = new FormGroup({
      simulationName: new FormControl('', Validators.required),
      algorithmName: new FormControl('', Validators.required),
  }, [this.validAlgorithm])



  protected onSubmit() {

    if (this.algorithmForm.valid) {
      this.schedulerService.setAlgoritmo(<string>this.algorithmForm.get('algorithmName')?.value);
      this.schedulerService.setCurrentSimulationName(<string>this.algorithmForm.get('simulationName')?.value);
      this.router.navigate(['/home']);
    }
  }

  private validAlgorithm(control: AbstractControl): ValidationError | null {
    const validAlgorithms = ['first_come_first_serve'];
    const valor = control.get('algorithmName')?.value;
    if (validAlgorithms.includes(valor))
      return null;
    else
      return { kind: 'error en el nombre del algoritmo'}; //no me tomaba ponerle invalidAlgorithm de key.

  }
}
