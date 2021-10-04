const miFormulario = document.querySelector('form');
miFormulario.addEventListener('submit',e=>{
    e.preventDefault()
    const formdata={

    }
    for(let el of miFormulario.elements){
        if(el.name.length >0)
            formdata[el.name]=el.value
    }
    fetch('http://localhost:8080/api/auth/login',{
        method: 'POST',
       headers: {
          'Content-Type': 'application/json'
       },
       body: JSON.stringify(formdata)
    }).then(resp=>resp.json())
    .then(({msg,token})=>{
        if(msg){
            return console.error(msg)
        }
        localStorage.setItem('token',token)
        window.location='chat.html'
    })
    .catch(err=>{
        console.log(err)
    })
})
function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    //google token: ID_TOKEN
    //console.log('id_token',response.credential);
    const body = {
       id_token: response.credential
    }
    fetch('http://localhost:8080/api/auth/google', {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json'
       },
       body: JSON.stringify(body)
    }).then(resp => resp.json()).then(({token}) => {
       localStorage.setItem('token',token)
       window.location='chat.html'
    }).catch(console.warn)
 }
 const button = document.getElementById('signout');
 button.onclick = () => {
    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email', done => {
       localStorage.clear();
       location.reload();
    }))
 }