
//Declaracion de variables url
const urlIncidencias = "http://localhost:3000/incidencias";
const urlUsuarios = "http://localhost:3000/usuarios";
const urlAulas = "http://localhost:3000/aulas";

//Declaracion de variables de los diferentes campos que forman el formulario
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

//Obtener el id del objeto por url 
const urlEditar = window.location.search;
const parametro =  new URLSearchParams(urlEditar);
const id = parametro.get('id');

//Si es true
if(id){

    //Modifico el titutlo y boton para que se muestre el formulario en modo editar
    isValidDescripcion = false;
    const titulo = document.querySelector('h2');
    titulo.innerText = 'Editar Registro de Incidencias';

    button.innerText = 'Editar';
    button.classList = 'btn btn-warning';

    //Se crea un div que contendra un nuevo campo Estado
    const ultDiv = document.getElementById('ultimoDiv');
    const divSelect = document.createElement('div');
    ultDiv.append(divSelect);
    
    //Crea una etiqueta label que almacena el titutlo de estado
    const label = document.createElement('label');
    label.innerText = 'Estado Incidencia';
    label.classList= 'form-label';
    
    //Crea un elemento de tipo select 
    const selectEstado = document.createElement('select');
    selectEstado.classList= "form-control";

    divSelect.append(label);
    divSelect.append(selectEstado);

    //Se crean las tres opciones que albergara el estado de la incidencia
    const optionAbierta = document.createElement('option');
    optionAbierta.innerText = 'Abierta';
    selectEstado.append(optionAbierta);

    const optionProceso = document.createElement('option');
    optionProceso.innerText = 'En Proceso';
    selectEstado.append(optionProceso);

    const optionResulta = document.createElement('option');
    optionResulta.innerText = 'Resuelta';
    selectEstado.append(optionResulta);

    
    const br = document.createElement('br');
    divSelect.append(br);

    //Funcion asincrona para obtener los datos del objeto de la API
    async function obtenerDatos(){

        try{

            //Alberga la incidencia a editar a traves del metodo  getIncidenciaByID()
            const incidenciaAeditar = await getIncidenciaByID();
    
            //Se van validando los campos e imprimiendolos con sus respectivos valores que conforma el objeto
            fecha.value = incidenciaAeditar.fecha_incidente;
            fecha.readOnly = true;
    
            //Se obtiene el usuario para poder extraer tanto su nombre como su email ya que incidencias solo alamcena el id del reportante (usuario)
            const usuario = await getUsuario(incidenciaAeditar.id_reportante);
            email.value = usuario.email;
            nombre.value = usuario.nombre;
            email.readOnly = true;
            nombre.readOnly = true;
    
            telefono.value = incidenciaAeditar.telefono_contacto;
            telefono.readOnly = true;
    
            hora.value = incidenciaAeditar.hora_incidente;
            hora.readOnly = true;
    
            //Se obtiene el aula donde se produce la incidencia y se le asocia al campo option
            const aulaId = await getAula(incidenciaAeditar.id_aula);
            const option = document.createElement('option');
            option.value = aulaId.id;
            option.textContent = aulaId.nombre;
            option.selected = true;
            aula.append(option);
            aula.disabled = true;
    
            descripcion.value = incidenciaAeditar.descripcion;

            const estadoAPI = incidenciaAeditar.estado;

            //Muestra el estado de la incidencia
            if (optionAbierta.textContent === estadoAPI) {
                optionAbierta.selected = true;

            } else if (optionProceso.textContent === estadoAPI) {
                optionProceso.selected = true;

            } else {
                optionResulta.selected = true;
            }

        }catch(error){
            console.error('Error', error)
        }
    }

    obtenerDatos()

    //Evento asociado al boton para proceder a editar objeto
    button.addEventListener('click', async(e) =>{

        e.preventDefault();

        try{    
    
            //Se valida el campo descripcion
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

            //Si el campo descripcion es true se procede a editar 
            if(isValidDescripcion){

                const incidenciaAeditar = await getIncidenciaByID();
                const urlEditar = `${urlIncidencias}/${id}`; //URL que contiene el id del objeto 
                const respuesta = await fetch (urlEditar, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "fecha_incidente": fecha.value,
                        "id_reportante": incidenciaAeditar.id_reportante,
                        "telefono_contacto": telefono.value,
                        "hora_incidente": hora.value.toUpperCase(),
                        "id_aula": aula.value,
                        "descripcion": descripcion.value,
                        "estado": selectEstado.value,
                    })
                });

                if (!respuesta.ok) {
                    console.error('Error al editar la incidencia');
                } else {
                    window.location.href = 'list.html';
                }
            }
    
        }catch (error){
            console.error(error, 'error');
        }
    })

//Si el id es false el formulario aparece en modo de añadir incidencia
}else {

    button.addEventListener('click', async(e) =>{
    
        e.preventDefault();
    
        //Variables booleanas que actuan como variables banderas para validar los campos
        isValidFecha = false;
        isValidEmail = false;
        isValidNombre = false;
        isValidTelefono = false;
        isValidHora = false;
        isValidDescripcion = false;
    
        //Se valida cada campo segun el criterio, llamando a su metodo correspondiente. 
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
            error.innerText = '';
            isValidEmail = true;

        }else {
            const error  = document.getElementById('smallEmail');
            error.className = 'text-danger';
            error.innerText = "Error, el email debe estar en la base de datos. En cuanto introduzcas un email valido, se cargara el nombre al presionar el boton de agregar incidencia";
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
    
        //Si todo es true se procede a añadir una incidencia, de lo contrario no se podra añadir 
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

//Funciones para validar los campos del formulario

//Funcion para validar la fecha
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
        const respuesta  = await fetch (`${urlUsuarios}?email=${email}`); //http://localhost:3000/usuarios?email=.....

        if(!respuesta.ok){
            console.log('Error al obtener la respuesta');
        }

        const usuario = await respuesta.json();
        
        usuario.forEach(element =>{
            if (element.email === email) { //Si el email es igual al que se le pasa por parametro se le asocia el nombre
                nombre.id = element.id;
                nombre.value = element.nombre; //al campo nombre
                isValid = true;
            }
        })

    } catch(error) {
        console.error(error);
    }

    return isValid;
}

//Funcion para validad la hora
function validateHora(hora){

    const regexNumero = /^[1-6]$/;
    isValid = false;
    const numberHora = parseInt(hora);

    if(regexNumero.test(numberHora) || hora.toUpperCase() === 'R' ){
        isValid = true;
    }
    return isValid;
}

//Funcion para validar el telefono
function validateTelefono(telefono){
    const regexTelefono = /^\d{9}$/;
    isValid = false;

    if(regexTelefono.test(telefono)){
        isValid = true;
    }

    return  isValid;

}

//Funcion para validar la descripcion
function validateDescripcion(descripcion){
    const caracteres = 30;
    isValid = false;

    if(descripcion.length >= caracteres){
        isValid = true;
    }

    return isValid;
}

//Funcion para obtener las aulas de la API
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

//Creacion del boton ir a lista
const a  = document.createElement('a');
a.innerText = 'Ir a la lista';
a.classList = 'btn btn-dark';
a.href = './list.html';
form.append(a);


//Funcion para obtener la incidencia por id de la API
async function getIncidenciaByID(){

    try{
        const respuesta = await fetch (`${urlIncidencias}/${id}`);//http://localhost:3000/incidencias/id.....

        if(!respuesta.ok){
            console.error('Error, al obtener la respuesta');
        }

        const incidencia = await respuesta.json();

        return incidencia;

    }catch (error){
        console.error(error, 'error');
    }
}

//Funcion para obtener el usuario por id del API
async function getUsuario(usuarioID){

    try{
        const respuesta = await fetch (`${urlUsuarios}/${usuarioID}`); //http://localhost:3000/usuarios/id..

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
        const respuesta = await fetch (`${urlAulas}/${aulaID}`); //http://localhost:3000/aulas/id...

        if(!respuesta.ok){
            console.error('Error, al obtener la respuesta');
        }

        const aula = await respuesta.json();

        return aula;

    }catch (error){
    console.error(error, 'error');
    
    }
}


