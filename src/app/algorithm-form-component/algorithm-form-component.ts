import { Component } from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-algorithm-form-component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './algorithm-form-component.html',
  styleUrl: './algorithm-form-component.css',
})
export class AlgorithmFormComponent {
  algorithmForm = new FormGroup(
    {

    }
  )




}
