import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {i_process} from '../process-component/process-interface';

@Component({
  selector: 'app-process-form-component',
  imports: [ReactiveFormsModule],
  templateUrl: './process-form-component.html',
  styleUrl: './process-form-component.css',
})
export class ProcessFormComponent {
  processForm = new FormGroup({
    processName: new FormControl('proceso', { nonNullable: true , validators: [Validators.required]}),
    priority: new FormControl(0, { nonNullable: true , validators: [Validators.required, Validators.min(0)]}),
    burstTime: new FormControl(1, { nonNullable: true , validators: [Validators.required, Validators.min(0)]}),
    arrivalTime: new FormControl(0,  { nonNullable: true , validators: [Validators.required, Validators.min(0)]}),
    //state: new FormControl('new')
  })
  onSubmit(){
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
      name: proceso.processName,
      priority: proceso.priority,
      burstTime: proceso.burstTime,
      arrivalTime: proceso.arrivalTime,
      state: state
    };
    //hacer acá el post.

  }
}
