import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';


declare const google : any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient,
               private router: Router ) { }

  logout() {
    localStorage.removeItem('token');

    // TODO: Se debe rescatar el correo de google y dejar en una variable
    google.accounts.id.revoke('c.pizarro.inostroza@gmail.com', () => {
      this.router.navigateByUrl('/login')
    })
  }

  validarToken() : Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token' : token
      }
    }).pipe(
      tap( (resp : any ) => {
        console.log('valida token', resp.token)
        localStorage.setItem('token', resp.token );
      }),
      map( resp => true),
      catchError( error => of(false))
    );
  }

  crearUsuario( formData: RegisterForm ){
    
    return this.http.post(`${ base_url }/usuarios`, formData)
                .pipe(
                  tap( (resp : any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
    
  }

  login( formData: LoginForm ){
    
    return this.http.post(`${ base_url }/login`, formData)
                .pipe(
                  tap( (resp : any) => {
                    localStorage.setItem('token', resp.token )
                  })
                );
  }

  loginGoogle( token: string) {
    return this.http.post(`${ base_url }/login/google`, {token})
      .pipe(
        tap((resp : any) => {
          console.log('token google inicio',resp)
          localStorage.setItem('token', resp.token )
          console.log('token google fin',resp.token)
        })
      )
  }
}
