import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Search, Trash2, Mail, ShieldAlert, Edit } from 'lucide-react';
import { api } from '../services/api';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userType, setUserType] = useState<'PF' | 'PJ'>('PF');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpfCnpj: '',
    password: '',
    role: 'TECHNICIAN',
    departmentId: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, deptsData] = await Promise.all([
        api.get('/users'),
        api.get('/departments')
      ]);
      setUsers(usersData);
      setDepartments(deptsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setUserType(user.cpfCnpj.length > 11 ? 'PJ' : 'PF');
      setFormData({
        name: user.name,
        email: user.email,
        cpfCnpj: user.cpfCnpj,
        password: '', // Don't show password
        role: user.role,
        departmentId: user.departmentId || ''
      });
    } else {
      setEditingUser(null);
      setUserType('PF');
      setFormData({
        name: '',
        email: '',
        cpfCnpj: '',
        password: '',
        role: 'TECHNICIAN',
        departmentId: ''
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
      if (editingUser) {
        // Only send password if it was changed
        const data = { ...formData };
        if (!data.password) delete (data as any).password;
        await api.put(`/users/${editingUser.id}`, data);
      } else {
        await api.post('/users', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar usuário');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir usuário');
    }
  };
  
  const formatIdentifier = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return val;
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cpfCnpj.includes(searchTerm);
    
    const matchesRole = roleFilter === '' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

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
          <h1>Gestão de Usuários</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gerencie as contas de cidadãos e servidores do sistema.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UserPlus size={20} />
          Cadastrar Novo Servidor
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#f9f9f9', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou CPF..." 
              style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontSize: '1rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-control" 
            style={{ width: 'auto', minWidth: '200px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Todos os Perfis</option>
            <option value="CITIZEN">Cidadãos</option>
            <option value="TECHNICIAN">Técnicos</option>
            <option value="AUTHORITY">Autoridades</option>
            <option value="CONTROL">Controladoria</option>
            <option value="ADMIN">Administradores</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="card" style={{ color: 'var(--danger)', textAlign: 'center', padding: '2rem' }}>
          <ShieldAlert size={48} style={{ marginBottom: '1rem' }} />
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchData} style={{ marginTop: '1rem' }}>Tentar Novamente</button>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando usuários...</div>
      ) : (
        <div className="card" style={{ padding: '0' }}>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9f9f9' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Nome</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>E-mail</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Perfil</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Setor</th>
                  <th style={{ textAlign: 'right', padding: '1rem 1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ 
                          backgroundColor: user.cpfCnpj.length > 11 ? '#fff7e6' : '#f6ffed', 
                          color: user.cpfCnpj.length > 11 ? '#d46b08' : '#389e0d',
                          padding: '0.1rem 0.3rem',
                          borderRadius: '2px',
                          fontSize: '0.65rem',
                          fontWeight: 'bold'
                        }}>
                          {user.cpfCnpj.length > 11 ? 'PJ' : 'PF'}
                        </span>
                        {formatIdentifier(user.cpfCnpj)}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={14} />
                        {user.email}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        backgroundColor: user.role === 'ADMIN' ? '#e6f4ff' : '#f0f0f0',
                        color: user.role === 'ADMIN' ? 'var(--primary)' : 'var(--text-main)'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                      {user.department?.name || '-'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleOpenModal(user)} 
                          className="btn" 
                          style={{ padding: '0.4rem', color: 'var(--primary)' }}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
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

      {/* Modal for Creating/Editing User */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <button onClick={() => setShowModal(false)} className="btn" style={{ padding: '0.5rem' }}>&times;</button>
            </div>

            {formError && (
              <div style={{ backgroundColor: '#fff2f0', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #ffccc7' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{userType === 'PF' ? 'Nome Completo' : 'Razão Social'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={userType === 'PF' ? 'Ex: João Silva' : 'Ex: Empresa de Tecnologia LTDA'}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">E-mail Corporativo</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{userType === 'PF' ? 'CPF' : 'CNPJ'}</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData({...formData, cpfCnpj: e.target.value})}
                  placeholder={userType === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                />
              </div>

              {formData.role === 'CITIZEN' && !editingUser && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '0.25rem', backgroundColor: '#f0f0f0', borderRadius: 'var(--radius-md)' }}>
                  <button 
                    type="button"
                    onClick={() => { setUserType('PF'); setFormData({...formData, cpfCnpj: ''}); }}
                    style={{ 
                      flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: '600',
                      backgroundColor: userType === 'PF' ? 'var(--white)' : 'transparent',
                      color: userType === 'PF' ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                  >PF</button>
                  <button 
                    type="button"
                    onClick={() => { setUserType('PJ'); setFormData({...formData, cpfCnpj: ''}); }}
                    style={{ 
                      flex: 1, padding: '0.5rem', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: '600',
                      backgroundColor: userType === 'PJ' ? 'var(--white)' : 'transparent',
                      color: userType === 'PJ' ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                  >PJ</button>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Senha {editingUser && '(Deixe em branco para manter a atual)'}</label>
                <input 
                  type="password" 
                  className="form-control" 
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Perfil de Acesso</label>
                <select 
                  className="form-control"
                  style={{ width: '100%', padding: '0.6rem' }}
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="CITIZEN">Cidadão (Faz pedidos)</option>
                  <option value="TECHNICIAN">Técnico (Responde pedidos)</option>
                  <option value="AUTHORITY">Autoridade (Decide recursos)</option>
                  <option value="CONTROL">Controladoria (Monitora prazos)</option>
                  <option value="ADMIN">Administrador (Gestão total)</option>
                </select>
              </div>

              {formData.role !== 'CITIZEN' && (
                <div className="form-group">
                  <label className="form-label">Setor / Secretaria</label>
                  <select 
                    className="form-control"
                    style={{ width: '100%', padding: '0.6rem' }}
                    required
                    value={formData.departmentId}
                    onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                  >
                    <option value="">Selecione um setor...</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn" style={{ flex: 1 }}>Cancelar</button>
                <button type="submit" disabled={formLoading} className="btn btn-primary" style={{ flex: 1 }}>
                  {formLoading ? 'Salvando...' : editingUser ? 'Atualizar Dados' : 'Criar Conta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
