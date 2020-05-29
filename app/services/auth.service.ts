import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from 'src/app/models/usuario.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private apikey = 'AIzaSyCMo_E7H_kTyM5dc7TGvx-LCTHgElGpSP0';
  private urlPost = 'https://login-856e3.firebaseio.com/';

  userToken: string;

  //Crear nuevo usuario
  //https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]

  //Login
  //https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]
  
  constructor( private http:HttpClient ) { 
  
    this.leerToken();

   }

  logout() {
    localStorage.removeItem('token');
  }

  login( usuario: UsuarioModel ) {

    const authData = {
      //email:usuario.email,
      //password: usuario.password,
      ...usuario,
      returnSecureToken: true
      };

      return this.http.post(
        `${ this.url }/verifyPassword?key=${ this.apikey }`,
        authData
      ).pipe(
        map( resp => {
            this.guardarToken( resp[ 'idToken' ] )
            return resp;
        })
    );

  }

  nuevoUsuario( usuario: UsuarioModel) {

    const authData = {
    ...usuario,//operador spret
    //email: usuario.email,
    //password: usuario.password,
    returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/signupNewUser?key=${ this.apikey }`,
      authData
    ).pipe(
        map( resp => {
            this.guardarToken( resp[ 'idToken' ] )
            return resp;
        })
    );

  }

  private guardarToken( idToken: string ){

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );

  }

  leerToken(){

    if( localStorage.getItem( 'token' ) ){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken='';
    }

    return this.userToken;

  }

    estaAutenticado() : boolean {

      if ( this.userToken.length < 2 ){
        return false;
      }

      const expira = Number(localStorage.getItem('expira'));
      const expiraDate = new Date ();
      expiraDate.setTime(expira);
      
      if (expiraDate > new Date() ) {
        return true;
      } else {
        return false;
      }

  }

  //Base de datos

  crearUsuario(usuario: UsuarioModel){
    return this.http.post(`${this.urlPost}/login.json`, usuario)
    .pipe(
      map( (resp: any) =>{
        usuario.id = resp.name;
        return usuario;
      })
    );
  }

  getUsuarios(){
    return this.http.get(`${this.urlPost}login.json`)
            .pipe( 
            map( this.crearArreglo )
            );
  }

  private crearArreglo(usuariosObj: object){

    const usuarios: UsuarioModel [] = [];

    console.log(usuariosObj);

    if ( usuariosObj === null ) { return []; }

    Object.keys(usuariosObj).forEach( key => {

        const usuario: UsuarioModel = usuariosObj[key];
        usuario.id = key;

        usuarios.push( usuario );
    });


    return usuarios;

  }

}
