const urlIncidencias = "http://localhost:3000/incidencias";
const urlUsuarios = "http://localhost:3000/usuarios";
const urlAulas = "http://localhost:3000/aulas";

const fecha = document.getElementById('fecha');
const email = document.getElementById('email');
const nombre = document.getElementById('nombre');
const telefono = document.getElementById('telefono');
const hora = document.getElementById('hora');
const aula = document.getElementById('aula');
const descripcion = document.getElementById('descripcion')

const form = document.querySelector('form');
const button = document.getElementById('submit');
nombre.readOnly = true;


const urlEditar = window.location.search;
const parametro =  new URLSearchParams(urlEditar);
const id = parametro.get('id');


if(id){

    async function editIncidencia(){

        try{

            isValidDescripcion = false;
            const titulo = document.querySelector('h2');
            titulo.innerText = 'Editar Registro de Incidencias';

            button.innerText = 'Editar';
            button.classList = 'btn btn-warning';

            const incidenciaAeditar = await getIncidenciaByID();

            fecha.value = incidenciaAeditar.fecha_incidente;
            fecha.readOnly = true;

            const usuario = await getUsuario(incidenciaAeditar.id_reportante);
            email.value = usuario.email;
            nombre.value = usuario.nombre;
            email.readOnly = true;
            nombre.readOnly = true;

            telefono.value = incidenciaAeditar.telefono_contacto;
            telefono.readOnly = true;

            hora.value = incidenciaAeditar.hora_incidente;
            hora.readOnly = true;

            const aulaId = await getAula(incidenciaAeditar.id_aula);
            const option = document.createElement('option');
            option.value = aulaId.id;
            option.textContent = aulaId.nombre;
            option.selected = true;
            aula.append(option);
            aula.disabled = true;

            descripcion.value = incidenciaAeditar.descripcion;

            const divSelect = document.createElement('div');
            const selectEstado = document.createElement('select');
            const optionEstado = document.createElement('option');

            const ultDiv = document.getElementById('ultimoDiv');
            ultDiv.append(divSelect);
            divSelect.append(selectEstado);
            selectEstado.append(optionEstado);


            if(validateDescripcion(descripcion.value)){
                const error  = document.getElementById('smallDescripcion');
                error.className = '';
                error.innerText = "";
                isValidDescripcion = true;

            }else {
                const error  = document.getElementById('smallDescripcion');
                error.className = 'text-danger';
                error.innerText = "Error, la descripcion debe de tener al menos 30 caracteres";
            }

            const urlEditar = `${urlIncidencias}/${id}`;
            const respuesta = await fetch (urlEditar, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "fecha_incidente": fecha.value,
                    "id_reportante": nombre.id,
                    "telefono_contacto": telefono.value,
                    "hora_incidente": hora.value.toUpperCase(),
                    "id_aula": aula.value,
                    "descripcion": descripcion.value,
                    "estado": ""
                })
            });

        }catch (error){
            console.error(error, 'error');
        }
    }

    editIncidencia()

}else {

    button.addEventListener('click', async(e) =>{
    
        e.preventDefault();
    
        isValidFecha = false;
        isValidEmail = false;
        isValidNombre = false;
        isValidTelefono = false;
        isValidHora = false;
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
        const emailValido = await validateEmail(email.value);
        if(emailValido){
            const error  = document.getElementById('smallEmail');
            error.className = '';
            error.innerText = "";
            isValidEmail = true;
        
        }else {
            const error  = document.getElementById('smallEmail');
            error.className = 'text-danger';
            error.innerText = "Error, el email debe estar en la base de datos";
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
    
        if(validateHora(hora.value)){
            const error  = document.getElementById('smallHora');
            error.className = '';
            error.innerText = "";
            isValidHora = true;
        }else {
            const error  = document.getElementById('smallHora');
            error.className = 'text-danger';
            error.innerText = "Error, la hora debe ser un número de 1 al 6 o una R si sucedio en el recreo";
        }
    
        if(validateDescripcion(descripcion.value)){
            const error  = document.getElementById('smallDescripcion');
            error.className = '';
            error.innerText = "";
            isValidDescripcion = true;
        }else {
            const error  = document.getElementById('smallDescripcion');
            error.className = 'text-danger';
            error.innerText = "Error, la descripcion debe de tener al menos 30 caracteres";
        }
    
        if(isValidFecha && isValidEmail  && isValidTelefono && isValidHora && isValidDescripcion){
            const respuesta = await fetch (urlIncidencias, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "fecha_incidente": fecha.value,
                    "id_reportante": nombre.id,
                    "telefono_contacto": telefono.value,
                    "hora_incidente": hora.value.toUpperCase(),
                    "id_aula": aula.value,
                    "descripcion": descripcion.value,
                    "estado": "Abierta"
                })
            })
        }
    })
}



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



//Funcion para buscar el email en la API
async function validateEmail(email){

    try{
        isValid = false;
        const respuesta  = await fetch (`${urlUsuarios}?email=${email}`);

        if(!respuesta.ok){
            console.log('Error al obtener la respuesta');
        }

        const usuario = await respuesta.json();
        
        usuario.forEach(element =>{
            if (element.email === email) {
                nombre.id = element.id;
                nombre.value = element.nombre;
                isValid = true;
            }
        })

    } catch(error) {
        console.error(error);
    }

    return isValid;
}


function validateHora(hora){

    const regexNumero = /^[1-6]$/;
    isValid = false;
    const numberHora = parseInt(hora);

    if(regexNumero.test(numberHora) || hora.toUpperCase() === 'R' ){
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

    if(descripcion.length >= caracteres){
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


const a  = document.createElement('a');
a.innerText = 'Ir a la lista';
a.classList = 'btn btn-dark';
a.href = './list.html';
form.append(a);


//Funcion para obtener la incidencia por id del API
async function getIncidenciaByID(){

    try{
        const respuesta = await fetch (`${urlIncidencias}/${id}`);

        if(!respuesta.ok){
            console.error('Error, al obtener la respuesta');
        }

        const incidencia = await respuesta.json();
        console.log(incidencia);

        return incidencia;

    }catch (error){
        console.error(error, 'error');
    }
}

//Funcion para obtener el usuario por id del API
async function getUsuario(usuarioID){

    try{
        const respuesta = await fetch (`${urlUsuarios}/${usuarioID}`);

        if(!respuesta.ok){
            console.error('Error, al obtener la respuesta');
        }

        const usuario = await respuesta.json();

        return usuario;

    }catch (error){
    console.error(error, 'error');
    
    }

}

//Funcion para obtener el aula por id del API
async function getAula(aulaID){

    try{
        const respuesta = await fetch (`${urlAulas}/${aulaID}`);

        if(!respuesta.ok){
            console.error('Error, al obtener la respuesta');
        }

        const aula = await respuesta.json();
        console.log(aula);

        return aula;

    }catch (error){
    console.error(error, 'error');
    
    }
}


