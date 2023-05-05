import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';


declare const google : any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario ;

  constructor( private http: HttpClient,
               private router: Router ) { }

  get token() : string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token' : this.token
      }
    }
  }

  logout() {
    localStorage.removeItem('token');

    // TODO: Se debe rescatar el correo de google y dejar en una variable
    google.accounts.id.revoke('c.pizarro.inostroza@gmail.com', () => {
      this.router.navigateByUrl('/login')
    })
  }

  validarToken() : Observable<boolean> {
    google.accounts.id.initialize({
      client_id: "123087193472-73a57bmhjjuf0dmt0n2qakb56jpo4tpl.apps.googleusercontent.com"
    });
/*     const token = localStorage.getItem('token') || ''; */


    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token' : this.token
      }
    }).pipe(
      map( (resp : any ) => {
        const { email, google, nombre, role, img, uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email,'', img, google, role, uid);
        localStorage.setItem('token', resp.token );
        return true;
      }),
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

  actualizarPerfil( data: { email: string, nombre: string, role: string | undefined} ) {

    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers);
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

  cargarUsuario( desde: number = 0) {
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>( url, this.headers )
        .pipe(
          map( resp => {
            const usuarios = resp.usuarios.map( 
              user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid) 
              );

            return {
              total : resp.total,
              usuarios
            };
          })
        )
  }

  eliminarUsuario(usuario : Usuario) {
    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    console.log('url a enviar: ', url)
    return this.http.delete( url, this.headers )
  }

  guardarUsuario( usuario: Usuario ) {
    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers);
  }
}
