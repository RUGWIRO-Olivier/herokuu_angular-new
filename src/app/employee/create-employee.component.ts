import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Key } from 'protractor';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  employee: Employee = new Employee();
  employeeForm: FormGroup;
  

  validationMessages = {
    firstName: {
      required: 'First Name is Required.',
      minlength: 'First Name must be greater than 2 characters.',
      maxlength: 'First Name must be less than 10 characters.',
    },
    lastName: {
      required: 'Last Name is Required.',
      minlength: 'Last Name must be greater than 2 characters.',
      maxlength: 'Last Name must be less than 10 characters.',
    },
    email: {
      required: 'Email is Required.',
      emailDomain: 'Email Domain should be gmail.com',
    },

    phone: {
      required: 'Phone is Required.',
    },

    skillName: {
      required: 'Skill Name is Required.',
    },

    experienceInYears: {
      required: 'Experience in Years is Required.',
    },
    proficiency: {
      required: 'Proficiency is Required.',
    },
  };

  formErrors = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    skillName: '',
    experienceInYears: '',
    proficiency: '',
  };

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      contactPreference: ['email'],
      email: ['', [Validators.required, emailDomain]],
    });

    this.employeeForm
      .get('contactPreference')
      .valueChanges.subscribe((data: string) => {
        this.onContactPreferenceChange(data);
      });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });
  }

  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (
          abstractControl &&
          !abstractControl.valid &&
          (abstractControl.touched || abstractControl.dirty)
        ) {
          const messages = this.validationMessages[key];
          // console.log(messages);
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + '';
            }
          }
        }
      }
    });
  }

  onLoadDataClick(): void {
    // this.logValidationErrors(this.employeeForm)
    // console.log(this.formErrors)
  }

  onSubmit(): void {
    // console.log(this.employeeForm.value);
    console.log(this.employee);
    this.saveEmployee();
    
  
  }

  saveEmployee() {
    this.employeeService.createEmployee(this.employee).subscribe(
      (data) => {
        console.log(data);
        this.goToEmployees();
      },
      (error) => console.log(error)
    );
  }

  goToEmployees(){
    this.router.navigate(['/list'])
  }

}

function emailDomain(control: AbstractControl): { [key: string]: any } | null {
  const email: string = control.value;
  const domain = email.substring(email.lastIndexOf('@') + 1);
  if (email === '' || domain.toLowerCase() === 'gmail.com') {
    return null;
  } else {
    return { emailDomain: true };
  }
}
