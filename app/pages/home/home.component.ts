import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario:UsuarioModel = new UsuarioModel();

  usuarios: UsuarioModel[] = [];


  constructor( private auth: AuthService, 
               private router: Router ) { }

  ngOnInit() {
  
    //this.usuario = new UsuarioModel();
    this.auth.getUsuarios()
    .subscribe( resp=> this.usuarios = resp );
  }

  exit(){
    
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
