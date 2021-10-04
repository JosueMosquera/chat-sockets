

let usuario = null;
let socket = null;
//referencias html
const txtUid = document.querySelector('#txtUid')
const txtMensaje= document.querySelector('#txtMensaje')
const ulUsuarios= document.querySelector('#ulUsuarios')
const ulMensajes= document.querySelector('#ulMensajes')
const ulMensajesPrivados= document.querySelector('#ulMensajesPrivados')
const btnSalir= document.getElementById('btnSalir')
// validar el token del local storage
const validarJWT = async()=>{
    const token = localStorage.getItem('token') || '';
    if(token.length<=10){
        window.location='index.html'
       throw new Error('no hay token en el servidor');
    }
    const resp = await fetch('http://localhost:8080/api/auth/',{
        headers:{'x-token' :token}
    });
    const{usuario:UserDB , token:TokenDB} = await resp.json()
    localStorage.setItem('token',TokenDB);
    usuario = UserDB;
    document.title=usuario.nombre
    await conectarSocket();
    
}
const conectarSocket = async()=>{
    socket = io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    });
    socket.on('connect',()=>{
        console.log('sockets online')
    })
    socket.on('disconnect',()=>{
        console.log('sockets offline')
    })
    socket.on('recibir-mensajes',dibujarMensajes)
    socket.on('usuarios-activos',dibujarUsuarios)
    socket.on('mensaje-privado',dibujarMensajesPrivados)
}
const dibujarUsuarios =(usuarios =[])=>{
    let usersHtml = ''
    usuarios.forEach(({nombre,uid})=>{
        usersHtml +=`
        <li>
            <p>
                <h5 class="text-success" >${nombre}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        
        
        `;
    });
    ulUsuarios.innerHTML=usersHtml;
}
const dibujarMensajes =(mensajes =[])=>{
    let mensajesHtml = ''
    let horaMinutos = new Date();
    mensajes.forEach(({nombre,mensaje})=>{
        mensajesHtml +=`
        <li>
            <p>
            <span class="text-primary" >${horaMinutos.getHours()}:${horaMinutos.getMinutes()} ${nombre}:</span>
                <span class="fs-6">${mensaje}</span>
            </p>
        </li>
        
        
        `;
    });
    ulMensajes.innerHTML=mensajesHtml;
}
const dibujarMensajesPrivados =(mensajes=[])=>{
    let mensajesPrivadosHtml = ''
    let horaMinutos = new Date();
    mensajes.forEach(({nombre,mensaje})=>{
        mensajesPrivadosHtml +=`
        <li>
            <p>
                <span class="text-primary" >${horaMinutos.getHours()}:${horaMinutos.getMinutes()} ${nombre}:</span>
                <span class="fs-6">${mensaje}</span>
            </p>
        </li>
        
        
        `;
    });
   ulMensajesPrivados.innerHTML=mensajesPrivadosHtml
}
txtMensaje.addEventListener('keyup',({keyCode})=>{
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if(keyCode!==13){
        return;
    }
    if(mensaje.length === 0){
        return;
    }
    socket.emit('enviar-mensaje',{mensaje,uid});
    txtMensaje.value='';
})
const main = async()=>{
    await validarJWT();
}
main();
