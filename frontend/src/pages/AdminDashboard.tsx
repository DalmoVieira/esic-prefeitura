import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Clock, AlertTriangle, ArrowRight, CheckCircle, Building2 } from 'lucide-react';
import { api } from '../services/api';
import { translateStatus, getStatusColor } from '../utils/statusTranslate';

const AdminDashboard: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [assignDeptId, setAssignDeptId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignWhatsappLink, setAssignWhatsappLink] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, deptFilter]);

  const fetchInitialData = async () => {
    try {
      const depts = await api.get('/departments');
      setDepartments(depts);
      await fetchRequests();
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let url = '/requests';
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (deptFilter) params.append('departmentId', deptFilter);
      
      const query = params.toString();
      if (query) url += `?${query}`;
      
      const data = await api.get(url);
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleAssign = async () => {
    if (!assignDeptId || !selectedRequest) return;
    
    try {
      setAssignLoading(true);
      const dept = departments.find(d => d.id === assignDeptId);
      await api.post(`/requests/${selectedRequest.id}/assign`, { 
        departmentId: assignDeptId,
        description: `Pedido encaminhado para o setor ${dept?.name}`
      });
      
      // Gera link WhatsApp se o setor tiver telefone
      if (dept?.phone) {
        const phone = dept.phone.replace(/\D/g, '');
        const msg = encodeURIComponent(
          `Olá! O pedido de informação *${selectedRequest.protocol}* foi encaminhado para o setor *${dept.name}*. Por favor, verifique no sistema e dê andamento.`
        );
        setAssignWhatsappLink(`https://wa.me/55${phone}?text=${msg}`);
      } else {
        setAssignWhatsappLink('');
        setShowAssignModal(false);
      }
      
      setAssignDeptId('');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Erro ao encaminhar pedido');
    } finally {
      setAssignLoading(false);
    }
  };

  const formatIdentifier = (val: string) => {
    if (!val) return '';
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return val;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 2) return 'var(--danger)';
    if (days <= 5) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        {error && (
          <div style={{ backgroundColor: '#fff2f0', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid #ffccc7' }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Painel Administrativo</h1>
            <p style={{ color: 'var(--text-muted)' }}>Gestão e triagem de pedidos de informação.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/admin/setores" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
              <Building2 size={20} />
              Gerenciar Setores
            </Link>
            <Link to="/admin/usuarios" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <Users size={20} />
              Gerenciar Usuários
            </Link>
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ borderLeft: '5px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{requests.filter(r => r.status === 'OPEN' || r.status === 'IN_ANALYSIS').length}</div>
              <div style={{ color: 'var(--text-muted)' }}>Pedidos Pendentes</div>
            </div>
            <FileText size={40} color="var(--primary)" opacity={0.2} />
          </div>
        </div>
        <div className="card" style={{ borderLeft: '5px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{requests.filter(r => calculateDaysLeft(r.deadline) <= 2 && r.status !== 'RESPONDED').length}</div>
              <div style={{ color: 'var(--text-muted)' }}>Vencendo em 48h</div>
            </div>
            <AlertTriangle size={40} color="var(--danger)" opacity={0.2} />
          </div>
        </div>
        <div className="card" style={{ borderLeft: '5px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{requests.filter(r => r.status === 'RESPONDED').length}</div>
              <div style={{ color: 'var(--text-muted)' }}>Respondidos (Total)</div>
            </div>
            <CheckCircle size={40} color="var(--success)" opacity={0.2} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Gestão de Solicitações</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              className="form-control" 
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="OPEN">Pendente</option>
              <option value="IN_ANALYSIS">Em Análise</option>
              <option value="RESPONDED">Respondido</option>
              <option value="EXTENDED">Prorrogado</option>
              <option value="CANCELED">Cancelado</option>
            </select>
            <select 
              className="form-control" 
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="">Todos os Setores</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9f9f9' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Protocolo</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Setor</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Prazo</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Carregando pedidos...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum pedido encontrado.</td>
                </tr>
              ) : requests.map(req => {
                const daysLeft = calculateDaysLeft(req.deadline);
                return (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Link to={`/pedido/${req.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{req.protocol}</div>
                      </Link>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '500' }}>{req.user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ 
                          backgroundColor: req.user?.cpfCnpj?.length > 11 ? '#fff7e6' : '#f6ffed', 
                          color: req.user?.cpfCnpj?.length > 11 ? '#d46b08' : '#389e0d',
                          padding: '0.1rem 0.3rem',
                          borderRadius: '2px',
                          fontSize: '0.65rem',
                          fontWeight: 'bold'
                        }}>
                          {req.user?.cpfCnpj?.length > 11 ? 'PJ' : 'PF'}
                        </span>
                        {formatIdentifier(req.user?.cpfCnpj)}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ fontSize: '0.85rem' }}>{req.department?.name || 'Não atribuído'}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: getUrgencyColor(daysLeft), fontWeight: 'bold' }}>
                        <Clock size={16} />
                        {daysLeft} dias
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        backgroundColor: getStatusColor(req.status).bg,
                        color: getStatusColor(req.status).text
                      }}>
                        {translateStatus(req.status)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => { setSelectedRequest(req); setShowAssignModal(true); }}
                          className="btn" 
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', border: '1px solid var(--border-color)' }}
                        >
                          Encaminhar
                        </button>
                        <Link to={`/admin/respond/${req.id}`} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                          Responder
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAssignModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', padding: '2rem' }}>
            {assignWhatsappLink ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ margin: 0 }}>Pedido Encaminhado!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Deseja notificar o setor via WhatsApp?
                  </p>
                </div>
                <a
                  href={assignWhatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%', backgroundColor: '#25D366', color: '#fff', fontWeight: 'bold', textDecoration: 'none', marginBottom: '0.75rem' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Notificar via WhatsApp
                </a>
                <button className="btn" style={{ width: '100%' }} onClick={() => { setAssignWhatsappLink(''); setShowAssignModal(false); }}>
                  Fechar
                </button>
              </>
            ) : (
              <>
                <h3 style={{ marginTop: 0 }}>Encaminhar Solicitação</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Selecione o setor responsável por responder este pedido.</p>
                
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label className="form-label">Setor Responsável</label>
                  <select 
                    className="form-control"
                    value={assignDeptId}
                    onChange={(e) => setAssignDeptId(e.target.value)}
                  >
                    <option value="">Selecione um setor...</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} {d.phone ? '📱' : ''}</option>
                    ))}
                  </select>
                  {assignDeptId && departments.find(d => d.id === assignDeptId)?.phone && (
                    <p style={{ fontSize: '0.8rem', color: '#25D366', marginTop: '0.5rem' }}>
                      ✓ Este setor tem WhatsApp cadastrado — você poderá notificá-lo após encaminhar.
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button className="btn" style={{ flex: 1 }} onClick={() => setShowAssignModal(false)}>Cancelar</button>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    disabled={!assignDeptId || assignLoading}
                    onClick={handleAssign}
                  >
                    {assignLoading ? 'Encaminhando...' : 'Encaminhar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
