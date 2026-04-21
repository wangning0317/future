const { useState, useMemo, useEffect, useRef } = React;

// ============ System A View ============
function SystemAView({ tickets, onSubmit, widgetView, setWidgetView, toast }) {
  const [showWidget, setShowWidget] = useState(true);

  return (
    <div className="device">
      <div className="device-topbar">
        <span className="dot r"></span><span className="dot y"></span><span className="dot g"></span>
        <span>系统 A · 一线作业台</span>
        <span style={{ marginLeft: 'auto', color: '#64748b' }}>u_88213 · 张三</span>
      </div>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="brand-row">
            <div className="mark">A</div>
            <div className="name">系统 A</div>
          </div>
          <div className="section-label">工作</div>
          <ul>
            {[
              { label: '我的作业', icon: 'board', active: true },
              { label: '任务池', icon: 'ticket' },
              { label: '数据看板', icon: 'layout' },
              { label: '设置', icon: 'settings' }
            ].map(it => (
              <li key={it.label} className={it.active ? 'active' : ''}>
                <span className="icon"><Icon name={it.icon} size={14} /></span>
                {it.label}
              </li>
            ))}
          </ul>
        </aside>
        <div className="content">
          <div className="content-header">
            <div>
              <h3>我的作业</h3>
              <p>处理本月分配给您的待审核任务 · 共 3 条</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn ghost sm">导出报告</button>
              <button
                className="btn sm"
                onClick={() => { setShowWidget(true); setWidgetView('submit'); }}
              >快速反馈</button>
            </div>
          </div>
          <div className="table-card">
            <table className="table">
              <thead>
                <tr><th>任务ID</th><th>名称</th><th>状态</th><th>截止日期</th><th>处理</th></tr>
              </thead>
              <tbody>
                {[
                  { id: 'T-9001', name: 'XX 批次数据审核', status: '处理中', cls: 'warn', date: '2026-04-21' },
                  { id: 'T-9002', name: 'XX 异常单复核', status: '待开始', cls: 'slate', date: '2026-04-22' },
                  { id: 'T-9003', name: 'XX 月度归档', status: '已完成', cls: 'ok', date: '2026-04-20' }
                ].map(row => (
                  <tr key={row.id}>
                    <td><code className="mono" style={{ fontSize: 11, color: '#64748b' }}>{row.id}</code></td>
                    <td style={{ fontWeight: 600 }}>{row.name}</td>
                    <td><span className={`badge ${row.cls}`}>{row.status}</span></td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>{row.date}</td>
                    <td><a className="hover-link" style={{ fontSize: 12 }}>打开 →</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 22, padding: 14, background: '#fff', border: '1px dashed #e2e8f0', borderRadius: 12, fontSize: 12, color: '#64748b' }}>
            <b style={{ color: '#0f172a' }}>提示：</b> 右下角「反馈入口」浮窗常驻。遇到问题 → 点击 → 选择「提交工单」或「转人工」。
          </div>
        </div>
      </div>

      <div className="fab" onClick={() => setShowWidget(!showWidget)} title="反馈入口">
        {showWidget ? <Icon name="x" size={22} /> : <Icon name="lifebuoy" size={22} />}
        {!showWidget && <div className="red-dot" />}
      </div>

      {showWidget && (
        <div className="widget widget-enter">
          <header>
            {widgetView !== 'menu' && (
              <button className="back" onClick={() => setWidgetView('menu')}>
                <Icon name="chevron" size={16} className="flip" />
                <style>{`.flip { transform: rotate(180deg); }`}</style>
              </button>
            )}
            <h4>
              {widgetView === 'menu' ? '反馈与帮助' :
               widgetView === 'submit' ? '提交新工单' :
               widgetView === 'list' ? '我的工单' :
               widgetView === 'faq' ? '常见问题' : '转人工会话'}
            </h4>
            <button className="close" onClick={() => setShowWidget(false)}><Icon name="x" size={14} /></button>
          </header>
          <div className="body">
            {widgetView === 'menu' && <WidgetMenu setView={setWidgetView} />}
            {widgetView === 'submit' && <TicketForm onSubmit={(t) => { onSubmit(t); toast('工单已提交，运营已收到 →'); }} onCancel={() => setWidgetView('menu')} />}
            {widgetView === 'list' && <UserTicketList tickets={tickets} />}
            {widgetView === 'faq' && <FAQView />}
            {widgetView === 'chat' && <ChatView />}
          </div>
          <div className="footer">TicketHub v1.1 · 反馈中心 · 已为您自动采集上下文</div>
        </div>
      )}
    </div>
  );
}

function WidgetMenu({ setView }) {
  const menus = [
    { id: 'submit', icon: 'plus', title: '提交工单', sub: '报错 / 操作疑问 / 改进建议' },
    { id: 'chat', icon: 'message', title: '转人工会话', sub: '和运营人员实时在线沟通' },
    { id: 'list', icon: 'ticket', title: '我的工单', sub: '查看进度与历史反馈回复' },
    { id: 'faq', icon: 'book', title: '常见问题', sub: '快速自助查找，解决常见痛点' }
  ];
  return (
    <div style={{ padding: '6px 0' }}>
      {menus.map(item => (
        <div key={item.id} className="menu-item" onClick={() => setView(item.id)}>
          <div className="icon"><Icon name={item.icon} size={18} /></div>
          <div className="label">
            <div className="title">{item.title}</div>
            <div className="sub">{item.sub}</div>
          </div>
          <div className="chevron"><Icon name="chevron" size={16} /></div>
        </div>
      ))}
    </div>
  );
}

function TicketForm({ onSubmit, onCancel }) {
  const [type, setType] = useState('error');
  const [title, setTitle] = useState('审核页批量提交报 500');
  const [desc, setDesc] = useState('1. 勾选 20 条记录\n2. 点「批量提交」\n3. 页面弹出 500 错误。');

  const typeOptions = [
    { val: 'error', label: '报错', glyph: '!' },
    { val: 'question', label: '疑问', glyph: '?' },
    { val: 'suggestion', label: '建议', glyph: '★' }
  ];

  const handleSubmit = () => {
    const id = `T${new Date().toISOString().slice(0,10).replace(/-/g,'')}${String(Math.floor(100 + Math.random()*900))}`;
    const ticket = {
      id,
      type,
      title,
      description: desc || '用户快速提交。',
      status: 'pending',
      priority: type === 'error' ? 'high' : 'medium',
      creator: 'u_88213 (张三)',
      createdAt: window.fmt.now(),
      updatedAt: window.fmt.now(),
      context: { userId: 'u_88213', page: '/tasks/review', browser: 'Chrome 126', resolution: '1920×1080' },
      activity: [{ who: '张三', when: new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}), what: '发起了原始反馈', kind: 'create' }]
    };
    onSubmit(ticket);
  };

  return (
    <div className="form">
      <div>
        <label className="field-label">申报类型</label>
        <div className="type-grid">
          {typeOptions.map(opt => (
            <button
              key={opt.val}
              className={`type-btn ${type === opt.val ? 'on' : ''}`}
              onClick={() => setType(opt.val)}
            >
              <span className="glyph">{opt.glyph}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="field-label">标题</label>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="一句话描述核心问题" />
      </div>
      <div>
        <label className="field-label">详细描述</label>
        <textarea className="textarea" rows={4} value={desc} onChange={e => setDesc(e.target.value)} placeholder="请输入复现步骤、期望结果与实际结果..." />
      </div>
      <div className="row">
        <button className="btn ghost sm" style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
          <Icon name="attach" size={12} /> 上传附件
        </button>
        <button className="btn ghost sm" style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
          <Icon name="camera" size={12} /> 截屏当前页
        </button>
      </div>
      <div className="ctx-preview">
        <div className="label">自动采集 · 不可编辑</div>
        用户ID: u_88213 · 页面: /tasks/review<br/>
        Chrome 126 · 1920×1080 · IP 182.xx.xx.xx<br/>
        最近操作: [click] 批量提交 → [xhr] POST /api/review/batch <span style={{color:'#dc2626',fontWeight:600}}>500</span>
      </div>
      <div className="row" style={{ marginTop: 4 }}>
        <button className="btn ghost" onClick={onCancel}>取消</button>
        <button className="btn" onClick={handleSubmit} style={{ flex: 1.6 }}>确认提交并跳转中台</button>
      </div>
    </div>
  );
}

function UserTicketList({ tickets }) {
  const myTickets = tickets.filter(t => t.creator.includes('u_88213')).slice(0, 5);
  const display = myTickets.length > 0 ? myTickets : tickets.slice(0, 4);
  return (
    <div style={{ padding: '4px 0' }}>
      {display.map(t => (
        <div key={t.id} className="user-ticket">
          <div className="top">
            <div className="title">{t.title}</div>
            <span className={`badge ${
              t.status === 'forwarded' ? 'warn' :
              t.status === 'pending' ? 'slate' :
              t.status === 'processing' ? 'warn' :
              t.status === 'resolved' ? 'ok' : 'slate'
            }`}>{window.labels.status[t.status]}</span>
          </div>
          <div className="meta">
            <span className="mono">{t.id}</span>
            <span className="sep">·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="clock" size={10} /> {window.fmt.relTime(t.createdAt)}</span>
            {t.associatedBId && <>
              <span className="sep">·</span>
              <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="external" size={10} /> {t.associatedBId}</span>
            </>}
          </div>
          {t.replyToUser && <div className="reply">💬 运营回复：{t.replyToUser}</div>}
        </div>
      ))}
    </div>
  );
}

function FAQView() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('全部');
  const [openId, setOpenId] = useState(null);
  const cats = ['全部', ...Array.from(new Set(window.FAQ_DATA.map(f => f.cat)))];
  const filtered = window.FAQ_DATA.filter(f =>
    (cat === '全部' || f.cat === cat) &&
    (!search || f.q.includes(search) || f.a.includes(search))
  );
  return (
    <div>
      <div className="faq-search">
        <div className="input-wrap">
          <Icon name="search" size={14} />
          <input className="input" placeholder="搜索问题..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="faq-cats">
        {cats.map(c => (
          <span key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</span>
        ))}
      </div>
      <div className="faq-list">
        {filtered.map(f => (
          <div key={f.id} className={`faq-item ${openId === f.id ? 'open' : ''}`} onClick={() => setOpenId(openId === f.id ? null : f.id)}>
            <div className="q">
              <span>{f.q}</span>
              <Icon name="chevron" size={12} className={openId === f.id ? 'rot' : ''} />
              <style>{`.rot { transform: rotate(90deg); }`}</style>
            </div>
            <div className="a">{f.a}</div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, padding: 24 }}>未找到匹配结果</div>}
      </div>
    </div>
  );
}

function ChatView() {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState([
    { id: 1, sender: 'agent', content: '您好，这里是运营值班室，请问有什么可以帮您？', time: '10:12' },
    { id: 2, sender: 'me', content: '批量提交总是报错，很着急', time: '10:13' },
    { id: 3, sender: 'agent', content: '方便发下截图吗？我帮您排查', time: '10:13' }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  const send = () => {
    if (!input.trim()) return;
    const t = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    setMsgs(m => [...m, { id: Date.now(), sender: 'me', content: input, time: t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { id: Date.now()+1, sender: 'agent', content: '已收到，我正在尝试复现，请稍候。', time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1400);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={scrollRef}>
        {msgs.map(m => (
          <React.Fragment key={m.id}>
            <div className={`msg ${m.sender}`}>{m.content}</div>
            <div className={`msg-time ${m.sender}`}>{m.time}</div>
          </React.Fragment>
        ))}
        {typing && <div className="typing">运营人员正在输入…</div>}
      </div>
      <div className="chat-input">
        <input placeholder="输入消息…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
        <button className="send-btn" onClick={send} disabled={!input.trim()}>
          <Icon name="send" size={15} />
        </button>
      </div>
    </div>
  );
}

window.SystemAView = SystemAView;
