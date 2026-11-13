// Questões de exemplo usadas apenas nos testes.
import type { ChaveAlternativa, Questao } from "./tipos";

type DadosQuestaoDemonstracao = [string, string, string, string, string, ChaveAlternativa, string?];

function montarQuestoes(prefixo: string, livroId: string, lista: DadosQuestaoDemonstracao[]): Questao[] {
  return lista.map(([enunciado, A, B, C, D, respostaCorreta, referencia], i) => ({
    id: `${prefixo}-${String(i + 1).padStart(3, "0")}`,
    livroId,
    enunciado,
    alternativas: { A, B, C, D },
    respostaCorreta,
    referencia,
  }));
}

const joao: DadosQuestaoDemonstracao[] = [
  ["Como João inicia seu Evangelho?", "Com a genealogia de Jesus", "\"No princípio era o Verbo\"", "Com o batismo de Jesus", "Com o nascimento de João Batista", "B", "Jo 1:1"],
  ["Qual foi o primeiro sinal de Jesus registrado em João?", "Multiplicação dos pães", "Cura do cego", "Transformar água em vinho", "Andar sobre as águas", "C", "Jo 2:1-11"],
  ["Em que cidade ocorreram as bodas em que Jesus transformou água em vinho?", "Caná da Galileia", "Nazaré", "Betânia", "Cafarnaum", "A", "Jo 2:1"],
  ["Quem visitou Jesus à noite para conversar sobre o novo nascimento?", "Zaqueu", "José de Arimateia", "Nicodemos", "Lázaro", "C", "Jo 3:1-2"],
  ["Com quem Jesus conversou junto ao poço de Jacó?", "Marta", "Uma mulher samaritana", "Maria Madalena", "A mãe de Tiago", "B", "Jo 4:7"],
  ["Há quantos anos estava enfermo o homem curado no tanque de Betesda?", "12 anos", "18 anos", "30 anos", "38 anos", "D", "Jo 5:5"],
  ["Quantos pães e peixes o menino tinha na multiplicação?", "5 pães e 2 peixes", "7 pães e 3 peixes", "3 pães e 5 peixes", "2 pães e 5 peixes", "A", "Jo 6:9"],
  ["Qual afirmação Jesus fez após multiplicar os pães?", "Eu sou a porta", "Eu sou o pão da vida", "Eu sou a videira", "Eu sou o caminho", "B", "Jo 6:35"],
  ["Em qual tanque Jesus mandou o cego de nascença se lavar?", "Betesda", "Siloé", "Jordão", "Cedrom", "B", "Jo 9:7"],
  ["Qual frase Jesus disse sobre ser pastor?", "Eu sou o bom pastor", "Eu sou o pastor de Israel", "Eu sou o pastor das nações", "Eu sou o pastor fiel", "A", "Jo 10:11"],
  ["Quem eram as irmãs de Lázaro?", "Ana e Isabel", "Maria e Marta", "Raquel e Lia", "Joana e Susana", "B", "Jo 11:1"],
  ["Quantos dias Lázaro estava no túmulo quando Jesus chegou?", "Dois", "Três", "Quatro", "Sete", "C", "Jo 11:17"],
  ["Qual é o versículo mais curto, que mostra Jesus diante do túmulo de Lázaro?", "Jesus orou", "Jesus chorou", "Jesus esperou", "Jesus suspirou", "B", "Jo 11:35"],
  ["O que Jesus fez aos discípulos durante a última ceia?", "Ungiu suas cabeças", "Lavou seus pés", "Deu-lhes túnicas", "Batizou-os", "B", "Jo 13:5"],
  ["\"Eu sou o caminho, a verdade e a ___\". Complete:", "luz", "vida", "porta", "paz", "B", "Jo 14:6"],
  ["Na figura da videira, quem é o agricultor?", "Jesus", "Os discípulos", "O Pai", "Moisés", "C", "Jo 15:1"],
  ["Qual discípulo cortou a orelha do servo do sumo sacerdote?", "João", "Tomé", "Pedro", "André", "C", "Jo 18:10"],
  ["Qual o nome do servo que teve a orelha cortada?", "Malco", "Barrabás", "Caifás", "Anás", "A", "Jo 18:10"],
  ["Quem foi a primeira pessoa a ver Jesus ressuscitado em João?", "Pedro", "Maria Madalena", "Tomé", "Maria, mãe de Jesus", "B", "Jo 20:14-16"],
  ["Qual discípulo duvidou da ressurreição até ver as marcas?", "Filipe", "Tomé", "Natanael", "Judas Tadeu", "B", "Jo 20:24-25"],
  ["Quantos peixes foram pegos na pesca após a ressurreição?", "100", "120", "153", "200", "C", "Jo 21:11"],
  ["Quantas vezes Jesus perguntou a Pedro se ele o amava?", "Uma", "Duas", "Três", "Sete", "C", "Jo 21:15-17"],
  ["Quem apresentou Jesus como \"o Cordeiro de Deus\"?", "Pedro", "João Batista", "André", "Nicodemos", "B", "Jo 1:29"],
  ["Qual discípulo levou seu irmão Simão até Jesus?", "Filipe", "André", "Tiago", "João", "B", "Jo 1:40-42"],
];

const genesis: DadosQuestaoDemonstracao[] = [
  ["O que Deus criou no primeiro dia?", "Os animais", "A luz", "O homem", "As plantas", "B", "Gn 1:3-5"],
  ["Em que dia Deus descansou?", "Sexto", "Sétimo", "Primeiro", "Quinto", "B", "Gn 2:2"],
  ["De que Deus formou o homem?", "Do pó da terra", "Da água", "De uma costela", "Do fogo", "A", "Gn 2:7"],
  ["Qual era o nome do jardim onde Adão foi colocado?", "Getsêmani", "Éden", "Sião", "Canaã", "B", "Gn 2:8"],
  ["Quem foi o primeiro filho de Adão e Eva?", "Abel", "Sete", "Caim", "Enoque", "C", "Gn 4:1"],
  ["Qual era a profissão de Abel?", "Lavrador", "Pastor de ovelhas", "Pescador", "Carpinteiro", "B", "Gn 4:2"],
  ["Quem construiu a arca?", "Abraão", "Noé", "Moisés", "Enoque", "B", "Gn 6:14"],
  ["Quantos dias e noites choveu no dilúvio?", "7", "30", "40", "100", "C", "Gn 7:12"],
  ["Qual sinal Deus deu após o dilúvio?", "Uma estrela", "O arco-íris", "Uma pomba", "Um altar", "B", "Gn 9:13"],
  ["Qual torre foi construída para alcançar os céus?", "Torre de Babel", "Torre de Siloé", "Torre de Davi", "Torre de Jericó", "A", "Gn 11:4-9"],
  ["Qual era o nome original de Abraão?", "Abiú", "Abrão", "Absalão", "Abimeleque", "B", "Gn 17:5"],
  ["Quem era a esposa de Abraão?", "Rebeca", "Raquel", "Sara", "Lia", "C", "Gn 17:15"],
  ["Qual foi o filho da promessa de Abraão e Sara?", "Ismael", "Isaque", "Jacó", "Esaú", "B", "Gn 21:3"],
  ["O que aconteceu à mulher de Ló ao olhar para trás?", "Ficou cega", "Virou estátua de sal", "Morreu queimada", "Desapareceu", "B", "Gn 19:26"],
  ["Quem vendeu o direito de primogenitura por um prato de comida?", "Jacó", "Esaú", "Rúben", "Ismael", "B", "Gn 25:33"],
  ["Qual novo nome Jacó recebeu?", "Israel", "Judá", "Benjamim", "Efraim", "A", "Gn 32:28"],
  ["Quantos filhos teve Jacó?", "10", "11", "12", "13", "C", "Gn 35:22"],
  ["Que presente especial Jacó deu a José?", "Um anel", "Uma túnica colorida", "Um cajado", "Uma espada", "B", "Gn 37:3"],
  ["Para qual país José foi levado como escravo?", "Babilônia", "Egito", "Assíria", "Moabe", "B", "Gn 37:28"],
  ["Quem interpretou os sonhos do faraó?", "Moisés", "José", "Daniel", "Arão", "B", "Gn 41:25"],
  ["Quantos anos de fartura o faraó sonhou?", "Três", "Cinco", "Sete", "Dez", "C", "Gn 41:29"],
  ["Qual era o irmão mais novo de José?", "Judá", "Benjamim", "Levi", "Simeão", "B", "Gn 42:4"],
];

const salmos: DadosQuestaoDemonstracao[] = [
  ["\"O Senhor é o meu ___, nada me faltará\". Complete:", "rei", "pastor", "escudo", "refúgio", "B", "Sl 23:1"],
  ["A quem é atribuída a autoria de muitos Salmos?", "Salomão", "Davi", "Moisés", "Elias", "B"],
  ["Qual é o maior salmo da Bíblia?", "Salmo 23", "Salmo 91", "Salmo 119", "Salmo 150", "C"],
  ["\"Lâmpada para os meus pés é a tua ___\". Complete:", "luz", "palavra", "lei", "graça", "B", "Sl 119:105"],
  ["Como termina o livro de Salmos?", "Com um lamento", "Com louvor", "Com uma profecia", "Com uma genealogia", "B", "Sl 150"],
  ["\"Aquele que habita no esconderijo do Altíssimo...\" é o início de qual salmo?", "Salmo 1", "Salmo 51", "Salmo 91", "Salmo 121", "C", "Sl 91:1"],
];

export const questoes: Questao[] = [
  ...montarQuestoes("JOA", "joao", joao),
  ...montarQuestoes("GEN", "genesis", genesis),
  ...montarQuestoes("SAL", "salmos", salmos),
];

export function obterQuestoesDemonstracaoPorLivro(livroId: string) {
  return questoes.filter((q) => q.livroId === livroId);
}
