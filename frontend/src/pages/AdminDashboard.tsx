import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Clock, AlertTriangle, ArrowRight, Filter } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock data for admin requests
  const [requests] = useState([
    {
      id: '1',
      protocol: 'ESIC-A1B2C3D4E',
      requester: 'Dalmo Vieira',
      description: 'Solicitação de cópia do contrato de pavimentação...',
      status: 'OPEN',
      date: '2026-03-24',
      daysLeft: 18,
      urgency: 'LOW'
    },
    {
      id: '2',
      protocol: 'ESIC-F5G6H7I8J',
      requester: 'Maria Silva',
      description: 'Informações sobre a lotação de servidores...',
      status: 'OPEN',
      date: '2026-03-25',
      daysLeft: 19,
      urgency: 'LOW'
    },
    {
      id: '3',
      protocol: 'ESIC-X9Y8Z7W6V',
      requester: 'João Souza',
      description: 'Relatório de gastos com publicidade institucional...',
      status: 'OPEN',
      date: '2026-03-05',
      daysLeft: 1,
      urgency: 'HIGH'
    }
  ]);

  const getUrgencyColor = (days: number) => {
    if (days <= 2) return 'var(--danger)';
    if (days <= 5) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Painel Administrativo</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestão e triagem de pedidos de informação.</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ borderLeft: '5px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{requests.length}</div>
              <div style={{ color: 'var(--text-muted)' }}>Pedidos Pendentes</div>
            </div>
            <FileText size={40} color="var(--primary)" opacity={0.2} />
          </div>
        </div>
        <div className="card" style={{ borderLeft: '5px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{requests.filter(r => r.daysLeft <= 2).length}</div>
              <div style={{ color: 'var(--text-muted)' }}>Vencendo em 48h</div>
            </div>
            <AlertTriangle size={40} color="var(--danger)" opacity={0.2} />
          </div>
        </div>
        <div className="card" style={{ borderLeft: '5px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>42</div>
              <div style={{ color: 'var(--text-muted)' }}>Respondidos (Mes)</div>
            </div>
            <Users size={40} color="var(--success)" opacity={0.2} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Pedidos aguardando triagem</h3>
          <button className="btn" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }}>
            <Filter size={16} />
            Filtrar
          </button>
        </div>

        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9f9f9' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Protocolo / Requerente</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Assunto</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Prazo Restante</th>
                <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{req.protocol}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.requester}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', maxWidth: '300px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.description}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: getUrgencyColor(req.daysLeft), fontWeight: 'bold' }}>
                      <Clock size={16} />
                      {req.daysLeft} dias
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Link to={`/admin/triage/${req.id}`} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                      Triar / Encaminhar
                      <ArrowRight size={14} />
                    </Link>
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

export default AdminDashboard;
