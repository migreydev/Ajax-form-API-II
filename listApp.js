const ul = document.querySelector('ul');

const urlIncidencias = 'http://localhost:3000/incidencias';
const urlUsuarios = 'http://localhost:3000/usuarios';
const urlAulas = 'http://localhost:3000/aulas';

async function getIncidencias(){

    const respuesta = await fetch (urlIncidencias);

    if(!respuesta.ok){
        console.error('Error al obtener la respuesta');
    }

    const incidencias = await respuesta.json();
    

    for (const incidencia of incidencias) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const br = document.createElement('br');

        a.innerText = 'Editar';
        a.classList = 'btn btn-warning';

        const aula = await getAulas(incidencia.id_aula);
        const usuario = await getUsuarios(incidencia.id_reportante);


        if(incidencia.estado === 'Abierta' || incidencia.estado === 'En Proceso'){

            li.innerHTML = `Id: <strong>${incidencia.id}</strong>, Fecha: <strong>${incidencia.fecha_incidente}</strong>, Aula: <strong>${aula.nombre}</strong>, Nombre del reportante: <strong>${usuario.nombre}</strong>`;
    
            li.append(a);
            ul.append(li);
            ul.append(br);
    
            a.addEventListener('click', async()=>{
                a.href =  `./index.html?id=${incidencia.id}`;
            })

        }

    };
}

getIncidencias();

//Funcion para buscar aulas por id en la API
async function getAulas(id){

    try{
        const urlID = `${urlAulas}/${id}`;
        const respuesta = await fetch (urlID);

        if(!respuesta.ok){
            console.error('Error al obtener la respuesta');
        }
    
        const aulas = await respuesta.json();

        return aulas;

    }catch(error){
        console.error(error,'error');
    }
}

//Funcion para buscar usuarios por id en la API
async function getUsuarios(id){

    try{
        const urlID = `${urlUsuarios}/${id}`;
        const respuesta = await fetch (urlID);

        if(!respuesta.ok){
            console.error('Error al obtener la respuesta');
        }
    
        const usuarios = await respuesta.json();

        return usuarios;

    }catch(error){
        console.error(error,'error');
    }
}