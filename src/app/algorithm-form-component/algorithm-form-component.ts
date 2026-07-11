import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {i_process} from '../process-component/process-interface';
import {i_simulation} from '../simulation-component/simulation-interface';
import {ValidationError} from '@angular/forms/signals';
import { Router} from '@angular/router';
import {SimulationService} from '../simulation-service'; // Importamos Router

@Component({
  selector: 'app-algorithm-form-component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './algorithm-form-component.html',
  styleUrl: './algorithm-form-component.css',
})
export class AlgorithmFormComponent {

  constructor(protected router: Router, protected simulationService: SimulationService) {
  }
  algorithmForm = new FormGroup({
      simulationName: new FormControl('', Validators.required),
      algorithmName: new FormControl('', Validators.required),
  }, [this.validAlgorithm])



  protected onSubmit() {

    if (this.algorithmForm.valid) {
      console.log('Datos del formulario:', this.algorithmForm.value);
      /*const simulacion = this.algorithmForm.getRawValue();
      this.simulationService.post(simulacion).subscribe({
        next: (response) => {
          console.log('Simulación guardada con éxito:', response);

          // 3. REDIRECCIÓN:
          // Una vez que el POST fue exitoso, redirigimos al usuario [5]
          this.router.navigate(['/simulation']);
        },
        error: (err) => {
          console.error('Error al guardar la simulación:', err);
        }
      });*/
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
