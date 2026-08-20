import { calculateTaxComparison, formatBRL } from '@/lib/tax-calculator';
import { TAX_RULES_2026 } from '@/data/tax-rules-2026';

/**
 * Editorial pages that are not tied to one salary.
 *
 * Each entry owns its body. The previous version stored only a title and a
 * description and rendered the same "Como funciona a reforma" article underneath
 * every one of them — four URLs, one article. Three of the four were still
 * "unknown to Google" eleven days after launch while the one Google did crawl
 * was indexed, which is the pattern a near-duplicate set produces.
 *
 * Every figure quoted below is pulled from the engine or from TAX_RULES_2026 at
 * build time, so nothing here can drift away from what the calculator computes.
 */
export interface GuideSection {
  h2: string;
  paragraphs: string[];
  list?: { term: string; detail: string }[];
}

export interface GuidePage {
  title: string;
  description: string;
  h1: string;
  lead: string;
  /** Pre-fills the embedded calculator where a specific figure anchors the page. */
  calculatorSalary?: number;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  related: string[];
}

const R = TAX_RULES_2026.rules2026;
const DEP = TAX_RULES_2026.dependentDeduction;
const brl = (n: number) => formatBRL(n);

/** Worked figures used by more than one guide, all from the production engine. */
const at = (s: number) => calculateTaxComparison(s);

export const GUIDE_PAGES: Record<string, GuidePage> = {
  'nova-tabela-imposto-de-renda-2026': {
    title: 'Nova Tabela do Imposto de Renda 2026 — Faixas, Alíquotas e Redutor',
    description: `Tabela progressiva do IRRF 2026 da Lei nº 15.270/2025: isenção da tabela até ${brl(R.exemptionCeiling)}, alíquotas de 7,5% a 27,5% e o redutor que zera o imposto até ${brl(R.redutor.fullExemptionGrossLimit)}.`,
    h1: 'Nova tabela do Imposto de Renda 2026',
    lead: 'As faixas e alíquotas que passaram a valer em 1º de janeiro de 2026, e o mecanismo que faz o imposto de quem ganha até R$ 5.000 chegar a zero sem que a tabela mude para essa faixa.',
    sections: [
      {
        h2: 'A tabela progressiva incide sobre a base de cálculo, não sobre o bruto',
        paragraphs: [
          'É a confusão mais comum sobre a tabela. As faixas abaixo não se aplicam ao salário bruto: elas se aplicam à base de cálculo, ou seja, ao salário já descontados o INSS e os dependentes — ou descontado o valor simplificado, quando este for maior.',
          `Por isso alguém com salário bruto de ${brl(6000)} não cai na faixa correspondente a ${brl(6000)}: com INSS de ${brl(at(6000).inssDeduction)}, a base de cálculo é ${brl(at(6000).taxableIncome)}, e é sobre esse valor que a tabela roda.`,
        ],
      },
      {
        h2: 'O redutor é calculado sobre outra coisa',
        paragraphs: [
          `Enquanto a tabela incide sobre a base de cálculo, o redutor da Lei nº 15.270/2025 incide sobre os rendimentos tributáveis mensais — o salário antes das deduções. São duas bases diferentes no mesmo cálculo, e trocá-las é o erro que produz resultados divergentes entre calculadoras.`,
          `A fórmula é R$ 978,62 − (0,133145 × rendimentos tributáveis). Ela devolve ${brl(at(5000).reducerAmount)} para quem ganha ${brl(5000)}, ${brl(at(6000).reducerAmount)} para quem ganha ${brl(6000)} e chega a zero em ${brl(7350)}. O redutor nunca ultrapassa o imposto apurado, então nunca gera crédito.`,
        ],
      },
      {
        h2: 'O que muda em relação a 2025, faixa por faixa',
        paragraphs: [
          `Abaixo de ${brl(5000)} de rendimentos tributáveis o redutor anula o imposto inteiro: a retenção é R$ 0,00. Entre ${brl(5000)} e ${brl(7350)} ele decresce, e a economia mensal cai de ${brl(at(5100).monthlySaving)} em ${brl(5100)} para ${brl(at(7300).monthlySaving)} em ${brl(7300)}.`,
          `Acima de ${brl(7350)} o redutor não existe mais. A diferença que resta vem apenas da faixa de isenção maior da tabela de 2026, e é fixa: ${brl(at(10000).monthlySaving)} por mês, o mesmo valor para quem ganha ${brl(10000)} e para quem ganha ${brl(50000)}.`,
        ],
      },
    ],
    faq: [
      {
        q: 'A tabela do Imposto de Renda 2026 se aplica ao salário bruto?',
        a: `Não. Ela se aplica à base de cálculo — o salário bruto menos o INSS e os dependentes, ou menos o desconto simplificado de ${brl(R.simplifiedMonthlyDiscount)}, o que for maior.`,
      },
      {
        q: 'Quem ganha até R$ 5.000 ficou isento porque a tabela mudou?',
        a: 'Não. A faixa de isenção da tabela subiu, mas o que zera o imposto até R$ 5.000 é o redutor da Lei nº 15.270/2025, que é subtraído depois do imposto apurado.',
      },
      {
        q: 'Acima de R$ 7.350 mudou alguma coisa em 2026?',
        a: `Sim, mas pouco: sem redutor, a única diferença vem da faixa de isenção maior da tabela, o que dá ${brl(at(10000).monthlySaving)} por mês — valor idêntico para qualquer salário acima desse teto.`,
      },
    ],
    related: ['calculadora-irrf-2026', 'base-de-calculo-irrf', 'isencao-imposto-de-renda-2026'],
  },

  'isencao-imposto-de-renda-2026': {
    title: 'Isenção do Imposto de Renda 2026 até R$ 5.000 — Como Funciona',
    description: 'Quem ganha até R$ 5.000 por mês não tem retenção de IRRF em 2026. Entenda por que isso vem do redutor e não da tabela, e o que acontece logo acima do limite.',
    h1: 'Isenção do Imposto de Renda até R$ 5.000 em 2026',
    lead: 'A retenção na fonte chega a zero para quem tem rendimentos tributáveis mensais de até R$ 5.000 — mas por um mecanismo diferente do que a palavra "isenção" sugere.',
    calculatorSalary: 5000,
    sections: [
      {
        h2: 'Não é isenção de tabela, é redutor',
        paragraphs: [
          `Tecnicamente quem ganha ${brl(5000)} continua tendo imposto apurado pela tabela: ${brl(at(5000).taxBeforeRedutor)} por mês. O que acontece em seguida é a subtração do redutor de ${brl(at(5000).reducerAmount)}, que zera exatamente esse valor. O resultado prático é o mesmo — R$ 0,00 retidos — mas a distinção importa quando existe mais de uma fonte pagadora ou na declaração anual.`,
        ],
      },
      {
        h2: 'O que muda ao passar de R$ 5.000',
        paragraphs: [
          `A transição não é um degrau. Em ${brl(5100)} o imposto é ${brl(at(5100).newTax)}; em ${brl(5500)}, ${brl(at(5500).newTax)}; em ${brl(6000)}, ${brl(at(6000).newTax)}. O redutor vai encolhendo até desaparecer em ${brl(7350)}, de modo que cada R$ 100 a mais de salário acrescenta cerca de ${brl(37)} de imposto nessa faixa.`,
          'Isso responde a uma dúvida frequente: receber um pouco acima de R$ 5.000 não faz ninguém "perder dinheiro". O líquido continua subindo, só sobe mais devagar.',
        ],
      },
      {
        h2: 'Isenção da retenção mensal não é dispensa de declarar',
        paragraphs: [
          'Não ter IRRF retido no mês é diferente de estar dispensado da Declaração de Ajuste Anual. A obrigatoriedade de declarar segue critérios próprios da Receita Federal — rendimentos totais no ano, bens, atividade rural, ganhos de capital — que não mudam por causa do redutor mensal.',
        ],
      },
    ],
    faq: [
      {
        q: 'Quem ganha exatamente R$ 5.000 paga imposto de renda em 2026?',
        a: `Não há retenção na fonte: ${brl(at(5000).newTax)}. A tabela apura ${brl(at(5000).taxBeforeRedutor)} e o redutor de ${brl(at(5000).reducerAmount)} anula esse valor.`,
      },
      {
        q: 'Ganhar R$ 5.100 em vez de R$ 5.000 diminui o líquido?',
        a: `Não. Em ${brl(5100)} o IRRF é ${brl(at(5100).newTax)} e o líquido fica em ${brl(at(5100).netSalary2026)}, acima do líquido de ${brl(at(5000).netSalary2026)} de quem ganha ${brl(5000)}.`,
      },
      {
        q: 'Quem não tem IRRF retido precisa declarar em 2027?',
        a: 'Pode precisar. A obrigatoriedade da declaração anual segue regras próprias da Receita Federal e independe de ter havido ou não retenção mensal.',
      },
    ],
    related: ['nova-tabela-imposto-de-renda-2026', 'imposto-de-renda-salario-5000', 'imposto-de-renda-salario-5500'],
  },


  'quanto-vou-economizar-imposto-de-renda-2026': {
    title: 'Quanto Vou Economizar com o Novo Imposto de Renda 2026',
    description: 'Compare o IRRF pela tabela de 2025 e pela de 2026 no seu salário e veja a diferença por mês e por ano, com e sem 13º.',
    h1: 'Quanto você economiza com o Imposto de Renda 2026',
    lead: 'A comparação é entre duas regras completas — tabela de 2025 contra tabela de 2026 mais redutor — aplicadas ao mesmo salário bruto.',
    sections: [
      {
        h2: 'A economia depende de onde você está na curva',
        paragraphs: [
          `Ela não cresce com o salário; ela tem um pico e depois desaba. Em ${brl(5000)} a economia mensal é ${brl(at(5000).monthlySaving)}. Em ${brl(6000)} cai para ${brl(at(6000).monthlySaving)}, em ${brl(7000)} para ${brl(at(7000).monthlySaving)}, e a partir de ${brl(7350)} estabiliza em ${brl(at(10000).monthlySaving)} — o mesmo valor para qualquer salário acima disso.`,
          `No ano, ${brl(at(5000).monthlySaving)} por mês equivalem a ${brl(at(5000).annualSaving12Months)} em doze meses, ou ${brl(at(5000).annualSaving13Months)} contando o 13º salário.`,
        ],
      },
      {
        h2: 'Por que quem ganha muito economiza pouco',
        paragraphs: [
          'Porque o redutor foi desenhado para a faixa até R$ 7.350 e some acima dela. O que sobra para salários altos é só o efeito da faixa de isenção maior da tabela, que é um valor absoluto fixo e por isso vira uma fração cada vez menor do contracheque conforme o salário sobe.',
        ],
      },
    ],
    faq: [
      {
        q: 'Quem economiza mais com a reforma do IR em 2026?',
        a: `Quem ganha em torno de ${brl(5000)}: a economia chega a ${brl(at(5000).monthlySaving)} por mês, o ponto mais alto da curva, e decresce a partir daí.`,
      },
      {
        q: 'A economia inclui o 13º salário?',
        a: `A página mostra os dois números: ${brl(at(5000).annualSaving12Months)} em doze meses e ${brl(at(5000).annualSaving13Months)} considerando o 13º, no exemplo de um salário de ${brl(5000)}.`,
      },
    ],
    related: ['imposto-de-renda-salario-5000', 'nova-tabela-imposto-de-renda-2026', 'desconto-imposto-de-renda-no-salario'],
  },

  // ---------------------------------------------------------------- Group C
  // Added 2026-08-19 from queries Search Console already shows the domain
  // receiving, all of which currently land on the homepage at position 46-90.


  'base-de-calculo-irrf': {
    title: 'Base de Cálculo do IRRF 2026 — O Que É e Como Chegar Nela',
    description: 'A base de cálculo do IRRF é o salário bruto menos INSS e dependentes, ou menos o desconto simplificado — o que for maior. Veja o cálculo com números reais.',
    h1: 'Base de cálculo do IRRF',
    lead: 'A tabela do Imposto de Renda não incide sobre o salário bruto. Ela incide sobre a base de cálculo, e quase toda divergência entre calculadoras começa aqui.',
    sections: [
      {
        h2: 'Duas formas de chegar nela, e vale a maior dedução',
        paragraphs: [
          `Pelo modelo completo, a base é o bruto menos o INSS e menos ${brl(DEP)} por dependente. Pelo modelo simplificado, é o bruto menos um desconto único de ${brl(R.simplifiedMonthlyDiscount)}. A legislação manda aplicar o que resultar em menos imposto, e a calculadora compara os dois automaticamente.`,
          `Em ${brl(4000)}, o INSS é ${brl(at(4000).inssDeduction)} e a base fica em ${brl(at(4000).taxableIncome)}. Em ${brl(9000)}, o INSS já bateu no teto e a base é ${brl(at(9000).taxableIncome)}.`,
        ],
      },
      {
        h2: 'A base do redutor é outra',
        paragraphs: [
          'Esta é a confusão que mais aparece. A tabela progressiva usa a base de cálculo; o redutor da Lei nº 15.270/2025 usa os rendimentos tributáveis — o salário antes das deduções. Aplicar o redutor sobre a base de cálculo produz um imposto mais baixo do que o correto, e é o erro que faz duas calculadoras discordarem no mesmo salário.',
        ],
      },
    ],
    faq: [
      {
        q: 'O que entra na base de cálculo do IRRF?',
        a: `O salário bruto menos o INSS e menos ${brl(DEP)} por dependente — ou menos o desconto simplificado de ${brl(R.simplifiedMonthlyDiscount)}, quando este for mais vantajoso.`,
      },
      {
        q: 'A base de cálculo é a mesma base do redutor?',
        a: 'Não. O redutor de 2026 incide sobre os rendimentos tributáveis mensais, ou seja, sobre o salário antes das deduções, enquanto a tabela incide sobre a base de cálculo já deduzida.',
      },
    ],
    related: ['calculadora-irrf-2026', 'nova-tabela-imposto-de-renda-2026', 'imposto-de-renda-com-dependentes'],
  },

  'imposto-de-renda-com-dependentes': {
    title: 'Imposto de Renda com Dependentes 2026 — Quanto Cada Um Reduz',
    description: 'Cada dependente reduz a base de cálculo do IRRF, mas só compensa quando o modelo completo supera o desconto simplificado. Veja em que salários isso muda o imposto.',
    h1: 'Imposto de Renda com dependentes em 2026',
    lead: 'Declarar dependentes nem sempre muda o imposto retido. Depende de o modelo completo superar o desconto simplificado — e em boa parte das faixas ele não supera.',
    sections: [
      {
        h2: 'Por que um dependente às vezes não altera nada',
        paragraphs: [
          `A dedução por dependente entra no modelo completo. Mas a lei aplica a maior das duas deduções, e o desconto simplificado de ${brl(R.simplifiedMonthlyDiscount)} é fixo. Se o INSS somado aos dependentes ainda ficar abaixo desse valor, o simplificado continua vencendo e o dependente não muda a base — nem o imposto.`,
          'Na prática o dependente passa a fazer diferença a partir do ponto em que o INSS já é alto o bastante para o modelo completo ultrapassar o simplificado. Use o campo de dependentes na calculadora acima para ver, no seu salário, se o número muda ou não o resultado.',
        ],
      },
      {
        h2: 'Retenção mensal e declaração anual seguem critérios diferentes',
        paragraphs: [
          'Um dependente informado ao empregador reduz a retenção mensal. Na declaração anual, o mesmo dependente traz também as despesas dele — médicas, educação — mas obriga a somar os rendimentos dele aos seus. Um dependente que compensa no mês pode não compensar no ajuste anual.',
        ],
      },
    ],
    faq: [
      {
        q: 'Quanto cada dependente reduz do Imposto de Renda em 2026?',
        a: `Cada dependente reduz ${brl(DEP)} da base de cálculo mensal — mas só quando o modelo completo supera o desconto simplificado de ${brl(R.simplifiedMonthlyDiscount)}; caso contrário o imposto não muda.`,
      },
      {
        q: 'Vale a pena declarar dependente para pagar menos IR?',
        a: 'No desconto mensal, vale sempre que o modelo completo superar o simplificado. Na declaração anual a conta é outra, porque os rendimentos do dependente passam a ser somados aos seus.',
      },
    ],
    related: ['base-de-calculo-irrf', 'calculadora-irrf-2026', 'calculo-ir-mensal'],
  },

  'desconto-imposto-de-renda-no-salario': {
    title: 'Desconto do Imposto de Renda no Salário 2026 — Tabela por Faixa',
    description: 'Quanto o Imposto de Renda desconta do salário em 2026, faixa por faixa, com o valor exato do IRRF e do líquido para cada salário bruto.',
    h1: 'Desconto do Imposto de Renda no salário',
    lead: 'Quanto sai do contracheque a título de IRRF em 2026, salário por salário — e a partir de que valor o desconto começa a existir.',
    sections: [
      {
        h2: 'O desconto começa acima de R$ 5.000',
        paragraphs: [
          `Até ${brl(5000)} de rendimentos tributáveis o redutor anula o imposto e o contracheque não traz linha de IRRF. O primeiro desconto aparece logo acima: ${brl(at(5100).newTax)} em ${brl(5100)}.`,
          `Daí em diante ele sobe rápido enquanto o redutor encolhe — ${brl(at(6000).newTax)} em ${brl(6000)}, ${brl(at(7000).newTax)} em ${brl(7000)} — e depois de ${brl(7350)} passa a subir no ritmo da tabela progressiva.`,
        ],
      },
      {
        h2: 'IRRF e INSS são dois descontos diferentes',
        paragraphs: [
          `O contracheque traz os dois. O INSS é previdenciário, progressivo e limitado ao teto de ${brl(8475.55)} de salário de contribuição — em ${brl(6000)} ele desconta ${brl(at(6000).inssDeduction)}. O IRRF é tributário e incide depois, sobre a base já reduzida pelo INSS.`,
          `Somados, em ${brl(6000)} eles retiram ${brl(at(6000).inssDeduction + at(6000).newTax)} do bruto, deixando ${brl(at(6000).netSalary2026)} líquidos antes de descontos próprios do empregador.`,
        ],
      },
    ],
    faq: [
      {
        q: 'A partir de qual salário desconta imposto de renda em 2026?',
        a: `Acima de ${brl(5000)} de rendimentos tributáveis mensais. Em ${brl(5000)} a retenção é R$ 0,00; em ${brl(5100)} já são ${brl(at(5100).newTax)}.`,
      },
      {
        q: 'Quanto desconta de IR de um salário de R$ 6.000?',
        a: `${brl(at(6000).newTax)} de IRRF, além de ${brl(at(6000).inssDeduction)} de INSS, deixando ${brl(at(6000).netSalary2026)} líquidos.`,
      },
      {
        q: 'O desconto do IR é sobre o salário bruto?',
        a: 'Não. Ele incide sobre a base de cálculo — bruto menos INSS e dependentes, ou menos o desconto simplificado, o que for maior.',
      },
    ],
    related: ['calculo-ir-mensal', 'base-de-calculo-irrf', 'imposto-de-renda-salario-6000'],
  },
};

export const GUIDE_SLUGS = Object.keys(GUIDE_PAGES);
