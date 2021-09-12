let btnAccountNew = document.querySelector(".newAccount");




const removeContentAdd =()=>{
	let containerAccounts = document.querySelector(".container-accounts");	
   let contentAdd = document.querySelector(".content-add");
   let containerNewAcc = document.querySelector(".container-newAccount")
   if (contentAdd.classList.contains("visible") || containerAccounts.classList.contains("visible")) {
   	    btnAccountNew.textContent = "Volver";
   	    containerNewAcc.classList.replace("hidden","visible");
   	    contentAdd.classList.replace("visible","hidden");
   	    containerAccounts.classList.replace("visible","hidden");
   }else{
   	    btnAccountNew.textContent = "Cuenta Nueva";
   	    containerNewAcc.classList.replace("visible","hidden")
   	    contentAdd.classList.replace("hidden","visible");

   }
}

btnAccountNew.addEventListener("click",removeContentAdd)


const btnCreateAcc = document.getElementById("createAcc");

const crearCuenta = (nameAcc,NameStore) =>{
	const DataBase = indexedDB.open(nameAcc,1);
	DataBase.addEventListener("upgradeneeded",()=>{
	    let dbs = DataBase.result;
	    dbs.createObjectStore(NameStore,{
	    	 autoIncrement:"true",
	    })   
	})
}

document.getElementById("btn-add").addEventListener("click",()=>{
     let nombre = document.getElementById("nombre").value;
     let monto = document.getElementById("monto").value;


     if (nombre.length > 0 & monto.length > 0) {
        addObjects({nombre,monto});
        leerObjectos();
     }
})

btnCreateAcc.addEventListener("click",()=>{
	let containerNewAcc = document.querySelector(".container-newAccount");
	let nAcc = document.querySelector(".name-acc");
	let nStore = document.querySelector(".name-store");
    if (nAcc.value.length > 4 & nStore.value.length > 4) {
    	crearCuenta(nAcc.value,nStore.value)
    	nAcc.value = "";
    	nStore.value = ""; 
        let h3 = document.createElement("H3");
    	h3.classList.add("valido")
    	h3.textContent = "CUENTA CREADA CORRECTAMENTE";
        containerNewAcc.appendChild(h3)
        setTimeout(()=>{
        	h3.style.display = "none";
        },3000)
    }else{
    	let h3 = document.createElement("H3");
    	h3.classList.add("errorAcc")
    	h3.textContent = "EL NOMBRE TIENE QUE SER MAYOR DE 4 CARACTERES AL IGUAL QUE EL NOMBRE DEL CLIENTE";
        containerNewAcc.appendChild(h3)
        setTimeout(()=>{
        	h3.style.display = "none";
        },3000)

    }
    

})



  const mostrarCuenta =(nombreAccount)=>{
  	   localStorage.setItem("nameAccount",nombreAccount)
  	   console.log(nombreAccount)
       let request = indexedDB.open(nombreAccount);
    request.addEventListener("success",()=>{
    	let db = request.result;
    	let nameObjectStore = db.objectStoreNames[0];
    	localStorage.setItem("nameObjectStore", nameObjectStore)

    	console.log(nameObjectStore);
    	let transactionDB = db.transaction(nameObjectStore,"readonly");
    		 document.querySelector(".nombres").innerHTML = "";
    	const documentFrag = document.createDocumentFragment();
    	let object = transactionDB.objectStore(nameObjectStore)
    	let cursor = object.openCursor();
    	cursor.addEventListener("success",()=>{
        if (cursor.result) {
            let contentHTML  = HTMLCode(cursor.result.key, cursor.result.value, cursor.result.value, nombreAccount , nameObjectStore);
            documentFrag.appendChild(contentHTML)
            cursor.result.continue();
        }else{
        	 document.querySelector(".nombres").appendChild(documentFrag)
        }
    	})
    })
   
   }

const addObjects = (obj, monto) =>{    
     let nameAcc = localStorage.getItem("nameAccount");
    let nameObjectStore = localStorage.getItem("nameObjectStore");

    const indexedDBRequest = indexedDB.open(nameAcc);

    indexedDBRequest.addEventListener("success",()=>{
    	const db = indexedDBRequest.result;
    	const idbTransaction = db.transaction(nameObjectStore,"readwrite")
    	const objectStore = idbTransaction.objectStore(nameObjectStore);
    	objectStore.add(obj, monto)
    })
}

const leerObjectos = ()=>{
	 let nameAcc = localStorage.getItem("nameAccount");
	 const documentFrag = document.createDocumentFragment(); 
	 document.querySelector(".nombres").innerHTML = "";  
    let nameObjectStore = localStorage.getItem("nameObjectStore");
     let nombre = document.getElementById("nombre").value = "";
     let monto = document.getElementById("monto").value = "";  
    const indexedDBRequest = indexedDB.open(nameAcc);
    indexedDBRequest.addEventListener("success",()=>{
    	const db = indexedDBRequest.result;
    	const idbTransaction = db.transaction(nameObjectStore,"readonly")
    	const objectStore = idbTransaction.objectStore(nameObjectStore);
    	const cursor = objectStore.openCursor();
    	cursor.addEventListener("success",()=>{
    	if (cursor.result) {
            let contentHTML  = HTMLCode(cursor.result.key, cursor.result.value, cursor.result.value);
            documentFrag.appendChild(contentHTML)
            cursor.result.continue();
        }else{
        	 document.querySelector(".nombres").appendChild(documentFrag)
        }
    	})
    })


}

const eliminarObject = (key) =>{
     let nameAcc = localStorage.getItem("nameAccount");
    let nameObjectStore = localStorage.getItem("nameObjectStore");

    const indexedDBRequest = indexedDB.open(nameAcc);

    indexedDBRequest.addEventListener("success",()=>{
    	const db = indexedDBRequest.result;
    	const idbTransaction = db.transaction(nameObjectStore,"readwrite")
    	const objectStore = idbTransaction.objectStore(nameObjectStore);
    	objectStore.delete(key)
    })
}

const modificarObject = (key,obj,monto)=>{
    let nameAcc = localStorage.getItem("nameAccount");
    let nameObjectStore = localStorage.getItem("nameObjectStore");

    const indexedDBRequest = indexedDB.open(nameAcc);

    indexedDBRequest.addEventListener("success",()=>{
    	const db = indexedDBRequest.result;
    	const idbTransaction = db.transaction(nameObjectStore,"readwrite")
    	const objectStore = idbTransaction.objectStore(nameObjectStore);
    	objectStore.put({nombre:obj,monto:monto},key)
    })
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
             	 console.log(h2.textContent)
                 modificarObject(id,h2.textContent,h3.textContent)
                 botonSave.classList.replace("posible","imposbile")

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
         let nameAccount = localStorage.getItem("nameAccount");
         let nameObjectStore = localStorage.getItem("nameObjectStore");
         let indexedDBRequest = indexedDB.open(nameAccount);
         indexedDBRequest.addEventListener("success",()=>{
         const db = indexedDBRequest.result;
    	const idbTransaction = db.transaction(nameObjectStore,"readonly")    	
        const objectStore = idbTransaction.objectStore(nameObjectStore);
    	const cursor = objectStore.openCursor();
    	cursor.addEventListener("success",()=>{
    	 if (cursor.result == null) {
               error();
            }else{
                leerObjectos();
            }
    	})        	
         })
    })

      const error = () =>{
      let divPadre = document.querySelector(".nombres");

     let div = document.createElement("DIV");
     div.classList.add("error");

     div.textContent = "¡NO HAY DATOS!"

      divPadre.appendChild(div);

  }

const showDataBase = (data) =>{
  let showNameAccount = document.querySelector(".name-account-client");
  let resultado = document.querySelector(".resultados-accounts")
  let containerAccounts = document.querySelector(".container-accounts");
  let contentAdd = document.querySelector(".content-add");
  let h2 = document.createElement("H2"); 
  h2.addEventListener("click",()=>{
     showNameAccount.textContent = data.name;	
    if (contentAdd.classList.contains("hidden")) {
    	contentAdd.classList.replace("hidden","visible");
    	containerAccounts.classList.replace("visible","hidden");
    }
  	mostrarCuenta(data.name,data.version)
  })
  let b = document.createElement("B");
  h2.textContent = "Cuenta de:  " 
  b.textContent = data.name;
  h2.appendChild(b)
  resultado.appendChild(h2)
}


document.querySelector(".accounts").addEventListener("click",()=>{
    let contentAdd = document.querySelector(".content-add");
    let containerNewAcc = document.querySelector(".container-newAccount")	
	let containerAccounts = document.querySelector(".container-accounts");
    if (contentAdd.classList.contains("visible") || containerNewAcc.classList.contains("visible")) {
    	contentAdd.classList.replace("visible","hidden");
    	containerNewAcc.classList.replace("visible","hidden");
    	containerAccounts.classList.replace("hidden","visible");
    }

       indexedDB.databases().then(res=>{
       	    let resultado = document.querySelector(".resultados-accounts").innerHTML= "";	
            for (let i = 0; i < res.length; i++) {

   	          showDataBase(res[i])
          }
       })
})



