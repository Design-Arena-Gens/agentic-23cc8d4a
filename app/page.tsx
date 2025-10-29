'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { OverviewCards, type OverviewStat } from '@/components/overview-cards';
import { SpendingCharts } from '@/components/spending-charts';
import {
  RecentTransactions,
  type Transaction,
  type TransactionFilter
} from '@/components/recent-transactions';
import { CreditCardsCarousel, type CreditCardData } from '@/components/credit-cards-carousel';
import {
  ReceiptScanner,
  type ReceiptRecord
} from '@/components/receipt-scanner';
import { VoiceAssistant } from '@/components/voice-assistant';
import { SplitwiseAI, type SplitwiseGroup } from '@/components/splitwise-ai';
import { AiInsights } from '@/components/ai-insights';
import jsPDF from 'jspdf';
import clsx from 'clsx';

type VoiceMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
};

const baseTransactions: Transaction[] = [
  { id: 'trx-1', date: '01 Apr 2024', description: 'Starbucks Cyberhub', category: 'Food', amount: 320, method: 'Card' },
  { id: 'trx-2', date: '03 Apr 2024', description: 'Uber Airport Drop', category: 'Travel', amount: 1450, method: 'UPI' },
  { id: 'trx-3', date: '05 Apr 2024', description: 'NetFlix Prime Bundle', category: 'Bills', amount: 799, method: 'Card' },
  { id: 'trx-4', date: '07 Apr 2024', description: 'Decathlon Noida', category: 'Shopping', amount: 5200, method: 'Card' },
  { id: 'trx-5', date: '09 Apr 2024', description: 'Apollo Clinic', category: 'Wellness', amount: 1800, method: 'Card' },
  { id: 'trx-6', date: '11 Apr 2024', description: 'Zomato Weekend Treat', category: 'Food', amount: 960, method: 'UPI' },
  { id: 'trx-7', date: '13 Apr 2024', description: 'IndiGo Return Flight', category: 'Travel', amount: 11200, method: 'Card' },
  { id: 'trx-8', date: '15 Apr 2024', description: 'Tata Power Bill', category: 'Utilities', amount: 2650, method: 'UPI' },
  { id: 'trx-9', date: '17 Apr 2024', description: 'H&M Summer Collection', category: 'Shopping', amount: 3890, method: 'Card' },
  { id: 'trx-10', date: '18 Apr 2024', description: 'Big Basket Weekly Groceries', category: 'Food', amount: 2150, method: 'Wallet' }
];

const monthlySpendingData = [
  { name: 'Nov', spending: 58600, aiProjection: 60200 },
  { name: 'Dec', spending: 61240, aiProjection: 59880 },
  { name: 'Jan', spending: 65480, aiProjection: 63900 },
  { name: 'Feb', spending: 60220, aiProjection: 61500 },
  { name: 'Mar', spending: 68840, aiProjection: 70200 },
  { name: 'Apr', spending: 73120, aiProjection: 74800 }
];

const categoryDistribution = [
  { name: 'Food', value: 21 },
  { name: 'Travel', value: 26 },
  { name: 'Bills', value: 12 },
  { name: 'Shopping', value: 19 },
  { name: 'Wellness', value: 8 },
  { name: 'Utilities', value: 14 }
];

const baseCards: CreditCardData[] = [
  { id: 'card-1', brand: 'Aurora Sapphire', number: '5312  ****  ****  8931', holder: 'Aanya Verma', balance: 45230, limit: 150000, dueDate: '05 May' },
  { id: 'card-2', brand: 'Mint Velocity', number: '4511  ****  ****  1120', holder: 'Aanya Verma', balance: 18540, limit: 100000, dueDate: '21 Apr' },
  { id: 'card-3', brand: 'Nexus Infinite', number: '4022  ****  ****  7604', holder: 'Aanya Verma', balance: 9680, limit: 85000, dueDate: '28 Apr' }
];

const baseReceipts: ReceiptRecord[] = [
  {
    id: 'rc-1',
    fileName: 'indigo-flight.pdf',
    date: '13 Apr 2024',
    merchant: 'IndiGo Airlines',
    amount: 11200,
    category: 'Travel',
    status: 'done',
    summary: 'Round trip to Bengaluru for product sprint. Tagged to Work Travel budget.',
    url: undefined
  },
  {
    id: 'rc-2',
    fileName: 'starbucks-apr.png',
    date: '01 Apr 2024',
    merchant: 'Starbucks',
    amount: 320,
    category: 'Food',
    status: 'done',
    summary: 'Client sync coffee meeting. Auto-matched to Food & Coffee sub-category.',
    url: undefined
  }
];

const baseGroups: SplitwiseGroup[] = [
  {
    id: 'grp-1',
    name: 'Bali Offsite',
    total: 86450,
    owed: 18200,
    owe: 7600,
    suggestion: 'Aanya pays ₹7,600 to Ishan, while Meera reimburses ₹12,400 to Dev to settle.',
    reminder: 'Settle before 25 Apr or auto-split via Nexus wallet.'
  },
  {
    id: 'grp-2',
    name: 'Roomies - April',
    total: 31200,
    owed: 6400,
    owe: 5300,
    suggestion: 'Aanya receives ₹3,100 from Veer; auto-split rent reminder set for 1 May.',
    reminder: 'Utility split review scheduled for 27 Apr.'
  }
];

const translations = {
  en: {
    navbar: {
      brand: 'NEXUS • FINANCE',
      searchPlaceholder: 'Search accounts, cards, insights…',
      aiPulse: 'Ask Nexus',
      notifications: 'Notifications',
      profileGreeting: 'Aanya Verma',
      profileRole: 'FinOps | NeoWealth Collective',
      languageLabel: 'Switch language'
    },
    sidebar: {
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      receipts: 'Receipts',
      cards: 'Cards',
      splitwise: 'Splitwise AI',
      settings: 'Settings'
    },
    overview: {
      balance: 'Total Balance',
      spending: 'Monthly Spending',
      projection: 'AI Predicted Next Month',
      wallet: 'Wallet • Add Money',
      walletHint: 'Load wallet with UPI or cards for instant payouts.'
    },
    charts: {
      monthly: 'Spending vs AI Projection',
      categories: 'Category Split',
      projectionLabel: '6-month rolling trend with Nexus foresight'
    },
    transactions: {
      title: 'Recent Transactions',
      filterBy: 'Filter transactions',
      category: 'Category',
      method: 'Method',
      reset: 'Reset',
      empty: 'AI could not find any transactions matching the filters.'
    },
    receipts: {
      title: 'AI Receipt Scanner',
      uploadCta: 'Upload & Scan',
      dragLabel: 'Drag & drop PDFs or images, or tap to browse',
      empty: 'No receipts yet. Upload invoices to auto-extract spend data.',
      detailTitle: 'Receipt intelligence',
      summary: 'Summary',
      extracted: 'Extracted fields',
      view: 'View file'
    },
    voice: {
      title: 'Nexus Voice',
      subtitle: 'Ask anything or log expenses in any language.',
      placeholder: 'Type or dictate, e.g. “Add ₹250 lunch with Rhea”',
      listening: 'Listening…',
      talk: 'Mic'
    },
    splitwise: {
      title: 'Splitwise AI Clone',
      subtitle: 'Group expenses, smart settlement plans, proactive nudges.',
      addGroup: 'Add group',
      placeholder: 'New AI group e.g. “Weekend Goa Crew”',
      owed: 'You receive',
      owe: 'You pay',
      settle: 'Generate smart settlement',
      reminder: 'Next reminder'
    },
    insights: {
      title: 'AI Insights & Alerts',
      subtitle: 'Autonomous finance copilots monitoring your flows.',
      insights: 'Budgeting tips',
      alerts: 'Overspending alerts',
      summary: 'Monthly summary',
      download: 'Download AI PDF'
    },
    suggestions: 'Chatbot nudges'
  },
  hi: {
    navbar: {
      brand: 'नेक्सस • वित्त',
      searchPlaceholder: 'खाते, कार्ड, विश्लेषण खोजें…',
      aiPulse: 'नेक्सस से पूछें',
      notifications: 'सूचनाएँ',
      profileGreeting: 'आन्या वर्मा',
      profileRole: 'वित्त संचालन | नियोवेल्थ',
      languageLabel: 'भाषा बदलें'
    },
    sidebar: {
      dashboard: 'डैशबोर्ड',
      analytics: 'एनालिटिक्स',
      receipts: 'रसीदें',
      cards: 'कार्ड्स',
      splitwise: 'स्प्लिटवाइज AI',
      settings: 'सेटिंग्स'
    },
    overview: {
      balance: 'कुल बैलेंस',
      spending: 'मासिक खर्च',
      projection: 'अगले माह का AI अनुमान',
      wallet: 'वॉलेट • पैसा जोड़ें',
      walletHint: 'तुरंत भुगतान हेतु वॉलेट लोड करें।'
    },
    charts: {
      monthly: 'खर्च बनाम AI अनुमान',
      categories: 'श्रेणी विभाजन',
      projectionLabel: '6 माह की AI प्रवृत्ति'
    },
    transactions: {
      title: 'लेन-देन',
      filterBy: 'फ़िल्टर करें',
      category: 'श्रेणी',
      method: 'भुगतान विधि',
      reset: 'रीसेट',
      empty: 'चयनित फ़िल्टर से कोई लेन-देन नहीं मिला।'
    },
    receipts: {
      title: 'AI रसीद स्कैनर',
      uploadCta: 'अपलोड करें',
      dragLabel: 'PDF या इमेज खींचें व छोड़ें',
      empty: 'अभी कोई रसीद नहीं।',
      detailTitle: 'रसीद विवरण',
      summary: 'सारांश',
      extracted: 'निकाले गए डेटा',
      view: 'फाइल देखें'
    },
    voice: {
      title: 'नेक्सस वॉइस',
      subtitle: 'कुछ भी पूछें या खर्च रिकॉर्ड करें।',
      placeholder: 'लिखें: “₹250 लंच दर्ज करें”',
      listening: 'सुन रहे हैं…',
      talk: 'माइक'
    },
    splitwise: {
      title: 'स्प्लिटवाइज AI क्लोन',
      subtitle: 'ग्रुप खर्च, समायोजन सुझाव, रिमाइंडर।',
      addGroup: 'नया समूह',
      placeholder: 'उदाहरण: “वीकेंड गैंग”',
      owed: 'आपको मिलेगा',
      owe: 'आप देंगे',
      settle: 'स्मार्ट सेटलमेंट',
      reminder: 'अगला रिमाइंडर'
    },
    insights: {
      title: 'AI अंतर्दृष्टि व अलर्ट',
      subtitle: 'आपके खर्च पर निरंतर नज़र।',
      insights: 'बजट सुझाव',
      alerts: 'अतिरिक्त खर्च अलर्ट',
      summary: 'मासिक सारांश',
      download: 'AI PDF डाउनलोड'
    },
    suggestions: 'चैटबॉट सुझाव'
  },
  es: {
    navbar: {
      brand: 'NEXUS • FINANZAS',
      searchPlaceholder: 'Busca cuentas, tarjetas, insights…',
      aiPulse: 'Preguntar a Nexus',
      notifications: 'Alertas',
      profileGreeting: 'Aanya Verma',
      profileRole: 'FinOps | NeoWealth',
      languageLabel: 'Cambiar idioma'
    },
    sidebar: {
      dashboard: 'Panel',
      analytics: 'Analítica',
      receipts: 'Recibos',
      cards: 'Tarjetas',
      splitwise: 'Splitwise AI',
      settings: 'Ajustes'
    },
    overview: {
      balance: 'Saldo total',
      spending: 'Gasto mensual',
      projection: 'Proyección AI próximo mes',
      wallet: 'Billetera • Añadir dinero',
      walletHint: 'Carga con UPI o tarjeta para pagos instantáneos.'
    },
    charts: {
      monthly: 'Gasto vs proyección AI',
      categories: 'Distribución',
      projectionLabel: 'Tendencia de 6 meses con Nexus'
    },
    transactions: {
      title: 'Transacciones recientes',
      filterBy: 'Filtrar',
      category: 'Categoría',
      method: 'Método',
      reset: 'Reiniciar',
      empty: 'No se encontraron transacciones con esos filtros.'
    },
    receipts: {
      title: 'Escáner AI de recibos',
      uploadCta: 'Subir y escanear',
      dragLabel: 'Arrastra PDFs o imágenes, o pulsa para buscar',
      empty: 'Sin recibos aún. Sube facturas para extraer datos.',
      detailTitle: 'Detalle inteligente',
      summary: 'Resumen',
      extracted: 'Campos extraídos',
      view: 'Ver archivo'
    },
    voice: {
      title: 'Voz Nexus',
      subtitle: 'Pregunta o registra gastos en segundos.',
      placeholder: 'Ej. “Añade ₹250 comida con Rhea”',
      listening: 'Escuchando…',
      talk: 'Mic'
    },
    splitwise: {
      title: 'Splitwise AI',
      subtitle: 'Gestión de grupos, ajustes y recordatorios.',
      addGroup: 'Crear grupo',
      placeholder: 'Ej. “Crew de Barcelona”',
      owed: 'Recibes',
      owe: 'Debes',
      settle: 'Sugerencia de liquidación',
      reminder: 'Próximo recordatorio'
    },
    insights: {
      title: 'Insights y alertas AI',
      subtitle: 'Copilotos financieros vigilando tu cashflow.',
      insights: 'Consejos de presupuesto',
      alerts: 'Alertas de exceso',
      summary: 'Resumen mensual',
      download: 'Descargar PDF'
    },
    suggestions: 'Sugerencias del bot'
  }
};

const chatbotPrompts = [
  'You are overspending on Food this week. Shift ₹1,200 from Entertainment budget?',
  'AI recommends auto-transferring ₹5,000 to Goals: “European Summer Fund”.',
  'Two credit bills due in 5 days. Enable autopay to earn +210 reward points?',
  'Splitwise AI spotted ₹2,450 still unsettled with Veer. Send a gentle reminder?'
];

function formatNow(): string {
  const now = new Date();
  return now.toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function inferCategoryFromText(text: string): string {
  const lowered = text.toLowerCase();
  if (/(food|lunch|dinner|coffee|restaurant|burger|pizza)/.test(lowered)) return 'Food';
  if (/(uber|flight|travel|ride|cab|train|metro)/.test(lowered)) return 'Travel';
  if (/(rent|electric|bill|subscription|power|netflix)/.test(lowered)) return 'Bills';
  if (/(shopping|mall|amazon|flipkart|fashion|clothes)/.test(lowered)) return 'Shopping';
  if (/(doctor|clinic|health|wellness|fitness)/.test(lowered)) return 'Wellness';
  if (/(water|gas|utility|internet)/.test(lowered)) return 'Utilities';
  return 'Other';
}

function simulateReceiptExtraction(file: File) {
  const name = file.name.replace(/\.(pdf|png|jpg|jpeg)$/i, '');
  const merchant = name
    .split(/[-_]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .slice(0, 2)
    .join(' ') || 'Smart Merchant';

  const amountSeed = Math.max(300, Math.min(15000, Math.round(file.size / 8)));
  const amount = Math.round((amountSeed % 12000) + 420);
  const category = inferCategoryFromText(name);
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 10));
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const summary = `AI extracted ${merchant} purchase for ₹${amount.toLocaleString('en-IN')} on ${formattedDate}. Tagged to ${category}.`;

  return { merchant, amount, category, date: formattedDate, summary };
}

export default function DashboardPage() {
  const [language, setLanguage] = useState<'en' | 'hi' | 'es'>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [filter, setFilter] = useState<TransactionFilter>({ category: 'All', method: 'All' });
  const [transactions, setTransactions] = useState<Transaction[]>(baseTransactions);
  const [cards] = useState<CreditCardData[]>(baseCards);
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(baseReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | null>(null);
  const [groups, setGroups] = useState<SplitwiseGroup[]>(baseGroups);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);

  const copy = translations[language];

  const monthlyTotal = useMemo(() => transactions.reduce((sum, trx) => sum + trx.amount, 0), [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryAllowed = filter.category === 'All' || transaction.category === filter.category;
      const methodAllowed = filter.method === 'All' || transaction.method === filter.method;
      return matchesSearch && categoryAllowed && methodAllowed;
    });
  }, [transactions, filter, searchTerm]);

  const overviewStats: OverviewStat[] = [
    {
      id: 'balance',
      title: copy.overview.balance,
      value: '₹18,27,920',
      delta: '+3.6%',
      positive: true,
      hint: 'AI reallocations boosted savings by ₹42,300 this quarter.'
    },
    {
      id: 'spending',
      title: copy.overview.spending,
      value: `₹${(monthlySpendingData.at(-1)?.spending ?? monthlyTotal).toLocaleString('en-IN')}`,
      delta: '+4.8%',
      positive: false,
      hint: 'Food and travel drove 61% of this month’s outflow.'
    },
    {
      id: 'projection',
      title: copy.overview.projection,
      value: `₹${(monthlySpendingData.at(-1)?.aiProjection ?? monthlyTotal).toLocaleString('en-IN')}`,
      delta: '+₹5,180',
      positive: false,
      hint: 'AI expects surge in travel refunds and annual SaaS renewals.'
    },
    {
      id: 'wallet',
      title: copy.overview.wallet,
      value: '₹24,400',
      delta: '+₹4,000',
      positive: true,
      hint: copy.overview.walletHint,
      accent: 'linear-gradient(135deg, rgba(14, 126, 249, 0.55), rgba(30, 227, 181, 0.32))',
      actionLabel: 'Add ₹2,000 to Nexus Wallet',
      onAction: () => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: 'ai',
            content: 'Wallet topped up with ₹2,000 from HDFC UPI. Cashback boost: +₹120 predicted.',
            timestamp: formatNow()
          }
        ]);
      }
    }
  ];

  const insights = useMemo(() => {
    const topCategory = categoryDistribution.reduce((max, category) =>
      category.value > max.value ? category : max
    );
    return [
      `Shift 12% of discretionary spend to "${topCategory.name}" cap to stay within ₹70k target.`,
      'Auto-classified 94% of transactions. Tag the remaining 3 expenses for smarter AI nudges.',
      'Round-up savings added ₹2,850 to Emergency Buffer. Consider boosting to ₹5k for resilience.'
    ];
  }, []);

  const alerts = useMemo(() => {
    const foodSpend = transactions
      .filter((transaction) => transaction.category === 'Food')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const travelSpend = transactions
      .filter((transaction) => transaction.category === 'Travel')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const items = [];
    if (foodSpend > 4500) {
      items.push(`Food spend is ₹${foodSpend.toLocaleString('en-IN')} vs ₹4,000 cap. Suggest moving Friday dine-out to wallet cashback card.`);
    }
    if (travelSpend > 10000) {
      items.push(`Travel is trending +₹${(travelSpend - 10000).toLocaleString('en-IN')} over plan. AI scheduled fare-drop alerts for May getaways.`);
    }
    items.push('Credit utilisation at 41%. Paying ₹8,000 now keeps score in sapphire tier.');
    return items;
  }, [transactions]);

  const monthlySummary = `Nexus tracked ₹${monthlyTotal.toLocaleString(
    'en-IN'
  )} in April inflows/outflows. Wallet liquidity improved and AI predicts a controlled rise due to travel reimbursements.`;

  const handleReceiptUpload = (files: FileList) => {
    const incoming = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      return {
        id: `rc-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        fileName: file.name,
        date: 'Processing…',
        merchant: 'Detecting…',
        amount: 0,
        category: 'Detecting…',
        status: 'processing' as const,
        summary: 'Auto scanning fields using Nexus OCR + GPT extraction.',
        url
      };
    });
    setReceipts((prev) => [...incoming, ...prev]);

    incoming.forEach((item, index) => {
      const file = Array.from(files)[index];
      const data = simulateReceiptExtraction(file);
      setTimeout(() => {
        setReceipts((prev) =>
          prev.map((receipt) =>
            receipt.id === item.id
              ? {
                  ...receipt,
                  ...data,
                  status: 'done' as const
                }
              : receipt
          )
        );
      }, 1200 + index * 420);
    });
  };

  const handleVoiceProcess = async (input: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: input,
        timestamp: formatNow()
      }
    ]);

    const expenseMatch = input.match(/spent\s*₹?\s*(\d+(?:\.\d+)?)/i) || input.match(/₹\s*(\d+(?:\.\d+)?)/);
    if (expenseMatch) {
      const amount = Math.round(Number(expenseMatch[1]));
      const descriptionMatch = input.match(/on\s([^.,]+)/i);
      const description = descriptionMatch ? descriptionMatch[1].trim() : 'Voice logged expense';
      const category = inferCategoryFromText(input);
      const methodMatch = /upi|card|cash|wallet/i.exec(input);
      const method = methodMatch ? methodMatch[0].toUpperCase() : 'UPI';
      const newTransaction: Transaction = {
        id: `trx-${Date.now()}`,
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        description: description.replace(/₹\d+/g, '').trim(),
        category,
        amount,
        method
      };
      setTransactions((prev) => [newTransaction, ...prev]);

      const response = `Logged ₹${amount.toLocaleString(
        'en-IN'
      )} under ${category}. Trendline updated and wallet cashback routes optimised.`;
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-ai`,
          role: 'ai',
          content: response,
          timestamp: formatNow()
        }
      ]);
      return response;
    }

    const topSpend = [...transactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map((trx) => `${trx.description} — ₹${trx.amount.toLocaleString('en-IN')}`)
      .join('; ');

    const response = input.toLowerCase().includes('top spending')
      ? `Top spends: ${topSpend}. Food wallet optimisations can trim ₹1,450 next cycle.`
      : 'Nexus AI is analysing cashflow signatures. Expect an insight drop in a moment.';

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-ai`,
        role: 'ai',
        content: response,
        timestamp: formatNow()
      }
    ]);
    return response;
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Nexus AI • April Summary', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, 14, 32);
    doc.text('Key Highlights:', 14, 44);
    insights.forEach((insight, index) => {
      doc.text(`• ${insight}`, 20, 56 + index * 8);
    });
    const alertStart = 56 + insights.length * 8 + 6;
    doc.text('Overspending Alerts:', 14, alertStart);
    alerts.forEach((alert, index) => {
      doc.text(`• ${alert}`, 20, alertStart + 10 + index * 8);
    });
    doc.text(monthlySummary, 14, alertStart + 18 + alerts.length * 8, {
      maxWidth: 180
    });
    doc.save('nexus-ai-summary.pdf');
  };

  const handleAddGroup = (name: string) => {
    setGroups((prev) => [
      {
        id: `grp-${Date.now()}`,
        name,
        total: 0,
        owed: 0,
        owe: 0,
        suggestion: 'AI will start tracking once expenses sync in.',
        reminder: 'Reminder scheduled for 1 May.'
      },
      ...prev
    ]);
  };

  const handleGroupSuggestion = (groupId: string) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              suggestion: 'AI suggests balancing with one transfer: pay ₹3,420 to equalise in under 2 mins.',
              reminder: 'Auto reminder pushed to WhatsApp & email for this Friday.'
            }
          : group
      )
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        padding: '18px 24px 48px',
        background:
          'radial-gradient(circle at top left, rgba(14, 126, 249, 0.18), transparent 45%), radial-gradient(circle at bottom right, rgba(30, 227, 181, 0.18), transparent 42%)'
      }}
    >
      <Navbar
        onSearch={setSearchTerm}
        t={copy.navbar}
        language={language}
        onLanguageChange={(value) => setLanguage(value as 'en' | 'hi' | 'es')}
      />

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <Sidebar activeKey={activeSection} onChange={setActiveSection} t={copy.sidebar} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <OverviewCards stats={overviewStats} />

          <SpendingCharts
            monthly={monthlySpendingData}
            categories={categoryDistribution}
            t={copy.charts}
          />

          <RecentTransactions
            transactions={filteredTransactions}
            onFilterChange={setFilter}
            filters={filter}
            t={copy.transactions}
          />

          <CreditCardsCarousel cards={cards} t={{ title: 'Credit Cards', due: 'Due', available: 'AI monitors utilisation across cards.' }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: 20,
              alignItems: 'stretch'
            }}
            className={clsx('fade-in')}
          >
            <ReceiptScanner
              receipts={receipts}
              onUpload={handleReceiptUpload}
              selectedReceipt={selectedReceipt}
              onSelect={(id) => setSelectedReceipt(receipts.find((receipt) => receipt.id === id) ?? null)}
              onCloseDetail={() => setSelectedReceipt(null)}
              t={copy.receipts}
            />
            <VoiceAssistant messages={messages} onProcess={handleVoiceProcess} t={copy.voice} />
          </div>

          <SplitwiseAI
            groups={groups}
            onAddGroup={handleAddGroup}
            onGenerateSuggestion={handleGroupSuggestion}
            t={copy.splitwise}
          />

          <AiInsights
            insights={insights}
            alerts={alerts}
            onGeneratePdf={handleGeneratePdf}
            monthlySummary={monthlySummary}
            t={copy.insights}
          />

          <section
            className={clsx('glass')}
            style={{
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <strong style={{ fontSize: 14 }}>{copy.suggestions}</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {chatbotPrompts.map((prompt) => (
                <span
                  key={prompt}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.05)',
                    fontSize: 12,
                    color: 'var(--color-muted)'
                  }}
                >
                  {prompt}
                </span>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
