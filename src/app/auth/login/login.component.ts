import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css'
  ]
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef

  public formSubmitted = false;

  public loginForm : FormGroup = this.formBuilder.group({
    email    : [ localStorage.getItem('email') || '' ,[ Validators.required, Validators.email ] ],
    password : ['', Validators.required ],
    remember : [false]
  });

  constructor( private router: Router,
               private formBuilder: FormBuilder,
               private usuarioService: UsuarioService) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() : void {
    google.accounts.id.initialize({
      client_id: "123087193472-73a57bmhjjuf0dmt0n2qakb56jpo4tpl.apps.googleusercontent.com",
      callback: (response : any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      //document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response: any ) : void {
    //console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe( resp => {
        this.router.navigateByUrl('/');
      })
  }

  login(): void {
    this.usuarioService.login(this.loginForm.value)
      .subscribe({
        next: resp => {
          if ( this.loginForm.get('remember')?.value ) {
            localStorage.setItem('email', this.loginForm.get('email')?.value)
          } else {
            localStorage.removeItem('email');
          }

          this.router.navigateByUrl('/');
        },
        error: (err) => { 
          console.log(err)
          Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
          });
         }
      })
   
  }

}
