import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, HelpCircle, ExternalLink } from 'lucide-react';

const faqs = [
  {
    category: 'Sobre a LAI e o e-SIC',
    items: [
      {
        question: 'O que é a Lei de Acesso à Informação (LAI)?',
        answer:
          'A Lei Federal nº 12.527/2011, conhecida como Lei de Acesso à Informação (LAI), regulamenta o direito constitucional de acesso às informações públicas. Ela determina que qualquer pessoa pode solicitar informações a órgãos e entidades públicas sem precisar justificar o motivo do pedido.',
      },
      {
        question: 'O que é o e-SIC?',
        answer:
          'O e-SIC (Sistema Eletrônico do Serviço de Informação ao Cidadão) é o canal oficial online para encaminhar pedidos de acesso à informação ao município. Por meio dele, o cidadão pode registrar, acompanhar e receber respostas às suas solicitações de forma transparente.',
      },
      {
        question: 'Qualquer pessoa pode fazer um pedido de acesso à informação?',
        answer:
          'Sim. Qualquer pessoa, física ou jurídica, pode fazer um pedido de acesso à informação, sem necessidade de justificar a solicitação. É necessário apenas realizar um cadastro no sistema.',
      },
    ],
  },
  {
    category: 'Como Fazer um Pedido',
    items: [
      {
        question: 'Como posso registrar um pedido de acesso à informação?',
        answer:
          'Acesse o e-SIC, faça login ou cadastre-se, clique em "Novo Pedido" e descreva de forma clara e objetiva a informação que deseja. Após o envio, você receberá um número de protocolo para acompanhar sua solicitação.',
      },
      {
        question: 'Preciso me identificar para fazer um pedido?',
        answer:
          'Sim, é necessário realizar um cadastro com nome e e-mail. Porém, a identidade do solicitante é protegida e não será revelada ao órgão respondente quando isso for necessário para garantir a liberdade de expressão.',
      },
      {
        question: 'Qual é o prazo de resposta?',
        answer:
          'O órgão tem até 20 dias corridos para responder ao pedido, podendo prorrogar por mais 10 dias, mediante justificativa. Portanto, o prazo máximo é de 30 dias corridos.',
      },
      {
        question: 'Posso anexar documentos ao meu pedido?',
        answer:
          'Sim. Após registrar o pedido, você pode anexar documentos que auxiliem na compreensão da solicitação através da página de detalhes do pedido.',
      },
    ],
  },
  {
    category: 'Acompanhamento e Recursos',
    items: [
      {
        question: 'Como acompanho o status do meu pedido?',
        answer:
          'Após o login, acesse o "Painel do Cidadão". Todos os seus pedidos estarão listados com o status atual (Aberto, Em Análise, Respondido, etc.) e o número de protocolo.',
      },
      {
        question: 'O que fazer se não ficar satisfeito com a resposta?',
        answer:
          'Você pode apresentar um Recurso em até 10 dias corridos após receber a resposta. O sistema permite até três instâncias de recurso. Acesse "Recorrer" na página de detalhes do pedido.',
      },
      {
        question: 'O que acontece se o prazo não for cumprido?',
        answer:
          'O descumprimento do prazo caracteriza infração administrativa, sujeita a medidas disciplinares. Caso isso ocorra, entre em contato com a Ouvidoria do município.',
      },
    ],
  },
  {
    category: 'Informações e Sigilo',
    items: [
      {
        question: 'Existe algum tipo de informação que não pode ser fornecida?',
        answer:
          'Sim. Informações classificadas como sigilosas (reservadas, secretas ou ultrassecretas) por razões de segurança ou interesse público, dados pessoais de terceiros protegidos pela LGPD, e informações cobertas por sigilo legal não serão fornecidas. O órgão deve indicar o fundamento legal da negativa.',
      },
      {
        question: 'Meus dados pessoais serão protegidos?',
        answer:
          'Sim. O tratamento dos seus dados segue as disposições da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Seus dados serão utilizados exclusivamente para o processamento do pedido.',
      },
    ],
  },
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '0.75rem',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '1rem 1.25rem',
          background: open ? 'rgba(0,86,179,0.04)' : 'var(--white)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: '600',
          fontSize: '0.95rem',
          color: 'var(--text-main)',
          gap: '1rem',
        }}
      >
        <span>{question}</span>
        {open ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </button>
      {open && (
        <div
          style={{
            padding: '0 1.25rem 1rem',
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.75rem',
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <HelpCircle size={32} color="var(--primary)" />
          Perguntas Frequentes
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Tire suas dúvidas sobre o e-SIC e a Lei de Acesso à Informação.
        </p>
      </div>

      {faqs.map((section) => (
        <div key={section.category} style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: 'var(--primary)',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid rgba(0,86,179,0.15)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {section.category}
          </h2>
          {section.items.map((item) => (
            <FAQItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      ))}

      {/* Links LAI */}
      <div
        className="card"
        style={{
          backgroundColor: 'rgba(0,86,179,0.04)',
          border: '1px solid rgba(0,86,179,0.15)',
          marginTop: '1rem',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Links Oficiais da LAI</h3>
        <ul style={{ paddingLeft: '1.25rem', lineHeight: '2' }}>
          <li>
            <a
              href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              Lei Federal nº 12.527/2011 (LAI) <ExternalLink size={14} />
            </a>
          </li>
          <li>
            <a
              href="https://www.gov.br/acessoainformacao/pt-br"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              Portal Acesso à Informação (Governo Federal) <ExternalLink size={14} />
            </a>
          </li>
          <li>
            <a
              href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/decreto/d7724.htm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              Decreto nº 7.724/2012 (Regulamenta a LAI) <ExternalLink size={14} />
            </a>
          </li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
        <Link to="/" className="btn" style={{ marginRight: '1rem', border: '1px solid var(--border-color)' }}>
          Voltar ao Início
        </Link>
        <Link to="/login" className="btn btn-primary">
          Fazer um Pedido
        </Link>
      </div>
    </div>
  );
};

export default FAQ;
