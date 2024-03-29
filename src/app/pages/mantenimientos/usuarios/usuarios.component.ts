
import Swal from 'sweetalert2';
import { BusquedasService } from '../../../services/busquedas.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public imgSubs: Subscription | undefined;
  public totalUsuarios : number = 0;
  public usuarios      : Usuario[] = [];
  public usuariosTemp  : Usuario[] = [];
  public desde         : number = 0;
  public cargando      : boolean = true;

  constructor( private usuarioService : UsuarioService,
               private busquedasService : BusquedasService,
               public modalImagenService :ModalImagenService ) { }

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

   this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    ).subscribe( img => this.cargarUsuarios() );
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuario(this.desde)
    .subscribe( ({ total, usuarios }) => {
      this.totalUsuarios  = total;
      this.usuarios       = usuarios;
      this.usuariosTemp   = usuarios;
      this.cargando       = false;
    })
  }

  cambiarPagina( valor: number) {
    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if( this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ): Usuario[] | undefined {

    if( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar('usuarios', termino)
        .subscribe( resultados => {
          this.usuarios = resultados;
        })

    return [];
  }

  eliminarUsuario( usuario: Usuario) {

    if ( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('Error', ' No puede borrarse a si mismo', 'error')
    }

   return Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario)
            .subscribe( resp => {
              this.cargarUsuarios();

              Swal.fire(
                'Usuario Borrado', `${ usuario.nombre} fue eliminado correctamente`,
                'success'
              )
            }
          )
      }
    })
  }

  cambiarRole( usuario: Usuario) {
    this.usuarioService.guardarUsuario( usuario)
      .subscribe( resp => {
        console.log(resp)
      })
  }
  
  abrirModal( usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}