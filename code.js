let btnAccountNew = document.querySelector(".newAccount");
let btnResultados = document.querySelector(".resultados");



const removeContentAdd =()=>{
	let containerAccounts = document.querySelector(".container-accounts");	
   let contentAdd = document.querySelector(".content-add");
   let containerResults = document.querySelector(".container-resultado");
   let containerNewAcc = document.querySelector(".container-newAccount")
   if (contentAdd.classList.contains("visible") || containerAccounts.classList.contains("visible") || containerResults.classList.contains("visible")) {
   	    btnAccountNew.textContent = "Volver";
   	    containerNewAcc.classList.replace("hidden","visible");
   	    contentAdd.classList.replace("visible","hidden");
   	    containerAccounts.classList.replace("visible","hidden");
        containerResults.classList.replace("visible","hidden");

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
     let nameAcc = localStorage.getItem("nameAccount");
    let nameObjectStore = localStorage.getItem("nameObjectStore");

     if (nombre.length > 0 & monto.length > 0) {
        if (nameAcc != null  & nameObjectStore != null) {
         let fecha = new Date();
         let fechaDelFio = `${fecha.getDate()}/${fecha.getMonth()}/${fecha.getYear()-100}`;
         addObjects({nombre,monto,fechaDelFio});
        leerObjectos();
        }else{
            error("No Hay Cuentas Registradas")
        }
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
        },4000)
    }else{
    	let h3 = document.createElement("H3");
    	h3.classList.add("errorAcc")
    	h3.textContent = "EL NOMBRE TIENE QUE SER MAYOR DE 4 CARACTERES AL IGUAL QUE EL NOMBRE DEL CLIENTE";
        containerNewAcc.appendChild(h3)
        setTimeout(()=>{
        	h3.style.display = "none";
        },4000)

    }
    

})



  const mostrarCuenta =(nombreAccount,fecha)=>{
  	   localStorage.setItem("nameAccount",nombreAccount)
  	   console.log(fecha)
       let request = indexedDB.open(nombreAccount);
       if (localStorage != null) {
        request.addEventListener("success",()=>{
        let db = request.result;
        let nameObjectStore = db.objectStoreNames[0];
        localStorage.setItem("nameObjectStore", nameObjectStore)
        let transactionDB = db.transaction(nameObjectStore,"readonly");
             document.querySelector(".nombres").innerHTML = "";
        const documentFrag = document.createDocumentFragment();
        let object = transactionDB.objectStore(nameObjectStore)
        let cursor = object.openCursor();
        cursor.addEventListener("success",()=>{
        if (cursor.result) {
            let contentHTML  = HTMLCode(cursor.result.key, cursor.result.value, cursor.result.value, nombreAccount , nameObjectStore,fecha);
            documentFrag.appendChild(contentHTML)
            cursor.result.continue();
        }else{
             document.querySelector(".nombres").appendChild(documentFrag)
        }
        })
    })
       }
   
   }

const addObjects = (obj, monto,fecha) =>{    
     let nameAcc = localStorage.getItem("nameAccount");
    let nameObjectStore = localStorage.getItem("nameObjectStore");

   if (nameAcc != null & nameObjectStore != null) {
        const indexedDBRequest = indexedDB.open(nameAcc);

    indexedDBRequest.addEventListener("success",()=>{
        const db = indexedDBRequest.result;
        const idbTransaction = db.transaction(nameObjectStore,"readwrite")
        const objectStore = idbTransaction.objectStore(nameObjectStore);
        objectStore.add(obj, monto,fecha)
    })
}else{
    alert("no hay cuentas")
}
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
            numbers(cursor.result.value.monto, cursor.result.value.nombre, cursor.result.source.name)
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

    h3.classList.add("dinero");

    h2.textContent = name.nombre;
    h2.setAttribute("spellcheck","false")
    h3.textContent = "S/  " +monto.monto;
    h3.setAttribute("spellcheck","false")    

    let divOptions = document.createElement("DIV");
    divOptions.classList.add("options")

    
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

    divOptions.appendChild(botonDelete);

    div.appendChild(contentInputs)
    div.appendChild(divOptions);


    
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
        
        if (nameAccount != null & nameObjectStore != null) {
        let indexedDBRequest = indexedDB.open(nameAccount);
        indexedDBRequest.addEventListener("success",()=>{
        const db = indexedDBRequest.result;
        const idbTransaction = db.transaction(nameObjectStore,"readonly")   
        const objectStore = idbTransaction.objectStore(nameObjectStore);
        const cursor = objectStore.openCursor();
        cursor.addEventListener("success",()=>{
         if (cursor.result == null) {
               error("¡NO HAY NADA EN LA CUENTA!");
            }else{
                leerObjectos();
            }
        })        
         })

        }
     else{
        error("¡NO HAY CUENTAS EN LA BASE DE DATOS!")
     }

     })
      const error = (msj) =>{
      let divPadre = document.querySelector(".nombres");
     let div = document.createElement("DIV");
     div.classList.add("error");

     div.textContent = msj;
     if (divPadre.lastElementChild == null) {
        divPadre.appendChild(div);
    }else if (divPadre.lastElementChild.classList.contains("error")) {
          divPadre.removeChild(divPadre.lastElementChild)
    }


  }

const deleteAccountDB = (nombre)=>{
    let  borrarDataBase = indexedDB.deleteDatabase(nombre);
    borrarDataBase.addEventListener("error",()=>{
          console.log("Error deleting database.");
    })
    borrarDataBase.addEventListener("success",(e)=>{
    console.log("La Base De Datos Fue Eliminada CORRECTAMENTE")
    })
    location.reload();
}
const showDataBase = (data) =>{
    console.log(data)
  let showNameAccount = document.querySelector(".name-account-client");
  let resultado = document.querySelector(".resultados-accounts")
  let containerAccounts = document.querySelector(".container-accounts");
  let containerResults = document.querySelector(".container-resultado");
  let divcontenedor = document.createElement("DIV");
  divcontenedor.classList.add("contenedor-result")    
  let contentAdd = document.querySelector(".content-add");
  let h2 = document.createElement("H2");
  let span = document.createElement("SPAN");
  span.textContent = "Eliminar";
  span.classList.add("eliminarAcc");
  span.addEventListener("click",()=>{
     span.style.xIndex = 100000;
     deleteAccountDB(data.name);
     localStorage.removeItem("nameAccount")
     localStorage.removeItem("nameObjectStore")
  }) 
  h2.addEventListener("click",()=>{
     showNameAccount.textContent = data.name;	
    if (contentAdd.classList.contains("hidden")) {
    	contentAdd.classList.replace("hidden","visible");
    	containerAccounts.classList.replace("visible","hidden");
        containerResults.classList.replace("visible","hidden");

    }
  	mostrarCuenta(data.name,data.fechaDelFio)
  })
  let b = document.createElement("B");
  h2.textContent = "Cuenta de:  " 
  b.textContent = data.name;
  h2.appendChild(b)
  divcontenedor.appendChild(h2)
  divcontenedor.appendChild(span)
  resultado.appendChild(divcontenedor)
}


document.querySelector(".accounts").addEventListener("click",()=>{
    let contentAdd = document.querySelector(".content-add");
    let containerNewAcc = document.querySelector(".container-newAccount")	
	let containerAccounts = document.querySelector(".container-accounts");
    let containerResults = document.querySelector(".container-resultado");    
    if (contentAdd.classList.contains("visible") || containerNewAcc.classList.contains("visible") || containerResults.classList.contains("visible")) {
    	contentAdd.classList.replace("visible","hidden");
    	containerNewAcc.classList.replace("visible","hidden");
        containerResults.classList.replace("visible","hidden");
    	containerAccounts.classList.replace("hidden","visible");
    }

       indexedDB.databases().then(res=>{
       	    let resultado = document.querySelector(".resultados-accounts").innerHTML= "";	
            for (let i = 0; i < res.length; i++) {
              console.log(res[i])
   	          showDataBase(res[i])
          }
       })
})


        const numbers = (numeros,producto,nombreCliente,fecha)=>{
         let h3Content = document.querySelector(".nameOfAccountClient")
         let containerResults = document.querySelector(".content-resultados-of-buy");
         let p = document.createElement("P");
         let divNumers = document.querySelector(".contents-result-numbers");
         let b = document.createElement("B");
         let span = document.createElement("SPAN");
        if (h3Content.lastElementChild == null || h3Content.lastElementChild.textContent != nombreCliente){
                    if (h3Content.childNodes[1]) {
                        h3Content.removeChild(h3Content.childNodes[1])
                    }
                    p.classList.add("clienteName");
                    p.textContent = nombreCliente;
                    h3Content.appendChild(p)
         }
         let bFecha = document.createElement("B");
         bFecha.classList.add("fecha");
         bFecha.style.padding = "0 0 0 5px"
         bFecha.style.fontWeight = "lighter"
         bFecha.textContent = fecha;
        span.textContent = producto;
        span.appendChild(bFecha)
         b.textContent ="S/ " + numeros;
         b.classList.add("numbers");
         b.appendChild(span)
         divNumers.appendChild(b)
         if (containerResults.lastElementChild.classList.contains("btn-total") == false ){
                       let btn  = document.createElement("BUTTON");
                      btn.classList.add("btn-total")
                      btn.textContent = "Total";
                      containerResults.appendChild(btn)
                      btn.addEventListener("click",()=>{
                        let contentnumber = document.querySelector(".monto-number");
                        let number = document.querySelectorAll(".numbers");
                        let suma = 0;
                        for (let i = 0; i < number.length; i++) {
                            let text = number[i].childNodes[0].textContent;
                            let result = text.replace("S/ ","");
                            suma+= Number(result);
                        }
                       contentnumber.textContent = "S/  " + suma.toFixed(2);
                      })
         }


        } 

btnResultados.addEventListener("click",()=>{
    let contentAdd = document.querySelector(".content-add");
    let containerNewAcc = document.querySelector(".container-newAccount");   
    let containerAccounts = document.querySelector(".container-accounts");
    let containerResults = document.querySelector(".container-resultado");
    if (contentAdd.classList.contains("visible") || containerNewAcc.classList.contains("visible") || containerAccounts.classList.contains("visible")) {
        contentAdd.classList.replace("visible","hidden");
        containerNewAcc.classList.replace("visible","hidden");
        containerAccounts.classList.replace("visible","hidden");
        containerResults.classList.replace("hidden","visible");
            let nameAccount = localStorage.getItem("nameAccount");
           let nameObjectStore = localStorage.getItem("nameObjectStore");
        
        if (nameAccount != null & nameObjectStore != null) {
        let indexedDBRequest = indexedDB.open(nameAccount);
        indexedDBRequest.addEventListener("success",()=>{
        const db = indexedDBRequest.result;
        const idbTransaction = db.transaction(nameObjectStore,"readonly")   
        const objectStore = idbTransaction.objectStore(nameObjectStore);
        document.querySelector(".monto-number").innerHTML="X";
        document.querySelector(".contents-result-numbers").innerHTML="";
        const cursor = objectStore.openCursor();
        cursor.addEventListener("success",()=>{
         if (cursor.result) {
            console.log(cursor.result.value.fechaDelFio)
            numbers(cursor.result.value.monto, cursor.result.value.nombre, cursor.result.source.name,cursor.result.value.fechaDelFio)
            cursor.result.continue();
            }
        })        
         })}
    }
})

let menubar = document.querySelector(".menu-bar");

menubar.addEventListener("click",()=>{
    let nav = document.querySelector(".option-accounts");
    nav.classList.toggle("active")
})

window.addEventListener("DOMContentLoaded",()=>{
    let h1Rofl = document.querySelector(".name-account-client");
    let name = localStorage.getItem("nameObjectStore");
    if (name) {
        h1Rofl.textContent = name;
    }
})


let optionsNav = document.querySelectorAll(".option-item");
for (let i = 0; i < optionsNav.length; i++) {
    optionsNav[i].addEventListener("click",()=>{
            let nav = document.querySelector(".option-accounts");
            nav.classList.remove("active")
    })
}




       
    



