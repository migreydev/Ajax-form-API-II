const urlIncidencias = "http://localhost:3000/incidencias";
const urlUsuarios = "http://localhost:3000/usuarios";
const urlAulas = "http://localhost:3000/aulas";

const fecha = document.getElementById('fecha');
const email = document.getElementById('email');
const nombre = document.getElementById('nombre');
const telefono = document.getElementById('hora');
const aula = document.getElementById('aula');
const descripcion = document.getElementById('descripcion')

const button = document.getElementById('submit');



function valiteFecha(date){

    const fechaSeleccionada = new Date(date);
    const fechaActual = new Date();
    const inicioCurso = '2023/09/01';
    const fechaCurso = new Date(inicioCurso);
    isValid = false;

    if(fechaSeleccionada <= fechaActual || fechaSeleccionada <= fechaCurso){
        isValid = true
    }

    return isValid;

}

async function valiteName(){

    try{
        const isValid = false;
        const respuesta  = await fetch (urlUsuarios);

        if(!respuesta.ok){
            console.log('Error al obtener la respuesta');
        }

        const usuarios = await respuesta.json();

        usuarios.forEach(element =>{
            const emailApi = element.email;
            const nombreApi = element.nombre;
            
            if(email.value === emailApi){
                nombre.value = nombreApi;
                nombre.readOnly = true;

            }
        })

    }catch(error){
        console.error(error);
    }

}
valiteName()

async function valiteEmail(){

    try{
        const isValid = false;
        const respuesta  = await fetch (urlUsuarios);

        if(!respuesta.ok){
            console.log('Error al obtener la respuesta');
        }

        const usuarios = await respuesta.json();

        usuarios.forEach(element =>{
        
            if(element.email === email.value){
                
                isValid = true;
            }
        })

    }catch(error){
        console.error(error);
    }
    

}

valiteEmail();

function validateNombre(nombre){

}

function validateHora(hora){

    const regexNumero = /^[1-6]$/;
    const isValid = false;

    if(regexNumero.test(hora) || hora === 'R' ){
        isValid = true;
    }
    return isValid;
}

function validateTelefono(telefono){
    const regexTelefono = /^\d{9}$/;
    isValid = false;

    if(regexTelefono.test(telefono)){
        isValid = true;
    }

    return  isValid;

}

function validateDescripcion(descripcion){
    const caracteres = 30;
    isValid = false;

    if(descripcion >= caracteres){
        isValid = true;
    }

    return isValid;
}

async function getAulas(){

    try{

        const respuesta = await fetch (urlAulas);

        if(!respuesta.ok){
            console.log('Error al obtener la respuesta');
        }

        const aulas = await respuesta.json();

        aulas.forEach(element => {
            const option = document.createElement('option');
            option.value = element.id;
            option.textContent = element.nombre;

            aula.append(option);
        });

    }catch(error){

        console.error(error);
    }
}

getAulas();