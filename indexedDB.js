const IDBRequest =  indexedDB.open("abelBase",1);


IDBRequest.addEventListener("upgradeneeded",(e)=>{  
      let db = IDBRequest.result;
       db.createObjectStore("nombres",{
            autoIncrement: true, 
      })
})


document.getElementById("btn-add").addEventListener("click",()=>{
     let nombre = document.getElementById("nombre").value;
     let monto = document.getElementById("monto").value;


     if (nombre.length > 0 & monto.length > 0) {
        addObjects({nombre,monto});
        leerObjectos();
     }
})

const addObjects = (obj, monto) =>{    
     const dataIDB = IDBData("readwrite","se agrego el objeto correctamente");
     dataIDB.add(obj,monto);
}


const leerObjectos = ()=>{
     const dataIDB = IDBData("readonly");
     const cursor = dataIDB.openCursor();
     const documentFrag = document.createDocumentFragment();
     document.querySelector(".nombres").innerHTML = "";
     let nombre = document.getElementById("nombre").value = "";
     let monto = document.getElementById("monto").value = "";     
     cursor.addEventListener("success",()=>{
        if (cursor.result) {
            let contentHTML  = HTMLCode(cursor.result.key, cursor.result.value, cursor.result.value);
            documentFrag.appendChild(contentHTML)
            cursor.result.continue();
        }else {
            document.querySelector(".nombres").appendChild(documentFrag);
        }
     })

}

const modificarObject = (key,obj,monto)=>{
     const dataIDB = IDBData("readwrite","se modfico el objeto correctamente");
     dataIDB.put({nombre:obj,monto:monto},key);
}

const eliminarObject = (key) =>{
      const dataIDB = IDBData("readwrite","se elimino el objeto correctamente");
      dataIDB.delete(key);
}

const IDBData = (mode,msg) =>{
     const db = IDBRequest.result;
     const IDBTransaction =  db.transaction("nombres",mode);
     const objectStore = IDBTransaction.objectStore("nombres");
     IDBTransaction.addEventListener("complete",()=>{
        console.log(msg)
     })

     return objectStore;

}



const HTMLCode = (id,name,monto) =>{
    let divPadre = document.querySelector(".nombres");


    let div = document.createElement("DIV");
    div.classList.add("nombre");
    let contentInputs = document.createElement("DIV");
    contentInputs.classList.add("contentInputs")

    let h2 = document.createElement("H2");
    let h3 = document.createElement("H3");

    h2.textContent = name.nombre;
    h2.setAttribute("contenteditable","true")
    h2.setAttribute("spellcheck","false")
    h3.textContent = "S/  " +monto.monto;
    h3.setAttribute("contenteditable","true")
    h3.setAttribute("spellcheck","false")    

    let divOptions = document.createElement("DIV");
    divOptions.classList.add("options")

    let botonSave = document.createElement("BUTTON");
    botonSave.textContent = "Guardar";
    botonSave.classList.add("imposbile")
    
    h2.addEventListener("keyup",(e)=>{
        console.log(name.nombre)
        if (h2.textContent !== name.nombre) {
            botonSave.classList.replace("imposbile","posible")
        }else if (e.path[0].innerHTML === name.nombre) {
                    botonSave.classList.replace("posible","imposbile")
        }
    })
   h3.addEventListener("keyup",(e)=>{
        console.log(monto.monto)
        if ( h3.textContent !== monto.monto) {
            botonSave.classList.replace("imposbile","posible")
        }else if ( e.path[0].innerHTML === monto.monto) {
                    botonSave.classList.replace("posible","imposbile")
        }
    })

    let botonDelete = document.createElement("BUTTON");
    botonDelete.textContent = "Eliminar";
    botonDelete.classList.add("delete");
    
    contentInputs.appendChild(h2)
    contentInputs.appendChild(h3)


    divOptions.appendChild(botonSave);
    divOptions.appendChild(botonDelete);

    div.appendChild(contentInputs)
    div.appendChild(divOptions);

    botonSave.addEventListener("click",(e)=>{
       if (h2.textContent.length > 1) {
             if (botonSave.className == "posible") {
                 modificarObject(id,name.nombre,monto.monto)
                 botonSave.classList.replace("posible","imposbile")
                 console.log(history.go(0))

        }
        else if (e.path[2].children[0].innerHTML.length === 0){
            console.log("no pusiste nada")    
       }
       else{
        console.log("paso un error")
       }
        }
    })
    
       botonDelete.addEventListener("click",()=>{
            eliminarObject(id)
            divPadre.removeChild(div)
       })

    return div;

}



    let btnShow = document.querySelector(".showNames");
    btnShow.addEventListener("click",()=>{
        let dataIDB = IDBData("readonly");
        let cursor = dataIDB.openCursor();
        document.querySelector(".nombres").innerHTML= "";
        cursor.addEventListener("success",()=>{
            if (cursor.result == null) {
               error();
            }else{
                leerObjectos();
            }
        })

    })


  

  const error = () =>{
      let divPadre = document.querySelector(".nombres");

     let div = document.createElement("DIV");
     div.classList.add("error");

     div.textContent = "¡NO HAY DATOS!"

      divPadre.appendChild(div);

  }