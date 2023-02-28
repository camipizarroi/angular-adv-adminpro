import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public imgUrl : string | undefined = '';
  public usuario : any ;
  public nombre_customized: string = '';

  constructor( private usuarioService : UsuarioService) { 
    this.imgUrl = usuarioService.usuario?.imagenUrl;
    this.usuario = usuarioService.usuario;
    ( this.usuario.nombre.split(' ').length > 1 )
      ? this.nombre_customized = this.usuario.nombre.split(' ')[0] + ' ' + this.usuario.nombre.split(' ')[1]
      : this.nombre_customized = this.usuario.nombre;
  }

  logout() {
    this.usuarioService.logout();
  }

}
