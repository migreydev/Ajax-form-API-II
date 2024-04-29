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


button.addEventListener('click', async(e) =>{

    e.preventDefault();
    isValidFecha = false;
    isValidEmail = false;
    isValidNombre = false;
    isValidTelefono = false;
    isValidDescripcion = false;

    if(validateFecha(fecha.value)){
    
        const error  = document.getElementById('smallFecha');
        error.className = '';
        error.innerText = "";
        isValidFecha = true;
    
    }else {
        const error  = document.getElementById('smallFecha');
        error.className = 'text-danger';
        error.innerText = "Error, la fecha no puede ser posterior al día actual ni anterior al inicio del curso (01/09/2023)";
    
    }
    
    if(validateEmail(email.value)){
        const error  = document.getElementById('smallEmail');
        error.className = '';
        error.innerText = "";
        isValidEmail = true;
    
    }else {
        const error  = document.getElementById('smallEmail');
        error.className = 'text-danger';
        error.innerText = "Error, el nombre debe estar en la base de datos";
    }
    
    if(validateTelefono(telefono.value)){
        const error  = document.getElementById('smallTelefono');
        error.className = '';
        error.innerText = "";
        isValidTelefono = true;
    
    }else {
        const error  = document.getElementById('smallTelefono');
        error.className = 'text-danger';
        error.innerText = "Error, el teléfono de contacto (debe ser un número de teléfono válido, compuesto por 9 números).";
    }

})


function validateFecha(date) {
    const fechaSeleccionada = new Date(date);
    const fechaActual = new Date();
    const inicioCurso = new Date('2023-09-01'); 
    let isValid = false; 

    if (fechaSeleccionada <= fechaActual && fechaSeleccionada >= inicioCurso) { 
        isValid = true;
    }

    return isValid;
}


async function validateName(){

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
validateName()

async function validateEmail(){

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
validateEmail();

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
