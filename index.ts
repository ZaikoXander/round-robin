class ErroOperacaoCancelada extends Error {
  constructor() {
    super("Operação cancelada pelo usuário.")
  }
}

interface IProcesso {
  id: number
  tempoRestante: number
}

interface RoundRobinReturn {
  resultado: IProcesso[]
  periodos: number[]
  tempoEsperaMedio: number
}

function roundRobin(processos: IProcesso[], quantum: number): RoundRobinReturn {
  let periodos: number[] = [0]
  let fila = processos.slice()
  let resultado: IProcesso[] = []

  while (fila.length > 0) {
    let processo = fila.shift()

    if (processo!.tempoRestante > quantum) {
      periodos.push(periodos.at(-1)! + quantum)
      processo!.tempoRestante -= quantum
      fila.push(processo!)
    } else {
      periodos.push(periodos.at(-1)! + processo?.tempoRestante!)
      processo!.tempoRestante = 0
    }

    resultado.push({ ...processo! })
  }

  let somaPeriodos = 0

  periodos.forEach(periodo => {
    if (periodos.at(-1) == periodo) {
      return
    }
    somaPeriodos += periodo
  });

  const tempoEsperaMedio = somaPeriodos / (periodos.length - 1)

  return {
    resultado,
    periodos,
    tempoEsperaMedio
  }
}

let numProcessosStr;

do {
  numProcessosStr = prompt("Digite o número de processos que deseja executar:");
  if (numProcessosStr === null) throw new ErroOperacaoCancelada()
} while (!/^\d+$/.test(numProcessosStr!));

const numProcessos = Number(numProcessosStr)

let processos: IProcesso[] = []
let tempoExecucaoStr

for (let i = 1; i <= numProcessos; i++) {
  tempoExecucaoStr = prompt(`Digite o tempo de execução necessário ao P${i}:`)
  if (tempoExecucaoStr === null) throw new ErroOperacaoCancelada()
  if (!/^\d+$/.test(tempoExecucaoStr!)) {
    i--
  } else {
    const tempoExecucao = Number(tempoExecucaoStr)
    processos.push({ id: i, tempoRestante: tempoExecucao })
  }
}

/* let processos: IProcesso[] = [
  { id: 1, tempoRestante: 24 },
  { id: 2, tempoRestante: 3 },
  { id: 3, tempoRestante: 3 },
] */

let quantumStr

do {
  quantumStr = prompt("Digite o valor que deseja atribuir para quantum:");
  if (quantumStr === null) throw new ErroOperacaoCancelada()
} while (!/^\d+$/.test(quantumStr!));

const quantum = Number(quantumStr)

// const quantum = 4

const rr = roundRobin(processos, quantum)

const ids = rr.resultado.map(res => `P${res.id}`)

console.log(`Resultado final: ${ids.join(", ")}`)
console.log(`Períodos: ${rr.periodos.join(", ")}`)
console.log(`Tempo de espera médio: ${rr.tempoEsperaMedio}`)
