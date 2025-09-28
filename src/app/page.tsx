"use client"

import { useState } from 'react'
import { Eye, EyeOff, TrendingUp, Users, Settings, CreditCard, BarChart3, DollarSign, Activity, Shield, CheckCircle, X, AlertTriangle, Edit, Plus, Trash2, Copy, Clock, Home, Star, Zap, Globe, ArrowRight, Menu, Target, TrendingDown, Calendar, PieChart } from 'lucide-react'

interface MT5Account {
  id: string
  login: string
  server: string
  balance: number
  equity: number
  status: 'connected' | 'disconnected'
  initialBalance?: number
  riskSettings?: RiskSettings
}

interface RiskSettings {
  lotSize: number
  dailyGainLimit: number
  dailyLossLimit: number
  currentDailyPnL: number
  isBlocked: boolean
  blockReason?: 'gain_limit' | 'loss_limit'
}

interface Trade {
  id: string
  symbol: string
  type: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT'
  entryPrice: number
  exitPrice?: number
  stopLoss?: number
  takeProfit?: number
  lotSize: number
  status: 'active' | 'closed' | 'pending'
  timestamp: string
  profit?: number
}

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  maxAccounts: number
  popular?: boolean
}

interface User {
  id: string
  email: string
  activePlan?: string
  planExpiry?: string
}

interface PaymentGateway {
  apiKey: string
  secretKey: string
  webhookUrl: string
  environment: 'sandbox' | 'production'
}

interface TradeMetrics {
  totalTrades: number
  winRate: number
  totalProfit: number
  totalLoss: number
  netProfit: number
  bestTrade: number
  worstTrade: number
  averageProfit: number
}

export default function CopyTradeApp() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'dashboard' | 'admin' | 'accounts' | 'plans' | 'plan-editor' | 'checkout' | 'payment-config' | 'reports'>('home')
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user')
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [mt5Data, setMT5Data] = useState({ login: '', password: '', server: '', customServer: '' })
  const [showMT5Password, setShowMT5Password] = useState(false)
  const [showCustomServer, setShowCustomServer] = useState(false)
  const [showPlanAlert, setShowPlanAlert] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [pixCode, setPixCode] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')
  const [editingRisk, setEditingRisk] = useState<string | null>(null)
  const [riskForm, setRiskForm] = useState<RiskSettings>({
    lotSize: 0.1,
    dailyGainLimit: 500,
    dailyLossLimit: 200,
    currentDailyPnL: 0,
    isBlocked: false
  })
  
  const [newTrade, setNewTrade] = useState({
    symbol: 'EURUSD',
    type: 'BUY' as 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    lotSize: '0.1'
  })

  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>({
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
    environment: 'sandbox'
  })

  const [connectedAccounts, setConnectedAccounts] = useState<MT5Account[]>([
    { 
      id: '1', 
      login: '12345678', 
      server: 'MetaQuotes-Demo', 
      balance: 10000, 
      equity: 10250, 
      status: 'connected',
      initialBalance: 10000,
      riskSettings: {
        lotSize: 0.1,
        dailyGainLimit: 500,
        dailyLossLimit: 200,
        currentDailyPnL: 250,
        isBlocked: false
      }
    },
    { 
      id: '2', 
      login: '87654321', 
      server: 'ICMarkets-Live', 
      balance: 5000, 
      equity: 4950, 
      status: 'connected',
      initialBalance: 5000,
      riskSettings: {
        lotSize: 0.05,
        dailyGainLimit: 300,
        dailyLossLimit: 150,
        currentDailyPnL: -50,
        isBlocked: false
      }
    },
    { 
      id: '3', 
      login: '11223344', 
      server: 'XM-Real', 
      balance: 2000, 
      equity: 2100, 
      status: 'disconnected',
      initialBalance: 2000
    }
  ])

  const [activeTrades] = useState<Trade[]>([
    {
      id: '1',
      symbol: 'EURUSD',
      type: 'BUY',
      entryPrice: 1.0850,
      stopLoss: 1.0800,
      takeProfit: 1.0900,
      lotSize: 0.1,
      status: 'active',
      timestamp: '2024-01-15 14:30:00',
      profit: 25.50
    },
    {
      id: '2',
      symbol: 'GBPUSD',
      type: 'SELL',
      entryPrice: 1.2650,
      exitPrice: 1.2620,
      lotSize: 0.05,
      status: 'closed',
      timestamp: '2024-01-15 13:15:00',
      profit: 15.00
    },
    {
      id: '3',
      symbol: 'USDJPY',
      type: 'BUY_LIMIT',
      entryPrice: 148.50,
      stopLoss: 148.00,
      takeProfit: 149.50,
      lotSize: 0.1,
      status: 'pending',
      timestamp: '2024-01-15 15:45:00'
    },
    {
      id: '4',
      symbol: 'AUDUSD',
      type: 'SELL',
      entryPrice: 0.6750,
      exitPrice: 0.6720,
      lotSize: 0.1,
      status: 'closed',
      timestamp: '2024-01-14 10:20:00',
      profit: 30.00
    },
    {
      id: '5',
      symbol: 'USDCAD',
      type: 'BUY',
      entryPrice: 1.3450,
      exitPrice: 1.3420,
      lotSize: 0.05,
      status: 'closed',
      timestamp: '2024-01-14 16:45:00',
      profit: -15.00
    }
  ])

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'basic',
      name: 'Básico',
      price: 97,
      maxAccounts: 3,
      features: [
        'Até 3 contas MT5',
        'Copy trading em tempo real',
        'Suporte por email',
        'Dashboard básico'
      ]
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 197,
      maxAccounts: 10,
      popular: true,
      features: [
        'Até 10 contas MT5',
        'Copy trading em tempo real',
        'Suporte prioritário',
        'Dashboard avançado',
        'Relatórios detalhados',
        'Configurações personalizadas'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 497,
      maxAccounts: 50,
      features: [
        'Até 50 contas MT5',
        'Copy trading em tempo real',
        'Suporte 24/7',
        'Dashboard completo',
        'Relatórios avançados',
        'API personalizada',
        'Gerente de conta dedicado'
      ]
    }
  ])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginData.email === 'admin@copytrade.com' && loginData.password === 'admin123') {
      setUserRole('admin')
      setCurrentView('admin')
      setCurrentUser({ id: 'admin', email: loginData.email, activePlan: 'enterprise' })
    } else {
      setUserRole('user')
      setCurrentView('dashboard')
      // Simular usuário sem plano ativo
      setCurrentUser({ id: 'user1', email: loginData.email })
    }
  }

  const handleMT5Connect = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar se usuário tem plano ativo
    if (!currentUser?.activePlan) {
      setShowPlanAlert(true)
      return
    }

    const serverToUse = showCustomServer ? mt5Data.customServer : mt5Data.server
    // Simulação de conexão MT5
    alert(`Conta MT5 conectada com sucesso!\nServidor: ${serverToUse}`)
    setMT5Data({ login: '', password: '', server: '', customServer: '' })
    setShowCustomServer(false)
  }

  const handleServerChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomServer(true)
      setMT5Data({...mt5Data, server: value})
    } else {
      setShowCustomServer(false)
      setMT5Data({...mt5Data, server: value, customServer: ''})
    }
  }

  const handleCreateTrade = (e: React.FormEvent) => {
    e.preventDefault()
    
    let tradeTypeText = ''
    switch(newTrade.type) {
      case 'BUY':
        tradeTypeText = 'Compra Imediata'
        break
      case 'SELL':
        tradeTypeText = 'Venda Imediata'
        break
      case 'BUY_LIMIT':
        tradeTypeText = 'Ordem de Compra Limitada'
        break
      case 'SELL_LIMIT':
        tradeTypeText = 'Ordem de Venda Limitada'
        break
    }

    // Verificar contas bloqueadas por gerenciamento de risco
    const activeAccounts = connectedAccounts.filter(acc => 
      acc.status === 'connected' && !acc.riskSettings?.isBlocked
    )
    const blockedAccounts = connectedAccounts.filter(acc => 
      acc.status === 'connected' && acc.riskSettings?.isBlocked
    )

    let message = `${tradeTypeText} criada: ${newTrade.symbol} @ ${newTrade.entryPrice}.\n`
    message += `Replicando para ${activeAccounts.length} contas ativas.`
    
    if (blockedAccounts.length > 0) {
      message += `\n\n⚠️ ${blockedAccounts.length} conta(s) bloqueada(s) por gerenciamento de risco não receberão a operação.`
    }

    alert(message)
    setNewTrade({
      symbol: 'EURUSD',
      type: 'BUY',
      entryPrice: '',
      stopLoss: '',
      takeProfit: '',
      lotSize: '0.1'
    })
  }

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPlan) {
      if (editingPlan.id === 'new') {
        // Criar novo plano
        const newPlan = { ...editingPlan, id: Date.now().toString() }
        setPlans([...plans, newPlan])
      } else {
        // Editar plano existente
        setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p))
      }
      setEditingPlan(null)
      setCurrentView('plan-editor')
    }
  }

  const handleDeletePlan = (planId: string) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      setPlans(plans.filter(p => p.id !== planId))
    }
  }

  const handleCheckout = (plan: Plan) => {
    setSelectedPlan(plan)
    setCurrentView('checkout')
    // Simular geração de código PIX
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2, 15)}5204000053039865802BR5925COPYTRADE PRO LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    setPixCode(pixCode)
  }

  const handlePaymentGatewayConfig = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Configurações do gateway de pagamento salvas com sucesso!')
  }

  const simulatePayment = () => {
    setPaymentStatus('processing')
    setTimeout(() => {
      setPaymentStatus('completed')
      if (selectedPlan && currentUser) {
        setCurrentUser({...currentUser, activePlan: selectedPlan.id})
        setTimeout(() => {
          alert('Pagamento confirmado! Plano ativado com sucesso.')
          setCurrentView('dashboard')
        }, 2000)
      }
    }, 3000)
  }

  const handleSaveRiskSettings = (accountId: string) => {
    setConnectedAccounts(accounts => 
      accounts.map(acc => 
        acc.id === accountId 
          ? { ...acc, riskSettings: { ...riskForm } }
          : acc
      )
    )
    setEditingRisk(null)
    alert('Configurações de risco salvas com sucesso!')
  }

  const checkRiskLimits = (account: MT5Account) => {
    if (!account.riskSettings) return account

    const { dailyGainLimit, dailyLossLimit, currentDailyPnL } = account.riskSettings
    
    if (currentDailyPnL >= dailyGainLimit) {
      return {
        ...account,
        riskSettings: {
          ...account.riskSettings,
          isBlocked: true,
          blockReason: 'gain_limit' as const
        }
      }
    }
    
    if (currentDailyPnL <= -dailyLossLimit) {
      return {
        ...account,
        riskSettings: {
          ...account.riskSettings,
          isBlocked: true,
          blockReason: 'loss_limit' as const
        }
      }
    }

    return account
  }

  const getTradeTypeLabel = (type: string) => {
    switch(type) {
      case 'BUY': return 'Compra'
      case 'SELL': return 'Venda'
      case 'BUY_LIMIT': return 'Compra Limite'
      case 'SELL_LIMIT': return 'Venda Limite'
      default: return type
    }
  }

  const getTradeStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Ativo'
      case 'closed': return 'Fechado'
      case 'pending': return 'Pendente'
      default: return status
    }
  }

  const calculateMetrics = (): TradeMetrics => {
    const closedTrades = activeTrades.filter(trade => trade.status === 'closed' && trade.profit !== undefined)
    const profits = closedTrades.map(trade => trade.profit!)
    const winningTrades = profits.filter(profit => profit > 0)
    const losingTrades = profits.filter(profit => profit < 0)
    
    return {
      totalTrades: closedTrades.length,
      winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
      totalProfit: winningTrades.reduce((sum, profit) => sum + profit, 0),
      totalLoss: Math.abs(losingTrades.reduce((sum, loss) => sum + loss, 0)),
      netProfit: profits.reduce((sum, profit) => sum + profit, 0),
      bestTrade: profits.length > 0 ? Math.max(...profits) : 0,
      worstTrade: profits.length > 0 ? Math.min(...profits) : 0,
      averageProfit: profits.length > 0 ? profits.reduce((sum, profit) => sum + profit, 0) / profits.length : 0
    }
  }

  // Página inicial do site
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">CopyTrade Pro</h1>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Recursos</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Preços</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium">Sobre</a>
              </nav>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('login')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden bg-white border-t">
              <div className="px-4 py-2 space-y-2">
                <a href="#features" className="block py-2 text-gray-600 hover:text-gray-900">Recursos</a>
                <a href="#pricing" className="block py-2 text-gray-600 hover:text-gray-900">Preços</a>
                <a href="#about" className="block py-2 text-gray-600 hover:text-gray-900">Sobre</a>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Copy Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Profissional</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Replique automaticamente as operações de traders experientes em suas contas MT5. 
                Maximize seus lucros com nossa tecnologia avançada de copy trading.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setCurrentView('login')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
                >
                  Começar Agora
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  Saiba Mais
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Por que escolher o CopyTrade Pro?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Nossa plataforma oferece as ferramentas mais avançadas para copy trading no mercado Forex
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Execução Instantânea</h3>
                <p className="text-gray-600">
                  Replicação de trades em tempo real com latência ultra-baixa. 
                  Suas operações são executadas simultaneamente em todas as contas conectadas.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Segurança Total</h3>
                <p className="text-gray-600">
                  Suas credenciais MT5 são criptografadas com padrão militar. 
                  Nunca armazenamos senhas em texto plano e seguimos as melhores práticas de segurança.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Análise Avançada</h3>
                <p className="text-gray-600">
                  Dashboard completo with métricas de performance, relatórios detalhados 
                  e análise de risco para otimizar seus resultados.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
                <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Corretoras</h3>
                <p className="text-gray-600">
                  Compatível com as principais corretoras do mercado. 
                  Conecte contas de diferentes brokers em uma única plataforma.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
                <div className="bg-cyan-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Settings className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Configuração Flexível</h3>
                <p className="text-gray-600">
                  Personalize completamente suas estratégias de copy trading. 
                  Defina stop loss, take profit e tamanho de lote para cada operação.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
                <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Suporte 24/7</h3>
                <p className="text-gray-600">
                  Nossa equipe de especialistas está sempre disponível para ajudar. 
                  Suporte técnico especializado em copy trading e MT5.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Planos que se adaptam ao seu perfil
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Escolha o plano ideal para suas necessidades de copy trading
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div key={plan.id} className={`bg-white rounded-2xl shadow-lg border-2 p-8 relative ${
                  plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Mais Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-4xl font-bold text-gray-900">R${plan.price}</span>
                      <span className="text-gray-600">/mês</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentView('login')}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    Começar Agora
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Sobre o CopyTrade Pro
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Somos uma plataforma líder em copy trading para o mercado Forex, 
                  desenvolvida por traders experientes para traders de todos os níveis.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Nossa missão é democratizar o acesso a estratégias de trading profissionais, 
                  permitindo que qualquer pessoa possa se beneficiar da experiência de traders especialistas.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                    <div className="text-gray-600">Usuários Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">$50M+</div>
                    <div className="text-gray-600">Volume Negociado</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                    <div className="text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                    <div className="text-gray-600">Suporte</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Comece hoje mesmo!</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                    <span>Configuração em menos de 5 minutos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                    <span>Suporte completo para iniciantes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                    <span>Garantia de satisfação de 30 dias</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView('login')}
                  className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Criar Conta Grátis</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">CopyTrade Pro</h3>
                </div>
                <p className="text-gray-400">
                  A plataforma mais avançada de copy trading para o mercado Forex.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Produto</h4>
                <div className="space-y-2 text-gray-400">
                  <div>Recursos</div>
                  <div>Preços</div>
                  <div>API</div>
                  <div>Documentação</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Empresa</h4>
                <div className="space-y-2 text-gray-400">
                  <div>Sobre</div>
                  <div>Blog</div>
                  <div>Carreiras</div>
                  <div>Contato</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Suporte</h4>
                <div className="space-y-2 text-gray-400">
                  <div>Central de Ajuda</div>
                  <div>Status</div>
                  <div>Termos de Uso</div>
                  <div>Privacidade</div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 CopyTrade Pro. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <button
              onClick={() => setCurrentView('home')}
              className="absolute top-4 left-4 text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">CopyTrade Pro</h1>
            <p className="text-gray-300">Plataforma de Copy Trading Forex</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <p className="text-sm text-blue-200 mb-2">Contas de teste:</p>
            <p className="text-xs text-blue-300">Admin: admin@copytrade.com / admin123</p>
            <p className="text-xs text-blue-300">User: qualquer@email.com / qualquersenha</p>
          </div>
        </div>
      </div>
    )
  }

  // Checkout Page
  if (currentView === 'checkout' && selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">CopyTrade Pro</h1>
              </div>
              <button
                onClick={() => setCurrentView('plans')}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
              
              <div className="border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedPlan.name}</h3>
                    <p className="text-gray-600">Plano mensal</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">R${selectedPlan.price}</div>
                    <div className="text-gray-600">/mês</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>R${selectedPlan.price}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pagamento via PIX</h2>
              
              {paymentStatus === 'pending' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <h3 className="font-semibold text-blue-900">Copie o código PIX</h3>
                    </div>
                    <div className="bg-white border border-blue-200 rounded-lg p-3 mb-3">
                      <code className="text-xs text-gray-800 break-all">{pixCode}</code>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pixCode)
                        alert('Código PIX copiado!')
                      }}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copiar código PIX</span>
                    </button>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <h3 className="font-semibold text-green-900">Pague no seu banco</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      Abra o app do seu banco, vá em PIX e cole o código copiado. 
                      O pagamento será processado instantaneamente.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <h3 className="font-semibold text-purple-900">Confirmação automática</h3>
                    </div>
                    <p className="text-sm text-purple-700">
                      Após o pagamento, seu plano será ativado automaticamente em até 2 minutos.
                    </p>
                  </div>

                  <button
                    onClick={simulatePayment}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                  >
                    Simular Pagamento (Demo)
                  </button>
                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="text-center py-8">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-yellow-600 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Processando pagamento...</h3>
                  <p className="text-gray-600">Aguarde enquanto confirmamos seu pagamento PIX</p>
                </div>
              )}

              {paymentStatus === 'completed' && (
                <div className="text-center py-8">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pagamento confirmado!</h3>
                  <p className="text-gray-600 mb-4">Seu plano foi ativado com sucesso</p>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    Ir para Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CopyTrade Pro</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('accounts')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'accounts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contas MT5
              </button>
              <button
                onClick={() => setCurrentView('reports')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'reports' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Relatórios
              </button>
              {userRole === 'admin' && (
                <>
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentView === 'admin' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => setCurrentView('plan-editor')}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentView === 'plan-editor' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Gerenciar Planos
                  </button>
                  <button
                    onClick={() => setCurrentView('payment-config')}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentView === 'payment-config' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Gateway
                  </button>
                </>
              )}
              <button
                onClick={() => setCurrentView('plans')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'plans' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Planos
              </button>
            </nav>

            <button
              onClick={() => setCurrentView('home')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="flex overflow-x-auto px-4 py-2 space-x-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('accounts')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentView === 'accounts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
          >
            Contas MT5
          </button>
          <button
            onClick={() => setCurrentView('reports')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentView === 'reports' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
          >
            Relatórios
          </button>
          {userRole === 'admin' && (
            <>
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  currentView === 'admin' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setCurrentView('plan-editor')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  currentView === 'plan-editor' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}
              >
                Planos
              </button>
              <button
                onClick={() => setCurrentView('payment-config')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  currentView === 'payment-config' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                }`}
              >
                Gateway
              </button>
            </>
          )}
          <button
            onClick={() => setCurrentView('plans')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentView === 'plans' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
          >
            Planos
          </button>
        </div>
      </div>

      {/* Plan Alert Modal */}
      {showPlanAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Plano Necessário</h3>
              <p className="text-gray-600 mb-6">
                Para conectar sua conta MT5 e usar o CopyTrade, você precisa ter um plano ativo.
                Escolha um dos nossos planos para começar!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowPlanAlert(false)
                    setCurrentView('plans')
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                >
                  Ver Planos
                </button>
                <button
                  onClick={() => setShowPlanAlert(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Sistema Online</span>
              </div>
            </div>

            {/* Plan Status Alert */}
            {!currentUser?.activePlan && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800">Nenhum plano ativo</h4>
                    <p className="text-sm text-orange-700">
                      Para usar todas as funcionalidades do CopyTrade, você precisa de um plano ativo.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView('plans')}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Ver Planos
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contas Conectadas</p>
                    <p className="text-3xl font-bold text-gray-900">{connectedAccounts.filter(acc => acc.status === 'connected').length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Trades Ativos</p>
                    <p className="text-3xl font-bold text-gray-900">{activeTrades.filter(trade => trade.status === 'active').length}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Equity Total</p>
                    <p className="text-3xl font-bold text-gray-900">$17,300</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Performance</p>
                    <p className="text-3xl font-bold text-green-600">+2.5%</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Trades */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">Trades Recentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Símbolo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Loss</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Take Profit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeTrades.map((trade) => (
                      <tr key={trade.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{trade.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            trade.type.includes('BUY') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {getTradeTypeLabel(trade.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{trade.entryPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{trade.stopLoss || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{trade.takeProfit || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            trade.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                            trade.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getTradeStatusLabel(trade.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports */}
        {currentView === 'reports' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Relatórios e Métricas</h2>

            {/* Account Balances */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Saldos das Contas MT5</h3>
                <div className="space-y-4">
                  {connectedAccounts.filter(acc => acc.status === 'connected').map((account) => (
                    <div key={account.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900">Login: {account.login}</p>
                          <p className="text-sm text-gray-600">{account.server}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Lote Configurado</p>
                          <p className="font-medium">{account.riskSettings?.lotSize || 0.1}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Saldo Inicial</p>
                          <p className="font-medium text-blue-600">${account.initialBalance?.toLocaleString() || account.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Saldo Atual</p>
                          <p className="font-medium text-gray-900">${account.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">PnL Total</p>
                          <p className={`font-medium ${
                            (account.balance - (account.initialBalance || account.balance)) >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            ${(account.balance - (account.initialBalance || account.balance)).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {account.riskSettings && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">PnL Diário</p>
                              <p className={`font-medium ${
                                account.riskSettings.currentDailyPnL >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ${account.riskSettings.currentDailyPnL}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Status</p>
                              <p className={`font-medium ${
                                account.riskSettings.isBlocked ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {account.riskSettings.isBlocked ? 'Bloqueado' : 'Ativo'}
                              </p>
                            </div>
                          </div>
                          
                          {account.riskSettings.isBlocked && (
                            <div className="mt-2 p-2 bg-red-50 rounded-lg">
                              <p className="text-xs text-red-700">
                                {account.riskSettings.blockReason === 'gain_limit' 
                                  ? `Meta de ganho atingida (${account.riskSettings.dailyGainLimit})`
                                  : `Limite de perda atingido (${account.riskSettings.dailyLossLimit})`
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trading Metrics */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Métricas de Trading</h3>
                {(() => {
                  const metrics = calculateMetrics()
                  return (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">{metrics.totalTrades}</div>
                          <div className="text-sm text-blue-700">Total de Trades</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                          <div className="text-2xl font-bold text-green-600">{metrics.winRate.toFixed(1)}%</div>
                          <div className="text-sm text-green-700">Taxa de Acerto</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Lucro Total</span>
                          <span className="font-medium text-green-600">${metrics.totalProfit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Perda Total</span>
                          <span className="font-medium text-red-600">${metrics.totalLoss.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="font-medium text-gray-900">Lucro Líquido</span>
                          <span className={`font-bold text-lg ${
                            metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${metrics.netProfit.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Melhor Trade</p>
                          <p className="font-medium text-green-600">${metrics.bestTrade.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pior Trade</p>
                          <p className="font-medium text-red-600">${metrics.worstTrade.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600">Lucro Médio por Trade</p>
                        <p className={`font-medium ${
                          metrics.averageProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${metrics.averageProfit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Detailed Trade History */}
            <div className="bg-white rounded-2xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">Histórico Detalhado de Trades</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Símbolo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrada</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saída</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeTrades.map((trade) => (
                      <tr key={trade.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{trade.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            trade.type.includes('BUY') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {getTradeTypeLabel(trade.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.entryPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.exitPrice || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trade.lotSize}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {trade.profit !== undefined ? (
                            <span className={`font-medium ${
                              trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ${trade.profit.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            trade.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                            trade.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getTradeStatusLabel(trade.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {currentView === 'admin' && userRole === 'admin' && (
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-xl">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Painel Administrativo</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create Trade Form */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Criar Nova Operação</h3>
                
                <form onSubmit={handleCreateTrade} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Símbolo</label>
                      <select
                        value={newTrade.symbol}
                        onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="EURUSD">EUR/USD</option>
                        <option value="GBPUSD">GBP/USD</option>
                        <option value="USDJPY">USD/JPY</option>
                        <option value="AUDUSD">AUD/USD</option>
                        <option value="USDCAD">USD/CAD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Operação</label>
                      <select
                        value={newTrade.type}
                        onChange={(e) => setNewTrade({...newTrade, type: e.target.value as 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="BUY">🟢 Compra Imediata (BUY)</option>
                        <option value="SELL">🔴 Venda Imediata (SELL)</option>
                        <option value="BUY_LIMIT">📈 Compra Limite (BUY LIMIT)</option>
                        <option value="SELL_LIMIT">📉 Venda Limite (SELL LIMIT)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {newTrade.type.includes('LIMIT') ? 'Preço Limite' : 'Preço de Entrada'}
                    </label>
                    <input
                      type="number"
                      step="0.00001"
                      value={newTrade.entryPrice}
                      onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1.08500"
                      required
                    />
                    {newTrade.type.includes('LIMIT') && (
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Ordem será executada quando o preço atingir este valor
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stop Loss</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={newTrade.stopLoss}
                        onChange={(e) => setNewTrade({...newTrade, stopLoss: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1.08000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Take Profit</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={newTrade.takeProfit}
                        onChange={(e) => setNewTrade({...newTrade, takeProfit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1.09000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho do Lote</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTrade.lotSize}
                      onChange={(e) => setNewTrade({...newTrade, lotSize: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.10"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Resumo da Operação:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Tipo:</strong> {getTradeTypeLabel(newTrade.type)}</p>
                      <p><strong>Símbolo:</strong> {newTrade.symbol}</p>
                      <p><strong>Preço:</strong> {newTrade.entryPrice || 'A definir'}</p>
                      <p><strong>Lote:</strong> {newTrade.lotSize}</p>
                      {newTrade.type.includes('LIMIT') && (
                        <p className="text-xs text-blue-600 mt-2">
                          ⏳ Esta será uma ordem pendente que será executada quando o preço atingir o valor especificado
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
                  >
                    {newTrade.type.includes('LIMIT') ? 'Criar Ordem Pendente' : 'Criar e Replicar Operação'}
                  </button>
                </form>
              </div>

              {/* Connected Accounts Overview */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Contas Conectadas</h3>
                
                <div className="space-y-4">
                  {connectedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Login: {account.login}</p>
                        <p className="text-sm text-gray-600">{account.server}</p>
                        <p className="text-sm text-gray-600">Equity: ${account.equity.toLocaleString()}</p>
                        {account.riskSettings && (
                          <p className="text-xs text-gray-500">
                            Lote: {account.riskSettings.lotSize} | 
                            PnL Diário: ${account.riskSettings.currentDailyPnL}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          account.status === 'connected' && !account.riskSettings?.isBlocked
                            ? 'bg-green-500' 
                            : account.riskSettings?.isBlocked 
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          account.status === 'connected' && !account.riskSettings?.isBlocked
                            ? 'text-green-600' 
                            : account.riskSettings?.isBlocked 
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }`}>
                          {account.status === 'connected' 
                            ? (account.riskSettings?.isBlocked ? 'Bloqueado' : 'Conectado')
                            : 'Desconectado'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>{connectedAccounts.filter(acc => acc.status === 'connected' && !acc.riskSettings?.isBlocked).length}</strong> contas receberão as operações automaticamente
                  </p>
                  {connectedAccounts.filter(acc => acc.riskSettings?.isBlocked).length > 0 && (
                    <p className="text-sm text-orange-700 mt-1">
                      <strong>{connectedAccounts.filter(acc => acc.riskSettings?.isBlocked).length}</strong> contas bloqueadas por gerenciamento de risco
                    </p>
                  )}
                </div>

                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Tipos de Operação Disponíveis:</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>• <strong>Compra/Venda Imediata:</strong> Executada instantaneamente</p>
                    <p>• <strong>Ordens Limite:</strong> Executadas quando preço atingir o valor definido</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MT5 Accounts */}
        {currentView === 'accounts' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Contas MT5</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Connect New Account */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Conectar Nova Conta MT5</h3>
                
                <form onSubmit={handleMT5Connect} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Login MT5</label>
                    <input
                      type="text"
                      value={mt5Data.login}
                      onChange={(e) => setMT5Data({...mt5Data, login: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12345678"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Senha MT5</label>
                    <div className="relative">
                      <input
                        type={showMT5Password ? 'text' : 'password'}
                        value={mt5Data.password}
                        onChange={(e) => setMT5Data({...mt5Data, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowMT5Password(!showMT5Password)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showMT5Password ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Servidor</label>
                    <select
                      value={mt5Data.server}
                      onChange={(e) => handleServerChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione o servidor</option>
                      <option value="MetaQuotes-Demo">MetaQuotes-Demo</option>
                      <option value="ICMarkets-Live">ICMarkets-Live</option>
                      <option value="XM-Real">XM-Real</option>
                      <option value="FXCM-Real">FXCM-Real</option>
                      <option value="Pepperstone-Live">Pepperstone-Live</option>
                      <option value="Exness-Real">Exness-Real</option>
                      <option value="FTMO-Demo">FTMO-Demo</option>
                      <option value="Admiral-Markets">Admiral-Markets</option>
                      <option value="custom">🔧 Servidor Personalizado</option>
                    </select>
                  </div>

                  {/* Campo de servidor personalizado */}
                  {showCustomServer && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Digite o servidor da sua corretora
                      </label>
                      <input
                        type="text"
                        value={mt5Data.customServer}
                        onChange={(e) => setMT5Data({...mt5Data, customServer: e.target.value})}
                        className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Ex: MinhaCorretora-Live01, Broker-Demo, etc."
                        required
                      />
                      <p className="text-xs text-blue-600 mt-2">
                        💡 Você pode encontrar o nome do servidor no seu MT5, na aba "Navegador" → "Contas"
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Conectar Conta MT5
                  </button>
                </form>

                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Segurança</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Suas credenciais são criptografadas e armazenadas com segurança. 
                        Nunca compartilhamos suas informações com terceiros.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dica sobre servidor personalizado */}
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start space-x-2">
                    <Settings className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Não encontrou seu servidor?</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Selecione "Servidor Personalizado" e digite o nome exato do servidor da sua corretora.
                        O nome pode ser encontrado no seu MT5.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Accounts List */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Suas Contas</h3>
                
                <div className="space-y-4">
                  {connectedAccounts.map((account) => (
                    <div key={account.id} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            account.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium text-gray-900">Login: {account.login}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {account.status === 'connected' && (
                            <button
                              onClick={() => {
                                setEditingRisk(account.id)
                                setRiskForm(account.riskSettings || {
                                  lotSize: 0.1,
                                  dailyGainLimit: 500,
                                  dailyLossLimit: 200,
                                  currentDailyPnL: 0,
                                  isBlocked: false
                                })
                              }}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Configurar Gerenciamento de Risco"
                            >
                              <Target className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-red-500 hover:text-red-700">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Servidor</p>
                          <p className="font-medium">{account.server}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p className={`font-medium ${
                            account.status === 'connected' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {account.status === 'connected' ? 'Conectado' : 'Desconectado'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Balance</p>
                          <p className="font-medium">${account.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Equity</p>
                          <p className="font-medium">${account.equity.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Risk Settings Display */}
                      {account.riskSettings && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Lote Configurado</p>
                              <p className="font-medium">{account.riskSettings.lotSize}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Meta de Ganho</p>
                              <p className="font-medium text-green-600">${account.riskSettings.dailyGainLimit}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Limite de Perda</p>
                              <p className="font-medium text-red-600">${account.riskSettings.dailyLossLimit}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">PnL Diário</p>
                              <p className={`font-medium ${
                                account.riskSettings.currentDailyPnL >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ${account.riskSettings.currentDailyPnL}
                              </p>
                            </div>
                          </div>
                          
                          {account.riskSettings.isBlocked && (
                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <p className="text-sm font-medium text-red-800">
                                  Conta bloqueada para novas operações
                                </p>
                              </div>
                              <p className="text-xs text-red-700 mt-1">
                                {account.riskSettings.blockReason === 'gain_limit' 
                                  ? 'Meta de ganho diário atingida'
                                  : 'Limite de perda diário atingido'
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Management Modal */}
            {editingRisk && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Gerenciamento de Risco</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho do Lote
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={riskForm.lotSize}
                        onChange={(e) => setRiskForm({...riskForm, lotSize: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.10"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Volume que será operado em cada trade
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta de Ganho Diário ($)
                      </label>
                      <input
                        type="number"
                        value={riskForm.dailyGainLimit}
                        onChange={(e) => setRiskForm({...riskForm, dailyGainLimit: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Quando atingir este valor, não operará mais até o próximo dia
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Limite de Perda Diário ($)
                      </label>
                      <input
                        type="number"
                        value={riskForm.dailyLossLimit}
                        onChange={(e) => setRiskForm({...riskForm, dailyLossLimit: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="200"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Quando atingir esta perda, não operará mais até o próximo dia
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">Como funciona:</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>• Sistema monitora PnL diário em tempo real</p>
                        <p>• Bloqueia automaticamente quando atingir limites</p>
                        <p>• Reset automático a cada novo dia de trading</p>
                        <p>• Proteção contra overtrading e grandes perdas</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleSaveRiskSettings(editingRisk)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                      >
                        Salvar Configurações
                      </button>
                      <button
                        onClick={() => setEditingRisk(null)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Plan Editor (Admin Only) */}
        {currentView === 'plan-editor' && userRole === 'admin' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Gerenciar Planos</h2>
              <button
                onClick={() => setEditingPlan({
                  id: 'new',
                  name: '',
                  price: 0,
                  maxAccounts: 1,
                  features: ['']
                })}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Plano</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-2xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-900">R${plan.price}</div>
                    <div className="text-gray-600">/mês</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600">
                      <strong>Máx. Contas:</strong> {plan.maxAccounts}
                    </div>
                    {plan.popular && (
                      <div className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Mais Popular
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Plan Modal */}
            {editingPlan && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {editingPlan.id === 'new' ? 'Criar Novo Plano' : 'Editar Plano'}
                  </h3>
                  
                  <form onSubmit={handleSavePlan} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Plano</label>
                        <input
                          type="text"
                          value={editingPlan.name}
                          onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: Básico, Pro, Enterprise"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                        <input
                          type="number"
                          value={editingPlan.price}
                          onChange={(e) => setEditingPlan({...editingPlan, price: Number(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="97"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de Contas MT5</label>
                      <input
                        type="number"
                        value={editingPlan.maxAccounts}
                        onChange={(e) => setEditingPlan({...editingPlan, maxAccounts: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="3"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={editingPlan.popular || false}
                          onChange={(e) => setEditingPlan({...editingPlan, popular: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">Marcar como "Mais Popular"</label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recursos do Plano</label>
                      <div className="space-y-2">
                        {editingPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...editingPlan.features]
                                newFeatures[index] = e.target.value
                                setEditingPlan({...editingPlan, features: newFeatures})
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: Copy trading em tempo real"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = editingPlan.features.filter((_, i) => i !== index)
                                setEditingPlan({...editingPlan, features: newFeatures})
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setEditingPlan({...editingPlan, features: [...editingPlan.features, '']})}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adicionar Recurso</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                      >
                        {editingPlan.id === 'new' ? 'Criar Plano' : 'Salvar Alterações'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPlan(null)}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Gateway Config (Admin Only) */}
        {currentView === 'payment-config' && userRole === 'admin' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Configuração do Gateway de Pagamento</h2>

            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <form onSubmit={handlePaymentGatewayConfig} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chave da API</label>
                    <input
                      type="text"
                      value={paymentGateway.apiKey}
                      onChange={(e) => setPaymentGateway({...paymentGateway, apiKey: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="pk_live_..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chave Secreta</label>
                    <input
                      type="password"
                      value={paymentGateway.secretKey}
                      onChange={(e) => setPaymentGateway({...paymentGateway, secretKey: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="sk_live_..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL do Webhook</label>
                  <input
                    type="url"
                    value={paymentGateway.webhookUrl}
                    onChange={(e) => setPaymentGateway({...paymentGateway, webhookUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://seudominio.com/webhook/pagamento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ambiente</label>
                  <select
                    value={paymentGateway.environment}
                    onChange={(e) => setPaymentGateway({...paymentGateway, environment: e.target.value as 'sandbox' | 'production'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sandbox">Sandbox (Teste)</option>
                    <option value="production">Produção</option>
                  </select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Configurações de Segurança</h4>
                      <div className="text-sm text-yellow-700 mt-2 space-y-1">
                        <p>• Mantenha suas chaves secretas seguras e nunca as compartilhe</p>
                        <p>• Use sempre HTTPS para URLs de webhook</p>
                        <p>• Teste primeiro no ambiente sandbox antes de ir para produção</p>
                        <p>• Configure IPs autorizados no painel do seu gateway</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Gateways Suportados:</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Mercado Pago (PIX, Cartão, Boleto)</p>
                    <p>• PagSeguro (PIX, Cartão, Boleto)</p>
                    <p>• Stripe (Cartão Internacional)</p>
                    <p>• PayPal (Cartão, PayPal Balance)</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                >
                  Salvar Configurações
                </button>
              </form>
            </div>

            {/* Test Payment Section */}
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Testar Integração</h3>
              <p className="text-gray-600 mb-6">
                Use esta seção para testar se suas configurações estão funcionando corretamente.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                  Testar PIX
                </button>
                <button className="bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                  Testar Webhook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plans */}
        {currentView === 'plans' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Planos de Contrato</h2>
              <p className="text-xl text-gray-600">Escolha o plano ideal para suas necessidades de copy trading</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div key={plan.id} className={`bg-white rounded-2xl shadow-sm border-2 p-8 relative ${
                  plan.popular ? 'border-blue-500' : 'border-gray-200'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Mais Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-4xl font-bold text-gray-900">R${plan.price}</span>
                      <span className="text-gray-600">/mês</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleCheckout(plan)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    Escolher Plano
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Garantia de 30 dias</h3>
                <p className="text-gray-700 mb-6">
                  Experimente nosso serviço sem riscos. Se não ficar satisfeito, 
                  devolvemos 100% do seu dinheiro em até 30 dias.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Sem taxa de setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Cancele a qualquer momento</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Suporte 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}