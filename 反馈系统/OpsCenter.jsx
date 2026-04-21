const { useState: useStateO, useMemo: useMemoO, useEffect: useEffectO, useRef: useRefO } = React;

function OpsCenter({ tickets, selectedId, onSelect, onUpdate, toast }) {
  const [filter, setFilter] = useStateO('all');
  const [search, setSearch] = useStateO('');
  const [isEditing, setIsEditing] = useStateO(false);
  const [showTransfer, setShowTransfer] = useStateO(false);
  const [showSync, setShowSync] = useStateO(false);
  const selected = useMemoO(() => tickets.find(t => t.id === selectedId), [tickets, selectedId]);

  const [edit, setEdit] = useStateO({ title: '', description: '', type: 'error', opsType: 'none', priority: 'medium' });
  const [syncForm, setSyncForm] = useStateO({ businessLine: '核心金融业务线', product: '审核系统', system: '审批流组件 v2.1', opsType: 'bug', priority: 'high' });
  const [replyText, setReplyText] = useStateO('');

  useEffectO(() => {
    if (selected) {
      setEdit({ title: selected.title, description: selected.description, type: selected.type, opsType: selected.opsType || 'none', priority: selected.priority });
      setIsEditing(false);
      setShowTransfer(false);
      setShowSync(false);
      setReplyText('');
    }
  }, [selectedId]);

  const stats = useMemoO(() => ({
    all: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    processing: tickets.filter(t => t.status === 'forwarded' || t.status === 'processing').length,
    sla: tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length
  }), [tickets]);

  const filtered = useMemoO(() => {
    let r = tickets;
    if (filter === 'pending') r = r.filter(t => t.status === 'pending');
    if (filter === 'processing') r = r.filter(t => t.status === 'forwarded' || t.status === 'processing');
    if (filter === 'sla') r = r.filter(t => t.priority === 'high' || t.priority === 'urgent');
    if (search) r = r.filter(t => t.title.includes(search) || t.id.includes(search) || t.creator.includes(search));
    return r;
  }, [tickets, filter, search]);

  const handleSave = () => {
    if (!selected) return;
    onUpdate({ ...selected, ...edit, updatedAt: window.fmt.now(),
      activity: [...(selected.activity||[]), { who: '李四', when: new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}), what: '编辑了工单详情', kind: 'edit' }]
    });
    setIsEditing(false);
    toast('已保存');
  };

  const handleTransfer = (user) => {
    if (!selected) return;
    onUpdate({ ...selected, assignee: user, status: 'processing', updatedAt: window.fmt.now(),
      activity: [...(selected.activity||[]), { who: '李四', when: new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}), what: `转交给 ${user}`, kind: 'assign' }]
    });
    setShowTransfer(false);
    toast(`已转交 → ${user}`);
  };

  const handleSync = () => {
    if (!selected) return;
    const prefix = syncForm.opsType === 'bug' ? 'BUG' : 'REQ';
    const bId = `${prefix}-${Math.floor(5000 + Math.random() * 999)}`;
    onUpdate({ ...selected, associatedBId: bId, opsType: syncForm.opsType, priority: syncForm.priority, status: 'forwarded',
      bSystemInfo: { businessLine: syncForm.businessLine, product: syncForm.product, system: syncForm.system },
      updatedAt: window.fmt.now(),
      activity: [...(selected.activity||[]), { who: '李四', when: new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}), what: `一键转 B，关联 ${bId}`, kind: 'sync' }]
    });
    setShowSync(false);
    toast(`已创建 ${bId} 并与 B 系统双向关联`);
  };

  const handleReply = () => {
    if (!selected || !replyText.trim()) return;
    onUpdate({ ...selected, replyToUser: replyText, updatedAt: window.fmt.now(),
      activity: [...(selected.activity||[]), { who: '李四', when: new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'}), what: `回复用户：${replyText}`, kind: 'reply' }]
    });
    setReplyText('');
    toast('回复已发送给用户');
  };

  return (
    <div>
      <div className="ops-header">
        <div onClick={() => setFilter('all')} style={{ cursor: 'pointer' }}>
          <h2>工单运营中台</h2>
          <p>
            集成运营工作台 · 共 <b style={{ color: '#0f172a' }}>{tickets.length}</b> 条活跃反馈
            {filter !== 'all' && <span style={{ color: '#2563eb', marginLeft: 8, fontWeight: 600 }}>· 已过滤：{filter === 'pending' ? '待受理' : filter === 'processing' ? '处理中' : 'SLA 预警'}</span>}
          </p>
        </div>
        <div className="stat-grid">
          <button className={`stat ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            <div className="label">全部</div>
            <div className="value">{stats.all}<span className="delta">条</span></div>
          </button>
          <button className={`stat amber ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')}>
            <div className="label">待受理</div>
            <div className="value">{stats.pending}<span className="delta">条</span></div>
          </button>
          <button className={`stat ${filter === 'processing' ? 'active' : ''}`} onClick={() => setFilter(filter === 'processing' ? 'all' : 'processing')}>
            <div className="label">处理中</div>
            <div className="value">{stats.processing}<span className="delta">条</span></div>
          </button>
          <button className={`stat rose ${filter === 'sla' ? 'active' : ''}`} onClick={() => setFilter(filter === 'sla' ? 'all' : 'sla')}>
            <div className="label">SLA 预警</div>
            <div className="value">{stats.sla}<span className="delta">条</span></div>
          </button>
        </div>
      </div>

      <div className="ops-body">
        <section className={`ops-list ${selected ? 'compact' : 'full'}`}>
          <div className="list-toolbar">
            <div className="search">
              <Icon name="search" size={13} />
              <input placeholder="搜索工单号 / 标题 / 提交人…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {!selected && <>
              <select><option>全部优先级</option></select>
              <select><option>全部类型</option></select>
              <button className="btn sm">导出报表</button>
            </>}
          </div>
          <div className="list-body">
            <table className="table">
              <thead>
                <tr>
                  <th>工单 / 标题</th>
                  {!selected && <><th>类型 · 优先级</th><th>提交人</th></>}
                  <th>状态</th>
                  <th style={{ textAlign: 'right' }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className={`clickable ${selectedId === t.id ? 'active' : ''}`} onClick={() => onSelect(t.id)}>
                    <td>
                      <div className="mono" style={{ fontSize: 10, color: '#94a3b8' }}>{t.id}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }} className="truncate">{t.title}</div>
                    </td>
                    {!selected && <>
                      <td>
                        <span className={`priority-dot ${t.priority}`}></span>
                        <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>{t.type} · {t.priority}</span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: 12 }}>{t.creator}</td>
                    </>}
                    <td>
                      <span className={`badge ${
                        t.status === 'pending' ? 'slate' :
                        t.status === 'forwarded' ? 'warn' :
                        t.status === 'processing' ? 'brand' :
                        t.status === 'resolved' ? 'ok' : 'slate'
                      }`}>{window.labels.status[t.status]}</span>
                    </td>
                    <td style={{ textAlign: 'right', color: '#cbd5e1' }}>
                      <Icon name="chevron" size={14} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={selected ? 3 : 5} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    暂无匹配工单
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selected && (
          <section className="ops-detail slide-in">
            <div className="detail-header">
              <div className="left">
                <button className="icon-btn" onClick={() => onSelect(null)}><Icon name="x" size={14} /></button>
                <div style={{ minWidth: 0 }}>
                  <div className="id">{selected.id}</div>
                  <h3>{selected.title}</h3>
                </div>
              </div>
              <div className="actions">
                <button className={`btn ghost sm ${isEditing ? 'warn' : ''}`} onClick={() => setIsEditing(!isEditing)} style={isEditing ? { background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' } : {}}>
                  {isEditing ? '取消修改' : <><Icon name="edit" size={11} /> <span style={{marginLeft:4}}>编辑详情</span></>}
                </button>
                {!isEditing && <>
                  <div style={{ position: 'relative' }}>
                    <button className="btn ghost sm" onClick={() => setShowTransfer(!showTransfer)}>转交</button>
                    {showTransfer && (
                      <div className="dropdown">
                        {['王经理 (研发)', '李主管 (生产)', '赵全 (测试)', '客服小美'].map(u => (
                          <button key={u} onClick={() => handleTransfer(u)}>
                            {u}
                            <span className="sub">点击转交此工单</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="btn sm" onClick={() => setShowSync(true)}>
                    <Icon name="external" size={11} /> <span style={{marginLeft:4}}>一键转 B</span>
                  </button>
                </>}
                {isEditing && (
                  <button className="btn success sm" onClick={handleSave}>
                    <Icon name="save" size={11} /> <span style={{marginLeft:4}}>保存修改</span>
                  </button>
                )}
              </div>
            </div>
            <div className="detail-body">
              <div className="detail-grid">
                <div>
                  <div style={{ marginBottom: 24 }}>
                    <div className="sub-h">
                      <span>问题详述</span>
                      {isEditing && <span style={{ color: '#2563eb', fontSize: 9 }}>编辑模式</span>}
                    </div>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div>
                          <label className="field-label">标题</label>
                          <input className="input" value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} />
                        </div>
                        <div>
                          <label className="field-label">详情说明</label>
                          <textarea className="textarea" rows={5} value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} />
                        </div>
                      </div>
                    ) : (
                      <div className="desc-block">{selected.description}</div>
                    )}
                  </div>

                  {selected.context && (
                    <div style={{ marginBottom: 24 }}>
                      <div className="sub-h"><span>自动采集上下文</span></div>
                      <div className="ctx-grid">
                        {Object.entries(selected.context).map(([k, v]) => (
                          <div key={k} className="ctx-cell">
                            <div className="k">{k}</div>
                            <div className="v">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="sub-h"><span>协作记录 · 操作时间线</span></div>
                    <div className="activity">
                      {(selected.activity || []).map((a, i) => (
                        <div key={i} className="activity-item">
                          <div className="who">{a.who} <span className="when">{a.when}</span></div>
                          <div className="what">{a.what}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <aside>
                  <div className="attr-card">
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>属性配置</div>
                    <div className="attr-row">
                      <span className="k">优先级</span>
                      {isEditing ? (
                        <select value={edit.priority} onChange={e => setEdit({ ...edit, priority: e.target.value })}>
                          <option value="low">LOW</option><option value="medium">MEDIUM</option><option value="high">HIGH</option><option value="urgent">URGENT</option>
                        </select>
                      ) : (
                        <span className="v" style={{ color: selected.priority === 'urgent' ? '#dc2626' : selected.priority === 'high' ? '#ea580c' : '#0f172a', textTransform: 'uppercase' }}>{selected.priority}</span>
                      )}
                    </div>
                    <div className="attr-row">
                      <span className="k">运营配置</span>
                      {isEditing ? (
                        <select value={edit.opsType} onChange={e => setEdit({ ...edit, opsType: e.target.value })}>
                          <option value="none">未配置</option><option value="bug">BUG/缺陷</option><option value="feature">FEATURE/需求</option><option value="task">TASK/任务</option>
                        </select>
                      ) : (
                        <span className="v" style={{ color: selected.opsType === 'bug' ? '#dc2626' : selected.opsType === 'feature' ? '#2563eb' : '#64748b' }}>
                          {window.labels.opsType[selected.opsType || 'none']}
                        </span>
                      )}
                    </div>
                    <div className="attr-row">
                      <span className="k">业务类型</span>
                      {isEditing ? (
                        <select value={edit.type} onChange={e => setEdit({ ...edit, type: e.target.value })}>
                          <option value="error">ERROR</option><option value="question">QUESTION</option><option value="suggestion">SUGGESTION</option>
                        </select>
                      ) : (
                        <span className="v" style={{ textTransform: 'uppercase' }}>{selected.type}</span>
                      )}
                    </div>
                    <div className="attr-row"><span className="k">状态</span><span className="v">{window.labels.status[selected.status]}</span></div>
                    <div className="attr-row"><span className="k">负责人</span><span className="v">{selected.assignee || '—'}</span></div>
                    <div className="attr-row"><span className="k">SLA 剩余</span><span className="v" style={{ color: '#ea580c' }}>4h 23m</span></div>
                  </div>

                  {selected.associatedBId ? (
                    <div className="b-link-card">
                      <div className="h"><Icon name="check" size={12} /> 已关联 · 系统 B</div>
                      <div className="bid">
                        {selected.associatedBId}
                        <Icon name="external" size={14} />
                      </div>
                      {selected.bSystemInfo && (
                        <div className="meta">
                          业务线：{selected.bSystemInfo.businessLine}<br/>
                          产品域：{selected.bSystemInfo.product}<br/>
                          组件：{selected.bSystemInfo.system}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="b-link-card empty">
                      <div className="h" style={{ justifyContent: 'center' }}><Icon name="alert" size={12} /> 未关联 B 系统</div>
                      <button className="btn sm" style={{ width: '100%', marginTop: 6 }} onClick={() => setShowSync(true)}>一键建立 B 单</button>
                    </div>
                  )}
                </aside>
              </div>
            </div>
            <div className="detail-footer">
              <input placeholder="回复用户 / 内部备注…" value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply()} />
              <button className="btn ghost sm">内部备注</button>
              <button className="btn sm" onClick={handleReply}>回复用户</button>
            </div>
          </section>
        )}
      </div>

      {showSync && selected && (
        <div className="modal-backdrop" onClick={() => setShowSync(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4><span className="pulse"></span> 一键同步至 B 系统</h4>
              <button className="icon-btn" onClick={() => setShowSync(false)}><Icon name="x" size={14} /></button>
            </div>
            <div className="modal-body">
              <div>
                <label className="field-label">目标类型</label>
                <div className="chip-row">
                  <span className={`chip ${syncForm.opsType === 'feature' ? 'on' : ''}`} onClick={() => setSyncForm({ ...syncForm, opsType: 'feature' })}>💡 需求 (requirement)</span>
                  <span className={`chip ${syncForm.opsType === 'bug' ? 'on' : ''}`} onClick={() => setSyncForm({ ...syncForm, opsType: 'bug' })}>🐞 缺陷 (bug)</span>
                </div>
              </div>
              <div>
                <label className="field-label">所属业务线</label>
                <select className="select" value={syncForm.businessLine} onChange={e => setSyncForm({ ...syncForm, businessLine: e.target.value })}>
                  <option>核心金融业务线</option><option>数字化转型业务线</option><option>海外支付业务线</option>
                </select>
              </div>
              <div className="row">
                <div>
                  <label className="field-label">所属产品域</label>
                  <input className="input" value={syncForm.product} onChange={e => setSyncForm({ ...syncForm, product: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">优先级</label>
                  <select className="select" value={syncForm.priority} onChange={e => setSyncForm({ ...syncForm, priority: e.target.value })}>
                    <option value="urgent">P0 阻塞</option><option value="high">P1 严重</option><option value="medium">P2 一般</option><option value="low">P3 次要</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">目标系统组件</label>
                <input className="input" value={syncForm.system} onChange={e => setSyncForm({ ...syncForm, system: e.target.value })} />
              </div>
              <div>
                <label className="field-label">描述（从工单带入，可编辑）</label>
                <textarea className="textarea" rows={3} defaultValue={`[来自工单 ${selected.id}]\n${selected.description}`} />
              </div>
              <div className="alert">
                <Icon name="alert" size={14} />
                <span>同步后该工单将标记为<b>「已转发」</b>。系统 B 自动创建对应单据，双向状态关联。B 侧任何状态变更将回流至此工单并通知用户。</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn ghost" onClick={() => setShowSync(false)}>取消</button>
              <button className="btn" onClick={handleSync}>确认同步并转发</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.OpsCenter = OpsCenter;
