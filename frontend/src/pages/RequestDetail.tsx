import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, MessageSquare, Paperclip, Gavel } from 'lucide-react';

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data for the request
  const request = {
    id: id || 'ESIC-12345',
    protocol: 'ESIC-A1B2C3D4E',
    date: '2026-03-20',
    status: 'RESPONDED',
    description: 'Solicitação de cópia do contrato de pavimentação da Rua das Flores e lista de materiais utilizados na obra.',
    department: 'Secretaria de Obras e Urbanismo',
    secrecy: 'Público',
    response: 'Prezado cidadão, informamos que o contrato solicitado (Nº 45/2025) está disponível para consulta pública. Segue anexo a cópia digitalizada e o cronograma de materiais.',
    movements: [
      { date: '2026-03-20', action: 'Pedido recebido pelo sistema', user: 'Cidadão' },
      { date: '2026-03-21', action: 'Triagem realizada e encaminhado para Obras', user: 'Gestor SIC' },
      { date: '2026-03-24', action: 'Resposta elaborada e enviada', user: 'Técnico Obras' }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="badge badge-warning">Pendente</span>;
      case 'TRIAGED': return <span className="badge badge-info text-white">Em Análise</span>;
      case 'RESPONDED': return <span className="badge badge-success">Respondido</span>;
      case 'APPEALED': return <span className="badge badge-danger">Em Recurso</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="btn" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 0' }}
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ marginBottom: '0.25rem' }}>Detalhes do Pedido</h2>
                <code style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold' }}>{request.protocol}</code>
              </div>
              {getStatusBadge(request.status)}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--primary)" />
                Descrição da Solicitação
              </h4>
              <p style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {request.description}
              </p>
            </div>

            {request.status === 'RESPONDED' && (
              <div style={{ borderTop: '2px solid #eee', paddingTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <MessageSquare size={18} />
                  Resposta Oficial
                </h4>
                <div style={{ backgroundColor: 'rgba(40, 167, 69, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(40, 167, 69, 0.2)' }}>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{request.response}</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }}>
                      <Paperclip size={14} />
                      contrato_45_2025.pdf
                    </button>
                    <button className="btn" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }}>
                      <Paperclip size={14} />
                      tabela_materiais.xlsx
                    </button>
                  </div>
                </div>
                
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', border: '1px solid var(--warning)', backgroundColor: 'var(--white)' }} onClick={() => navigate(`/recorrer/${request.id}`)}>
                    <Gavel size={18} />
                    Entrar com Recurso
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--primary)" />
              Histórico
            </h4>
            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              {request.movements.map((move, index) => (
                <div key={index} style={{ 
                  position: 'relative', 
                  marginBottom: '1.5rem', 
                  paddingBottom: index === request.movements.length - 1 ? 0 : '0.5rem',
                  borderLeft: index === request.movements.length - 1 ? 'none' : '2px solid #eee',
                  marginLeft: '-1.5rem',
                  paddingLeft: '1.5rem'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-6px', 
                    top: '0', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: index === request.movements.length - 1 ? 'var(--primary)' : '#ccc' 
                  }}></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{move.date}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{move.action}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Por: {move.user}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f8f9fa' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Informações Adicionais</h4>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Departamento</div>
              <div style={{ fontWeight: '500' }}>{request.department}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Classificação de Sigilo</div>
              <div style={{ fontWeight: '500' }}>{request.secrecy}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
