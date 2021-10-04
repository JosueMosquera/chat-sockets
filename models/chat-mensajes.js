class Mensaje{
    constructor(uid,nombre,mensaje){
        this.uid=uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}
class ChatMensajes {
  constructor() {
    this.mensajes = [];
    this.usuarios = {};
    this.mensajesPrivados = [];
  }

  get ultimos10() {
      this.mensajes=this.mensajes.splice(0,10);
      return this.mensajes;
  }
  get ultimos10Privados(){
    this.mensajesPrivados = this.mensajesPrivados.splice(0,10);
    return this.mensajesPrivados
  }
  get usuariosArr(){
      return Object.values(this.usuarios)
  }
  enviarMensaje(uid,nombre,mensaje){
    this.mensajes.unshift(new Mensaje(uid,nombre,mensaje))
  }
  conectarUsuario(usuario){
    this.usuarios[usuario.id]=usuario
  }
  desconectarUsuario(id){
      delete this.usuarios[id];
  }
  enviarMensajePrivado(uid,nombre,mensaje){
    this.mensajesPrivados.unshift(new Mensaje(uid,nombre,mensaje))
  }
}
module.exports=ChatMensajes
