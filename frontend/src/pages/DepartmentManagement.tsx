import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Search, Trash2, Edit, Plus, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

const DepartmentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await api.get('/departments');
      setDepartments(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar setores');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dept: any = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        description: dept.description || ''
      });
    } else {
      setEditingDept(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar setor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este setor? Esta ação não pode ser desfeita e só funcionará se não houver usuários ou pedidos vinculados.')) {
      return;
    }

    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir setor');
    }
  };

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button 
            onClick={() => navigate('/admin')} 
            className="btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '0' }}
          >
            <ArrowLeft size={18} />
            Voltar ao Painel
          </button>
          <h1>Gerenciar Setores</h1>
          <p style={{ color: 'var(--text-muted)' }}>Cadastre e organize as secretarias e departamentos da prefeitura.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} />
          Novo Setor
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#f9f9f9', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou descrição..." 
            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '1rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error ? (
        <div className="card" style={{ color: 'var(--danger)', textAlign: 'center', padding: '2rem' }}>
          <AlertTriangle size={48} style={{ marginBottom: '1rem' }} />
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchDepartments} style={{ marginTop: '1rem' }}>Tentar Novamente</button>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando setores...</div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9f9f9' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Nome do Setor</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Descrição</th>
                  <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Nenhum setor encontrado.</td>
                  </tr>
                ) : filteredDepartments.map(dept => (
                  <tr key={dept.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Building2 size={18} color="var(--primary)" />
                        {dept.name}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {dept.description || '-'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleOpenModal(dept)} 
                          className="btn" 
                          style={{ padding: '0.4rem', color: 'var(--primary)' }}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(dept.id)} 
                          className="btn" 
                          style={{ padding: '0.4rem', color: 'var(--danger)' }}
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Creating/Editing Department */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>{editingDept ? 'Editar Setor' : 'Novo Setor'}</h2>
              <button onClick={() => setShowModal(false)} className="btn" style={{ padding: '0.5rem', fontSize: '1.5rem' }}>&times;</button>
            </div>

            {formError && (
              <div style={{ backgroundColor: '#fff2f0', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #ffccc7' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome do Setor</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="Ex: Secretaria de Saúde"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Descrição (Opcional)</label>
                <textarea 
                  className="form-control" 
                  rows={3}
                  placeholder="Breve descrição das responsabilidades do setor..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" disabled={formLoading} className="btn btn-primary" style={{ flex: 1 }}>
                  {formLoading ? 'Salvando...' : editingDept ? 'Atualizar' : 'Criar Setor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
