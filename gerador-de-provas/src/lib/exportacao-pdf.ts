import type { Prova, ChaveAlternativa } from "@/dados/tipos";

const CHAVES_ALTERNATIVAS: ChaveAlternativa[] = ["A", "B", "C", "D"];

interface DadosPdfProva {
  prova: Prova;
  nomeLivro: string;
  participante?: string;
  dataProva?: string;
  colunas?: number;
}

/** Gera a prova em PDF (A4, em colunas) no navegador e inicia o download. */
export async function baixarProvaPdf({ prova, nomeLivro, participante, dataProva, colunas = 3 }: DadosPdfProva) {
  const { jsPDF } = await import("jspdf");
  const documento = new jsPDF({ unit: "mm", format: "a4" });
  const larguraPagina = documento.internal.pageSize.getWidth();
  const alturaPagina = documento.internal.pageSize.getHeight();
  const margem = 10;
  const espaco = 5;
  const limiteInferior = alturaPagina - 12;
  const larguraColuna = (larguraPagina - margem * 2 - espaco * (colunas - 1)) / colunas;
  const tamanhoFonte = 8;
  const alturaLinha = tamanhoFonte * 0.3528 * 1.25; // altura da linha em mm

  // Cabeçalho (largura total, só na 1ª página)
  documento.setFont("helvetica", "bold").setFontSize(14);
  documento.text("Prova Bíblica", margem, margem + 5);
  documento.setFont("helvetica", "normal").setFontSize(10);
  documento.text(`Livro: ${nomeLivro}`, margem, margem + 11);
  documento.setFontSize(7).text(`Código: ${prova.id}`, larguraPagina - margem, margem + 5, { align: "right" });
  documento.setFontSize(9);
  const y0 = margem + 18;
  documento.text(`Participante: ${participante || "_______________________________________________"}`, margem, y0);
  documento.text(`Data: ${dataProva ? dataProva.split("-").reverse().join("/") : "____/____/______"}`, larguraPagina - margem - 60, y0);
  documento.text("Nota: ______", larguraPagina - margem, y0, { align: "right" });
  documento.setFontSize(8).setTextColor(90);
  documento.text("Instruções: leia cada questão com atenção e marque apenas uma alternativa (A, B, C ou D).", margem, y0 + 6);
  documento.setTextColor(0).setDrawColor(150).line(margem, y0 + 9, larguraPagina - margem, y0 + 9);

  let topo = y0 + 13;
  let coluna = 0;
  let y = topo;
  const proximaColuna = () => {
    coluna++;
    if (coluna >= colunas) {
      documento.addPage();
      coluna = 0;
      topo = margem;
    }
    y = topo;
  };

  prova.questoes.forEach((q, i) => {
    documento.setFontSize(tamanhoFonte);
    const enunciado = documento.splitTextToSize(`${i + 1}. ${q.enunciado}`, larguraColuna) as string[];
    const alternativas = CHAVES_ALTERNATIVAS.map((k) => documento.splitTextToSize(`( ) ${k}) ${q.alternativas[k]}`, larguraColuna - 2) as string[]);
    const altura = (enunciado.length + alternativas.reduce((s, o) => s + o.length, 0)) * alturaLinha + 3;
    if (y + altura > limiteInferior && y > topo) proximaColuna();
    const x = margem + coluna * (larguraColuna + espaco);
    documento.setFont("helvetica", "bold").text(enunciado, x, y + alturaLinha);
    y += enunciado.length * alturaLinha;
    documento.setFont("helvetica", "normal");
    alternativas.forEach((o) => {
      documento.text(o, x + 2, y + alturaLinha);
      y += o.length * alturaLinha;
    });
    y += 3;
  });

  adicionarRodapes(documento, larguraPagina, alturaPagina);
  documento.save(`prova-${prova.livroId}-${prova.id}.pdf`);
}

/** Gera o gabarito em PDF e inicia o download. */
export async function baixarGabaritoPdf({ prova, nomeLivro }: DadosPdfProva) {
  const { jsPDF } = await import("jspdf");
  const documento = new jsPDF({ unit: "mm", format: "a4" });
  const larguraPagina = documento.internal.pageSize.getWidth();
  const alturaPagina = documento.internal.pageSize.getHeight();
  const margem = 15;

  documento.setFont("helvetica", "bold").setFontSize(16).text("Gabarito", margem, margem + 5);
  documento.setFont("helvetica", "normal").setFontSize(10);
  documento.text(`Livro: ${nomeLivro}  ·  Prova ${prova.id}`, margem, margem + 12);

  let y = margem + 22;
  documento.setFontSize(9);
  prova.questoes.forEach((q, i) => {
    const texto = documento.splitTextToSize(q.alternativas[q.respostaCorreta], larguraPagina - margem * 2 - 22) as string[];
    if (y + texto.length * 4.5 > alturaPagina - 15) {
      documento.addPage();
      y = margem;
    }
    documento.setFont("helvetica", "bold").text(`${i + 1}.`, margem, y);
    documento.text(q.respostaCorreta, margem + 10, y);
    documento.setFont("helvetica", "normal").text(texto, margem + 20, y);
    y += texto.length * 4.5 + 2;
  });

  adicionarRodapes(documento, larguraPagina, alturaPagina);
  documento.save(`gabarito-${prova.livroId}-${prova.id}.pdf`);
}

function adicionarRodapes(documento: import("jspdf").jsPDF, larguraPagina: number, alturaPagina: number) {
  const total = documento.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    documento.setPage(p);
    documento.setFontSize(7).setTextColor(120);
    documento.text(`Página ${p} de ${total}`, larguraPagina / 2, alturaPagina - 6, { align: "center" });
    documento.setTextColor(0);
  }
}
