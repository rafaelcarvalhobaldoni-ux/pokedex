let numPokemon='';
let estadoPokedex={
    digitando:false,
}

const key1 = document.querySelector('#key-1');
const key2 = document.querySelector('#key-2');
const key3 = document.querySelector('#key-3');
const key4 = document.querySelector('#key-4');
const key5 = document.querySelector('#key-5');
const key6 = document.querySelector('#key-6');
const key7 = document.querySelector('#key-7');
const key8 = document.querySelector('#key-8');
const key9 = document.querySelector('#key-9');
const key10 = document.querySelector('#key-10');

const btnWhiteLeft = document.querySelector('#btn-white-left');
const btnWhiteRight = document.querySelector('#btn-white-right');

const dpadUp = document.querySelector('#btn-up');
const dpadDown = document.querySelector('#btn-down');
const dpadLeft = document.querySelector('#btn-left');
const dpadRight = document.querySelector('#btn-right');

const infoScreen = document.querySelector('#info-screen');
const mainScreen = document.querySelector('#main-screen');
const numberDisplay = document.querySelector('#number-display');

key1.addEventListener('click', ()=> leituraTeclado('1'));
key2.addEventListener('click', ()=> leituraTeclado('2'));
key3.addEventListener('click', ()=> leituraTeclado('3'));
key4.addEventListener('click', ()=> leituraTeclado('4'));
key5.addEventListener('click', ()=> leituraTeclado('5'));
key6.addEventListener('click', ()=> leituraTeclado('6'));
key7.addEventListener('click', ()=> leituraTeclado('7'));
key8.addEventListener('click', ()=> leituraTeclado('8'));
key9.addEventListener('click', ()=> leituraTeclado('9'));
key10.addEventListener('click', ()=> leituraTeclado('0'));

btnWhiteLeft.addEventListener('click', buscarPokemon);
btnWhiteRight.addEventListener('click', apagar);

dpadUp.addEventListener('click',()=>setasPokemon('cima'));
dpadDown.addEventListener('click',()=>setasPokemon('baixo'));
dpadLeft.addEventListener('click',()=>setasPokemon('esquerda'));
dpadRight.addEventListener('click',()=>setasPokemon('direita'));

function setasPokemon(sentido){
    let numeroAtual=Number(numberDisplay.textContent.replace('#',''));
    if (sentido=='cima'){
        numeroAtual=numeroAtual+10;
    }
    else if (sentido=='baixo'){
        numeroAtual=numeroAtual-10;
    }
    else if (sentido=='esquerda'){
        numeroAtual=numeroAtual-1;
    }
    else{
        numeroAtual=numeroAtual+1;
    }
    if(numeroAtual<1){
        return;
    }

    numPokemon=numeroAtual;
    consultarApi(numPokemon);
}

function leituraTeclado(tecla){
    if(!estadoPokedex.digitando){
        infoScreen.textContent='';
        estadoPokedex.digitando = true;
        numPokemon='';
    }
    numPokemon += tecla;
    infoScreen.textContent=numPokemon;
}

async function consultarApi(msg) {
    try{
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${msg}`);
    if(!response.ok){
    throw new Error('Pokemon não encontrado!');
}
    const data = await response.json();
    const responseRegiao = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${msg}`);
    const dataRegiao = await responseRegiao.json();
    numberDisplay.textContent=(`#${data.id}`);
    const urlImage = data.sprites.front_default;
    exibirDados(data,dataRegiao);
    exibirSprite(urlImage);
    estadoPokedex.digitando=false;
    numPokemon='';

    }
    catch(erro){
        alert(erro.message);
    }
}

function buscarPokemon(){
    consultarApi(numPokemon);
}

function apagar(){
    if (estadoPokedex.digitando){
        numPokemon=numPokemon.slice(0,-1);
        if(numPokemon.length<1){
            estadoPokedex.digitando= false;
            infoScreen.textContent='Aguardando dados...';
        }
        else{
        infoScreen.textContent=numPokemon;}
    }

}
function exibirSprite(urlImage){
    mainScreen.textContent='';
    const img = document.createElement('img');
    img.src=urlImage;
    if(window.innerWidth<600){
        img.style.width= '75px'
    }
    else{
        img.style.width= '115px'
        img.style.transform='translate(0,-5px)';
    }
    mainScreen.appendChild(img);
}
function exibirDados(data,dataRegiao){
    infoScreen.textContent='';
    const nome = document.createElement('p');
    nome.textContent=capitalizar(data.name);
    nome.style.fontWeight='bold';

    const tipo=document.createElement('p');
    if(data.types.length>1){
        tipo.textContent='Tipos: '+traduzirTipo(data.types[0].type.name)+', '+traduzirTipo(data.types[1].type.name);
    }
    else{
        tipo.textContent='Tipo: '+traduzirTipo(data.types[0].type.name);
    }
    
    const pesoAltura = document.createElement('p');
    let pesoKg=data.weight/10;
    let pesoFinal=0;
    let unidadePeso='';
    if(pesoKg<1){
        pesoFinal=Math.round(pesoKg*1000);
        unidadePeso= 'g';
    }
    else{
        pesoFinal=pesoKg.toFixed(1);
        unidadePeso= 'Kg';
    }
    let alturaMetro=data.height/10;0
    let alturaFinal=0;
    let unidadeAltura='';
    if (alturaMetro<1){
        alturaFinal= Math.round(alturaMetro*100);
        unidadeAltura = 'cm';
    }
    else{
        alturaFinal=alturaMetro.toFixed(2);
        unidadeAltura='m';
    }
    pesoAltura.textContent='Peso:'+pesoFinal+unidadePeso+' | Altura:'+alturaFinal+unidadeAltura;

    const regiao = document.createElement('p');
    regiao.textContent='Região: '+traduzirRegiao(dataRegiao.generation.name);

    infoScreen.append(nome,tipo,pesoAltura,regiao); 
}
function capitalizar(str){
    const strCapitalizada = str.charAt(0).toUpperCase() + str.slice(1);
    return strCapitalizada;
}





function traduzirTipo(tipo){
    const tipos={
        normal:'Normal',
        fire:'Fogo',
        water:'Água',
        electric:'Elétrico',
        grass:'Planta',
        ice:'Gelo',
        fighting:'Lutador',
        poison:'Venenoso',
        ground:'Terrestre',
        flying:'Voador',
        psychic:'Psíquico',
        bug:'Inseto',
        rock:'Pedra',
        ghost:'Fantasma',
        dragon:'Dragão',
        dark:'Sombrio',
        steel:'Aço',
        fairy:'Fada'
    };

    return tipos[tipo] || tipo;
}
function traduzirRegiao(regiao){
    const regioes={
        'generation-i':'Kanto',
        'generation-ii':'Johto',
        'generation-iii':'Hoenn',
        'generation-iv':'Sinnoh',
        'generation-v':'Unova',
        'generation-vi':'Kalos',
        'generation-vii':'Alola',
        'generation-viii':'Galar',
        'generation-ix':'Paldea'
    };

    return regioes[regiao] || regiao;
}