    //declaracao de variables

    const inputPlaca = document.querySelector("#input-placa");
    const buttonPesquisar = document.querySelector("#buttonPesquisar");
    const mensajeError = document.querySelector("#mensajeError");
    const multasBody = document.querySelector("#multasBody");


    //declacrion de array
    const multas = [
        {nombre:'Ana', apellido:'González', placa:'ABC-1234', multas:3, marca:'Volkswagen', modelo:'Ibiza'},
        {nombre:'Carlos', apellido:'López', placa: 'DEF-5678', multas: 0, marca: 'Ford', modelo: 'Fiesta' },
        {nombre:'María', apellido:'Rodríguez', placa: 'GHI-9012', multas: 1, marca: 'Chevrolet', modelo: 'Cruze' },
        {nombre:'Juan', apellido:'Martínez', placa: 'JKL-3456', multas: 2, marca: 'Honda', modelo: 'Civic' },
        {nombre:'Laura', apellido:'Hernández', placa: 'MNO-7890', multas: 5, marca: 'Toyota', modelo: 'Corolla' },
        {nombre:'Diego', apellido:'Gómez', placa: 'PQR-2345', multas: 2, marca: 'Volkswagen', modelo: 'Golf' },
        {nombre:'Sofía', apellido:'Pérez', placa: 'STU-6789', multas: 4, marca: 'Ford', modelo: 'Focus' },
        {nombre:'Javier', apellido:'Sánchez', placa: 'VWX-9012', multas: 0, marca: 'Renault', modelo: 'Megane' },
        {nombre:'Valentina', apellido:'Torres', placa: 'YZA-3456', multas: 1, marca: 'Chevrolet', modelo: 'Onix' },
        {nombre:'Carolina', apellido:'Morales', placa: 'KLM-9012', multas: 0, marca: 'Ford', modelo: 'EcoSport' },
        {nombre:'Matías', apellido:'Navarro', placa: 'NOP-3456', multas: 2, marca: 'Renault', modelo: 'Clio' },
        {nombre:'Luisa', apellido:'Castillo', placa: 'QRS-7890', multas: 3, marca: 'Chevrolet', modelo: 'Tracker' }
      ];
      
      

    //evento 
    buttonPesquisar.addEventListener("click", () => {
        pesquisarPlaca();
      });
    //funciones

//funcion para pesquisar a placla
    const pesquisarPlaca = async () => {
        //uso el Upper para dejar el valor maisculo y expresion regulada
        const placa = inputPlaca.value.toUpperCase();
        const regexPlaca = /^[A-Z]{3}-\d{4}$/;
    
        if (!regexPlaca.test(placa)) {
        mensajeError.textContent="Formato de placa inválido xxx-1234";
        return;
        }
    //try metodo da funcion async para gestionar possiveis erros.
        try {
            //usado await para que espere que execute a pesquisar e devolva el valor 
            //a funcao pesquisar multas pesquisa se a placa fornecida esta en el array multas
        const multasEncontradas = await pesquisarMultas(placa);
           //caso o tamanho de array de multas seja zero es sinal que nao tienes en banco de dados
        if (multasEncontradas.length === 0) {
            mensajeError.textContent = "Placa de coche no encontrada";
            //caso a funcion tenha multa de valor 0 e que nao tem multas
        } else if (multasEncontradas[0].multas === 0) {
            mensajeError.textContent="O carro não possui multas";
            //caso a multa for encontrada eu chamo a funcion para pintar la tabla
        } else {
        exibirMultas(multasEncontradas);
        mensajeError.textContent = ""
        }
        //chamo a funcion  salvar placa para que guarde no localstorage a placa del coche
        salvarPesquisa(placa);
        
        //el catch caso por N motivos de outro erro
        } catch (error) {
        mensajeError.textContent = "Erro ao pesquisar multas";
        }
    };


    //a funcao pesquisar multas e criada para verificar no bancode dados(array) se a placa fornecida a multa
    //uso metodo de async para que possa passar a informacao para a funcao pesquisarPlaca 
    const pesquisarMultas = async (placa) => {
        //await no acepta el metodo setTimeout tendo que usar uma promesa junta para resolcer
        await new Promise((resolve) => {
            //uso el metodo setTimeoout para que de tiempo de carga la base de dados
        setTimeout(() => {
            //uso el metodo filter para filtrar e criar uno nuevo array caso a placa exista
            const multasEncontradas = multas.filter((multa) => multa.placa === placa);
            resolve(multasEncontradas);
        }, 1000);
        });
        //coloco el array filtrado dentro de una variable e retorno para a funcao pesquisar
        const multasEncontradas = multas.filter((multa) => multa.placa === placa);
        return multasEncontradas;
    };
    
    
    //funcao para pintar a tabla
    const exibirMultas = multas => {
        multas.forEach(multa => {
           
            //NAO FUNCIONA - criado para que se ya tenga la informacion pintada no repita
            if (multas.includes(multa.placa)) {
                return; 
            }

            const row = document.createElement("TR");

            const placaCelula = document.createElement("TD")
            placaCelula.textContent = multa.placa
            row.append(placaCelula);

            const marcaCelula = document.createElement("TD");
            marcaCelula.textContent = multa.marca;
            row.append(marcaCelula);

            const modeloCelula = document.createElement("TD");
            modeloCelula.textContent = multa.modelo;
            row.append(modeloCelula);
    
            const nombreCelula = document.createElement("TD");
            nombreCelula.textContent = multa.nombre;
            row.append(nombreCelula);

            const nombreApellido = document.createElement("TD");
            nombreApellido.textContent = multa.apellido;
            row.append(nombreApellido);

           const cantidadMultaCelula = document.createElement("TD")
           cantidadMultaCelula.textContent = multa.multas
           row.append(cantidadMultaCelula );
    
          // crio el boton para elimar una pesquisa que no queira
          const eliminarCelular = document.createElement("TD");
          const deleteButton = document.createElement("button");    
          deleteButton.innerHTML = "x";
          deleteButton.classList.add("delete-button");
         // crio o evento para excluir - obs: evento dentro do foreach pq necesito uno evento por boton
        deleteButton.addEventListener("click", () => {
            // excluirPesquisa(multa.placa);
            row.remove();
        });
        
        row.append(eliminarCelular);
        eliminarCelular.append(deleteButton)

        multasBody.append(row);
        });
    };
    
    

    //funcion criada para salvar a pesquisa del usuario no localstorage
    const salvarPesquisa =  placa => {
        // traigo el localStorage para o js
        let pesquisas = localStorage.getItem("pesquisas");
    
        //verifica se a existe a llabe pesquisa en el local y transforma para array
        if (pesquisas) {
        pesquisas = JSON.parse(pesquisas);
        //percorre el array y devuelve se existe este valor en ello caso no exista hace un push para el array
        if (!pesquisas.includes(placa)) {
            pesquisas.push(placa);
        }
        //caso no exista a llave pesquisa es inserido en el array
        } else {
        pesquisas = [placa];
        }
        // envia para o localstoroge
        localStorage.setItem("pesquisas", JSON.stringify(pesquisas));
    };
    
    //funcion creada para recuperar o q tenga en localstorage
    const recuperarPesquisas = () => {
        //traigo la llave para el js como array
        const pesquisas = JSON.parse(localStorage.getItem("pesquisas"));
        //crio una condicion donde se tienes pesquisa y ella es maior q 0 la longitude del array .
        if (pesquisas && pesquisas.length > 0) {
            // uso for each para pintar la tabla usando la funcion exibir usando filter para comparar.
        pesquisas.forEach(placa => {
            const multasEncontradas = multas.filter(multa => multa.placa === placa);
            exibirMultas(multasEncontradas);
        });
        }
    };
    
    // const excluirPesquisa = placa => {
    //     let pesquisas = JSON.parse(localStorage.getItem("pesquisas"));
    
    //     if (pesquisas) {
    //     pesquisas = pesquisas.filter(item => item !== placa);
    //     localStorage.setItem("pesquisas", JSON.stringify(pesquisas));
    //     }
    // };
    
    recuperarPesquisas();

    
    