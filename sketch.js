let inputPeso;
let botaoCalcular;
let aguaTotalMl = 0;
let aguaTotalLitros = 0;
let mostrarResultado = false;
let gotas = [];
let anguloOnda = 0; 

function setup() {
  // 1. Criamos a tela do jogo
  let cnv = createCanvas(800, 600); 

  // 2. Criamos uma "caixa invisível" para agrupar o fundo e os botões
  let container = createDiv();
  container.style('position', 'relative'); 
  container.style('width', '800px');
  container.style('height', '600px');
  
  // 3. Colocamos o nosso canvas (fundo do jogo) dentro dessa caixa
  cnv.parent(container);

  // 4. Criamos a caixa de peso e a prendemos na nossa caixa invisível
  inputPeso = createInput('');
  inputPeso.parent(container); // Isso é o que faz a mágica acontecer!
  inputPeso.position(width / 2 - 90, 160);
  inputPeso.size(80, 30);
  inputPeso.style('font-size', '20px');
  inputPeso.style('text-align', 'center');
  inputPeso.style('border-radius', '8px');
  inputPeso.style('border', '2px solid #00838F');
  inputPeso.style('outline', 'none');

  // 5. Criamos o botão e o prendemos na nossa caixa invisível
  botaoCalcular = createButton('Calcular!');
  botaoCalcular.parent(container); // Isso é o que faz a mágica acontecer!
  botaoCalcular.position(width / 2 + 10, 160); 
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

  // Criando as gotas animadas
  for (let i = 0; i < 25; i++) {
    gotas.push(new Gota());
  }
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
  // Fundo em degradê
  setGradient(0, 0, width, height, color('#B2EBF2'), color('#00BCD4')); 

  // Ondas animadas no fundo
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

  // Desenhando as gotas
  for (let i = 0; i < gotas.length; i++) {
    gotas[i].cair();
    gotas[i].mostrar();
  }

  // --- TEXTOS COM CONTORNO BRANCO PARA DESTAQUE ---
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

  // Se o cálculo foi feito, exibe o resultado
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

    // Desenhando os copos
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

// --------------------------------------------------------
// FUNÇÕES EXTRAS
// --------------------------------------------------------

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
