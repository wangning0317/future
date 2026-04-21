// Shared mock data and helpers
window.INITIAL_TICKETS = [
  {
    id: 'T20260420001',
    type: 'error',
    opsType: 'bug',
    title: '审核页批量提交报 500',
    description: '1. 勾选 20 条记录\n2. 点"批量提交"\n3. 页面弹出 500 错误。\n期望：批量成功；实际：后端接口幂等异常。',
    status: 'forwarded',
    priority: 'high',
    creator: 'u_88213 (张三)',
    assignee: '李四 (运营)',
    createdAt: '2026-04-20 10:13:22',
    updatedAt: '2026-04-20 10:35:00',
    associatedBId: 'BUG-5012',
    bSystemInfo: { businessLine: '核心金融业务线', product: '审核系统', system: '审批流组件 v2.1' },
    context: { userId: 'u_88213', page: '/tasks/review', browser: 'Chrome 126', resolution: '1920×1080' },
    replyToUser: '已定位为后端幂等 Bug，已转研发修复。',
    activity: [
      { who: '张三', when: '10:13', what: '发起了原始反馈', kind: 'create' },
      { who: '系统', when: '10:13', what: '自动分类：报错 / 高优先级', kind: 'system' },
      { who: '李四', when: '10:20', what: '运营领取', kind: 'assign' },
      { who: '李四', when: '10:35', what: '一键转 B，关联 BUG-5012', kind: 'sync' }
    ]
  },
  {
    id: 'T20260420002',
    type: 'question',
    title: '看不到"导出"按钮',
    description: '想导出当月审核明细，但在页面底部没找到按钮。是否需要单独权限？',
    status: 'pending',
    priority: 'medium',
    creator: 'u_88301 (李丽)',
    createdAt: '2026-04-20 10:45:10',
    updatedAt: '2026-04-20 10:45:10',
    context: { userId: 'u_88301', page: '/data/dashboard', browser: 'Edge 127', resolution: '1680×1050' },
    activity: [{ who: '李丽', when: '10:45', what: '发起了原始反馈', kind: 'create' }]
  },
  {
    id: 'T20260420003',
    type: 'error',
    title: '首页加载白屏，持续 10 秒',
    description: '早晨 9 点切换环境后，首页一直白屏，控制台报错 net::ERR_CONNECTION_TIMED_OUT。',
    status: 'processing',
    priority: 'urgent',
    creator: 'u_99102 (王五)',
    assignee: '张强 (运营)',
    createdAt: '2026-04-20 09:05:00',
    updatedAt: '2026-04-20 09:20:00',
    context: { userId: 'u_99102', page: '/', browser: 'Chrome 125', resolution: '2560×1440' },
    activity: [
      { who: '王五', when: '09:05', what: '发起了原始反馈', kind: 'create' },
      { who: '张强', when: '09:20', what: '运营领取，判断为网络问题', kind: 'assign' }
    ]
  },
  {
    id: 'T20260420004',
    type: 'suggestion',
    opsType: 'feature',
    title: '建议增加搜索联想功能',
    description: '搜索任务 ID 时，希望能弹出最近查看的 ID。',
    status: 'pending',
    priority: 'low',
    creator: 'u_77812 (赵六)',
    createdAt: '2026-04-20 11:20:00',
    updatedAt: '2026-04-20 11:20:00',
    context: { userId: 'u_77812', page: '/tasks/pool', browser: 'Safari 17', resolution: '1440×900' },
    activity: [{ who: '赵六', when: '11:20', what: '发起了原始反馈', kind: 'create' }]
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
    updatedAt: '2026-04-19 23:30:00',
    context: { userId: 'admin_01', page: '/admin/roles', browser: 'Chrome 126', resolution: '1920×1080' },
    activity: [{ who: 'admin_01', when: '23:30', what: '发起了原始反馈', kind: 'create' }]
  },
  {
    id: 'T20260420006',
    type: 'question',
    title: 'API 接口文档在哪里查看',
    description: '找不到最新的 V2 版本接口定义，Wiki 上的链接失效了。',
    status: 'resolved',
    priority: 'medium',
    creator: 'dev_55 (老王)',
    assignee: '客服小美',
    createdAt: '2026-04-18 14:00:00',
    updatedAt: '2026-04-20 10:00:00',
    replyToUser: '新地址请见 FAQ / API 门户。',
    activity: [
      { who: '老王', when: '04-18 14:00', what: '发起了原始反馈', kind: 'create' },
      { who: '客服小美', when: '04-20 10:00', what: 'FAQ 回复后关闭', kind: 'resolve' }
    ]
  },
  {
    id: 'T20260420007',
    type: 'error',
    title: '结算单金额计算错误',
    description: '某批次计算结果与表格不符，偏差大约 0.01。',
    status: 'processing',
    priority: 'high',
    creator: 'fin_88 (钱朵朵)',
    assignee: '李四 (运营)',
    createdAt: '2026-04-20 08:30:00',
    updatedAt: '2026-04-20 08:45:00',
    context: { userId: 'fin_88', page: '/finance/settle', browser: 'Chrome 126', resolution: '1920×1080' },
    activity: [
      { who: '钱朵朵', when: '08:30', what: '发起了原始反馈', kind: 'create' },
      { who: '李四', when: '08:45', what: '运营领取，复核金额', kind: 'assign' }
    ]
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
    updatedAt: '2026-04-20 12:00:00',
    activity: [{ who: '夜猫', when: '12:00', what: '发起了原始反馈', kind: 'create' }]
  },
  {
    id: 'T20260420009',
    type: 'error',
    opsType: 'bug',
    title: '移动端无法签到',
    description: '在 H5 页面点击按钮无响应，Android 环境下出现此问题。',
    status: 'forwarded',
    priority: 'medium',
    creator: 'u_1120 (小李)',
    assignee: '李四 (运营)',
    createdAt: '2026-04-20 09:45:00',
    updatedAt: '2026-04-20 10:10:00',
    associatedBId: 'BUG-5087',
    bSystemInfo: { businessLine: '数字化转型业务线', product: '移动端 H5', system: '签到模块 v1.3' },
    context: { userId: 'u_1120', page: '/m/check-in', browser: 'Android WebView', resolution: '1080×2400' },
    activity: [
      { who: '小李', when: '09:45', what: '发起了原始反馈', kind: 'create' },
      { who: '李四', when: '10:10', what: '一键转 B，关联 BUG-5087', kind: 'sync' }
    ]
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
    updatedAt: '2026-04-20 13:15:00',
    activity: [{ who: '合作商', when: '13:15', what: '发起了原始反馈', kind: 'create' }]
  }
];

window.FAQ_DATA = [
  { id: '1', q: '批量提交失败如何处理？', a: '请先确认单批数量不超过 50；若仍失败，提交工单并附截图，运营会在 2 小时内响应。', cat: '审核' },
  { id: '2', q: '如何一键导出当月数据？', a: '在数据看板页右上角 → 导出 → 选择时间范围 → 选择字段 → 点击「生成报表」即可。', cat: '导出' },
  { id: '3', q: '提示"无权限"怎么办？', a: '联系组长在权限中心分配"审核员"角色，权限生效可能需要 5 分钟。', cat: '权限' },
  { id: '4', q: '数据看板延迟如何处理？', a: '看板采用 T+0 延迟最高 15 分钟，如超过请提交工单。', cat: '数据' },
  { id: '5', q: '如何申请接口权限？', a: '走 OA 流程 → 技术中心审批 → API 门户自动开通。', cat: '权限' }
];

window.labels = {
  type: { error: '报错', question: '疑问', suggestion: '建议' },
  opsType: { none: '未配置', bug: 'BUG 缺陷', feature: '产品需求', task: '运营任务' },
  priority: { low: '低', medium: '中', high: '高', urgent: '紧急' },
  priorityEn: { low: 'LOW', medium: 'MEDIUM', high: 'HIGH', urgent: 'URGENT' },
  status: { pending: '待受理', processing: '处理中', awaiting_user: '待用户补充', forwarded: '已转发', resolved: '已解决', closed: '已关闭' }
};
window.fmt = {
  relTime(iso) {
    const d = new Date(iso.replace(' ', 'T'));
    const diff = (Date.now() - d) / 1000;
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff/60)} 分钟前`;
    if (diff < 86400) return `${Math.floor(diff/3600)} 小时前`;
    return `${Math.floor(diff/86400)} 天前`;
  },
  now() {
    return new Date().toISOString().replace('T', ' ').slice(0, 19);
  }
};
