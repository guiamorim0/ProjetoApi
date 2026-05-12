// declaracoes dos elementos usando dom 
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("resultado");
const canvas = document.getElementById("canvas");

// funcao que habilita a camera

async function configurarCamera() {
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"}, // aciona a camera traseira
            audio: false
        });
        // recebe a funcao midia para habilitar a camera
        videoElemento.srcObject = midia;
        //garante que o video comece
        videoElemento.play();

    }catch(erro) {
        resultado.innerHTML="Erro ao acessar a camera",erro
    }
}
//executa a funcao da camera
configurarCamera();

// funcao para ler o texto que a camera pegar

botaoScanear.onclick = async ()=>{
    botaoScanear.disable=true; // habilita a camera
    resultado.innerHTML="Fazendo a leitura...aguarde";

    // preparando o canvas para criar estrutra da camera 
    const contexto = canvas.getContext("2d");

    // ajustar o tamanho do canvas
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // reset para garantir que a foto nao saia invertida
    contexto.setTransform(1,0,0,1,0,0);

    // filtro de contraste e escala de cinza antes de tirar a foto
    // ajuda a evitar as letras aleatorias
    
    contexto.filter = 'contrast(1.2) grayscale(1)';
    try{
        const { data: { text }} = await Tesseract.recognize(
            canvas, // aonde o texto vai aparecer
            'por' // idioma do texto
        );
        // remove os espacos excessivos e caracteres especiais
        const textoFinal = text.trim();
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Nao foi possivel identificar o texto"

    }catch(erro){
        console.error(erro);
        resultado.innerText="Erro ao processar",erro
    }
    finally{
        botaoScanear.disable=false; // desabilita a camera para fazer uma nova captura
    }

}