const { useState: useStateB, useMemo: useMemoB, useEffect: useEffectB } = React;

function SystemBView({ tickets, selectedId, onSelect }) {
  const [tab, setTab] = useStateB('defects');
  const [showDetail, setShowDetail] = useStateB(false);

  const bTickets = useMemoB(() => tickets.filter(t => {
    if (!t.associatedBId) return false;
    if (tab === 'defects') return t.opsType === 'bug';
    if (tab === 'requirements') return t.opsType === 'feature';
    return false;
  }), [tickets, tab]);

  const current = useMemoB(() => bTickets.find(t => t.id === selectedId), [bTickets, selectedId]);

  useEffectB(() => { if (current) setShowDetail(true); }, [current]);

  const navItems = [
    { id: 'requirements', label: '需求管理', icon: 'board' },
    { id: 'defects', label: '缺陷管理', icon: 'bug' },
    { id: 'iteration', label: '迭代计划', icon: 'layout' },
    { id: 'stats', label: '统计分析', icon: 'db' }
  ];

  return (
    <div className="b-device">
      <div className="b-topbar">
        <span className="dot"></span><span className="dot"></span><span className="dot"></span>
        <span>系统 B · 企业级研发协作平台</span>
        <span style={{ marginLeft: 'auto', color: '#94a3b8' }}>PM · 张工</span>
      </div>
      <div className="b-layout">
        <aside className="b-sidebar">
          <div className="b-logo">B</div>
          <nav>
            {navItems.map(it => (
              <button key={it.id} className={`b-nav-item ${tab === it.id ? 'active' : ''}`}
                onClick={() => { setTab(it.id); setShowDetail(false); onSelect(null); }}>
                <Icon name={it.icon} size={14} />
                <span>{it.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button className="b-nav-item">
              <Icon name="settings" size={14} />
              <span>系统设置</span>
            </button>
          </div>
        </aside>
        <main className="b-content">
          {!showDetail ? (
            <div className="fade-in">
              <div className="b-content-header">
                <div>
                  <h3>
                    {tab === 'defects' ? '所有缺陷任务' : tab === 'requirements' ? '所有需求单据' : tab === 'iteration' ? '迭代计划' : '统计分析'}
                    <span className="count-tag">研发中台同步</span>
                  </h3>
                  <p>当前项目共有 <b style={{ color: '#0f172a' }}>{bTickets.length}</b> 个从运营中台同步的{tab === 'defects' ? '缺陷' : '需求'}</p>
                </div>
                <button className="b-btn">新建{tab === 'defects' ? '缺陷单' : '需求单'}</button>
              </div>
              {(tab === 'defects' || tab === 'requirements') ? (
                <div className="b-table-wrap">
                  <table className="b-table">
                    <thead>
                      <tr><th>ID</th><th>描述</th><th>业务归属</th><th>优先级</th><th>状态</th><th>来源</th></tr>
                    </thead>
                    <tbody>
                      {bTickets.length > 0 ? bTickets.map(t => (
                        <tr key={t.id} className={`clickable ${selectedId === t.id ? 'active' : ''}`} onClick={() => { onSelect(t.id); setShowDetail(true); }}>
                          <td><span className="b-id">{t.associatedBId}</span></td>
                          <td style={{ color: '#0f172a', fontWeight: 600 }}><div className="truncate" style={{ maxWidth: 260 }}>{t.title}</div></td>
                          <td style={{ color: '#64748b', fontSize: 12 }}>{t.bSystemInfo ? t.bSystemInfo.product : '—'}</td>
                          <td><span className={`b-prio ${t.priority}`} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{t.priority === 'urgent' ? 'P0' : t.priority === 'high' ? 'P1' : 'P2'} · {t.priority}</span></td>
                          <td><span className={`b-pill ${tab === 'defects' ? 'progress' : 'review'}`}>{tab === 'defects' ? '修复中' : '评审中'}</span></td>
                          <td><span className="mono" style={{ color: '#94a3b8', fontSize: 11 }}>← {t.id}</span></td>
                        </tr>
                      )) : (
                        <tr><td colSpan={6} style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
                          <Icon name="db" size={40} />
                          <div style={{ marginTop: 14, fontSize: 13, color: '#64748b' }}>暂无自中台转交的内容</div>
                          <div style={{ marginTop: 4, fontSize: 11, color: '#cbd5e1' }}>在运营中台完成「一键转 B」后，单据会在此展示</div>
                        </td></tr>
                      )}
                      {[...Array(Math.max(0, 4 - bTickets.length))].map((_, i) => (
                        <tr key={`placeholder-${i}`} style={{ opacity: 0.25, pointerEvents: 'none' }}>
                          <td><span className="b-id">{tab === 'defects' ? 'BUG' : 'REQ'}-{5100 + i}</span></td>
                          <td style={{ color: '#94a3b8' }}>示例系统占位记录…</td>
                          <td style={{ color: '#94a3b8', fontSize: 12 }}>示例系统</td>
                          <td style={{ color: '#94a3b8' }}>P3 · low</td>
                          <td><span className="b-pill done">已完成</span></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="b-card" style={{ padding: 50, textAlign: 'center', color: '#94a3b8' }}>
                  <Icon name={tab === 'iteration' ? 'layout' : 'db'} size={36} />
                  <div style={{ marginTop: 12, fontSize: 13, color: '#64748b' }}>此模块已接入中台，但与主联动无关。</div>
                </div>
              )}
            </div>
          ) : current ? (
            <div className="fade-in">
              <div className="b-detail-header">
                <div>
                  <div className="title-row">
                    <button className="b-back" onClick={() => { setShowDetail(false); onSelect(null); }}>
                      <Icon name="chevron" size={16} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    <span>{current.associatedBId}</span>
                    <span className={`b-pill ${tab === 'defects' ? 'progress' : 'review'}`}>
                      {tab === 'defects' ? '修复中' : '需求评审中'}
                    </span>
                  </div>
                  <div className="subtitle">{current.title}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="b-btn ghost">{tab === 'defects' ? '分发研发' : '指派负责人'}</button>
                  <button className="b-btn">{tab === 'defects' ? '解决并同步 A' : '完成评审并同步'}</button>
                </div>
              </div>
              <div className="b-detail-grid">
                <div>
                  <div className="b-card" style={{ marginBottom: 18 }}>
                    <h4>问题详情 · 自中台透传</h4>
                    <p>{current.description}</p>
                    <div className="b-attach-row">
                      <div className="b-attach">附件 _ 截图1.PNG</div>
                      <div className="b-attach">崩溃日志 _ CONSOLE.LOG</div>
                    </div>
                  </div>
                  <div className="b-card">
                    <h4>协作讨论</h4>
                    <div className="b-comment">
                      <div className="b-avatar">DE</div>
                      <div style={{ flex: 1 }}>
                        <div className="meta"><span>研发负责人 · 王五</span><span className="time">刚刚</span></div>
                        <div className="text">已收到中台转交单据，业务线与组件信息已确认。目前正在定位问题成因，初步判断为后端幂等性问题。</div>
                      </div>
                    </div>
                    <div className="b-comment">
                      <div className="b-avatar" style={{ background: '#10b981' }}>PM</div>
                      <div style={{ flex: 1 }}>
                        <div className="meta"><span>产品经理 · 赵六</span><span className="time">5 分钟前</span></div>
                        <div className="text">已排期本周修复，打上 Sprint-042 标签。预计 04-21 18:00 前完成。</div>
                      </div>
                    </div>
                  </div>
                </div>
                <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="b-card b-source-card">
                    <h4><Icon name="check" size={11} /> 关联 A 系统工单</h4>
                    <div className="src-id">
                      {current.id}
                      <button className="b-back" style={{ width: 26, height: 26 }}><Icon name="external" size={13} /></button>
                    </div>
                    <div className="src-meta">
                      运营人员：{current.assignee || '未指派'}<br/>
                      同步时间：{current.updatedAt}
                    </div>
                  </div>
                  {current.bSystemInfo && (
                    <div className="b-card">
                      <h4>业务归属</h4>
                      <div className="b-attr-row"><span className="k">业务线</span><span className="v">{current.bSystemInfo.businessLine}</span></div>
                      <div className="b-attr-row"><span className="k">产品域</span><span className="v">{current.bSystemInfo.product}</span></div>
                      <div className="b-attr-row"><span className="k">系统组件</span><span className="v">{current.bSystemInfo.system}</span></div>
                    </div>
                  )}
                  <div className="b-card">
                    <h4>关键属性</h4>
                    <div className="b-attr-row"><span className="k">优先级</span><span className={`v b-prio ${current.priority}`}>{current.priority === 'urgent' ? 'P0 - 极紧急' : current.priority === 'high' ? 'P1 - 严重' : 'P2 - 一般'}</span></div>
                    <div className="b-attr-row"><span className="k">指派给</span><span className="v">{tab === 'defects' ? '研发工程师 · 王五' : '产品经理 · 赵六'}</span></div>
                    <div className="b-attr-row"><span className="k">{tab === 'defects' ? '预计修复' : '排期开始'}</span><span className="v">2026-04-21 18:00</span></div>
                    <div className="b-attr-row"><span className="k">受影响用户</span><span className="v">3 人 · 3 工单</span></div>
                  </div>
                </aside>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

window.SystemBView = SystemBView;
