let inputPeso;
let botaoCalcular;
let aguaTotalMl = 0;
let aguaTotalLitros = 0;
let mostrarResultado = false;
let gotas = [];
let anguloOnda = 0; 
let cnv; // Variável para guardar o nosso canvas (a tela do jogo)

function setup() {
  // Guardamos o canvas nessa variável 'cnv'
  cnv = createCanvas(800, 600); 

  // Pegamos a posição real do canvas na tela do navegador
  let xCanvas = cnv.position().x;
  let yCanvas = cnv.position().y;

  inputPeso = createInput('');
  // Somamos a posição do canvas (+ xCanvas) com a posição que queremos
  inputPeso.position(xCanvas + width / 2 - 90, yCanvas + 160);
  inputPeso.size(80, 30);
  inputPeso.style('font-size', '20px');
  inputPeso.style('text-align', 'center');
  inputPeso.style('border-radius', '8px');
  inputPeso.style('border', '2px solid #00838F');
  inputPeso.style('outline', 'none');

  botaoCalcular = createButton('Calcular!');
  // Somamos a posição do canvas (+ xCanvas) também para o botão
  botaoCalcular.position(xCanvas + width / 2 + 10, yCanvas + 160); 
  botaoCalcular.size(100, 36);
  botaoCalcular.style('background-color', '#00ACC1');
  botaoCalcular.style('color', 'white');
  botaoCalcular.style('font-size', '18px');
  botaoCalcular.style('border-radius', '8px');
  botaoCalcular.style('border', 'none');
  botaoCalcular.style('cursor', 'pointer');
  botaoCalcular.style('font-weight', 'bold');
  botaoCalcular.style('box-shadow', '0px 4px 6px rgba(0,0,0,0.2)');
  
  botaoCalcular.mousePressed(calcularAgua);

  for (let i = 0; i < 25; i++) {
    gotas.push(new Gota());
  }
}

// Essa função do p5.js garante que os botões não saiam do lugar se a tela mudar de tamanho!
function windowResized() {
  let xCanvas = cnv.position().x;
  let yCanvas = cnv.position().y;
  inputPeso.position(xCanvas + width / 2 - 90, yCanvas + 160);
  botaoCalcular.position(xCanvas + width / 2 + 10, yCanvas + 160);
}

function calcularAgua() {
  let peso = parseFloat(inputPeso.value());
  
  if (peso > 0) {
    aguaTotalMl = peso * 35; 
    aguaTotalLitros = (aguaTotalMl / 1000).toFixed(2);
    mostrarResultado = true;
  }
}

function draw() {
  setGradient(0, 0, width, height, color('#B2EBF2'), color('#00BCD4')); 

  fill(255, 255, 255, 60); 
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let y = map(sin(anguloOnda + x * 0.005), -1, 1, height - 200, height - 50);
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  anguloOnda += 0.03; 

  for (let i = 0; i < gotas.length; i++) {
    gotas[i].cair();
    gotas[i].mostrar();
  }

  textAlign(CENTER);
  
  stroke(255); 
  strokeWeight(4); 
  fill('#006064'); 
  textSize(42);
  textStyle(BOLD);
  text('💧 Calculadora da Saúde! 💧', width / 2, 80);

  strokeWeight(2);
  textSize(24);
  textStyle(NORMAL);
  fill('#006064');
  text('Descubra a quantidade ideal de água para o seu corpo.', width / 2, 120);
  
  strokeWeight(3);
  fill('#004D40');
  textStyle(BOLD);
  text('Peso (kg):', width / 2 - 165, 185); 

  if (mostrarResultado) {
    strokeWeight(3);
    fill('#E65100');
    textSize(26);
    textStyle(BOLD);
    text('A Matemática da Hidratação:', width / 2, 270);
    
    strokeWeight(4);
    textSize(34);
    fill('#004D40'); 
    textStyle(NORMAL);
    text(inputPeso.value() + ' kg   x   35 ml   =   ' + aguaTotalMl + ' ml', width / 2, 320);

    strokeWeight(4);
    fill('#01579B'); 
    textSize(40);
    textStyle(BOLD);
    text('Sua meta é: ' + aguaTotalLitros + ' Litros por dia!', width / 2, 380);

    noStroke(); 
    let quantidadeCopos = Math.ceil(aguaTotalMl / 250);
    let limiteCopos = min(quantidadeCopos, 14); 
    let espacamento = 40;
    let inicioX = (width - ((limiteCopos - 1) * espacamento)) / 2;
    
    textSize(35);
    for (let i = 0; i < limiteCopos; i++) {
      text('🥛', inicioX + (i * espacamento), 450);
    }
    
    stroke(255);
    strokeWeight(2);
    textSize(18);
    fill('#004D40');
    textStyle(NORMAL);
    text('(Cada copinho representa cerca de 250ml)', width / 2, 500);
  }
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = random(-500, -50);
    this.tamanho = random(8, 15); 
    this.velocidade = map(this.tamanho, 8, 15, 2, 5); 
  }

  cair() {
    this.y = this.y + this.velocidade;
    if (this.y > height + 20) {
      this.y = random(-200, -50);
      this.x = random(width);
    }
  }

  mostrar() {
    noStroke();
    fill(255, 255, 255, 180); 
    
    ellipse(this.x, this.y, this.tamanho, this.tamanho);
    triangle(
      this.x - this.tamanho / 2 + 0.5, this.y, 
      this.x + this.tamanho / 2 - 0.5, this.y, 
      this.x, this.y - this.tamanho
    );
  }
}
