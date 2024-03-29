import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css'
  ]
})
export class RegisterComponent  {

  public formSubmitted = false;

  public registerForm = this.formBuilder.group({
    nombre    : ['Camila', Validators.required ],
    email     : ['test100@gmail.com',[ Validators.required, Validators.email ] ],
    password  : ['123456', Validators.required ],
    password2 : ['123456', Validators.required ],
    terminos  : [ true , Validators.requiredTrue ],
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( private formBuilder : FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ) { }

  crearUsuario(): void {
    this.formSubmitted = true;
    console.log( this.registerForm.value )

    if (  this.registerForm.invalid ) {
      return;
    }

    // Realizar posteo
    this.usuarioService.crearUsuario( this.registerForm.value )
        .subscribe({
          next: resp => {
            console.log('usuario creado');
            console.log(resp);
            this.router.navigateByUrl('/');
          },
          error: (err) => { 
            console.log('register', err.error)
            Swal.fire({
            title: 'Error',
            text: err.error.msg,
            icon: 'error'
            });
           }
        });
  }

  campoNoValido ( campo: string ) : boolean {
    if ( this.registerForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

  contrasenasNoValidas() : boolean {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;
    
    if ( (pass1 !== pass2) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }

  }

  aceptaTerminos() : boolean {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  passwordsIguales( pass1Name: string, pass2Name: string ) {

     return ( formGroup: FormGroup ) => {

        const pass1Control = formGroup.get(pass1Name);
        const pass2Control = formGroup.get(pass2Name);

        if ( pass1Control?.value === pass2Control?.value) {
          pass2Control?.setErrors(null);
        } else {
          pass2Control?.setErrors({ noEsIgual: true } );
        }

     }

  }


}
