import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {i_process} from '../process-component/process-interface';
import {Router} from '@angular/router';
import {ProcessService} from '../process-service';
import {SchedulerService} from '../scheduler-service';

@Component({
  selector: 'app-process-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './process-form-component.html',
  styleUrl: './process-form-component.css',
})
export class ProcessFormComponent {
  constructor(
    protected router: Router,
    protected processService: ProcessService,
    protected schedulerService: SchedulerService
  ) {
  }
  processForm = new FormGroup({
    processName: new FormControl('proceso', { nonNullable: true , validators: [Validators.required]}),
    prioridad: new FormControl(0, { nonNullable: true , validators: [Validators.required, Validators.min(0)]}),
    burstTime: new FormControl(1, { nonNullable: true , validators: [Validators.required, Validators.min(0)]}),
    arrivalTime: new FormControl(0,  { nonNullable: true , validators: [Validators.required, Validators.min(0)]}),
    //state: new FormControl('new')
  })
  onSubmit(){
    if  (this.processForm.valid) {
      console.log('Datos del formulario:', this.processForm.value);

      const proceso = this.processForm.getRawValue();

      /*
      let processName = this.processForm.get("processName")?.value;
      let priority = this.processForm.get("priority")?.value;
      let burstTime = this.processForm.get("burstTime")?.value;
      let arrivalTime = this.processForm.get("arrivalTime")?.value;


      if(!processName) {
        processName = '';
      }
      if (!priority) {
        priority = 0;
      }
      if (!burstTime) {
        burstTime = 1;
      }
      if (!arrivalTime) {
        arrivalTime = 0;
      }
      */
      const state = "new";
      const process: i_process  = {
        id: null,
        name: proceso.processName,
        prioridad: proceso.prioridad,
        burstTime: proceso.burstTime,
        arrivalTime: proceso.arrivalTime,
        waitingTime: 0,
        completionTime: 0,
        id_simulacion: this.schedulerService.getCurrentSimulationID(),
        state: state
      };
      this.processService.post(process).subscribe({
        next: (process) => {
          console.log("entramos al segundo suscribe");
          console.log("UPDATE OK", process);

          console.log('Simulación guardada:', process);
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });


    }





  }
}
