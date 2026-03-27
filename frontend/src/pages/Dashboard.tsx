import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, Clock, CheckCircle, Gavel, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { translateStatus, getStatusColor } from '../utils/statusTranslate';

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.get('/requests');
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const { bg, text } = getStatusColor(status);
    return (
      <span style={{ 
        backgroundColor: bg, 
        color: text, 
        padding: '0.25rem 0.75rem', 
        borderRadius: '1rem', 
        fontSize: '0.85rem', 
        fontWeight: 'bold' 
      }}>
        {translateStatus(status)}
      </span>
    );
  };

  const isServer = user.role !== 'CITIZEN' && user.role !== 'ADMIN';
  const filteredRequests = requests.filter(r => 
    r.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Carregando...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>{isServer ? 'Painel do Servidor' : 'Painel do Cidadão'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Bem-vindo de volta, <strong>{user.name}</strong></p>
        </div>
        {!isServer && (
          <Link to="/novo-pedido" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} />
            Nova Solicitação
          </Link>
        )}
      </div>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(0, 86, 179, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{requests.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total de Pedidos</div>
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{requests.filter(r => r.status === 'OPEN').length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Em Tramitação</div>
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{requests.filter(r => r.status === 'RESPONDED').length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Respondidos</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="card" style={{ color: 'var(--danger)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#fff5f5', border: '1px solid #feb2b2' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(0, 86, 179, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{requests.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{isServer ? 'Pedidos Vinculados' : 'Total de Pedidos'}</div>
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{requests.filter(r => r.status !== 'RESPONDED').length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Em Tramitação</div>
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{requests.filter(r => r.status === 'RESPONDED').length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Respondidos</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{isServer ? 'Solicitações do Setor' : 'Meus Pedidos'}</h3>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar por protocolo..." 
              className="form-control" 
              style={{ paddingLeft: '2.5rem', width: '250px', marginBottom: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9f9f9' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Protocolo</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Descrição</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Abertura</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              ) : filteredRequests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{req.protocol}</td>
                  <td style={{ padding: '1rem 1.5rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.description}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{new Date(req.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(req.status)}</td>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem' }}>
                    {isServer ? (
                      <Link to={`/admin/respond/${req.id}`} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none' }}>
                        Responder
                      </Link>
                    ) : (
                      <>
                        <Link to={`/pedido/${req.id}`} className="btn" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', textDecoration: 'none', color: 'var(--text-main)' }}>
                          Ver Detalhes
                        </Link>
                        {req.status === 'RESPONDED' && (
                          <Link to={`/recorrer/${req.id}`} className="btn" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', border: '1px solid var(--warning)', color: 'var(--warning)', backgroundColor: 'var(--white)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Gavel size={14} />
                            Recorrer
                          </Link>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
