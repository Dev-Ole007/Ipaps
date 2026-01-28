import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
// Validação simples de telefone (deve estar completo)
function isPhoneValid(phone) {
  return phone && phone.replace(/\D/g, '').length === 11;
}
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Store,
  Package,
  Newspaper,
  Briefcase,
  Bus,
  Plus,
  Trash2,
  Moon,
  Sun,
  LogOut,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Admin = () => {
  const { user, loginWithEmail, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('stores');
  const [showLogin, setShowLogin] = useState(false);
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Data states
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [trips, setTrips] = useState([]);

  // Form states
  const [storeForm, setStoreForm] = useState({
    name: '',
    category: '',
    phone: '',
    whatsapp: '',
    rating: 5,
    description: ''
  });

  const [productForm, setProductForm] = useState({
    storeId: '',
    name: '',
    price: '',
    category: '',
    description: ''
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Geral',
    content: ''
  });

  const [professionalForm, setProfessionalForm] = useState({
    name: '',
    service: '',
    phone: '',
    whatsapp: '',
    specialty: ''
  });

  const [tripForm, setTripForm] = useState({
    time: '',
    price: '',
    route: 'Ipaporanga → Crateús',
    driverName: '',
    driverPhone: ''
  });

  const [generatingSlogan, setGeneratingSlogan] = useState(false);

  // Real-time listeners
  useEffect(() => {
    if (!user) return;

    const unsubscribeStores = onSnapshot(collection(db, 'stores'), (snapshot) => {
      setStores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeNews = onSnapshot(collection(db, 'news'), (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeProfessionals = onSnapshot(collection(db, 'professionals'), (snapshot) => {
      setProfessionals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeTrips = onSnapshot(collection(db, 'trips'), (snapshot) => {
      setTrips(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeStores();
      unsubscribeProducts();
      unsubscribeNews();
      unsubscribeProfessionals();
      unsubscribeTrips();
    };
  }, [user]);

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      toast.success('Login realizado com sucesso!');
      setShowLogin(false);
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    if (!isPhoneValid(storeForm.phone) || !isPhoneValid(storeForm.whatsapp)) {
      toast.error('Telefone ou WhatsApp inválido. Use o formato (99) 99999-9999.');
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/api/stores`, storeForm);
      toast.success('Loja cadastrada com sucesso!');
      setStoreForm({ name: '', category: '', phone: '', whatsapp: '', rating: 5, description: '' });
    } catch (error) {
      toast.error('Erro ao cadastrar loja');
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/stores/${id}`);
      toast.success('Loja removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover loja');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/products`, {
        ...productForm,
        price: parseFloat(productForm.price)
      });
      toast.success('Produto cadastrado com sucesso!');
      setProductForm({ storeId: '', name: '', price: '', category: '', description: '' });
    } catch (error) {
      toast.error('Erro ao cadastrar produto');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${id}`);
      toast.success('Produto removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover produto');
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/news`, newsForm);
      toast.success('Notícia publicada com sucesso!');
      setNewsForm({ title: '', category: 'Geral', content: '' });
    } catch (error) {
      toast.error('Erro ao publicar notícia');
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/news/${id}`);
      toast.success('Notícia removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover notícia');
    }
  };

  const handleCreateProfessional = async (e) => {
    e.preventDefault();
    if (!isPhoneValid(professionalForm.phone) || !isPhoneValid(professionalForm.whatsapp)) {
      toast.error('Telefone ou WhatsApp inválido. Use o formato (99) 99999-9999.');
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/api/professionals`, professionalForm);
      toast.success('Profissional cadastrado com sucesso!');
      setProfessionalForm({ name: '', service: '', phone: '', whatsapp: '', specialty: '' });
    } catch (error) {
      toast.error('Erro ao cadastrar profissional');
    }
  };

  const handleDeleteProfessional = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/professionals/${id}`);
      toast.success('Profissional removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover profissional');
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!isPhoneValid(tripForm.driverPhone)) {
      toast.error('Telefone do motorista inválido. Use o formato (99) 99999-9999.');
      return;
    }
    try {
      await axios.post(`${BACKEND_URL}/api/trips`, {
        ...tripForm,
        price: parseFloat(tripForm.price)
      });
      toast.success('Viagem cadastrada com sucesso!');
      setTripForm({ time: '', price: '', route: 'Ipaporanga → Crateús', driverName: '', driverPhone: '' });
    } catch (error) {
      toast.error('Erro ao cadastrar viagem');
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/trips/${id}`);
      toast.success('Viagem removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover viagem');
    }
  };

  const handleGenerateSlogan = async () => {
    if (!storeForm.name || !storeForm.category) {
      toast.error('Preencha o nome e categoria da loja primeiro');
      return;
    }

    setGeneratingSlogan(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/generate-slogan`, {
        storeName: storeForm.name,
        category: storeForm.category,
        description: storeForm.description
      });
      setStoreForm({ ...storeForm, description: response.data.slogan });
      toast.success('Slogan gerado com IA!');
    } catch (error) {
      toast.error('Erro ao gerar slogan');
    } finally {
      setGeneratingSlogan(false);
    }
  };

  // Login Screen
  if (!user || showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-ice-grey dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-3xl font-bold font-heading mb-6 text-center">Painel Administrativo</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  data-testid="admin-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Senha</label>
                <input
                  type="password"
                  data-testid="admin-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  required
                />
              </div>
              <button
                type="submit"
                data-testid="admin-login-button"
                className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  const sections = [
    { id: 'stores', icon: Store, label: 'Lojas' },
    { id: 'products', icon: Package, label: 'Produtos' },
    { id: 'news', icon: Newspaper, label: 'Notícias' },
    { id: 'professionals', icon: Briefcase, label: 'Profissionais' },
    { id: 'trips', icon: Bus, label: 'Viagens' }
  ];

  return (
    <div className="min-h-screen pb-32">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        data-testid="back-to-home-button"
        className="fixed top-20 left-6 z-30 h-12 w-12 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold font-heading text-white mb-2">Painel Administrativo</h1>
          <p className="text-white/90">Gerencie todo o conteúdo do Ipaporanga Hub</p>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-button"
              className="h-12 px-6 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold flex items-center gap-2 hover:bg-white/30 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {isDark ? 'Modo Claro' : 'Modo Escuro'}
            </button>
            <button
              onClick={logout}
              data-testid="logout-button"
              className="h-12 px-6 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold flex items-center gap-2 hover:bg-white/30 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 -mt-6 mb-8">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-2 shadow-lg border border-slate-100 dark:border-slate-800 flex overflow-x-auto gap-2">
          {sections.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              data-testid={`section-${id}`}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] font-semibold whitespace-nowrap transition-all ${
                activeSection === id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {/* Stores Section */}
        {activeSection === 'stores' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold font-heading mb-4">Cadastrar Loja</h3>
              <form onSubmit={handleCreateStore} className="space-y-4">
                <input
                  type="text"
                  data-testid="store-name-input"
                  placeholder="Nome da loja"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                <input
                  type="text"
                  data-testid="store-category-input"
                  placeholder="Categoria (ex: Mercado, Farmácia)"
                  value={storeForm.category}
                  onChange={(e) => setStoreForm({ ...storeForm, category: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputMask
                    mask="(99) 99999-9999"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                  >
                    {(inputProps) => (
                      <input
                        {...inputProps}
                        type="tel"
                        data-testid="store-phone-input"
                        placeholder="Ex: (88) 91234-5678"
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    )}
                  </InputMask>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={storeForm.whatsapp}
                    onChange={(e) => setStoreForm({ ...storeForm, whatsapp: e.target.value })}
                  >
                    {(inputProps) => (
                      <input
                        {...inputProps}
                        type="tel"
                        data-testid="store-whatsapp-input"
                        placeholder="WhatsApp: (88) 91234-5678"
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    )}
                  </InputMask>
                </div>
                <div className="flex gap-4">
                  <textarea
                    data-testid="store-description-input"
                    placeholder="Descrição da loja"
                    value={storeForm.description}
                    onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                    className="flex-1 h-24 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateSlogan}
                    disabled={generatingSlogan}
                    data-testid="generate-slogan-button"
                    className="h-24 px-6 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs">Gerar com IA</span>
                  </button>
                </div>
                <button
                  type="submit"
                  data-testid="create-store-button"
                  className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Cadastrar Loja
                </button>
              </form>
            </div>

            {/* Stores List */}
            <div className="space-y-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  data-testid={`store-item-${store.id}`}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold">{store.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{store.category}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    data-testid={`delete-store-${store.id}`}
                    className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold font-heading mb-4">Cadastrar Produto</h3>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <select
                  data-testid="product-store-select"
                  value={productForm.storeId}
                  onChange={(e) => setProductForm({ ...productForm, storeId: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                >
                  <option value="">Selecione a loja</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  data-testid="product-name-input"
                  placeholder="Nome do produto"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    step="0.01"
                    data-testid="product-price-input"
                    placeholder="Preço"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                  <input
                    type="text"
                    data-testid="product-category-input"
                    placeholder="Categoria"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
                <button
                  type="submit"
                  data-testid="create-product-button"
                  className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Cadastrar Produto
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="space-y-3">
              {products.map((product) => {
                const store = stores.find((s) => s.id === product.storeId);
                return (
                  <div
                    key={product.id}
                    data-testid={`product-item-${product.id}`}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold">{product.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{store?.name}</p>
                      <p className="text-emerald-600 font-bold">R$ {product.price?.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      data-testid={`delete-product-${product.id}`}
                      className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* News Section */}
        {activeSection === 'news' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold font-heading mb-4">Publicar Notícia</h3>
              <form onSubmit={handleCreateNews} className="space-y-4">
                <input
                  type="text"
                  data-testid="news-title-input"
                  placeholder="Título da notícia"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                <select
                  data-testid="news-category-select"
                  value={newsForm.category}
                  onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                >
                  <option value="Geral">Geral</option>
                  <option value="Alerta">Alerta</option>
                  <option value="Obra">Obra</option>
                  <option value="Evento">Evento</option>
                </select>
                <textarea
                  data-testid="news-content-input"
                  placeholder="Conteúdo da notícia"
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full h-32 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  required
                />
                <button
                  type="submit"
                  data-testid="create-news-button"
                  className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Publicar Notícia
                </button>
              </form>
            </div>

            {/* News List */}
            <div className="space-y-3">
              {news.map((item) => (
                <div
                  key={item.id}
                  data-testid={`news-item-${item.id}`}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold flex-1">{item.title}</h4>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      data-testid={`delete-news-${item.id}`}
                      className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professionals Section */}
        {activeSection === 'professionals' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold font-heading mb-4">Cadastrar Profissional</h3>
              <form onSubmit={handleCreateProfessional} className="space-y-4">
                <input
                  type="text"
                  data-testid="professional-name-input"
                  placeholder="Nome do profissional"
                  value={professionalForm.name}
                  onChange={(e) => setProfessionalForm({ ...professionalForm, name: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                <input
                  type="text"
                  data-testid="professional-service-input"
                  placeholder="Serviço (ex: Encanador, Eletricista)"
                  value={professionalForm.service}
                  onChange={(e) => setProfessionalForm({ ...professionalForm, service: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputMask
                    mask="(99) 99999-9999"
                    value={professionalForm.phone}
                    onChange={(e) => setProfessionalForm({ ...professionalForm, phone: e.target.value })}
                  >
                    {(inputProps) => (
                      <input
                        {...inputProps}
                        type="tel"
                        data-testid="professional-phone-input"
                        placeholder="Ex: (88) 91234-5678"
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    )}
                  </InputMask>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={professionalForm.whatsapp}
                    onChange={(e) => setProfessionalForm({ ...professionalForm, whatsapp: e.target.value })}
                  >
                    {(inputProps) => (
                      <input
                        {...inputProps}
                        type="tel"
                        data-testid="professional-whatsapp-input"
                        placeholder="WhatsApp: (88) 91234-5678"
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    )}
                  </InputMask>
                </div>
                <input
                  type="text"
                  data-testid="professional-specialty-input"
                  placeholder="Especialidade (opcional)"
                  value={professionalForm.specialty}
                  onChange={(e) => setProfessionalForm({ ...professionalForm, specialty: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  data-testid="create-professional-button"
                  className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Cadastrar Profissional
                </button>
              </form>
            </div>

            {/* Professionals List */}
            <div className="space-y-3">
              {professionals.map((prof) => (
                <div
                  key={prof.id}
                  data-testid={`professional-item-${prof.id}`}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold">{prof.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{prof.service}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProfessional(prof.id)}
                    data-testid={`delete-professional-${prof.id}`}
                    className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trips Section */}
        {activeSection === 'trips' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold font-heading mb-4">Cadastrar Viagem</h3>
              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="time"
                    data-testid="trip-time-input"
                    value={tripForm.time}
                    onChange={(e) => setTripForm({ ...tripForm, time: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    data-testid="trip-price-input"
                    placeholder="Preço"
                    value={tripForm.price}
                    onChange={(e) => setTripForm({ ...tripForm, price: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
                <input
                  type="text"
                  data-testid="trip-route-input"
                  placeholder="Rota"
                  value={tripForm.route}
                  onChange={(e) => setTripForm({ ...tripForm, route: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                <input
                  type="text"
                  data-testid="trip-driver-name-input"
                  placeholder="Nome do motorista"
                  value={tripForm.driverName}
                  onChange={(e) => setTripForm({ ...tripForm, driverName: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
                <InputMask
                  mask="(99) 99999-9999"
                  value={tripForm.driverPhone}
                  onChange={(e) => setTripForm({ ...tripForm, driverPhone: e.target.value })}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      type="tel"
                      data-testid="trip-driver-phone-input"
                      placeholder="Ex: (88) 91234-5678"
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      required
                    />
                  )}
                </InputMask>
                <button
                  type="submit"
                  data-testid="create-trip-button"
                  className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Cadastrar Viagem
                </button>
              </form>
            </div>

            {/* Trips List */}
            <div className="space-y-3">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  data-testid={`trip-item-${trip.id}`}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-2xl text-emerald-600">{trip.time}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{trip.route}</p>
                      <p className="text-sm font-semibold">R$ {trip.price?.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{trip.driverName}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      data-testid={`delete-trip-${trip.id}`}
                      className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
