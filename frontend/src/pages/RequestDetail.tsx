import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, MessageSquare, Paperclip, Gavel, Download } from 'lucide-react';
import { translateStatus, getStatusColor } from '../utils/statusTranslate';
import { api } from '../services/api';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : '';

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get(`/requests/${id}`)
      .then(setRequest)
      .catch((err: any) => setError(err.message || 'Erro ao carregar pedido'))
      .finally(() => setLoading(false));
  }, [id]);

  const getStatusBadge = (status: string) => {
    const { bg, text } = getStatusColor(status);
    return (
      <span style={{ backgroundColor: bg, color: text, padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
        {translateStatus(status)}
      </span>
    );
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  if (loading) return <div className="container"><p>Carregando...</p></div>;
  if (error || !request) return <div className="container"><p style={{ color: 'var(--danger)' }}>{error || 'Pedido não encontrado.'}</p></div>;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <button onClick={() => navigate(-1)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem 0' }}>
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
              <p style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: 'var(--radius-md)', lineHeight: '1.6' }}>
                {request.description}
              </p>
            </div>

            {request.status === 'RESPONDED' && request.response && (
              <div style={{ borderTop: '2px solid #eee', paddingTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <MessageSquare size={18} />
                  Resposta Oficial
                </h4>
                <div style={{ backgroundColor: 'rgba(40, 167, 69, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(40, 167, 69, 0.2)' }}>
                  <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{request.response}</p>
                  {request.attachments?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                      {request.attachments.map((att: any) => (
                        <a
                          key={att.id}
                          href={`${API_URL}/uploads/${att.filename}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn"
                          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', textDecoration: 'none' }}
                        >
                          <Download size={14} />
                          {att.originalName}
                        </a>
                      ))}
                    </div>
                  )}
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
          {/* Timeline de encaminhamentos */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--primary)" />
              Histórico de Tramitação
            </h4>
            {request.movements?.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nenhuma movimentação registrada.</p>
            ) : (
              <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                {request.movements?.map((move: any, index: number) => (
                  <div
                    key={move.id}
                    style={{
                      position: 'relative',
                      marginBottom: '1.5rem',
                      borderLeft: index === request.movements.length - 1 ? 'none' : '2px solid #eee',
                      marginLeft: '-1.5rem',
                      paddingLeft: '1.5rem',
                    }}
                  >
                    <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: index === request.movements.length - 1 ? 'var(--primary)' : '#ccc' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{formatDate(move.date)}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.2rem' }}>{move.description}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {move.originUser.name}
                      {move.originUser.id !== move.destinationUser.id && ` → ${move.destinationUser.name}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informações adicionais */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#f8f9fa' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Informações Adicionais</h4>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requerente</div>
              <div style={{ fontWeight: '500' }}>{request.user?.name}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Departamento</div>
              <div style={{ fontWeight: '500' }}>{request.department?.name || '—'}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Prazo</div>
              <div style={{ fontWeight: '500' }}>{new Date(request.deadline).toLocaleDateString('pt-BR')}</div>
            </div>
            {request.secrecyLevel && (
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Classificação de Sigilo</div>
                <div style={{ fontWeight: '500' }}>{request.secrecyLevel}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
