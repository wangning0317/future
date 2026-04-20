import { useState, useMemo, useEffect } from 'react';
import { 
  LifeBuoy, 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  MessageSquare, 
  Settings, 
  Search, 
  Plus, 
  Send, 
  X, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Menu,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, TicketType, TicketStatus, ChatMessage, FAQItem, Priority, OpsType } from './types.ts';

// Mock Data
const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'T20260420001',
    type: 'error',
    opsType: 'bug',
    title: '审核页批量提交报 500',
    description: '1. 勾选 20 条记录；2. 点"批量提交"；3. 页面弹出 500 错误。',
    status: 'forwarded',
    priority: 'high',
    creator: 'u_88213 (张三)',
    createdAt: '2026-04-20 10:13:22',
    updatedAt: '2026-04-20 10:35:00',
    associatedBId: 'BUG-5012',
    context: {
      userId: 'u_88213',
      page: '/tasks/review',
      browser: 'Chrome 126',
      resolution: '1920×1080'
    }
  },
  {
    id: 'T20260420002',
    type: 'question',
    title: '看不到"导出"按钮',
    description: '想导出当月审核明细，但在页面底部没找到按钮。',
    status: 'pending',
    priority: 'medium',
    creator: 'u_88301 (李丽)',
    createdAt: '2026-04-20 10:45:10',
    updatedAt: '2026-04-20 10:45:10'
  },
  {
    id: 'T20260420003',
    type: 'error',
    title: '首页加载白屏，持续 10 秒',
    description: '早晨 9 点切换环境后，首页一直白屏，控制台报错 net::ERR_CONNECTION_TIMED_OUT。',
    status: 'processing',
    priority: 'urgent',
    creator: 'u_99102 (王五)',
    createdAt: '2026-04-20 09:05:00',
    updatedAt: '2026-04-20 09:20:00'
  },
  {
    id: 'T20260420004',
    type: 'suggestion',
    title: '建议增加搜索联想功能',
    description: '搜索任务 ID 时，希望能弹出最近查看的 ID。',
    status: 'pending',
    priority: 'low',
    creator: 'u_77812 (赵六)',
    createdAt: '2026-04-20 11:20:00',
    updatedAt: '2026-04-20 11:20:00'
  },
  {
    id: 'T20260420005',
    type: 'error',
    title: '用户权限自动重置',
    description: '部分审核员反映配置好的权限在午夜会自动消失。',
    status: 'pending',
    priority: 'high',
    creator: 'admin_01 (权限管理员)',
    createdAt: '2026-04-19 23:30:00',
    updatedAt: '2026-04-19 23:30:00'
  },
  {
    id: 'T20260420006',
    type: 'question',
    title: 'API 接口文档在哪里查看',
    description: '找不到最新的 V2 版本接口定义，Wiki 上的链接失效了。',
    status: 'resolved',
    priority: 'medium',
    creator: 'dev_55 (老王)',
    createdAt: '2026-04-18 14:00:00',
    updatedAt: '2026-04-20 10:00:00'
  },
  {
    id: 'T20260420007',
    type: 'error',
    title: '结算单金额计算错误',
    description: '某批次计算结果与表格不符，偏差大约 0.01。',
    status: 'processing',
    priority: 'high',
    creator: 'fin_88 (钱朵朵)',
    createdAt: '2026-04-20 08:30:00',
    updatedAt: '2026-04-20 08:45:00'
  },
  {
    id: 'T20260420008',
    type: 'suggestion',
    title: '暗黑模式适配需求',
    description: '长期晚上加班，浅色界面太刺眼，希望能有一键切换样式。',
    status: 'pending',
    priority: 'low',
    creator: 'u_66210 (夜猫)',
    createdAt: '2026-04-20 12:00:00',
    updatedAt: '2026-04-20 12:00:00'
  },
  {
    id: 'T20260420009',
    type: 'error',
    title: '移动端无法签到',
    description: '在 H5 页面点击按钮无响应，Android 环境下出现此问题。',
    status: 'forwarded',
    priority: 'medium',
    creator: 'u_1120 (小李)',
    createdAt: '2026-04-20 09:45:00',
    updatedAt: '2026-04-20 10:10:00',
    associatedBId: 'FE-MOBILE-112'
  },
  {
    id: 'T20260420010',
    type: 'question',
    title: '如何申请测试账号？',
    description: '外部厂商需要接入环境，走什么流程申请？',
    status: 'pending',
    priority: 'low',
    creator: 'ext_v1 (合作商)',
    createdAt: '2026-04-20 13:15:00',
    updatedAt: '2026-04-20 13:15:00'
  }
];

const FAQ_DATA: FAQItem[] = [
  { id: '1', question: '批量提交失败如何处理？', answer: '请先确认单批数量不超过 50；若仍失败，提交工单并附截图...', category: '审核' },
  { id: '2', question: '如何一键导出当月数据？', answer: '在数据看板页右上角 → 导出 → 选择时间范围...', category: '导出' },
  { id: '3', question: '提示"无权限"怎么办？', answer: '联系组长在权限中心分配"审核员"角色...', category: '权限' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'system-a' | 'ops-center' | 'system-b'>('system-a');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [ticketView, setTicketView] = useState<'menu' | 'submit' | 'list' | 'faq' | 'chat'>('menu');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const selectedTicket = useMemo(() => tickets.find(t => t.id === selectedTicketId), [tickets, selectedTicketId]);

  const tabs = [
    { id: 'system-a', label: '系统A & 报修浮窗' },
    { id: 'ops-center', label: '工单运营中台' },
    { id: 'system-b', label: '系统B (研发缺陷)' },
  ];

  const handleTicketSubmit = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
    setActiveTab('ops-center');
    setSelectedTicketId(newTicket.id);
  };

  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'system-a':
        return <SystemAView 
          widgetView={ticketView} 
          setWidgetView={setTicketView}
          tickets={tickets}
          onSubmit={handleTicketSubmit}
        />;
      case 'ops-center':
        return <OpsCenter 
          tickets={tickets} 
          selectedId={selectedTicketId} 
          onSelect={setSelectedTicketId} 
          onUpdate={handleTicketUpdate}
        />;
      case 'system-b':
        return <SystemBView 
          tickets={tickets} 
          selectedId={selectedTicketId} 
          onSelect={setSelectedTicketId}
        />;
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center font-bold text-lg">H</div>
          <h1 className="text-sm font-semibold tracking-tight uppercase">TicketHub · 高保真交互原型</h1>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[60%]">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'a-widget') setTicketView('menu');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-brand text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// System A Mockup
function SystemAView({ widgetView, setWidgetView, tickets, onSubmit }: { 
  widgetView: 'menu' | 'submit' | 'list' | 'faq' | 'chat',
  setWidgetView: (v: any) => void,
  tickets: Ticket[],
  onSubmit: (t: Ticket) => void
}) {
  const [showWidget, setShowWidget] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col">
       {/* Device Topbar */}
       <div className="bg-slate-900 px-4 py-2 flex items-center gap-4 text-[10px] text-slate-400 uppercase tracking-widest">
         <div className="flex gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
           <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
         </div>
         <span className="ml-2">系统 A · 工作台</span>
       </div>

       <div className="flex flex-1">
         {/* Sidebar */}
         <aside className="w-48 bg-slate-50 border-r border-slate-100 p-4 space-y-6 hidden md:block">
           <div className="flex items-center gap-2 px-2">
             <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-[10px] font-bold text-white">A</div>
             <span className="font-bold text-sm uppercase">系统 A</span>
           </div>
           <nav className="space-y-1">
             {['我的作业', '任务池', '数据看板', '系统设置'].map((item, i) => (
               <div key={item} 
                className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${i === 0 ? 'bg-brand/10 text-brand' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}>
                 {item}
               </div>
             ))}
           </nav>
         </aside>

         {/* Content */}
         <main className="flex-1 p-8">
            <header className="mb-8 flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold">我的作业</h3>
                <p className="text-sm text-slate-400 mt-1">处理本月分配给您的待审核任务</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost py-1 px-3 text-xs">导出报告</button>
                <button className="btn-primary py-1 px-3 text-xs" onClick={() => { setShowWidget(true); setWidgetView('submit'); }}>反馈问题</button>
              </div>
            </header>

            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                   <tr>
                     <th className="px-4 py-3">任务ID</th>
                     <th className="px-4 py-3">名称</th>
                     <th className="px-4 py-3">状态</th>
                     <th className="px-4 py-3">截止日期</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { id: 'T-9001', name: 'XX 批次数据审核', status: '处理中', color: 'text-amber-600 bg-amber-50', date: '2026-04-21' },
                      { id: 'T-9002', name: 'XX 异常单复核', status: '待开始', color: 'text-slate-500 bg-slate-100', date: '2026-04-22' },
                      { id: 'T-9003', name: 'XX 月度归档', status: '已完成', color: 'text-emerald-600 bg-emerald-50', date: '2026-04-20' },
                    ].map(row => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-mono text-[11px] text-slate-400">{row.id}</td>
                        <td className="px-4 py-4 font-medium">{row.name}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${row.color}`}>{row.status}</span>
                        </td>
                        <td className="px-4 py-4 text-slate-400 text-xs">{row.date}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
         </main>
       </div>

       {/* Floating Widget Toggle */}
       <div 
        onClick={() => setShowWidget(!showWidget)} 
        className="absolute bottom-6 right-6 w-14 h-14 bg-brand rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform active:scale-95 group z-[101]"
       >
         {showWidget ? <X className="w-7 h-7" /> : <LifeBuoy className="w-7 h-7" />}
         <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full" />
       </div>

       {/* Widget Panel */}
       <AnimatePresence>
         {showWidget && (
           <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
            className="absolute bottom-24 right-6 w-80 md:w-96 card-glass shadow-2xl rounded-2xl overflow-hidden z-[100]"
           >
             <header className="bg-brand p-4 text-white flex items-center justify-between">
                {widgetView !== 'menu' && (
                  <button onClick={() => setWidgetView('menu')} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                )}
                <h4 className="text-sm font-bold ml-2">
                  {widgetView === 'menu' ? '反馈与帮助' : 
                   widgetView === 'submit' ? '提交新工单' :
                   widgetView === 'list' ? '我的工单' :
                   widgetView === 'faq' ? '常见问题' : '转人工会话'}
                </h4>
                <button className="opacity-60 hover:opacity-100"><Menu className="w-4 h-4" /></button>
             </header>
  
             <div className="max-h-[480px] overflow-y-auto">
               {widgetView === 'menu' && <WidgetMenu setView={setWidgetView} />}
               {widgetView === 'submit' && <TicketForm setView={setWidgetView} onSubmit={onSubmit} />}
               {widgetView === 'list' && <UserTicketList tickets={tickets} />}
               {widgetView === 'faq' && <FAQView />}
               {widgetView === 'chat' && <ChatView />}
             </div>
             
             <footer className="p-3 bg-slate-50 border-t border-slate-100 flex justify-center">
                <span className="text-[10px] text-slate-400 font-medium">TicketHub v1.1 · 反馈中心</span>
             </footer>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}

function WidgetMenu({ setView }: { setView: (v: any) => void }) {
  const menus = [
    { id: 'submit', icon: <Plus className="w-5 h-5" />, title: '提交工单', sub: '报错 / 操作疑问 / 改进建议' },
    { id: 'chat', icon: <MessageSquare className="w-5 h-5" />, title: '转人工会话', sub: '实时和运营人员在线沟通' },
    { id: 'list', icon: <TicketIcon className="w-5 h-5" />, title: '我的工单', sub: '查看进度与历史反馈回复' },
    { id: 'faq', icon: <Search className="w-5 h-5" />, title: '常见问题', sub: '快速自助查找，解决常见痛点' },
  ];

  return (
    <div className="p-2 space-y-1">
      {menus.map(item => (
        <div 
          key={item.id} 
          onClick={() => setView(item.id)}
          className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
            {item.icon}
          </div>
          <div>
            <div className="text-sm font-bold">{item.title}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
          </div>
          <ChevronRight className="ml-auto w-4 h-4 text-slate-300 group-hover:text-brand" />
        </div>
      ))}
    </div>
  );
}

function TicketForm({ setView, onSubmit }: { setView: (v: any) => void, onSubmit: (t: Ticket) => void }) {
  const [type, setType] = useState<TicketType>('error');
  const [title, setTitle] = useState('审核页批量提交报 500');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    const newId = `T${Date.now()}`;
    const ticket: Ticket = {
      id: newId,
      type,
      title,
      description: desc || '用户快速提交。',
      status: 'pending',
      priority: 'medium',
      creator: 'u_88213 (张三)',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      context: {
        userId: 'u_88213',
        page: '/tasks/review',
        browser: 'Chrome 126',
        resolution: '1920×1080'
      }
    };
    onSubmit(ticket);
  };

  return (
    <div className="p-6 space-y-4 text-slate-900">
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">申报类型</label>
        <div className="flex gap-2">
          {([['error', '🐞 报错'], ['question', '❓ 疑问'], ['suggestion', '💡 建议']] as const).map(([val, label]) => (
            <button 
              key={val}
              onClick={() => setType(val)}
              className={`flex-1 text-[11px] font-bold py-2 rounded-lg border transition-all ${type === val ? 'bg-brand text-white border-brand shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">标题</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-50 px-3 py-2 rounded-lg text-sm border border-slate-100 focus:ring-2 focus:ring-brand focus:bg-white outline-none" 
          placeholder="一句话描述核心问题" 
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">详细描述</label>
        <textarea 
          rows={3} 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-slate-50 px-3 py-2 rounded-lg text-sm border border-slate-100 focus:ring-2 focus:ring-brand focus:bg-white outline-none" 
          placeholder="请输入具体流程和错误表现..."
        ></textarea>
      </div>
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
         <div className="text-[9px] font-bold text-slate-400 uppercase">上下文自动采集</div>
         <div className="text-[10px] text-slate-500 leading-tight">
           用户ID: u_88213 · 页面: /tasks/review<br/>
           Chrome 126 · IP: 182.xx.xx.xx
         </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button className="flex-1 btn-ghost py-2 text-xs" onClick={() => setView('menu')}>取消</button>
        <button className="flex-1 btn-primary py-2 text-xs shadow-lg hover:shadow-brand/20 transition-all" onClick={handleSubmit}>确认提交并跳转中台</button>
      </div>
    </div>
  );
}

function UserTicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="p-2 space-y-2">
      {tickets.map(t => (
        <div key={t.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:border-brand-light transition-all cursor-pointer group">
          <div className="flex justify-between items-start">
            <h5 className="text-sm font-bold group-hover:text-brand transition-colors truncate max-w-[70%]">{t.title}</h5>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              t.status === 'forwarded' ? 'bg-amber-50 text-amber-600' : 
              t.status === 'pending' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {t.status === 'forwarded' ? '处理中' : t.status === 'pending' ? '待受理' : '已解决'}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-medium">
            <span>{t.id}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> 2小时前</span>
            {t.associatedBId && (
              <span className="text-brand flex items-center gap-1"><ExternalLink className="w-2.5 h-2.5" /> {t.associatedBId}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQView() {
  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" className="w-full bg-slate-50 pl-10 pr-4 py-2 rounded-xl text-sm border-none focus:ring-2 focus:ring-brand" placeholder="搜索问题..." />
      </div>
      <div className="space-y-2">
        {FAQ_DATA.map(f => (
          <div key={f.id} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="text-sm font-bold mb-1 flex items-center justify-between">
              {f.question}
              <ChevronRight className="w-3 h-3 text-slate-300" />
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">{f.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatView() {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    { id: '1', sender: 'agent', content: '您好，这里是运营值班室，请问有什么可以帮您？', timestamp: '10:12' },
    { id: '2', sender: 'me', content: '批量提交总是报错，很着急', timestamp: '10:13' },
    { id: '3', sender: 'agent', content: '方便发下截图吗？我帮您排查', timestamp: '10:13' },
  ]);
  
  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMsgs(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulated Agent Reply
    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: '已收到您的信息，我正在尝试复现该问题，请稍等。',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMsgs(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-white/50">
        {msgs.map(m => (
          <motion.div 
            initial={{ opacity: 0, x: m.sender === 'me' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={m.id} 
            className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${m.sender === 'me' ? 'bg-brand text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>
              {m.content}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{m.timestamp}</span>
          </motion.div>
        ))}
        {isTyping && (
          <div className="text-[10px] text-brand font-medium animate-pulse ml-2">运营人员正在输入...</div>
        )}
      </div>
      <div className="p-4 border-t border-slate-100 flex gap-2 items-center bg-white">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-50 px-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all" 
          placeholder="输入消息..." 
        />
        <button 
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-all shadow-lg active:scale-90 disabled:opacity-50 disabled:scale-100"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Ops Fused Center
function OpsCenter({ tickets, selectedId, onSelect, onUpdate }: { 
  tickets: Ticket[], 
  selectedId: string | null, 
  onSelect: (id: string | null) => void,
  onUpdate: (ticket: Ticket) => void
}) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'sla'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const selectedTicket = useMemo(() => tickets.find(t => t.id === selectedId), [tickets, selectedId]);

  // Edit local state
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editType, setEditType] = useState<TicketType>('error');
  const [editOpsType, setEditOpsType] = useState<OpsType>('none');
  const [editPriority, setEditPriority] = useState<Priority>('medium');

  // New UI states
  const [showTransferList, setShowTransferList] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncForm, setSyncForm] = useState({
    businessLine: '金融核心',
    product: '信贷系统',
    system: '审批流组件'
  });

  useEffect(() => {
    if (selectedTicket) {
      setEditTitle(selectedTicket.title);
      setEditDesc(selectedTicket.description);
      setEditType(selectedTicket.type);
      setEditOpsType(selectedTicket.opsType || 'none');
      setEditPriority(selectedTicket.priority);
      setIsEditing(false);
      setShowTransferList(false);
      setShowSyncModal(false);
    }
  }, [selectedId, selectedTicket]);

  const handleSave = () => {
    if (!selectedTicket) return;
    onUpdate({
      ...selectedTicket,
      title: editTitle,
      description: editDesc,
      type: editType,
      opsType: editOpsType,
      priority: editPriority,
      updatedAt: new Date().toISOString().replace('T', ' ').split('.')[0]
    });
    setIsEditing(false);
  };

  const handleSyncToB = () => {
    if (!selectedTicket) return;
    const bId = editOpsType === 'bug' ? `BUG-${Math.floor(1000 + Math.random() * 9000)}` : `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    onUpdate({
      ...selectedTicket,
      associatedBId: bId,
      status: 'forwarded',
      bSystemInfo: { ...syncForm },
      updatedAt: new Date().toISOString().replace('T', ' ').split('.')[0]
    });
    setShowSyncModal(false);
  };

  const stats = useMemo(() => {
    return {
      pending: tickets.filter(t => t.status === 'pending').length,
      processing: tickets.filter(t => t.status === 'forwarded' || t.status === 'processing').length,
      sla: tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (filter === 'all') return tickets;
    if (filter === 'pending') return tickets.filter(t => t.status === 'pending');
    if (filter === 'processing') return tickets.filter(t => t.status === 'forwarded' || t.status === 'processing');
    if (filter === 'sla') return tickets.filter(t => t.priority === 'high' || t.priority === 'urgent');
    return tickets;
  }, [tickets, filter]);

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] gap-6">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div onClick={() => setFilter('all')} className="cursor-pointer group">
          <h2 className="text-3xl font-bold tracking-tight group-hover:text-brand transition-colors">工单运营中台</h2>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            集成工作台 · 当前共有 <span className="text-slate-900 font-bold underline">{tickets.length}</span> 个活跃反馈
            {filter !== 'all' && (
              <span className="text-brand font-bold ml-2"> (已过滤: {filter === 'pending' ? '待受理' : filter === 'processing' ? '处理中' : 'SLA 预警'})</span>
            )}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <button 
            onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')}
            className={`px-4 py-2 rounded-xl border transition-all ${filter === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm ring-1 ring-amber-200' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
          >
             <div className="text-[9px] font-bold uppercase">待受理</div>
             <div className="text-lg font-bold">{stats.pending}</div>
          </button>
          <button 
            onClick={() => setFilter(filter === 'processing' ? 'all' : 'processing')}
            className={`px-4 py-2 rounded-xl border transition-all ${filter === 'processing' ? 'bg-brand/10 border-brand/20 text-brand shadow-sm ring-1 ring-brand/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
          >
             <div className="text-[9px] font-bold uppercase">处理中</div>
             <div className="text-lg font-bold">{stats.processing}</div>
          </button>
          <button 
            onClick={() => setFilter(filter === 'sla' ? 'all' : 'sla')}
            className={`px-4 py-2 rounded-xl border transition-all ${filter === 'sla' ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm ring-1 ring-rose-200' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
          >
             <div className="text-[9px] font-bold uppercase">SLA 预警</div>
             <div className="text-lg font-bold">{stats.sla}</div>
          </button>
        </div>
      </header>
      
      <div className={`flex-1 flex gap-6 min-h-0 ${selectedId ? 'flex-row' : 'flex-col'}`}>
        {/* List Section */}
        <section className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${selectedId ? 'w-1/3' : 'w-full'}`}>
           <div className="p-4 border-b border-slate-50 flex flex-wrap gap-3 bg-slate-50/50">
             <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" className="w-full bg-white px-10 py-1.5 rounded-lg text-xs border border-slate-200" placeholder="搜索..." />
             </div>
             {!selectedId && (
               <>
                 <select className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500">
                    <option>全部优先级</option>
                 </select>
                 <button className="btn-primary py-1.5 px-4 text-xs">导出报表</button>
               </>
             )}
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar">
             <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 sticky top-0 z-10 text-slate-400 uppercase text-[9px] font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">工单/标题</th>
                    {!selectedId && (
                      <>
                        <th className="px-4 py-3">类型/优先级</th>
                        <th className="px-4 py-3">提交人</th>
                        <th className="px-4 py-3">状态</th>
                      </>
                    )}
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filteredTickets.map(t => (
                     <tr key={t.id} 
                      onClick={() => onSelect(t.id)}
                      className={`cursor-pointer transition-colors ${selectedId === t.id ? 'bg-brand/5' : 'hover:bg-slate-50'}`}>
                       <td className="px-4 py-3">
                         <div className="font-mono text-[10px] text-slate-400">{t.id}</div>
                         <div className="font-bold truncate max-w-[200px]">{t.title}</div>
                       </td>
                       {!selectedId && (
                         <>
                           <td className="px-4 py-3">
                             <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${t.priority === 'high' ? 'bg-rose-500' : 'bg-brand'}`} />
                                <span className="font-medium uppercase">{t.type} · {t.priority}</span>
                             </div>
                           </td>
                           <td className="px-4 py-3 text-slate-400">{t.creator}</td>
                           <td className="px-4 py-3">
                             <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold uppercase">{t.status}</span>
                           </td>
                         </>
                       )}
                       <td className="px-4 py-3 text-right">
                         <ChevronRight className={`inline w-4 h-4 text-slate-300 transition-transform ${selectedId === t.id ? 'rotate-180 text-brand' : ''}`} />
                       </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </section>

        {/* Detail Section */}
        <AnimatePresence>
          {selectedTicket && (
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col"
            >
              <header className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <button onClick={() => onSelect(null)} className="p-1.5 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                     <X className="w-4 h-4 text-slate-400" />
                   </button>
                   <div>
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedTicket.id}</div>
                     <h3 className="text-sm font-bold truncate max-w-sm">{selectedTicket.title}</h3>
                   </div>
                 </div>
                 <div className="flex gap-2 relative">
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-3 py-1.5 text-[11px] font-bold border rounded-lg transition-colors ${isEditing ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 hover:bg-slate-100'}`}
                    >
                      {isEditing ? '取消修改' : '编辑详情'}
                    </button>
                    {!isEditing && (
                      <>
                        <div className="relative">
                          <button 
                            onClick={() => setShowTransferList(!showTransferList)}
                            className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 rounded-lg hover:bg-white text-slate-600"
                          >
                            转交
                          </button>
                          {showTransferList && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                              {['王经理 (研发)', '李主管 (生产)', '赵全 (测试)'].map(user => (
                                <button 
                                  key={user}
                                  onClick={() => {
                                    if(selectedTicket) onUpdate({...selectedTicket, assignee: user, status: 'processing'});
                                    setShowTransferList(false);
                                  }}
                                  className="w-full px-4 py-2 text-left text-[11px] text-slate-600 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50"
                                >
                                  {user}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <button 
                          disabled={selectedTicket.opsType !== 'bug' && selectedTicket.opsType !== 'feature'}
                          onClick={() => setShowSyncModal(true)}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg shadow-md transition-all ${
                            (selectedTicket.opsType === 'bug' || selectedTicket.opsType === 'feature')
                             ? 'bg-brand text-white hover:bg-brand-dark cursor-pointer' 
                             : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          }`}
                        >
                          一键转 B
                        </button>
                      </>
                    )}
                    {isEditing && (
                      <button 
                       onClick={handleSave}
                       className="px-3 py-1.5 text-[11px] font-bold bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700"
                      >
                        保存修改
                      </button>
                    )}
                 </div>
              </header>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                 <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-6">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 flex justify-between items-center">
                            <span>问题详述</span>
                            {isEditing && <span className="text-[9px] text-brand lowercase">编辑模式</span>}
                          </h4>
                          {isEditing ? (
                            <div className="space-y-4">
                               <div className="space-y-1">
                                 <label className="text-[9px] font-bold text-slate-400 uppercase">工单标题</label>
                                 <input 
                                   value={editTitle}
                                   onChange={e => setEditTitle(e.target.value)}
                                   className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand outline-none" 
                                 />
                               </div>
                               <div className="space-y-1">
                                 <label className="text-[9px] font-bold text-slate-400 uppercase">详情说明</label>
                                 <textarea 
                                   rows={4}
                                   value={editDesc}
                                   onChange={e => setEditDesc(e.target.value)}
                                   className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand outline-none" 
                                 />
                               </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl italic">"{selectedTicket.description}"</p>
                          )}
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">自动采集信息</h4>
                          <div className="grid grid-cols-2 gap-3">
                             {selectedTicket.context && Object.entries(selectedTicket.context).map(([k, v]) => (
                               <div key={k} className="p-3 border border-slate-100 rounded-xl bg-white">
                                  <div className="text-[9px] font-bold text-slate-300 uppercase">{k}</div>
                                  <div className="text-[11px] font-bold truncate">{v}</div>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-4">
                         <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">协作记录</h4>
                         <div className="space-y-4">
                            <div className="flex gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold uppercase">U</div>
                               <div className="flex-1 space-y-1">
                                  <div className="text-xs font-bold">张三 <span className="text-slate-300 font-normal">提交于 {selectedTicket.createdAt}</span></div>
                                  <div className="text-xs text-slate-500">发起了原始反馈。</div>
                               </div>
                            </div>
                         </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="p-4 bg-slate-50 rounded-2xl space-y-4 border border-slate-100/50">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">属性配置</h4>
                          <div className="space-y-3">
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-400">优先级</span>
                               {isEditing ? (
                                 <select 
                                   value={editPriority}
                                   onChange={e => setEditPriority(e.target.value as Priority)}
                                   className="bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold"
                                 >
                                   <option value="low">LOW</option>
                                   <option value="medium">MEDIUM</option>
                                   <option value="high">HIGH</option>
                                   <option value="urgent">URGENT</option>
                                 </select>
                               ) : (
                                 <span className="font-bold text-rose-500 uppercase">{selectedTicket.priority}</span>
                               )}
                             </div>
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-400">运营配置</span>
                               {isEditing ? (
                                 <select 
                                   value={editOpsType}
                                   onChange={e => setEditOpsType(e.target.value as OpsType)}
                                   className="bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold"
                                 >
                                   <option value="none">未配置</option>
                                   <option value="bug">BUG/缺陷</option>
                                   <option value="feature">FEATURE/需求</option>
                                   <option value="task">TASK/通用任务</option>
                                 </select>
                               ) : (
                                 <span className={`font-bold uppercase ${selectedTicket.opsType === 'bug' ? 'text-rose-500' : selectedTicket.opsType === 'feature' ? 'text-brand' : 'text-slate-500'}`}>
                                   {selectedTicket.opsType === 'bug' ? 'BUG 缺陷' : selectedTicket.opsType === 'feature' ? '产品需求' : selectedTicket.opsType === 'task' ? '运营任务' : '未配置'}
                                 </span>
                               )}
                             </div>
                             <div className="flex justify-between items-center text-xs">
                               <span className="text-slate-400">业务类型</span>
                               {isEditing ? (
                                 <select 
                                   value={editType}
                                   onChange={e => setEditType(e.target.value as TicketType)}
                                   className="bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold"
                                 >
                                   <option value="error">ERROR</option>
                                   <option value="question">QUESTION</option>
                                   <option value="suggestion">SUGGESTION</option>
                                 </select>
                               ) : (
                                 <span className="font-bold uppercase">{selectedTicket.type}</span>
                                )}
                             </div>
                             <div className="flex justify-between text-xs"><span className="text-slate-400">状态</span><span className="font-bold uppercase">{selectedTicket.status}</span></div>
                             <div className="flex justify-between text-xs"><span className="text-slate-400">排队号</span><span className="font-bold">#2881</span></div>
                          </div>
                       </div>
                       <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10 space-y-3">
                          <h4 className="text-[10px] font-bold text-brand uppercase tracking-widest">系统 B 联动状态</h4>
                          {selectedTicket.associatedBId ? (
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-bold text-brand">{selectedTicket.associatedBId}</span>
                               <ExternalLink className="w-3 h-3 text-brand" />
                            </div>
                          ) : (
                            <button className="w-full py-2 bg-white text-brand text-[10px] font-bold uppercase rounded-lg border border-brand/20 shadow-sm">未关联 · 点击建立 B 系统单</button>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
              <footer className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                 <input className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand" placeholder="内部留言或回复用户..." />
                 <button className="btn-primary py-2 px-5 text-sm">回复</button>
              </footer>

              {/* Sync Modal */}
              {showSyncModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
                   <motion.div 
                     initial={{ scale: 0.9, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     className="bg-white w-full max-w-md rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100"
                   >
                     <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                       <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                         <h4 className="font-bold text-slate-800 text-lg tracking-tight">一键同步至 B 系统</h4>
                       </div>
                       <button onClick={() => setShowSyncModal(false)} className="hover:bg-slate-200 p-1.5 rounded-full transition-all border border-transparent active:scale-90"><X className="w-5 h-5 text-slate-400" /></button>
                     </div>
                     <div className="p-8 space-y-5">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">所属业务线</label>
                         <select 
                           value={syncForm.businessLine}
                           onChange={e => setSyncForm({...syncForm, businessLine: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-brand transition-all outline-none appearance-none cursor-pointer"
                         >
                           <option>核心金融业务线</option>
                           <option>数字化转型业务线</option>
                           <option>海外支付业务线</option>
                         </select>
                       </div>
                       <div className="grid grid-cols-1 gap-5">
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">所属产品域</label>
                           <input 
                             value={syncForm.product}
                             onChange={e => setSyncForm({...syncForm, product: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-brand transition-all outline-none"
                             placeholder="例如：信贷管理系统"
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">目标系统组件</label>
                           <input 
                             value={syncForm.system}
                             onChange={e => setSyncForm({...syncForm, system: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-brand transition-all outline-none"
                             placeholder="例如：审批组件 v2.0"
                           />
                         </div>
                       </div>
                       <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl flex gap-3 items-start mt-2">
                         <AlertCircle className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                         <p className="text-xs text-brand/80 leading-relaxed font-medium">注意：同步后该工单将处于 "已转发" 状态。系统 B 将自动创建对应单据，并与此工单建立实时双向状态关联。</p>
                       </div>
                     </div>
                     <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                       <button onClick={() => setShowSyncModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-white rounded-2xl transition-all active:scale-95 border border-transparent hover:border-slate-200">取消</button>
                       <button onClick={handleSyncToB} className="flex-1 py-3 text-sm font-bold bg-brand text-white rounded-2xl shadow-lg shadow-brand/30 hover:bg-brand-dark transition-all active:scale-95">确认同步并转发</button>
                     </div>
                   </motion.div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// System B Mockup
function SystemBView({ tickets, selectedId, onSelect }: { 
  tickets: Ticket[], 
  selectedId: string | null,
  onSelect: (id: string | null) => void
}) {
  const [bTab, setBTab] = useState<'products' | 'defects'>('defects');
  const [showDetail, setShowDetail] = useState(false);

  // Filter tickets that have been synced to B and match the current tab
  const bTickets = useMemo(() => {
    return tickets.filter(t => {
      if (!t.associatedBId) return false;
      if (bTab === 'defects') return t.opsType === 'bug';
      if (bTab === 'products') return t.opsType === 'feature';
      return false;
    });
  }, [tickets, bTab]);
  
  // Find the ticket being viewed in detail
  const currentTicket = useMemo(() => bTickets.find(t => t.id === selectedId), [bTickets, selectedId]);

  useEffect(() => {
    // If we have a selected ticket that is associated with B, default to showing its detail
    if (currentTicket) {
      setShowDetail(true);
    }
  }, [currentTicket]);

  const sidebarItems = [
    { id: 'products', label: '产品管理', icon: <Database className="w-5 h-5" /> },
    { id: 'defects', label: '缺陷管理', icon: <TicketIcon className="w-5 h-5" /> },
  ];

  const handleRowClick = (id: string) => {
    onSelect(id);
    setShowDetail(true);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden min-h-[600px] flex flex-col text-slate-300">
       <div className="bg-slate-950 px-4 py-2 flex items-center gap-4 text-[10px] text-slate-600 uppercase tracking-widest border-b border-white/5">
         <div className="flex gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
           <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
           <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
         </div>
         <span className="ml-2">系统 B · 企业级研发协作平台</span>
       </div>

       <div className="flex flex-1 overflow-hidden">
         <aside className="w-20 lg:w-48 bg-slate-950 border-r border-white/5 p-4 flex flex-col gap-6" id="b-sidebar">
           <div className="w-10 h-10 lg:w-full lg:h-auto aspect-square bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">B</div>
           <nav className="flex flex-col gap-1 items-center lg:items-stretch">
             {sidebarItems.map((item) => (
               <button 
                 key={item.id} 
                 id={`b-nav-${item.id}`}
                 onClick={() => { setBTab(item.id as any); if(item.id === 'defects') setShowDetail(false); }}
                 className={`w-full p-3 lg:px-4 lg:py-3 rounded-xl flex items-center gap-3 transition-all active:scale-95 ${bTab === item.id ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
               >
                 <div className="shrink-0">{item.icon}</div>
                 <span className="hidden lg:block text-xs uppercase tracking-wider">{item.label}</span>
               </button>
             ))}
             <div className="mt-8 pt-8 border-t border-white/5">
               <button className="w-full p-3 lg:px-4 lg:py-3 rounded-xl flex items-center gap-3 text-slate-600 hover:text-slate-400 transition-colors">
                 <Settings className="w-5 h-5 shrink-0" />
                 <span className="hidden lg:block text-xs uppercase tracking-wider">系统设置</span>
               </button>
             </div>
           </nav>
         </aside>

         <main className="flex-1 flex flex-col overflow-hidden relative">
            <AnimatePresence mode="wait">
              {!showDetail ? (
                <motion.div 
                  key={`${bTab}-list`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 p-8 overflow-y-auto no-scrollbar"
                >
                  <header className="mb-10 flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        {bTab === 'defects' ? '所有缺陷任务' : '所有需求单据'}
                        <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest font-normal">研发中台同步</span>
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">
                        当前项目共有 <span className="text-white font-bold">{bTickets.length}</span> 个从中台同步的{bTab === 'defects' ? '缺陷' : '需求'}
                      </p>
                    </div>
                    <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-500 transition-all active:scale-95">
                      新建{bTab === 'defects' ? '缺陷单' : '需求单'}
                    </button>
                  </header>

                  <div className="bg-slate-800/20 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-950/50 text-slate-600 uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">描述</th>
                          <th className="px-6 py-4">优先级</th>
                          <th className="px-6 py-4">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bTickets.length > 0 ? bTickets.map((t) => (
                          <tr 
                            key={t.id}
                            onClick={() => handleRowClick(t.id)}
                            className={`hover:bg-white/[0.05] cursor-pointer transition-colors group ${selectedId === t.id ? 'bg-white/[0.03]' : ''}`}
                          >
                            <td className="px-6 py-4 font-mono text-indigo-400 group-hover:text-indigo-300">{t.associatedBId}</td>
                            <td className="px-6 py-4 text-slate-300 font-medium">
                              <div className="truncate max-w-sm">{t.title}</div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`text-xs font-bold uppercase tracking-tight ${t.priority === 'urgent' ? 'text-rose-400' : 'text-amber-400'}`}>
                                 {t.priority === 'urgent' ? '极其紧急' : '紧急'}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                               <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[9px] uppercase tracking-wider">进行中</span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-20 text-center text-slate-600">
                               <Database className="w-12 h-12 mx-auto mb-4 opacity-5" />
                               <div className="text-sm">暂无自中台转交的内容</div>
                            </td>
                          </tr>
                        )}
                        {/* Fake rows for visual density */}
                        {[...Array(Math.max(0, 5 - bTickets.length))].map((_, i) => (
                          <tr key={`fake-${i}`} className="opacity-10 grayscale pointer-events-none">
                            <td className="px-6 py-4 font-mono">{bTab === 'defects' ? 'BUG' : 'REQ'}-500{i+50}</td>
                            <td className="px-6 py-4 truncate">示例系统占位任务描述文本...</td>
                            <td className="px-6 py-4">P3</td>
                            <td className="px-6 py-4">已完成</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : showDetail && currentTicket ? (
                <motion.div 
                  key="detail"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="flex-1 p-8 overflow-y-auto no-scrollbar"
                >
                  <header className="mb-10 flex flex-col lg:flex-row justify-between lg:items-end gap-4" id="b-detail-header">
                    <div>
                      <div className="flex items-center gap-3 text-2xl font-bold text-white">
                        <button 
                          onClick={() => { setShowDetail(false); onSelect(null); }}
                          className="hover:bg-white/5 p-1 rounded-lg transition-colors border border-transparent hover:border-white/10 mr-2 active:scale-90"
                        >
                          <ChevronRight className="w-6 h-6 rotate-180 text-slate-600" />
                        </button>
                        <span>{currentTicket.associatedBId}</span>
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] uppercase tracking-wider leading-none">
                          {bTab === 'defects' ? '正在修复' : '需求评审中'}
                        </span>
                      </div>
                      <h3 className="text-slate-400 mt-2 font-medium ml-11">{currentTicket.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-5 py-2 bg-slate-800 rounded-lg text-sm font-bold border border-white/10 hover:bg-slate-700 transition-all active:scale-95 hover:border-white/20">
                        {bTab === 'defects' ? '分发研发任务' : '指派负责人'}
                      </button>
                      <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all active:scale-75 active:opacity-0 active:translate-y-4">
                        {bTab === 'defects' ? '解决并同步 A 系统' : '完成评审同步 A'}
                      </button>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section className="space-y-4">
                          <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">问题详情 (从中台透传)</h4>
                          <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 space-y-4">
                              <p className="text-sm leading-relaxed text-slate-300">{currentTicket.description}</p>
                              <div className="flex gap-4">
                                <button className="flex-1 aspect-video bg-slate-900 rounded-lg border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-700 uppercase hover:border-white/20 transition-colors">附件_截图1.PNG</button>
                                <button className="flex-1 aspect-video bg-slate-900 rounded-lg border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-700 uppercase hover:border-white/20 transition-colors">崩溃日志.LOG</button>
                              </div>
                          </div>
                        </section>

                        <section className="space-y-4">
                          <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">协作讨论</h4>
                          <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 space-y-5">
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-lg shadow-indigo-600/20">DE</div>
                                <div className="flex-1">
                                  <div className="text-xs font-bold text-white flex justify-between">
                                    <span>研发负责人 (张三)</span>
                                    <span className="text-slate-600 font-normal">刚刚</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-1.5 leading-relaxed italic">已经收到中台转交的单据，业务线信息已确认，目前正在定位问题成因。</div>
                                  <div className="mt-3 flex gap-2">
                                     <button className="text-[10px] text-indigo-400 font-bold hover:underline active:opacity-50">点赞 (2)</button>
                                     <button className="text-[10px] text-slate-600 font-bold hover:underline active:opacity-50">回复</button>
                                  </div>
                                </div>
                            </div>
                          </div>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <div className="bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-2xl space-y-4 group hover:bg-brand/10 transition-colors">
                          <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> 关联 A 系统工单
                          </h4>
                          <div className="space-y-1">
                            <div className="text-xs text-slate-500 font-medium">原始单号</div>
                            <div className="text-white font-bold text-lg flex items-center justify-between">
                              {currentTicket.id}
                              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all active:scale-90"><ExternalLink className="w-4 h-4 text-indigo-400" /></button>
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-500 leading-normal uppercase tracking-wide opacity-80">
                            运营人员: {currentTicket.assignee || '未指派'}<br/>
                            同步时间: {new Date().toLocaleDateString()}
                          </div>
                        </div>

                        {currentTicket.bSystemInfo && (
                          <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 space-y-4">
                            <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">业务归属</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500">业务线</span>
                                <span className="text-white font-bold">{currentTicket.bSystemInfo.businessLine}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500">产品域</span>
                                <span className="text-white font-bold">{currentTicket.bSystemInfo.product}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500">系统组件</span>
                                <span className="text-white font-bold">{currentTicket.bSystemInfo.system}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 space-y-4">
                          <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">关键属性</h4>
                          <div className="space-y-3">
                            <button className="w-full flex justify-between text-xs font-medium group hover:bg-white/5 p-1 -m-1 rounded transition-colors" key="prio">
                              <span className="text-slate-500 group-hover:text-slate-400">优先级</span>
                              <span className="text-rose-400 uppercase font-bold tracking-tight">P1 - {currentTicket.priority === 'urgent' ? '极其紧急' : '紧急'}</span>
                            </button>
                            <button className="w-full flex justify-between text-xs font-medium group hover:bg-white/5 p-1 -m-1 rounded transition-colors" key="assign">
                              <span className="text-slate-500 group-hover:text-slate-400">指派给</span>
                              <span className="text-white">{bTab === 'defects' ? '研发工程师' : '产品经理'} (P-001)</span>
                            </button>
                            <button className="w-full flex justify-between text-xs font-medium group hover:bg-white/5 p-1 -m-1 rounded transition-colors" key="time">
                              <span className="text-slate-500 group-hover:text-slate-400">{bTab === 'defects' ? '预计修复时间' : '排期开始时间'}</span>
                              <span className="text-white">2026-04-21 18:00</span>
                            </button>
                          </div>
                        </div>
                    </aside>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
         </main>
       </div>
    </div>
  );
}

