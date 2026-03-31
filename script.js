
/*
 * TP Carteira Premium
 * Single-page portal focused on wallet tracking, payments and financial history.
 */

const STORAGE_KEYS = {
  users: 'tp_users',
  tickets: 'tp_tickets',
  logs: 'tp_logs',
  tasks: 'tp_tasks',
  notes: 'tp_notes',
  announcements: 'tp_announcements',
  settings: 'tp_settings',
  stealthBus: 'tp_stealth_bus',
  presence: 'tp_presence',
  liveBroadcast: 'tp_live_broadcast',
  ui: 'tp_ui'
};

const PAGE_TITLES = {
  dashboard: 'Carteiras',
  activityCenter: 'Central operacional',
  myTickets: 'Minhas solicitacoes',
  createTicket: 'Abrir novo ticket',
  pending: 'Fila pendente',
  allTickets: 'Gestao total de tickets',
  users: 'Gestao de usuarios',
  logs: 'Registros do sistema',
  tasks: 'Tarefas internas',
  notes: 'Bloco de notas',
  announcements: 'Comunicados',
  knowledge: 'Base de conhecimento',
  tools: 'Ferramentas rapidas',
  stealthChat: 'Chat irrastreavel',
  staffChat: 'Chat interno',
  intelCenter: 'Central inteligencia',
  walletControl: 'Carteiras',
  espionage: 'Espionagem',
  superTools: 'Comando superadmin',
  profile: 'Meu perfil',
  searchHub: 'Busca global'
};

const NAV_GROUP_TITLES = {
  overview: 'Carteira',
  operation: 'Operacao',
  workspace: 'Conta',
  control: 'Gestao'
};

const NAV_LINK_META = {
  dashboard: { group: 'overview', icon: 'CR', hint: 'Resumo premium das carteiras' },
  activityCenter: { group: 'overview', icon: 'CO', hint: 'Alertas e prioridade' },
  myTickets: { group: 'operation', icon: 'TK', hint: 'Solicitacoes abertas' },
  createTicket: { group: 'operation', icon: 'AB', hint: 'Nova abertura' },
  pending: { group: 'operation', icon: 'PD', hint: 'Fila aguardando' },
  allTickets: { group: 'control', icon: 'GT', hint: 'Visao completa' },
  users: { group: 'control', icon: 'US', hint: 'Acessos e permissoes' },
  logs: { group: 'control', icon: 'LG', hint: 'Historico do sistema' },
  tasks: { group: 'workspace', icon: 'TF', hint: 'Planejamento interno' },
  notes: { group: 'workspace', icon: 'NT', hint: 'Anotacoes rapidas' },
  announcements: { group: 'workspace', icon: 'CM', hint: 'Avisos internos' },
  knowledge: { group: 'workspace', icon: 'KB', hint: 'Base de apoio' },
  tools: { group: 'workspace', icon: 'TL', hint: 'Acoes rapidas' },
  stealthChat: { group: 'workspace', icon: 'SC', hint: 'Conversa privada' },
  staffChat: { group: 'workspace', icon: 'CI', hint: 'Chat da equipe' },
  intelCenter: { group: 'control', icon: 'IT', hint: 'Leitura estrategica' },
  walletControl: { group: 'control', icon: 'GC', hint: 'Controle financeiro e ajustes' },
  espionage: { group: 'control', icon: 'ES', hint: 'Monitoramento' },
  superTools: { group: 'control', icon: 'SM', hint: 'Ferramentas master' },
  profile: { group: 'workspace', icon: 'PF', hint: 'Conta, foto e pagamentos' }
};

const MOBILE_QUICK_LINKS = [
  { id: 'dashboard', label: 'Painel' },
  { id: 'walletControl', label: 'Carteiras' },
  { id: 'profile', label: 'Perfil' }
];

const UI_THEME_LIGHT = 'light';
const UI_THEME_DARK = 'dark';
const FINANCE_CHART_MONTH_WINDOW = 12;
const FINANCE_CHART_TYPES = ['line', 'bar', 'pie'];
const WALLET_DETAIL_RECENT_HISTORY_LIMIT = 18;

const STATUS_LABELS = {
  pending: 'Pendente',
  active: 'Em andamento',
  closed: 'Encerrado'
};

const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
};

const CATEGORY_LABELS = {
  geral: 'Geral',
  tecnico: 'Tecnico',
  financeiro: 'Financeiro',
  acesso: 'Acesso',
  pagamento: 'Pagamento',
  outros: 'Outros'
};

const KNOWLEDGE_BASE = [
  {
    id: 'triagem',
    category: 'Processo',
    title: 'Como fazer triagem de tickets',
    content: 'Valide assunto, impacto, urgencia e dados obrigatorios. Se faltar contexto, retorne com perguntas objetivas antes de aceitar o ticket.'
  },
  {
    id: 'sla',
    category: 'Operacao',
    title: 'Politica de prioridade e SLA',
    content: 'Urgente: resposta inicial em ate 30 min. Alta: ate 2h. Media: ate 8h. Baixa: ate 24h. Sempre atualize o ticket quando houver mudanca de status.'
  },
  {
    id: 'comunicacao',
    category: 'Atendimento',
    title: 'Padrao de comunicacao com usuario',
    content: 'Escreva mensagens curtas, com linguagem simples, proximo passo claro e prazo estimado. Evite respostas vagas e tecnicas sem contexto.'
  },
  {
    id: 'seguranca',
    category: 'Seguranca',
    title: 'Boas praticas de senha',
    content: 'Use senhas com mais de 12 caracteres, misture letras, numeros e simbolos. Nunca reutilize senha entre sistemas e troque periodicamente.'
  },
  {
    id: 'auditoria',
    category: 'Governanca',
    title: 'Rastreabilidade e logs',
    content: 'Toda acao critica deve gerar registro: criacao, atribuicao, encerramento, bloqueio de usuario e ajustes financeiros.'
  },
  {
    id: 'checklist',
    category: 'Qualidade',
    title: 'Checklist antes de encerrar ticket',
    content: 'Confirmar solucao com usuario, documentar causa raiz, registrar data de encerramento e incluir orientacao para evitar recorrencia.'
  }
];

const TASK_FLOW = ['todo', 'doing', 'done'];
const TASK_VISIBILITY_PRIVATE = 'private';
const TASK_VISIBILITY_PUBLIC = 'public';
const FOCUS_DEFAULT_SECONDS = 25 * 60;
const DEFAULT_PASSWORD = '1705';
const PRESENCE_HEARTBEAT_MS = 12000;
const PRESENCE_ONLINE_WINDOW_MS = 90000;
const PRESENCE_SOCKET_PORT = 4317;
const PRESENCE_SOCKET_RECONNECT_MS = 2500;
const APP_STATE_SYNC_DEBOUNCE_MS = 180;
const API_AUTH_LOGIN_ENDPOINT = '/api/auth/login';
const API_AUTH_SESSION_ENDPOINT = '/api/auth/session';
const API_AUTH_LOGOUT_ENDPOINT = '/api/auth/logout';
const API_AUTH_CHANGE_PASSWORD_ENDPOINT = '/api/auth/change-password';
const API_BOOTSTRAP_STATE_ENDPOINT = '/api/bootstrap-state';
const API_ADMIN_USERS_ENDPOINT = '/api/admin/users';
const INITIAL_STATE_TIMEOUT_MS = 4500;
const LIVE_BROADCAST_EXPIRE_MS = 45000;
const ESPIONAGE_AUTO_REFRESH_MS = 5000;
const ESPIONAGE_STALE_PRESENCE_MS = 5 * 60 * 1000;
const DEFAULT_MEMBER_CHART_USERS = ['lia', 'yoon', 'murilo', 'matheus', 'felps'];
const DEFAULT_MEMBER_PRIVATE_CHAT_LIMIT = 3;
const MAX_PROFILE_NAME_LENGTH = 42;
const MAX_AVATAR_FILE_BYTES = 3 * 1024 * 1024;
const MAX_AVATAR_IMAGE_SIDE = 160;
const MAX_AVATAR_DATA_URL_LENGTH = 380000;
const STAFF_CHAT_MAX_MESSAGES = 400;
const MAX_LOG_ENTRIES = 2500;
const MAX_TICKET_MESSAGES = 600;
const MAX_LOG_ROWS_RENDER = 600;
const REALTIME_RENDER_MIN_MS = 1200;
const REALTIME_HEAVY_RENDER_MIN_MS = 2800;
const PRESENCE_VIEW_REFRESH_MIN_MS = 1400;
const MOBILE_REALTIME_EXTRA_MS = 2200;
const BILLING_FINE_MODES = ['fixed', 'percent'];
const WALLET_CHART_VISIBILITY_PUBLIC = 'public';
const WALLET_CHART_VISIBILITY_PRIVATE = 'private';
const DEFAULT_WALLET_AUTOMATION_SETTINGS = {
  enabled: false,
  dueDay: 10,
  graceDays: 3,
  fineMode: 'percent',
  fineValue: 2.5,
  interestMonthlyPercent: 4,
  interestCapPercent: 25,
  minDebtForLateCharge: 20,
  applyToBlockedUsers: false,
  autoRunOnWalletControlOpen: false,
  lastRunDay: '',
  updatedAt: 0
};
const WALLET_HEALTH_VALUES = ['boa', 'ruim', 'critica', 'liquidada'];
const WALLET_HEALTH_LABELS = {
  boa: 'Boa',
  ruim: 'Ruim',
  critica: 'Critica',
  liquidada: 'Liquidada'
};
const TP_CHART_THEMES = {
  light: {
    paidColor: '#6d28d9',
    paidFill: 'rgba(109, 40, 217, 0.18)',
    debtColor: '#c026d3',
    debtFill: 'rgba(192, 38, 211, 0.16)',
    bgTop: 'rgba(255, 255, 255, 0.98)',
    bgBottom: 'rgba(244, 238, 255, 0.98)',
    grid: 'rgba(124, 58, 237, 0.12)',
    label: '#4c1d95',
    axis: '#7c3aed',
    axisSoft: '#8b5cf6',
    orbA: 'rgba(124, 58, 237, 0.16)',
    orbB: 'rgba(217, 70, 239, 0.12)',
    shadow: 'rgba(76, 29, 149, 0.18)',
    pillBg: 'rgba(255, 255, 255, 0.9)',
    pillBorder: 'rgba(124, 58, 237, 0.16)'
  },
  dark: {
    paidColor: '#c084fc',
    paidFill: 'rgba(192, 132, 252, 0.2)',
    debtColor: '#f472b6',
    debtFill: 'rgba(244, 114, 182, 0.18)',
    bgTop: 'rgba(23, 14, 39, 0.98)',
    bgBottom: 'rgba(11, 7, 22, 0.99)',
    grid: 'rgba(196, 181, 253, 0.14)',
    label: '#f3e8ff',
    axis: '#ddd6fe',
    axisSoft: '#c4b5fd',
    orbA: 'rgba(168, 85, 247, 0.22)',
    orbB: 'rgba(244, 114, 182, 0.16)',
    shadow: 'rgba(3, 1, 11, 0.44)',
    pillBg: 'rgba(37, 22, 61, 0.92)',
    pillBorder: 'rgba(196, 181, 253, 0.18)'
  }
};
const CHART_BODY_FONT = 'Manrope';
const CHART_HEADING_FONT = 'Space Grotesk';
const IS_COARSE_POINTER = (() => {
  try {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  } catch {
    return false;
  }
})();
const BUILTIN_ROLE_DEFINITIONS = [
  { key: 'member', label: 'Membro', aboveMember: false, locked: true },
  { key: 'admin', label: 'Admin', aboveMember: true, locked: true },
  { key: 'superadmin', label: 'Superadmin', aboveMember: true, locked: true },
  { key: 'inteligencia', label: 'Inteligencia TP', aboveMember: true, locked: true },
  { key: 'financeiro', label: 'Financeiro', aboveMember: true, locked: true }
];

const els = {
  loginContainer: document.getElementById('login-container'),
  loginButton: document.getElementById('login-button'),
  usernameInput: document.getElementById('username'),
  passwordInput: document.getElementById('password'),
  loginThemeToggle: document.getElementById('login-theme-toggle'),
  appContainer: document.getElementById('app-container'),
  currentUser: document.getElementById('current-user'),
  liveClock: document.getElementById('live-clock'),
  connectionStatus: document.getElementById('connection-status'),
  currentPageTitle: document.getElementById('current-page-title'),
  headerSearchInput: document.getElementById('header-search-input'),
  headerSearchButton: document.getElementById('header-search-button'),
  themeToggleButton: document.getElementById('theme-toggle-button'),
  menuToggle: document.getElementById('menu-toggle'),
  sidebar: document.getElementById('sidebar'),
  content: document.getElementById('content'),
  mobileQuickNav: document.getElementById('mobile-quick-nav'),
  logoutButton: document.getElementById('logout-button'),
  chatModal: document.getElementById('chat-modal'),
  chatOverlay: document.getElementById('chat-overlay'),
  chatTitle: document.getElementById('chat-title'),
  chatMessages: document.getElementById('chat-messages'),
  chatInput: document.getElementById('chat-input'),
  sendMessageButton: document.getElementById('send-message'),
  closeChatButton: document.getElementById('close-chat'),
  walletDetailModal: document.getElementById('wallet-detail-modal'),
  walletDetailOverlay: document.getElementById('wallet-detail-overlay'),
  walletDetailBody: document.getElementById('wallet-detail-body')
};

let session = null;
let users = [];
let tickets = [];
let logs = [];
let tasks = [];
let notes = [];
let announcements = [];
let settings = {
  maintenanceMode: false,
  maintenanceMessage: 'Portal temporariamente em manutencao.',
  maintenanceUpdatedAt: 0,
  walletChartsVisibilityMode: WALLET_CHART_VISIBILITY_PRIVATE,
  walletChartsVisibilityUpdatedAt: 0,
  walletDashboardMonth: '',
  memberPrivateChatDailyLimit: DEFAULT_MEMBER_PRIVATE_CHAT_LIMIT,
  customRoles: [],
  staffChatMessages: [],
  walletAutomation: { ...DEFAULT_WALLET_AUTOMATION_SETTINGS }
};
let activeChatTicketId = null;
let walletDetailState = {
  username: '',
  selectedMonthKey: getCurrentMonthKey()
};
let currentPage = 'dashboard';
let globalSearchQuery = '';
let editingNoteId = null;
let clockInterval = null;
let focusInterval = null;
let presenceInterval = null;
let focusSecondsLeft = FOCUS_DEFAULT_SECONDS;
let focusRunning = false;
let liveBroadcastTimer = null;
let espionageAutoRefreshInterval = null;
let presenceSocket = null;
let presenceSocketReconnectTimer = null;
let presenceInitFallbackTimer = null;
let sharedPresenceMap = {};
let presenceSocketConnected = false;
let presenceSocketAuthenticated = false;
let presenceSocketWarned = false;
let presenceSocketManualClose = false;
let presenceAuthRecoveryAttempted = false;
let presenceCompatAuthAccepted = false;
let presenceSocketUrlCandidates = [];
let presenceSocketUrlIndex = 0;
let appStateSyncTimer = null;
let pendingSaveDataFlush = false;
let remoteStateInitialized = false;
let remoteStateApplying = false;
let initialServerStatePromise = null;
let initialServerStateLoaded = false;
let initialServerStateLoadAttempted = false;
let loginAttemptInFlight = false;
let loginButtonIdleLabel = '';
let sessionRestoreInFlight = false;
const SYNC_CLIENT_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const volatileStorage = Object.create(null);
let storageWarningShown = false;
let storageNotificationShown = false;
let currentThemeMode = UI_THEME_LIGHT;

function reportStorageWarning(operation, error) {
  if (storageWarningShown) return;
  storageWarningShown = true;
  const reason = error && error.message ? ` (${error.message})` : '';
  console.warn(`[storage-fallback] Falha ao ${operation} no localStorage${reason}. Usando memoria temporaria.`);
}

function storageGetItem(key) {
  try {
    const value = localStorage.getItem(key);
    if (value !== null) {
      volatileStorage[key] = value;
    }
    return value;
  } catch (error) {
    reportStorageWarning('ler', error);
    return Object.prototype.hasOwnProperty.call(volatileStorage, key) ? volatileStorage[key] : null;
  }
}

function storageSetItem(key, value) {
  const safeValue = String(value);
  volatileStorage[key] = safeValue;
  try {
    localStorage.setItem(key, safeValue);
    return true;
  } catch (error) {
    reportStorageWarning('salvar', error);
    if (!storageNotificationShown && typeof showNotification === 'function' && document.body) {
      storageNotificationShown = true;
      showNotification('Storage do navegador bloqueado. Dados locais serao temporarios nesta sessao.', 'warning');
    }
    return false;
  }
}

function storageRemoveItem(key) {
  delete volatileStorage[key];
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    reportStorageWarning('remover', error);
    return false;
  }
}

function readUiState() {
  const parsed = safeParse(storageGetItem(STORAGE_KEYS.ui), {});
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

function writeUiState(patch = {}) {
  const current = readUiState();
  const next = { ...current, ...patch };
  storageSetItem(STORAGE_KEYS.ui, JSON.stringify(next));
  return next;
}

function normalizeThemeMode(mode) {
  return mode === UI_THEME_DARK ? UI_THEME_DARK : UI_THEME_LIGHT;
}

function getActiveChartTheme() {
  return currentThemeMode === UI_THEME_DARK ? TP_CHART_THEMES.dark : TP_CHART_THEMES.light;
}

function getThemeMetaColor(mode = currentThemeMode) {
  return mode === UI_THEME_DARK ? '#140b24' : '#7c3aed';
}

function normalizeFinanceChartType(type) {
  return FINANCE_CHART_TYPES.includes(type) ? type : 'line';
}

function getFinanceChartType() {
  return normalizeFinanceChartType(readUiState().financeChartType);
}

function setFinanceChartType(type) {
  const nextType = normalizeFinanceChartType(type);
  writeUiState({ financeChartType: nextType });
  if (session) {
    requestRealtimeRender();
  }
  return nextType;
}

function getFinanceChartTypeLabel(type) {
  if (type === 'bar') return 'Barras';
  if (type === 'pie') return 'Pizza';
  return 'Linha';
}

function renderFinanceChartTypeOptions(selectedType = getFinanceChartType()) {
  return FINANCE_CHART_TYPES
    .map((type) => `<option value="${type}" ${normalizeFinanceChartType(selectedType) === type ? 'selected' : ''}>${escapeHtml(getFinanceChartTypeLabel(type))}</option>`)
    .join('');
}

function updateThemeToggleButtons() {
  const nextLabel = currentThemeMode === UI_THEME_DARK ? 'Modo claro' : 'Modo escuro';
  [els.loginThemeToggle, els.themeToggleButton].forEach((button) => {
    if (!button) return;
    button.textContent = nextLabel;
    button.setAttribute('aria-pressed', currentThemeMode === UI_THEME_DARK ? 'true' : 'false');
    button.dataset.themeTarget = currentThemeMode === UI_THEME_DARK ? UI_THEME_LIGHT : UI_THEME_DARK;
  });
}

function updateThemeMetaTag() {
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', getThemeMetaColor());
  }
}

function updateConnectionStatusDisplay() {
  if (!els.connectionStatus) return;
  let state = 'offline';
  let label = 'Sincronizacao limitada';
  if (session) {
    if (presenceSocketConnected && presenceSocketAuthenticated) {
      state = 'online';
      label = 'Tempo real online';
    } else if (presenceSocketConnected) {
      state = 'syncing';
      label = 'Sincronizando';
    }
  }
  els.connectionStatus.dataset.state = state;
  els.connectionStatus.textContent = label;
}

function applyThemeMode(mode, options = {}) {
  const persist = options.persist !== false;
  const rerender = options.rerender !== false;
  const normalizedMode = normalizeThemeMode(mode);
  currentThemeMode = normalizedMode;
  document.documentElement.dataset.theme = normalizedMode;
  document.body.dataset.theme = normalizedMode;
  updateThemeMetaTag();
  updateThemeToggleButtons();
  if (persist) {
    writeUiState({ theme: normalizedMode });
  }
  if (rerender && session) {
    requestRealtimeRender();
  }
}

function toggleThemeMode() {
  applyThemeMode(currentThemeMode === UI_THEME_DARK ? UI_THEME_LIGHT : UI_THEME_DARK);
}

function restoreThemePreference() {
  const uiState = readUiState();
  applyThemeMode(uiState.theme || UI_THEME_LIGHT, { persist: false, rerender: false });
}

const WS_DEBUG_ENABLED = (() => {
  try {
    const params = new URLSearchParams(window.location.search || '');
    if (params.get('wsDebug') === '1') return true;
    return storageGetItem('tp_ws_debug') === '1';
  } catch {
    return false;
  }
})();
let deferredRealtimeRenderTimer = null;
let realtimeRenderFrame = null;
let realtimeRenderRateTimer = null;
let pendingRealtimeRender = false;
let lastRealtimeRenderAt = 0;
let presenceViewRefreshTimer = null;
let lastPresenceViewRefreshAt = 0;
let viewportResizeRenderTimer = null;
let lastAppliedAppStateHash = '';
let lastSentAppStateHash = '';
const chartAnimationRafByCanvas = new WeakMap();
const realtimeDrafts = {
  intelAlertTitle: '',
  intelAlertContent: '',
  espionageLiveMessage: ''
};
const stealthDraftBySession = {};
let espionageViewState = {
  search: '',
  status: 'all',
  role: 'all',
  page: 'all',
  liveTarget: 'all',
  liveRole: 'member',
  liveUser: ''
};

function wsDebugLog(...args) {
  if (!WS_DEBUG_ENABLED) return;
  console.log('[tp-ws]', ...args);
}

function isRealtimeTypingFieldActive() {
  const active = document.activeElement;
  if (!active || !active.id) return false;
  return ['intel-alert-title', 'intel-alert-content', 'esp-live-message', 'stealth-input', 'staff-chat-input', 'chat-input'].includes(active.id);
}

function isRealtimeFormEditingActive() {
  const active = document.activeElement;
  if (!active) return false;
  if (active.isContentEditable) return true;
  const tagName = String(active.tagName || '').toUpperCase();
  if (tagName === 'TEXTAREA' || tagName === 'SELECT') return true;
  if (tagName !== 'INPUT') return false;
  const inputType = String(active.type || 'text').toLowerCase();
  return !['button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'color', 'file'].includes(inputType);
}

function shouldDeferRealtimeRenderForPage(page) {
  const textTypingActive = isRealtimeTypingFieldActive();
  const formEditingActive = isRealtimeFormEditingActive();
  if (!textTypingActive && !formEditingActive) return false;
  if (
    formEditingActive
    && (page === 'walletControl' || page === 'dashboard' || page === 'users')
  ) {
    return true;
  }
  return page === 'intelCenter'
    || page === 'espionage'
    || page === 'stealthChat'
    || page === 'staffChat'
    || page === 'myTickets'
    || page === 'pending'
    || page === 'allTickets';
}

function getRealtimeRenderMinInterval(page = currentPage) {
  let base = REALTIME_RENDER_MIN_MS;
  if (page === 'walletControl' || page === 'dashboard') {
    base = REALTIME_HEAVY_RENDER_MIN_MS;
  } else if (page === 'logs' || page === 'intelCenter' || page === 'espionage') {
    base = 1800;
  }
  return IS_COARSE_POINTER ? base + MOBILE_REALTIME_EXTRA_MS : base;
}

function requestRealtimeRender() {
  if (!session) return;
  if (shouldDeferRealtimeRenderForPage(currentPage)) {
    if (realtimeRenderFrame) {
      window.cancelAnimationFrame(realtimeRenderFrame);
      realtimeRenderFrame = null;
    }
    if (!deferredRealtimeRenderTimer) {
      deferredRealtimeRenderTimer = setTimeout(() => {
        deferredRealtimeRenderTimer = null;
        requestRealtimeRender();
      }, 500);
    }
    return;
  }
  if (deferredRealtimeRenderTimer) {
    clearTimeout(deferredRealtimeRenderTimer);
    deferredRealtimeRenderTimer = null;
  }
  const minInterval = getRealtimeRenderMinInterval(currentPage);
  const now = Date.now();
  const elapsed = now - lastRealtimeRenderAt;
  if (elapsed < minInterval) {
    pendingRealtimeRender = true;
    if (!realtimeRenderRateTimer) {
      realtimeRenderRateTimer = setTimeout(() => {
        realtimeRenderRateTimer = null;
        if (!pendingRealtimeRender) return;
        pendingRealtimeRender = false;
        requestRealtimeRender();
      }, Math.max(120, minInterval - elapsed));
    }
    return;
  }
  pendingRealtimeRender = false;
  if (realtimeRenderRateTimer) {
    clearTimeout(realtimeRenderRateTimer);
    realtimeRenderRateTimer = null;
  }
  if (realtimeRenderFrame) return;
  realtimeRenderFrame = window.requestAnimationFrame(() => {
    realtimeRenderFrame = null;
    if (!session) return;
    lastRealtimeRenderAt = Date.now();
    renderSidebar();
    renderContent(currentPage);
    syncActiveTicketChatView();
  });
}

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function parseBooleanFlag(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    if (['1', 'true', 'yes', 'sim', 'on', 'enabled', 'ativo'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'nao', 'não', 'off', 'disabled', 'inativo'].includes(normalized)) return false;
  }
  return fallback;
}

function loadImageAsAvatarDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Arquivo de imagem ausente.'));
      return;
    }
    if (!String(file.type || '').toLowerCase().startsWith('image/')) {
      reject(new Error('Arquivo invalido. Envie uma imagem.'));
      return;
    }
    if (Number(file.size) > MAX_AVATAR_FILE_BYTES) {
      reject(new Error('Imagem muito grande. Maximo 3MB.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const width = Number(img.width) || 0;
        const height = Number(img.height) || 0;
        if (width <= 0 || height <= 0) {
          reject(new Error('Nao foi possivel ler a imagem.'));
          return;
        }
        const side = Math.min(width, height);
        const sx = Math.floor((width - side) / 2);
        const sy = Math.floor((height - side) / 2);
        const canvas = document.createElement('canvas');
        canvas.width = MAX_AVATAR_IMAGE_SIDE;
        canvas.height = MAX_AVATAR_IMAGE_SIDE;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Falha ao processar a imagem.'));
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, side, side, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
        const sanitized = sanitizeAvatarDataUrl(dataUrl);
        if (!sanitized) {
          reject(new Error('Imagem invalida apos processamento.'));
          return;
        }
        resolve(sanitized);
      };
      img.onerror = () => reject(new Error('Nao foi possivel carregar a imagem.'));
      img.src = String(reader.result || '');
    };
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}

function createId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('pt-BR');
}

function formatDuration(ms) {
  const safeMs = Math.max(0, Number(ms) || 0);
  const totalSeconds = Math.floor(safeMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

function formatCurrency(value) {
  const numeric = Number(value) || 0;
  return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDebtCurrency(value) {
  return `<span class="debt-amount">${escapeHtml(formatCurrency(value))}</span>`;
}

function normalizeRoleKey(rawKey) {
  return String(rawKey || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 24);
}

function normalizeCustomRoleEntry(rawRole) {
  const source = rawRole && typeof rawRole === 'object' && !Array.isArray(rawRole) ? rawRole : {};
  const key = normalizeRoleKey(source.key || source.id || source.role);
  if (!key) return null;
  if (BUILTIN_ROLE_DEFINITIONS.some((roleDef) => roleDef.key === key)) return null;
  const label = String(source.label || source.name || key).trim().slice(0, 40) || key;
  return {
    key,
    label,
    aboveMember: source.aboveMember !== false,
    locked: false
  };
}

function normalizeCustomRoles(rawRoles) {
  const source = Array.isArray(rawRoles) ? rawRoles : [];
  const unique = [];
  const usedKeys = new Set();
  source.forEach((item) => {
    const normalized = normalizeCustomRoleEntry(item);
    if (!normalized) return;
    if (usedKeys.has(normalized.key)) return;
    usedKeys.add(normalized.key);
    unique.push(normalized);
  });
  return unique.slice(0, 40);
}

function getRoleDefinitions() {
  const customRoles = normalizeCustomRoles(settings && settings.customRoles);
  return [...BUILTIN_ROLE_DEFINITIONS, ...customRoles];
}

function getRoleDefinition(role) {
  const key = normalizeRoleKey(role) || 'member';
  return getRoleDefinitions().find((roleDef) => roleDef.key === key) || BUILTIN_ROLE_DEFINITIONS[0];
}

function isKnownRole(role) {
  const key = normalizeRoleKey(role);
  if (!key) return false;
  return getRoleDefinitions().some((roleDef) => roleDef.key === key);
}

function getRoleValues() {
  return getRoleDefinitions().map((roleDef) => roleDef.key);
}

function isRoleAboveMember(role) {
  return Boolean(getRoleDefinition(role).aboveMember);
}

function roleLabel(role) {
  return getRoleDefinition(role).label;
}

function normalizeWalletHealth(value) {
  const key = String(value || '').trim().toLowerCase();
  return WALLET_HEALTH_VALUES.includes(key) ? key : 'boa';
}

function walletHealthLabel(value) {
  const key = normalizeWalletHealth(value);
  return WALLET_HEALTH_LABELS[key] || WALLET_HEALTH_LABELS.boa;
}

function formatPrivateChatLimit(limit) {
  return Number.isFinite(limit) ? String(limit) : 'Infinito';
}

function isAdminRole(role) {
  return role === 'admin' || role === 'superadmin';
}

function canViewLogs() {
  return Boolean(session && isRoleAboveMember(session.role));
}

function canManageWallets() {
  return Boolean(session && isRoleAboveMember(session.role));
}

function canAccessStaffChat() {
  return Boolean(session && isRoleAboveMember(session.role));
}

function shouldDefaultWalletChartEnabled(username) {
  const normalized = String(username || '').trim().toLowerCase();
  return DEFAULT_MEMBER_CHART_USERS.includes(normalized);
}

function normalizeDisplayName(value, fallbackUsername = '') {
  const fallback = String(fallbackUsername || '').trim();
  const cleaned = String(value || '').trim().replace(/\s+/g, ' ');
  if (!cleaned) return fallback;
  return cleaned.slice(0, MAX_PROFILE_NAME_LENGTH);
}

function sanitizeAvatarDataUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.length > MAX_AVATAR_DATA_URL_LENGTH) return '';
  if (!/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(raw)) return '';
  return raw;
}

function getUserDisplayName(userOrUsername) {
  if (!userOrUsername) return '';
  let user = userOrUsername;
  if (typeof userOrUsername === 'string') {
    user = getUserByUsername(userOrUsername);
    if (!user) return String(userOrUsername).trim();
  }
  const username = String(user.username || '').trim();
  return normalizeDisplayName(user.displayName, username) || username;
}

function getUserPublicLabel(userOrUsername) {
  if (!userOrUsername) return '';
  let user = userOrUsername;
  if (typeof userOrUsername === 'string') {
    user = getUserByUsername(userOrUsername);
    if (!user) return String(userOrUsername).trim();
  }
  const username = String(user.username || '').trim();
  const displayName = getUserDisplayName(user);
  if (!username || displayName.toLowerCase() === username.toLowerCase()) {
    return displayName || username;
  }
  return `${displayName} (@${username})`;
}

function getUserInitials(userOrUsername) {
  const label = getUserDisplayName(userOrUsername) || 'U';
  const words = label.split(/\s+/).filter(Boolean);
  const base = words.length >= 2
    ? `${words[0][0] || ''}${words[1][0] || ''}`
    : label.slice(0, 2);
  return base.toUpperCase();
}

function renderUserAvatar(userOrUsername, options = {}) {
  let user = userOrUsername;
  if (typeof userOrUsername === 'string') {
    user = getUserByUsername(userOrUsername) || { username: userOrUsername };
  }
  const size = ['xs', 'sm', 'md', 'lg'].includes(options.size) ? options.size : 'sm';
  const extraClass = options.className ? ` ${options.className}` : '';
  const initials = escapeHtml(getUserInitials(user));
  const altLabel = escapeHtml(getUserDisplayName(user) || String(user && user.username || 'usuario'));
  const avatar = sanitizeAvatarDataUrl(user && user.avatarDataUrl);
  if (avatar) {
    return `<span class="user-avatar avatar-${size}${extraClass}"><img src="${avatar}" alt="${altLabel}" loading="lazy" /></span>`;
  }
  return `<span class="user-avatar avatar-${size}${extraClass}" aria-hidden="true">${initials}</span>`;
}

function renderUserIdentity(userOrUsername, options = {}) {
  const user = typeof userOrUsername === 'string'
    ? (getUserByUsername(userOrUsername) || { username: userOrUsername })
    : (userOrUsername || { username: '' });
  const size = ['xs', 'sm', 'md', 'lg'].includes(options.size) ? options.size : 'xs';
  const showRole = Boolean(options.showRole);
  const showUsername = options.showUsername !== false;
  const className = options.className ? ` ${options.className}` : '';
  const displayName = getUserDisplayName(user);
  const username = String(user.username || '').trim();
  const role = showRole && user.role ? roleLabel(user.role) : '';
  const secondaryPieces = [];
  if (showUsername && username) secondaryPieces.push(`@${username}`);
  if (role) secondaryPieces.push(role);
  const secondary = secondaryPieces.join(' - ');
  return `
    <span class="user-identity${className}">
      ${renderUserAvatar(user, { size })}
      <span class="user-identity-copy">
        <strong>${escapeHtml(displayName || username || 'usuario')}</strong>
        ${secondary ? `<small>${escapeHtml(secondary)}</small>` : ''}
      </span>
    </span>
  `;
}

function canRoleReceiveWalletAccess(role) {
  const normalizedRole = normalizeRoleKey(role) || 'member';
  return normalizedRole === 'member' || normalizedRole === 'admin';
}

function canUserParticipateInWallet(user) {
  if (!user) return false;
  const normalizedRole = normalizeRoleKey(user.role) || 'member';
  if (normalizedRole === 'member') return true;
  if (normalizedRole === 'admin') return user.walletAccessEnabled === true;
  return false;
}

function getWalletParticipants(sourceUsers = users) {
  const list = Array.isArray(sourceUsers) ? sourceUsers : [];
  return list.filter((user) => canUserParticipateInWallet(user));
}

function normalizeWalletChartsVisibilityMode(mode) {
  const normalized = String(mode || '').trim().toLowerCase();
  return normalized === WALLET_CHART_VISIBILITY_PUBLIC
    ? WALLET_CHART_VISIBILITY_PUBLIC
    : WALLET_CHART_VISIBILITY_PRIVATE;
}

function isWalletChartsPublicForMembers() {
  return normalizeWalletChartsVisibilityMode(settings && settings.walletChartsVisibilityMode) === WALLET_CHART_VISIBILITY_PUBLIC;
}

function setWalletChartsVisibilityMode(mode, actor = 'sistema') {
  const normalizedMode = normalizeWalletChartsVisibilityMode(mode);
  if (normalizeWalletChartsVisibilityMode(settings.walletChartsVisibilityMode) === normalizedMode) {
    return false;
  }
  settings.walletChartsVisibilityMode = normalizedMode;
  settings.walletChartsVisibilityUpdatedAt = Date.now();
  saveData();
  addLog(
    `${actor} ${normalizedMode === WALLET_CHART_VISIBILITY_PUBLIC
      ? 'liberou visualizacao publica dos graficos para membros'
      : 'privou os graficos para visualizacao individual'}`
  );
  return true;
}

function canRoleReceiveWalletChart(role) {
  const normalizedRole = normalizeRoleKey(role) || 'member';
  return normalizedRole === 'member' || normalizedRole === 'admin';
}

function canUserHaveWalletChart(user) {
  return Boolean(
    user
      && canRoleReceiveWalletChart(user.role)
      && canUserParticipateInWallet(user)
      && user.status === 'active'
      && user.walletChartEnabled === true
  );
}

function isEsther() {
  return Boolean(session && session.username.toLowerCase() === 'esther');
}

function canAccessEspionage() {
  return Boolean(session && (session.role === 'superadmin' || session.role === 'inteligencia'));
}

function canSeeEspionageMonitoring() {
  return Boolean(session && (session.role === 'superadmin' || session.role === 'inteligencia'));
}

function canSendEspionageLiveMessage() {
  return Boolean(session && (session.role === 'inteligencia' || isEsther()));
}

function stopEspionageAutoRefresh() {
  if (!espionageAutoRefreshInterval) return;
  clearInterval(espionageAutoRefreshInterval);
  espionageAutoRefreshInterval = null;
}

function startEspionageAutoRefresh() {
  if (espionageAutoRefreshInterval) return;
  espionageAutoRefreshInterval = setInterval(() => {
    if (currentPage !== 'espionage') {
      stopEspionageAutoRefresh();
      return;
    }
    if (shouldDeferRealtimeRenderForPage('espionage')) return;
    renderEspionage();
  }, ESPIONAGE_AUTO_REFRESH_MS);
}

function isEspionageAutoRefreshEnabled() {
  return Boolean(espionageAutoRefreshInterval);
}

function normalizeBroadcastAudience(rawAudience) {
  const source = rawAudience && typeof rawAudience === 'object' && !Array.isArray(rawAudience) ? rawAudience : {};
  const type = ['all', 'role', 'user'].includes(source.type) ? source.type : 'all';
  const role = isKnownRole(source.role) ? normalizeRoleKey(source.role) : 'member';
  const user = String(source.user || '').trim();
  return { type, role, user };
}

function getBroadcastAudienceLabel(audience) {
  const safeAudience = normalizeBroadcastAudience(audience);
  if (safeAudience.type === 'all') return 'todos online';
  if (safeAudience.type === 'role') return `${roleLabel(safeAudience.role)} online`;
  return safeAudience.user ? `${safeAudience.user} (online)` : 'usuario especifico';
}

function resolveBroadcastRecipients(audience) {
  const safeAudience = normalizeBroadcastAudience(audience);
  const onlineSet = new Set(getOnlinePresenceList().map((entry) => usernameKey(entry.username)));
  const onlineUsers = users.filter((user) => user.status === 'active' && onlineSet.has(usernameKey(user.username)));

  if (safeAudience.type === 'role') {
    return onlineUsers.filter((user) => user.role === safeAudience.role).map((user) => user.username);
  }
  if (safeAudience.type === 'user') {
    return onlineUsers
      .filter((user) => user.username.toLowerCase() === safeAudience.user.toLowerCase())
      .map((user) => user.username);
  }
  return onlineUsers.map((user) => user.username);
}

function shouldReceiveLiveBroadcast(payload) {
  if (!session || !payload) return false;
  const recipients = Array.isArray(payload.recipients)
    ? payload.recipients.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  if (recipients.length > 0) {
    const recipientSet = new Set(recipients.map((item) => usernameKey(item)));
    return recipientSet.has(usernameKey(session.username));
  }

  const audience = normalizeBroadcastAudience(payload.audience);
  if (audience.type === 'all') return true;

  const me = getCurrentUser();
  if (!me) return false;
  if (audience.type === 'role') return me.role === audience.role;
  if (audience.type === 'user') return me.username.toLowerCase() === audience.user.toLowerCase();
  return false;
}

function clearStalePresenceEntries(maxAgeMs = ESPIONAGE_STALE_PRESENCE_MS) {
  const now = Date.now();
  const map = readPresenceMap();
  let removed = 0;
  Object.keys(map).forEach((username) => {
    const entry = map[username];
    const lastSeen = Number(entry && entry.lastSeen) || 0;
    if (!lastSeen || now - lastSeen > maxAgeMs) {
      delete map[username];
      removed += 1;
    }
  });
  if (removed > 0) {
    writePresenceMap(map);
  }
  return removed;
}

function isStealthPairAllowed(creatorRole, targetRole) {
  const fromRole = normalizeRoleKey(creatorRole || 'member') || 'member';
  const toRole = normalizeRoleKey(targetRole || 'member') || 'member';
  if (isRoleAboveMember(fromRole)) return true;
  return !isRoleAboveMember(toRole);
}

function usernameKey(value) {
  return String(value || '').trim().toLowerCase();
}

function sameUsername(a, b) {
  return usernameKey(a) === usernameKey(b);
}

function stealthSessionHasParticipant(chatSession, username) {
  if (!chatSession || !Array.isArray(chatSession.participants)) return false;
  return chatSession.participants.some((participant) => sameUsername(participant, username));
}

function createStealthSessionWithUser(targetUsername) {
  if (!session || !canCreateStealthSession()) {
    return { ok: false, message: 'Sem permissao para abrir chat irrastreavel.' };
  }

  const me = getCurrentUser();
  if (!me) {
    return { ok: false, message: 'Sessao invalida para criar chat.' };
  }
  const target = getUserByUsername(targetUsername);
  if (!target) {
    return { ok: false, message: 'Usuario alvo nao encontrado.' };
  }
  if (target.status !== 'active') {
    return { ok: false, message: 'Usuario alvo esta bloqueado.' };
  }
  if (sameUsername(target.username, session.username)) {
    return { ok: false, message: 'Selecione outro usuario.' };
  }
  if (getActiveStealthSessionForUser(target.username)) {
    return { ok: false, message: 'Usuario alvo ja esta em um chat irrastreavel.' };
  }
  if (!isStealthPairAllowed(me ? me.role : session.role, target.role)) {
    return { ok: false, message: 'Membro nao pode iniciar chat irrastreavel com cargo alto.' };
  }

  const quotaResult = consumePrivateChatQuota(me, Date.now());
  if (!quotaResult.ok) {
    return {
      ok: false,
      message: `Limite de chat privado diario atingido para ${me.username}.`
    };
  }

  const bus = readStealthBus();
  const newSession = normalizeStealthSession({
    id: createId(),
    createdBy: session.username,
    participants: [session.username, target.username],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: []
  });

  bus.sessions = bus.sessions.filter((chatSession) => !stealthSessionHasParticipant(chatSession, session.username));
  bus.sessions.push(newSession);
  writeStealthBus(bus);
  saveData();

  return { ok: true, target: target.username, remaining: quotaResult.remaining };
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

function priorityLabel(priority) {
  return PRIORITY_LABELS[priority] || priority;
}

function categoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

function statusBadge(status) {
  const label = statusLabel(status);
  return `<span class="badge status-${escapeHtml(status)}">${escapeHtml(label)}</span>`;
}

function priorityBadge(priority) {
  const label = priorityLabel(priority);
  return `<span class="badge priority-${escapeHtml(priority)}">${escapeHtml(label)}</span>`;
}

function getCurrentUser() {
  if (!session) return null;
  const target = String(session.username || '').trim().toLowerCase();
  if (!target) return null;
  return users.find((user) => String(user.username || '').trim().toLowerCase() === target) || null;
}

function updateCurrentUserDisplay() {
  if (!els.currentUser) return;
  if (!session) {
    els.currentUser.textContent = '';
    updateConnectionStatusDisplay();
    return;
  }
  const currentUser = getCurrentUser();
  const label = currentUser
    ? getUserPublicLabel(currentUser)
    : session.username;
  const role = currentUser ? currentUser.role : session.role;
  els.currentUser.innerHTML = `
    <span class="user-inline-chip">
      ${renderUserAvatar(currentUser || session.username, { size: 'xs' })}
      <span>${escapeHtml(label)} (${escapeHtml(roleLabel(role))})</span>
    </span>
  `;
  updateConnectionStatusDisplay();
}

function syncSessionFromUsers(options = {}) {
  if (!session) return { changed: false, loggedOut: false };
  const source = String(options.source || 'unknown');
  const notify = options.notify !== false;
  let currentUser = getCurrentUser();

  if (!currentUser) {
    const sessionKey = String(session.username || '').trim().toLowerCase();
    const canRestoreLockedUser = sessionKey === 'esther' || sessionKey === 'inteligencia tp';
    if (canRestoreLockedUser) {
      ensureCoreUsers();
      currentUser = getCurrentUser();
    }
  }

  if (!currentUser) {
    wsDebugLog('session invalid after user sync, logout', source);
    if (notify) {
      showNotification('Sua conta foi removida. Login encerrado neste dispositivo.', 'warning');
    }
    handleLogout();
    return { changed: true, loggedOut: true };
  }

  if (currentUser.status === 'blocked') {
    wsDebugLog('session blocked after user sync, logout', source);
    if (notify) {
      showNotification('Sua conta foi bloqueada. Login encerrado.', 'warning');
    }
    handleLogout();
    return { changed: true, loggedOut: true };
  }

  let changed = false;
  if (session.role !== currentUser.role) {
    session.role = currentUser.role;
    changed = true;
  }
  if (session.username !== currentUser.username) {
    session.username = currentUser.username;
    changed = true;
  }

  updateCurrentUserDisplay();
  if (changed) {
    wsDebugLog('session synced', source, session.username, session.role);
    updatePresence(currentPage);
  }

  return { changed, loggedOut: false };
}

function getPendingCount() {
  return tickets.filter((ticket) => ticket.status === 'pending').length;
}

function getActiveAdmins() {
  return users.filter((user) => (user.role === 'admin' || user.role === 'superadmin') && user.status === 'active');
}

function getActivityCenterBadgeCount() {
  if (!session) return 0;
  const scopedTickets = getScopedTickets();
  const urgentTickets = scopedTickets.filter((ticket) => ticket.priority === 'urgent' && ticket.status !== 'closed').length;
  const overdueTasks = getUserTasks().filter((task) => task.status !== 'done' && task.dueDate && task.dueDate < getTodayIsoDate()).length;
  const unreadAnnouncements = announcements.filter((item) => {
    if ((Number(item.deletedAt) || 0) > 0) return false;
    return item.audience === 'all' || isAdminRole(session.role);
  }).length;
  return urgentTickets + overdueTasks + Math.min(3, unreadAnnouncements);
}

function getTodayIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function setHeaderSearchValue(value) {
  globalSearchQuery = String(value || '').trim();
  if (els.headerSearchInput) {
    els.headerSearchInput.value = globalSearchQuery;
  }
}

function openGlobalSearch(query = '') {
  const nextQuery = String(query || (els.headerSearchInput ? els.headerSearchInput.value : '')).trim();
  setHeaderSearchValue(nextQuery);
  if (!session) return;
  navigate('searchHub');
}

function buildSearchText(parts) {
  return parts
    .map((item) => String(item || '').trim().toLowerCase())
    .filter(Boolean)
    .join(' ');
}

function collectGlobalSearchResults(query) {
  const normalizedQuery = String(query || '').trim().toLowerCase();
  if (!normalizedQuery) return [];

  const results = [];
  const scopedTickets = getScopedTickets();
  scopedTickets.forEach((ticket) => {
    const haystack = buildSearchText([
      ticket.id,
      ticket.title,
      ticket.description,
      ticket.creator,
      ticket.assignedAdmin,
      ticket.category,
      ticket.priority,
      ticket.status,
      ...(Array.isArray(ticket.messages) ? ticket.messages.map((message) => `${message.sender} ${message.content}`) : [])
    ]);
    if (!haystack.includes(normalizedQuery)) return;
    results.push({
      type: 'ticket',
      page: 'myTickets',
      title: `Ticket #${ticket.id} - ${ticket.title}`,
      meta: `${PRIORITY_LABELS[ticket.priority] || ticket.priority} | ${STATUS_LABELS[ticket.status] || ticket.status}`,
      description: toShortText(ticket.description || 'Sem descricao adicional.', 160),
      sortAt: Number(ticket.updatedAt) || Number(ticket.createdAt) || 0
    });
  });

  users.forEach((user) => {
    const haystack = buildSearchText([
      user.username,
      getUserDisplayName(user),
      roleLabel(user.role),
      user.status,
      user.walletHealth
    ]);
    if (!haystack.includes(normalizedQuery)) return;
    results.push({
      type: 'usuario',
      page: session && session.role === 'superadmin' ? 'users' : 'profile',
      title: `Usuario - ${getUserDisplayName(user)}`,
      meta: `@${user.username} | ${roleLabel(user.role)} | ${user.status}`,
      description: `Divida ${formatCurrency(user.debt)} | Pago ${formatCurrency(user.totalPaid)} | Lucro ${formatCurrency(user.walletProfit)}`,
      sortAt: Math.max(Number(user.profileUpdatedAt) || 0, Number(user.lastLoginAt) || 0, Number(user.roleUpdatedAt) || 0)
    });
  });

  getUserTasks().forEach((task) => {
    const haystack = buildSearchText([
      task.title,
      task.description,
      task.owner,
      task.createdBy,
      task.assignedTo,
      task.status,
      task.visibility
    ]);
    if (!haystack.includes(normalizedQuery)) return;
    results.push({
      type: 'tarefa',
      page: 'tasks',
      title: task.title,
      meta: `${task.status} | ${task.visibility === TASK_VISIBILITY_PUBLIC ? 'publica' : 'privada'}`,
      description: toShortText(task.description || 'Sem descricao adicional.', 160),
      sortAt: Number(task.updatedAt) || Number(task.createdAt) || 0
    });
  });

  announcements.forEach((announcement) => {
    if ((Number(announcement.deletedAt) || 0) > 0) return;
    const haystack = buildSearchText([announcement.title, announcement.content, announcement.author, announcement.audience]);
    if (!haystack.includes(normalizedQuery)) return;
    results.push({
      type: 'comunicado',
      page: 'announcements',
      title: announcement.title,
      meta: `Por ${announcement.author || 'sistema'}`,
      description: toShortText(announcement.content || '', 160),
      sortAt: Number(announcement.createdAt) || 0
    });
  });

  logs.slice(-220).forEach((entry) => {
    const haystack = buildSearchText([entry.user, entry.action]);
    if (!haystack.includes(normalizedQuery)) return;
    results.push({
      type: 'log',
      page: canViewLogs() ? 'logs' : 'dashboard',
      title: entry.action,
      meta: `${entry.user} | ${formatDateTime(entry.timestamp)}`,
      description: 'Registro operacional encontrado na trilha de auditoria.',
      sortAt: Number(entry.timestamp) || 0
    });
  });

  return results
    .sort((a, b) => b.sortAt - a.sortAt)
    .slice(0, 60);
}

function getScopedTickets() {
  if (!session) return [];
  if (session.role === 'superadmin') return [...tickets];
  if (session.role === 'admin') {
    return tickets.filter((ticket) => ticket.assignedAdmin === session.username || ticket.creator === session.username);
  }
  return tickets.filter((ticket) => ticket.creator === session.username);
}

function normalizeTaskVisibility(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === TASK_VISIBILITY_PUBLIC
    ? TASK_VISIBILITY_PUBLIC
    : TASK_VISIBILITY_PRIVATE;
}

function getTaskResponsibleUsername(task) {
  if (!task) return '';
  const visibility = normalizeTaskVisibility(task.visibility);
  if (visibility === TASK_VISIBILITY_PUBLIC) {
    return String(task.assignedTo || '').trim();
  }
  return String(task.owner || task.createdBy || '').trim();
}

function isTaskVisibleToSession(task, targetSession = session) {
  if (!task || !targetSession) return false;
  if ((Number(task.deletedAt) || 0) > 0) return false;
  const visibility = normalizeTaskVisibility(task.visibility);
  if (visibility === TASK_VISIBILITY_PUBLIC) return true;
  const viewer = String(targetSession.username || '').trim().toLowerCase();
  const owner = String(task.owner || task.createdBy || '').trim().toLowerCase();
  const creator = String(task.createdBy || task.owner || '').trim().toLowerCase();
  return viewer && (viewer === owner || viewer === creator);
}

function canSessionManageTask(task, targetSession = session) {
  if (!task || !targetSession) return false;
  if (isAdminRole(targetSession.role)) return true;
  const viewer = String(targetSession.username || '').trim().toLowerCase();
  const creator = String(task.createdBy || task.owner || '').trim().toLowerCase();
  return Boolean(viewer && viewer === creator);
}

function canSessionMoveTask(task, targetSession = session) {
  if (!task || !targetSession) return false;
  if (canSessionManageTask(task, targetSession)) return true;
  const visibility = normalizeTaskVisibility(task.visibility);
  if (visibility !== TASK_VISIBILITY_PUBLIC) return false;
  const viewer = String(targetSession.username || '').trim().toLowerCase();
  const assigned = String(task.assignedTo || '').trim().toLowerCase();
  return Boolean(viewer && assigned && viewer === assigned);
}

function getUserTasks() {
  if (!session) return [];
  const viewer = String(session.username || '').trim().toLowerCase();
  return tasks.filter((task) => {
    if (!isTaskVisibleToSession(task)) return false;
    if (isAdminRole(session.role)) return true;
    const visibility = normalizeTaskVisibility(task.visibility);
    if (visibility === TASK_VISIBILITY_PUBLIC) {
      const assigned = String(task.assignedTo || '').trim().toLowerCase();
      const creator = String(task.createdBy || task.owner || '').trim().toLowerCase();
      return Boolean(viewer && (assigned === viewer || creator === viewer));
    }
    return true;
  });
}

function getUserNotes() {
  if (!session) return [];
  return notes.filter((note) => note.owner === session.username);
}

function toShortText(text, maxLength) {
  const clean = String(text || '').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 3)}...`;
}

function initData() {
  const storedUsers = safeParse(storageGetItem(STORAGE_KEYS.users), null);
  const storedTickets = safeParse(storageGetItem(STORAGE_KEYS.tickets), []);
  const storedLogs = safeParse(storageGetItem(STORAGE_KEYS.logs), []);
  const storedTasks = safeParse(storageGetItem(STORAGE_KEYS.tasks), []);
  const storedNotes = safeParse(storageGetItem(STORAGE_KEYS.notes), []);
  const storedAnnouncements = safeParse(storageGetItem(STORAGE_KEYS.announcements), []);
  const storedSettings = safeParse(storageGetItem(STORAGE_KEYS.settings), {});
  settings = normalizeSettings(storedSettings);

  if (Array.isArray(storedUsers) && storedUsers.length > 0) {
    users = storedUsers.map(normalizeUser);
  } else {
    users = [
      normalizeUser({ username: 'esther', role: 'superadmin', status: 'active', debt: 0 }),
      normalizeUser({ username: 'belle', role: 'admin', status: 'active', debt: 0 }),
      normalizeUser({ username: 'felps', role: 'member', status: 'active', debt: 0 }),
      normalizeUser({ username: 'lia', role: 'member', status: 'active', debt: 0 }),
      normalizeUser({ username: 'inteligencia tp', role: 'inteligencia', status: 'active', debt: 0 })
    ];
  }

  ensureCoreUsers();

  tickets = Array.isArray(storedTickets) ? storedTickets.map(normalizeTicket) : [];
  logs = Array.isArray(storedLogs)
    ? capLogs(storedLogs.map(normalizeLogEntry))
    : [];
  tasks = Array.isArray(storedTasks) ? storedTasks.map(normalizeTask) : [];
  notes = Array.isArray(storedNotes) ? storedNotes.map(normalizeNote) : [];

  if (Array.isArray(storedAnnouncements) && storedAnnouncements.length > 0) {
    announcements = storedAnnouncements.map(normalizeAnnouncement);
  } else {
    announcements = [
      normalizeAnnouncement({
        id: createId(),
        title: 'Bem-vindo ao TP Portal Pro',
        content: 'Use o menu para abrir tickets, acompanhar tarefas e acessar ferramentas rapidas.',
        author: 'sistema',
        audience: 'all',
        createdAt: Date.now()
      })
    ];
  }

  applyDefaultPasswordMigration();
  const initialHash = getAppStateSyncHash(collectAppStateForSync());
  lastAppliedAppStateHash = initialHash;
  lastSentAppStateHash = initialHash;

  saveData();
}

function normalizeUser(user) {
  const source = user && typeof user === 'object' && !Array.isArray(user) ? user : {};
  const normalizedUsername = String(source.username || '').trim() || `usuario-${createId()}`;
  const debt = Math.max(0, Number(source.debt) || 0);
  const totalPaid = Math.max(0, Number(source.totalPaid) || 0);
  const walletProfit = Math.max(0, Number(source.walletProfit) || 0);
  const rawTotalCharged = Number(source.totalCharged);
  const settledPaid = Math.max(0, totalPaid - walletProfit);
  const minCharged = debt + settledPaid;
  const totalCharged = Number.isFinite(rawTotalCharged) ? Math.max(rawTotalCharged, minCharged) : minCharged;
  const emergencyLoanOutstanding = Math.max(0, Number(source.emergencyLoanOutstanding) || 0);
  const accessCount = Math.max(0, Number(source.accessCount) || 0);
  const lastLoginAt = Math.max(0, Number(source.lastLoginAt) || 0);
  const lastLogoutAt = Math.max(0, Number(source.lastLogoutAt) || 0);
  const normalizedRole = isKnownRole(source.role) ? normalizeRoleKey(source.role) : 'member';
  const displayName = normalizeDisplayName(source.displayName, normalizedUsername);
  const avatarDataUrl = sanitizeAvatarDataUrl(source.avatarDataUrl);
  const hasRawAvatarField = Object.prototype.hasOwnProperty.call(source, 'avatarDataUrl');
  const fallbackAvatarUpdatedAt = hasRawAvatarField
    ? Math.max(0, Number(source.profileUpdatedAt) || 0, avatarDataUrl ? 1 : 0)
    : (avatarDataUrl ? Math.max(1, Number(source.profileUpdatedAt) || 0) : 0);
  const walletAccessEnabled = normalizedRole === 'member'
    ? true
    : (normalizedRole === 'admin'
      ? (typeof source.walletAccessEnabled === 'boolean' ? source.walletAccessEnabled : false)
      : false);
  const canReceiveWalletChart = canRoleReceiveWalletChart(normalizedRole);
  const walletChartEnabled = canReceiveWalletChart
    ? (
      typeof source.walletChartEnabled === 'boolean'
        ? source.walletChartEnabled
        : (normalizedRole === 'member' ? shouldDefaultWalletChartEnabled(normalizedUsername) : false)
    )
    : false;
  const financeHistory = Array.isArray(source.financeHistory)
    ? source.financeHistory
        .map((entry) => ({
          id: Number(entry.id) || createId(),
          type: ['charge', 'payment', 'loan', 'adjustment'].includes(entry.type) ? entry.type : 'adjustment',
          amount: Math.max(0, Number(entry.amount) || 0),
          note: String(entry.note || ''),
          actor: String(entry.actor || 'sistema'),
          timestamp: Number(entry.timestamp) || Date.now()
        }))
        .filter((entry) => entry.amount > 0)
        .slice(-400)
    : [];
  const fallbackStatusUpdatedAt = source.status === 'blocked' ? 1 : 0;
  const fallbackPasswordUpdatedAt = Number(source.passwordUpdatedAt) > 0 ? 1 : 0;
  const fallbackRoleUpdatedAt = normalizedRole !== 'member' ? 1 : 0;
  const fallbackPrivateChatLimitUpdatedAt = source.privateChatDailyLimit !== null && source.privateChatDailyLimit !== undefined ? 1 : 0;
  const fallbackWalletHealthUpdatedAt = normalizeWalletHealth(source.walletHealth) !== 'boa' ? 1 : 0;
  const fallbackWalletChartUpdatedAt = typeof source.walletChartEnabled === 'boolean' ? 1 : 0;
  const fallbackWalletAccessUpdatedAt = typeof source.walletAccessEnabled === 'boolean' ? 1 : (normalizedRole === 'member' ? 1 : 0);
  const fallbackProfileUpdatedAt = (displayName.toLowerCase() !== normalizedUsername.toLowerCase() || avatarDataUrl) ? 1 : 0;
  const fallbackBillingUpdatedAt = source.billingProfile && typeof source.billingProfile === 'object' && !Array.isArray(source.billingProfile) ? 1 : 0;
  const statusUpdatedAt = Math.max(0, Number(source.statusUpdatedAt) || fallbackStatusUpdatedAt);
  const passwordUpdatedAt = Math.max(0, Number(source.passwordUpdatedAt) || fallbackPasswordUpdatedAt);
  const roleUpdatedAt = Math.max(0, Number(source.roleUpdatedAt) || fallbackRoleUpdatedAt);
  const privateChatLimitUpdatedAt = Math.max(0, Number(source.privateChatLimitUpdatedAt) || fallbackPrivateChatLimitUpdatedAt);
  const walletHealthUpdatedAt = Math.max(0, Number(source.walletHealthUpdatedAt) || fallbackWalletHealthUpdatedAt);
  const walletChartUpdatedAt = Math.max(0, Number(source.walletChartUpdatedAt) || fallbackWalletChartUpdatedAt);
  const walletAccessUpdatedAt = Math.max(0, Number(source.walletAccessUpdatedAt) || fallbackWalletAccessUpdatedAt);
  const avatarUpdatedAt = Math.max(0, Number(source.avatarUpdatedAt) || fallbackAvatarUpdatedAt);
  const profileUpdatedAt = Math.max(0, Number(source.profileUpdatedAt) || fallbackProfileUpdatedAt);
  const billingUpdatedAt = Math.max(0, Number(source.billingUpdatedAt) || fallbackBillingUpdatedAt);
  const financeUpdatedAt = Math.max(
    Math.max(0, Number(source.financeUpdatedAt) || 0),
    ...financeHistory.map((entry) => Math.max(0, Number(entry.timestamp) || 0))
  );
  const defaultMemberLimit = Math.max(0, Number(settings.memberPrivateChatDailyLimit) || DEFAULT_MEMBER_PRIVATE_CHAT_LIMIT);
  const rawPrivateLimit = source.privateChatDailyLimit;
  let privateChatDailyLimit = null;
  if (rawPrivateLimit !== null && rawPrivateLimit !== undefined && String(rawPrivateLimit).trim() !== '') {
    const parsedLimit = Number(rawPrivateLimit);
    if (Number.isFinite(parsedLimit) && parsedLimit >= 0) {
      privateChatDailyLimit = Math.min(999, Math.floor(parsedLimit));
    }
  }
  if (normalizedRole === 'member' && privateChatDailyLimit === null) {
    privateChatDailyLimit = defaultMemberLimit;
  }
  if (isRoleAboveMember(normalizedRole)) {
    privateChatDailyLimit = null;
  }
  const usageSource = source.privateChatUsage && typeof source.privateChatUsage === 'object' && !Array.isArray(source.privateChatUsage)
    ? source.privateChatUsage
    : {};
  const usageDate = String(usageSource.date || usageSource.day || '').trim();
  const usageCount = Math.max(0, Math.floor(Number(usageSource.used) || 0));
  const privateChatUsage = /^\d{4}-\d{2}-\d{2}$/.test(usageDate)
    ? { date: usageDate, used: usageCount }
    : { date: '', used: 0 };
  const walletHealth = normalizeWalletHealth(source.walletHealth);
  const billingProfile = normalizeUserBillingProfile(source.billingProfile, billingUpdatedAt);
  const normalizedBillingUpdatedAt = Math.max(0, billingUpdatedAt, Number(billingProfile.updatedAt) || 0);

  return {
    username: normalizedUsername,
    role: normalizedRole,
    status: source.status === 'blocked' ? 'blocked' : 'active',
    debt,
    totalCharged,
    totalPaid,
    walletProfit,
    emergencyLoanOutstanding,
    accessCount,
    lastLoginAt,
    lastLogoutAt,
    displayName,
    avatarDataUrl,
    avatarUpdatedAt,
    profileUpdatedAt,
    walletAccessEnabled,
    walletAccessUpdatedAt,
    walletChartEnabled,
    walletChartUpdatedAt,
    financeHistory,
    privateChatDailyLimit,
    privateChatUsage,
    walletHealth,
    statusUpdatedAt,
    passwordUpdatedAt,
    roleUpdatedAt,
    privateChatLimitUpdatedAt,
    walletHealthUpdatedAt,
    financeUpdatedAt,
    billingProfile,
    billingUpdatedAt: normalizedBillingUpdatedAt
  };
}

function normalizeTicket(ticket) {
  const createdAt = Number(ticket.createdAt) || Number(ticket.id) || Date.now();
  const updatedAt = Number(ticket.updatedAt) || createdAt;
  const normalizedStatus = ['pending', 'active', 'closed'].includes(ticket.status) ? ticket.status : 'pending';
  const normalizedPriority = ['low', 'medium', 'high', 'urgent'].includes(ticket.priority) ? ticket.priority : 'medium';
  const normalizedCategory = Object.keys(CATEGORY_LABELS).includes(ticket.category) ? ticket.category : 'geral';

  const normalizedMessages = Array.isArray(ticket.messages)
    ? ticket.messages
        .map((message) => ({
          sender: String(message.sender || 'sistema'),
          content: String(message.content || ''),
          timestamp: Number(message.timestamp) || Date.now()
        }))
        .filter((message) => message.content.trim().length > 0)
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-MAX_TICKET_MESSAGES)
    : [];

  return {
    id: Number(ticket.id) || createId(),
    title: String(ticket.title || 'Ticket sem titulo'),
    description: String(ticket.description || ''),
    category: normalizedCategory,
    priority: normalizedPriority,
    creator: String(ticket.creator || 'desconhecido'),
    status: normalizedStatus,
    assignedAdmin: ticket.assignedAdmin ? String(ticket.assignedAdmin) : null,
    createdAt,
    updatedAt,
    messages: normalizedMessages
  };
}

function normalizeTask(task) {
  const createdAt = Number(task.createdAt) || Date.now();
  const baseUpdatedAt = Number(task.updatedAt) || createdAt;
  const deletedAt = Math.max(0, Number(task.deletedAt) || 0);
  const updatedAt = Math.max(createdAt, baseUpdatedAt, deletedAt);
  const createdBy = String(task.createdBy || task.owner || '').trim();
  const owner = String(task.owner || createdBy).trim();
  const visibility = normalizeTaskVisibility(task.visibility);
  const rawAssignedTo = String(task.assignedTo || task.assignee || '').trim();
  const assignedTo = visibility === TASK_VISIBILITY_PUBLIC
    ? rawAssignedTo
    : (rawAssignedTo || owner || createdBy);
  return {
    id: Number(task.id) || createId(),
    owner,
    createdBy,
    assignedTo,
    visibility,
    title: String(task.title || 'Tarefa sem titulo'),
    dueDate: task.dueDate ? String(task.dueDate) : '',
    priority: ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium',
    status: TASK_FLOW.includes(task.status) ? task.status : 'todo',
    createdAt,
    updatedAt,
    deletedAt
  };
}

function normalizeNote(note) {
  return {
    id: Number(note.id) || createId(),
    owner: String(note.owner || ''),
    title: String(note.title || 'Nota'),
    content: String(note.content || ''),
    updatedAt: Number(note.updatedAt) || Date.now()
  };
}

function normalizeAnnouncement(item) {
  const createdAt = Number(item.createdAt) || Date.now();
  const rawUpdatedAt = Number(item.updatedAt);
  const baseUpdatedAt = Number.isFinite(rawUpdatedAt) ? rawUpdatedAt : createdAt;
  const deletedAt = Math.max(0, Number(item.deletedAt) || 0);
  const updatedAt = Math.max(createdAt, baseUpdatedAt, deletedAt);
  return {
    id: Number(item.id) || createId(),
    title: String(item.title || 'Comunicado'),
    content: String(item.content || ''),
    author: String(item.author || 'sistema'),
    audience: item.audience === 'team' ? 'team' : 'all',
    createdAt,
    updatedAt,
    deletedAt
  };
}

function normalizeLogEntry(log) {
  return {
    timestamp: Number(log.timestamp) || Date.now(),
    user: String(log.user || 'sistema'),
    action: String(log.action || 'acao nao informada')
  };
}

function capLogs(rawLogs) {
  const source = Array.isArray(rawLogs) ? rawLogs : [];
  return source.slice(-MAX_LOG_ENTRIES);
}

function ticketMessageKey(message) {
  const timestamp = Number(message && message.timestamp) || 0;
  const sender = String(message && message.sender || '').trim().toLowerCase();
  const content = String(message && message.content || '').trim();
  return `${timestamp}:${sender}:${content}`;
}

function normalizeTicketMessages(rawMessages) {
  const source = Array.isArray(rawMessages) ? rawMessages : [];
  const unique = [];
  const seen = new Set();
  source
    .map((message) => ({
      sender: String(message.sender || 'sistema'),
      content: String(message.content || ''),
      timestamp: Number(message.timestamp) || Date.now()
    }))
    .filter((message) => message.content.trim().length > 0)
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach((message) => {
      const key = ticketMessageKey(message);
      if (seen.has(key)) return;
      seen.add(key);
      unique.push(message);
    });
  return unique.slice(-MAX_TICKET_MESSAGES);
}

function areTicketMessageListsEqual(listA, listB) {
  if (!Array.isArray(listA) || !Array.isArray(listB)) return false;
  if (listA.length !== listB.length) return false;
  for (let i = 0; i < listA.length; i += 1) {
    if (ticketMessageKey(listA[i]) !== ticketMessageKey(listB[i])) {
      return false;
    }
  }
  return true;
}

function mergeTicketMessages(remoteMessagesRaw, localMessagesRaw) {
  return normalizeTicketMessages([...(Array.isArray(remoteMessagesRaw) ? remoteMessagesRaw : []), ...(Array.isArray(localMessagesRaw) ? localMessagesRaw : [])]);
}

function mergeTicketsWithLocalData(remoteTicketsRaw, localTicketsRaw) {
  const remoteTickets = Array.isArray(remoteTicketsRaw) ? remoteTicketsRaw.map(normalizeTicket) : [];
  const localTickets = Array.isArray(localTicketsRaw) ? localTicketsRaw.map(normalizeTicket) : [];
  const ticketMap = new Map();
  remoteTickets.forEach((ticket) => {
    ticketMap.set(ticket.id, ticket);
  });

  let changed = false;
  localTickets.forEach((localTicket) => {
    const remoteTicket = ticketMap.get(localTicket.id);
    if (!remoteTicket) {
      ticketMap.set(localTicket.id, localTicket);
      changed = true;
      return;
    }

    const remoteUpdatedAt = Math.max(Number(remoteTicket.updatedAt) || 0, Number(remoteTicket.createdAt) || 0);
    const localUpdatedAt = Math.max(Number(localTicket.updatedAt) || 0, Number(localTicket.createdAt) || 0);
    const mergedMessages = mergeTicketMessages(remoteTicket.messages, localTicket.messages);
    const messagesChanged = !areTicketMessageListsEqual(normalizeTicketMessages(remoteTicket.messages), mergedMessages);

    let candidate = remoteTicket;
    if (localUpdatedAt > remoteUpdatedAt) {
      candidate = { ...remoteTicket, ...localTicket };
      changed = true;
    }
    if (messagesChanged) {
      candidate = { ...candidate, messages: mergedMessages };
      changed = true;
    }

    const latestMessageTs = mergedMessages.length > 0
      ? Math.max(...mergedMessages.map((message) => Number(message.timestamp) || 0))
      : 0;
    const candidateUpdatedAt = Math.max(
      Number(candidate.updatedAt) || 0,
      Number(candidate.createdAt) || 0,
      remoteUpdatedAt,
      localUpdatedAt,
      latestMessageTs
    );
    ticketMap.set(localTicket.id, normalizeTicket({ ...candidate, updatedAt: candidateUpdatedAt, messages: mergedMessages }));
  });

  const mergedTickets = Array.from(ticketMap.values()).map(normalizeTicket);
  if (mergedTickets.length !== remoteTickets.length) {
    changed = true;
  }
  return { tickets: mergedTickets, changed };
}

function mergeLogsWithLocalData(remoteLogsRaw, localLogsRaw) {
  const remoteLogs = Array.isArray(remoteLogsRaw) ? remoteLogsRaw.map(normalizeLogEntry) : [];
  const localLogs = Array.isArray(localLogsRaw) ? localLogsRaw.map(normalizeLogEntry) : [];
  const logMap = new Map();
  remoteLogs.forEach((entry) => {
    logMap.set(`${entry.timestamp}:${entry.user}:${entry.action}`, entry);
  });

  let changed = false;
  localLogs.forEach((entry) => {
    const key = `${entry.timestamp}:${entry.user}:${entry.action}`;
    if (!logMap.has(key)) {
      changed = true;
    }
    logMap.set(key, entry);
  });

  const mergedLogs = capLogs(Array.from(logMap.values()).sort((a, b) => a.timestamp - b.timestamp));
  if (mergedLogs.length !== remoteLogs.length) {
    changed = true;
  }
  return { logs: mergedLogs, changed };
}

function mergeTasksWithLocalData(remoteTasksRaw, localTasksRaw) {
  const remoteTasks = Array.isArray(remoteTasksRaw) ? remoteTasksRaw.map(normalizeTask) : [];
  const localTasks = Array.isArray(localTasksRaw) ? localTasksRaw.map(normalizeTask) : [];
  const taskMap = new Map();
  remoteTasks.forEach((task) => {
    taskMap.set(task.id, task);
  });

  let changed = false;
  localTasks.forEach((localTask) => {
    const remoteTask = taskMap.get(localTask.id);
    if (!remoteTask) {
      taskMap.set(localTask.id, localTask);
      changed = true;
      return;
    }
    const remoteUpdatedAt = Math.max(Number(remoteTask.updatedAt) || 0, Number(remoteTask.createdAt) || 0);
    const localUpdatedAt = Math.max(Number(localTask.updatedAt) || 0, Number(localTask.createdAt) || 0);
    if (localUpdatedAt > remoteUpdatedAt) {
      taskMap.set(localTask.id, localTask);
      changed = true;
    }
  });

  const mergedTasks = Array.from(taskMap.values()).map(normalizeTask);
  if (mergedTasks.length !== remoteTasks.length) {
    changed = true;
  }
  return { tasks: mergedTasks, changed };
}

function mergeNotesWithLocalData(remoteNotesRaw, localNotesRaw) {
  const remoteNotes = Array.isArray(remoteNotesRaw) ? remoteNotesRaw.map(normalizeNote) : [];
  const localNotes = Array.isArray(localNotesRaw) ? localNotesRaw.map(normalizeNote) : [];
  const noteMap = new Map();
  remoteNotes.forEach((note) => {
    noteMap.set(note.id, note);
  });

  let changed = false;
  localNotes.forEach((localNote) => {
    const remoteNote = noteMap.get(localNote.id);
    if (!remoteNote) {
      noteMap.set(localNote.id, localNote);
      changed = true;
      return;
    }
    const remoteUpdatedAt = Number(remoteNote.updatedAt) || 0;
    const localUpdatedAt = Number(localNote.updatedAt) || 0;
    if (localUpdatedAt > remoteUpdatedAt) {
      noteMap.set(localNote.id, localNote);
      changed = true;
    }
  });

  const mergedNotes = Array.from(noteMap.values()).map(normalizeNote);
  if (mergedNotes.length !== remoteNotes.length) {
    changed = true;
  }
  return { notes: mergedNotes, changed };
}

function mergeAnnouncementsWithLocalData(remoteAnnouncementsRaw, localAnnouncementsRaw) {
  const remoteAnnouncements = Array.isArray(remoteAnnouncementsRaw) ? remoteAnnouncementsRaw.map(normalizeAnnouncement) : [];
  const localAnnouncements = Array.isArray(localAnnouncementsRaw) ? localAnnouncementsRaw.map(normalizeAnnouncement) : [];
  const announcementMap = new Map();
  remoteAnnouncements.forEach((item) => {
    announcementMap.set(item.id, item);
  });

  let changed = false;
  localAnnouncements.forEach((localItem) => {
    const remoteItem = announcementMap.get(localItem.id);
    if (!remoteItem) {
      announcementMap.set(localItem.id, localItem);
      changed = true;
      return;
    }
    const remoteUpdatedAt = Math.max(Number(remoteItem.updatedAt) || 0, Number(remoteItem.createdAt) || 0);
    const localUpdatedAt = Math.max(Number(localItem.updatedAt) || 0, Number(localItem.createdAt) || 0);
    if (localUpdatedAt > remoteUpdatedAt) {
      announcementMap.set(localItem.id, localItem);
      changed = true;
    }
  });

  const mergedAnnouncements = Array.from(announcementMap.values()).map(normalizeAnnouncement);
  if (mergedAnnouncements.length !== remoteAnnouncements.length) {
    changed = true;
  }
  return { announcements: mergedAnnouncements, changed };
}

function normalizeStaffChatMessages(rawMessages) {
  const source = Array.isArray(rawMessages) ? rawMessages : [];
  const normalized = source
    .map((message) => ({
      id: Number(message.id) || createId(),
      author: String(message.author || 'sistema').trim() || 'sistema',
      role: isKnownRole(message.role) ? normalizeRoleKey(message.role) : 'member',
      content: String(message.content || '').trim().slice(0, 1200),
      createdAt: Number(message.createdAt) || Date.now()
    }))
    .filter((message) => message.content.length > 0);
  const unique = [];
  const seen = new Set();
  normalized.forEach((message) => {
    const key = `${message.id}:${message.author}:${message.createdAt}:${message.content}`;
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(message);
  });
  return unique.slice(-STAFF_CHAT_MAX_MESSAGES);
}

function normalizeWalletAutomationSettings(rawSettings) {
  const source = rawSettings && typeof rawSettings === 'object' && !Array.isArray(rawSettings) ? rawSettings : {};
  const parsedDueDay = Number(source.dueDay);
  const dueDay = Number.isFinite(parsedDueDay)
    ? Math.max(1, Math.min(28, Math.floor(parsedDueDay)))
    : DEFAULT_WALLET_AUTOMATION_SETTINGS.dueDay;
  const parsedGraceDays = Number(source.graceDays);
  const graceDays = Number.isFinite(parsedGraceDays)
    ? Math.max(0, Math.min(45, Math.floor(parsedGraceDays)))
    : DEFAULT_WALLET_AUTOMATION_SETTINGS.graceDays;
  const parsedFineValue = Number(source.fineValue);
  const fineValue = Number.isFinite(parsedFineValue)
    ? Math.max(0, Math.min(100000, Number(parsedFineValue.toFixed(2))))
    : DEFAULT_WALLET_AUTOMATION_SETTINGS.fineValue;
  const parsedInterestMonthly = Number(source.interestMonthlyPercent);
  const interestMonthlyPercent = Number.isFinite(parsedInterestMonthly)
    ? Math.max(0, Math.min(100, Number(parsedInterestMonthly.toFixed(2))))
    : DEFAULT_WALLET_AUTOMATION_SETTINGS.interestMonthlyPercent;
  const parsedInterestCap = Number(source.interestCapPercent);
  const interestCapPercent = Number.isFinite(parsedInterestCap)
    ? Math.max(0, Math.min(400, Number(parsedInterestCap.toFixed(2))))
    : DEFAULT_WALLET_AUTOMATION_SETTINGS.interestCapPercent;
  const parsedMinDebt = Number(source.minDebtForLateCharge);
  const minDebtForLateCharge = Number.isFinite(parsedMinDebt)
    ? Math.max(0, Math.min(1000000, Number(parsedMinDebt.toFixed(2))))
    : DEFAULT_WALLET_AUTOMATION_SETTINGS.minDebtForLateCharge;
  const fineMode = BILLING_FINE_MODES.includes(source.fineMode)
    ? source.fineMode
    : DEFAULT_WALLET_AUTOMATION_SETTINGS.fineMode;
  const lastRunDay = /^\d{4}-\d{2}-\d{2}$/.test(String(source.lastRunDay || '').trim())
    ? String(source.lastRunDay).trim()
    : '';
  const updatedAt = Math.max(0, Number(source.updatedAt) || 0);
  return {
    enabled: parseBooleanFlag(source.enabled, false),
    dueDay,
    graceDays,
    fineMode,
    fineValue,
    interestMonthlyPercent,
    interestCapPercent,
    minDebtForLateCharge,
    applyToBlockedUsers: parseBooleanFlag(source.applyToBlockedUsers, false),
    autoRunOnWalletControlOpen: parseBooleanFlag(source.autoRunOnWalletControlOpen, false),
    lastRunDay,
    updatedAt
  };
}

function normalizeUserBillingProfile(rawProfile, fallbackUpdatedAt = 0) {
  const source = rawProfile && typeof rawProfile === 'object' && !Array.isArray(rawProfile) ? rawProfile : {};
  const parseOptionalInt = (value, min, max) => {
    if (value === null || value === undefined || String(value).trim() === '') return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return null;
    return Math.max(min, Math.min(max, Math.floor(parsed)));
  };
  const parseOptionalAmount = (value, min = 0, max = 1000000) => {
    if (value === null || value === undefined || String(value).trim() === '') return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return null;
    return Math.max(min, Math.min(max, Number(parsed.toFixed(2))));
  };

  const dueDay = parseOptionalInt(source.dueDay, 1, 28);
  const graceDays = parseOptionalInt(source.graceDays, 0, 45);
  const fineMode = ['default', ...BILLING_FINE_MODES].includes(source.fineMode) ? source.fineMode : 'default';
  const fineValue = parseOptionalAmount(source.fineValue, 0, 100000);
  const interestMonthlyPercent = parseOptionalAmount(source.interestMonthlyPercent, 0, 100);
  const interestCapPercent = parseOptionalAmount(source.interestCapPercent, 0, 400);
  const minDebtForLateCharge = parseOptionalAmount(source.minDebtForLateCharge, 0, 1000000);
  const lateCycleKey = /^\d{4}-\d{2}-\d{2}$/.test(String(source.lateCycleKey || '').trim())
    ? String(source.lateCycleKey).trim()
    : '';
  const fineAppliedCycleKey = /^\d{4}-\d{2}-\d{2}$/.test(String(source.fineAppliedCycleKey || '').trim())
    ? String(source.fineAppliedCycleKey).trim()
    : '';
  const lastAppliedDay = /^\d{4}-\d{2}-\d{2}$/.test(String(source.lastAppliedDay || '').trim())
    ? String(source.lastAppliedDay).trim()
    : '';
  const lateAccruedDays = Math.max(0, Math.floor(Number(source.lateAccruedDays) || 0));
  const cyclePrincipal = Math.max(0, Number(source.cyclePrincipal) || 0);
  const cycleInterestAccrued = Math.max(0, Number(source.cycleInterestAccrued) || 0);
  const updatedAt = Math.max(0, Number(source.updatedAt) || Number(fallbackUpdatedAt) || 0);

  return {
    dueDay,
    graceDays,
    fineMode,
    fineValue,
    interestMonthlyPercent,
    interestCapPercent,
    minDebtForLateCharge,
    paused: parseBooleanFlag(source.paused, false),
    lateCycleKey,
    fineAppliedCycleKey,
    lateAccruedDays,
    cyclePrincipal,
    cycleInterestAccrued,
    lastAppliedDay,
    updatedAt
  };
}

function normalizeSettings(rawSettings) {
  const source = rawSettings && typeof rawSettings === 'object' && !Array.isArray(rawSettings) ? rawSettings : {};
  const monthCandidate = String(source.walletDashboardMonth || '').trim();
  const safeMonth = parseMonthKey(monthCandidate) ? monthCandidate : getCurrentMonthKey();
  const customRoles = normalizeCustomRoles(source.customRoles);
  const parsedPrivateLimit = Number(source.memberPrivateChatDailyLimit);
  const memberPrivateChatDailyLimit = Number.isFinite(parsedPrivateLimit) && parsedPrivateLimit >= 0
    ? Math.min(999, Math.floor(parsedPrivateLimit))
    : DEFAULT_MEMBER_PRIVATE_CHAT_LIMIT;
  const maintenanceUpdatedAt = Math.max(0, Number(source.maintenanceUpdatedAt) || 0);
  const walletChartsVisibilityUpdatedAt = Math.max(0, Number(source.walletChartsVisibilityUpdatedAt) || 0);
  let maintenanceMode = parseBooleanFlag(source.maintenanceMode, false);
  if (maintenanceMode && maintenanceUpdatedAt <= 0) {
    // Legacy states without timestamp could leave everyone blocked forever.
    maintenanceMode = false;
  }
  return {
    maintenanceMode,
    maintenanceMessage:
      String(source.maintenanceMessage || '').trim() || 'Portal temporariamente em manutencao.',
    maintenanceUpdatedAt,
    walletChartsVisibilityMode: normalizeWalletChartsVisibilityMode(source.walletChartsVisibilityMode),
    walletChartsVisibilityUpdatedAt,
    passwordSeed1705Done: parseBooleanFlag(source.passwordSeed1705Done, false),
    walletDashboardMonth: safeMonth,
    memberPrivateChatDailyLimit,
    customRoles,
    staffChatMessages: normalizeStaffChatMessages(source.staffChatMessages),
    walletAutomation: normalizeWalletAutomationSettings(source.walletAutomation)
  };
}

function ensureCoreUsers() {
  const now = Date.now();
  const legacyIndex = users.findIndex((user) => user.username.toLowerCase() === 'inteligenciatp');
  if (legacyIndex >= 0) {
    const hasCurrentName = users.some((user) => user.username.toLowerCase() === 'inteligencia tp');
    if (hasCurrentName) {
      users.splice(legacyIndex, 1);
    } else {
      users[legacyIndex].username = 'inteligencia tp';
      if (users[legacyIndex].role !== 'inteligencia') {
        users[legacyIndex].role = 'inteligencia';
        users[legacyIndex].roleUpdatedAt = Date.now();
      }
      if (users[legacyIndex].status !== 'active') {
        users[legacyIndex].status = 'active';
        users[legacyIndex].statusUpdatedAt = Date.now();
      }
    }
  }

  const requiredUsers = [
    { username: 'esther', role: 'superadmin', lockedRole: true },
    { username: 'belle', role: 'admin', lockedRole: false },
    { username: 'felps', role: 'member', lockedRole: false },
    { username: 'lia', role: 'member', lockedRole: false },
    { username: 'yoon', role: 'member', lockedRole: false },
    { username: 'murilo', role: 'member', lockedRole: false },
    { username: 'matheus', role: 'member', lockedRole: false },
    { username: 'inteligencia tp', role: 'inteligencia', lockedRole: true }
  ];

  requiredUsers.forEach((seed) => {
    const existing = users.find((user) => user.username.toLowerCase() === seed.username.toLowerCase());
    if (!existing) {
      if (!seed.lockedRole) {
        return;
      }
      users.push(
        normalizeUser({
          username: seed.username,
          role: seed.role,
          status: 'active',
          debt: 0
        })
      );
      return;
    }
    if (seed.lockedRole) {
      if (existing.role !== seed.role) {
        existing.role = seed.role;
        existing.roleUpdatedAt = Math.max(Number(existing.roleUpdatedAt) || 0, now);
      }
      if (existing.status !== 'active') {
        existing.status = 'active';
        existing.statusUpdatedAt = Math.max(Number(existing.statusUpdatedAt) || 0, now);
      }
    }
  });
}

function applyDefaultPasswordMigration() {
  settings.passwordSeed1705Done = true;
}

function getPresenceSocketUrl() {
  const list = getPresenceSocketCandidates();
  const idx = Math.max(0, Math.min(list.length - 1, presenceSocketUrlIndex));
  return list[idx];
}

function getPresenceSocketCandidates() {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const explicit = (window.__TP_WS_URL || '').trim();
  const candidates = [];
  if (explicit) {
    candidates.push(explicit);
  }

  const hostname = window.location.hostname || 'localhost';
  const currentPort = Number(window.location.port || (window.location.protocol === 'https:' ? 443 : 80));
  // Always try same-origin WS first, then fallback to dedicated presence port.
  candidates.push(`${protocol}://${window.location.host}/ws`);
  candidates.push(`${protocol}://${window.location.host}/ws/`);
  if (currentPort !== PRESENCE_SOCKET_PORT) {
    candidates.push(`${protocol}://${hostname}:${PRESENCE_SOCKET_PORT}/ws`);
    candidates.push(`${protocol}://${hostname}:${PRESENCE_SOCKET_PORT}/ws/`);
  }
  const unique = [];
  candidates.forEach((candidate) => {
    if (!candidate) return;
    if (!unique.includes(candidate)) unique.push(candidate);
  });
  return unique.length > 0 ? unique : [`${protocol}://${window.location.host}/ws`];
}

function refreshPresenceDependentViews() {
  const now = Date.now();
  const elapsed = now - lastPresenceViewRefreshAt;
  if (elapsed < PRESENCE_VIEW_REFRESH_MIN_MS) {
    if (!presenceViewRefreshTimer) {
      presenceViewRefreshTimer = setTimeout(() => {
        presenceViewRefreshTimer = null;
        refreshPresenceDependentViews();
      }, Math.max(120, PRESENCE_VIEW_REFRESH_MIN_MS - elapsed));
    }
    return;
  }
  lastPresenceViewRefreshAt = now;
  updateConnectionStatusDisplay();
  if (presenceViewRefreshTimer) {
    clearTimeout(presenceViewRefreshTimer);
    presenceViewRefreshTimer = null;
  }
  if (currentPage === 'intelCenter') {
    renderIntelCenter();
    return;
  }
  if (currentPage === 'logs') {
    renderLogs();
    return;
  }
  if (currentPage === 'espionage') {
    renderEspionage();
  }
}

function collectAppStateForSync() {
  return {
    users,
    tickets,
    logs,
    tasks,
    notes,
    announcements,
    settings
  };
}

function getAppStateSyncHash(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return '';
  let serialized = '';
  try {
    serialized = JSON.stringify(state);
  } catch {
    return '';
  }
  let hash = 2166136261;
  for (let i = 0; i < serialized.length; i += 1) {
    hash ^= serialized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `${serialized.length}:${(hash >>> 0).toString(16)}`;
}

function isAppStateEffectivelyEmpty(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return true;
  const usersLen = Array.isArray(state.users) ? state.users.length : 0;
  const ticketsLen = Array.isArray(state.tickets) ? state.tickets.length : 0;
  const logsLen = Array.isArray(state.logs) ? state.logs.length : 0;
  const tasksLen = Array.isArray(state.tasks) ? state.tasks.length : 0;
  const notesLen = Array.isArray(state.notes) ? state.notes.length : 0;
  const annLen = Array.isArray(state.announcements) ? state.announcements.length : 0;
  return usersLen + ticketsLen + logsLen + tasksLen + notesLen + annLen === 0;
}

function canLoadInitialServerState() {
  return typeof window !== 'undefined'
    && typeof fetch === 'function'
    && (window.location.protocol === 'http:' || window.location.protocol === 'https:');
}

async function apiRequest(endpoint, options = {}) {
  if (!canLoadInitialServerState()) {
    throw new Error('API indisponivel neste ambiente.');
  }

  const fetchOptions = {
    method: options.method || 'GET',
    cache: 'no-store',
    credentials: 'same-origin',
    headers: {},
    signal: options.signal
  };

  if (options.body !== undefined) {
    fetchOptions.headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(endpoint, fetchOptions);
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload && payload.message ? payload.message : `Falha na requisicao (${response.status}).`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function loadInitialServerState() {
  if (!canLoadInitialServerState()) return false;

  let timeoutId = null;
  let controller = null;
  try {
    if (typeof AbortController === 'function') {
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        try {
          controller.abort();
        } catch {
          // ignore abort failures
        }
      }, INITIAL_STATE_TIMEOUT_MS);
    }

    const payload = await apiRequest(`${API_BOOTSTRAP_STATE_ENDPOINT}?ts=${Date.now()}`, {
      signal: controller ? controller.signal : undefined
    });
    const remoteState = payload && payload.appState && typeof payload.appState === 'object' && !Array.isArray(payload.appState)
      ? payload.appState
      : null;
    if (!remoteState || isAppStateEffectivelyEmpty(remoteState)) return false;

    const localBefore = collectAppStateForSync();
    const mergedStateResult = mergeIncomingAppStateWithLocal(remoteState, localBefore);
    applySyncedAppState(mergedStateResult.state, { render: false });
    remoteStateInitialized = true;
    initialServerStateLoaded = true;
    return true;
  } catch (error) {
    if (error && error.status === 401) {
      return false;
    }
    console.warn('[bootstrap-state] Falha ao carregar estado inicial do servidor.', error);
    return false;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function ensureInitialServerStateLoaded(options = {}) {
  if (initialServerStateLoaded) {
    return Promise.resolve(true);
  }
  if (initialServerStatePromise) {
    return initialServerStatePromise;
  }

  const forceRetry = Boolean(options.forceRetry);
  if (initialServerStateLoadAttempted && !forceRetry) {
    return Promise.resolve(false);
  }

  initialServerStateLoadAttempted = true;
  initialServerStatePromise = loadInitialServerState()
    .catch(() => false)
    .finally(() => {
      initialServerStatePromise = null;
    });
  return initialServerStatePromise;
}

function resetInitialServerStateTracking() {
  initialServerStateLoaded = false;
  initialServerStateLoadAttempted = false;
  initialServerStatePromise = null;
  remoteStateInitialized = false;
}

async function activateAuthenticatedSession(nextSession, options = {}) {
  const baseSession = nextSession && typeof nextSession === 'object' ? nextSession : {};
  session = {
    username: String(baseSession.username || '').trim().toLowerCase(),
    role: normalizeRoleKey(baseSession.role) || 'member',
    loginAt: Number(baseSession.loginAt) || Date.now()
  };

  const loadedServerState = await ensureInitialServerStateLoaded({ forceRetry: true });
  const hasAnyLocalState = !isAppStateEffectivelyEmpty(collectAppStateForSync());
  if (!loadedServerState && !hasAnyLocalState) {
    throw new Error('Nao foi possivel carregar os dados do servidor.');
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('Usuario autenticado, mas nao encontrado nos dados carregados.');
  }

  if (options.registerAccess) {
    registerUserAccess(currentUser);
    saveData();
  }

  session.username = currentUser.username;
  session.role = currentUser.role;
  session.loginAt = Number(currentUser.lastLoginAt) || Number(baseSession.loginAt) || Date.now();
  writeUiState({ lastUser: currentUser.username });

  updateCurrentUserDisplay();
  updateConnectionStatusDisplay();
  els.loginContainer.classList.add('hidden');
  els.appContainer.classList.remove('hidden');

  renderSidebar();
  navigate(options.page || 'dashboard');
  startClock();
  startPresenceHeartbeat();
  syncStealthFromStorage();
  showLiveBroadcastBanner(readLiveBroadcast());

  if (options.showWelcome) {
    showNotification(`Bem-vindo, ${currentUser.username}.`, 'success');
  }

  return currentUser;
}

async function restoreServerSession() {
  if (sessionRestoreInFlight || session || !canLoadInitialServerState()) return false;
  sessionRestoreInFlight = true;
  try {
    const payload = await apiRequest(API_AUTH_SESSION_ENDPOINT);
    if (!payload || !payload.user) return false;
    await activateAuthenticatedSession({
      username: payload.user.username,
      role: payload.user.role,
      loginAt: Number(payload.createdAt) || Date.now()
    }, {
      registerAccess: false,
      showWelcome: false
    });
    return true;
  } catch (error) {
    if (!error || error.status !== 401) {
      console.warn('[auth-session] Falha ao restaurar sessao.', error);
    }
    session = null;
    return false;
  } finally {
    sessionRestoreInFlight = false;
  }
}

function createUserOnServer(username, role, password = DEFAULT_PASSWORD) {
  return apiRequest(API_ADMIN_USERS_ENDPOINT, {
    method: 'POST',
    body: {
      username,
      role,
      password
    }
  });
}

function resetUserPasswordOnServer(username, newPassword) {
  return apiRequest(`${API_ADMIN_USERS_ENDPOINT}/${encodeURIComponent(username)}/password`, {
    method: 'POST',
    body: { newPassword }
  });
}

function changeOwnPasswordOnServer(currentPassword, newPassword) {
  return apiRequest(API_AUTH_CHANGE_PASSWORD_ENDPOINT, {
    method: 'POST',
    body: {
      currentPassword,
      newPassword
    }
  });
}

function setLoginBusyState(isBusy, label = 'Entrar') {
  if (!els.loginButton) return;
  if (!loginButtonIdleLabel) {
    loginButtonIdleLabel = String(els.loginButton.textContent || 'Entrar');
  }
  els.loginButton.disabled = Boolean(isBusy);
  els.loginButton.textContent = isBusy ? label : loginButtonIdleLabel;
  if (els.usernameInput) {
    els.usernameInput.disabled = Boolean(isBusy);
  }
  if (els.passwordInput) {
    els.passwordInput.disabled = Boolean(isBusy);
  }
}

function mergeLocalUsersIntoRemoteState(remoteUsersRaw, localUsersRaw) {
  const mergedUsers = Array.isArray(remoteUsersRaw) ? remoteUsersRaw.map(normalizeUser) : [];
  const userIndexByName = new Map();
  mergedUsers.forEach((user, index) => {
    userIndexByName.set(String(user.username || '').trim().toLowerCase(), index);
  });

  let changed = false;
  const localUsers = Array.isArray(localUsersRaw) ? localUsersRaw.map(normalizeUser) : [];
  localUsers.forEach((localUser) => {
    const key = String(localUser.username || '').trim().toLowerCase();
    if (!key) return;

    const existingIndex = userIndexByName.get(key);
    if (typeof existingIndex !== 'number') {
      // Do not resurrect users that were removed remotely.
      return;
    }

    const remoteUser = mergedUsers[existingIndex];
    if (!remoteUser) return;

    let localMerged = false;
    const fieldByTimestamp = [
      { field: 'status', ts: 'statusUpdatedAt' },
      { field: 'role', ts: 'roleUpdatedAt' },
      { field: 'displayName', ts: 'profileUpdatedAt' },
      { field: 'avatarDataUrl', ts: 'avatarUpdatedAt' },
      { field: 'privateChatDailyLimit', ts: 'privateChatLimitUpdatedAt' },
      { field: 'walletHealth', ts: 'walletHealthUpdatedAt' },
      { field: 'walletAccessEnabled', ts: 'walletAccessUpdatedAt' },
      { field: 'walletChartEnabled', ts: 'walletChartUpdatedAt' },
      { field: 'billingProfile', ts: 'billingUpdatedAt' }
    ];

    fieldByTimestamp.forEach(({ field, ts }) => {
      const localTs = Math.max(0, Number(localUser[ts]) || 0);
      const remoteTs = Math.max(0, Number(remoteUser[ts]) || 0);
      if (localTs > remoteTs) {
        remoteUser[field] = localUser[field];
        remoteUser[ts] = localTs;
        localMerged = true;
      }
    });

    const localProfileTs = Math.max(0, Number(localUser.profileUpdatedAt) || 0);
    const remoteProfileTs = Math.max(0, Number(remoteUser.profileUpdatedAt) || 0);
    const localAvatarTs = Math.max(0, Number(localUser.avatarUpdatedAt) || 0);
    const remoteAvatarTs = Math.max(0, Number(remoteUser.avatarUpdatedAt) || 0);
    const localAvatar = sanitizeAvatarDataUrl(localUser.avatarDataUrl);
    const remoteAvatar = sanitizeAvatarDataUrl(remoteUser.avatarDataUrl);
    const localDisplayName = normalizeDisplayName(localUser.displayName, localUser.username);
    const remoteDisplayName = normalizeDisplayName(remoteUser.displayName, remoteUser.username);
    const localUserName = String(localUser.username || '').trim();
    const remoteUserName = String(remoteUser.username || '').trim();
    const localHasCustomName = localDisplayName && localDisplayName.toLowerCase() !== localUserName.toLowerCase();
    const remoteHasCustomName = remoteDisplayName && remoteDisplayName.toLowerCase() !== remoteUserName.toLowerCase();
    const canPromoteAvatar = localAvatarTs >= remoteAvatarTs;
    const canPromoteProfile = localProfileTs >= remoteProfileTs;
    if (canPromoteAvatar && localAvatar && !remoteAvatar) {
      remoteUser.avatarDataUrl = localAvatar;
      remoteUser.avatarUpdatedAt = Math.max(remoteAvatarTs, localAvatarTs || 1);
      localMerged = true;
    }
    if (canPromoteProfile && localHasCustomName && !remoteHasCustomName) {
      remoteUser.displayName = localDisplayName;
      remoteUser.profileUpdatedAt = Math.max(remoteProfileTs, localProfileTs || 1);
      localMerged = true;
    }

    const localWalletAccessTs = Math.max(0, Number(localUser.walletAccessUpdatedAt) || 0);
    const remoteWalletAccessTs = Math.max(0, Number(remoteUser.walletAccessUpdatedAt) || 0);
    const localWalletAccess = parseBooleanFlag(localUser.walletAccessEnabled, false);
    const remoteWalletAccess = parseBooleanFlag(remoteUser.walletAccessEnabled, false);
    if (localWalletAccessTs >= remoteWalletAccessTs && localWalletAccess && !remoteWalletAccess) {
      remoteUser.walletAccessEnabled = true;
      remoteUser.walletAccessUpdatedAt = Math.max(remoteWalletAccessTs, localWalletAccessTs || 1);
      localMerged = true;
    }

    const localAccessCount = Math.max(0, Number(localUser.accessCount) || 0);
    const remoteAccessCount = Math.max(0, Number(remoteUser.accessCount) || 0);
    if (localAccessCount > remoteAccessCount) {
      remoteUser.accessCount = localAccessCount;
      localMerged = true;
    }

    const localLoginAt = Math.max(0, Number(localUser.lastLoginAt) || 0);
    const remoteLoginAt = Math.max(0, Number(remoteUser.lastLoginAt) || 0);
    if (localLoginAt > remoteLoginAt) {
      remoteUser.lastLoginAt = localLoginAt;
      localMerged = true;
    }

    const localLogoutAt = Math.max(0, Number(localUser.lastLogoutAt) || 0);
    const remoteLogoutAt = Math.max(0, Number(remoteUser.lastLogoutAt) || 0);
    if (localLogoutAt > remoteLogoutAt) {
      remoteUser.lastLogoutAt = localLogoutAt;
      localMerged = true;
    }

    const localFinanceTs = Math.max(0, Number(localUser.financeUpdatedAt) || 0);
    const remoteFinanceTs = Math.max(0, Number(remoteUser.financeUpdatedAt) || 0);
    if (localFinanceTs > remoteFinanceTs) {
      remoteUser.debt = localUser.debt;
      remoteUser.totalCharged = localUser.totalCharged;
      remoteUser.totalPaid = localUser.totalPaid;
      remoteUser.walletProfit = localUser.walletProfit;
      remoteUser.emergencyLoanOutstanding = localUser.emergencyLoanOutstanding;
      remoteUser.financeHistory = Array.isArray(localUser.financeHistory) ? localUser.financeHistory.slice(-400) : [];
      remoteUser.financeUpdatedAt = localFinanceTs;
      localMerged = true;
    }

    const localUsageDate = String(localUser.privateChatUsage && localUser.privateChatUsage.date || '');
    const remoteUsageDate = String(remoteUser.privateChatUsage && remoteUser.privateChatUsage.date || '');
    const localUsageCount = Math.max(0, Number(localUser.privateChatUsage && localUser.privateChatUsage.used) || 0);
    const remoteUsageCount = Math.max(0, Number(remoteUser.privateChatUsage && remoteUser.privateChatUsage.used) || 0);
    if (
      (localUsageDate > remoteUsageDate)
      || (localUsageDate === remoteUsageDate && localUsageCount > remoteUsageCount)
    ) {
      remoteUser.privateChatUsage = { date: localUsageDate, used: localUsageCount };
      localMerged = true;
    }

    if (localMerged) {
      changed = true;
      mergedUsers[existingIndex] = normalizeUser(remoteUser);
    }
  });

  return { users: mergedUsers, changed };
}

function mergeIncomingAppStateWithLocal(rawRemoteState, localState) {
  const remoteState = rawRemoteState && typeof rawRemoteState === 'object' && !Array.isArray(rawRemoteState)
    ? rawRemoteState
    : {};
  const safeLocalState = localState && typeof localState === 'object' && !Array.isArray(localState)
    ? localState
    : {};

  const mergedState = {
    users: Array.isArray(remoteState.users) ? remoteState.users : [],
    tickets: Array.isArray(remoteState.tickets) ? remoteState.tickets : [],
    logs: Array.isArray(remoteState.logs) ? remoteState.logs : [],
    tasks: Array.isArray(remoteState.tasks) ? remoteState.tasks : [],
    notes: Array.isArray(remoteState.notes) ? remoteState.notes : [],
    announcements: Array.isArray(remoteState.announcements) ? remoteState.announcements : [],
    settings: remoteState.settings && typeof remoteState.settings === 'object' && !Array.isArray(remoteState.settings)
      ? remoteState.settings
      : {}
  };

  let changed = false;
  const remoteSettings = normalizeSettings(mergedState.settings);
  const localSettings = normalizeSettings(safeLocalState.settings || {});
  const remoteMaintenanceTs = Math.max(0, Number(remoteSettings.maintenanceUpdatedAt) || 0);
  const localMaintenanceTs = Math.max(0, Number(localSettings.maintenanceUpdatedAt) || 0);
  if (localMaintenanceTs > remoteMaintenanceTs) {
    remoteSettings.maintenanceMode = localSettings.maintenanceMode;
    remoteSettings.maintenanceMessage = localSettings.maintenanceMessage;
    remoteSettings.maintenanceUpdatedAt = localMaintenanceTs;
    changed = true;
  } else if (remoteMaintenanceTs === 0 && localMaintenanceTs === 0 && remoteSettings.maintenanceMode && !localSettings.maintenanceMode) {
    remoteSettings.maintenanceMode = false;
    remoteSettings.maintenanceMessage = localSettings.maintenanceMessage || remoteSettings.maintenanceMessage;
    changed = true;
  }
  const remoteChartsVisibilityTs = Math.max(0, Number(remoteSettings.walletChartsVisibilityUpdatedAt) || 0);
  const localChartsVisibilityTs = Math.max(0, Number(localSettings.walletChartsVisibilityUpdatedAt) || 0);
  if (localChartsVisibilityTs > remoteChartsVisibilityTs) {
    remoteSettings.walletChartsVisibilityMode = normalizeWalletChartsVisibilityMode(localSettings.walletChartsVisibilityMode);
    remoteSettings.walletChartsVisibilityUpdatedAt = localChartsVisibilityTs;
    changed = true;
  }
  if (localSettings.passwordSeed1705Done && !remoteSettings.passwordSeed1705Done) {
    remoteSettings.passwordSeed1705Done = true;
    changed = true;
  }
  const mergedCustomRoles = normalizeCustomRoles([
    ...remoteSettings.customRoles,
    ...localSettings.customRoles
  ]);
  if (JSON.stringify(mergedCustomRoles) !== JSON.stringify(remoteSettings.customRoles)) {
    remoteSettings.customRoles = mergedCustomRoles;
    changed = true;
  }
  const mergedStaffChat = normalizeStaffChatMessages([
    ...remoteSettings.staffChatMessages,
    ...localSettings.staffChatMessages
  ]);
  if (JSON.stringify(mergedStaffChat) !== JSON.stringify(remoteSettings.staffChatMessages)) {
    remoteSettings.staffChatMessages = mergedStaffChat;
    changed = true;
  }
  const remoteWalletAutomationTs = Math.max(0, Number(remoteSettings.walletAutomation && remoteSettings.walletAutomation.updatedAt) || 0);
  const localWalletAutomationTs = Math.max(0, Number(localSettings.walletAutomation && localSettings.walletAutomation.updatedAt) || 0);
  if (localWalletAutomationTs > remoteWalletAutomationTs) {
    remoteSettings.walletAutomation = normalizeWalletAutomationSettings(localSettings.walletAutomation);
    changed = true;
  }
  mergedState.settings = remoteSettings;

  // Normalize users using merged role definitions, avoiding custom-role downgrades.
  const previousSettings = settings;
  settings = remoteSettings;
  const mergedUsersResult = mergeLocalUsersIntoRemoteState(mergedState.users, safeLocalState.users);
  settings = previousSettings;
  mergedState.users = mergedUsersResult.users;
  changed = changed || mergedUsersResult.changed;

  const mergedTicketsResult = mergeTicketsWithLocalData(mergedState.tickets, safeLocalState.tickets);
  mergedState.tickets = mergedTicketsResult.tickets;
  changed = changed || mergedTicketsResult.changed;

  const mergedLogsResult = mergeLogsWithLocalData(mergedState.logs, safeLocalState.logs);
  mergedState.logs = mergedLogsResult.logs;
  changed = changed || mergedLogsResult.changed;

  const mergedTasksResult = mergeTasksWithLocalData(mergedState.tasks, safeLocalState.tasks);
  mergedState.tasks = mergedTasksResult.tasks;
  changed = changed || mergedTasksResult.changed;

  const mergedNotesResult = mergeNotesWithLocalData(mergedState.notes, safeLocalState.notes);
  mergedState.notes = mergedNotesResult.notes;
  changed = changed || mergedNotesResult.changed;

  const mergedAnnouncementsResult = mergeAnnouncementsWithLocalData(
    mergedState.announcements,
    safeLocalState.announcements
  );
  mergedState.announcements = mergedAnnouncementsResult.announcements;
  changed = changed || mergedAnnouncementsResult.changed;

  return { state: mergedState, changed };
}

function schedulePresenceSocketReconnect() {
  if (!session) return;
  if (presenceSocketReconnectTimer) return;
  presenceSocketReconnectTimer = setTimeout(() => {
    presenceSocketReconnectTimer = null;
    connectPresenceSocket();
  }, PRESENCE_SOCKET_RECONNECT_MS);
}

function scheduleAppStateSync() {
  if (remoteStateApplying) return;
  if (!presenceSocketConnected || !remoteStateInitialized) return;
  if (appStateSyncTimer) return;

  appStateSyncTimer = setTimeout(() => {
    appStateSyncTimer = null;
    const state = collectAppStateForSync();
    const nextHash = getAppStateSyncHash(state);
    if (nextHash && nextHash === lastSentAppStateHash) {
      wsDebugLog('skip app_state_sync unchanged');
      return;
    }
    if (nextHash) {
      lastSentAppStateHash = nextHash;
    }
    wsDebugLog('send app_state_sync', {
      users: Array.isArray(state.users) ? state.users.length : 0,
      tickets: Array.isArray(state.tickets) ? state.tickets.length : 0,
      logs: Array.isArray(state.logs) ? state.logs.length : 0,
      tasks: Array.isArray(state.tasks) ? state.tasks.length : 0
    });
    sendPresenceSocketMessage({
      type: 'app_state_sync',
      origin: SYNC_CLIENT_ID,
      state
    });
  }, APP_STATE_SYNC_DEBOUNCE_MS);
}

function persistLocalDataOnly() {
  logs = capLogs(logs.map(normalizeLogEntry));
  storageSetItem(STORAGE_KEYS.users, JSON.stringify(users));
  storageSetItem(STORAGE_KEYS.tickets, JSON.stringify(tickets));
  storageSetItem(STORAGE_KEYS.logs, JSON.stringify(logs));
  storageSetItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  storageSetItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  storageSetItem(STORAGE_KEYS.announcements, JSON.stringify(announcements));
  storageSetItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function applySyncedAppState(rawState, options = {}) {
  if (!rawState || typeof rawState !== 'object' || Array.isArray(rawState)) return false;
  const incomingHash = getAppStateSyncHash(rawState);
  const localBeforeHash = getAppStateSyncHash(collectAppStateForSync());
  if (incomingHash && incomingHash === localBeforeHash) {
    lastAppliedAppStateHash = incomingHash;
    return false;
  }
  if (incomingHash && incomingHash === lastAppliedAppStateHash) {
    return false;
  }
  remoteStateApplying = true;
  try {
    pendingSaveDataFlush = false;
    settings = normalizeSettings(rawState.settings || settings);
    users = Array.isArray(rawState.users) ? rawState.users.map(normalizeUser) : users;
    tickets = Array.isArray(rawState.tickets) ? rawState.tickets.map(normalizeTicket) : tickets;
    logs = Array.isArray(rawState.logs)
      ? capLogs(rawState.logs.map(normalizeLogEntry))
      : logs;
    tasks = Array.isArray(rawState.tasks) ? rawState.tasks.map(normalizeTask) : tasks;
    notes = Array.isArray(rawState.notes) ? rawState.notes.map(normalizeNote) : notes;
    announcements = Array.isArray(rawState.announcements) ? rawState.announcements.map(normalizeAnnouncement) : announcements;
    ensureCoreUsers();
    if (session && !getCurrentUser()) {
      const sessionKey = String(session.username || '').trim().toLowerCase();
      const canRestoreLockedUser = sessionKey === 'esther' || sessionKey === 'inteligencia tp';
      if (canRestoreLockedUser) {
        users.push(
          normalizeUser({
            username: session.username,
            role: session.role || 'member',
            status: 'active',
            debt: 0
          })
        );
      }
    }
    persistLocalDataOnly();
    syncSessionFromUsers({ source: 'app_state_sync', notify: true });
    lastAppliedAppStateHash = incomingHash || getAppStateSyncHash(collectAppStateForSync());
  } finally {
    remoteStateApplying = false;
  }

  if (options.render && session) {
    requestRealtimeRender();
  }
  return true;
}

function sendPresenceSocketMessage(payload) {
  if (!presenceSocket || presenceSocket.readyState !== WebSocket.OPEN) return;
  try {
    wsDebugLog('ws.send', payload.type || 'unknown');
    presenceSocket.send(JSON.stringify(payload));
  } catch {
    // ignore transport failures; reconnect flow handles it
  }
}

function connectPresenceSocket() {
  if (!session) return;
  if (presenceSocket && (presenceSocket.readyState === WebSocket.OPEN || presenceSocket.readyState === WebSocket.CONNECTING)) return;

  presenceSocketManualClose = false;
  presenceSocketAuthenticated = false;
  remoteStateInitialized = false;
  if (presenceInitFallbackTimer) {
    clearTimeout(presenceInitFallbackTimer);
    presenceInitFallbackTimer = null;
  }
  presenceSocketUrlCandidates = getPresenceSocketCandidates();
  if (presenceSocketUrlIndex >= presenceSocketUrlCandidates.length) {
    presenceSocketUrlIndex = 0;
  }
  const socketUrl = getPresenceSocketUrl();
  let socket;
  try {
    socket = new WebSocket(socketUrl);
  } catch {
    if (!presenceSocketWarned) {
      showNotification('Servidor de presenca offline. Online global desativado temporariamente.', 'warning');
      presenceSocketWarned = true;
    }
    schedulePresenceSocketReconnect();
    return;
  }

  presenceSocket = socket;
  wsDebugLog('ws.connect', socketUrl);

  socket.addEventListener('open', () => {
    if (presenceSocket !== socket || !session) return;
    presenceSocketConnected = true;
    presenceSocketAuthenticated = false;
    presenceAuthRecoveryAttempted = false;
    presenceCompatAuthAccepted = false;
    presenceSocketWarned = false;
    presenceSocketUrlIndex = 0;
    updateConnectionStatusDisplay();
    wsDebugLog('ws.open');
    sendPresenceSocketMessage({ type: 'auth' });
    presenceInitFallbackTimer = setTimeout(() => {
      if (!session || presenceSocket !== socket || !presenceSocketConnected) return;
      if (!presenceSocketAuthenticated) {
        wsDebugLog('auth retry');
        sendPresenceSocketMessage({ type: 'auth' });
        return;
      }
      if (!remoteStateInitialized) {
        wsDebugLog('state_request retry');
        sendPresenceSocketMessage({ type: 'state_request' });
      }
    }, 1800);
  });

  socket.addEventListener('message', (event) => {
    let payload = null;
    try {
      payload = JSON.parse(event.data);
    } catch {
      return;
    }
    if (!payload || typeof payload !== 'object') return;
    wsDebugLog('ws.message', payload.type || 'unknown', payload.origin || '');

    const compatAuthPayload = payload.type === 'snapshot'
      || payload.type === 'app_state_sync'
      || payload.type === 'stealth_sync'
      || payload.type === 'live_broadcast_sync';
    if (
      compatAuthPayload
      && !presenceSocketAuthenticated
      && !presenceCompatAuthAccepted
      && session
      && presenceSocket === socket
    ) {
      // Compatibility: older WS servers may not emit auth_ack explicitly.
      presenceCompatAuthAccepted = true;
      presenceSocketAuthenticated = true;
      presenceAuthRecoveryAttempted = false;
      wsDebugLog('auth compat accepted via', payload.type);
      sendPresenceSocketMessage({
        type: 'presence',
        username: session.username,
        role: session.role,
        page: currentPage || 'dashboard',
        loginAt: Number(session.loginAt) || Date.now(),
        lastSeen: Date.now()
      });
      sendPresenceSocketMessage({ type: 'snapshot_request' });
      sendPresenceSocketMessage({ type: 'state_request' });
    }

    if (payload.type === 'auth_required') {
      if (!session || presenceSocket !== socket) return;
      sendPresenceSocketMessage({ type: 'auth' });
      return;
    }

    if (payload.type === 'auth_ack') {
      if (!session || presenceSocket !== socket) return;
      if (payload.username && sameUsername(payload.username, session.username) === false) {
        session.username = String(payload.username).trim() || session.username;
      }
      if (payload.role && isKnownRole(payload.role) && session.role !== normalizeRoleKey(payload.role)) {
        session.role = normalizeRoleKey(payload.role);
      }
      presenceSocketAuthenticated = true;
      presenceAuthRecoveryAttempted = false;
      presenceCompatAuthAccepted = true;
      updateCurrentUserDisplay();
      updateConnectionStatusDisplay();
      sendPresenceSocketMessage({
        type: 'presence',
        username: session.username,
        role: session.role,
        page: currentPage || 'dashboard',
        loginAt: Number(session.loginAt) || Date.now(),
        lastSeen: Date.now()
      });
      sendPresenceSocketMessage({ type: 'snapshot_request' });
      sendPresenceSocketMessage({ type: 'state_request' });
      return;
    }

    if (payload.type === 'auth_error') {
      if (!presenceAuthRecoveryAttempted && session && presenceSocket === socket) {
        presenceAuthRecoveryAttempted = true;
        wsDebugLog('auth_error recovery retry');
        try {
          socket.close();
        } catch {
          // ignore close failures on recovery
        }
        schedulePresenceSocketReconnect();
        return;
      }
      if (!presenceSocketWarned) {
        showNotification(payload.message || 'Falha na autenticacao do socket de presenca.', 'error');
      }
      // Keep local session active and only disable realtime/presence when WS auth fails.
      stopPresenceHeartbeat();
      presenceSocketWarned = true;
      updateConnectionStatusDisplay();
      return;
    }

    if (payload.type === 'permission_error') {
      showNotification(payload.message || 'Operacao bloqueada pelo servidor.', 'warning');
      return;
    }

    if (payload.type === 'snapshot' && payload.presence && typeof payload.presence === 'object' && !Array.isArray(payload.presence)) {
      sharedPresenceMap = payload.presence;
      writePresenceMap(sharedPresenceMap);
      refreshPresenceDependentViews();
      return;
    }

    if (payload.type === 'app_state_sync' && payload.state && typeof payload.state === 'object' && !Array.isArray(payload.state)) {
      const localBefore = collectAppStateForSync();
      const remoteLooksEmpty = isAppStateEffectivelyEmpty(payload.state);
      const localHasData = !isAppStateEffectivelyEmpty(localBefore);

      if (payload.origin && payload.origin === SYNC_CLIENT_ID) {
        remoteStateInitialized = true;
        lastAppliedAppStateHash = getAppStateSyncHash(payload.state);
        wsDebugLog('app_state_sync ack (self)');
        return;
      }

      const mergedStateResult = mergeIncomingAppStateWithLocal(payload.state, localBefore);

      applySyncedAppState(mergedStateResult.state, { render: true });
      remoteStateInitialized = true;
      wsDebugLog('app_state_sync applied', payload.origin || 'remote');

      if (remoteLooksEmpty && localHasData) {
        const seedHash = getAppStateSyncHash(localBefore);
        if (seedHash) {
          lastSentAppStateHash = seedHash;
        }
        sendPresenceSocketMessage({
          type: 'app_state_sync',
          origin: SYNC_CLIENT_ID,
          seed: true,
          state: localBefore
        });
        applySyncedAppState(localBefore, { render: true });
      } else if (mergedStateResult.changed) {
        const mergedState = collectAppStateForSync();
        const mergedHash = getAppStateSyncHash(mergedState);
        if (mergedHash && mergedHash === lastSentAppStateHash) {
          wsDebugLog('skip app_state_sync merge unchanged');
          return;
        }
        if (mergedHash) {
          lastSentAppStateHash = mergedHash;
        }
        sendPresenceSocketMessage({
          type: 'app_state_sync',
          origin: SYNC_CLIENT_ID,
          merge: true,
          state: mergedState
        });
      }
      return;
    }

    if (payload.type === 'stealth_sync' && payload.bus && typeof payload.bus === 'object' && !Array.isArray(payload.bus)) {
      const safeBus = {
        sessions: Array.isArray(payload.bus.sessions) ? payload.bus.sessions.map(normalizeStealthSession) : []
      };
      storageSetItem(STORAGE_KEYS.stealthBus, JSON.stringify(safeBus));
      syncStealthFromStorage();
      return;
    }

    if (payload.type === 'live_broadcast_sync' && payload.payload && typeof payload.payload === 'object' && !Array.isArray(payload.payload)) {
      storageSetItem(STORAGE_KEYS.liveBroadcast, JSON.stringify(payload.payload));
      showLiveBroadcastBanner(readLiveBroadcast());
      if (currentPage === 'espionage' && !shouldDeferRealtimeRenderForPage('espionage')) {
        renderEspionage();
      }
    }
  });

  socket.addEventListener('error', () => {
    wsDebugLog('ws.error');
    if (!presenceSocketWarned) {
      showNotification('Servidor de presenca offline. Online global desativado temporariamente.', 'warning');
      presenceSocketWarned = true;
    }
  });

  socket.addEventListener('close', () => {
    wsDebugLog('ws.close');
    const wasManualClose = presenceSocketManualClose;
    const hadOpen = presenceSocketConnected;
    presenceSocketManualClose = false;
    if (presenceSocket === socket) {
      presenceSocket = null;
    }
    presenceSocketConnected = false;
    presenceSocketAuthenticated = false;
    presenceAuthRecoveryAttempted = false;
    presenceCompatAuthAccepted = false;
    if (presenceInitFallbackTimer) {
      clearTimeout(presenceInitFallbackTimer);
      presenceInitFallbackTimer = null;
    }
    remoteStateInitialized = false;
    updateConnectionStatusDisplay();
    refreshPresenceDependentViews();
    if (!wasManualClose && !hadOpen && presenceSocketUrlCandidates.length > 1) {
      presenceSocketUrlIndex = (presenceSocketUrlIndex + 1) % presenceSocketUrlCandidates.length;
      wsDebugLog('ws.retry candidate', presenceSocketUrlIndex, getPresenceSocketUrl());
    }
    if (!wasManualClose) {
      schedulePresenceSocketReconnect();
    }
  });
}

function disconnectPresenceSocket(sendLeave = true) {
  if (presenceSocketReconnectTimer) {
    clearTimeout(presenceSocketReconnectTimer);
    presenceSocketReconnectTimer = null;
  }
  if (appStateSyncTimer) {
    clearTimeout(appStateSyncTimer);
    appStateSyncTimer = null;
  }
  if (presenceInitFallbackTimer) {
    clearTimeout(presenceInitFallbackTimer);
    presenceInitFallbackTimer = null;
  }

  if (sendLeave && session && presenceSocketConnected) {
    sendPresenceSocketMessage({
      type: 'leave',
      username: session.username
    });
  }

  if (presenceSocket) {
    presenceSocketManualClose = true;
    try {
      presenceSocket.close();
    } catch {
      // ignore close failures
    }
  }
  presenceSocket = null;
  presenceSocketConnected = false;
  presenceSocketAuthenticated = false;
  presenceAuthRecoveryAttempted = false;
  updateConnectionStatusDisplay();
  remoteStateInitialized = false;
}

function readPresenceMap() {
  const payload = safeParse(storageGetItem(STORAGE_KEYS.presence), {});
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return {};
  return payload;
}

function writePresenceMap(presenceMap) {
  storageSetItem(STORAGE_KEYS.presence, JSON.stringify(presenceMap));
}

function getPresenceMapForOnline() {
  const localMap = readPresenceMap();
  const sharedMap = (sharedPresenceMap && typeof sharedPresenceMap === 'object' && !Array.isArray(sharedPresenceMap))
    ? sharedPresenceMap
    : {};
  const merged = { ...sharedMap };
  Object.keys(localMap).forEach((username) => {
    const localEntry = localMap[username];
    const sharedEntry = merged[username];
    const localSeen = Math.max(0, Number(localEntry && localEntry.lastSeen) || 0);
    const sharedSeen = Math.max(0, Number(sharedEntry && sharedEntry.lastSeen) || 0);
    if (!sharedEntry || localSeen >= sharedSeen) {
      merged[username] = localEntry;
    }
  });
  return merged;
}

function updatePresence(nextPage) {
  if (!session) return;
  const payload = {
    username: session.username,
    role: session.role,
    page: String(nextPage || currentPage || 'dashboard'),
    lastSeen: Date.now(),
    loginAt: Number(session.loginAt) || Date.now()
  };
  const map = readPresenceMap();
  map[session.username] = payload;
  writePresenceMap(map);
  sendPresenceSocketMessage({
    type: 'presence',
    ...payload
  });
}

function removePresence(usernameOverride = '') {
  const username = usernameOverride || (session ? session.username : '');
  if (!username) return;
  const map = readPresenceMap();
  delete map[username];
  writePresenceMap(map);
  sendPresenceSocketMessage({
    type: 'leave',
    username
  });
}

function startPresenceHeartbeat() {
  stopPresenceHeartbeat();
  connectPresenceSocket();
  updatePresence(currentPage);
  presenceInterval = setInterval(() => {
    updatePresence(currentPage);
  }, PRESENCE_HEARTBEAT_MS);
}

function stopPresenceHeartbeat() {
  if (presenceInterval) {
    clearInterval(presenceInterval);
    presenceInterval = null;
  }
  disconnectPresenceSocket(false);
}

function getOnlinePresenceList() {
  const now = Date.now();
  return Object.values(getPresenceMapForOnline())
    .map((entry) => ({
      username: usernameKey(entry.username),
      role: String(entry.role || 'member'),
      page: String(entry.page || 'dashboard'),
      lastSeen: Number(entry.lastSeen) || 0,
      loginAt: Number(entry.loginAt) || Number(entry.lastSeen) || now
    }))
    .filter((entry) => entry.username && now - entry.lastSeen <= PRESENCE_ONLINE_WINDOW_MS)
    .sort((a, b) => b.lastSeen - a.lastSeen);
}

function getUserByUsername(username) {
  const target = String(username || '').trim().toLowerCase();
  if (!target) return null;
  return users.find((item) => String(item.username || '').trim().toLowerCase() === target) || null;
}

function registerUserAccess(user) {
  if (!user) return;
  const now = Date.now();
  user.accessCount = Math.max(0, Number(user.accessCount) || 0) + 1;
  user.lastLoginAt = now;
  logs.push({
    timestamp: now,
    user: user.username,
    action: `Entrou no site (${roleLabel(user.role)}), acesso #${user.accessCount}`
  });
  logs = capLogs(logs);
}

function registerUserOffline(username, reason = 'saida') {
  const user = getUserByUsername(username);
  if (!user) return;
  const now = Date.now();
  const loginAt = Number(user.lastLoginAt) || 0;
  const sessionMs = loginAt > 0 ? Math.max(0, now - loginAt) : 0;
  user.lastLogoutAt = now;
  logs.push({
    timestamp: now,
    user: user.username,
    action: `Saiu do site (${reason}) apos ${formatDuration(sessionMs)} online`
  });
  logs = capLogs(logs);
  saveData();
}

function readLiveBroadcast() {
  const payload = safeParse(storageGetItem(STORAGE_KEYS.liveBroadcast), null);
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const message = String(payload.message || '').trim();
  if (!message) return null;
  const recipients = Array.isArray(payload.recipients)
    ? payload.recipients.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 300)
    : [];
  return {
    id: Number(payload.id) || 0,
    sender: String(payload.sender || 'sistema'),
    anonymous: Boolean(payload.anonymous),
    level: payload.level === 'critical' ? 'critical' : 'normal',
    audience: normalizeBroadcastAudience(payload.audience),
    recipients,
    message: message.slice(0, 220),
    createdAt: Number(payload.createdAt) || 0
  };
}

function clearLiveBroadcastBanner() {
  if (liveBroadcastTimer) {
    clearTimeout(liveBroadcastTimer);
    liveBroadcastTimer = null;
  }
  const current = document.getElementById('live-broadcast-banner');
  if (!current) return;
  current.remove();
}

function showLiveBroadcastBanner(payload) {
  if (!session || !payload) return;
  const createdAt = Number(payload.createdAt) || Date.now();
  const age = Date.now() - createdAt;
  if (age > LIVE_BROADCAST_EXPIRE_MS) return;
  if (!shouldReceiveLiveBroadcast(payload)) {
    clearLiveBroadcastBanner();
    return;
  }

  const senderLabel = payload.anonymous
    ? 'Mensagem anonima'
    : `Mensagem de ${payload.sender || 'sistema'}`;
  const audienceLabel = getBroadcastAudienceLabel(payload.audience);
  const levelClass = payload.level === 'critical' ? 'critical' : 'normal';
  let banner = document.getElementById('live-broadcast-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'live-broadcast-banner';
    banner.className = 'live-broadcast';
    document.body.appendChild(banner);
  }

  banner.className = `live-broadcast ${levelClass}`;
  banner.classList.remove('show');
  banner.innerHTML = `
    <div class="live-broadcast-head">
      <strong>${escapeHtml(senderLabel)}</strong>
      <button type="button" class="live-broadcast-close" aria-label="Fechar">x</button>
    </div>
    <p>${escapeHtml(payload.message)}</p>
    <small>${formatDateTime(createdAt)} | Alvo: ${escapeHtml(audienceLabel)}</small>
  `;

  const closeButton = banner.querySelector('.live-broadcast-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      clearLiveBroadcastBanner();
    });
  }

  requestAnimationFrame(() => {
    banner.classList.add('show');
  });

  if (liveBroadcastTimer) {
    clearTimeout(liveBroadcastTimer);
  }
  const ttl = Math.max(5000, LIVE_BROADCAST_EXPIRE_MS - age);
  liveBroadcastTimer = setTimeout(() => {
    clearLiveBroadcastBanner();
  }, ttl);
}

function emitLiveBroadcast(message, options = {}) {
  if (!session) {
    return { ok: false, message: 'Sessao invalida.' };
  }
  const trimmed = String(message || '').trim().slice(0, 220);
  if (trimmed.length < 2) {
    return { ok: false, message: 'Mensagem muito curta.' };
  }

  const config = typeof options === 'boolean' ? { anonymous: options } : (options || {});
  const audience = normalizeBroadcastAudience({
    type: config.audienceType || (config.audience && config.audience.type) || 'all',
    role: config.audienceRole || (config.audience && config.audience.role) || 'member',
    user: config.audienceUser || (config.audience && config.audience.user) || ''
  });
  const recipients = resolveBroadcastRecipients(audience);
  if (recipients.length === 0) {
    return { ok: false, message: 'Nenhum usuario online corresponde ao alvo escolhido.' };
  }
  const level = config.level === 'critical' ? 'critical' : 'normal';

  const payload = {
    id: createId(),
    sender: session.username,
    anonymous: config.anonymous !== false,
    level,
    audience,
    recipients,
    message: trimmed,
    createdAt: Date.now()
  };

  storageSetItem(STORAGE_KEYS.liveBroadcast, JSON.stringify(payload));
  wsDebugLog('admin broadcast send', payload.level, payload.audience ? payload.audience.type : 'all');
  sendPresenceSocketMessage({
    type: 'live_broadcast_sync',
    payload
  });
  showLiveBroadcastBanner(payload);

  return {
    ok: true,
    payload,
    recipientCount: recipients.length,
    audienceLabel: getBroadcastAudienceLabel(audience)
  };
}

function toPositiveAmount(raw) {
  const amount = Number(String(raw).replace(',', '.'));
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Number(amount.toFixed(2));
}

function toNonNegativeAmount(raw) {
  const amount = Number(String(raw).replace(',', '.'));
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Number(amount.toFixed(2));
}

function getDayKeyFromTimestamp(timestamp) {
  const date = new Date(Number(timestamp) || Date.now());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getUserPrivateChatDailyLimit(user) {
  if (!user) return DEFAULT_MEMBER_PRIVATE_CHAT_LIMIT;
  if (isRoleAboveMember(user.role)) return Number.POSITIVE_INFINITY;
  const fallbackLimit = Math.max(0, Number(settings.memberPrivateChatDailyLimit) || DEFAULT_MEMBER_PRIVATE_CHAT_LIMIT);
  const ownLimit = Number(user.privateChatDailyLimit);
  if (!Number.isFinite(ownLimit) || ownLimit < 0) return fallbackLimit;
  return Math.min(999, Math.floor(ownLimit));
}

function getUserPrivateChatUsageToday(user, dayKey = getDayKeyFromTimestamp(Date.now())) {
  if (!user) return 0;
  if (!user.privateChatUsage || user.privateChatUsage.date !== dayKey) return 0;
  return Math.max(0, Math.floor(Number(user.privateChatUsage.used) || 0));
}

function getRemainingPrivateChatsToday(user, dayKey = getDayKeyFromTimestamp(Date.now())) {
  const limit = getUserPrivateChatDailyLimit(user);
  if (!Number.isFinite(limit)) return Number.POSITIVE_INFINITY;
  const used = getUserPrivateChatUsageToday(user, dayKey);
  return Math.max(0, limit - used);
}

function consumePrivateChatQuota(user, ts = Date.now()) {
  if (!user) return { ok: false, message: 'Sessao invalida.' };
  const dayKey = getDayKeyFromTimestamp(ts);
  const limit = getUserPrivateChatDailyLimit(user);
  if (!Number.isFinite(limit)) return { ok: true, remaining: Number.POSITIVE_INFINITY };

  const used = getUserPrivateChatUsageToday(user, dayKey);
  if (used >= limit) {
    return { ok: false, remaining: 0, message: `Limite diario atingido (${limit} chats).` };
  }
  user.privateChatUsage = { date: dayKey, used: used + 1 };
  return { ok: true, remaining: Math.max(0, limit - (used + 1)) };
}

function parseFlexibleDateTime(rawValue) {
  const input = String(rawValue || '').trim();
  if (!input) return null;
  const normalized = input.replace('T', ' ').replace(/\//g, '-').replace(/\s+/g, ' ');
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4] || 0);
  const minute = Number(match[5] || 0);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day) || !Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (
    Number.isNaN(date.getTime())
    || date.getFullYear() !== year
    || date.getMonth() !== month - 1
    || date.getDate() !== day
    || date.getHours() !== hour
    || date.getMinutes() !== minute
  ) {
    return null;
  }
  return date.getTime();
}

function promptFinanceTimestamp(actionLabel) {
  const rawInput = prompt(`${actionLabel}: informe data/hora (YYYY-MM-DD HH:mm) ou deixe vazio para agora:`, '');
  if (rawInput === null) return { cancelled: true, timestamp: 0, custom: false };
  const trimmed = rawInput.trim();
  if (!trimmed) return { cancelled: false, timestamp: Date.now(), custom: false };
  const parsed = parseFlexibleDateTime(trimmed);
  if (!parsed) return { cancelled: false, timestamp: 0, custom: true, invalid: true };
  return { cancelled: false, timestamp: parsed, custom: true };
}

function getWalletAutomationSettings() {
  settings.walletAutomation = normalizeWalletAutomationSettings(settings.walletAutomation);
  return settings.walletAutomation;
}

function ensureUserBillingProfile(user) {
  if (!user) {
    return normalizeUserBillingProfile({}, 0);
  }
  const normalized = normalizeUserBillingProfile(user.billingProfile, user.billingUpdatedAt);
  user.billingProfile = normalized;
  user.billingUpdatedAt = Math.max(0, Number(user.billingUpdatedAt) || 0, Number(normalized.updatedAt) || 0);
  return normalized;
}

function getUserEffectiveBillingPolicy(user) {
  const globalPolicy = getWalletAutomationSettings();
  const profile = normalizeUserBillingProfile(user && user.billingProfile, user && user.billingUpdatedAt);
  const pick = (value, fallback) => (value === null || value === undefined ? fallback : value);
  const fineMode = profile.fineMode && profile.fineMode !== 'default'
    ? profile.fineMode
    : globalPolicy.fineMode;
  return {
    enabled: globalPolicy.enabled && !profile.paused,
    dueDay: pick(profile.dueDay, globalPolicy.dueDay),
    graceDays: pick(profile.graceDays, globalPolicy.graceDays),
    fineMode,
    fineValue: pick(profile.fineValue, globalPolicy.fineValue),
    interestMonthlyPercent: pick(profile.interestMonthlyPercent, globalPolicy.interestMonthlyPercent),
    interestCapPercent: pick(profile.interestCapPercent, globalPolicy.interestCapPercent),
    minDebtForLateCharge: pick(profile.minDebtForLateCharge, globalPolicy.minDebtForLateCharge),
    applyToBlockedUsers: globalPolicy.applyToBlockedUsers,
    autoRunOnWalletControlOpen: globalPolicy.autoRunOnWalletControlOpen,
    profilePaused: profile.paused
  };
}

function getStartOfDayTimestamp(timestamp = Date.now()) {
  const date = new Date(Number(timestamp) || Date.now());
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getLatestBillingDueTimestamp(referenceTs = Date.now(), dueDay = DEFAULT_WALLET_AUTOMATION_SETTINGS.dueDay) {
  const safeDueDay = Math.max(1, Math.min(28, Math.floor(Number(dueDay) || DEFAULT_WALLET_AUTOMATION_SETTINGS.dueDay)));
  const referenceDate = new Date(Number(referenceTs) || Date.now());
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const currentDueDay = Math.min(safeDueDay, getDaysInMonth(year, month));
  const currentDueTs = new Date(year, month, currentDueDay, 0, 0, 0, 0).getTime();
  if (referenceTs >= currentDueTs) return currentDueTs;
  const prevDate = new Date(year, month - 1, 1);
  const prevYear = prevDate.getFullYear();
  const prevMonth = prevDate.getMonth();
  const prevDueDay = Math.min(safeDueDay, getDaysInMonth(prevYear, prevMonth));
  return new Date(prevYear, prevMonth, prevDueDay, 0, 0, 0, 0).getTime();
}

function calculateUserLateChargePreview(user, referenceTs = Date.now()) {
  const referenceDayTs = getStartOfDayTimestamp(referenceTs);
  if (!user || !canUserParticipateInWallet(user)) {
    return {
      eligible: false,
      reason: 'Usuario nao habilitado na carteira.',
      totalAmount: 0,
      fineAmount: 0,
      interestAmount: 0,
      overdueDays: 0,
      overdueAfterGrace: 0,
      dueTimestamp: referenceDayTs,
      dueDayKey: getDayKeyFromTimestamp(referenceDayTs),
      newInterestDays: 0,
      cyclePrincipal: 0,
      interestCapAmount: 0,
      profilePaused: false
    };
  }

  const profile = ensureUserBillingProfile(user);
  const policy = getUserEffectiveBillingPolicy(user);
  const globalPolicy = getWalletAutomationSettings();
  const debt = Math.max(0, Number(user.debt) || 0);

  if (!policy.enabled) {
    const reason = globalPolicy.enabled
      ? 'Automacao pausada para este usuario.'
      : 'Automacao global desativada.';
    return {
      eligible: false,
      reason,
      totalAmount: 0,
      fineAmount: 0,
      interestAmount: 0,
      overdueDays: 0,
      overdueAfterGrace: 0,
      dueTimestamp: referenceDayTs,
      dueDayKey: getDayKeyFromTimestamp(referenceDayTs),
      newInterestDays: 0,
      cyclePrincipal: 0,
      interestCapAmount: 0,
      profilePaused: Boolean(policy.profilePaused)
    };
  }

  if (user.status !== 'active' && !policy.applyToBlockedUsers) {
    return {
      eligible: false,
      reason: 'Usuario bloqueado (sem permissao de auto-cobranca).',
      totalAmount: 0,
      fineAmount: 0,
      interestAmount: 0,
      overdueDays: 0,
      overdueAfterGrace: 0,
      dueTimestamp: referenceDayTs,
      dueDayKey: getDayKeyFromTimestamp(referenceDayTs),
      newInterestDays: 0,
      cyclePrincipal: 0,
      interestCapAmount: 0,
      profilePaused: false
    };
  }

  if (debt < policy.minDebtForLateCharge) {
    return {
      eligible: false,
      reason: `Divida abaixo do minimo (${formatCurrency(policy.minDebtForLateCharge)}).`,
      totalAmount: 0,
      fineAmount: 0,
      interestAmount: 0,
      overdueDays: 0,
      overdueAfterGrace: 0,
      dueTimestamp: referenceDayTs,
      dueDayKey: getDayKeyFromTimestamp(referenceDayTs),
      newInterestDays: 0,
      cyclePrincipal: 0,
      interestCapAmount: 0,
      profilePaused: false
    };
  }

  const dueTimestamp = getLatestBillingDueTimestamp(referenceDayTs, policy.dueDay);
  const dueDayKey = getDayKeyFromTimestamp(dueTimestamp);
  const overdueDays = Math.max(0, Math.floor((referenceDayTs - dueTimestamp) / (24 * 60 * 60 * 1000)));
  const overdueAfterGrace = Math.max(0, overdueDays - policy.graceDays);
  const sameCycle = profile.lateCycleKey === dueDayKey;
  const accruedDaysBefore = sameCycle ? Math.max(0, Number(profile.lateAccruedDays) || 0) : 0;
  const interestAccruedBefore = sameCycle ? Math.max(0, Number(profile.cycleInterestAccrued) || 0) : 0;
  const cyclePrincipal = sameCycle
    ? Math.max(0, Number(profile.cyclePrincipal) || debt)
    : debt;
  const fineAlreadyApplied = profile.fineAppliedCycleKey === dueDayKey;

  if (overdueAfterGrace <= 0) {
    return {
      eligible: false,
      reason: 'Ainda dentro da tolerancia de vencimento.',
      totalAmount: 0,
      fineAmount: 0,
      interestAmount: 0,
      overdueDays,
      overdueAfterGrace,
      dueTimestamp,
      dueDayKey,
      newInterestDays: 0,
      cyclePrincipal,
      interestCapAmount: Number((cyclePrincipal * (policy.interestCapPercent / 100)).toFixed(2)),
      profilePaused: false
    };
  }

  const newInterestDays = Math.max(0, overdueAfterGrace - accruedDaysBefore);
  let fineAmount = 0;
  if (!fineAlreadyApplied) {
    fineAmount = policy.fineMode === 'fixed'
      ? Number(policy.fineValue) || 0
      : debt * ((Number(policy.fineValue) || 0) / 100);
  }
  fineAmount = Number(Math.max(0, fineAmount).toFixed(2));

  const dailyRate = (Math.max(0, Number(policy.interestMonthlyPercent) || 0) / 100) / 30;
  const rawInterest = debt * dailyRate * newInterestDays;
  const interestCapAmount = Math.max(0, cyclePrincipal * ((Number(policy.interestCapPercent) || 0) / 100));
  const capRemaining = Math.max(0, interestCapAmount - interestAccruedBefore);
  const interestAmount = Number(Math.max(0, Math.min(rawInterest, capRemaining)).toFixed(2));
  const totalAmount = Number((fineAmount + interestAmount).toFixed(2));

  let reason = '';
  if (totalAmount <= 0) {
    if (fineAlreadyApplied && newInterestDays <= 0) {
      reason = 'Atraso ja processado para o ciclo atual.';
    } else if (capRemaining <= 0) {
      reason = 'Teto de juros do ciclo atingido.';
    } else {
      reason = 'Sem valor novo para aplicar.';
    }
  }

  return {
    eligible: totalAmount > 0,
    reason,
    totalAmount,
    fineAmount,
    interestAmount,
    overdueDays,
    overdueAfterGrace,
    dueTimestamp,
    dueDayKey,
    fineAlreadyApplied,
    newInterestDays,
    accruedDaysBefore,
    interestAccruedBefore: Number(interestAccruedBefore.toFixed(2)),
    cyclePrincipal: Number(cyclePrincipal.toFixed(2)),
    interestCapAmount: Number(interestCapAmount.toFixed(2)),
    policy,
    profilePaused: false
  };
}

function applyLateChargesToUser(user, options = {}) {
  const referenceTs = Number(options.referenceTs) > 0 ? Number(options.referenceTs) : Date.now();
  const eventTimestamp = Number(options.eventTimestamp) > 0 ? Number(options.eventTimestamp) : referenceTs;
  const actor = options.actor || (session ? session.username : 'sistema');
  const skipSave = Boolean(options.skipSave);
  const preview = calculateUserLateChargePreview(user, referenceTs);

  if (!preview.eligible) {
    return {
      ok: false,
      skipped: true,
      reason: preview.reason || 'Sem cobranca pendente.',
      fineAmount: 0,
      interestAmount: 0,
      totalAmount: 0,
      overdueDays: preview.overdueDays || 0
    };
  }

  let appliedFine = 0;
  let appliedInterest = 0;

  if (preview.fineAmount > 0) {
    const fineModeLabel = preview.policy && preview.policy.fineMode === 'fixed'
      ? `${formatCurrency(preview.policy.fineValue)} fixo`
      : `${Number(preview.policy && preview.policy.fineValue || 0).toFixed(2)}%`;
    const fineResult = registerFinanceEvent(
      user,
      'charge',
      preview.fineAmount,
      `Multa de atraso (${fineModeLabel}) - ciclo ${preview.dueDayKey}`,
      actor,
      { timestamp: eventTimestamp, skipSave: true }
    );
    if (!fineResult.ok) {
      return { ok: false, skipped: true, reason: fineResult.message || 'Falha ao aplicar multa.' };
    }
    appliedFine = fineResult.amount;
  }

  if (preview.interestAmount > 0) {
    const interestResult = registerFinanceEvent(
      user,
      'charge',
      preview.interestAmount,
      `Juros de atraso ${Number(preview.policy && preview.policy.interestMonthlyPercent || 0).toFixed(2)}%/mes (${preview.newInterestDays} dia(s) novos) - ciclo ${preview.dueDayKey}`,
      actor,
      { timestamp: eventTimestamp, skipSave: true }
    );
    if (!interestResult.ok) {
      return { ok: false, skipped: true, reason: interestResult.message || 'Falha ao aplicar juros.' };
    }
    appliedInterest = interestResult.amount;
  }

  const profile = ensureUserBillingProfile(user);
  if (profile.lateCycleKey !== preview.dueDayKey) {
    profile.lateCycleKey = preview.dueDayKey;
    profile.lateAccruedDays = 0;
    profile.cyclePrincipal = Math.max(0, Number(preview.cyclePrincipal) || Math.max(0, Number(user.debt) || 0));
    profile.cycleInterestAccrued = 0;
    profile.fineAppliedCycleKey = '';
  }
  profile.lateAccruedDays = Math.max(0, Number(preview.accruedDaysBefore) || 0) + Math.max(0, Number(preview.newInterestDays) || 0);
  profile.cyclePrincipal = Math.max(0, Number(preview.cyclePrincipal) || 0);
  profile.cycleInterestAccrued = Number((Math.max(0, Number(preview.interestAccruedBefore) || 0) + Math.max(0, appliedInterest)).toFixed(2));
  if (appliedFine > 0 || preview.fineAlreadyApplied) {
    profile.fineAppliedCycleKey = preview.dueDayKey;
  }
  profile.lastAppliedDay = getDayKeyFromTimestamp(referenceTs);
  profile.updatedAt = Date.now();
  user.billingUpdatedAt = profile.updatedAt;

  if (!skipSave) {
    saveData();
  }

  return {
    ok: true,
    skipped: false,
    fineAmount: Number(appliedFine.toFixed(2)),
    interestAmount: Number(appliedInterest.toFixed(2)),
    totalAmount: Number((appliedFine + appliedInterest).toFixed(2)),
    overdueDays: preview.overdueDays,
    cycleKey: preview.dueDayKey
  };
}

function buildLateChargeCandidates(scopedUsers = users, referenceTs = Date.now()) {
  return scopedUsers
    .filter((user) => canUserParticipateInWallet(user))
    .map((user) => {
      const preview = calculateUserLateChargePreview(user, referenceTs);
      return {
        username: user.username,
        debt: Math.max(0, Number(user.debt) || 0),
        status: user.status,
        ...preview
      };
    })
    .sort((a, b) => {
      if (Number(b.totalAmount) !== Number(a.totalAmount)) return Number(b.totalAmount) - Number(a.totalAmount);
      return String(a.username).localeCompare(String(b.username));
    });
}

function runWalletLateAutomation(options = {}) {
  const automation = getWalletAutomationSettings();
  const actor = options.actor || (session ? session.username : 'sistema');
  const referenceTs = Number(options.referenceTs) > 0 ? Number(options.referenceTs) : Date.now();
  const dayKey = getDayKeyFromTimestamp(referenceTs);
  const force = Boolean(options.force);
  let temporaryEnabledOverride = false;

  if (!automation.enabled && !force) {
    return {
      ok: false,
      alreadyRun: false,
      appliedCount: 0,
      skippedCount: 0,
      totalAmount: 0,
      message: 'Automacao de atraso desativada.'
    };
  }

  if (!force && automation.lastRunDay === dayKey) {
    return {
      ok: false,
      alreadyRun: true,
      appliedCount: 0,
      skippedCount: 0,
      totalAmount: 0,
      message: 'Automacao ja executada hoje.'
    };
  }

  if (force && !automation.enabled) {
    settings.walletAutomation = normalizeWalletAutomationSettings({
      ...automation,
      enabled: true
    });
    temporaryEnabledOverride = true;
  }

  const participants = getWalletParticipants(users);
  const candidates = buildLateChargeCandidates(participants, referenceTs);
  let appliedCount = 0;
  let skippedCount = 0;
  let totalAmount = 0;
  const appliedUsers = [];

  candidates.forEach((candidate) => {
    const user = getUserByUsername(candidate.username);
    if (!user) {
      skippedCount += 1;
      return;
    }
    const result = applyLateChargesToUser(user, {
      referenceTs,
      eventTimestamp: referenceTs,
      actor,
      skipSave: true
    });
    if (!result.ok) {
      skippedCount += 1;
      return;
    }
    appliedCount += 1;
    totalAmount += Number(result.totalAmount) || 0;
    appliedUsers.push({
      username: user.username,
      totalAmount: Number(result.totalAmount) || 0,
      fineAmount: Number(result.fineAmount) || 0,
      interestAmount: Number(result.interestAmount) || 0
    });
  });

  const basePolicy = temporaryEnabledOverride ? automation : settings.walletAutomation;
  settings.walletAutomation = normalizeWalletAutomationSettings({
    ...basePolicy,
    lastRunDay: dayKey,
    updatedAt: Date.now()
  });
  saveData();

  return {
    ok: true,
    alreadyRun: false,
    appliedCount,
    skippedCount,
    totalAmount: Number(totalAmount.toFixed(2)),
    appliedUsers,
    message: appliedCount > 0
      ? `Automacao aplicada em ${appliedCount} usuario(s).`
      : 'Nenhum usuario elegivel para multa/juros agora.'
  };
}

function formatBillingFineRule(mode, value) {
  const safeValue = Number(value) || 0;
  if (mode === 'fixed') return `${formatCurrency(safeValue)} fixo`;
  return `${safeValue.toFixed(2)}%`;
}

function registerFinanceEvent(user, type, amount, note = '', actor = null, options = {}) {
  const safeAmount = toPositiveAmount(amount);
  if (!user || safeAmount <= 0) {
    return { ok: false, amount: 0, message: 'Valor invalido.' };
  }

  const eventTimestamp = Number(options.timestamp) > 0 ? Number(options.timestamp) : Date.now();
  const entryActor = actor || (session ? session.username : 'sistema');
  const eventType = ['charge', 'payment', 'loan', 'adjustment'].includes(type) ? type : 'adjustment';
  const shouldPersist = options.skipSave !== true;
  let appliedAmount = safeAmount;

  if (eventType === 'charge') {
    user.debt += safeAmount;
    user.totalCharged += safeAmount;
  } else if (eventType === 'loan') {
    user.debt += safeAmount;
    user.totalCharged += safeAmount;
    user.emergencyLoanOutstanding = Math.min(50, user.emergencyLoanOutstanding + safeAmount);
  } else if (eventType === 'payment') {
    const appliedToDebt = Math.min(safeAmount, Math.max(0, user.debt));
    const profitAdded = Math.max(0, safeAmount - appliedToDebt);
    appliedAmount = safeAmount;
    user.debt = Math.max(0, user.debt - appliedToDebt);
    user.totalPaid += safeAmount;
    user.walletProfit = Math.max(0, (Number(user.walletProfit) || 0) + profitAdded);
    user.emergencyLoanOutstanding = Math.max(0, user.emergencyLoanOutstanding - appliedToDebt);

    const historyEntry = {
      id: createId(),
      type: eventType,
      amount: appliedAmount,
      note: String(note || ''),
      actor: entryActor,
      timestamp: eventTimestamp
    };

    user.financeHistory.push(historyEntry);
    if (user.financeHistory.length > 400) {
      user.financeHistory = user.financeHistory.slice(-400);
    }
    user.financeUpdatedAt = Math.max(0, Number(user.financeUpdatedAt) || 0, eventTimestamp);

    if (shouldPersist) saveData();
    return {
      ok: true,
      amount: appliedAmount,
      appliedToDebt: Number(appliedToDebt.toFixed(2)),
      profitAdded: Number(profitAdded.toFixed(2)),
      timestamp: eventTimestamp,
      message: profitAdded > 0 ? 'Pagamento com lucro registrado.' : 'Operacao registrada.'
    };
  } else {
    user.debt += safeAmount;
    user.totalCharged += safeAmount;
  }

  const historyEntry = {
    id: createId(),
    type: eventType,
    amount: appliedAmount,
    note: String(note || ''),
    actor: entryActor,
    timestamp: eventTimestamp
  };

  user.financeHistory.push(historyEntry);
  if (user.financeHistory.length > 400) {
    user.financeHistory = user.financeHistory.slice(-400);
  }
  user.financeUpdatedAt = Math.max(0, Number(user.financeUpdatedAt) || 0, eventTimestamp);

  if (shouldPersist) saveData();
  return { ok: true, amount: appliedAmount, timestamp: eventTimestamp, message: 'Operacao registrada.' };
}

function sumRecentPayments(user, days = 30) {
  if (!user || !Array.isArray(user.financeHistory)) return 0;
  const minTs = Date.now() - days * 24 * 60 * 60 * 1000;
  return user.financeHistory
    .filter((entry) => entry.type === 'payment' && entry.timestamp >= minTs)
    .reduce((sum, entry) => sum + entry.amount, 0);
}

function calculateDopamineStats(user) {
  if (!user) {
    return { xp: 0, level: 1, currentLevelXp: 0, nextLevelXp: 120, progressPercent: 0, badges: [] };
  }

  const normalizedUser = String(user.username || '').trim().toLowerCase();
  const userTasks = tasks.filter((task) => {
    if ((Number(task.deletedAt) || 0) > 0) return false;
    return String(getTaskResponsibleUsername(task) || '').trim().toLowerCase() === normalizedUser;
  });
  const doneTasks = userTasks.filter((task) => task.status === 'done').length;
  const closedTickets = tickets.filter((ticket) => ticket.creator === user.username && ticket.status === 'closed').length;
  const paidCount = user.financeHistory.filter((entry) => entry.type === 'payment').length;
  const paidValue = user.totalPaid || 0;
  const recentMomentum = sumRecentPayments(user, 30);

  const xp = Math.round(doneTasks * 18 + closedTickets * 14 + paidCount * 10 + paidValue * 0.6 + recentMomentum * 0.8);
  const level = Math.max(1, Math.floor(xp / 120) + 1);
  const currentLevelFloor = (level - 1) * 120;
  const nextLevelXp = level * 120;
  const currentLevelXp = xp - currentLevelFloor;
  const progressPercent = Math.max(0, Math.min(100, (currentLevelXp / 120) * 100));

  const badges = [];
  if (doneTasks >= 5) badges.push('Executor');
  if (paidCount >= 3) badges.push('Compromisso em dia');
  if (recentMomentum >= 50) badges.push('Sprint financeiro');
  if (closedTickets >= 4) badges.push('Resolvedor');
  if (badges.length === 0) badges.push('Em evolucao');

  return { xp, level, currentLevelXp, nextLevelXp, progressPercent, badges };
}

function calculateTenYearPlan(totalValue, annualRatePercent = 0) {
  const principal = Math.max(0, Number(totalValue) || 0);
  const annualRate = Math.max(0, Number(annualRatePercent) || 0);
  const months = 120;
  if (principal <= 0) {
    return { monthly: 0, total: 0, interest: 0 };
  }

  const monthlyRate = annualRate / 100 / 12;
  let monthly = 0;
  if (monthlyRate === 0) {
    monthly = principal / months;
  } else {
    monthly = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  }
  const total = monthly * months;
  const interest = Math.max(0, total - principal);

  return {
    monthly: Number(monthly.toFixed(2)),
    total: Number(total.toFixed(2)),
    interest: Number(interest.toFixed(2))
  };
}

function getMonthKeyFromTimestamp(timestamp) {
  const date = new Date(Number(timestamp) || Date.now());
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getCurrentMonthKey() {
  return getMonthKeyFromTimestamp(Date.now());
}

function getMonthLabelFromKey(monthKey) {
  const [yearStr, monthStr] = String(monthKey).split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return String(monthKey || '-');
  }
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
}

function getMonthLongLabelFromKey(monthKey) {
  const [yearStr, monthStr] = String(monthKey).split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return String(monthKey || '-');
  }
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function parseMonthKey(monthKey) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(monthKey || '').trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
  return { year, month };
}

function getFinanceChartMonthKeys(monthsCount = FINANCE_CHART_MONTH_WINDOW, anchorMonthKey = getCurrentMonthKey()) {
  return listRecentMonthKeys(monthsCount, anchorMonthKey);
}

function isTimestampInFinanceChartWindow(timestamp, monthsCount = FINANCE_CHART_MONTH_WINDOW, anchorMonthKey = getCurrentMonthKey()) {
  const key = getMonthKeyFromTimestamp(timestamp);
  return getFinanceChartMonthKeys(monthsCount, anchorMonthKey).includes(key);
}

function getFinanceChartScopeLabel(monthsCount = FINANCE_CHART_MONTH_WINDOW, anchorMonthKey = getCurrentMonthKey()) {
  const monthKeys = getFinanceChartMonthKeys(monthsCount, anchorMonthKey);
  if (monthKeys.length === 0) return 'Periodo atual';
  const first = getMonthLabelFromKey(monthKeys[0]);
  const last = getMonthLabelFromKey(monthKeys[monthKeys.length - 1]);
  if (first === last) return first;
  return `${first} a ${last}`;
}

function listRecentMonthKeys(count = 8, anchorMonthKey = getCurrentMonthKey()) {
  const safeCount = Math.max(1, Number(count) || 8);
  const parsedAnchor = parseMonthKey(anchorMonthKey) || parseMonthKey(getCurrentMonthKey());
  const anchorDate = new Date(parsedAnchor.year, parsedAnchor.month - 1, 1);
  const keys = [];
  for (let i = safeCount - 1; i >= 0; i -= 1) {
    const date = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - i, 1);
    keys.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  }
  return keys;
}

function getUserFinanceMonthSummary(user, monthKey) {
  const history = Array.isArray(user && user.financeHistory) ? user.financeHistory : [];
  let charged = 0;
  let paid = 0;
  let loans = 0;
  let fines = 0;

  history.forEach((entry) => {
    if (getMonthKeyFromTimestamp(entry.timestamp) !== monthKey) return;
    const amount = Number(entry.amount) || 0;
    if (amount <= 0) return;

    if (entry.type === 'payment') {
      paid += amount;
      return;
    }

    if (entry.type === 'loan') {
      loans += amount;
    }

    if (entry.type === 'charge') {
      fines += amount;
    }

    if (entry.type === 'charge' || entry.type === 'loan' || entry.type === 'adjustment') {
      charged += amount;
    }
  });

  return {
    charged: Number(charged.toFixed(2)),
    paid: Number(paid.toFixed(2)),
    loans: Number(loans.toFixed(2)),
    fines: Number(fines.toFixed(2)),
    debt: Math.max(0, Number(user && user.debt) || 0),
    walletValue: Math.max(0, Number(user && user.totalPaid) || 0),
    profit: Math.max(0, Number(user && user.walletProfit) || 0)
  };
}

function getAggregateMonthFinanceSummary(monthKey, scopedUsers = users) {
  const total = {
    charged: 0,
    paid: 0,
    loans: 0,
    fines: 0,
    debt: 0,
    walletValue: 0,
    profit: 0
  };

  scopedUsers.forEach((user) => {
    const summary = getUserFinanceMonthSummary(user, monthKey);
    total.charged += summary.charged;
    total.paid += summary.paid;
    total.loans += summary.loans;
    total.fines += summary.fines;
    total.debt += summary.debt;
    total.walletValue += summary.walletValue;
    total.profit += summary.profit;
  });

  return {
    charged: Number(total.charged.toFixed(2)),
    paid: Number(total.paid.toFixed(2)),
    loans: Number(total.loans.toFixed(2)),
    fines: Number(total.fines.toFixed(2)),
    debt: Number(total.debt.toFixed(2)),
    walletValue: Number(total.walletValue.toFixed(2)),
    profit: Number(total.profit.toFixed(2))
  };
}

function buildAggregateFinanceSeries(monthsCount = FINANCE_CHART_MONTH_WINDOW, anchorMonthKey = getCurrentMonthKey(), scopedUsers = users) {
  const monthKeys = getFinanceChartMonthKeys(monthsCount, anchorMonthKey);
  const labels = monthKeys.map(getMonthLabelFromKey);
  const debtSeries = new Array(monthKeys.length).fill(0);
  const paidSeries = new Array(monthKeys.length).fill(0);
  const chargeSeries = new Array(monthKeys.length).fill(0);

  scopedUsers.forEach((user) => {
    const userSeries = buildFinanceSeries(user, monthKeys.length, anchorMonthKey);
    userSeries.debtSeries.forEach((value, index) => {
      debtSeries[index] += Number(value) || 0;
    });
    userSeries.paidSeries.forEach((value, index) => {
      paidSeries[index] += Number(value) || 0;
    });
    userSeries.chargeSeries.forEach((value, index) => {
      chargeSeries[index] += Number(value) || 0;
    });
  });

  return {
    monthKeys,
    labels,
    debtSeries: debtSeries.map((value) => Number(value.toFixed(2))),
    paidSeries: paidSeries.map((value) => Number(value.toFixed(2))),
    chargeSeries: chargeSeries.map((value) => Number(value.toFixed(2)))
  };
}

function buildFinanceSeries(user, monthsCount = FINANCE_CHART_MONTH_WINDOW, anchorMonthKey = getCurrentMonthKey()) {
  const monthKeys = getFinanceChartMonthKeys(monthsCount, anchorMonthKey);
  const months = monthKeys.map((key) => ({
    key,
    label: getMonthLabelFromKey(key),
    charges: 0,
    payments: 0
  }));

  const monthIndex = new Map(months.map((month, index) => [month.key, index]));
  const history = Array.isArray(user && user.financeHistory) ? user.financeHistory.slice().sort((a, b) => a.timestamp - b.timestamp) : [];
  const firstKey = months[0].key;

  let chargesBeforeWindow = 0;
  let paymentsBeforeWindow = 0;
  let chargesAll = 0;
  let paymentsAll = 0;

  history.forEach((entry) => {
    const key = getMonthKeyFromTimestamp(entry.timestamp);
    const amount = Number(entry.amount) || 0;
    if (entry.type === 'payment') {
      paymentsAll += amount;
    } else if (entry.type === 'charge' || entry.type === 'loan' || entry.type === 'adjustment') {
      chargesAll += amount;
    }

    if (monthIndex.has(key)) {
      const idx = monthIndex.get(key);
      if (entry.type === 'payment') {
        months[idx].payments += amount;
      } else if (entry.type === 'charge' || entry.type === 'loan' || entry.type === 'adjustment') {
        months[idx].charges += amount;
      }
      return;
    }

    if (key < firstKey) {
      if (entry.type === 'payment') paymentsBeforeWindow += amount;
      if (entry.type === 'charge' || entry.type === 'loan' || entry.type === 'adjustment') chargesBeforeWindow += amount;
    }
  });

  const debtNow = Math.max(0, Number(user && user.debt) || 0);
  const baselineBeforeHistory = Math.max(0, debtNow - (chargesAll - paymentsAll));
  let debtLevel = Math.max(0, baselineBeforeHistory + (chargesBeforeWindow - paymentsBeforeWindow));

  const debtSeries = [];
  const paidSeries = [];
  const chargeSeries = [];
  const labels = [];

  months.forEach((month) => {
    debtLevel = Math.max(0, debtLevel + month.charges - month.payments);
    debtSeries.push(Number(debtLevel.toFixed(2)));
    paidSeries.push(Number(month.payments.toFixed(2)));
    chargeSeries.push(Number(month.charges.toFixed(2)));
    labels.push(month.label);
  });

  return { labels, debtSeries, paidSeries, chargeSeries, monthKeys };
}

function getCanvasRenderPixelRatio() {
  const ratio = window.devicePixelRatio || 1;
  if (IS_COARSE_POINTER) {
    return Math.max(1, Math.min(1.25, ratio));
  }
  return Math.max(1, Math.min(2, ratio));
}

function drawRoundedRectPath(ctx, x, y, boxWidth, boxHeight, radius) {
  const safeRadius = Math.min(radius, boxWidth / 2, boxHeight / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + boxWidth - safeRadius, y);
  ctx.quadraticCurveTo(x + boxWidth, y, x + boxWidth, y + safeRadius);
  ctx.lineTo(x + boxWidth, y + boxHeight - safeRadius);
  ctx.quadraticCurveTo(x + boxWidth, y + boxHeight, x + boxWidth - safeRadius, y + boxHeight);
  ctx.lineTo(x + safeRadius, y + boxHeight);
  ctx.quadraticCurveTo(x, y + boxHeight, x, y + boxHeight - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function drawFinanceSeriesCanvas(canvas, series, options = {}) {
  if (!canvas || !series) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const chartTheme = getActiveChartTheme();
  const chartType = normalizeFinanceChartType(options.chartType || getFinanceChartType());
  const periodLabel = options.periodLabel || getFinanceChartScopeLabel(
    Array.isArray(series && series.monthKeys) ? series.monthKeys.length : FINANCE_CHART_MONTH_WINDOW,
    Array.isArray(series && series.monthKeys) && series.monthKeys.length > 0 ? series.monthKeys[series.monthKeys.length - 1] : getCurrentMonthKey()
  );

  const rect = canvas.getBoundingClientRect();
  const pixelRatio = getCanvasRenderPixelRatio();
  const width = Math.max(240, Math.floor(rect.width || canvas.clientWidth || 320));
  const height = Math.max(180, Math.floor(rect.height || canvas.clientHeight || 220));
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  ctx.clearRect(0, 0, width, height);
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, chartTheme.bgTop);
  bgGradient.addColorStop(1, chartTheme.bgBottom);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  const auraPrimary = ctx.createRadialGradient(width * 0.18, height * 0.16, 12, width * 0.18, height * 0.16, width * 0.56);
  auraPrimary.addColorStop(0, chartTheme.orbA);
  auraPrimary.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = auraPrimary;
  ctx.fillRect(0, 0, width, height);

  const auraSecondary = ctx.createRadialGradient(width * 0.82, height * 0.12, 8, width * 0.82, height * 0.12, width * 0.42);
  auraSecondary.addColorStop(0, chartTheme.orbB);
  auraSecondary.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = auraSecondary;
  ctx.fillRect(0, 0, width, height);

  const labels = Array.isArray(series.labels) ? series.labels.slice() : [];
  const paidRaw = Array.isArray(series.paidSeries) ? series.paidSeries.slice() : [];
  const debtRaw = Array.isArray(series.debtSeries) ? series.debtSeries.slice() : [];
  const chargeRaw = Array.isArray(series.chargeSeries) ? series.chargeSeries.slice() : [];
  const secondaryKey = options.secondaryKey === 'charge' ? 'charge' : 'debt';
  const secondaryRaw = secondaryKey === 'charge' ? chargeRaw : debtRaw;
  const pointsCount = Math.max(1, labels.length, paidRaw.length, secondaryRaw.length);

  while (labels.length < pointsCount) labels.push(String(labels.length + 1));
  while (paidRaw.length < pointsCount) paidRaw.push(0);
  while (secondaryRaw.length < pointsCount) secondaryRaw.push(0);

  const progress = Math.max(0, Math.min(1, Number(options.progress ?? 1)));
  const paidSeries = paidRaw.map((value) => Number((Math.max(0, value) * progress).toFixed(2)));
  const secondarySeries = secondaryRaw.map((value) => Number((Math.max(0, value) * progress).toFixed(2)));
  const debtSeries = debtRaw.map((value) => Number((Math.max(0, value) * progress).toFixed(2)));

  const paidColor = options.paidColor || chartTheme.paidColor;
  const paidFill = options.paidFill || chartTheme.paidFill;
  const secondaryColor = options.debtColor || chartTheme.debtColor;
  const secondaryFill = options.debtFill || chartTheme.debtFill;
  const paidLabel = options.paidLabel || 'Pago';
  const secondaryLabel = options.debtLabel || (secondaryKey === 'charge' ? 'Cobrado' : 'Divida');
  const isNarrow = width <= 420;

  function drawLegendChip(x, y, color, text) {
    ctx.font = `${isNarrow ? 10 : 11}px ${CHART_HEADING_FONT}`;
    const chipHeight = isNarrow ? 24 : 28;
    const chipWidth = Math.max(84, Math.ceil(ctx.measureText(text).width + 34));
    drawRoundedRectPath(ctx, x, y, chipWidth, chipHeight, chipHeight / 2);
    ctx.fillStyle = chartTheme.pillBg;
    ctx.strokeStyle = chartTheme.pillBorder;
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 14, y + chipHeight / 2, 4.2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = chartTheme.label;
    ctx.textAlign = 'left';
    ctx.fillText(text, x + 24, y + chipHeight / 2 + 4);
    return chipWidth;
  }

  function drawTopTag(text) {
    ctx.font = `${isNarrow ? 9 : 10}px ${CHART_BODY_FONT}`;
    const tagWidth = Math.max(92, Math.ceil(ctx.measureText(text).width + 24));
    const tagX = width - tagWidth - 12;
    drawRoundedRectPath(ctx, tagX, 12, tagWidth, 24, 12);
    ctx.fillStyle = chartTheme.pillBg;
    ctx.strokeStyle = chartTheme.pillBorder;
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = chartTheme.axis;
    ctx.textAlign = 'left';
    ctx.fillText(text, tagX + 12, 28);
  }

  if (chartType === 'pie') {
    const paidTotal = paidSeries.reduce((sum, value) => sum + value, 0);
    const secondaryTotal = secondarySeries.reduce((sum, value) => sum + value, 0);
    const debtCurrent = Number(debtSeries[debtSeries.length - 1] || 0);
    const segments = [
      { label: paidLabel, value: paidTotal, color: paidColor },
      { label: secondaryLabel, value: secondaryTotal, color: secondaryColor },
      { label: 'Divida atual', value: debtCurrent, color: chartTheme.axisSoft }
    ].filter((segment) => segment.value > 0);

    if (segments.length === 0) {
      ctx.fillStyle = chartTheme.label;
      ctx.font = `700 ${isNarrow ? 13 : 15}px ${CHART_HEADING_FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText(`Sem dados em ${periodLabel}.`, width / 2, height / 2);
      return;
    }

    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    const centerX = width * (isNarrow ? 0.5 : 0.34);
    const centerY = height * 0.58;
    const radius = Math.min(width, height) * (isNarrow ? 0.24 : 0.22);
    const innerRadius = radius * 0.6;
    let angle = -Math.PI / 2;

    segments.forEach((segment) => {
      const sweep = (segment.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + sweep);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      angle += sweep;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = chartTheme.bgTop;
    ctx.fill();

    ctx.fillStyle = chartTheme.label;
    ctx.font = `700 ${isNarrow ? 11 : 12}px ${CHART_HEADING_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('Resumo financeiro', centerX, centerY - 4);
    ctx.font = `700 ${isNarrow ? 16 : 20}px ${CHART_HEADING_FONT}`;
    ctx.fillText(formatCurrency(total), centerX, centerY + 18);

    drawTopTag(`Pizza ${periodLabel}`);
    let legendY = isNarrow ? height - 96 : 64;
    const legendX = isNarrow ? 18 : width * 0.58;
    segments.forEach((segment) => {
      const percent = total > 0 ? ((segment.value / total) * 100).toFixed(1) : '0.0';
      drawLegendChip(legendX, legendY, segment.color, `${segment.label} ${percent}%`);
      legendY += isNarrow ? 34 : 38;
    });
    return;
  }

  const padding = isNarrow
    ? { left: 18, right: 58, top: 52, bottom: 34 }
    : { left: 24, right: 88, top: 58, bottom: 40 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  if (plotW <= 40 || plotH <= 40) return;

  const rawMaxValue = Math.max(50, ...secondarySeries, ...paidSeries);
  const maxValue = (() => {
    const safeMax = Math.max(1, rawMaxValue * 1.08);
    const magnitude = 10 ** Math.floor(Math.log10(safeMax));
    const normalized = safeMax / magnitude;
    if (normalized <= 1) return 1 * magnitude;
    if (normalized <= 2) return 2 * magnitude;
    if (normalized <= 2.5) return 2.5 * magnitude;
    if (normalized <= 5) return 5 * magnitude;
    return 10 * magnitude;
  })();

  function pointX(index) {
    if (pointsCount === 1) return padding.left + plotW / 2;
    return padding.left + (plotW / (pointsCount - 1)) * index;
  }

  function pointY(value) {
    return padding.top + plotH - (value / maxValue) * plotH;
  }

  ctx.save();
  ctx.strokeStyle = chartTheme.grid;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right + 12, y);
    ctx.stroke();
    const tickValue = maxValue - (maxValue / 4) * i;
    ctx.fillStyle = chartTheme.axisSoft;
    ctx.font = `${isNarrow ? 9 : 10}px ${CHART_BODY_FONT}`;
    ctx.textAlign = 'right';
    ctx.fillText(formatCurrency(tickValue), width - 6, y + 3);
  }
  ctx.setLineDash([]);
  ctx.restore();

  const labelStep = Math.max(1, Math.ceil(pointsCount / 6));
  if (chartType === 'bar') {
    const groupWidth = plotW / Math.max(pointsCount, 1);
    const barWidth = Math.max(8, Math.min(22, groupWidth * 0.28));
    labels.forEach((_, index) => {
      const centerX = padding.left + groupWidth * index + groupWidth / 2;
      const paidHeight = (paidSeries[index] / maxValue) * plotH;
      const secondaryHeight = (secondarySeries[index] / maxValue) * plotH;
      drawRoundedRectPath(ctx, centerX - barWidth - 3, padding.top + plotH - paidHeight, barWidth, Math.max(4, paidHeight), 8);
      ctx.fillStyle = paidColor;
      ctx.fill();
      drawRoundedRectPath(ctx, centerX + 3, padding.top + plotH - secondaryHeight, barWidth, Math.max(4, secondaryHeight), 8);
      ctx.fillStyle = secondaryColor;
      ctx.fill();
    });
    drawTopTag(`Barras ${periodLabel}`);
  } else {
    function traceSmoothLine(values) {
      if (values.length === 0) return;
      if (values.length === 1) {
        ctx.moveTo(pointX(0), pointY(values[0]));
        ctx.lineTo(pointX(0), pointY(values[0]));
        return;
      }
      ctx.moveTo(pointX(0), pointY(values[0]));
      for (let i = 1; i < values.length; i += 1) {
        const prevX = pointX(i - 1);
        const prevY = pointY(values[i - 1]);
        const currX = pointX(i);
        const currY = pointY(values[i]);
        const midX = (prevX + currX) / 2;
        const midY = (prevY + currY) / 2;
        ctx.quadraticCurveTo(prevX, prevY, midX, midY);
        if (i === values.length - 1) {
          ctx.quadraticCurveTo(currX, currY, currX, currY);
        }
      }
    }

    function drawSmoothSeries(values, color, fillColor) {
      const bottomY = padding.top + plotH;
      ctx.beginPath();
      traceSmoothLine(values);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = chartTheme.shadow;
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 10;
      ctx.stroke();
      ctx.shadowColor = 'rgba(0, 0, 0, 0)';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.beginPath();
      traceSmoothLine(values);
      ctx.lineTo(pointX(values.length - 1), bottomY);
      ctx.lineTo(pointX(0), bottomY);
      ctx.closePath();
      const fillGradient = ctx.createLinearGradient(0, padding.top, 0, bottomY);
      fillGradient.addColorStop(0, fillColor);
      fillGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = fillGradient;
      ctx.fill();
      values.forEach((value, index) => {
        const x = pointX(index);
        const y = pointY(value);
        ctx.beginPath();
        ctx.arc(x, y, index === values.length - 1 ? 5.2 : 3.1, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    }

    drawSmoothSeries(secondarySeries, secondaryColor, secondaryFill);
    drawSmoothSeries(paidSeries, paidColor, paidFill);
    drawTopTag(`Linha ${periodLabel}`);
  }

  const paidLegendWidth = drawLegendChip(padding.left, 12, paidColor, `${paidLabel} ${formatCurrency(paidSeries[paidSeries.length - 1] || 0)}`);
  let secondaryLegendX = padding.left + paidLegendWidth + 8;
  let secondaryLegendY = 12;
  if (secondaryLegendX > width - 160) {
    secondaryLegendX = padding.left;
    secondaryLegendY = isNarrow ? 40 : 44;
  }
  drawLegendChip(secondaryLegendX, secondaryLegendY, secondaryColor, `${secondaryLabel} ${formatCurrency(secondarySeries[secondarySeries.length - 1] || 0)}`);

  ctx.fillStyle = chartTheme.label;
  ctx.font = `${isNarrow ? 10 : 11}px ${CHART_BODY_FONT}`;
  ctx.textAlign = 'left';
  labels.forEach((label, index) => {
    if (index % labelStep !== 0 && index !== labels.length - 1) return;
    const x = chartType === 'bar'
      ? padding.left + (plotW / Math.max(pointsCount, 1)) * index + 4
      : pointX(index) - 10;
    ctx.fillText(String(label), x, height - 12);
  });
}

function drawFinanceSeriesCanvasAnimated(canvas, series, options = {}) {
  if (!canvas || !series) return;
  const previousRaf = chartAnimationRafByCanvas.get(canvas);
  if (previousRaf) {
    window.cancelAnimationFrame(previousRaf);
  }
  const duration = Math.max(240, Number(options.durationMs) || 780);
  const start = performance.now();
  let active = true;

  function frame(now) {
    if (!active) return;
    const progress = Math.min(1, (now - start) / duration);
    drawFinanceSeriesCanvas(canvas, series, { ...options, progress });
    if (progress < 1) {
      const rafId = requestAnimationFrame(frame);
      chartAnimationRafByCanvas.set(canvas, rafId);
      return;
    }
    chartAnimationRafByCanvas.delete(canvas);
  }

  const rafId = requestAnimationFrame(frame);
  chartAnimationRafByCanvas.set(canvas, rafId);
  return () => {
    active = false;
    const running = chartAnimationRafByCanvas.get(canvas);
    if (running) {
      window.cancelAnimationFrame(running);
      chartAnimationRafByCanvas.delete(canvas);
    }
  };
}

function drawWalletCanvas(canvas, user, optionsOrMonth = getCurrentMonthKey()) {
  if (!canvas || !user) return;
  const chartTheme = getActiveChartTheme();
  const options = typeof optionsOrMonth === 'object'
    ? optionsOrMonth
    : { anchorMonthKey: optionsOrMonth };
  const anchorMonthKey = options.anchorMonthKey || getCurrentMonthKey();
  const series = buildFinanceSeries(user, 8, anchorMonthKey);
  const chartOptions = {
    secondaryKey: 'charge',
    paidLabel: options.paidLabel || 'Pago',
    debtLabel: options.debtLabel || 'Cobrado',
    periodLabel: options.periodLabel || getFinanceChartScopeLabel(series.monthKeys.length, anchorMonthKey),
    paidColor: options.paidColor || chartTheme.paidColor,
    debtColor: options.debtColor || chartTheme.debtColor,
    paidFill: options.paidFill || chartTheme.paidFill,
    debtFill: options.debtFill || chartTheme.debtFill
  };
  if (options.animate !== true) {
    drawFinanceSeriesCanvas(canvas, series, chartOptions);
    return;
  }
  drawFinanceSeriesCanvasAnimated(canvas, series, chartOptions);
}

function renderSeriesDetails(outputEl, series, selectedIndex = -1, options = {}) {
  if (!outputEl || !series) return;
  const labels = Array.isArray(series.labels) ? series.labels : [];
  const paidValues = Array.isArray(series.paidSeries) ? series.paidSeries : [];
  const chargeValues = Array.isArray(series.chargeSeries) ? series.chargeSeries : [];
  const debtValues = Array.isArray(series.debtSeries) ? series.debtSeries : [];
  const monthKeys = Array.isArray(series.monthKeys) ? series.monthKeys : [];
  const secondaryKey = options.secondaryKey === 'debt' ? 'debt' : 'charge';
  const paidLabel = options.paidLabel || 'Pago';
  const secondaryLabel = secondaryKey === 'debt' ? 'Divida' : 'Cobrado';
  const secondaryValues = secondaryKey === 'debt' ? debtValues : chargeValues;
  const safeIndex = Math.max(0, Math.min(labels.length - 1, selectedIndex >= 0 ? selectedIndex : labels.length - 1));

  if (labels.length === 0) {
    outputEl.innerHTML = '<div class="empty-state">Sem dados para detalhar.</div>';
    return;
  }

  const rows = labels
    .map((label, index) => {
      const paid = Number(paidValues[index] || 0);
      const secondary = Number(secondaryValues[index] || 0);
      const debt = Number(debtValues[index] || 0);
      const prevPaid = index > 0 ? Number(paidValues[index - 1] || 0) : 0;
      const prevSecondary = index > 0 ? Number(secondaryValues[index - 1] || 0) : 0;
      const paidDelta = paid - prevPaid;
      const secondaryDelta = secondary - prevSecondary;
      const deltaLabelA = `${paidDelta >= 0 ? '+' : ''}${formatCurrency(paidDelta)}`;
      const deltaLabelB = `${secondaryDelta >= 0 ? '+' : ''}${formatCurrency(secondaryDelta)}`;
      const monthFull = monthKeys[index] ? getMonthLabelFromKey(monthKeys[index]) : label;
      return `
        <tr class="${index === safeIndex ? 'active' : ''}">
          <td>${escapeHtml(monthFull)}</td>
          <td>${formatCurrency(paid)} <small>${escapeHtml(deltaLabelA)}</small></td>
          <td>${formatCurrency(secondary)} <small>${escapeHtml(deltaLabelB)}</small></td>
          <td>${formatCurrency(debt)}</td>
        </tr>
      `;
    })
    .join('');

  const selectedLabel = monthKeys[safeIndex] ? getMonthLabelFromKey(monthKeys[safeIndex]) : labels[safeIndex];
  outputEl.innerHTML = `
    <div class="chart-details-head">
      <strong>Detalhe selecionado: ${escapeHtml(selectedLabel)}</strong>
      <small>Clique no grafico para trocar o mes destacado</small>
    </div>
    <div class="table-wrap chart-details-table">
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>${escapeHtml(paidLabel)}</th>
            <th>${escapeHtml(secondaryLabel)}</th>
            <th>Divida</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function bindChartDetails(canvas, series, outputEl, options = {}) {
  if (!canvas || !series || !outputEl) return;
  renderSeriesDetails(outputEl, series, -1, options);

  canvas.addEventListener('click', (event) => {
    const labels = Array.isArray(series.labels) ? series.labels : [];
    if (labels.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isNarrow = rect.width <= 420;
    const paddingLeft = isNarrow ? 34 : 44;
    const paddingRight = isNarrow ? 10 : 18;
    const plotW = Math.max(1, rect.width - paddingLeft - paddingRight);
    const relative = Math.max(0, Math.min(plotW, x - paddingLeft));
    const idx = labels.length === 1
      ? 0
      : Math.round(relative / (plotW / (labels.length - 1)));
    renderSeriesDetails(outputEl, series, idx, options);
  });
}

function sortFinanceHistoryDescending(history = []) {
  return (Array.isArray(history) ? history.slice() : []).sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
}

function getWalletHistoryEntries(user, options = {}) {
  const allEntries = sortFinanceHistoryDescending(user && Array.isArray(user.financeHistory) ? user.financeHistory : []);
  const type = String(options.type || '').trim();
  const monthKey = String(options.monthKey || '').trim();
  const types = Array.isArray(options.types) ? options.types : null;
  const filtered = allEntries.filter((entry) => {
    if (monthKey && getMonthKeyFromTimestamp(entry.timestamp) !== monthKey) return false;
    if (types && types.length > 0) {
      return types.includes(entry.type);
    }
    if (type) {
      return entry.type === type;
    }
    return true;
  });
  const limit = Math.max(0, Number(options.limit) || 0);
  return limit > 0 ? filtered.slice(0, limit) : filtered;
}

function getUserLastPaymentEntry(user) {
  const [latestPayment] = getWalletHistoryEntries(user, { type: 'payment', limit: 1 });
  return latestPayment || null;
}

function getWalletEntryTone(entry) {
  if (!entry) return 'neutral';
  if (entry.type === 'payment') return 'positive';
  if (entry.type === 'charge') return 'warning';
  if (entry.type === 'loan') return 'warning';
  return 'neutral';
}

function getWalletEntryLabel(entry) {
  if (!entry) return 'Movimentacao';
  if (entry.type === 'payment') return 'Pagamento';
  if (entry.type === 'charge') return 'Cobranca';
  if (entry.type === 'loan') return 'Emprestimo';
  return 'Ajuste';
}

function renderWalletHistoryList(entries, emptyMessage = 'Sem movimentacoes neste periodo.') {
  if (!Array.isArray(entries) || entries.length === 0) {
    return `<div class="wallet-history-empty">${escapeHtml(emptyMessage)}</div>`;
  }

  return entries
    .map((entry) => {
      const tone = getWalletEntryTone(entry);
      const note = String(entry.note || '').trim();
      return `
        <article class="wallet-history-item ${tone}">
          <div class="wallet-history-copy">
            <span class="wallet-history-type">${escapeHtml(getWalletEntryLabel(entry))}</span>
            <strong>${formatCurrency(entry.amount)}</strong>
            <p>${escapeHtml(note || 'Sem observacao adicional.')}</p>
          </div>
          <div class="wallet-history-meta">
            <small>${formatDateTime(entry.timestamp)}</small>
            <small>${escapeHtml(entry.actor || 'sistema')}</small>
          </div>
        </article>
      `;
    })
    .join('');
}

function closeWalletDetailModal() {
  if (!els.walletDetailModal) return;
  els.walletDetailModal.classList.add('hidden');
  document.body.classList.remove('wallet-detail-open');
}

function renderWalletDetailModal() {
  if (!els.walletDetailBody) return;
  const user = getUserByUsername(walletDetailState.username);
  if (!user) {
    els.walletDetailBody.innerHTML = '<div class="empty-state">Carteira nao encontrada.</div>';
    return;
  }

  const monthKeys = getFinanceChartMonthKeys(FINANCE_CHART_MONTH_WINDOW, walletDetailState.selectedMonthKey || getCurrentMonthKey());
  const fallbackMonthKey = monthKeys[monthKeys.length - 1] || getCurrentMonthKey();
  const selectedMonthKey = monthKeys.includes(walletDetailState.selectedMonthKey) ? walletDetailState.selectedMonthKey : fallbackMonthKey;
  walletDetailState.selectedMonthKey = selectedMonthKey;

  const periodSummary = getUserFinanceMonthSummary(user, selectedMonthKey);
  const fullHistory = getWalletHistoryEntries(user, { monthKey: selectedMonthKey });
  const paymentHistory = getWalletHistoryEntries(user, { monthKey: selectedMonthKey, type: 'payment' });
  const latestHistory = getWalletHistoryEntries(user, { limit: WALLET_DETAIL_RECENT_HISTORY_LIMIT });
  const latestPayment = getUserLastPaymentEntry(user);
  const historyCount = Array.isArray(user.financeHistory) ? user.financeHistory.length : 0;
  const chartPeriodLabel = getFinanceChartScopeLabel(FINANCE_CHART_MONTH_WINDOW, selectedMonthKey);
  const selectedMonthLabel = getMonthLongLabelFromKey(selectedMonthKey);

  els.walletDetailBody.innerHTML = `
    <div class="wallet-detail-shell">
      <div class="wallet-detail-topbar">
        <span class="wallet-detail-kicker">Carteira detalhada</span>
        <button id="wallet-detail-close" class="close-modal-btn wallet-detail-close" type="button" aria-label="Fechar detalhe">&times;</button>
      </div>

      <section class="wallet-detail-hero">
        <div class="wallet-detail-hero-main">
          <div class="wallet-detail-identity">
            ${renderUserAvatar(user, { size: 'md' })}
            <div class="wallet-detail-identity-copy">
              <p id="wallet-detail-title">${escapeHtml(getUserDisplayName(user))}</p>
              <small>@${escapeHtml(user.username)} - ${escapeHtml(roleLabel(user.role))}</small>
            </div>
          </div>
          <h2>${escapeHtml(getUserDisplayName(user))} em foco</h2>
          <p>Historico completo de pagamentos, cobrancas e evolucao mensal em uma leitura fluida e objetiva.</p>
          <div class="wallet-detail-chip-row">
            <span class="wallet-detail-chip">Periodo visual: ${escapeHtml(chartPeriodLabel)}</span>
            <span class="wallet-detail-chip">Mes ativo: ${escapeHtml(selectedMonthLabel)}</span>
            <span class="wallet-detail-chip">${historyCount} movimentacao(oes) registradas</span>
          </div>
        </div>

        <div class="wallet-detail-stat-grid">
          <article class="wallet-detail-stat">
            <span>Total da carteira</span>
            <strong>${formatCurrency(user.totalPaid)}</strong>
            <small>Acumulado geral registrado</small>
          </article>
          <article class="wallet-detail-stat">
            <span>Pago no periodo</span>
            <strong>${formatCurrency(periodSummary.paid)}</strong>
            <small>${paymentHistory.length} pagamento(s) em ${escapeHtml(selectedMonthLabel)}</small>
          </article>
          <article class="wallet-detail-stat">
            <span>Cobrado no periodo</span>
            <strong>${formatCurrency(periodSummary.charged)}</strong>
            <small>Inclui cobrancas e ajustes</small>
          </article>
          <article class="wallet-detail-stat">
            <span>Ultimo pagamento</span>
            <strong>${latestPayment ? formatCurrency(latestPayment.amount) : formatCurrency(0)}</strong>
            <small>${latestPayment ? formatDateTime(latestPayment.timestamp) : 'Nenhum pagamento ainda'}</small>
          </article>
        </div>
      </section>

      <section class="wallet-detail-layout">
        <div class="wallet-detail-visual">
          <canvas id="wallet-detail-canvas" class="wallet-canvas wallet-detail-canvas"></canvas>
          <div id="wallet-detail-series-details" class="chart-details wallet-detail-series-details"></div>
        </div>

        <div class="wallet-detail-ledger">
          <div class="wallet-detail-month-picker">
            ${monthKeys.map((monthKey) => `
              <button
                class="wallet-month-chip ${monthKey === selectedMonthKey ? 'active' : ''}"
                type="button"
                data-wallet-detail-month="${escapeHtml(monthKey)}"
              >
                ${escapeHtml(getMonthLabelFromKey(monthKey))}
              </button>
            `).join('')}
          </div>

          <div class="wallet-detail-mini-grid">
            <article class="wallet-detail-mini-card">
              <span>Pagamentos</span>
              <strong>${formatCurrency(periodSummary.paid)}</strong>
            </article>
            <article class="wallet-detail-mini-card">
              <span>Cobrancas</span>
              <strong>${formatCurrency(periodSummary.fines)}</strong>
            </article>
            <article class="wallet-detail-mini-card">
              <span>Divida atual</span>
              <strong>${formatDebtCurrency(periodSummary.debt)}</strong>
            </article>
            <article class="wallet-detail-mini-card">
              <span>Lucro acumulado</span>
              <strong>${formatCurrency(periodSummary.profit)}</strong>
            </article>
          </div>

          <div class="wallet-detail-history-panel">
            <div class="wallet-detail-history-head">
              <div>
                <h3>Pagamentos de ${escapeHtml(selectedMonthLabel)}</h3>
                <p>Quando foi pago, quanto entrou e quais observacoes ficaram registradas.</p>
              </div>
            </div>
            <div class="wallet-history-list">
              ${renderWalletHistoryList(paymentHistory, 'Nenhum pagamento registrado neste mes.')}
            </div>
          </div>

          <div class="wallet-detail-history-panel wallet-detail-history-panel-secondary">
            <div class="wallet-detail-history-head">
              <div>
                <h3>Historico do periodo</h3>
                <p>Visao organizada com pagamentos, cobrancas, emprestimos e ajustes de ${escapeHtml(selectedMonthLabel)}.</p>
              </div>
            </div>
            <div class="wallet-history-list">
              ${renderWalletHistoryList(fullHistory, 'Sem movimentacoes no periodo selecionado.')}
            </div>
          </div>

          <div class="wallet-detail-history-panel wallet-detail-history-panel-secondary">
            <div class="wallet-detail-history-head">
              <div>
                <h3>Ultimas movimentacoes gerais</h3>
                <p>Leitura rapida do historico mais recente desta carteira.</p>
              </div>
            </div>
            <div class="wallet-history-list compact">
              ${renderWalletHistoryList(latestHistory, 'Nenhuma movimentacao registrada ainda.')}
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  const modalCanvas = document.getElementById('wallet-detail-canvas');
  const seriesOutput = document.getElementById('wallet-detail-series-details');
  const closeButton = document.getElementById('wallet-detail-close');
  const series = buildFinanceSeries(user, FINANCE_CHART_MONTH_WINDOW, selectedMonthKey);

  drawWalletCanvas(modalCanvas, user, {
    anchorMonthKey: selectedMonthKey,
    animate: true,
    paidLabel: 'Pago',
    debtLabel: 'Cobrado',
    periodLabel: chartPeriodLabel
  });
  bindChartDetails(modalCanvas, series, seriesOutput, {
    secondaryKey: 'charge',
    paidLabel: 'Pago'
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeWalletDetailModal);
  }

  els.walletDetailBody.querySelectorAll('[data-wallet-detail-month]').forEach((button) => {
    button.addEventListener('click', () => {
      walletDetailState.selectedMonthKey = button.dataset.walletDetailMonth || getCurrentMonthKey();
      renderWalletDetailModal();
    });
  });
}

function openWalletDetailModal(username, options = {}) {
  const user = getUserByUsername(username);
  if (!user) {
    showNotification('Carteira nao encontrada.', 'warning');
    return;
  }

  walletDetailState = {
    username: user.username,
    selectedMonthKey: parseMonthKey(options.monthKey) ? options.monthKey : getCurrentMonthKey()
  };
  renderWalletDetailModal();
  if (els.walletDetailModal) {
    els.walletDetailModal.classList.remove('hidden');
  }
  document.body.classList.add('wallet-detail-open');
}

function attachWalletCardInteractions(container = els.content) {
  if (!container) return;
  container.querySelectorAll('[data-wallet-card-user]').forEach((card) => {
    if (card.dataset.walletCardBound === '1') return;
    card.dataset.walletCardBound = '1';
    card.addEventListener('click', () => {
      openWalletDetailModal(card.dataset.walletCardUser);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openWalletDetailModal(card.dataset.walletCardUser);
    });
  });
}

function commitDataPersistence() {
  persistLocalDataOnly();
  scheduleAppStateSync();
}

function flushPendingSaveData() {
  if (!pendingSaveDataFlush) return;
  pendingSaveDataFlush = false;
  commitDataPersistence();
}

function saveData(options = {}) {
  if (options && options.immediate === true) {
    if (pendingSaveDataFlush) {
      flushPendingSaveData();
    } else {
      commitDataPersistence();
    }
    return;
  }

  if (pendingSaveDataFlush) return;
  pendingSaveDataFlush = true;
  Promise.resolve().then(() => {
    flushPendingSaveData();
  });
}

function addLog(action) {
  logs.push({
    timestamp: Date.now(),
    user: session ? session.username : 'sistema',
    action: String(action || 'acao sem descricao')
  });
  logs = capLogs(logs);
  saveData();
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${escapeHtml(type)}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  requestAnimationFrame(() => notification.classList.add('show'));

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 240);
  }, 3400);
}

async function handleLogin() {
  if (loginAttemptInFlight) return;

  const username = els.usernameInput.value.trim().toLowerCase();
  const password = els.passwordInput.value;

  if (!username || !password) {
    showNotification('Preencha usuario e senha.', 'warning');
    return;
  }

  loginAttemptInFlight = true;
  setLoginBusyState(true, 'Entrando...');
  let remoteSessionCreated = false;
  try {
    resetInitialServerStateTracking();
    const payload = await apiRequest(API_AUTH_LOGIN_ENDPOINT, {
      method: 'POST',
      body: { username, password }
    });
    remoteSessionCreated = true;

    setLoginBusyState(true, 'Carregando...');
    const user = await activateAuthenticatedSession({
      username: payload && payload.user ? payload.user.username : username,
      role: payload && payload.user ? payload.user.role : 'member',
      loginAt: Number(payload && payload.createdAt) || Date.now()
    }, {
      registerAccess: true,
      showWelcome: true
    });

    if (settings.maintenanceMode && user.role !== 'superadmin' && user.role !== 'inteligencia') {
      handleLogout();
      showNotification(settings.maintenanceMessage || 'Portal em manutencao.', 'warning');
    }
  } catch (error) {
    if (remoteSessionCreated) {
      try {
        await apiRequest(API_AUTH_LOGOUT_ENDPOINT, { method: 'POST' });
      } catch {
        // ignore logout failures after partial login
      }
    }
    session = null;
    showNotification(error && error.message ? error.message : 'Falha ao autenticar.', 'error');
  } finally {
    loginAttemptInFlight = false;
    setLoginBusyState(false);
  }
}

function handleLogout() {
  const logoutUsername = session ? session.username : '';
  apiRequest(API_AUTH_LOGOUT_ENDPOINT, { method: 'POST' }).catch(() => {
    // ignore logout transport failures
  });
  if (session) {
    registerUserOffline(session.username, 'logout manual');
  }

  destroyStealthChat(false);
  resetInitialServerStateTracking();
  session = null;
  setHeaderSearchValue('');
  currentPage = 'dashboard';
  activeChatTicketId = null;
  closeChat();

  stopClock();
  removePresence(logoutUsername);
  stopPresenceHeartbeat();
  disconnectPresenceSocket(false);
  stopEspionageAutoRefresh();
  clearLiveBroadcastBanner();

  els.loginContainer.classList.remove('hidden');
  els.appContainer.classList.add('hidden');
  els.appContainer.classList.remove('sidebar-open');
  els.passwordInput.value = '';
  updateCurrentUserDisplay();
  updateConnectionStatusDisplay();
  els.content.innerHTML = '';
  els.sidebar.innerHTML = '';
  if (els.mobileQuickNav) {
    els.mobileQuickNav.innerHTML = '';
  }
  if (realtimeRenderRateTimer) {
    clearTimeout(realtimeRenderRateTimer);
    realtimeRenderRateTimer = null;
  }
  pendingRealtimeRender = false;
  if (presenceViewRefreshTimer) {
    clearTimeout(presenceViewRefreshTimer);
    presenceViewRefreshTimer = null;
  }
  saveData({ immediate: true });
}

function startClock() {
  stopClock();
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

function stopClock() {
  if (clockInterval) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
}

function updateClock() {
  if (!els.liveClock) return;
  const now = new Date();
  els.liveClock.textContent = now.toLocaleString('pt-BR');
}
function getNavigationLinks() {
  const links = [{ id: 'dashboard', label: 'Painel da carteira' }];

  if (canManageWallets()) {
    links.push({ id: 'walletControl', label: 'Controle de carteiras' });
  }

  if (session && session.role === 'superadmin') {
    links.push({ id: 'users', label: 'Usuarios' });
  }

  links.push({ id: 'profile', label: 'Meu perfil' });

  return links;
}

function buildNavInitials(label) {
  const parts = String(label || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  return (parts.map((part) => part.charAt(0)).join('') || 'TP').toUpperCase();
}

function getNavigationMeta(pageId) {
  const meta = NAV_LINK_META[pageId];
  if (meta) return meta;
  return {
    group: 'workspace',
    icon: buildNavInitials(PAGE_TITLES[pageId] || pageId),
    hint: PAGE_TITLES[pageId] || 'Acesso rapido'
  };
}

function renderMobileQuickNav(links = getNavigationLinks()) {
  if (!els.mobileQuickNav) return;
  if (!session) {
    els.mobileQuickNav.innerHTML = '';
    return;
  }

  const linksById = new Map(links.map((link) => [link.id, link]));
  const quickLinks = MOBILE_QUICK_LINKS
    .map((item) => {
      const match = linksById.get(item.id);
      return match ? { ...match, mobileLabel: item.label } : null;
    })
    .filter(Boolean);

  els.mobileQuickNav.innerHTML = '';

  quickLinks.forEach((link) => {
    const meta = getNavigationMeta(link.id);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mobile-quick-link';
    button.dataset.page = link.id;
    button.innerHTML = `
      <span class="mobile-quick-icon">${escapeHtml(meta.icon || buildNavInitials(link.label))}</span>
      <span class="mobile-quick-label">${escapeHtml(link.mobileLabel || link.label)}</span>
    `;
    button.addEventListener('click', () => {
      navigate(link.id);
    });
    els.mobileQuickNav.appendChild(button);
  });
}

function renderSidebar() {
  els.sidebar.innerHTML = '';
  const sidebarUser = getCurrentUser();
  const walletUsers = getWalletParticipants(users);
  const currentMonthKey = getCurrentMonthKey();
  const aggregateMonth = getAggregateMonthFinanceSummary(currentMonthKey, walletUsers);
  const summaryName = sidebarUser ? getUserDisplayName(sidebarUser) : (session ? session.username : 'Equipe');
  const greetingName = String(summaryName || 'Equipe').split(/\s+/).filter(Boolean)[0] || 'Equipe';
  const summaryCard = document.createElement('section');
  summaryCard.className = 'sidebar-summary';
  summaryCard.innerHTML = `
    <div class="sidebar-summary-top">
      <span class="sidebar-brand-chip">TP Hub</span>
      <span class="sidebar-summary-role">${escapeHtml(roleLabel(sidebarUser ? sidebarUser.role : (session ? session.role : 'member')))}</span>
    </div>
    <div class="sidebar-summary-main">
      ${renderUserAvatar(sidebarUser || (session ? session.username : 'TP'), { size: 'md' })}
      <div class="sidebar-summary-copy">
        <strong>${escapeHtml(greetingName)}</strong>
        <span>Carteiras em tempo real</span>
      </div>
    </div>
    <div class="sidebar-summary-grid">
      <div><strong>${walletUsers.length}</strong><span>Carteiras</span></div>
      <div><strong>${formatCurrency(aggregateMonth.paid)}</strong><span>Pago no mes</span></div>
      <div><strong>${formatCurrency(aggregateMonth.walletValue)}</strong><span>Total pago</span></div>
    </div>
    <div class="sidebar-summary-actions">
      <button
        type="button"
        class="sidebar-action-btn"
        data-sidebar-action="theme"
        aria-pressed="${currentThemeMode === UI_THEME_DARK ? 'true' : 'false'}"
      >
        ${escapeHtml(currentThemeMode === UI_THEME_DARK ? 'Modo claro' : 'Modo escuro')}
      </button>
      <button type="button" class="sidebar-action-btn sidebar-action-btn-danger" data-sidebar-action="logout">Sair</button>
    </div>
  `;
  const sidebarThemeButton = summaryCard.querySelector('[data-sidebar-action="theme"]');
  if (sidebarThemeButton) {
    sidebarThemeButton.addEventListener('click', () => {
      toggleThemeMode();
      sidebarThemeButton.textContent = currentThemeMode === UI_THEME_DARK ? 'Modo claro' : 'Modo escuro';
      sidebarThemeButton.setAttribute('aria-pressed', currentThemeMode === UI_THEME_DARK ? 'true' : 'false');
    });
  }
  const sidebarLogoutButton = summaryCard.querySelector('[data-sidebar-action="logout"]');
  if (sidebarLogoutButton) {
    sidebarLogoutButton.addEventListener('click', handleLogout);
  }
  els.sidebar.appendChild(summaryCard);

  const links = getNavigationLinks();
  const linksByGroup = new Map();
  links.forEach((link) => {
    const meta = getNavigationMeta(link.id);
    if (!linksByGroup.has(meta.group)) {
      linksByGroup.set(meta.group, []);
    }
    linksByGroup.get(meta.group).push({ ...link, meta });
  });

  linksByGroup.forEach((groupLinks, groupId) => {
    const group = document.createElement('section');
    group.className = 'sidebar-group';
    const heading = document.createElement('p');
    heading.className = 'sidebar-group-title';
    heading.textContent = NAV_GROUP_TITLES[groupId] || 'Acessos';
    group.appendChild(heading);

    groupLinks.forEach((link) => {
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.dataset.page = link.id;
      anchor.className = 'nav-link-card';
      const badgeHtml = typeof link.badge === 'number' && link.badge > 0
        ? `<span class="nav-pill">${link.badge}</span>`
        : '';
      anchor.innerHTML = `
        <span class="nav-link-main">
          <span class="nav-icon">${escapeHtml(link.meta.icon || buildNavInitials(link.label))}</span>
          <span class="nav-copy">
            <strong>${escapeHtml(link.label)}</strong>
            <small>${escapeHtml(link.meta.hint || PAGE_TITLES[link.id] || 'Acesso rapido')}</small>
          </span>
        </span>
        ${badgeHtml}
      `;

      anchor.addEventListener('click', (event) => {
        event.preventDefault();
        navigate(link.id);
        if (window.innerWidth <= 920) {
          els.appContainer.classList.remove('sidebar-open');
        }
      });

      group.appendChild(anchor);
    });

    els.sidebar.appendChild(group);
  });

  renderMobileQuickNav(links);
  updateSidebarSelection();
}

function updateSidebarSelection() {
  const links = els.sidebar.querySelectorAll('a');
  links.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  if (els.mobileQuickNav) {
    const quickLinks = els.mobileQuickNav.querySelectorAll('button[data-page]');
    quickLinks.forEach((button) => {
      if (button.dataset.page === currentPage) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}

function navigate(page) {
  const previousPage = currentPage;
  if (currentPage === 'stealthChat' && page !== 'stealthChat') {
    destroyStealthChat(false);
  }
  if (currentPage === 'espionage' && page !== 'espionage') {
    stopEspionageAutoRefresh();
  }

  const availablePages = new Set(getNavigationLinks().map((link) => link.id));
  if (!availablePages.has(page)) {
    page = 'dashboard';
  }

  currentPage = page;
  updatePresence(currentPage);
  els.currentPageTitle.textContent = PAGE_TITLES[page] || 'Portal';
  renderContent(page);
  renderSidebar();
}

function renderContent(page) {
  switch (page) {
    case 'dashboard':
      renderDashboard();
      return;
    case 'activityCenter':
      renderActivityCenter();
      return;
    case 'myTickets':
      renderMyTickets();
      return;
    case 'createTicket':
      renderCreateTicket();
      return;
    case 'pending':
      renderPendingTickets();
      return;
    case 'allTickets':
      renderAllTickets();
      return;
    case 'users':
      renderUsersManagement();
      return;
    case 'logs':
      renderLogs();
      return;
    case 'superTools':
      renderSuperTools();
      return;
    case 'tasks':
      renderTasks();
      return;
    case 'notes':
      renderNotes();
      return;
    case 'announcements':
      renderAnnouncements();
      return;
    case 'knowledge':
      renderKnowledge();
      return;
    case 'tools':
      renderTools();
      return;
    case 'stealthChat':
      renderStealthChat();
      return;
    case 'staffChat':
      renderStaffChat();
      return;
    case 'intelCenter':
      renderIntelCenter();
      return;
    case 'walletControl':
      renderWalletControl();
      return;
    case 'espionage':
      renderEspionage();
      return;
    case 'profile':
      renderProfile();
      return;
    case 'searchHub':
      renderSearchHub();
      return;
    default:
      renderDashboard();
  }
}

function renderActivityCenter() {
  if (!session) {
    renderAccessDenied('Faca login para abrir a central operacional.');
    return;
  }

  const scopedTickets = getScopedTickets()
    .filter((ticket) => ticket.status !== 'closed')
    .sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0));
  const attentionTickets = scopedTickets
    .filter((ticket) => ticket.priority === 'urgent' || ticket.status === 'pending')
    .slice(0, 6);
  const todayIsoDate = getTodayIsoDate();
  const tasksAtRisk = getUserTasks()
    .filter((task) => task.status !== 'done')
    .filter((task) => !task.dueDate || task.dueDate <= todayIsoDate)
    .sort((a, b) => String(a.dueDate || '9999-12-31').localeCompare(String(b.dueDate || '9999-12-31')))
    .slice(0, 6);
  const recentAnnouncements = announcements
    .slice()
    .filter((item) => (Number(item.deletedAt) || 0) === 0)
    .filter((item) => item.audience === 'all' || isAdminRole(session.role))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);
  const onlineUsers = getOnlinePresenceList().slice(0, 8);
  const recentOps = logs.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

  const attentionCards = attentionTickets.length > 0
    ? attentionTickets.map((ticket) => `
        <article class="result-card">
          <div class="result-card-head">
            <strong>Ticket #${ticket.id}</strong>
            <span class="result-tag">${escapeHtml(PRIORITY_LABELS[ticket.priority] || ticket.priority)}</span>
          </div>
          <p>${escapeHtml(toShortText(ticket.title, 120))}</p>
          <small>${escapeHtml(STATUS_LABELS[ticket.status] || ticket.status)} | ${escapeHtml(ticket.creator)}</small>
        </article>
      `).join('')
    : '<div class="empty-state">Nenhum ticket urgente ou pendente no seu escopo.</div>';

  const tasksCards = tasksAtRisk.length > 0
    ? tasksAtRisk.map((task) => `
        <article class="result-card">
          <div class="result-card-head">
            <strong>${escapeHtml(task.title)}</strong>
            <span class="result-tag">${escapeHtml(priorityLabel(task.priority))}</span>
          </div>
          <p>${escapeHtml(toShortText(task.description || 'Sem descricao adicional.', 120))}</p>
          <small>${task.dueDate ? `Entrega em ${escapeHtml(task.dueDate)}` : 'Sem prazo definido'}</small>
        </article>
      `).join('')
    : '<div class="empty-state">Nenhuma tarefa em risco imediato.</div>';

  const announcementCards = recentAnnouncements.length > 0
    ? recentAnnouncements.map((item) => `
        <article class="result-card">
          <div class="result-card-head">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="result-tag">Comunicado</span>
          </div>
          <p>${escapeHtml(toShortText(item.content || '', 150))}</p>
          <small>${escapeHtml(item.author || 'sistema')} | ${formatDateTime(item.createdAt)}</small>
        </article>
      `).join('')
    : '<div class="empty-state">Sem comunicados recentes.</div>';

  const onlineRows = onlineUsers.length > 0
    ? onlineUsers.map((entry) => `
        <tr>
          <td>${renderUserIdentity(getUserByUsername(entry.username) || entry.username, { size: 'xs', showRole: false })}</td>
          <td>${escapeHtml(roleLabel(entry.role))}</td>
          <td>${escapeHtml(PAGE_TITLES[entry.page] || entry.page)}</td>
          <td>${escapeHtml(formatDuration(Math.max(0, Date.now() - entry.lastSeen)))}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="4" class="empty-state">Ninguem online agora.</td></tr>';

  const recentOpsRows = recentOps.length > 0
    ? recentOps.map((entry) => `
        <tr>
          <td>${escapeHtml(formatDateTime(entry.timestamp))}</td>
          <td>${escapeHtml(entry.user)}</td>
          <td>${escapeHtml(entry.action)}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="3" class="empty-state">Sem registros recentes.</td></tr>';

  els.content.innerHTML = `
    <section class="page-intro">
      <div class="page-intro-main">
        <span class="page-intro-kicker">Atencao imediata</span>
        <h2>Central operacional com o que precisa de decisao agora.</h2>
        <p>Uma leitura unica para enxergar gargalos, equipe online, comunicados e trilha recente sem navegar por varios modulos.</p>
      </div>
      <div class="page-intro-side">
        <div class="page-intro-stat"><strong>${attentionTickets.length}</strong><span>tickets criticos</span></div>
        <div class="page-intro-stat"><strong>${tasksAtRisk.length}</strong><span>tarefas em risco</span></div>
        <div class="page-intro-stat"><strong>${onlineUsers.length}</strong><span>pessoas online</span></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Central operacional</h2>
          <p class="panel-subtitle">Visao rapida do que precisa de atencao agora, sem ficar pulando entre paginas.</p>
        </div>
        <div class="inline-actions">
          <button class="btn-primary" data-go="createTicket">Abrir ticket</button>
          <button class="btn-secondary" data-go="tasks">Ver tarefas</button>
          <button class="btn-ghost" data-go="announcements">Comunicados</button>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${attentionTickets.length}</div>
          <div class="stat-label">Tickets criticos no radar</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${tasksAtRisk.length}</div>
          <div class="stat-label">Tarefas em risco hoje</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${onlineUsers.length}</div>
          <div class="stat-label">Pessoas online agora</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${recentAnnouncements.length}</div>
          <div class="stat-label">Comunicados ativos recentes</div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3 class="panel-title">Fila de atencao</h3>
          <p class="panel-subtitle">Tickets e tarefas que merecem resposta ou decisao primeiro.</p>
        </div>
      </div>
      <div class="result-grid">
        ${attentionCards}
        ${tasksCards}
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3 class="panel-title">Comunicados recentes</h3>
          <p class="panel-subtitle">O que mudou ou precisa ser repassado para a operacao.</p>
        </div>
      </div>
      <div class="result-grid">
        ${announcementCards}
      </div>
    </section>

    <section class="panel">
      <div class="grid-2">
        <div>
          <h3 class="panel-title">Online agora</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Papel</th>
                  <th>Tela</th>
                  <th>Ativo ha</th>
                </tr>
              </thead>
              <tbody>${onlineRows}</tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 class="panel-title">Trilha recente</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Usuario</th>
                  <th>Acao</th>
                </tr>
              </thead>
              <tbody>${recentOpsRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;

  els.content.querySelectorAll('[data-go]').forEach((button) => {
    button.addEventListener('click', () => {
      navigate(button.dataset.go);
    });
  });
}

function renderSearchHub() {
  if (!session) {
    renderAccessDenied('Faca login para usar a busca global.');
    return;
  }

  const query = String(globalSearchQuery || (els.headerSearchInput ? els.headerSearchInput.value : '')).trim();
  setHeaderSearchValue(query);
  const results = collectGlobalSearchResults(query);

  const resultsHtml = query
    ? (
      results.length > 0
        ? results.map((item) => `
            <article class="result-card">
              <div class="result-card-head">
                <strong>${escapeHtml(item.title)}</strong>
                <span class="result-tag">${escapeHtml(item.type)}</span>
              </div>
              <p>${escapeHtml(item.description)}</p>
              <small>${escapeHtml(item.meta)}</small>
              <div class="inline-actions" style="margin-top: 12px;">
                <button class="btn-secondary" data-open-page="${escapeHtml(item.page)}">Abrir origem</button>
              </div>
            </article>
          `).join('')
        : '<div class="empty-state">Nenhum resultado para essa busca.</div>'
    )
    : '<div class="empty-state">Digite um termo acima para buscar usuarios, tickets, tarefas, comunicados e logs.</div>';

  els.content.innerHTML = `
    <section class="page-intro page-intro-search">
      <div class="page-intro-main">
        <span class="page-intro-kicker">Busca inteligente</span>
        <h2>Encontre usuarios, tickets, tarefas e registros em segundos.</h2>
        <p>Busca centralizada com resultados agrupados para cortar caminho na operacao diaria.</p>
      </div>
      <div class="page-intro-side">
        <div class="page-intro-stat"><strong>${results.length}</strong><span>resultados</span></div>
        <div class="page-intro-stat"><strong>${query ? '1' : '0'}</strong><span>consulta ativa</span></div>
        <div class="page-intro-stat"><strong>${query ? escapeHtml(query.slice(0, 12)) : '-'}</strong><span>termo atual</span></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Busca global</h2>
          <p class="panel-subtitle">Procure por contexto operacional sem navegar pagina por pagina.</p>
        </div>
      </div>
      <div class="search-summary">
        <strong>Consulta:</strong> ${query ? escapeHtml(query) : 'nenhuma'}<br />
        <strong>Resultados:</strong> ${results.length}
      </div>
    </section>

    <section class="panel">
      <div class="result-grid">
        ${resultsHtml}
      </div>
    </section>
  `;

  els.content.querySelectorAll('[data-open-page]').forEach((button) => {
    button.addEventListener('click', () => {
      navigate(button.dataset.openPage);
    });
  });
}

function renderDashboardLegacy() {
  let user = getCurrentUser();
  if (!user && session) {
    ensureCoreUsers();
    if (!getCurrentUser()) {
      const sessionKey = String(session.username || '').trim().toLowerCase();
      const canRestoreLockedUser = sessionKey === 'esther' || sessionKey === 'inteligencia tp';
      if (canRestoreLockedUser) {
        users.push(
          normalizeUser({
            username: session.username,
            password: DEFAULT_PASSWORD,
            role: session.role || 'member',
            status: 'active',
            debt: 0
          })
        );
      }
    }
    persistLocalDataOnly();
    user = getCurrentUser();
  }
  if (!user) {
    renderAccessDenied('Sessao invalida. Faca login novamente.');
    return;
  }

  const selectedMonthKey = getCurrentMonthKey();
  const chartTheme = getActiveChartTheme();
  const financeChartType = getFinanceChartType();
  const financeChartScopeLabel = getFinanceChartScopeLabel();

  const scopedTickets = getScopedTickets();
  const pendingCount = scopedTickets.filter((ticket) => ticket.status === 'pending').length;
  const activeCount = scopedTickets.filter((ticket) => ticket.status === 'active').length;
  const closedCount = scopedTickets.filter((ticket) => ticket.status === 'closed').length;
  const userTasks = getUserTasks();
  const openTasks = userTasks.filter((task) => task.status !== 'done');
  const dueSoon = openTasks
    .filter((task) => task.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);
  const recentAnnouncements = announcements
    .slice()
    .filter((item) => {
      if ((Number(item.deletedAt) || 0) > 0) return false;
      if (item.audience === 'all') return true;
      return Boolean(session && (session.role === 'admin' || session.role === 'superadmin'));
    })
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  const financeHistory = user && Array.isArray(user.financeHistory)
    ? user.financeHistory
        .filter((entry) => isTimestampInFinanceChartYear(entry.timestamp))
        .slice()
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 6)
    : [];
  const walletUsers = getWalletParticipants(users);
  const aggregateSeries = buildAggregateFinanceSeries(8, selectedMonthKey, walletUsers);
  const aggregateMonth = getAggregateMonthFinanceSummary(selectedMonthKey, walletUsers);
  const userMonthSummary = getUserFinanceMonthSummary(user, selectedMonthKey);
  const recentPaid = sumRecentPayments(user, 30);
  const dopamine = calculateDopamineStats(user);
  const initialPlan = calculateTenYearPlan(user ? user.debt : 0, 0);
  const initialGoal = Math.max(20, Number((userMonthSummary.charged || Math.max(1, user.debt / 12)).toFixed(2)));
  const monthLabel = getMonthLabelFromKey(selectedMonthKey);
  const heroName = String(getUserDisplayName(user) || user.username || 'Equipe').split(/\s+/).filter(Boolean)[0] || 'Equipe';
  const onlineUsers = getOnlinePresenceList().length;

  const heroStatCards = [
    { label: 'Pago no mes', value: formatCurrency(userMonthSummary.paid) },
    { label: 'Pendencias abertas', value: String(pendingCount) },
    { label: 'Tarefas ativas', value: String(openTasks.length) },
    { label: 'Equipe online', value: String(onlineUsers) }
  ];

  const highlightItems = [
    { label: 'Pago no mes atual', value: formatCurrency(userMonthSummary.paid) },
    { label: 'Multas/cobrancas no mes', value: formatCurrency(userMonthSummary.fines) },
    { label: 'Carteira acumulada', value: formatCurrency(user.totalPaid) },
    { label: 'Lucro acumulado', value: formatCurrency(user.walletProfit) },
    { label: 'Divida atual', value: formatCurrency(user.debt) }
  ];

  const dueSoonHtml = dueSoon.length > 0
    ? dueSoon.map((task) => `<div class="kpi-item"><strong>${escapeHtml(task.title)}</strong><span>${escapeHtml(priorityLabel(task.priority))} - entrega em ${escapeHtml(task.dueDate)}</span></div>`).join('')
    : '<div class="kpi-item"><strong>Sem tarefas com data definida</strong><span>Voce pode criar tarefas no modulo Tarefas.</span></div>';

  const announcementHtml = recentAnnouncements.length > 0
    ? recentAnnouncements.map((item) => `
        <div class="announcement">
          <div class="announcement-header">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${formatDateTime(item.createdAt)}</small>
          </div>
          <p>${escapeHtml(toShortText(item.content, 180))}</p>
          <div class="announcement-meta">${renderUserIdentity(item.author, { size: 'xs', showRole: false })}</div>
        </div>
      `).join('')
    : '<div class="empty-state">Nenhum comunicado publicado.</div>';

  const financeHistoryHtml = financeHistory.length > 0
    ? financeHistory
        .map((entry) => {
          const typeLabel = entry.type === 'payment'
            ? 'Pagamento'
            : entry.type === 'charge'
                ? 'Cobranca'
                : 'Ajuste';
          return `
            <div class="finance-item">
              <strong>${escapeHtml(typeLabel)} ${formatCurrency(entry.amount)}</strong>
              <small>${formatDateTime(entry.timestamp)} por ${escapeHtml(entry.actor || 'sistema')}</small>
            </div>
          `;
        })
        .join('')
    : '<div class="empty-state">Sem movimentacoes financeiras ainda.</div>';

  const hasPersonalChart = canUserHaveWalletChart(user);
  const walletChartsPublicForMembers = isWalletChartsPublicForMembers();
  const canViewSharedWalletCharts = canManageWallets()
    || (session && session.role === 'member' && walletChartsPublicForMembers);
  const memberChartItems = canViewSharedWalletCharts
    ? users
        .filter((member) => canUserHaveWalletChart(member))
        .slice()
        .sort((a, b) => (b.totalPaid || 0) - (a.totalPaid || 0))
        .map((member, index) => {
          const summary = getUserFinanceMonthSummary(member, selectedMonthKey);
          return {
            member,
            summary,
            canvasId: `member-wallet-canvas-${index}`
          };
        })
    : [];

  const memberCardsHtml = memberChartItems.length > 0
    ? memberChartItems
        .map((entry) => `
          <article class="member-wallet-card">
            <div class="member-wallet-head">
              <div class="member-wallet-head-main">
                ${renderUserAvatar(entry.member, { size: 'xs' })}
                <div class="member-wallet-head-copy">
                  <strong>${escapeHtml(getUserDisplayName(entry.member))}</strong>
                  <small>@${escapeHtml(entry.member.username)} - ${escapeHtml(roleLabel(entry.member.role))}</small>
                </div>
              </div>
            </div>
            <canvas id="${entry.canvasId}" class="member-wallet-canvas"></canvas>
            <div class="member-wallet-meta">
              <span>Carteira: <strong>${formatCurrency(entry.summary.walletValue)}</strong></span>
              <span>Pago no mes: <strong>${formatCurrency(entry.summary.paid)}</strong></span>
              <span>Multas: <strong>${formatCurrency(entry.summary.fines)}</strong></span>
              <span>Lucro: <strong>${formatCurrency(entry.summary.profit)}</strong></span>
              <span>Divida atual: <strong class="debt-amount">${formatCurrency(entry.summary.debt)}</strong></span>
            </div>
          </article>
        `)
        .join('')
    : '<div class="empty-state">Sem usuarios ativos para exibir.</div>';

  const personalChartHtml = hasPersonalChart
    ? '<canvas id="wallet-canvas" class="wallet-canvas"></canvas>'
    : '<div class="empty-state">Seu perfil nao possui grafico ativo. Esther pode liberar grafico para membros e admins.</div>';
  const canShowAggregateChart = canManageWallets()
    || hasPersonalChart
    || (session && session.role === 'member' && walletChartsPublicForMembers);
  const aggregateChartHtml = canShowAggregateChart
    ? '<canvas id="tp-total-canvas" class="wallet-canvas tp-total-canvas"></canvas>'
    : '<div class="empty-state">Graficos ficam disponiveis para membros liberados e equipe financeira.</div>';

  const memberSectionSubtitle = walletChartsPublicForMembers
    ? 'Modo publico ativo: todos os membros veem estes graficos em tempo real.'
    : 'Modo privado ativo: apenas financeiro e Esther visualizam estes graficos.';
  const memberSectionHtml = canViewSharedWalletCharts
    ? `
      <section class="panel">
        <div class="panel-header">
          <div>
          <h3 class="panel-title">Carteira por usuario</h3>
            <p class="panel-subtitle">${memberSectionSubtitle}</p>
          </div>
        </div>
        <div class="member-wallet-grid">
          ${memberCardsHtml}
        </div>
      </section>
    `
    : '';

  els.content.innerHTML = `
    <section class="dashboard-hero">
      <div class="dashboard-hero-main">
        <span class="hero-kicker">Operacao conectada em ${escapeHtml(monthLabel)}</span>
        <h2>Painel de ${escapeHtml(heroName)} com carteira, rotina e visao da TP em um lugar so.</h2>
        <p>Leitura rapida para acompanhar cobrancas, pagamentos, tarefas e movimento do time sem ficar pulando entre telas.</p>
        <div class="hero-chip-row">
          <span class="hero-chip">Lucro TP ${formatCurrency(aggregateMonth.profit)}</span>
          <span class="hero-chip">Divida atual ${formatDebtCurrency(user.debt)}</span>
          <span class="hero-chip">${formatCurrency(aggregateMonth.paid)} pagos na operacao</span>
        </div>
        <div class="hero-actions">
          <button id="dashboard-refresh" class="btn-primary" type="button">Atualizar painel</button>
          <button id="dashboard-open-central" class="btn-secondary" type="button">Abrir central</button>
          <button id="dashboard-open-search" class="btn-ghost" type="button">Busca global</button>
        </div>
      </div>
      <div class="dashboard-hero-side">
        <article class="hero-balance-card">
          <span>Carteira total da TP</span>
          <strong>${formatCurrency(aggregateMonth.walletValue)}</strong>
          <small>${formatCurrency(aggregateMonth.paid)} pagos no mes • ${formatCurrency(aggregateMonth.fines)} em cobrancas</small>
        </article>
        <div class="hero-mini-grid">
          ${heroStatCards.map((item) => `
            <article class="hero-stat-card">
              <strong>${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="panel wallet-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Carteira TP - total mensal</h2>
          <p class="panel-subtitle">Resumo consolidado com grafico claro e leitura direta somente em ${escapeHtml(financeChartScopeLabel)}.</p>
        </div>
        <div class="chart-toolbar">
          <label class="chart-toolbar-field" for="dashboard-chart-type">
            <span>Grafico</span>
            <select id="dashboard-chart-type">
              ${renderFinanceChartTypeOptions(financeChartType)}
            </select>
          </label>
        </div>
      </div>

      <div class="chart-period-note">Periodo exibido: <strong>${escapeHtml(financeChartScopeLabel)}</strong> | Ano ${FINANCE_CHART_YEAR}</div>
      ${aggregateChartHtml}
      <div class="wallet-summary-grid">
        <div class="kpi-item"><strong>Total pago no mes</strong><span>${formatCurrency(aggregateMonth.paid)}</span></div>
        <div class="kpi-item"><strong>Total multas/cobrancas</strong><span>${formatCurrency(aggregateMonth.fines)}</span></div>
        <div class="kpi-item"><strong>Divida aberta da TP</strong><span>${formatDebtCurrency(aggregateMonth.debt)}</span></div>
        <div class="kpi-item"><strong>Lucro acumulado</strong><span>${formatCurrency(aggregateMonth.profit)}</span></div>
        <div class="kpi-item"><strong>Carteira acumulada TP</strong><span>${formatCurrency(aggregateMonth.walletValue)}</span></div>
      </div>
    </section>

    <section class="panel wallet-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Minha carteira - ${escapeHtml(getUserDisplayName(user))}</h2>
          <p class="panel-subtitle">Painel pessoal organizado para pagar, simular e acompanhar evolucao somente em ${escapeHtml(financeChartScopeLabel)}.</p>
        </div>
      </div>

      <div class="wallet-grid">
        <div class="wallet-chart-card">
          ${personalChartHtml}
          <div class="wallet-metrics">
            <div class="kpi-item"><strong>Divida atual</strong><span>${formatDebtCurrency(user.debt)}</span></div>
            <div class="kpi-item"><strong>Total cobrado</strong><span>${formatCurrency(user.totalCharged)}</span></div>
            <div class="kpi-item"><strong>Total pago</strong><span>${formatCurrency(user.totalPaid)}</span></div>
            <div class="kpi-item"><strong>Lucro acumulado</strong><span>${formatCurrency(user.walletProfit)}</span></div>
            <div class="kpi-item"><strong>Pago nos ultimos 30 dias</strong><span>${formatCurrency(recentPaid)}</span></div>
            <div class="kpi-item"><strong>Pago no mes atual</strong><span>${formatCurrency(userMonthSummary.paid)}</span></div>
            <div class="kpi-item"><strong>Multa/cobranca no mes</strong><span>${formatCurrency(userMonthSummary.fines)}</span></div>
          </div>
        </div>

        <div class="wallet-actions-card">
          <h3 class="panel-title">Acoes da carteira</h3>
          <form id="dashboard-payment-form" class="form-grid">
            <div>
              <label for="dashboard-payment-amount">Registrar pagamento</label>
              <input id="dashboard-payment-amount" type="number" min="1" step="0.01" placeholder="Ex: 25.00" />
            </div>
            <div>
              <label for="dashboard-payment-note">Observacao</label>
              <input id="dashboard-payment-note" type="text" maxlength="120" placeholder="PIX, dinheiro, transferencia..." />
            </div>
            <div class="full inline-actions">
              <button class="btn-primary" type="submit">Aplicar pagamento</button>
              <button id="dashboard-pay-all" class="btn-ghost" type="button" ${user.debt > 0 ? '' : 'disabled'}>Quitar tudo</button>
            </div>
          </form>

          <form id="dashboard-plan-form" class="form-grid" style="margin-top: 8px;">
            <div>
              <label for="dashboard-plan-value">Simular por mes (10 anos)</label>
              <input id="dashboard-plan-value" type="number" min="1" step="0.01" value="${Math.max(1, Number(user ? user.debt : 0).toFixed(2))}" />
            </div>
            <div>
              <label for="dashboard-plan-rate">Juros anual (%)</label>
              <input id="dashboard-plan-rate" type="number" min="0" max="40" step="0.01" value="0" />
            </div>
            <div class="full inline-actions">
              <button class="btn-ghost" type="submit">Calcular plano</button>
            </div>
          </form>

          <div id="dashboard-plan-output" class="tool-output">
            Em 10 anos: <strong>${formatCurrency(initialPlan.monthly)}/mes</strong> | Total ${formatCurrency(initialPlan.total)}
          </div>

          <form id="dashboard-goal-form" class="form-grid" style="margin-top: 8px;">
            <div>
              <label for="dashboard-goal-target">Meta pessoal no mes</label>
              <input id="dashboard-goal-target" type="number" min="1" step="0.01" value="${initialGoal.toFixed(2)}" />
            </div>
            <div class="inline-actions" style="align-items:end;">
              <button class="btn-secondary" type="submit">Ver progresso</button>
            </div>
          </form>
          <div id="dashboard-goal-output" class="tool-output">
            Pago no mes: <strong>${formatCurrency(userMonthSummary.paid)}</strong> | Meta inicial: ${formatCurrency(initialGoal)}
          </div>
        </div>
      </div>

      <div class="dopamine-card">
        <div class="dopamine-header">
          <h3 class="panel-title">Modo dopamina do membro</h3>
          <strong>Nivel ${dopamine.level} | XP ${dopamine.xp}</strong>
        </div>
        <div class="dopamine-progress-track">
          <span class="dopamine-progress-fill" style="width:${dopamine.progressPercent.toFixed(1)}%;"></span>
        </div>
        <div class="dopamine-row">
          <small>${dopamine.currentLevelXp.toFixed(0)} / 120 XP para o proximo nivel (${dopamine.nextLevelXp} XP)</small>
          <small>Badges: ${dopamine.badges.map((badge) => escapeHtml(badge)).join(', ')}</small>
        </div>
      </div>

      <div class="finance-history">
        <h3 class="panel-title">Ultimas movimentacoes financeiras</h3>
        ${financeHistoryHtml}
      </div>
    </section>

    ${memberSectionHtml}

    <section class="panel">
      <h3 class="panel-title">Sinais da minha carteira</h3>
      <p class="panel-subtitle">Resumo rapido para agir com prioridade financeira.</p>
      <div class="kpi-list">
        ${highlightItems.map((item) => `
          <div class="kpi-item">
            <strong class="${item.label.toLowerCase().includes('divida') ? 'debt-amount' : ''}">${escapeHtml(item.value)}</strong>
            <span>${escapeHtml(item.label)}</span>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Resumo operacional</h2>
          <p class="panel-subtitle">Tickets continuam visiveis, mas com foco secundario no painel.</p>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">${scopedTickets.length}</div><div class="stat-label">Tickets totais</div></div>
        <div class="stat-card"><div class="stat-value">${pendingCount}</div><div class="stat-label">Pendentes</div></div>
        <div class="stat-card"><div class="stat-value">${activeCount}</div><div class="stat-label">Em andamento</div></div>
        <div class="stat-card"><div class="stat-value">${closedCount}</div><div class="stat-label">Encerrados</div></div>
      </div>
    </section>

    <section class="split-grid">
      <div class="panel">
        <h3 class="panel-title">Proximas entregas</h3>
        <p class="panel-subtitle">Tarefas pessoais com data para nao perder prazo.</p>
        <div class="kpi-list">${dueSoonHtml}</div>
      </div>
    </section>

    <section class="panel">
      <h3 class="panel-title">Comunicados recentes</h3>
      <p class="panel-subtitle">Resumo das ultimas mensagens internas.</p>
      <div class="timeline">
        ${announcementHtml}
      </div>
    </section>
  `;

  const refreshButton = document.getElementById('dashboard-refresh');
  const chartTypeSelect = document.getElementById('dashboard-chart-type');
  const openCentralButton = document.getElementById('dashboard-open-central');
  const openSearchButton = document.getElementById('dashboard-open-search');
  const paymentForm = document.getElementById('dashboard-payment-form');
  const payAllButton = document.getElementById('dashboard-pay-all');
  const planForm = document.getElementById('dashboard-plan-form');
  const goalForm = document.getElementById('dashboard-goal-form');
  const walletCanvas = document.getElementById('wallet-canvas');
  const totalCanvas = document.getElementById('tp-total-canvas');
  const planOutput = document.getElementById('dashboard-plan-output');
  const goalOutput = document.getElementById('dashboard-goal-output');

  if (canShowAggregateChart) {
    drawFinanceSeriesCanvasAnimated(totalCanvas, aggregateSeries, {
      secondaryKey: 'charge',
      paidLabel: 'Pago',
      debtLabel: 'Cobrado TP',
      paidColor: chartTheme.paidColor,
      debtColor: chartTheme.debtColor,
      paidFill: chartTheme.paidFill,
      debtFill: chartTheme.debtFill,
      durationMs: 860
    });
  }
  if (hasPersonalChart) {
    drawWalletCanvas(walletCanvas, user, {
      anchorMonthKey: selectedMonthKey,
      animate: true,
      paidLabel: 'Pago',
      debtLabel: 'Cobrado'
    });
  }
  memberChartItems.forEach((entry) => {
    const canvas = document.getElementById(entry.canvasId);
    drawWalletCanvas(canvas, entry.member, {
      anchorMonthKey: selectedMonthKey,
      animate: true,
      paidLabel: 'Pago',
      debtLabel: 'Cobrado'
    });
  });

  refreshButton.addEventListener('click', () => {
    addLog('Atualizou o painel');
    renderDashboard();
  });
  if (openCentralButton) {
    openCentralButton.addEventListener('click', () => {
      navigate('activityCenter');
    });
  }
  if (openSearchButton) {
    openSearchButton.addEventListener('click', () => {
      openGlobalSearch();
    });
  }
  if (chartTypeSelect) {
    chartTypeSelect.addEventListener('change', () => {
      setFinanceChartType(chartTypeSelect.value);
    });
  }

  paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const amountInput = document.getElementById('dashboard-payment-amount');
    const noteInput = document.getElementById('dashboard-payment-note');
    const amount = toPositiveAmount(amountInput.value);
    const note = noteInput.value.trim();

    if (!amount) {
      showNotification('Informe um valor de pagamento valido.', 'warning');
      return;
    }

    const result = registerFinanceEvent(user, 'payment', amount, note || 'Pagamento pelo painel');
    if (!result.ok) {
      showNotification(result.message, 'warning');
      return;
    }

    addLog(`Registrou pagamento proprio de ${formatCurrency(result.amount)} (lucro ${formatCurrency(result.profitAdded || 0)})`);
    const profitText = result.profitAdded > 0 ? ` | lucro ${formatCurrency(result.profitAdded)}` : '';
    showNotification(`Pagamento aplicado: ${formatCurrency(result.amount)}${profitText}.`, 'success');
    renderDashboard();
  });

  payAllButton.addEventListener('click', () => {
    if (user.debt <= 0) {
      showNotification('Nao ha divida para quitar.', 'warning');
      return;
    }
    const result = registerFinanceEvent(user, 'payment', user.debt, 'Quitacao total pelo painel');
    if (!result.ok) {
      showNotification(result.message, 'warning');
      return;
    }
    addLog(`Quitou divida total de ${formatCurrency(result.amount)} no painel`);
    showNotification('Divida quitada com sucesso.', 'success');
    renderDashboard();
  });

  planForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = toPositiveAmount(document.getElementById('dashboard-plan-value').value);
    const rate = Number(document.getElementById('dashboard-plan-rate').value) || 0;
    if (!value) {
      showNotification('Informe um valor para simular.', 'warning');
      return;
    }

    const plan = calculateTenYearPlan(value, rate);
    planOutput.innerHTML = `Em 10 anos: <strong>${formatCurrency(plan.monthly)}/mes</strong> | Total ${formatCurrency(plan.total)} | Juros ${formatCurrency(plan.interest)}`;
  });

  goalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = toPositiveAmount(document.getElementById('dashboard-goal-target').value);
    if (!target) {
      showNotification('Informe uma meta valida.', 'warning');
      return;
    }
    const progressPercent = Math.min(999, (userMonthSummary.paid / target) * 100);
    const remaining = Math.max(0, target - userMonthSummary.paid);
    goalOutput.innerHTML = `
      Pago no mes: <strong>${formatCurrency(userMonthSummary.paid)}</strong> |
      Meta: <strong>${formatCurrency(target)}</strong> |
      Falta: <strong>${formatCurrency(remaining)}</strong> |
      Progresso: <strong>${progressPercent.toFixed(1)}%</strong>
    `;
  });
}

function renderDashboard() {
  let user = getCurrentUser();
  if (!user && session) {
    ensureCoreUsers();
    if (!getCurrentUser()) {
      const sessionKey = String(session.username || '').trim().toLowerCase();
      const canRestoreLockedUser = sessionKey === 'esther' || sessionKey === 'inteligencia tp';
      if (canRestoreLockedUser) {
        users.push(
          normalizeUser({
            username: session.username,
            password: DEFAULT_PASSWORD,
            role: session.role || 'member',
            status: 'active',
            debt: 0
          })
        );
      }
    }
    persistLocalDataOnly();
    user = getCurrentUser();
  }

  if (!user) {
    renderAccessDenied('Sessao invalida. Faca login novamente.');
    return;
  }

  const selectedMonthKey = getCurrentMonthKey();
  const currentMonthLabel = getMonthLongLabelFromKey(selectedMonthKey);
  const financeChartType = getFinanceChartType();
  const financeChartScopeLabel = getFinanceChartScopeLabel(FINANCE_CHART_MONTH_WINDOW, selectedMonthKey);
  const chartTheme = getActiveChartTheme();
  const walletUsers = getWalletParticipants(users)
    .filter((member) => member.status === 'active')
    .slice()
    .sort((a, b) => (Number(b.totalPaid) || 0) - (Number(a.totalPaid) || 0));
  const chartMembers = walletUsers.filter((member) => canRoleReceiveWalletChart(member.role));
  const visibleMembers = chartMembers.length > 0 ? chartMembers : walletUsers;
  const aggregateSeries = buildAggregateFinanceSeries(FINANCE_CHART_MONTH_WINDOW, selectedMonthKey, walletUsers);
  const aggregateMonth = getAggregateMonthFinanceSummary(selectedMonthKey, walletUsers);
  const userMonthSummary = getUserFinanceMonthSummary(user, selectedMonthKey);
  const recentHistory = getWalletHistoryEntries(user, { limit: 6 });
  const latestPayment = getUserLastPaymentEntry(user);
  const monthPaymentsCount = walletUsers.reduce((sum, member) => sum + getWalletHistoryEntries(member, { monthKey: selectedMonthKey, type: 'payment' }).length, 0);
  const historyEntriesCount = walletUsers.reduce((sum, member) => sum + (Array.isArray(member.financeHistory) ? member.financeHistory.length : 0), 0);
  const monthLeader = walletUsers
    .slice()
    .sort((a, b) => getUserFinanceMonthSummary(b, selectedMonthKey).paid - getUserFinanceMonthSummary(a, selectedMonthKey).paid)[0] || null;
  const heroName = String(getUserDisplayName(user) || user.username || 'Equipe').split(/\s+/).filter(Boolean)[0] || 'Equipe';

  const heroStatCards = [
    { label: 'Pago no mes', value: formatCurrency(aggregateMonth.paid) },
    { label: 'Carteiras ativas', value: String(walletUsers.length) },
    { label: 'Pagamentos no mes', value: String(monthPaymentsCount) },
    { label: 'Historico total', value: String(historyEntriesCount) }
  ];

  const myWalletItems = [
    { label: 'Total da minha carteira', value: formatCurrency(user.totalPaid) },
    { label: `Pago em ${currentMonthLabel}`, value: formatCurrency(userMonthSummary.paid) },
    { label: 'Cobrado no periodo', value: formatCurrency(userMonthSummary.charged) },
    { label: 'Divida atual', value: formatDebtCurrency(user.debt) }
  ];

  const memberCardsHtml = visibleMembers.length > 0
    ? visibleMembers
        .map((member, index) => {
          const summary = getUserFinanceMonthSummary(member, selectedMonthKey);
          const isCurrentUser = sameUsername(member.username, user.username);
          return `
            <article
              class="member-wallet-card member-wallet-card-interactive ${isCurrentUser ? 'is-current-wallet' : ''}"
              data-wallet-card-user="${escapeHtml(member.username)}"
              tabindex="0"
              role="button"
              aria-label="Abrir detalhes da carteira de ${escapeHtml(getUserDisplayName(member))}"
            >
              <div class="member-wallet-head">
                <div class="member-wallet-head-main">
                  ${renderUserAvatar(member, { size: 'xs' })}
                  <div class="member-wallet-head-copy">
                    <strong>${escapeHtml(getUserDisplayName(member))}</strong>
                    <small>@${escapeHtml(member.username)} - ${escapeHtml(roleLabel(member.role))}</small>
                  </div>
                </div>
                <span class="wallet-card-open-tag">Abrir</span>
              </div>
              <canvas id="member-wallet-canvas-${index}" class="member-wallet-canvas"></canvas>
              <div class="member-wallet-meta">
                <span>Total: <strong>${formatCurrency(summary.walletValue)}</strong></span>
                <span>Pago no mes: <strong>${formatCurrency(summary.paid)}</strong></span>
                <span>Cobrado no mes: <strong>${formatCurrency(summary.charged)}</strong></span>
                <span>Divida atual: <strong class="debt-amount">${formatDebtCurrency(summary.debt)}</strong></span>
              </div>
            </article>
          `;
        })
        .join('')
    : '<div class="empty-state">Nenhuma carteira disponivel para exibicao.</div>';

  els.content.innerHTML = `
    <section class="dashboard-hero wallet-hero wallet-hero-premium">
      <div class="dashboard-hero-main wallet-hero-main">
        <span class="hero-kicker">Visao financeira sincronizada em ${escapeHtml(currentMonthLabel)}</span>
        <h2>${escapeHtml(heroName)}, agora a carteira ficou mais clara, bonita e direta.</h2>
        <p>O painel mostra totais, pagamentos do mes e os graficos individuais com abertura imediata para um historico premium e organizado.</p>
        <div class="hero-chip-row">
          <span class="hero-chip">Total pago ${formatCurrency(aggregateMonth.walletValue)}</span>
          <span class="hero-chip">Mes atual ${formatCurrency(aggregateMonth.paid)}</span>
          <span class="hero-chip">Lucro ${formatCurrency(aggregateMonth.profit)}</span>
        </div>
        <div class="hero-actions">
          <button id="dashboard-refresh" class="btn-primary" type="button">Atualizar painel</button>
          <button id="dashboard-open-my-details" class="btn-secondary" type="button">Ver meu detalhamento</button>
          ${canManageWallets() ? '<button id="dashboard-open-wallet-control" class="btn-ghost" type="button">Abrir controle</button>' : ''}
        </div>
      </div>
      <div class="dashboard-hero-side wallet-hero-side">
        <article class="hero-balance-card">
          <span>Carteira total</span>
          <strong>${formatCurrency(aggregateMonth.walletValue)}</strong>
          <small>${formatCurrency(aggregateMonth.paid)} pagos em ${escapeHtml(currentMonthLabel)} | ${formatCurrency(aggregateMonth.charged)} cobrados</small>
        </article>
        <div class="hero-mini-grid">
          ${heroStatCards.map((item) => `
            <article class="hero-stat-card">
              <strong>${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="panel wallet-panel wallet-panel-premium">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Panorama consolidado das carteiras</h2>
          <p class="panel-subtitle">Os meses acompanham o calendario real automaticamente em todos os graficos, sem precisar ajuste manual.</p>
        </div>
        <div class="chart-toolbar">
          <label class="chart-toolbar-field" for="dashboard-chart-type">
            <span>Grafico</span>
            <select id="dashboard-chart-type">
              ${renderFinanceChartTypeOptions(financeChartType)}
            </select>
          </label>
        </div>
      </div>

      <div class="chart-period-note">Periodo exibido: <strong>${escapeHtml(financeChartScopeLabel)}</strong></div>
      <canvas id="tp-total-canvas" class="wallet-canvas tp-total-canvas"></canvas>
      <div class="wallet-summary-grid">
        <div class="kpi-item"><strong>Total pago no mes</strong><span>${formatCurrency(aggregateMonth.paid)}</span></div>
        <div class="kpi-item"><strong>Total cobrado no mes</strong><span>${formatCurrency(aggregateMonth.charged)}</span></div>
        <div class="kpi-item"><strong>Divida aberta da TP</strong><span>${formatDebtCurrency(aggregateMonth.debt)}</span></div>
        <div class="kpi-item"><strong>Lucro acumulado</strong><span>${formatCurrency(aggregateMonth.profit)}</span></div>
        <div class="kpi-item"><strong>Carteira acumulada</strong><span>${formatCurrency(aggregateMonth.walletValue)}</span></div>
      </div>
    </section>

    <section class="wallet-dashboard-grid wallet-dashboard-grid-premium">
      <section class="panel wallet-actions-card wallet-personal-card">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Minha carteira</h2>
            <p class="panel-subtitle">Acao rapida para registrar pagamento e abrir o historico completo em um clique.</p>
          </div>
        </div>

        <div class="wallet-summary-grid">
          ${myWalletItems.map((item) => `
            <div class="kpi-item">
              <strong>${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </div>
          `).join('')}
        </div>

        <form id="dashboard-payment-form" class="form-grid wallet-payment-form">
          <div>
            <label for="dashboard-payment-amount">Registrar pagamento</label>
            <input id="dashboard-payment-amount" type="number" min="1" step="0.01" placeholder="Ex: 150.00" />
          </div>
          <div>
            <label for="dashboard-payment-note">Observacao</label>
            <input id="dashboard-payment-note" type="text" maxlength="120" placeholder="PIX, transferencia, dinheiro..." />
          </div>
          <div class="full inline-actions">
            <button class="btn-primary" type="submit">Salvar pagamento</button>
            <button id="dashboard-pay-all" class="btn-ghost" type="button" ${user.debt > 0 ? '' : 'disabled'}>Quitar tudo</button>
          </div>
        </form>

        <div class="finance-history wallet-history-stack">
          <h3 class="panel-title">Ultimas movimentacoes</h3>
          ${renderWalletHistoryList(recentHistory, 'Nenhuma movimentacao registrada na sua carteira ainda.')}
        </div>
      </section>

      <section class="panel wallet-focus-card">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Leitura do periodo</h2>
            <p class="panel-subtitle">Resumo curto para entender rapidamente o estado da operacao financeira.</p>
          </div>
        </div>
        <div class="wallet-focus-grid">
          <article class="wallet-focus-item">
            <span>Maior pagamento do mes</span>
            <strong>${monthLeader ? escapeHtml(getUserDisplayName(monthLeader)) : 'Sem destaque'}</strong>
            <small>${monthLeader ? formatCurrency(getUserFinanceMonthSummary(monthLeader, selectedMonthKey).paid) : 'Sem pagamentos registrados'}</small>
          </article>
          <article class="wallet-focus-item">
            <span>Seu ultimo pagamento</span>
            <strong>${latestPayment ? formatCurrency(latestPayment.amount) : formatCurrency(0)}</strong>
            <small>${latestPayment ? formatDateTime(latestPayment.timestamp) : 'Nenhum pagamento registrado'}</small>
          </article>
          <article class="wallet-focus-item">
            <span>Mes selecionado</span>
            <strong>${escapeHtml(currentMonthLabel)}</strong>
            <small>Atualizacao automatica acompanhando o calendario real</small>
          </article>
          <article class="wallet-focus-item">
            <span>Graficos clicaveis</span>
            <strong>${visibleMembers.length}</strong>
            <small>Abra qualquer carteira abaixo para ver detalhes premium</small>
          </article>
        </div>
      </section>
    </section>

    <section class="panel wallet-panel wallet-panel-premium">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Carteiras individuais</h2>
          <p class="panel-subtitle">Clique ou toque em qualquer grafico para abrir a animacao completa com pagamentos, datas e historico organizado.</p>
        </div>
      </div>
      <div class="member-wallet-grid member-wallet-grid-premium">
        ${memberCardsHtml}
      </div>
    </section>
  `;

  const refreshButton = document.getElementById('dashboard-refresh');
  const chartTypeSelect = document.getElementById('dashboard-chart-type');
  const openMyDetailsButton = document.getElementById('dashboard-open-my-details');
  const openWalletControlButton = document.getElementById('dashboard-open-wallet-control');
  const paymentForm = document.getElementById('dashboard-payment-form');
  const payAllButton = document.getElementById('dashboard-pay-all');
  const totalCanvas = document.getElementById('tp-total-canvas');

  drawFinanceSeriesCanvasAnimated(totalCanvas, aggregateSeries, {
    secondaryKey: 'charge',
    chartType: financeChartType,
    paidLabel: 'Pago',
    debtLabel: 'Cobrado',
    periodLabel: financeChartScopeLabel,
    paidColor: chartTheme.paidColor,
    debtColor: chartTheme.debtColor,
    paidFill: chartTheme.paidFill,
    debtFill: chartTheme.debtFill,
    durationMs: 860
  });

  visibleMembers.forEach((member, index) => {
    const canvas = document.getElementById(`member-wallet-canvas-${index}`);
    drawWalletCanvas(canvas, member, {
      anchorMonthKey: selectedMonthKey,
      animate: true,
      paidLabel: 'Pago',
      debtLabel: 'Cobrado',
      periodLabel: financeChartScopeLabel
    });
  });
  attachWalletCardInteractions(els.content);

  refreshButton.addEventListener('click', () => {
    addLog('Atualizou o painel');
    renderDashboard();
  });

  if (openMyDetailsButton) {
    openMyDetailsButton.addEventListener('click', () => {
      openWalletDetailModal(user.username, { monthKey: selectedMonthKey });
    });
  }

  if (openWalletControlButton) {
    openWalletControlButton.addEventListener('click', () => {
      navigate('walletControl');
    });
  }

  if (chartTypeSelect) {
    chartTypeSelect.addEventListener('change', () => {
      setFinanceChartType(chartTypeSelect.value);
    });
  }

  paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const amountInput = document.getElementById('dashboard-payment-amount');
    const noteInput = document.getElementById('dashboard-payment-note');
    const amount = toPositiveAmount(amountInput.value);
    const note = noteInput.value.trim();

    if (!amount) {
      showNotification('Informe um valor de pagamento valido.', 'warning');
      return;
    }

    const result = registerFinanceEvent(user, 'payment', amount, note || 'Pagamento pelo painel');
    if (!result.ok) {
      showNotification(result.message, 'warning');
      return;
    }

    addLog(`Registrou pagamento proprio de ${formatCurrency(result.amount)} (lucro ${formatCurrency(result.profitAdded || 0)})`);
    const profitText = result.profitAdded > 0 ? ` | lucro ${formatCurrency(result.profitAdded)}` : '';
    showNotification(`Pagamento aplicado: ${formatCurrency(result.amount)}${profitText}.`, 'success');
    renderDashboard();
  });

  payAllButton.addEventListener('click', () => {
    if (user.debt <= 0) {
      showNotification('Nao ha divida para quitar.', 'warning');
      return;
    }
    const result = registerFinanceEvent(user, 'payment', user.debt, 'Quitacao total pelo painel');
    if (!result.ok) {
      showNotification(result.message, 'warning');
      return;
    }
    addLog(`Quitou divida total de ${formatCurrency(result.amount)} no painel`);
    showNotification('Divida quitada com sucesso.', 'success');
    renderDashboard();
  });
}

function renderWalletControl() {
  if (!canManageWallets()) {
    renderAccessDenied('Apenas cargos acima de membro podem controlar carteiras.');
    return;
  }
  const chartTheme = getActiveChartTheme();

  const nowTs = Date.now();
  const todayKey = getDayKeyFromTimestamp(nowTs);
  const baseAutomationSettings = getWalletAutomationSettings();
  let autoRunResult = null;
  if (
    baseAutomationSettings.enabled
    && baseAutomationSettings.autoRunOnWalletControlOpen
    && baseAutomationSettings.lastRunDay !== todayKey
  ) {
    autoRunResult = runWalletLateAutomation({
      actor: session ? session.username : 'sistema',
      referenceTs: nowTs
    });
    if (autoRunResult && autoRunResult.ok && autoRunResult.appliedCount > 0) {
      addLog(
        `Auto-cobranca de atraso ao abrir carteiras: ${autoRunResult.appliedCount} usuario(s), total ${formatCurrency(autoRunResult.totalAmount)}`
      );
    }
  }

  const automationSettings = getWalletAutomationSettings();
  const isMasterAdmin = Boolean(session && session.role === 'superadmin');
  const walletChartsPublicForMembers = isWalletChartsPublicForMembers();
  const canToggleChartsVisibility = isEsther();
  const selectedMonthKey = getCurrentMonthKey();
  const financeChartType = getFinanceChartType();
  const financeChartScopeLabel = getFinanceChartScopeLabel(FINANCE_CHART_MONTH_WINDOW, selectedMonthKey);

  const members = getWalletParticipants(users)
    .slice()
    .sort((a, b) => a.username.localeCompare(b.username));
  members.forEach((member) => {
    ensureUserBillingProfile(member);
  });
  const membersWithChart = members.filter((member) => canUserHaveWalletChart(member));
  const aggregateMonth = getAggregateMonthFinanceSummary(selectedMonthKey, members);
  const aggregateSeries = buildAggregateFinanceSeries(FINANCE_CHART_MONTH_WINDOW, selectedMonthKey, members);
  const lateCandidates = buildLateChargeCandidates(members, nowTs);
  const eligibleLateCandidates = lateCandidates.filter((entry) => entry.eligible);
  const latePotentialTotal = eligibleLateCandidates.reduce((sum, entry) => sum + (Number(entry.totalAmount) || 0), 0);

  const automationRowsHtml = lateCandidates.length > 0
    ? lateCandidates
      .slice(0, 40)
      .map((entry) => `
        <tr data-user="${escapeHtml(entry.username)}">
          <td>${escapeHtml(entry.username)}</td>
          <td>${escapeHtml(entry.status === 'active' ? 'Ativo' : 'Bloqueado')}</td>
          <td>${formatCurrency(entry.debt)}</td>
          <td>${formatDateTime(entry.dueTimestamp)}</td>
          <td>${Math.max(0, Number(entry.overdueAfterGrace) || 0)} dia(s)</td>
          <td>${formatCurrency(entry.fineAmount)}</td>
          <td>${formatCurrency(entry.interestAmount)}</td>
          <td>${entry.eligible ? formatCurrency(entry.totalAmount) : escapeHtml(entry.reason || '-')}</td>
        </tr>
      `)
      .join('')
    : '<tr><td colspan="8" class="empty-state">Nenhum usuario disponivel para analise.</td></tr>';

  const memberRowsHtml = members.length > 0
    ? members
        .map((member) => {
          const summary = getUserFinanceMonthSummary(member, selectedMonthKey);
          const canToggleChart = isEsther() && canRoleReceiveWalletChart(member.role);
          const chartLabel = member.walletChartEnabled ? 'Ativo' : 'Desligado';
          const billingPolicy = getUserEffectiveBillingPolicy(member);
          const latePreview = calculateUserLateChargePreview(member, nowTs);
          const dueLabel = `Dia ${billingPolicy.dueDay} (+${billingPolicy.graceDays}d)`;
          const ruleLabel = `${formatBillingFineRule(billingPolicy.fineMode, billingPolicy.fineValue)} | juros ${Number(billingPolicy.interestMonthlyPercent || 0).toFixed(2)}%/mes`;
          const lateLabel = latePreview.eligible
            ? `${formatCurrency(latePreview.totalAmount)} (${Math.max(0, Number(latePreview.overdueAfterGrace) || 0)}d)`
            : toShortText(latePreview.reason || '-', 46);
          const walletHealthOptions = WALLET_HEALTH_VALUES
            .map((value) => `<option value="${escapeHtml(value)}" ${normalizeWalletHealth(member.walletHealth) === value ? 'selected' : ''}>${escapeHtml(walletHealthLabel(value))}</option>`)
            .join('');
          return `
            <tr data-user="${escapeHtml(member.username)}">
              <td>
                <div class="user-identity">
                  ${renderUserAvatar(member, { size: 'xs' })}
                  <div class="user-identity-copy">
                    <strong>${escapeHtml(getUserDisplayName(member))}</strong>
                    <small>@${escapeHtml(member.username)} - ${escapeHtml(roleLabel(member.role))}</small>
                  </div>
                </div>
              </td>
              <td>${escapeHtml(chartLabel)}</td>
              <td>${formatCurrency(summary.paid)}</td>
              <td>${formatCurrency(summary.fines)}</td>
              <td>
                <select data-field="wallet-health" ${isMasterAdmin ? '' : 'disabled'}>
                  ${walletHealthOptions}
                </select>
              </td>
              <td>${escapeHtml(dueLabel)}</td>
              <td>${escapeHtml(ruleLabel)}</td>
              <td>${escapeHtml(lateLabel)}</td>
              <td><input type="number" min="0" step="0.01" data-field="debt" value="${Number(member.debt).toFixed(2)}" /></td>
              <td><input type="number" min="0" step="0.01" data-field="charged" value="${Number(member.totalCharged).toFixed(2)}" /></td>
              <td><input type="number" min="0" step="0.01" data-field="paid" value="${Number(member.totalPaid).toFixed(2)}" /></td>
              <td><input type="number" min="0" step="0.01" data-field="profit" value="${Number(member.walletProfit).toFixed(2)}" /></td>
              <td>
                <div class="inline-actions">
                  <button class="btn-primary" data-action="save-wallet" type="button">Salvar</button>
                  <button class="btn-secondary" data-action="charge" type="button">Multa</button>
                  <button class="btn-secondary" data-action="payment" type="button">Pagamento</button>
                  <button class="btn-secondary" data-action="apply-late" type="button">Atraso agora</button>
                  <button class="btn-ghost" data-action="billing-profile" type="button">Regras atraso</button>
                  <button class="btn-ghost" data-action="reset-chart" type="button">Zerar grafico</button>
                  <button class="btn-ghost" data-action="toggle-chart" type="button" ${canToggleChart ? '' : 'disabled'}>Grafico</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join('')
    : '<tr><td colspan="13" class="empty-state">Nenhum usuario habilitado para carteira.</td></tr>';

  const chartCardsHtml = membersWithChart.length > 0
    ? membersWithChart
      .map((member, index) => {
          const summary = getUserFinanceMonthSummary(member, selectedMonthKey);
          return `
            <article
              class="member-wallet-card member-wallet-card-interactive"
              data-wallet-card-user="${escapeHtml(member.username)}"
              tabindex="0"
              role="button"
              aria-label="Abrir detalhes da carteira de ${escapeHtml(getUserDisplayName(member))}"
            >
              <div class="member-wallet-head">
                <div class="member-wallet-head-main">
                  ${renderUserAvatar(member, { size: 'xs' })}
                  <div class="member-wallet-head-copy">
                    <strong>${escapeHtml(getUserDisplayName(member))}</strong>
                    <small>@${escapeHtml(member.username)} - ${escapeHtml(roleLabel(member.role))}</small>
                  </div>
                </div>
                <span class="wallet-card-open-tag">Abrir</span>
              </div>
              <canvas id="wallet-control-chart-${index}" class="member-wallet-canvas"></canvas>
              <div class="member-wallet-meta">
                <span>Carteira: <strong>${formatCurrency(summary.walletValue)}</strong></span>
                <span>Pago atual: <strong>${formatCurrency(summary.paid)}</strong></span>
                <span>Cobrado atual: <strong>${formatCurrency(summary.charged)}</strong></span>
                <span>Lucro: <strong>${formatCurrency(summary.profit)}</strong></span>
                <span>Divida atual: <strong class="debt-amount">${formatCurrency(summary.debt)}</strong></span>
              </div>
            </article>
          `;
        })
        .join('')
    : '<div class="empty-state">Nenhum usuario com grafico ativo.</div>';

  const autoRunInfoHtml = autoRunResult
    ? `<small class="panel-subtitle">Ultimo auto-run da tela: ${escapeHtml(autoRunResult.message || '-')} ${autoRunResult.ok ? `| Total ${formatCurrency(autoRunResult.totalAmount || 0)}` : ''}</small>`
    : '';
  const chartsVisibilityLabel = walletChartsPublicForMembers
    ? 'Publico para membros'
    : 'Privado (cada usuario ve apenas o proprio grafico)';
  const chartsVisibilityButtonLabel = walletChartsPublicForMembers
    ? 'Privar graficos'
    : 'Publicar graficos';

  els.content.innerHTML = `
    <section class="panel wallet-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Controle de dividas e carteira</h2>
          <p class="panel-subtitle">Defina dividas, multas e pagamentos com uma leitura mais limpa e graficos sincronizados em ${escapeHtml(financeChartScopeLabel)}.</p>
        </div>
        <div class="inline-actions">
          <label class="chart-toolbar-field" for="wallet-control-chart-type">
            <span>Grafico</span>
            <select id="wallet-control-chart-type">
              ${renderFinanceChartTypeOptions(financeChartType)}
            </select>
          </label>
          <button id="wallet-control-refresh" class="btn-ghost" type="button">Atualizar painel</button>
          <button id="wallet-chart-visibility-toggle" class="btn-ghost" type="button" ${canToggleChartsVisibility ? '' : 'disabled'}>
            ${chartsVisibilityButtonLabel}
          </button>
        </div>
      </div>
      ${autoRunInfoHtml}
      <div class="tool-output">
        Visibilidade dos graficos: <strong>${chartsVisibilityLabel}</strong>
      </div>
      <div class="chart-period-note">Periodo exibido nos graficos: <strong>${escapeHtml(financeChartScopeLabel)}</strong></div>

      <canvas id="wallet-control-total-canvas" class="wallet-canvas tp-total-canvas"></canvas>
      <div class="wallet-summary-grid">
        <div class="kpi-item"><strong>Total pago</strong><span>${formatCurrency(aggregateMonth.paid)}</span></div>
        <div class="kpi-item"><strong>Total cobrado</strong><span>${formatCurrency(aggregateMonth.charged)}</span></div>
        <div class="kpi-item"><strong>Multas/cobrancas</strong><span>${formatCurrency(aggregateMonth.fines)}</span></div>
        <div class="kpi-item"><strong>Divida total</strong><span>${formatDebtCurrency(aggregateMonth.debt)}</span></div>
        <div class="kpi-item"><strong>Lucro total</strong><span>${formatCurrency(aggregateMonth.profit)}</span></div>
        <div class="kpi-item"><strong>Carteira acumulada</strong><span>${formatCurrency(aggregateMonth.walletValue)}</span></div>
      </div>

      <div class="form-grid" style="margin-top:10px;">
        <div>
          <label for="wallet-global-debt">Divida geral (rateio automatico)</label>
          <input id="wallet-global-debt" type="number" min="1" step="0.01" placeholder="Ex: 500.00" />
        </div>
        <div class="inline-actions" style="align-items:end;">
          <button id="wallet-global-debt-apply" class="btn-secondary" type="button">Dividir para todos</button>
          <button id="wallet-reset-all" class="btn-danger" type="button">Resetar tudo para 0</button>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3 class="panel-title">Motor de multa e juros por atraso</h3>
          <p class="panel-subtitle">Configure regras globais, rode cobranca automatica e veja preview dos usuarios elegiveis.</p>
        </div>
      </div>

      <form id="wallet-automation-form" class="form-grid">
        <div>
          <label for="wallet-auto-due-day">Dia de vencimento</label>
          <input id="wallet-auto-due-day" type="number" min="1" max="28" step="1" value="${automationSettings.dueDay}" />
        </div>
        <div>
          <label for="wallet-auto-grace-days">Dias de tolerancia</label>
          <input id="wallet-auto-grace-days" type="number" min="0" max="45" step="1" value="${automationSettings.graceDays}" />
        </div>
        <div>
          <label for="wallet-auto-min-debt">Divida minima</label>
          <input id="wallet-auto-min-debt" type="number" min="0" step="0.01" value="${Number(automationSettings.minDebtForLateCharge).toFixed(2)}" />
        </div>
        <div>
          <label for="wallet-auto-fine-mode">Modo de multa</label>
          <select id="wallet-auto-fine-mode">
            <option value="percent" ${automationSettings.fineMode === 'percent' ? 'selected' : ''}>Percentual (%)</option>
            <option value="fixed" ${automationSettings.fineMode === 'fixed' ? 'selected' : ''}>Valor fixo (R$)</option>
          </select>
        </div>
        <div>
          <label for="wallet-auto-fine-value">Valor da multa</label>
          <input id="wallet-auto-fine-value" type="number" min="0" step="0.01" value="${Number(automationSettings.fineValue).toFixed(2)}" />
        </div>
        <div>
          <label for="wallet-auto-interest-monthly">Juros mensal (%)</label>
          <input id="wallet-auto-interest-monthly" type="number" min="0" max="100" step="0.01" value="${Number(automationSettings.interestMonthlyPercent).toFixed(2)}" />
        </div>
        <div>
          <label for="wallet-auto-interest-cap">Teto de juros por ciclo (%)</label>
          <input id="wallet-auto-interest-cap" type="number" min="0" max="400" step="0.01" value="${Number(automationSettings.interestCapPercent).toFixed(2)}" />
        </div>
        <div>
          <label><input id="wallet-auto-enabled" type="checkbox" ${automationSettings.enabled ? 'checked' : ''} /> Automacao ativa</label>
          <label><input id="wallet-auto-blocked" type="checkbox" ${automationSettings.applyToBlockedUsers ? 'checked' : ''} /> Incluir bloqueados</label>
          <label><input id="wallet-auto-open-run" type="checkbox" ${automationSettings.autoRunOnWalletControlOpen ? 'checked' : ''} /> Rodar ao abrir carteiras</label>
        </div>
        <div class="full inline-actions">
          <button id="wallet-auto-save" class="btn-primary" type="button">Salvar regras</button>
          <button id="wallet-auto-preview" class="btn-secondary" type="button">Atualizar preview</button>
          <button id="wallet-auto-run" class="btn-secondary" type="button">Executar hoje</button>
          <button id="wallet-auto-run-force" class="btn-ghost" type="button">Forcar execucao</button>
        </div>
      </form>

      <div id="wallet-automation-output" class="tool-output">
        Elegiveis agora: <strong>${eligibleLateCandidates.length}</strong> | Potencial imediato: <strong>${formatCurrency(latePotentialTotal)}</strong> | Ultimo run: <strong>${automationSettings.lastRunDay || 'nunca'}</strong>
      </div>

      <div class="table-wrap" style="margin-top: 10px;">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Status</th>
              <th>Divida</th>
              <th>Ultimo vencimento</th>
              <th>Atraso efetivo</th>
              <th>Multa</th>
              <th>Juros</th>
              <th>Total hoje</th>
            </tr>
          </thead>
          <tbody id="wallet-automation-rows">${automationRowsHtml}</tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3 class="panel-title">Ajuste direto (individual)</h3>
          <p class="panel-subtitle">Cargos altos ajustam carteira, aplicam atraso por usuario e personalizam regras individuais.</p>
        </div>
      </div>
      <div class="filters" style="grid-template-columns: 1fr; margin-top: 4px;">
        <input id="wallet-control-search" type="text" placeholder="Buscar usuario para editar carteira..." />
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Grafico</th>
              <th>Pago</th>
              <th>Multa</th>
              <th>Saude</th>
              <th>Vencimento</th>
              <th>Regra atraso</th>
              <th>Atraso hoje</th>
              <th>Divida</th>
              <th>Total cobrado</th>
              <th>Total pago</th>
              <th>Lucro</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody id="wallet-control-rows">${memberRowsHtml}</tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3 class="panel-title">Graficos dos usuarios autorizados</h3>
          <p class="panel-subtitle">Graficos em tendencia de subida (carteira e cobrado), atualizados quando houver novos pagamentos.</p>
        </div>
      </div>
      <div class="member-wallet-grid">
        ${chartCardsHtml}
      </div>
    </section>
  `;

  const refreshButton = document.getElementById('wallet-control-refresh');
  const chartTypeSelect = document.getElementById('wallet-control-chart-type');
  const chartVisibilityToggleButton = document.getElementById('wallet-chart-visibility-toggle');
  const globalDebtInput = document.getElementById('wallet-global-debt');
  const globalDebtButton = document.getElementById('wallet-global-debt-apply');
  const resetAllButton = document.getElementById('wallet-reset-all');
  const searchInput = document.getElementById('wallet-control-search');
  const rowsElement = document.getElementById('wallet-control-rows');
  const totalCanvas = document.getElementById('wallet-control-total-canvas');
  const automationOutput = document.getElementById('wallet-automation-output');
  const automationRows = document.getElementById('wallet-automation-rows');
  const automationSaveButton = document.getElementById('wallet-auto-save');
  const automationPreviewButton = document.getElementById('wallet-auto-preview');
  const automationRunButton = document.getElementById('wallet-auto-run');
  const automationRunForceButton = document.getElementById('wallet-auto-run-force');

  drawFinanceSeriesCanvas(totalCanvas, aggregateSeries, {
    secondaryKey: 'charge',
    chartType: financeChartType,
    periodLabel: financeChartScopeLabel,
    paidLabel: 'Carteira usuarios',
    debtLabel: 'Cobrado usuarios',
    paidColor: chartTheme.paidColor,
    debtColor: chartTheme.debtColor,
    paidFill: chartTheme.paidFill,
    debtFill: chartTheme.debtFill
  });

  membersWithChart.forEach((member, index) => {
    const canvas = document.getElementById(`wallet-control-chart-${index}`);
    drawWalletCanvas(canvas, member, {
      anchorMonthKey: selectedMonthKey,
      paidLabel: 'Pago',
      debtLabel: 'Cobrado',
      periodLabel: financeChartScopeLabel
    });
  });
  attachWalletCardInteractions(els.content);

  if (chartTypeSelect) {
    chartTypeSelect.addEventListener('change', () => {
      setFinanceChartType(chartTypeSelect.value);
    });
  }

  function readAutomationFormValues() {
    const dueDay = Number(document.getElementById('wallet-auto-due-day').value);
    const graceDays = Number(document.getElementById('wallet-auto-grace-days').value);
    const minDebtForLateCharge = Number(document.getElementById('wallet-auto-min-debt').value);
    const fineMode = String(document.getElementById('wallet-auto-fine-mode').value || 'percent');
    const fineValue = Number(document.getElementById('wallet-auto-fine-value').value);
    const interestMonthlyPercent = Number(document.getElementById('wallet-auto-interest-monthly').value);
    const interestCapPercent = Number(document.getElementById('wallet-auto-interest-cap').value);
    const enabled = document.getElementById('wallet-auto-enabled').checked;
    const applyToBlockedUsers = document.getElementById('wallet-auto-blocked').checked;
    const autoRunOnWalletControlOpen = document.getElementById('wallet-auto-open-run').checked;
    return normalizeWalletAutomationSettings({
      ...settings.walletAutomation,
      enabled,
      dueDay,
      graceDays,
      minDebtForLateCharge,
      fineMode,
      fineValue,
      interestMonthlyPercent,
      interestCapPercent,
      applyToBlockedUsers,
      autoRunOnWalletControlOpen,
      updatedAt: Date.now()
    });
  }

  function renderAutomationPreview(candidates, title = 'Preview atualizado.') {
    const safeCandidates = Array.isArray(candidates) ? candidates : [];
    const eligible = safeCandidates.filter((entry) => entry.eligible);
    const potential = eligible.reduce((sum, entry) => sum + (Number(entry.totalAmount) || 0), 0);
    automationOutput.innerHTML = `${escapeHtml(title)} Elegiveis: <strong>${eligible.length}</strong> | Potencial: <strong>${formatCurrency(potential)}</strong>`;
    if (safeCandidates.length === 0) {
      automationRows.innerHTML = '<tr><td colspan="8" class="empty-state">Sem dados para mostrar.</td></tr>';
      return;
    }
    automationRows.innerHTML = safeCandidates
      .slice(0, 40)
      .map((entry) => `
        <tr data-user="${escapeHtml(entry.username)}">
          <td>${escapeHtml(entry.username)}</td>
          <td>${escapeHtml(entry.status === 'active' ? 'Ativo' : 'Bloqueado')}</td>
          <td>${formatCurrency(entry.debt)}</td>
          <td>${formatDateTime(entry.dueTimestamp)}</td>
          <td>${Math.max(0, Number(entry.overdueAfterGrace) || 0)} dia(s)</td>
          <td>${formatCurrency(entry.fineAmount)}</td>
          <td>${formatCurrency(entry.interestAmount)}</td>
          <td>${entry.eligible ? formatCurrency(entry.totalAmount) : escapeHtml(entry.reason || '-')}</td>
        </tr>
      `)
      .join('');
  }

  refreshButton.addEventListener('click', () => {
    renderWalletControl();
  });

  chartVisibilityToggleButton.addEventListener('click', () => {
    if (!isEsther()) {
      showNotification('Somente Esther pode alterar privacidade dos graficos.', 'error');
      return;
    }
    const nextMode = isWalletChartsPublicForMembers()
      ? WALLET_CHART_VISIBILITY_PRIVATE
      : WALLET_CHART_VISIBILITY_PUBLIC;
    const changed = setWalletChartsVisibilityMode(nextMode, 'Esther');
    if (!changed) {
      showNotification('Modo de visibilidade ja estava ativo.', 'warning');
      return;
    }
    showNotification(
      nextMode === WALLET_CHART_VISIBILITY_PUBLIC
        ? 'Graficos publicados para todos os membros.'
        : 'Graficos voltaram para modo privado.',
      'success'
    );
    renderWalletControl();
  });

  automationSaveButton.addEventListener('click', () => {
    const next = readAutomationFormValues();
    settings.walletAutomation = normalizeWalletAutomationSettings({
      ...next,
      lastRunDay: settings.walletAutomation && settings.walletAutomation.lastRunDay
        ? settings.walletAutomation.lastRunDay
        : '',
      updatedAt: Date.now()
    });
    saveData();
    addLog(
      `Atualizou regras de atraso (ativo=${settings.walletAutomation.enabled ? 'sim' : 'nao'}, vencimento dia ${settings.walletAutomation.dueDay}, multa ${formatBillingFineRule(settings.walletAutomation.fineMode, settings.walletAutomation.fineValue)}, juros ${settings.walletAutomation.interestMonthlyPercent.toFixed(2)}%/mes)`
    );
    showNotification('Regras de multa/juros salvas.', 'success');
    renderWalletControl();
  });

  automationPreviewButton.addEventListener('click', () => {
    const previousPolicy = settings.walletAutomation;
    settings.walletAutomation = readAutomationFormValues();
    const previewCandidates = buildLateChargeCandidates(members, Date.now());
    settings.walletAutomation = previousPolicy;
    renderAutomationPreview(previewCandidates, 'Preview com parametros atuais do formulario.');
  });

  automationRunButton.addEventListener('click', () => {
    settings.walletAutomation = readAutomationFormValues();
    const result = runWalletLateAutomation({
      actor: session ? session.username : 'sistema',
      referenceTs: Date.now(),
      force: false
    });
    if (!result.ok) {
      showNotification(result.message || 'Nao foi possivel executar agora.', 'warning');
      return;
    }
    addLog(`Executou cobranca automatica de atraso (${result.appliedCount} usuarios, total ${formatCurrency(result.totalAmount)})`);
    showNotification(`Automacao executada: ${result.appliedCount} usuario(s), total ${formatCurrency(result.totalAmount)}.`, 'success');
    renderWalletControl();
  });

  automationRunForceButton.addEventListener('click', () => {
    settings.walletAutomation = readAutomationFormValues();
    const result = runWalletLateAutomation({
      actor: session ? session.username : 'sistema',
      referenceTs: Date.now(),
      force: true
    });
    if (!result.ok) {
      showNotification(result.message || 'Nao foi possivel forcar agora.', 'warning');
      return;
    }
    addLog(`Forcou cobranca automatica de atraso (${result.appliedCount} usuarios, total ${formatCurrency(result.totalAmount)})`);
    showNotification(`Execucao forcada concluida: ${result.appliedCount} usuario(s), total ${formatCurrency(result.totalAmount)}.`, 'success');
    renderWalletControl();
  });

  globalDebtButton.addEventListener('click', () => {
    const amount = toPositiveAmount(globalDebtInput.value);
    if (!amount) {
      showNotification('Informe um valor valido para divida geral.', 'warning');
      return;
    }
    const targetMembers = members.filter((member) => member.status === 'active');
    if (targetMembers.length === 0) {
      showNotification('Nao ha usuarios ativos para ratear.', 'warning');
      return;
    }

    const baseShare = Number((amount / targetMembers.length).toFixed(2));
    let remaining = amount;
    targetMembers.forEach((member, index) => {
      const share = index === targetMembers.length - 1
        ? Number(remaining.toFixed(2))
        : baseShare;
      remaining -= share;
      if (share > 0) {
        registerFinanceEvent(member, 'charge', share, 'Divida geral rateada', null, { skipSave: true });
      }
    });

    saveData();
    addLog(`Aplicou divida geral ${formatCurrency(amount)} para ${targetMembers.length} usuario(s) (rateio)`);
    showNotification('Divida geral distribuida com sucesso.', 'success');
    renderWalletControl();
  });

  resetAllButton.addEventListener('click', () => {
    if (!confirm('Resetar tudo para 0? Isso limpa dividas, multas, carteira e historico de todos os usuarios habilitados.')) return;
    members.forEach((member) => {
      member.debt = 0;
      member.totalCharged = 0;
      member.totalPaid = 0;
      member.walletProfit = 0;
      member.emergencyLoanOutstanding = 0;
      member.financeHistory = [];
      member.financeUpdatedAt = Date.now();
      member.billingProfile = normalizeUserBillingProfile({ updatedAt: Date.now() }, Date.now());
      member.billingUpdatedAt = member.billingProfile.updatedAt;
    });
    saveData();
    addLog('Resetou todas as carteiras habilitadas para 0 (novo ciclo)');
    showNotification('Reset geral concluido. Todas as carteiras foram zeradas.', 'success');
    renderWalletControl();
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const rows = rowsElement.querySelectorAll('tr[data-user]');
    rows.forEach((row) => {
      const username = String(row.dataset.user || '').toLowerCase();
      const rowText = String(row.textContent || '').toLowerCase();
      row.style.display = !query || username.includes(query) || rowText.includes(query) ? '' : 'none';
    });
  });

  rowsElement.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const row = button.closest('tr[data-user]');
    if (!row) return;
    const username = row.dataset.user;
    const target = getUserByUsername(username);
    if (!target) {
      showNotification('Usuario nao encontrado. Atualize o painel.', 'warning');
      renderWalletControl();
      return;
    }
    if (!canUserParticipateInWallet(target)) {
      showNotification('Esse ajuste de carteira exige liberacao da Esther.', 'warning');
      renderWalletControl();
      return;
    }
    const action = button.dataset.action;

    if (action === 'apply-late') {
      const result = applyLateChargesToUser(target, {
        actor: session ? session.username : 'sistema',
        referenceTs: Date.now(),
        eventTimestamp: Date.now()
      });
      if (!result.ok) {
        showNotification(result.reason || 'Sem atraso elegivel para cobrar agora.', 'warning');
        return;
      }
      addLog(
        `Aplicou atraso manual em ${target.username}: total ${formatCurrency(result.totalAmount)} (multa ${formatCurrency(result.fineAmount)} + juros ${formatCurrency(result.interestAmount)})`
      );
      showNotification(`Atraso aplicado em ${target.username}: ${formatCurrency(result.totalAmount)}.`, 'success');
      renderWalletControl();
      return;
    }

    if (action === 'billing-profile') {
      const profile = ensureUserBillingProfile(target);
      const currentPolicy = getUserEffectiveBillingPolicy(target);
      const dueInput = prompt(
        `Dia de vencimento de ${target.username} (1-28). Deixe vazio para usar global (${currentPolicy.dueDay}):`,
        profile.dueDay === null ? '' : String(profile.dueDay)
      );
      if (dueInput === null) return;
      const graceInput = prompt(
        `Dias de tolerancia para ${target.username}. Deixe vazio para usar global (${currentPolicy.graceDays}):`,
        profile.graceDays === null ? '' : String(profile.graceDays)
      );
      if (graceInput === null) return;
      const fineModeInput = prompt(
        `Modo de multa para ${target.username} (default, fixed, percent):`,
        String(profile.fineMode || 'default')
      );
      if (fineModeInput === null) return;
      const fineValueInput = prompt(
        `Valor de multa para ${target.username}. Vazio = global atual (${formatBillingFineRule(currentPolicy.fineMode, currentPolicy.fineValue)}):`,
        profile.fineValue === null ? '' : String(profile.fineValue)
      );
      if (fineValueInput === null) return;
      const interestInput = prompt(
        `Juros mensal (%) para ${target.username}. Vazio = global (${Number(currentPolicy.interestMonthlyPercent).toFixed(2)}):`,
        profile.interestMonthlyPercent === null ? '' : String(profile.interestMonthlyPercent)
      );
      if (interestInput === null) return;
      const capInput = prompt(
        `Teto de juros por ciclo (%) para ${target.username}. Vazio = global (${Number(currentPolicy.interestCapPercent).toFixed(2)}):`,
        profile.interestCapPercent === null ? '' : String(profile.interestCapPercent)
      );
      if (capInput === null) return;
      const minDebtInput = prompt(
        `Divida minima para atraso de ${target.username}. Vazio = global (${formatCurrency(currentPolicy.minDebtForLateCharge)}):`,
        profile.minDebtForLateCharge === null ? '' : String(profile.minDebtForLateCharge)
      );
      if (minDebtInput === null) return;
      const pauseInput = prompt(
        `Pausar cobranca automatica para ${target.username}? (sim/nao):`,
        profile.paused ? 'sim' : 'nao'
      );
      if (pauseInput === null) return;

      const parseOptionalInt = (raw, min, max) => {
        const trimmed = String(raw || '').trim();
        if (!trimmed) return null;
        const parsed = Number(trimmed);
        if (!Number.isFinite(parsed)) return { invalid: true };
        return Math.max(min, Math.min(max, Math.floor(parsed)));
      };
      const parseOptionalAmount = (raw, min = 0, max = 1000000) => {
        const trimmed = String(raw || '').trim().replace(',', '.');
        if (!trimmed) return null;
        const parsed = Number(trimmed);
        if (!Number.isFinite(parsed)) return { invalid: true };
        return Math.max(min, Math.min(max, Number(parsed.toFixed(2))));
      };

      const dueDay = parseOptionalInt(dueInput, 1, 28);
      const graceDays = parseOptionalInt(graceInput, 0, 45);
      const fineMode = String(fineModeInput || '').trim().toLowerCase();
      const fineValue = parseOptionalAmount(fineValueInput, 0, 100000);
      const interestMonthlyPercent = parseOptionalAmount(interestInput, 0, 100);
      const interestCapPercent = parseOptionalAmount(capInput, 0, 400);
      const minDebtForLateCharge = parseOptionalAmount(minDebtInput, 0, 1000000);
      if (
        (dueDay && dueDay.invalid)
        || (graceDays && graceDays.invalid)
        || (fineValue && fineValue.invalid)
        || (interestMonthlyPercent && interestMonthlyPercent.invalid)
        || (interestCapPercent && interestCapPercent.invalid)
        || (minDebtForLateCharge && minDebtForLateCharge.invalid)
      ) {
        showNotification('Valor invalido em alguma regra individual.', 'warning');
        return;
      }
      if (!['default', 'fixed', 'percent'].includes(fineMode)) {
        showNotification('Modo de multa invalido. Use default, fixed ou percent.', 'warning');
        return;
      }

      const pauseNormalized = ['sim', 's', 'yes', 'y', '1', 'true'].includes(String(pauseInput || '').trim().toLowerCase());
      const updatedProfile = normalizeUserBillingProfile({
        ...profile,
        dueDay,
        graceDays,
        fineMode,
        fineValue,
        interestMonthlyPercent,
        interestCapPercent,
        minDebtForLateCharge,
        paused: pauseNormalized,
        updatedAt: Date.now()
      }, Date.now());

      target.billingProfile = updatedProfile;
      target.billingUpdatedAt = updatedProfile.updatedAt;
      saveData();
      addLog(
        `Atualizou regra de atraso individual de ${target.username} (vencimento ${updatedProfile.dueDay === null ? 'global' : updatedProfile.dueDay}, multa ${updatedProfile.fineMode}, pausa=${updatedProfile.paused ? 'sim' : 'nao'})`
      );
      showNotification(`Regras individuais de ${target.username} atualizadas.`, 'success');
      renderWalletControl();
      return;
    }

    if (action === 'toggle-chart') {
      if (!isEsther()) {
        showNotification('Somente Esther pode definir quem possui grafico.', 'error');
        return;
      }
      target.walletChartEnabled = !target.walletChartEnabled;
      target.walletChartUpdatedAt = Date.now();
      saveData();
      addLog(`Esther ${target.walletChartEnabled ? 'ativou' : 'desativou'} grafico de ${target.username} pelo controle de carteiras`);
      showNotification(`Grafico de ${target.username} ${target.walletChartEnabled ? 'ativado' : 'desativado'}.`, 'success');
      renderWalletControl();
      return;
    }

    if (action === 'save-wallet') {
      const debt = toNonNegativeAmount(row.querySelector('input[data-field="debt"]').value);
      const charged = toNonNegativeAmount(row.querySelector('input[data-field="charged"]').value);
      const paid = toNonNegativeAmount(row.querySelector('input[data-field="paid"]').value);
      const profit = toNonNegativeAmount(row.querySelector('input[data-field="profit"]').value);

      if (debt === null || charged === null || paid === null || profit === null) {
        showNotification('Valores invalidos. Use apenas numeros maiores ou iguais a zero.', 'warning');
        return;
      }
      if (profit > paid) {
        showNotification('Lucro nao pode ser maior que total pago.', 'warning');
        return;
      }

      target.debt = debt;
      target.totalPaid = paid;
      target.walletProfit = profit;
      target.totalCharged = Math.max(charged, debt + Math.max(0, paid - profit));
      target.emergencyLoanOutstanding = 0;
      target.financeUpdatedAt = Date.now();
      const healthSelect = row.querySelector('select[data-field="wallet-health"]');
      if (isMasterAdmin && healthSelect) {
        target.walletHealth = normalizeWalletHealth(healthSelect.value);
        target.walletHealthUpdatedAt = Date.now();
      }

      saveData();
      addLog(`Ajustou carteira de ${target.username} (divida ${formatCurrency(debt)}, cobrado ${formatCurrency(target.totalCharged)}, pago ${formatCurrency(paid)})`);
      showNotification(`Carteira de ${target.username} atualizada.`, 'success');
      renderWalletControl();
      return;
    }

    if (action === 'charge') {
      const raw = prompt(`Valor da multa/cobranca para ${target.username}:`, '30.00');
      if (!raw) return;
      const amount = toPositiveAmount(raw);
      if (!amount) {
        showNotification('Valor invalido.', 'warning');
        return;
      }
      const timestampPrompt = promptFinanceTimestamp(`Data/hora da cobranca para ${target.username}`);
      if (timestampPrompt.cancelled) return;
      if (timestampPrompt.invalid) {
        showNotification('Data/hora invalida.', 'warning');
        return;
      }
      const result = registerFinanceEvent(target, 'charge', amount, 'Multa/cobranca via controle de carteiras', null, { timestamp: timestampPrompt.timestamp });
      if (!result.ok) {
        showNotification(result.message, 'warning');
        return;
      }
      addLog(`Cobrou ${formatCurrency(result.amount)} de ${target.username} em ${formatDateTime(result.timestamp)} pelo controle de carteiras`);
      showNotification('Cobranca registrada com sucesso.', 'success');
      renderWalletControl();
      return;
    }

    if (action === 'payment') {
      const raw = prompt(`Valor do pagamento para ${target.username}:`, '20.00');
      if (!raw) return;
      const amount = toPositiveAmount(raw);
      if (!amount) {
        showNotification('Valor invalido.', 'warning');
        return;
      }
      const timestampPrompt = promptFinanceTimestamp(`Data/hora do pagamento para ${target.username}`);
      if (timestampPrompt.cancelled) return;
      if (timestampPrompt.invalid) {
        showNotification('Data/hora invalida.', 'warning');
        return;
      }
      const result = registerFinanceEvent(target, 'payment', amount, 'Pagamento via controle de carteiras', null, { timestamp: timestampPrompt.timestamp });
      if (!result.ok) {
        showNotification(result.message, 'warning');
        return;
      }
      addLog(`Registrou pagamento de ${formatCurrency(result.amount)} para ${target.username} em ${formatDateTime(result.timestamp)} no controle de carteiras (lucro ${formatCurrency(result.profitAdded || 0)})`);
      const profitText = result.profitAdded > 0 ? ` | lucro ${formatCurrency(result.profitAdded)}` : '';
      showNotification(`Pagamento registrado e grafico atualizado${profitText}.`, 'success');
      renderWalletControl();
      return;
    }

    if (action === 'reset-chart') {
      if (!confirm(`Zerar os valores do grafico de ${target.username}?`)) return;
      target.financeHistory = [];
      target.totalPaid = 0;
      target.walletProfit = 0;
      target.totalCharged = Math.max(0, target.debt);
      target.emergencyLoanOutstanding = 0;
      target.financeUpdatedAt = Date.now();
      const profile = ensureUserBillingProfile(target);
      profile.lateAccruedDays = 0;
      profile.cycleInterestAccrued = 0;
      profile.fineAppliedCycleKey = '';
      profile.updatedAt = Date.now();
      target.billingUpdatedAt = profile.updatedAt;
      saveData();
      addLog(`Zerou grafico da carteira de ${target.username} no controle de carteiras`);
      showNotification('Valor do grafico zerado com sucesso.', 'success');
      renderWalletControl();
    }
  });
}

function buildTicketActionButtons(ticket, allowManagement = true) {
  const buttons = [];
  const isPrivileged = session.role === 'admin' || session.role === 'superadmin';
  const canClose = session.role === 'superadmin' || ticket.assignedAdmin === session.username;
  const canOpenChat = ticket.status !== 'pending' && canAccessTicket(ticket);

  if (ticket.status === 'pending' && isPrivileged && !ticket.assignedAdmin) {
    buttons.push(`<button class="btn-primary" data-action="accept" data-ticket="${ticket.id}">Assumir</button>`);
  }

  if (canOpenChat) {
    buttons.push(`<button class="btn-secondary" data-action="chat" data-ticket="${ticket.id}">Chat</button>`);
  }

  if (allowManagement && ticket.status === 'active' && canClose) {
    buttons.push(`<button class="btn-ghost" data-action="close" data-ticket="${ticket.id}">Encerrar</button>`);
  }

  if (allowManagement && ticket.status === 'closed' && isPrivileged) {
    buttons.push(`<button class="btn-ghost" data-action="reopen" data-ticket="${ticket.id}">Reabrir</button>`);
  }

  return buttons.length > 0 ? `<div class="inline-actions">${buttons.join('')}</div>` : '-';
}

function canAccessTicket(ticket) {
  if (!session) return false;
  if (session.role === 'superadmin') return true;
  return ticket.creator === session.username || ticket.assignedAdmin === session.username;
}

function renderMyTickets() {
  const scopedTickets = getScopedTickets().sort((a, b) => b.updatedAt - a.updatedAt);

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Minhas solicitacoes</h2>
          <p class="panel-subtitle">Filtre por status, prioridade e texto para localizar rapido.</p>
        </div>
      </div>
      <div class="filters">
        <input type="text" id="my-ticket-search" placeholder="Buscar por titulo, criador ou responsavel" />
        <select id="my-ticket-status">
          <option value="all">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="active">Em andamento</option>
          <option value="closed">Encerrado</option>
        </select>
        <select id="my-ticket-priority">
          <option value="all">Todas as prioridades</option>
          <option value="low">Baixa</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Assunto</th>
              <th>Categoria</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Responsavel</th>
              <th>Atualizado</th>
              <th>Acao</th>
            </tr>
          </thead>
          <tbody id="my-ticket-rows"></tbody>
        </table>
      </div>
    </section>
  `;

  const rowsElement = document.getElementById('my-ticket-rows');
  const searchInput = document.getElementById('my-ticket-search');
  const statusSelect = document.getElementById('my-ticket-status');
  const prioritySelect = document.getElementById('my-ticket-priority');

  function drawRows() {
    const search = searchInput.value.trim().toLowerCase();
    const statusFilter = statusSelect.value;
    const priorityFilter = prioritySelect.value;

    const filtered = scopedTickets.filter((ticket) => {
      const matchesSearch = !search
        || ticket.title.toLowerCase().includes(search)
        || ticket.creator.toLowerCase().includes(search)
        || String(ticket.assignedAdmin || '').toLowerCase().includes(search);
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    if (filtered.length === 0) {
      rowsElement.innerHTML = '<tr><td colspan="8" class="empty-state">Nenhum ticket encontrado para o filtro atual.</td></tr>';
      return;
    }

    rowsElement.innerHTML = filtered.map((ticket) => `
      <tr>
        <td>#${ticket.id}</td>
        <td>
          <strong>${escapeHtml(ticket.title)}</strong><br />
          <small>${escapeHtml(toShortText(ticket.description || 'Sem descricao.', 80))}</small>
        </td>
        <td>${escapeHtml(categoryLabel(ticket.category))}</td>
        <td>${priorityBadge(ticket.priority)}</td>
        <td>${statusBadge(ticket.status)}</td>
        <td>${ticket.assignedAdmin ? renderUserIdentity(ticket.assignedAdmin, { size: 'xs', showRole: true }) : '-'}</td>
        <td>${formatDateTime(ticket.updatedAt)}</td>
        <td>${buildTicketActionButtons(ticket, true)}</td>
      </tr>
    `).join('');
  }

  let searchDebounceTimer = null;
  searchInput.addEventListener('input', () => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    searchDebounceTimer = setTimeout(() => {
      searchDebounceTimer = null;
      drawRows();
    }, 120);
  });
  statusSelect.addEventListener('change', drawRows);
  prioritySelect.addEventListener('change', drawRows);

  rowsElement.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const ticketId = Number(button.dataset.ticket);
    const action = button.dataset.action;

    if (action === 'chat') {
      openChat(ticketId);
      return;
    }

    if (action === 'accept') {
      acceptTicket(ticketId, session.username);
      drawRows();
      renderSidebar();
      return;
    }

    if (action === 'close') {
      closeTicket(ticketId);
      drawRows();
      return;
    }

    if (action === 'reopen') {
      reopenTicket(ticketId);
      drawRows();
      return;
    }
  });

  drawRows();
}

function renderCreateTicket() {
  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Abrir novo ticket</h2>
          <p class="panel-subtitle">Preencha os campos para direcionar sua solicitacao com mais rapidez.</p>
        </div>
      </div>
      <form id="ticket-form" class="form-grid">
        <div class="full">
          <label for="ticket-title">Assunto</label>
          <input id="ticket-title" type="text" maxlength="120" placeholder="Ex: Falha ao acessar o painel financeiro" required />
        </div>

        <div>
          <label for="ticket-category">Categoria</label>
          <select id="ticket-category">
            <option value="geral">Geral</option>
            <option value="tecnico">Tecnico</option>
            <option value="financeiro">Financeiro</option>
            <option value="acesso">Acesso</option>
            <option value="pagamento">Pagamento</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div>
          <label for="ticket-priority">Prioridade</label>
          <select id="ticket-priority">
            <option value="low">Baixa</option>
            <option value="medium" selected>Media</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>

        <div class="full">
          <label for="ticket-description">Descricao</label>
          <textarea id="ticket-description" maxlength="1000" placeholder="Detalhe o problema, impacto e tentativas ja realizadas."></textarea>
        </div>

        <div class="full inline-actions">
          <button type="submit" class="btn-primary">Criar ticket</button>
          <button type="button" id="ticket-clear" class="btn-ghost">Limpar formulario</button>
        </div>
      </form>
    </section>
  `;

  const form = document.getElementById('ticket-form');
  const clearButton = document.getElementById('ticket-clear');
  const titleInput = document.getElementById('ticket-title');
  const categoryInput = document.getElementById('ticket-category');
  const priorityInput = document.getElementById('ticket-priority');
  const descriptionInput = document.getElementById('ticket-description');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const priority = priorityInput.value;
    const description = descriptionInput.value.trim();

    if (title.length < 4) {
      showNotification('Informe um assunto com pelo menos 4 caracteres.', 'warning');
      return;
    }

    createTicket({ title, category, priority, description });
    form.reset();
    navigate('myTickets');
  });

  clearButton.addEventListener('click', () => {
    form.reset();
    titleInput.focus();
  });
}

function createTicket(payload) {
  const ticket = normalizeTicket({
    id: createId(),
    title: payload.title,
    description: payload.description,
    category: payload.category,
    priority: payload.priority,
    creator: session.username,
    status: 'pending',
    assignedAdmin: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: []
  });

  tickets.push(ticket);
  saveData();
  addLog(`Criou ticket "${ticket.title}"`);
  showNotification('Ticket criado com sucesso.', 'success');
}

function renderPendingTickets() {
  if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
    renderAccessDenied('Somente admins podem acessar a fila pendente.');
    return;
  }

  const pendingTickets = tickets
    .filter((ticket) => ticket.status === 'pending')
    .sort((a, b) => a.createdAt - b.createdAt);

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Fila pendente</h2>
          <p class="panel-subtitle">Aceite ou atribua tickets que ainda nao estao em atendimento.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Assunto</th>
              <th>Criador</th>
              <th>Categoria</th>
              <th>Prioridade</th>
              <th>Criado em</th>
              <th>Acao</th>
            </tr>
          </thead>
          <tbody id="pending-rows"></tbody>
        </table>
      </div>
    </section>
  `;

  const rows = document.getElementById('pending-rows');

  if (pendingTickets.length === 0) {
    rows.innerHTML = '<tr><td colspan="7" class="empty-state">Nao ha tickets pendentes.</td></tr>';
    return;
  }

  const assigneeOptions = getActiveAdmins()
    .map((admin) => `<option value="${escapeHtml(admin.username)}">${escapeHtml(getUserPublicLabel(admin))}</option>`)
    .join('');

  rows.innerHTML = pendingTickets.map((ticket) => {
    const actionHtml = session.role === 'superadmin'
      ? `
        <div class="inline-actions">
          <select data-assignee="${ticket.id}">${assigneeOptions}</select>
          <button class="btn-primary" data-action="assign" data-ticket="${ticket.id}">Atribuir</button>
        </div>
      `
      : `
        <div class="inline-actions">
          <button class="btn-primary" data-action="accept" data-ticket="${ticket.id}">Assumir</button>
        </div>
      `;

    return `
      <tr>
        <td>#${ticket.id}</td>
        <td>${escapeHtml(ticket.title)}</td>
        <td>${renderUserIdentity(ticket.creator, { size: 'xs', showRole: true })}</td>
        <td>${escapeHtml(categoryLabel(ticket.category))}</td>
        <td>${priorityBadge(ticket.priority)}</td>
        <td>${formatDateTime(ticket.createdAt)}</td>
        <td>${actionHtml}</td>
      </tr>
    `;
  }).join('');

  rows.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const ticketId = Number(button.dataset.ticket);

    if (action === 'accept') {
      acceptTicket(ticketId, session.username);
      renderPendingTickets();
      renderSidebar();
      return;
    }

    if (action === 'assign') {
      const select = rows.querySelector(`select[data-assignee="${ticketId}"]`);
      const assignee = select ? select.value : '';
      if (!assignee) {
        showNotification('Escolha um responsavel para atribuir.', 'warning');
        return;
      }
      acceptTicket(ticketId, assignee);
      renderPendingTickets();
      renderSidebar();
    }
  });
}

function acceptTicket(ticketId, assignee) {
  const ticket = tickets.find((item) => item.id === ticketId);
  if (!ticket || ticket.status !== 'pending') {
    showNotification('Ticket nao esta disponivel para atribuicao.', 'warning');
    return;
  }

  ticket.status = 'active';
  ticket.assignedAdmin = assignee;
  ticket.updatedAt = Date.now();

  saveData();
  const assigneeLabel = getUserPublicLabel(assignee);
  addLog(`Atribuiu ticket "${ticket.title}" para ${assigneeLabel}`);
  showNotification(`Ticket #${ticket.id} atribuido para ${assigneeLabel}.`, 'success');
}
function renderAllTickets() {
  if (!session || session.role !== 'superadmin') {
    renderAccessDenied('Apenas superadmin pode acessar todos os tickets.');
    return;
  }

  const assigneeOptions = ['<option value="">Sem responsavel</option>']
    .concat(getActiveAdmins().map((admin) => `<option value="${escapeHtml(admin.username)}">${escapeHtml(getUserPublicLabel(admin))}</option>`))
    .join('');

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Gestao total de tickets</h2>
          <p class="panel-subtitle">Atualize status, prioridade e responsavel sem sair da tabela.</p>
        </div>
      </div>

      <div class="filters">
        <input type="text" id="all-ticket-search" placeholder="Buscar por assunto, criador ou responsavel" />
        <select id="all-ticket-status">
          <option value="all">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="active">Em andamento</option>
          <option value="closed">Encerrado</option>
        </select>
        <select id="all-ticket-priority">
          <option value="all">Todas as prioridades</option>
          <option value="low">Baixa</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Assunto</th>
              <th>Criador</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Responsavel</th>
              <th>Atualizado</th>
              <th>Acao</th>
            </tr>
          </thead>
          <tbody id="all-ticket-rows"></tbody>
        </table>
      </div>
    </section>
  `;

  const rowsElement = document.getElementById('all-ticket-rows');
  const searchInput = document.getElementById('all-ticket-search');
  const statusSelect = document.getElementById('all-ticket-status');
  const prioritySelect = document.getElementById('all-ticket-priority');

  function drawRows() {
    const search = searchInput.value.trim().toLowerCase();
    const statusFilter = statusSelect.value;
    const priorityFilter = prioritySelect.value;

    const filteredTickets = tickets
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .filter((ticket) => {
        const matchesSearch = !search
          || ticket.title.toLowerCase().includes(search)
          || ticket.creator.toLowerCase().includes(search)
          || String(ticket.assignedAdmin || '').toLowerCase().includes(search);

        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      });

    if (filteredTickets.length === 0) {
      rowsElement.innerHTML = '<tr><td colspan="8" class="empty-state">Nenhum ticket encontrado.</td></tr>';
      return;
    }

    rowsElement.innerHTML = filteredTickets.map((ticket) => `
      <tr>
        <td>#${ticket.id}</td>
        <td>
          <strong>${escapeHtml(ticket.title)}</strong><br />
          <small>${escapeHtml(toShortText(ticket.description || '-', 70))}</small>
        </td>
        <td>${renderUserIdentity(ticket.creator, { size: 'xs', showRole: true })}</td>
        <td>
          <select data-field="status" data-ticket="${ticket.id}">
            <option value="pending" ${ticket.status === 'pending' ? 'selected' : ''}>Pendente</option>
            <option value="active" ${ticket.status === 'active' ? 'selected' : ''}>Em andamento</option>
            <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Encerrado</option>
          </select>
        </td>
        <td>
          <select data-field="priority" data-ticket="${ticket.id}">
            <option value="low" ${ticket.priority === 'low' ? 'selected' : ''}>Baixa</option>
            <option value="medium" ${ticket.priority === 'medium' ? 'selected' : ''}>Media</option>
            <option value="high" ${ticket.priority === 'high' ? 'selected' : ''}>Alta</option>
            <option value="urgent" ${ticket.priority === 'urgent' ? 'selected' : ''}>Urgente</option>
          </select>
        </td>
        <td>
          <select data-field="assignee" data-ticket="${ticket.id}">
            ${assigneeOptions}
          </select>
        </td>
        <td>${formatDateTime(ticket.updatedAt)}</td>
        <td>
          <div class="inline-actions">
            <button class="btn-primary" data-action="save" data-ticket="${ticket.id}">Salvar</button>
            <button class="btn-secondary" data-action="chat" data-ticket="${ticket.id}">Chat</button>
          </div>
        </td>
      </tr>
    `).join('');

    filteredTickets.forEach((ticket) => {
      const assigneeSelect = rowsElement.querySelector(`select[data-field="assignee"][data-ticket="${ticket.id}"]`);
      if (assigneeSelect) {
        assigneeSelect.value = ticket.assignedAdmin || '';
      }
    });
  }

  rowsElement.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const ticketId = Number(button.dataset.ticket);

    if (action === 'chat') {
      openChat(ticketId);
      return;
    }

    if (action === 'save') {
      const statusField = rowsElement.querySelector(`select[data-field="status"][data-ticket="${ticketId}"]`);
      const priorityField = rowsElement.querySelector(`select[data-field="priority"][data-ticket="${ticketId}"]`);
      const assigneeField = rowsElement.querySelector(`select[data-field="assignee"][data-ticket="${ticketId}"]`);

      const nextStatus = statusField ? statusField.value : 'pending';
      const nextPriority = priorityField ? priorityField.value : 'medium';
      const nextAssignee = assigneeField ? assigneeField.value : '';

      updateTicketBySuperadmin(ticketId, {
        status: nextStatus,
        priority: nextPriority,
        assignedAdmin: nextAssignee || null
      });

      drawRows();
      renderSidebar();
    }
  });

  searchInput.addEventListener('input', drawRows);
  statusSelect.addEventListener('change', drawRows);
  prioritySelect.addEventListener('change', drawRows);

  drawRows();
}

function updateTicketBySuperadmin(ticketId, updates) {
  const ticket = tickets.find((item) => item.id === ticketId);
  if (!ticket) {
    showNotification('Ticket nao encontrado.', 'error');
    return;
  }

  if (updates.status === 'active' && !updates.assignedAdmin) {
    showNotification('Ticket ativo precisa de responsavel.', 'warning');
    return;
  }

  ticket.status = ['pending', 'active', 'closed'].includes(updates.status) ? updates.status : ticket.status;
  ticket.priority = ['low', 'medium', 'high', 'urgent'].includes(updates.priority) ? updates.priority : ticket.priority;

  if (ticket.status === 'pending') {
    ticket.assignedAdmin = null;
  } else {
    ticket.assignedAdmin = updates.assignedAdmin || ticket.assignedAdmin || null;
  }

  ticket.updatedAt = Date.now();

  saveData();
  addLog(`Atualizou ticket #${ticket.id}: status ${ticket.status}, prioridade ${ticket.priority}, responsavel ${ticket.assignedAdmin || 'nenhum'}`);
  showNotification(`Ticket #${ticket.id} atualizado.`, 'success');
}

function closeTicket(ticketId) {
  const ticket = tickets.find((item) => item.id === ticketId);
  if (!ticket || ticket.status !== 'active') {
    showNotification('Apenas tickets ativos podem ser encerrados.', 'warning');
    return;
  }

  if (!(session.role === 'superadmin' || ticket.assignedAdmin === session.username)) {
    showNotification('Voce nao pode encerrar este ticket.', 'error');
    return;
  }

  ticket.status = 'closed';
  ticket.updatedAt = Date.now();

  saveData();
  addLog(`Encerrou ticket "${ticket.title}"`);
  showNotification(`Ticket #${ticket.id} encerrado.`, 'success');
}

function reopenTicket(ticketId) {
  const ticket = tickets.find((item) => item.id === ticketId);
  if (!ticket || ticket.status !== 'closed') {
    showNotification('Apenas tickets encerrados podem ser reabertos.', 'warning');
    return;
  }

  if (!(session.role === 'admin' || session.role === 'superadmin')) {
    showNotification('Somente admin pode reabrir ticket.', 'error');
    return;
  }

  ticket.status = ticket.assignedAdmin ? 'active' : 'pending';
  ticket.updatedAt = Date.now();

  saveData();
  addLog(`Reabriu ticket "${ticket.title}"`);
  showNotification(`Ticket #${ticket.id} reaberto.`, 'success');
}

function renderUsersManagement() {
  if (!session || session.role !== 'superadmin') {
    renderAccessDenied('Apenas superadmin pode gerenciar usuarios.');
    return;
  }

  const roleDefinitions = getRoleDefinitions();
  const customRoleDefinitions = roleDefinitions.filter((roleDef) => !roleDef.locked);
  const roleOptionsForCreate = roleDefinitions
    .map((roleDef) => `<option value="${escapeHtml(roleDef.key)}">${escapeHtml(roleDef.label)}</option>`)
    .join('');
  const sortedUsers = users.slice().sort((a, b) => a.username.localeCompare(b.username));
  const customRolesRowsHtml = customRoleDefinitions.length > 0
    ? customRoleDefinitions
        .map((roleDef) => `
          <tr>
            <td>${escapeHtml(roleDef.key)}</td>
            <td>${escapeHtml(roleDef.label)}</td>
            <td>${roleDef.aboveMember ? 'Acima de membro' : 'Nivel membro'}</td>
            <td><button class="btn-danger" data-action="delete-role" data-role="${escapeHtml(roleDef.key)}">Excluir cargo</button></td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="4" class="empty-state">Sem cargos personalizados.</td></tr>';

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Gestao de usuarios</h2>
          <p class="panel-subtitle">Crie usuarios, ajuste cargos, limite de chat privado e saude da carteira. Somente master altera status critico.</p>
        </div>
      </div>

      <form id="user-form" class="form-grid">
        <div>
          <label for="new-username">Usuario</label>
          <input id="new-username" type="text" maxlength="30" required placeholder="novo.usuario" />
        </div>
        <div>
          <label>Senha inicial</label>
          <input type="text" value="${DEFAULT_PASSWORD}" disabled />
        </div>
        <div>
          <label for="new-role">Papel</label>
          <select id="new-role">
            ${roleOptionsForCreate}
          </select>
        </div>
        <div class="inline-actions" style="align-items:end;">
          <button class="btn-primary" type="submit">Adicionar usuario</button>
        </div>
      </form>

      <form id="role-form" class="form-grid" style="margin-top: 12px;">
        <div>
          <label for="new-role-key">Novo cargo (codigo)</label>
          <input id="new-role-key" type="text" maxlength="24" placeholder="ex: coordenador" />
        </div>
        <div>
          <label for="new-role-label">Nome exibido</label>
          <input id="new-role-label" type="text" maxlength="40" placeholder="Ex: Coordenador" />
        </div>
        <div>
          <label for="new-role-level">Nivel do cargo</label>
          <select id="new-role-level">
            <option value="above">Acima de membro</option>
            <option value="member">Nivel de membro</option>
          </select>
        </div>
        <div class="inline-actions" style="align-items:end;">
          <button class="btn-secondary" type="submit">Criar cargo</button>
        </div>
      </form>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3 class="panel-title">Cargos personalizados</h3>
          <p class="panel-subtitle">Cargos personalizados podem ser usados no login e na atribuicao de usuarios.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nome</th>
              <th>Nivel</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody id="custom-roles-rows">${customRolesRowsHtml}</tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Papel</th>
              <th>Status</th>
              <th>Chat/dia</th>
              <th>Uso hoje</th>
              <th>Saude carteira</th>
              <th>Carteira</th>
              <th>Grafico carteira</th>
              <th>Divida</th>
              <th>Lucro</th>
              <th>Total pago</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody id="users-rows"></tbody>
        </table>
      </div>
    </section>
  `;

  const form = document.getElementById('user-form');
  const roleForm = document.getElementById('role-form');
  const customRolesRows = document.getElementById('custom-roles-rows');
  const rows = document.getElementById('users-rows');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('new-username');
    const roleInput = document.getElementById('new-role');

    const username = usernameInput.value.trim();
    const password = DEFAULT_PASSWORD;
    const role = normalizeRoleKey(roleInput.value);

    if (username.length < 3) {
      showNotification('Usuario precisa ter ao menos 3 caracteres.', 'warning');
      return;
    }
    if (!isKnownRole(role)) {
      showNotification('Cargo invalido para novo usuario.', 'warning');
      return;
    }

    const exists = users.some((user) => user.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      showNotification('Usuario ja existe.', 'error');
      return;
    }

    try {
      const result = await createUserOnServer(username, role, password);
      if (result && result.user) {
        users.push(normalizeUser(result.user));
      }
      showNotification('Usuario criado com sucesso.', 'success');
      form.reset();
      renderUsersManagement();
    } catch (error) {
      showNotification(error && error.message ? error.message : 'Falha ao criar usuario.', 'error');
    }
  });

  roleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const keyInput = document.getElementById('new-role-key');
    const labelInput = document.getElementById('new-role-label');
    const levelInput = document.getElementById('new-role-level');
    const key = normalizeRoleKey(keyInput.value);
    const label = String(labelInput.value || '').trim();
    const aboveMember = levelInput.value !== 'member';

    if (key.length < 3) {
      showNotification('Codigo do cargo precisa ter ao menos 3 caracteres validos.', 'warning');
      return;
    }
    if (isKnownRole(key)) {
      showNotification('Esse cargo ja existe.', 'error');
      return;
    }

    settings.customRoles = normalizeCustomRoles([
      ...(Array.isArray(settings.customRoles) ? settings.customRoles : []),
      { key, label: label || key, aboveMember }
    ]);
    saveData();
    addLog(`Criou cargo personalizado ${key} (${aboveMember ? 'acima de membro' : 'nivel membro'})`);
    showNotification('Cargo criado com sucesso.', 'success');
    roleForm.reset();
    renderUsersManagement();
  });

  customRolesRows.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="delete-role"][data-role]');
    if (!button) return;
    const roleKey = normalizeRoleKey(button.dataset.role);
    if (!roleKey) return;
    const inUse = users.some((user) => normalizeRoleKey(user.role) === roleKey);
    if (inUse) {
      showNotification('Esse cargo esta em uso. Troque os usuarios antes de excluir.', 'warning');
      return;
    }
    if (!confirm(`Excluir cargo "${roleKey}"?`)) return;
    settings.customRoles = normalizeCustomRoles(
      (Array.isArray(settings.customRoles) ? settings.customRoles : [])
        .filter((roleDef) => normalizeRoleKey(roleDef.key) !== roleKey)
    );
    saveData();
    addLog(`Excluiu cargo personalizado ${roleKey}`);
    showNotification('Cargo excluido.', 'success');
    renderUsersManagement();
  });

  rows.innerHTML = sortedUsers.map((user) => {
    const isSelf = user.username === session.username;
    const roleSelectOptions = roleDefinitions
      .map((roleDef) => `<option value="${escapeHtml(roleDef.key)}" ${user.role === roleDef.key ? 'selected' : ''}>${escapeHtml(roleDef.label)}</option>`)
      .join('');
    const roleSelect = `
      <select data-field="role" data-user="${escapeHtml(user.username)}" ${isSelf ? 'disabled' : ''}>
        ${roleSelectOptions}
      </select>
    `;
    const chartStatus = canRoleReceiveWalletChart(user.role)
      ? (user.walletChartEnabled ? 'Ativo' : 'Desligado')
      : '-';
    const walletAccessStatus = canRoleReceiveWalletAccess(user.role)
      ? (canUserParticipateInWallet(user) ? 'Ativo' : 'Desligado')
      : '-';
    const chatLimit = getUserPrivateChatDailyLimit(user);
    const usageToday = getUserPrivateChatUsageToday(user);
    const walletHealth = walletHealthLabel(user.walletHealth);
    const canToggleChart = isEsther() && canRoleReceiveWalletChart(user.role);
    const canToggleWalletAccess = isEsther() && normalizeRoleKey(user.role) === 'admin';

    return `
      <tr>
        <td>
          <div class="user-identity">
            ${renderUserAvatar(user, { size: 'xs' })}
            <div class="user-identity-copy">
              <strong>${escapeHtml(getUserDisplayName(user))}</strong>
              <small>@${escapeHtml(user.username)}</small>
            </div>
          </div>
        </td>
        <td>${roleSelect}</td>
        <td>${escapeHtml(user.status)}</td>
        <td>${escapeHtml(formatPrivateChatLimit(chatLimit))}</td>
        <td>${Number.isFinite(chatLimit) ? `${usageToday}/${chatLimit}` : '-'}</td>
        <td>${escapeHtml(walletHealth)}</td>
        <td>${escapeHtml(walletAccessStatus)}</td>
        <td>${escapeHtml(chartStatus)}</td>
        <td class="debt-amount">${formatCurrency(user.debt)}</td>
        <td>${formatCurrency(user.walletProfit)}</td>
        <td>${formatCurrency(user.totalPaid)}</td>
        <td>
          <div class="inline-actions">
            <button class="btn-secondary" data-action="save-role" data-user="${escapeHtml(user.username)}" ${isSelf ? 'disabled' : ''}>Salvar papel</button>
            <button class="btn-ghost" data-action="set-chat-limit" data-user="${escapeHtml(user.username)}">Limite chat</button>
            <button class="btn-ghost" data-action="set-wallet-health" data-user="${escapeHtml(user.username)}">Saude</button>
            <button class="btn-ghost" data-action="toggle-wallet-access" data-user="${escapeHtml(user.username)}" ${canToggleWalletAccess ? '' : 'disabled'}>Carteira</button>
            <button class="btn-ghost" data-action="toggle-wallet-chart" data-user="${escapeHtml(user.username)}" ${canToggleChart ? '' : 'disabled'}>Grafico</button>
            <button class="btn-ghost" data-action="toggle-status" data-user="${escapeHtml(user.username)}" ${isSelf ? 'disabled' : ''}>${user.status === 'active' ? 'Bloquear' : 'Desbloquear'}</button>
            <button class="btn-primary" data-action="charge" data-user="${escapeHtml(user.username)}">Cobrar</button>
            <button class="btn-secondary" data-action="payment" data-user="${escapeHtml(user.username)}">Registrar pgto</button>
            <button class="btn-ghost" data-action="clear-debt" data-user="${escapeHtml(user.username)}">Zerar divida</button>
            <button class="btn-ghost" data-action="reset-chart-value" data-user="${escapeHtml(user.username)}">Zerar grafico</button>
            <button class="btn-secondary" data-action="reset-pass" data-user="${escapeHtml(user.username)}" ${isEsther() ? '' : 'disabled'}>Nova senha</button>
            <button class="btn-danger" data-action="delete" data-user="${escapeHtml(user.username)}" ${isSelf ? 'disabled' : ''}>Excluir</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  rows.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const username = button.dataset.user;
    const user = users.find((item) => item.username === username);
    if (!user) return;

    if (action === 'save-role') {
      const roleSelect = rows.querySelector(`select[data-field="role"][data-user="${username}"]`);
      if (!roleSelect) return;
      const newRole = normalizeRoleKey(roleSelect.value);

      if (user.role === 'superadmin' && newRole !== 'superadmin') {
        const superadmins = users.filter((item) => item.role === 'superadmin').length;
        if (superadmins <= 1) {
          showNotification('Mantenha pelo menos um superadmin ativo.', 'warning');
          roleSelect.value = 'superadmin';
          return;
        }
      }

      if (!isKnownRole(newRole)) {
        showNotification('Cargo invalido.', 'warning');
        return;
      }
      const previousRole = normalizeRoleKey(user.role) || 'member';
      user.role = newRole;
      user.roleUpdatedAt = Date.now();
      if (newRole === 'member') {
        if (user.walletAccessEnabled !== true) {
          user.walletAccessUpdatedAt = Date.now();
        }
        user.walletAccessEnabled = true;
      } else if (newRole === 'admin') {
        if (previousRole !== 'admin' || typeof user.walletAccessEnabled !== 'boolean') {
          if (user.walletAccessEnabled !== false) {
            user.walletAccessUpdatedAt = Date.now();
          }
          user.walletAccessEnabled = false;
        }
      } else {
        if (user.walletAccessEnabled !== false) {
          user.walletAccessUpdatedAt = Date.now();
        }
        user.walletAccessEnabled = false;
      }
      const roleCanReceiveChart = canRoleReceiveWalletChart(newRole);
      if (!roleCanReceiveChart) {
        if (user.walletChartEnabled !== false) {
          user.walletChartUpdatedAt = Date.now();
        }
        user.walletChartEnabled = false;
      } else if (typeof user.walletChartEnabled !== 'boolean') {
        user.walletChartEnabled = newRole === 'member' ? shouldDefaultWalletChartEnabled(user.username) : false;
        user.walletChartUpdatedAt = Date.now();
      }

      if (newRole !== 'member') {
        user.privateChatDailyLimit = null;
        user.privateChatUsage = { date: '', used: 0 };
      } else if (
        typeof user.privateChatDailyLimit !== 'number'
        || !Number.isFinite(user.privateChatDailyLimit)
        || user.privateChatDailyLimit < 0
      ) {
        user.privateChatDailyLimit = Math.max(0, Number(settings.memberPrivateChatDailyLimit) || DEFAULT_MEMBER_PRIVATE_CHAT_LIMIT);
      }
      saveData();
      addLog(`Alterou papel de ${user.username} para ${newRole}`);
      showNotification('Papel atualizado.', 'success');
      renderUsersManagement();
      return;
    }

    if (action === 'set-chat-limit') {
      if (isRoleAboveMember(user.role)) {
        showNotification('Cargos acima de membro possuem chat privado infinito.', 'warning');
        return;
      }
      const currentLimit = getUserPrivateChatDailyLimit(user);
      const rawLimit = prompt(`Limite diario de chat privado para ${user.username} (numero inteiro >= 0):`, String(currentLimit));
      if (rawLimit === null) return;
      const trimmed = rawLimit.trim();
      if (!trimmed) {
        user.privateChatDailyLimit = Math.max(0, Number(settings.memberPrivateChatDailyLimit) || DEFAULT_MEMBER_PRIVATE_CHAT_LIMIT);
      } else {
        const parsed = Number(trimmed);
        if (!Number.isFinite(parsed) || parsed < 0) {
          showNotification('Limite invalido.', 'warning');
          return;
        }
        user.privateChatDailyLimit = Math.min(999, Math.floor(parsed));
      }
      user.privateChatLimitUpdatedAt = Date.now();
      saveData();
      addLog(`Definiu limite de chat privado de ${user.username} para ${user.privateChatDailyLimit}`);
      showNotification('Limite de chat atualizado.', 'success');
      renderUsersManagement();
      return;
    }

    if (action === 'set-wallet-health') {
      const rawHealth = prompt(`Saude da carteira de ${user.username} (boa, ruim, critica, liquidada):`, normalizeWalletHealth(user.walletHealth));
      if (rawHealth === null) return;
      const key = String(rawHealth || '').trim().toLowerCase();
      if (!WALLET_HEALTH_VALUES.includes(key)) {
        showNotification('Saude invalida. Use: boa, ruim, critica ou liquidada.', 'warning');
        return;
      }
      user.walletHealth = key;
      user.walletHealthUpdatedAt = Date.now();
      saveData();
      addLog(`Definiu saude da carteira de ${user.username} para ${key}`);
      showNotification('Saude da carteira atualizada.', 'success');
      renderUsersManagement();
      return;
    }

    if (action === 'toggle-wallet-access') {
      if (!isEsther()) {
        showNotification('Somente Esther pode liberar carteira para admins.', 'error');
        return;
      }
      if (normalizeRoleKey(user.role) !== 'admin') {
        showNotification('Liberacao de carteira manual vale apenas para admin.', 'warning');
        return;
      }
      user.walletAccessEnabled = !user.walletAccessEnabled;
      user.walletAccessUpdatedAt = Date.now();
      saveData();
      addLog(`Esther ${user.walletAccessEnabled ? 'liberou' : 'removeu'} carteira para ${user.username}`);
      showNotification(
        `Carteira de ${user.username} ${user.walletAccessEnabled ? 'liberada' : 'desativada'}.`,
        'success'
      );
      renderUsersManagement();
      return;
    }

    if (action === 'toggle-wallet-chart') {
      if (!isEsther()) {
        showNotification('Somente Esther pode escolher quem tem grafico.', 'error');
        return;
      }
      if (!canRoleReceiveWalletChart(user.role)) {
        showNotification('Apenas membros e admins podem ter grafico.', 'warning');
        return;
      }
      user.walletChartEnabled = !user.walletChartEnabled;
      user.walletChartUpdatedAt = Date.now();
      saveData();
      addLog(`Esther ${user.walletChartEnabled ? 'ativou' : 'desativou'} grafico de carteira para ${user.username}`);
      showNotification(`Grafico de ${user.username} ${user.walletChartEnabled ? 'ativado' : 'desativado'}.`, 'success');
      renderUsersManagement();
      return;
    }

    if (action === 'toggle-status') {
      user.status = user.status === 'active' ? 'blocked' : 'active';
      user.statusUpdatedAt = Date.now();
      saveData();
      addLog(`${user.status === 'active' ? 'Desbloqueou' : 'Bloqueou'} usuario ${user.username}`);
      showNotification(`Usuario ${user.status === 'active' ? 'desbloqueado' : 'bloqueado'}.`, 'success');
      renderUsersManagement();
      return;
    }

    if (action === 'charge') {
      const raw = prompt(`Valor da cobranca para ${user.username}:`, '50.00');
      if (!raw) return;
      const amount = toPositiveAmount(raw);
      if (!amount) {
        showNotification('Valor invalido.', 'warning');
        return;
      }
      const timestampPrompt = promptFinanceTimestamp(`Data/hora da cobranca para ${user.username}`);
      if (timestampPrompt.cancelled) return;
      if (timestampPrompt.invalid) {
        showNotification('Data/hora invalida.', 'warning');
        return;
      }
      const result = registerFinanceEvent(user, 'charge', amount, 'Cobranca manual', null, { timestamp: timestampPrompt.timestamp });
      if (!result.ok) {
        showNotification(result.message, 'warning');
        return;
      }
      addLog(`Cobranca de ${formatCurrency(amount)} para ${user.username} em ${formatDateTime(result.timestamp)}`);
      showNotification('Cobranca registrada.', 'success');
      renderUsersManagement();
      return;
    }

    if (action === 'payment') {
      const raw = prompt(`Valor do pagamento para ${user.username}:`, '20.00');
      if (!raw) return;
      const amount = toPositiveAmount(raw);
      if (!amount) {
        showNotification('Valor invalido.', 'warning');
        return;
      }
      const timestampPrompt = promptFinanceTimestamp(`Data/hora do pagamento para ${user.username}`);
      if (timestampPrompt.cancelled) return;
      if (timestampPrompt.invalid) {
        showNotification('Data/hora invalida.', 'warning');
        return;
      }

      const result = registerFinanceEvent(user, 'payment', amount, 'Pagamento registrado pelo superadmin', null, { timestamp: timestampPrompt.timestamp });
      if (!result.ok) {
        showNotification(result.message, 'warning');
        return;
      }
      addLog(`Pagamento de ${formatCurrency(result.amount)} aplicado para ${user.username} em ${formatDateTime(result.timestamp)} (lucro ${formatCurrency(result.profitAdded || 0)})`);
      const profitText = result.profitAdded > 0 ? ` | lucro ${formatCurrency(result.profitAdded)}` : '';
      showNotification(`Pagamento aplicado: ${formatCurrency(result.amount)}${profitText}.`, 'success');
      renderUsersManagement();
      return;
    }

    if (action === 'clear-debt') {
      if (user.debt <= 0) {
        showNotification('Este usuario ja esta sem divida.', 'warning');
        return;
      }
      const timestampPrompt = promptFinanceTimestamp(`Data/hora da quitacao para ${user.username}`);
      if (timestampPrompt.cancelled) return;
      if (timestampPrompt.invalid) {
        showNotification('Data/hora invalida.', 'warning');
        return;
      }
      const result = registerFinanceEvent(user, 'payment', user.debt, 'Quitacao total manual', null, { timestamp: timestampPrompt.timestamp });
      if (!result.ok) {
        showNotification(result.message, 'warning');
        return;
      }
      addLog(`Zerou divida de ${user.username}`);
      showNotification('Divida quitada com sucesso.', 'success');
      renderUsersManagement();
      return;
    }

    if (action === 'reset-chart-value') {
      if (!confirm(`Zerar valores de grafico da carteira de ${user.username}?`)) return;
      user.financeHistory = [];
      user.totalPaid = 0;
      user.walletProfit = 0;
      user.totalCharged = Math.max(0, user.debt);
      user.emergencyLoanOutstanding = 0;
      user.financeUpdatedAt = Date.now();
      saveData();
      addLog(`Zerou valores de grafico da carteira de ${user.username}`);
      showNotification('Valores do grafico zerados.', 'success');
      renderUsersManagement();
      return;
    }

    if (action === 'reset-pass') {
      if (!isEsther()) {
        showNotification('Somente Esther pode alterar senhas de usuarios.', 'error');
        return;
      }
      const nextPassword = prompt(`Nova senha para ${user.username}:`);
      if (!nextPassword) return;
      if (nextPassword.trim().length < 3) {
        showNotification('Senha muito curta.', 'warning');
        return;
      }
      resetUserPasswordOnServer(user.username, nextPassword.trim())
        .then(() => {
          user.passwordUpdatedAt = Date.now();
          showNotification('Senha atualizada.', 'success');
        })
        .catch((error) => {
          showNotification(error && error.message ? error.message : 'Falha ao atualizar senha.', 'error');
        });
      return;
    }

    if (action === 'delete') {
      if (!confirm(`Excluir usuario ${user.username}? Esta acao nao pode ser desfeita.`)) return;

      users = users.filter((item) => item.username !== user.username);
      tickets.forEach((ticket) => {
        if (ticket.assignedAdmin === user.username) {
          ticket.assignedAdmin = null;
          if (ticket.status === 'active') ticket.status = 'pending';
          ticket.updatedAt = Date.now();
        }
      });

      saveData();
      addLog(`Excluiu usuario ${user.username}`);
      showNotification('Usuario excluido.', 'success');
      renderUsersManagement();
    }
  });
}
function renderLogs() {
  if (!canViewLogs()) {
    renderAccessDenied('Apenas cargos acima de membro podem acessar os registros.');
    return;
  }

  const now = Date.now();
  const onlineUsers = getOnlinePresenceList();
  const onlineMap = new Map(onlineUsers.map((entry) => [usernameKey(entry.username), entry]));
  const accessRows = users
    .slice()
    .sort((a, b) => (Number(b.lastLoginAt) || 0) - (Number(a.lastLoginAt) || 0))
    .map((user) => {
      const online = onlineMap.get(usernameKey(user.username));
      const loginAt = Number(user.lastLoginAt) || 0;
      const logoutAt = Number(user.lastLogoutAt) || 0;
      const lastSessionMs = logoutAt > loginAt ? Math.max(0, logoutAt - loginAt) : 0;
      const currentSessionMs = online
        ? Math.max(0, now - (Number(online.loginAt) || Number(online.lastSeen) || now))
        : 0;
      const sessionDurationLabel = online
        ? `${formatDuration(currentSessionMs)} (online agora)`
        : (lastSessionMs > 0 ? `${formatDuration(lastSessionMs)} (ultima sessao)` : '-');
      return `
        <tr>
          <td>${renderUserIdentity(user, { size: 'xs', showRole: false })}</td>
          <td>${escapeHtml(roleLabel(user.role))}</td>
          <td>${online ? 'Online' : 'Offline'}</td>
          <td>${Math.max(0, Number(user.accessCount) || 0)}</td>
          <td>${formatDateTime(loginAt)}</td>
          <td>${formatDateTime(logoutAt)}</td>
          <td>${escapeHtml(sessionDurationLabel)}</td>
        </tr>
      `;
    })
    .join('');
  const onlineRows = onlineUsers.length > 0
    ? onlineUsers
        .map((entry) => `
          <tr>
            <td>${renderUserIdentity(entry.username, { size: 'xs', showRole: false })}</td>
            <td>${escapeHtml(roleLabel(entry.role))}</td>
            <td>${escapeHtml(PAGE_TITLES[entry.page] || entry.page)}</td>
            <td>${formatDateTime(entry.loginAt)}</td>
            <td>${formatDuration(Math.max(0, now - entry.loginAt))}</td>
            <td>${formatDateTime(entry.lastSeen)}</td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="6" class="empty-state">Nenhum usuario online no momento.</td></tr>';

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Registros do sistema</h2>
          <p class="panel-subtitle">Auditoria completa para Superadmin e Inteligencia TP: entrada, permanencia e acoes.</p>
        </div>
        <div class="inline-actions">
          <button id="logs-refresh" class="btn-ghost">Atualizar</button>
          <button id="logs-export" class="btn-secondary">Exportar CSV</button>
          <button id="logs-clear" class="btn-danger">Limpar logs</button>
        </div>
      </div>

      <div class="split-grid">
        <div class="panel" style="margin:0;">
          <h3 class="panel-title">Quem esta fazendo o que agora</h3>
          <p class="panel-subtitle">Usuarios ativos e tela em uso no momento.</p>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Papel</th>
                  <th>Tela</th>
                  <th>Entrou em</th>
                  <th>Online ha</th>
                  <th>Ultimo sinal</th>
                </tr>
              </thead>
              <tbody id="logs-online-rows">${onlineRows}</tbody>
            </table>
          </div>
        </div>

        <div class="panel" style="margin:0;">
          <h3 class="panel-title">Filtro de auditoria</h3>
          <p class="panel-subtitle">Busque por usuario ou termo de acao.</p>
          <div class="filters" style="grid-template-columns: 1fr;">
            <input id="logs-search" type="text" placeholder="Buscar por usuario ou acao" />
          </div>
        </div>
      </div>

      <div class="panel" style="margin-top: 12px;">
        <h3 class="panel-title">Historico de acesso por usuario</h3>
        <p class="panel-subtitle">Mostra quem entrou, quantas vezes acessou e quanto tempo permaneceu.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Papel</th>
                <th>Status</th>
                <th>Acessos</th>
                <th>Ultimo login</th>
                <th>Ultima saida</th>
                <th>Tempo online</th>
              </tr>
            </thead>
            <tbody>${accessRows}</tbody>
          </table>
        </div>
      </div>

      <div class="filters" style="grid-template-columns: 1fr;">
        <small class="panel-subtitle">Historico completo de acoes registradas.</small>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Usuario</th>
              <th>Acao</th>
            </tr>
          </thead>
          <tbody id="logs-rows"></tbody>
        </table>
      </div>
    </section>
  `;

  const searchInput = document.getElementById('logs-search');
  const rows = document.getElementById('logs-rows');
  const refreshButton = document.getElementById('logs-refresh');
  const exportButton = document.getElementById('logs-export');
  const clearButton = document.getElementById('logs-clear');

  function getFilteredLogs() {
    const query = searchInput.value.trim().toLowerCase();
    return capLogs(logs.map(normalizeLogEntry))
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((log) => {
        if (!query) return true;
        return log.user.toLowerCase().includes(query) || log.action.toLowerCase().includes(query);
      });
  }

  function drawRows() {
    const filtered = getFilteredLogs();
    if (filtered.length === 0) {
      rows.innerHTML = '<tr><td colspan="3" class="empty-state">Nenhum registro encontrado.</td></tr>';
      return;
    }

    const visible = filtered.slice(0, MAX_LOG_ROWS_RENDER);
    const tableRows = visible.map((log) => `
      <tr>
        <td>${formatDateTime(log.timestamp)}</td>
        <td>${renderUserIdentity(log.user, { size: 'xs', showRole: false })}</td>
        <td>${escapeHtml(log.action)}</td>
      </tr>
    `);
    if (filtered.length > visible.length) {
      tableRows.push(`
        <tr>
          <td colspan="3" class="empty-state">Mostrando os ${visible.length} registros mais recentes de ${filtered.length} resultado(s).</td>
        </tr>
      `);
    }
    rows.innerHTML = tableRows.join('');
  }

  function exportCsv() {
    const filtered = getFilteredLogs();
    if (filtered.length === 0) {
      showNotification('Nao ha logs para exportar.', 'warning');
      return;
    }

    const lines = ['data,usuario,acao'];
    filtered.forEach((log) => {
      const line = [
        `"${formatDateTime(log.timestamp).replace(/"/g, '""')}"`,
        `"${log.user.replace(/"/g, '""')}"`,
        `"${log.action.replace(/"/g, '""')}"`
      ].join(',');
      lines.push(line);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs_tp_portal_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showNotification('CSV exportado.', 'success');
  }

  searchInput.addEventListener('input', drawRows);
  refreshButton.addEventListener('click', () => {
    renderLogs();
  });
  exportButton.addEventListener('click', exportCsv);
  clearButton.addEventListener('click', () => {
    if (!confirm('Deseja realmente limpar todos os logs?')) return;
    logs = [];
    saveData();
    addLog('Limpou todos os logs');
    drawRows();
    showNotification('Logs limpos.', 'success');
  });

  drawRows();
}

function renderEspionage() {
  if (!canAccessEspionage()) {
    renderAccessDenied('Apenas superadmin ou Inteligencia TP podem acessar a aba Espionagem.');
    return;
  }

  const now = Date.now();
  const canAudit = canSeeEspionageMonitoring();
  const canSendLive = canSendEspionageLiveMessage();
  const canQuickStealth = canCreateStealthSession();
  const onlineUsers = getOnlinePresenceList();
  const latestBroadcast = readLiveBroadcast();
  const hasRecentBroadcast = Boolean(
    latestBroadcast
      && latestBroadcast.createdAt > 0
      && now - latestBroadcast.createdAt <= LIVE_BROADCAST_EXPIRE_MS
  );
  const roleDefinitions = getRoleDefinitions();
  const roleValues = roleDefinitions.map((roleDef) => roleDef.key);
  const fallbackLiveRole = roleValues.includes('member') ? 'member' : (roleValues[0] || 'member');
  const latestBroadcastSummary = hasRecentBroadcast
    ? `${toShortText(latestBroadcast.message, 85)} (${latestBroadcast.anonymous ? 'anonima' : `por ${latestBroadcast.sender}`})`
    : 'Nenhuma mensagem ao vivo recente.';
  const liveRoleOptionsHtml = roleDefinitions
    .map((roleDef) => `<option value="${escapeHtml(roleDef.key)}">${escapeHtml(roleDef.label)}</option>`)
    .join('');
  const roleFilterOptionsHtml = roleDefinitions
    .map((roleDef) => `<option value="${escapeHtml(roleDef.key)}">${escapeHtml(roleDef.label)}</option>`)
    .join('');
  const liveUserOptionsHtml = onlineUsers.length > 0
    ? onlineUsers
        .slice()
        .sort((a, b) => a.username.localeCompare(b.username))
        .map((entry) => `<option value="${escapeHtml(entry.username)}">${escapeHtml(entry.username)} (${escapeHtml(roleLabel(entry.role))})</option>`)
        .join('')
    : '<option value="">Nenhum usuario online</option>';

  const livePanelHtml = canSendLive
    ? `
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3 class="panel-title">Broadcast ao vivo para usuarios online</h3>
            <p class="panel-subtitle">Mensagem instantanea com alvo especifico, modo anonimo/nominal e nivel critico.</p>
          </div>
        </div>
        <form id="esp-live-form" class="form-grid">
          <div class="full">
            <label for="esp-live-message">Mensagem</label>
            <input id="esp-live-message" type="text" maxlength="220" placeholder="Digite a mensagem ao vivo..." />
          </div>
          <div>
            <label for="esp-live-mode">Modo</label>
            <select id="esp-live-mode">
              <option value="anonymous">Anonimo (sem nome)</option>
              <option value="named">Com nome aparecendo</option>
            </select>
          </div>
          <div>
            <label for="esp-live-level">Nivel</label>
            <select id="esp-live-level">
              <option value="normal">Normal</option>
              <option value="critical">Critico (destaque)</option>
            </select>
          </div>
          <div>
            <label for="esp-live-target">Alvo</label>
            <select id="esp-live-target">
              <option value="all">Todos online</option>
              <option value="role">Por papel</option>
              <option value="user">Usuario especifico</option>
            </select>
          </div>
          <div id="esp-live-role-wrap">
            <label for="esp-live-role">Papel alvo</label>
            <select id="esp-live-role">${liveRoleOptionsHtml}</select>
          </div>
          <div id="esp-live-user-wrap">
            <label for="esp-live-user">Usuario online</label>
            <select id="esp-live-user">${liveUserOptionsHtml}</select>
          </div>
          <div class="inline-actions" style="align-items:end;">
            <button id="esp-live-send" class="btn-secondary" type="submit">Enviar broadcast</button>
          </div>
        </form>
        <div id="esp-live-preview" class="tool-output"></div>
        <div class="tool-output">
          Online agora: <strong>${onlineUsers.length}</strong> | Ultima: ${escapeHtml(latestBroadcastSummary)}
        </div>
      </section>
    `
    : '';

  if (!canAudit) {
    els.content.innerHTML = `
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Espionagem</h2>
            <p class="panel-subtitle">Monitoramento completo fica restrito para superadmin. Aqui voce envia mensagens ao vivo.</p>
          </div>
          <div class="inline-actions">
            <button id="esp-refresh" class="btn-primary">Atualizar agora</button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">${onlineUsers.length}</div><div class="stat-label">Online agora</div></div>
          <div class="stat-card"><div class="stat-value">${users.length}</div><div class="stat-label">Usuarios totais</div></div>
          <div class="stat-card"><div class="stat-value">${hasRecentBroadcast ? 'Ativa' : 'Sem envio'}</div><div class="stat-label">Mensagem ao vivo</div></div>
          <div class="stat-card"><div class="stat-value">${formatDateTime(hasRecentBroadcast ? latestBroadcast.createdAt : 0)}</div><div class="stat-label">Ultimo disparo</div></div>
        </div>
      </section>

      ${livePanelHtml}
    `;

    const refreshButton = document.getElementById('esp-refresh');
    refreshButton.addEventListener('click', () => {
      renderEspionage();
    });

    const liveForm = document.getElementById('esp-live-form');
    if (liveForm) {
      const liveMessageInput = document.getElementById('esp-live-message');
      if (liveMessageInput) {
        liveMessageInput.value = realtimeDrafts.espionageLiveMessage || '';
        liveMessageInput.addEventListener('input', () => {
          realtimeDrafts.espionageLiveMessage = liveMessageInput.value;
        });
      }
      liveForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!canSendEspionageLiveMessage()) {
          showNotification('Sem permissao para enviar mensagem ao vivo.', 'error');
          return;
        }
        const message = document.getElementById('esp-live-message').value.trim();
        const mode = document.getElementById('esp-live-mode').value;
        const sendAsAnonymous = mode !== 'named';
        const result = emitLiveBroadcast(message, sendAsAnonymous);
        if (!result.ok) {
          showNotification(result.message, 'warning');
          return;
        }
        realtimeDrafts.espionageLiveMessage = '';
        addLog(`Enviou mensagem ao vivo (${sendAsAnonymous ? 'anonima' : 'com nome'}) na espionagem`);
        showNotification(`Mensagem ao vivo enviada para ${onlineUsers.length} usuario(s) online.`, 'success');
        renderEspionage();
      });
    }
    return;
  }

  const onlineMap = new Map(onlineUsers.map((entry) => [usernameKey(entry.username), entry]));
  const sortedUsers = users.slice().sort((a, b) => a.username.localeCompare(b.username));
  const totalAccessCount = sortedUsers.reduce((sum, user) => sum + Math.max(0, Number(user.accessCount) || 0), 0);
  const activeIn24h = sortedUsers.filter((user) => (Number(user.lastLoginAt) || 0) >= now - (24 * 60 * 60 * 1000)).length;
  const offlineCount = sortedUsers.filter((user) => !onlineMap.has(usernameKey(user.username))).length;

  const onlineRows = onlineUsers.length > 0
    ? onlineUsers
        .map((entry) => {
          const user = getUserByUsername(entry.username);
          const since = Math.max(0, now - (entry.loginAt || entry.lastSeen || now));
          const busy = Boolean(getActiveStealthSessionForUser(entry.username));
          const canStealth = canQuickStealth && session && !sameUsername(entry.username, session.username);
          const actionButton = canStealth
            ? `<button class="btn-ghost" data-action="esp-stealth" data-user="${escapeHtml(entry.username)}" ${busy ? 'disabled' : ''}>${busy ? 'Ocupado' : 'Chat stealth'}</button>`
            : '-';
          return `
            <tr data-user="${escapeHtml(entry.username)}" data-role="${escapeHtml(entry.role)}" data-page="${escapeHtml(entry.page)}" data-online="true">
              <td>${escapeHtml(entry.username)}</td>
              <td>${escapeHtml(roleLabel(entry.role))}</td>
              <td>${escapeHtml(PAGE_TITLES[entry.page] || entry.page)}</td>
              <td>${formatDuration(since)}</td>
              <td>${user ? user.accessCount : 0}</td>
              <td>${actionButton}</td>
            </tr>
          `;
        })
        .join('')
    : '<tr><td colspan="6" class="empty-state">Nenhum usuario online agora.</td></tr>';

  const userRows = sortedUsers
    .map((user) => {
      const onlineEntry = onlineMap.get(usernameKey(user.username));
      const isOnline = Boolean(onlineEntry);
      const offlineReference = Number(user.lastLogoutAt) || Number(user.lastLoginAt) || 0;
      const offlineDuration = isOnline
        ? '-'
        : (offlineReference > 0 ? formatDuration(now - offlineReference) : 'sem registro');

      return `
        <tr data-user="${escapeHtml(user.username)}" data-role="${escapeHtml(user.role)}" data-page="${escapeHtml(isOnline ? onlineEntry.page : '')}" data-online="${isOnline ? 'true' : 'false'}">
          <td>${escapeHtml(user.username)}</td>
          <td>${escapeHtml(roleLabel(user.role))}</td>
          <td>${isOnline ? '<span class="badge status-active">Online</span>' : '<span class="badge status-closed">Offline</span>'}</td>
          <td>${Math.max(0, Number(user.accessCount) || 0)}</td>
          <td>${formatDateTime(user.lastLoginAt)}</td>
          <td>${formatDateTime(user.lastLogoutAt)}</td>
          <td>${escapeHtml(offlineDuration)}</td>
        </tr>
      `;
    })
    .join('');
  const rankingRows = sortedUsers
    .slice()
    .sort((a, b) => (Number(b.accessCount) || 0) - (Number(a.accessCount) || 0))
    .slice(0, 12)
    .map((user) => `
      <tr>
        <td>${escapeHtml(user.username)}</td>
        <td>${escapeHtml(roleLabel(user.role))}</td>
        <td>${Math.max(0, Number(user.accessCount) || 0)}</td>
        <td>${onlineMap.has(usernameKey(user.username)) ? '<span class="badge status-active">Online</span>' : '<span class="badge status-closed">Offline</span>'}</td>
      </tr>
    `)
    .join('');
  const recentEspionageLogs = logs.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 28);
  const logRows = recentEspionageLogs.length > 0
    ? recentEspionageLogs
        .map((entry) => `
          <tr>
            <td>${formatDateTime(entry.timestamp)}</td>
            <td>${escapeHtml(entry.user)}</td>
            <td>${escapeHtml(entry.action)}</td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="3" class="empty-state">Sem logs recentes.</td></tr>';

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Espionagem</h2>
          <p class="panel-subtitle">Monitoramento de presenca e frequencia de acesso para administracao suprema.</p>
        </div>
        <div class="inline-actions">
          <button id="esp-refresh" class="btn-primary">Atualizar agora</button>
          <button id="esp-auto-toggle" class="btn-ghost">Auto 5s: OFF</button>
          <button id="esp-export-csv" class="btn-secondary">Exportar CSV</button>
          <button id="esp-clear-stale" class="btn-danger">Limpar stale</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">${onlineUsers.length}</div><div class="stat-label">Online agora</div></div>
        <div class="stat-card"><div class="stat-value">${offlineCount}</div><div class="stat-label">Offline agora</div></div>
        <div class="stat-card"><div class="stat-value">${activeIn24h}</div><div class="stat-label">Ativos em 24h</div></div>
        <div class="stat-card"><div class="stat-value">${totalAccessCount}</div><div class="stat-label">Acessos acumulados</div></div>
      </div>
    </section>

    ${livePanelHtml}

    <section class="panel">
      <h3 class="panel-title">Filtros taticos de espionagem</h3>
      <div class="filters" style="grid-template-columns: 2fr repeat(3, minmax(0, 1fr));">
        <input id="esp-search" type="text" placeholder="Buscar usuario..." />
        <select id="esp-filter-status">
          <option value="all">Status: todos</option>
          <option value="online">Status: online</option>
          <option value="offline">Status: offline</option>
        </select>
        <select id="esp-filter-role">
          <option value="all">Papel: todos</option>
          ${roleFilterOptionsHtml}
        </select>
        <select id="esp-filter-page">
          <option value="all">Tela: todas</option>
          <option value="dashboard">Painel</option>
          <option value="walletControl">Carteiras</option>
          <option value="espionage">Espionagem</option>
          <option value="stealthChat">Chat irrastreavel</option>
          <option value="intelCenter">Central intel</option>
          <option value="logs">Registros</option>
        </select>
      </div>
      <div id="esp-filter-summary" class="tool-output"></div>
    </section>

    <section class="split-grid">
      <div class="panel" style="margin:0;">
        <h3 class="panel-title">Quem esta online e ha quanto tempo</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Papel</th>
                <th>Tela</th>
                <th>Online ha</th>
                <th>Acessos</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody id="esp-online-rows">${onlineRows}</tbody>
          </table>
        </div>
      </div>

      <div class="panel" style="margin:0;">
        <h3 class="panel-title">Mapa completo de acesso</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Papel</th>
                <th>Status</th>
                <th>Acessos</th>
                <th>Ultimo login</th>
                <th>Ultimo logout</th>
                <th>Offline ha</th>
              </tr>
            </thead>
            <tbody id="esp-user-rows">${userRows}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="split-grid">
      <div class="panel" style="margin:0;">
        <h3 class="panel-title">Ranking de atividade</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Papel</th>
                <th>Acessos</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="esp-ranking-rows">${rankingRows || '<tr><td colspan="4" class="empty-state">Sem dados.</td></tr>'}</tbody>
          </table>
        </div>
      </div>

      <div class="panel" style="margin:0;">
        <h3 class="panel-title">Log ao vivo (ultimos eventos)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Usuario</th>
                <th>Acao</th>
              </tr>
            </thead>
            <tbody id="esp-log-rows">${logRows}</tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  const refreshButton = document.getElementById('esp-refresh');
  const autoToggleButton = document.getElementById('esp-auto-toggle');
  const exportButton = document.getElementById('esp-export-csv');
  const clearStaleButton = document.getElementById('esp-clear-stale');
  const searchInput = document.getElementById('esp-search');
  const statusFilter = document.getElementById('esp-filter-status');
  const roleFilter = document.getElementById('esp-filter-role');
  const pageFilter = document.getElementById('esp-filter-page');
  const filterSummary = document.getElementById('esp-filter-summary');
  const userRowsElement = document.getElementById('esp-user-rows');
  const onlineRowsElement = document.getElementById('esp-online-rows');
  const rankingRowsElement = document.getElementById('esp-ranking-rows');

  searchInput.value = espionageViewState.search || '';
  statusFilter.value = ['all', 'online', 'offline'].includes(espionageViewState.status) ? espionageViewState.status : 'all';
  roleFilter.value = ['all', ...roleValues].includes(espionageViewState.role)
    ? espionageViewState.role
    : 'all';
  pageFilter.value = espionageViewState.page || 'all';
  if (!pageFilter.value) pageFilter.value = 'all';

  function syncAutoButton() {
    const enabled = isEspionageAutoRefreshEnabled();
    autoToggleButton.textContent = enabled ? 'Auto 5s: ON' : 'Auto 5s: OFF';
    autoToggleButton.className = enabled ? 'btn-secondary' : 'btn-ghost';
  }

  function matchesUserFilters(user) {
    const query = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const role = roleFilter.value;
    const page = pageFilter.value;
    const onlineEntry = onlineMap.get(usernameKey(user.username));
    const isOnline = Boolean(onlineEntry);
    const pageValue = isOnline ? String(onlineEntry.page || '') : '';

    if (query && !user.username.toLowerCase().includes(query)) return false;
    if (status === 'online' && !isOnline) return false;
    if (status === 'offline' && isOnline) return false;
    if (role !== 'all' && user.role !== role) return false;
    if (page !== 'all' && pageValue !== page) return false;
    return true;
  }

  function drawRankingFiltered() {
    const ranking = sortedUsers
      .filter((user) => matchesUserFilters(user))
      .sort((a, b) => (Number(b.accessCount) || 0) - (Number(a.accessCount) || 0))
      .slice(0, 12);
    rankingRowsElement.innerHTML = ranking.length > 0
      ? ranking
          .map((user) => `
            <tr>
              <td>${escapeHtml(user.username)}</td>
              <td>${escapeHtml(roleLabel(user.role))}</td>
              <td>${Math.max(0, Number(user.accessCount) || 0)}</td>
              <td>${onlineMap.has(usernameKey(user.username)) ? '<span class="badge status-active">Online</span>' : '<span class="badge status-closed">Offline</span>'}</td>
            </tr>
          `)
          .join('')
      : '<tr><td colspan="4" class="empty-state">Sem dados para o filtro atual.</td></tr>';
  }

  function applyFiltersToTables() {
    const userRows = Array.from(userRowsElement.querySelectorAll('tr[data-user]'));
    const onlineRows = Array.from(onlineRowsElement.querySelectorAll('tr[data-user]'));
    let visibleUsers = 0;
    let visibleOnline = 0;

    userRows.forEach((row) => {
      const username = String(row.dataset.user || '');
      const target = getUserByUsername(username);
      const visible = Boolean(target && matchesUserFilters(target));
      row.style.display = visible ? '' : 'none';
      if (visible) {
        visibleUsers += 1;
        if (row.dataset.online === 'true') visibleOnline += 1;
      }
    });

    onlineRows.forEach((row) => {
      const username = String(row.dataset.user || '');
      const target = getUserByUsername(username);
      const visible = Boolean(target && matchesUserFilters(target));
      row.style.display = visible ? '' : 'none';
    });

    drawRankingFiltered();
    filterSummary.innerHTML = `Filtro ativo: <strong>${visibleUsers}</strong> usuario(s) | <strong>${visibleOnline}</strong> online`;
  }

  function updateFilterStateAndApply() {
    espionageViewState.search = searchInput.value;
    espionageViewState.status = statusFilter.value;
    espionageViewState.role = roleFilter.value;
    espionageViewState.page = pageFilter.value;
    applyFiltersToTables();
  }

  function exportFilteredEspionageCsv() {
    const filtered = sortedUsers.filter((user) => matchesUserFilters(user));
    if (filtered.length === 0) {
      showNotification('Nao ha dados no filtro para exportar.', 'warning');
      return;
    }

    const lines = ['usuario,papel,status,tela,acessos,ultimo_login,ultimo_logout'];
    filtered.forEach((user) => {
      const onlineEntry = onlineMap.get(usernameKey(user.username));
      const row = [
        `"${user.username.replace(/"/g, '""')}"`,
        `"${roleLabel(user.role).replace(/"/g, '""')}"`,
        `"${onlineEntry ? 'Online' : 'Offline'}"`,
        `"${(onlineEntry ? (PAGE_TITLES[onlineEntry.page] || onlineEntry.page) : '-').replace(/"/g, '""')}"`,
        `${Math.max(0, Number(user.accessCount) || 0)}`,
        `"${formatDateTime(user.lastLoginAt).replace(/"/g, '""')}"`,
        `"${formatDateTime(user.lastLogoutAt).replace(/"/g, '""')}"`
      ].join(',');
      lines.push(row);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `espionagem_tp_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showNotification('CSV de espionagem exportado.', 'success');
  }

  refreshButton.addEventListener('click', () => {
    renderEspionage();
  });
  autoToggleButton.addEventListener('click', () => {
    if (isEspionageAutoRefreshEnabled()) {
      stopEspionageAutoRefresh();
      showNotification('Auto refresh da espionagem desligado.', 'warning');
    } else {
      startEspionageAutoRefresh();
      showNotification('Auto refresh da espionagem ligado (5s).', 'success');
    }
    syncAutoButton();
  });
  exportButton.addEventListener('click', exportFilteredEspionageCsv);
  clearStaleButton.addEventListener('click', () => {
    const removed = clearStalePresenceEntries();
    if (removed > 0) {
      addLog(`Limpou ${removed} presenca(s) stale na espionagem`);
      showNotification(`${removed} presenca(s) stale removida(s).`, 'success');
      renderEspionage();
    } else {
      showNotification('Nenhuma presenca stale encontrada.', 'warning');
    }
  });

  [searchInput, statusFilter, roleFilter, pageFilter].forEach((element) => {
    const eventName = element.tagName === 'INPUT' ? 'input' : 'change';
    element.addEventListener(eventName, updateFilterStateAndApply);
  });

  onlineRowsElement.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="esp-stealth"]');
    if (!button) return;
    const targetUsername = String(button.dataset.user || '').trim();
    if (!targetUsername) return;
    const result = createStealthSessionWithUser(targetUsername);
    if (!result.ok) {
      showNotification(result.message, 'warning');
      return;
    }
    addLog(`Abriu chat irrastreavel rapido com ${result.target} pela espionagem`);
    showNotification(`Chat irrastreavel aberto com ${result.target}.`, 'success');
    navigate('stealthChat');
  });

  const liveForm = document.getElementById('esp-live-form');
  if (liveForm) {
    const liveMessageInput = document.getElementById('esp-live-message');
    const targetSelect = document.getElementById('esp-live-target');
    const roleWrap = document.getElementById('esp-live-role-wrap');
    const userWrap = document.getElementById('esp-live-user-wrap');
    const roleSelect = document.getElementById('esp-live-role');
    const userSelect = document.getElementById('esp-live-user');
    const previewOutput = document.getElementById('esp-live-preview');

    if (liveMessageInput) {
      liveMessageInput.value = realtimeDrafts.espionageLiveMessage || '';
      liveMessageInput.addEventListener('input', () => {
        realtimeDrafts.espionageLiveMessage = liveMessageInput.value;
      });
    }
    targetSelect.value = ['all', 'role', 'user'].includes(espionageViewState.liveTarget) ? espionageViewState.liveTarget : 'all';
    if (roleSelect) roleSelect.value = roleValues.includes(espionageViewState.liveRole) ? espionageViewState.liveRole : fallbackLiveRole;
    if (userSelect && espionageViewState.liveUser) userSelect.value = espionageViewState.liveUser;

    function refreshLivePreview() {
      const audience = normalizeBroadcastAudience({
        type: targetSelect.value,
        role: roleSelect ? roleSelect.value : 'member',
        user: userSelect ? userSelect.value : ''
      });
      const recipients = resolveBroadcastRecipients(audience);
      if (roleWrap) roleWrap.style.display = audience.type === 'role' ? '' : 'none';
      if (userWrap) userWrap.style.display = audience.type === 'user' ? '' : 'none';
      previewOutput.innerHTML = `Alvo: <strong>${escapeHtml(getBroadcastAudienceLabel(audience))}</strong> | Receberao agora: <strong>${recipients.length}</strong>`;
      espionageViewState.liveTarget = audience.type;
      espionageViewState.liveRole = audience.role;
      espionageViewState.liveUser = audience.user;
    }

    [targetSelect, roleSelect, userSelect].forEach((element) => {
      if (!element) return;
      element.addEventListener('change', refreshLivePreview);
    });

    liveForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!canSendEspionageLiveMessage()) {
        showNotification('Sem permissao para enviar mensagem ao vivo.', 'error');
        return;
      }
      const message = document.getElementById('esp-live-message').value.trim();
      const sendAsAnonymous = document.getElementById('esp-live-mode').value !== 'named';
      const level = document.getElementById('esp-live-level').value === 'critical' ? 'critical' : 'normal';
      const result = emitLiveBroadcast(message, {
        anonymous: sendAsAnonymous,
        level,
        audienceType: targetSelect.value,
        audienceRole: roleSelect ? roleSelect.value : fallbackLiveRole,
        audienceUser: userSelect ? userSelect.value : ''
      });
      if (!result.ok) {
        showNotification(result.message, 'warning');
        return;
      }
      realtimeDrafts.espionageLiveMessage = '';
      addLog(
        `Enviou broadcast ${level === 'critical' ? 'critico' : 'normal'} ` +
        `(${sendAsAnonymous ? 'anonimo' : 'nominal'}) para ${result.audienceLabel} (${result.recipientCount} online)`
      );
      showNotification(`Broadcast enviado para ${result.recipientCount} usuario(s) online.`, 'success');
      renderEspionage();
    });

    refreshLivePreview();
  }

  syncAutoButton();
  applyFiltersToTables();
}

function canCreateStealthSession() {
  if (!session) return false;
  const me = getCurrentUser();
  if (!me) return false;
  return me.status === 'active';
}

function normalizeStealthSession(rawSession) {
  const participants = Array.isArray(rawSession.participants)
    ? rawSession.participants.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  return {
    id: Number(rawSession.id) || createId(),
    createdBy: String(rawSession.createdBy || ''),
    participants: participants.slice(0, 2),
    createdAt: Number(rawSession.createdAt) || Date.now(),
    updatedAt: Number(rawSession.updatedAt) || Date.now(),
    messages: Array.isArray(rawSession.messages)
      ? rawSession.messages
        .map((message) => ({
            id: Number(message.id) || createId(),
            author: String(message.author || 'sistema'),
            content: String(message.content || ''),
            createdAt: Number(message.createdAt) || Date.now(),
            editedAt: message.editedAt ? Number(message.editedAt) : null,
            anonymous: Boolean(message.anonymous)
          }))
          .filter((message) => message.content.trim().length > 0)
      : []
  };
}

function readStealthBus() {
  const payload = safeParse(storageGetItem(STORAGE_KEYS.stealthBus), { sessions: [] });
  const sessions = Array.isArray(payload.sessions) ? payload.sessions.map(normalizeStealthSession) : [];
  return { sessions };
}

function writeStealthBus(bus) {
  const safeBus = {
    sessions: Array.isArray(bus.sessions) ? bus.sessions.map(normalizeStealthSession) : []
  };
  storageSetItem(STORAGE_KEYS.stealthBus, JSON.stringify(safeBus));
  wsDebugLog('stealth_sync send', Array.isArray(safeBus.sessions) ? safeBus.sessions.length : 0);
  sendPresenceSocketMessage({
    type: 'stealth_sync',
    bus: safeBus
  });
}

function getActiveStealthSessionForUser(username) {
  if (!username) return null;
  const bus = readStealthBus();
  return bus.sessions.find((chatSession) => stealthSessionHasParticipant(chatSession, username)) || null;
}

function canUseStealthChat() {
  if (!session) return false;
  return canCreateStealthSession() || Boolean(getActiveStealthSessionForUser(session.username));
}

function getStealthPeer(chatSession, username) {
  if (!chatSession) return '-';
  return chatSession.participants.find((participant) => !sameUsername(participant, username)) || '-';
}

function upsertStealthSession(sessionId, updater) {
  const bus = readStealthBus();
  const index = bus.sessions.findIndex((chatSession) => chatSession.id === sessionId);
  if (index === -1) return null;

  const mutable = normalizeStealthSession(bus.sessions[index]);
  updater(mutable);
  mutable.updatedAt = Date.now();
  bus.sessions[index] = mutable;
  writeStealthBus(bus);
  return mutable;
}

function destroyStealthChat(showToast = true) {
  if (!session) return;
  const activeSession = getActiveStealthSessionForUser(session.username);
  if (!activeSession) return;
  delete stealthDraftBySession[String(activeSession.id)];

  const bus = readStealthBus();
  bus.sessions = bus.sessions.filter((chatSession) => chatSession.id !== activeSession.id);
  writeStealthBus(bus);

  if (showToast) {
    showNotification('Chat irrastreavel apagado.', 'warning');
  }
}

function syncStealthFromStorage() {
  if (!session) return;

  const activeSession = getActiveStealthSessionForUser(session.username);
  const inStealthPage = currentPage === 'stealthChat';

  if (activeSession && !inStealthPage) {
    showNotification(`Chat irrastreavel aberto com ${getStealthPeer(activeSession, session.username)}.`, 'warning');
    navigate('stealthChat');
    return;
  }

  if (!activeSession && inStealthPage && !canCreateStealthSession()) {
    showNotification('Chat irrastreavel encerrado.', 'warning');
    navigate('dashboard');
    return;
  }

  if (inStealthPage) {
    const messagesBox = document.getElementById('stealth-messages');
    const form = document.getElementById('stealth-form');
    const input = document.getElementById('stealth-input');
    const renderedSessionId = form ? Number(form.dataset.sessionId) : 0;

    if (activeSession && messagesBox && input && renderedSessionId === activeSession.id) {
      const hadFocus = document.activeElement === input;
      const selectionStart = typeof input.selectionStart === 'number' ? input.selectionStart : null;
      const selectionEnd = typeof input.selectionEnd === 'number' ? input.selectionEnd : null;
      const draft = input.value;
      stealthDraftBySession[String(activeSession.id)] = draft;
      renderStealthMessagesList(messagesBox, activeSession);
      if (hadFocus) {
        input.focus();
        if (selectionStart !== null && selectionEnd !== null) {
          const maxPos = input.value.length;
          input.setSelectionRange(Math.min(selectionStart, maxPos), Math.min(selectionEnd, maxPos));
        }
      }
      return;
    }
    renderStealthChat();
  } else {
    renderSidebar();
  }
}

function getStealthMessageAuthorLabel(message) {
  return message && message.author ? getUserPublicLabel(message.author) : 'sistema';
}

function canEditStealthMessages() {
  return Boolean(session && isRoleAboveMember(session.role));
}

function renderStealthMessagesList(messagesBox, liveSession) {
  if (!messagesBox) return;
  if (!liveSession) {
    messagesBox.innerHTML = '<div class="empty-state">Chat encerrado.</div>';
    return;
  }

  if (!liveSession.messages.length) {
    messagesBox.innerHTML = '<div class="empty-state">Sem mensagens ainda.</div>';
    return;
  }

  const canModerateMessages = canEditStealthMessages();
  messagesBox.innerHTML = liveSession.messages
    .map((message) => {
      const mine = Boolean(session && sameUsername(message.author, session.username));
      const editedTag = message.editedAt ? ` (editada ${formatDateTime(message.editedAt)})` : '';
      const authorUser = getUserByUsername(message.author);
      const authorRole = authorUser ? roleLabel(authorUser.role) : '';
      const metaRole = authorRole ? ` | ${authorRole}` : '';
      const messageActionsHtml = canModerateMessages
        ? `
          <div class="inline-actions stealth-message-actions">
            <button class="btn-ghost" data-action="edit-stealth" data-msg="${message.id}">Editar</button>
            <button class="btn-danger" data-action="delete-stealth" data-msg="${message.id}">Apagar</button>
          </div>
        `
        : '';
      return `
        <div class="stealth-message ${mine ? 'mine' : ''}">
          <div class="stealth-message-bubble">
            <div class="stealth-message-author">
              ${renderUserAvatar(message.author, { size: 'xs' })}
              <div class="stealth-message-author-copy">
                <strong>${escapeHtml(getStealthMessageAuthorLabel(message))}</strong>
                <small>@${escapeHtml(message.author || 'sistema')}${escapeHtml(metaRole)}</small>
              </div>
            </div>
            <div class="stealth-message-header">
              <small>${formatDateTime(message.createdAt)}${escapeHtml(editedTag)}</small>
            </div>
            <p>${escapeHtml(message.content)}</p>
            ${messageActionsHtml}
          </div>
        </div>
      `;
    })
    .join('');

  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function renderStealthChat() {
  if (!canUseStealthChat()) {
    renderAccessDenied('Apenas usuarios logados podem usar este chat.');
    return;
  }

  const activeSession = session ? getActiveStealthSessionForUser(session.username) : null;

  if (!activeSession) {
    if (!canCreateStealthSession()) {
      renderAccessDenied('Aguardando convite para chat irrastreavel.');
      return;
    }

    const currentUser = getCurrentUser();
    const privateLimit = getUserPrivateChatDailyLimit(currentUser);
    const remainingPrivateChats = getRemainingPrivateChatsToday(currentUser);
    const hasRemainingPrivateChats = !Number.isFinite(privateLimit) || remainingPrivateChats > 0;
    const memberOnlyRule = session.role === 'member';
    const availableTargets = users
      .filter((user) => {
        if (user.status !== 'active' || user.username === session.username) return false;
        if (!isStealthPairAllowed(session.role, user.role)) return false;
        return true;
      })
      .sort((a, b) => a.username.localeCompare(b.username))
      .map((user) => {
        const busy = Boolean(getActiveStealthSessionForUser(user.username));
        return {
          username: user.username,
          label: `${getUserDisplayName(user)} (@${user.username})${busy ? ' - ocupado' : ''}`,
          busy
        };
      });

    els.content.innerHTML = `
      <section class="panel">
        <h2 class="panel-title">Chat irrastreavel</h2>
        <p class="panel-subtitle">
          ${memberOnlyRule
            ? 'Como membro, voce so pode abrir chat com outros membros ativos.'
            : 'Escolha com qual usuario o chat sera criado. Se o usuario estiver logado, a tela abre na hora para ele.'}
        </p>
        <p class="panel-subtitle">
          Limite diario de chat privado: <strong>${Number.isFinite(privateLimit) ? privateLimit : 'Infinito'}</strong>
          ${Number.isFinite(privateLimit) ? ` | Restante hoje: <strong>${remainingPrivateChats}</strong>` : ''}
        </p>
        <p class="panel-subtitle">Sem log de mensagens. Ao sair da sala, o chat e apagado para todos.</p>

        <form id="stealth-create-form" class="form-grid" style="margin-top: 12px;">
          <div class="full">
            <label for="stealth-target">Usuario alvo</label>
            <select id="stealth-target" ${availableTargets.length ? '' : 'disabled'}>
              ${availableTargets
                .map(
                  (target) =>
                    `<option value="${escapeHtml(target.username)}" ${target.busy ? 'disabled' : ''}>${escapeHtml(target.label)}</option>`
                )
                .join('')}
            </select>
          </div>
          <div class="full inline-actions">
            <button class="btn-primary" type="submit" ${availableTargets.some((target) => !target.busy) && hasRemainingPrivateChats ? '' : 'disabled'}>Criar chat agora</button>
          </div>
        </form>
      </section>
    `;

    const createForm = document.getElementById('stealth-create-form');
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const targetSelect = document.getElementById('stealth-target');
      const targetUser = targetSelect.value;

      if (!targetUser) {
        showNotification('Selecione um usuario para abrir o chat.', 'warning');
        return;
      }

      if (getActiveStealthSessionForUser(targetUser)) {
        showNotification('Este usuario ja esta em um chat irrastreavel.', 'warning');
        return;
      }

      const result = createStealthSessionWithUser(targetUser);
      if (!result.ok) {
        showNotification(result.message, 'warning');
        return;
      }
      const remainingLabel = Number.isFinite(result.remaining) ? ` Restante hoje: ${result.remaining}.` : '';
      showNotification(`Chat irrastreavel criado com ${result.target}.${remainingLabel}`, 'success');

      renderSidebar();
      renderStealthChat();
    });
    return;
  }

  const peer = getStealthPeer(activeSession, session.username);
  const me = getCurrentUser();
  const peerUser = getUserByUsername(peer);
  const createdByUser = getUserByUsername(activeSession.createdBy);
  const createdByRole = createdByUser ? createdByUser.role : '';
  const creatorIsCurrent = String(activeSession.createdBy || '').trim().toLowerCase() === String(session.username || '').trim().toLowerCase();
  const roleToValidate = creatorIsCurrent ? (peerUser ? peerUser.role : '') : (me ? me.role : '');
  if (createdByRole && roleToValidate && !isStealthPairAllowed(createdByRole, roleToValidate)) {
    destroyStealthChat(false);
    showNotification('Sessao encerrada: membro nao pode iniciar chat com cargo alto.', 'warning');
    renderSidebar();
    renderStealthChat();
    return;
  }
  const canModerateMessages = canEditStealthMessages();
  const peerLabel = getUserPublicLabel(peerUser || peer);
  const peerAvatar = renderUserAvatar(peerUser || peer, { size: 'sm' });

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Sessao irrastreavel ativa</h2>
          <p class="panel-subtitle">
            <span class="stealth-peer-inline">${peerAvatar}<span>Conectado com ${escapeHtml(peerLabel)} desde ${formatDateTime(activeSession.createdAt)}</span></span>
          </p>
        </div>
        <div class="inline-actions">
          <button id="stealth-close" class="btn-secondary">Sair e apagar</button>
          ${canModerateMessages ? '<button id="stealth-delete-all" class="btn-danger">Apagar mensagens</button>' : ''}
        </div>
      </div>

      <div id="stealth-messages" class="stealth-messages"></div>

      <form id="stealth-form" class="chat-input-area" style="margin-top: 12px;" data-session-id="${activeSession.id}">
        <input id="stealth-input" type="text" maxlength="1200" placeholder="Digite uma mensagem sem rastreio..." />
        <button class="btn-primary" type="submit">Enviar</button>
      </form>
    </section>
  `;

  const messagesBox = document.getElementById('stealth-messages');
  const form = document.getElementById('stealth-form');
  const input = document.getElementById('stealth-input');
  const closeButton = document.getElementById('stealth-close');
  const deleteAllButton = document.getElementById('stealth-delete-all');
  const draftKey = String(activeSession.id);

  input.value = String(stealthDraftBySession[draftKey] || '');
  input.addEventListener('input', () => {
    stealthDraftBySession[draftKey] = input.value;
  });

  function drawStealthMessages() {
    const liveSession = getActiveStealthSessionForUser(session.username);
    renderStealthMessagesList(messagesBox, liveSession);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    upsertStealthSession(activeSession.id, (chatSession) => {
      chatSession.messages.push({
        id: createId(),
        author: session.username,
        content: text,
        createdAt: Date.now(),
        editedAt: null,
        anonymous: false
      });
    });

    input.value = '';
    stealthDraftBySession[draftKey] = '';
    drawStealthMessages();
  });

  messagesBox.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action][data-msg]');
    if (!button) return;

    const messageId = Number(button.dataset.msg);
    const action = button.dataset.action;
    const liveSession = getActiveStealthSessionForUser(session.username);
    if (!liveSession) return;

    const message = liveSession.messages.find((item) => item.id === messageId);
    if (!message) return;
    if (!canModerateMessages) {
      showNotification('Somente admins podem editar/apagar mensagens deste chat.', 'warning');
      return;
    }

    if (action === 'edit-stealth') {
      const updated = prompt('Editar mensagem:', message.content);
      if (updated === null) return;
      const nextContent = updated.trim();
      if (!nextContent) {
        showNotification('Mensagem vazia nao e permitida.', 'warning');
        return;
      }
      upsertStealthSession(liveSession.id, (chatSession) => {
        const mutableMessage = chatSession.messages.find((item) => item.id === messageId);
        if (!mutableMessage) return;
        mutableMessage.content = nextContent;
        mutableMessage.editedAt = Date.now();
      });
      drawStealthMessages();
      return;
    }

    if (action === 'delete-stealth') {
      upsertStealthSession(liveSession.id, (chatSession) => {
        chatSession.messages = chatSession.messages.filter((item) => item.id !== messageId);
      });
      drawStealthMessages();
    }
  });

  closeButton.addEventListener('click', () => {
    destroyStealthChat(true);
    renderSidebar();
    if (canCreateStealthSession()) {
      renderStealthChat();
    } else {
      navigate('dashboard');
    }
  });

  if (deleteAllButton) {
    deleteAllButton.addEventListener('click', () => {
      if (!canModerateMessages) {
        showNotification('Somente admins podem apagar mensagens.', 'warning');
        return;
      }
      if (!confirm('Apagar todas as mensagens desta sessao?')) return;
      upsertStealthSession(activeSession.id, (chatSession) => {
        chatSession.messages = [];
      });
      drawStealthMessages();
    });
  }

  drawStealthMessages();
}

function getStaffChatMessages() {
  settings.staffChatMessages = normalizeStaffChatMessages(settings.staffChatMessages);
  return settings.staffChatMessages;
}

function appendStaffChatMessage(author, content, role = 'member', createdAt = Date.now()) {
  const message = {
    id: createId(),
    author: String(author || 'sistema').trim() || 'sistema',
    role: normalizeRoleKey(role || 'member') || 'member',
    content: String(content || '').trim().slice(0, 1200),
    createdAt: Number(createdAt) || Date.now()
  };
  if (!message.content) return null;
  settings.staffChatMessages = normalizeStaffChatMessages([...(settings.staffChatMessages || []), message]);
  return message;
}

function renderStaffChatMessages(messagesElement, messages) {
  if (!messagesElement) return;
  if (!Array.isArray(messages) || messages.length === 0) {
    messagesElement.innerHTML = '<div class="empty-state">Sem mensagens ainda. Inicie o chat interno da administracao.</div>';
    return;
  }
  messagesElement.innerHTML = messages
    .slice()
    .sort((a, b) => (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0))
    .map((message) => {
      const authorUser = getUserByUsername(message.author);
      const authorRole = authorUser ? authorUser.role : message.role;
      return `
        <div class="stealth-message">
          <div class="stealth-message-bubble">
            <div class="stealth-message-author">
              ${renderUserAvatar(authorUser || message.author, { size: 'xs' })}
              <div class="stealth-message-author-copy">
                <strong>${escapeHtml(getUserPublicLabel(authorUser || message.author))}</strong>
                <small>@${escapeHtml(message.author)} | ${escapeHtml(roleLabel(authorRole))}</small>
              </div>
            </div>
            <div class="stealth-message-header">
              <small>${formatDateTime(message.createdAt)}</small>
            </div>
            <p>${escapeHtml(message.content)}</p>
          </div>
        </div>
      `;
    })
    .join('');
  messagesElement.scrollTop = messagesElement.scrollHeight;
}

function renderStaffChat() {
  if (!canAccessStaffChat()) {
    renderAccessDenied('Apenas cargos acima de membro podem usar o chat interno.');
    return;
  }

  const canClear = Boolean(session && session.role === 'superadmin');
  const messages = getStaffChatMessages();
  const myLimit = getUserPrivateChatDailyLimit(getCurrentUser());

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Chat interno da administracao</h2>
          <p class="panel-subtitle">Canal exclusivo para cargos acima de membro. Mensagens sincronizadas entre as sessoes.</p>
        </div>
        <div class="inline-actions">
          <button id="staff-chat-refresh" class="btn-ghost">Atualizar</button>
          <button id="staff-chat-clear" class="btn-danger" ${canClear ? '' : 'disabled'}>Limpar chat</button>
        </div>
      </div>
      <div class="tool-output">
        Seu papel: <strong>${escapeHtml(roleLabel(session.role))}</strong> |
        Limite stealth diario: <strong>${Number.isFinite(myLimit) ? myLimit : 'Infinito'}</strong>
      </div>
      <div id="staff-chat-messages" class="stealth-messages" style="margin-top: 12px;"></div>
      <form id="staff-chat-form" class="chat-input-area" style="margin-top: 12px;">
        <input id="staff-chat-input" type="text" maxlength="1200" placeholder="Escreva para o time administrativo..." />
        <button class="btn-primary" type="submit">Enviar</button>
      </form>
    </section>
  `;

  const messagesElement = document.getElementById('staff-chat-messages');
  const refreshButton = document.getElementById('staff-chat-refresh');
  const clearButton = document.getElementById('staff-chat-clear');
  const form = document.getElementById('staff-chat-form');
  const input = document.getElementById('staff-chat-input');

  renderStaffChatMessages(messagesElement, messages);

  refreshButton.addEventListener('click', () => {
    renderStaffChat();
  });

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      if (!canClear) {
        showNotification('Somente superadmin pode limpar o chat interno.', 'error');
        return;
      }
      if (!confirm('Limpar todas as mensagens do chat interno?')) return;
      settings.staffChatMessages = [];
      saveData();
      addLog(`${session.username} limpou o chat interno administrativo`);
      renderStaffChat();
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const appended = appendStaffChatMessage(session.username, text, session.role, Date.now());
    if (!appended) return;
    saveData();
    input.value = '';
    renderStaffChatMessages(messagesElement, getStaffChatMessages());
  });
}

function renderSuperTools() {
  if (!session || session.role !== 'superadmin') {
    renderAccessDenied('Apenas superadmin pode usar o comando master.');
    return;
  }

  const totals = {
    users: users.length,
    pending: tickets.filter((ticket) => ticket.status === 'pending').length,
    active: tickets.filter((ticket) => ticket.status === 'active').length,
    closed: tickets.filter((ticket) => ticket.status === 'closed').length,
    debt: users.reduce((sum, user) => sum + (Number(user.debt) || 0), 0)
  };

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Comando Superadmin</h2>
          <p class="panel-subtitle">Ferramentas administrativas de alto impacto.</p>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">${totals.users}</div><div class="stat-label">Usuarios</div></div>
        <div class="stat-card"><div class="stat-value">${totals.pending}</div><div class="stat-label">Pendentes</div></div>
        <div class="stat-card"><div class="stat-value">${totals.active}</div><div class="stat-label">Em andamento</div></div>
        <div class="stat-card"><div class="stat-value debt-amount">${formatCurrency(totals.debt)}</div><div class="stat-label">Divida total</div></div>
      </div>
    </section>

    <section class="panel super-grid">
      <div>
        <h3 class="panel-title">Operacoes em massa</h3>
        <p class="panel-subtitle">Acoes rapidas para organizar o ambiente.</p>
        <div class="inline-actions" style="margin-top: 10px;">
          <button id="st-reassign-pending" class="btn-primary">Distribuir pendentes</button>
          <button id="st-clear-closed" class="btn-secondary">Excluir encerrados</button>
          <button id="st-zero-debts" class="btn-ghost">Zerar dividas</button>
          <button id="st-force-1705" class="btn-secondary">Forcar senhas 1705</button>
        </div>
      </div>

      <div>
        <h3 class="panel-title">Backup e restauracao</h3>
        <p class="panel-subtitle">Exporte tudo para JSON ou importe um backup.</p>
        <div class="inline-actions" style="margin-top: 10px;">
          <button id="st-export-backup" class="btn-primary">Exportar backup</button>
          <input id="st-import-backup" type="file" accept=".json,application/json" />
        </div>
      </div>

      <div>
        <h3 class="panel-title">Modo manutencao</h3>
        <p class="panel-subtitle">Bloqueia login de membros e admins.</p>
        <label><input id="st-maintenance-toggle" type="checkbox" ${settings.maintenanceMode ? 'checked' : ''} /> Ativar manutencao</label>
        <label for="st-maintenance-message">Mensagem</label>
        <input id="st-maintenance-message" type="text" maxlength="180" value="${escapeHtml(settings.maintenanceMessage)}" />
        <div class="inline-actions" style="margin-top: 10px;">
          <button id="st-save-maintenance" class="btn-secondary">Salvar manutencao</button>
        </div>
      </div>

      <div>
        <h3 class="panel-title">Conta Inteligencia TP</h3>
        <p class="panel-subtitle">Reativa e restaura credenciais padrao.</p>
        <div class="inline-actions" style="margin-top: 10px;">
          <button id="st-reset-intel" class="btn-primary">Resetar Inteligencia TP</button>
        </div>
      </div>
    </section>
  `;

  const reassignPendingButton = document.getElementById('st-reassign-pending');
  const clearClosedButton = document.getElementById('st-clear-closed');
  const zeroDebtsButton = document.getElementById('st-zero-debts');
  const exportBackupButton = document.getElementById('st-export-backup');
  const importBackupInput = document.getElementById('st-import-backup');
  const maintenanceToggle = document.getElementById('st-maintenance-toggle');
  const maintenanceMessage = document.getElementById('st-maintenance-message');
  const saveMaintenanceButton = document.getElementById('st-save-maintenance');
  const resetIntelButton = document.getElementById('st-reset-intel');
  const force1705Button = document.getElementById('st-force-1705');

  reassignPendingButton.addEventListener('click', () => {
    const adminPool = users.filter((user) => (user.role === 'admin' || user.role === 'superadmin') && user.status === 'active');
    const pendingTickets = tickets.filter((ticket) => ticket.status === 'pending');

    if (!adminPool.length) {
      showNotification('Nao ha admins ativos para distribuicao.', 'warning');
      return;
    }
    if (!pendingTickets.length) {
      showNotification('Nao ha tickets pendentes para distribuir.', 'warning');
      return;
    }

    pendingTickets.forEach((ticket, index) => {
      const assignee = adminPool[index % adminPool.length];
      ticket.status = 'active';
      ticket.assignedAdmin = assignee.username;
      ticket.updatedAt = Date.now();
    });

    saveData();
    addLog(`Distribuiu ${pendingTickets.length} tickets pendentes entre admins`);
    showNotification('Pendentes distribuidos com sucesso.', 'success');
    renderSuperTools();
    renderSidebar();
  });

  clearClosedButton.addEventListener('click', () => {
    const closedCount = tickets.filter((ticket) => ticket.status === 'closed').length;
    if (!closedCount) {
      showNotification('Nao existem tickets encerrados.', 'warning');
      return;
    }

    if (!confirm(`Excluir ${closedCount} tickets encerrados?`)) return;
    tickets = tickets.filter((ticket) => ticket.status !== 'closed');
    saveData();
    addLog(`Excluiu ${closedCount} tickets encerrados`);
    showNotification('Tickets encerrados removidos.', 'success');
    renderSuperTools();
  });

  zeroDebtsButton.addEventListener('click', () => {
    let affected = 0;
    users.forEach((user) => {
      if (user.debt > 0) {
        const result = registerFinanceEvent(user, 'payment', user.debt, 'Quitacao global superadmin');
        if (result.ok) affected += 1;
      }
    });
    addLog(`Quitou dividas em massa de ${affected} usuarios`);
    showNotification(`Dividas quitadas para ${affected} usuarios.`, 'success');
    renderSuperTools();
  });

  force1705Button.addEventListener('click', async () => {
    const now = Date.now();
    let affected = 0;
    for (const user of users) {
      try {
        await resetUserPasswordOnServer(user.username, DEFAULT_PASSWORD);
        user.passwordUpdatedAt = now;
        affected += 1;
      } catch {
        // ignore individual reset failures and keep going
      }
    }
    settings.passwordSeed1705Done = true;
    saveData();
    showNotification(`Senha 1705 aplicada para ${affected} usuarios.`, 'success');
  });

  exportBackupButton.addEventListener('click', () => {
    const snapshot = {
      exportedAt: Date.now(),
      users,
      tickets,
      logs,
      tasks,
      notes,
      announcements,
      settings
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tp_portal_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    addLog('Exportou backup completo do sistema');
    showNotification('Backup exportado em JSON.', 'success');
  });

  importBackupInput.addEventListener('change', () => {
    const file = importBackupInput.files && importBackupInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || '{}'));
        if (!confirm('Importar backup e sobrescrever dados atuais?')) return;

        settings = normalizeSettings(payload.settings || settings);
        users = Array.isArray(payload.users) ? payload.users.map(normalizeUser) : users;
        ensureCoreUsers();
        tickets = Array.isArray(payload.tickets) ? payload.tickets.map(normalizeTicket) : tickets;
        logs = Array.isArray(payload.logs)
          ? capLogs(payload.logs.map(normalizeLogEntry))
          : logs;
        tasks = Array.isArray(payload.tasks) ? payload.tasks.map(normalizeTask) : tasks;
        notes = Array.isArray(payload.notes) ? payload.notes.map(normalizeNote) : notes;
        announcements = Array.isArray(payload.announcements) ? payload.announcements.map(normalizeAnnouncement) : announcements;

        ensureCoreUsers();
        applyDefaultPasswordMigration();
        saveData();
        addLog('Importou backup completo do sistema');
        showNotification('Backup importado com sucesso.', 'success');
        renderSidebar();
        renderSuperTools();
      } catch {
        showNotification('Falha ao importar backup. JSON invalido.', 'error');
      }
    };
    reader.readAsText(file);
    importBackupInput.value = '';
  });

  saveMaintenanceButton.addEventListener('click', () => {
    settings.maintenanceMode = maintenanceToggle.checked;
    settings.maintenanceMessage = maintenanceMessage.value.trim() || 'Portal temporariamente em manutencao.';
    settings.maintenanceUpdatedAt = Date.now();
    saveData();
    addLog(`Atualizou manutencao: ${settings.maintenanceMode ? 'ativada' : 'desativada'}`);
    showNotification('Configuracao de manutencao salva.', 'success');
  });

  resetIntelButton.addEventListener('click', () => {
    const username = 'inteligencia tp';
    let intelUser = users.find((user) => user.username.toLowerCase() === username);
    if (!intelUser) {
      intelUser = normalizeUser({
        username,
        role: 'inteligencia',
        status: 'active',
        debt: 0
      });
      users.push(intelUser);
    } else {
      intelUser.role = 'inteligencia';
      intelUser.status = 'active';
      intelUser.roleUpdatedAt = Date.now();
      intelUser.statusUpdatedAt = Date.now();
    }

    saveData();
    resetUserPasswordOnServer(username, DEFAULT_PASSWORD)
      .then(() => {
        intelUser.passwordUpdatedAt = Date.now();
        showNotification('Conta Inteligencia TP pronta (login: inteligencia tp / 1705).', 'success');
      })
      .catch((error) => {
        showNotification(error && error.message ? error.message : 'Falha ao resetar a conta Inteligencia TP.', 'error');
      });
  });
}

function renderIntelCenter() {
  if (!session || (session.role !== 'inteligencia' && session.role !== 'superadmin')) {
    renderAccessDenied('Apenas Inteligencia TP ou superadmin podem acessar a central.');
    return;
  }

  const canAudit = canViewLogs();
  const onlineUsers = canAudit ? getOnlinePresenceList() : [];
  const recentLogs = canAudit ? logs.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 18) : [];
  const debtRanking = users
    .slice()
    .sort((a, b) => b.debt - a.debt)
    .slice(0, 8);
  const blockedUsers = users.filter((user) => user.status === 'blocked');

  const onlineRows = onlineUsers.length
    ? onlineUsers
        .map(
          (entry) => `
      <tr>
        <td>${renderUserIdentity(entry.username, { size: 'xs', showRole: false })}</td>
        <td>${escapeHtml(roleLabel(entry.role))}</td>
        <td>${escapeHtml(PAGE_TITLES[entry.page] || entry.page)}</td>
        <td>${formatDateTime(entry.lastSeen)}</td>
      </tr>
    `
        )
        .join('')
    : '<tr><td colspan="4" class="empty-state">Nenhum usuario online no momento.</td></tr>';

  const logsRows = recentLogs.length
    ? recentLogs
        .map(
          (log) => `
      <tr>
        <td>${formatDateTime(log.timestamp)}</td>
        <td>${renderUserIdentity(log.user, { size: 'xs', showRole: false })}</td>
        <td>${escapeHtml(log.action)}</td>
      </tr>
    `
        )
        .join('')
    : '<tr><td colspan="3" class="empty-state">Sem logs recentes.</td></tr>';

  const debtRows = debtRanking
    .map(
      (user) => `
    <tr>
      <td>${renderUserIdentity(user, { size: 'xs', showRole: false })}</td>
      <td>${escapeHtml(roleLabel(user.role))}</td>
      <td>${formatCurrency(user.debt)}</td>
      <td>${formatCurrency(user.totalPaid)}</td>
    </tr>
  `
    )
    .join('');

  const monitorHtml = canAudit
    ? `
      <div class="split-grid">
        <div class="panel" style="margin:0;">
          <h3 class="panel-title">Usuarios online</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>Usuario</th><th>Papel</th><th>Tela atual</th><th>Ultimo sinal</th></tr>
              </thead>
              <tbody>${onlineRows}</tbody>
            </table>
          </div>
        </div>

        <div class="panel" style="margin:0;">
          <h3 class="panel-title">Radar financeiro</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>Usuario</th><th>Papel</th><th>Divida</th><th>Total pago</th></tr>
              </thead>
              <tbody>${debtRows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `
    : `
      <div class="panel" style="margin:0;">
        <h3 class="panel-title">Radar financeiro</h3>
        <p class="panel-subtitle">Visao focada em carteira por usuario. Logs e presenca ficam apenas para admins.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Usuario</th><th>Papel</th><th>Divida</th><th>Total pago</th></tr>
            </thead>
            <tbody>${debtRows}</tbody>
          </table>
        </div>
      </div>
    `;

  const logsSectionHtml = canAudit
    ? `
      <section class="panel">
        <h3 class="panel-title">Log ao vivo (ultimos eventos)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Data</th><th>Usuario</th><th>Acao</th></tr>
            </thead>
            <tbody>${logsRows}</tbody>
          </table>
        </div>
      </section>
    `
    : '';

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Central Inteligencia</h2>
          <p class="panel-subtitle">Operacao financeira, alertas globais e desbloqueio rapido.</p>
        </div>
        <div class="inline-actions">
          <button id="intel-refresh" class="btn-primary">Atualizar agora</button>
        </div>
      </div>

      ${monitorHtml}
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3 class="panel-title">Acoes Inteligencia</h3>
          <p class="panel-subtitle">Comandos rapidos para operacao e motivacao da equipe.</p>
        </div>
      </div>

      <div class="form-grid">
        <div class="full">
          <label for="intel-alert-title">Alerta relampago</label>
          <input id="intel-alert-title" type="text" maxlength="80" placeholder="Ex: Revisao geral em 10 minutos" />
        </div>
        <div class="full">
          <label for="intel-alert-content">Mensagem</label>
          <input id="intel-alert-content" type="text" maxlength="180" placeholder="Mensagem curta para todos os usuarios." />
        </div>
        <div class="full inline-actions">
          <button id="intel-send-alert" class="btn-secondary">Enviar alerta global</button>
        </div>
      </div>

      <div class="form-grid" style="margin-top: 10px;">
        <div>
          <label for="intel-unblock-user">Desbloqueio rapido</label>
          <select id="intel-unblock-user">
            ${
              blockedUsers.length
                ? blockedUsers.map((user) => `<option value="${escapeHtml(user.username)}">${escapeHtml(getUserPublicLabel(user))}</option>`).join('')
                : '<option value="">Sem usuarios bloqueados</option>'
            }
          </select>
        </div>
        <div class="inline-actions" style="align-items: end;">
          <button id="intel-unblock-btn" class="btn-primary" ${blockedUsers.length ? '' : 'disabled'}>Desbloquear usuario</button>
        </div>
      </div>
    </section>
    ${logsSectionHtml}
  `;

  const refreshButton = document.getElementById('intel-refresh');
  const sendAlertButton = document.getElementById('intel-send-alert');
  const unblockButton = document.getElementById('intel-unblock-btn');
  const alertTitleInput = document.getElementById('intel-alert-title');
  const alertContentInput = document.getElementById('intel-alert-content');

  if (alertTitleInput) {
    alertTitleInput.value = realtimeDrafts.intelAlertTitle || '';
    alertTitleInput.addEventListener('input', () => {
      realtimeDrafts.intelAlertTitle = alertTitleInput.value;
    });
  }
  if (alertContentInput) {
    alertContentInput.value = realtimeDrafts.intelAlertContent || '';
    alertContentInput.addEventListener('input', () => {
      realtimeDrafts.intelAlertContent = alertContentInput.value;
    });
  }

  refreshButton.addEventListener('click', () => {
    renderIntelCenter();
  });

  sendAlertButton.addEventListener('click', () => {
    const title = document.getElementById('intel-alert-title').value.trim();
    const content = document.getElementById('intel-alert-content').value.trim();
    if (title.length < 3 || content.length < 3) {
      showNotification('Preencha titulo e mensagem do alerta.', 'warning');
      return;
    }

    announcements.push(
      normalizeAnnouncement({
        id: createId(),
        title,
        content,
        author: session.username,
        audience: 'all',
        createdAt: Date.now()
      })
    );
    saveData();
    addLog(`Enviou alerta global: ${title}`);
    realtimeDrafts.intelAlertTitle = '';
    realtimeDrafts.intelAlertContent = '';
    showNotification('Alerta enviado para todos.', 'success');
    renderIntelCenter();
  });

  if (unblockButton) {
    unblockButton.addEventListener('click', () => {
      const select = document.getElementById('intel-unblock-user');
      const username = select.value;
      if (!username) {
        showNotification('Nenhum usuario selecionado.', 'warning');
        return;
      }
      const target = getUserByUsername(username);
      if (!target) {
        showNotification('Usuario nao encontrado.', 'error');
        return;
      }
      target.status = 'active';
      target.statusUpdatedAt = Date.now();
      saveData();
      addLog(`${session.username} desbloqueou usuario ${target.username} pela central inteligencia`);
      showNotification(`Usuario ${target.username} desbloqueado.`, 'success');
      renderIntelCenter();
    });
  }
}

function renderTasks() {
  const canManagePublicTasks = Boolean(session && isAdminRole(session.role));
  const assignableUsers = users
    .filter((user) => user.status === 'active')
    .slice()
    .sort((a, b) => a.username.localeCompare(b.username));
  const assigneeOptions = assignableUsers
    .map((user) => `<option value="${escapeHtml(user.username)}">${escapeHtml(getUserDisplayName(user))} (@${escapeHtml(user.username)})</option>`)
    .join('');

  const advancedFieldsHtml = canManagePublicTasks
    ? `
      <div>
        <label for="task-visibility">Visibilidade</label>
        <select id="task-visibility">
          <option value="private" selected>Privada (somente criador)</option>
          <option value="public">Publica (time todo visualiza)</option>
        </select>
      </div>
      <div>
        <label for="task-assignee">Responsavel</label>
        <select id="task-assignee">
          <option value="">Sem responsavel</option>
          ${assigneeOptions}
        </select>
      </div>
    `
    : '';

  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Tarefas internas</h2>
          <p class="panel-subtitle">Fluxo em quadro Kanban com tarefas privadas e publicas atribuiveis.</p>
        </div>
      </div>

      <form id="task-form" class="form-grid">
        <div>
          <label for="task-title">Tarefa</label>
          <input id="task-title" type="text" placeholder="Ex: Revisar chamados de acesso" maxlength="120" required />
        </div>
        <div>
          <label for="task-due">Data limite</label>
          <input id="task-due" type="date" />
        </div>
        <div>
          <label for="task-priority">Prioridade</label>
          <select id="task-priority">
            <option value="low">Baixa</option>
            <option value="medium" selected>Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
        ${advancedFieldsHtml}
        <div class="inline-actions" style="align-items:end;">
          <button class="btn-primary" type="submit">Adicionar tarefa</button>
        </div>
      </form>

      <div class="task-board">
        <div class="task-column">
          <h3>A fazer <span class="column-count" id="count-todo">0</span></h3>
          <div id="tasks-todo" class="task-list"></div>
        </div>
        <div class="task-column">
          <h3>Em execucao <span class="column-count" id="count-doing">0</span></h3>
          <div id="tasks-doing" class="task-list"></div>
        </div>
        <div class="task-column">
          <h3>Concluido <span class="column-count" id="count-done">0</span></h3>
          <div id="tasks-done" class="task-list"></div>
        </div>
      </div>
    </section>
  `;

  const form = document.getElementById('task-form');
  const titleInput = document.getElementById('task-title');
  const dueInput = document.getElementById('task-due');
  const priorityInput = document.getElementById('task-priority');
  const visibilityInput = document.getElementById('task-visibility');
  const assigneeInput = document.getElementById('task-assignee');
  const taskBoard = document.querySelector('.task-board');

  function syncAssigneeFieldState() {
    if (!canManagePublicTasks || !visibilityInput || !assigneeInput) return;
    const visibility = normalizeTaskVisibility(visibilityInput.value);
    const isPublic = visibility === TASK_VISIBILITY_PUBLIC;
    assigneeInput.disabled = !isPublic;
    if (!isPublic) {
      assigneeInput.value = session.username;
      return;
    }
    if (!assigneeInput.value) {
      assigneeInput.value = session.username;
    }
  }

  function getVisibleTasks() {
    return tasks.filter((task) => isTaskVisibleToSession(task));
  }

  function sortedTasksByStatus(status) {
    return getVisibleTasks()
      .filter((task) => task.status === status)
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt - a.createdAt;
      });
  }

  function buildAssigneeSelect(task) {
    const visibility = normalizeTaskVisibility(task.visibility);
    if (!canSessionManageTask(task) || visibility !== TASK_VISIBILITY_PUBLIC) {
      return '';
    }
    const options = [
      '<option value="">Sem responsavel</option>',
      ...assignableUsers.map((user) => `<option value="${escapeHtml(user.username)}" ${task.assignedTo === user.username ? 'selected' : ''}>${escapeHtml(getUserDisplayName(user))} (@${escapeHtml(user.username)})</option>`)
    ];
    return `
      <div class="task-meta" style="margin-top:6px;">
        Responsavel:
        <select data-task="${task.id}" data-action="assign">
          ${options.join('')}
        </select>
      </div>
    `;
  }

  function cardHtml(task) {
    const stepIndex = TASK_FLOW.indexOf(task.status);
    const canMoveTask = canSessionMoveTask(task);
    const canDeleteTask = canSessionManageTask(task);
    const canMoveBack = canMoveTask && stepIndex > 0;
    const canMoveForward = canMoveTask && stepIndex < TASK_FLOW.length - 1;
    const dueText = task.dueDate ? `Entrega: ${escapeHtml(task.dueDate)}` : 'Sem prazo';
    const visibility = normalizeTaskVisibility(task.visibility);
    const responsible = getTaskResponsibleUsername(task);
    const creator = String(task.createdBy || task.owner || 'sistema').trim() || 'sistema';
    const scopeLabel = visibility === TASK_VISIBILITY_PUBLIC ? 'Publica' : 'Privada';
    const responsibleHtml = responsible
      ? renderUserIdentity(responsible, { size: 'xs', showRole: false, className: 'task-user-chip' })
      : '<span class="task-user-empty">Sem responsavel</span>';
    const creatorHtml = renderUserIdentity(creator, { size: 'xs', showRole: false, className: 'task-user-chip' });

    return `
      <div class="task-card" data-task="${task.id}">
        <strong>${escapeHtml(task.title)}</strong>
        <div class="task-meta">${dueText} | ${escapeHtml(priorityLabel(task.priority))}</div>
        <div class="task-meta task-meta-users">
          <div>${scopeLabel}</div>
          <div><small>Responsavel</small>${responsibleHtml}</div>
          <div><small>Criada por</small>${creatorHtml}</div>
        </div>
        ${buildAssigneeSelect(task)}
        <div class="task-actions">
          <button class="btn-ghost" data-action="back" data-task="${task.id}" ${canMoveBack ? '' : 'disabled'}>Voltar</button>
          <button class="btn-primary" data-action="next" data-task="${task.id}" ${canMoveForward ? '' : 'disabled'}>Avancar</button>
          <button class="btn-danger" data-action="delete" data-task="${task.id}" ${canDeleteTask ? '' : 'disabled'}>Excluir</button>
        </div>
      </div>
    `;
  }

  function drawBoard() {
    ['todo', 'doing', 'done'].forEach((status) => {
      const listElement = document.getElementById(`tasks-${status}`);
      const countElement = document.getElementById(`count-${status}`);
      const statusTasks = sortedTasksByStatus(status);
      countElement.textContent = String(statusTasks.length);

      if (statusTasks.length === 0) {
        listElement.innerHTML = '<div class="empty-state">Nenhuma tarefa nesta coluna.</div>';
      } else {
        listElement.innerHTML = statusTasks.map(cardHtml).join('');
      }
    });
  }

  function findTask(taskId) {
    return tasks.find((task) => task.id === taskId) || null;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const dueDate = dueInput.value;
    const priority = priorityInput.value;
    const visibility = canManagePublicTasks && visibilityInput
      ? normalizeTaskVisibility(visibilityInput.value)
      : TASK_VISIBILITY_PRIVATE;
    const assignedTo = canManagePublicTasks && assigneeInput && visibility === TASK_VISIBILITY_PUBLIC
      ? String(assigneeInput.value || '').trim()
      : session.username;

    if (title.length < 3) {
      showNotification('Informe uma tarefa com ao menos 3 caracteres.', 'warning');
      return;
    }

    const now = Date.now();
    const newTask = normalizeTask({
      id: createId(),
      owner: session.username,
      createdBy: session.username,
      assignedTo,
      visibility,
      title,
      dueDate,
      priority,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
      deletedAt: 0
    });

    tasks.push(newTask);
    saveData();
    addLog(
      `Criou tarefa "${title}" (${visibility === TASK_VISIBILITY_PUBLIC ? `publica para ${assignedTo || 'sem responsavel'}` : 'privada'})`
    );

    form.reset();
    if (priorityInput) priorityInput.value = 'medium';
    syncAssigneeFieldState();
    drawBoard();
    showNotification('Tarefa adicionada.', 'success');
  });

  taskBoard.addEventListener('change', (event) => {
    const assignSelect = event.target.closest('select[data-task][data-action="assign"]');
    if (!assignSelect) return;
    const taskId = Number(assignSelect.dataset.task);
    const task = findTask(taskId);
    if (!task || !isTaskVisibleToSession(task)) return;
    if (!canSessionManageTask(task)) {
      showNotification('Sem permissao para reatribuir tarefa.', 'error');
      drawBoard();
      return;
    }
    if (normalizeTaskVisibility(task.visibility) !== TASK_VISIBILITY_PUBLIC) {
      drawBoard();
      return;
    }
    task.assignedTo = String(assignSelect.value || '').trim();
    task.updatedAt = Date.now();
    saveData();
    addLog(`Atribuiu tarefa "${task.title}" para ${task.assignedTo || 'sem responsavel'}`);
    showNotification(`Responsavel atualizado para ${task.assignedTo || 'sem responsavel'}.`, 'success');
    drawBoard();
  });

  taskBoard.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-task][data-action]');
    if (!button) return;

    const taskId = Number(button.dataset.task);
    const action = button.dataset.action;
    const task = findTask(taskId);
    if (!task || !isTaskVisibleToSession(task)) return;

    if (action === 'delete') {
      if (!canSessionManageTask(task)) {
        showNotification('Sem permissao para excluir esta tarefa.', 'error');
        return;
      }
      if (!confirm('Excluir esta tarefa?')) return;
      task.deletedAt = Date.now();
      task.updatedAt = task.deletedAt;
      saveData();
      addLog(`Excluiu tarefa "${task.title}"`);
      drawBoard();
      return;
    }

    if (!canSessionMoveTask(task)) {
      showNotification('Sem permissao para mover esta tarefa.', 'error');
      return;
    }

    const step = TASK_FLOW.indexOf(task.status);
    if (action === 'back' && step > 0) {
      task.status = TASK_FLOW[step - 1];
      task.updatedAt = Date.now();
    }

    if (action === 'next' && step < TASK_FLOW.length - 1) {
      task.status = TASK_FLOW[step + 1];
      task.updatedAt = Date.now();
    }

    saveData();
    addLog(`Moveu tarefa "${task.title}" para ${task.status}`);
    drawBoard();
  });

  if (visibilityInput) {
    visibilityInput.addEventListener('change', syncAssigneeFieldState);
  }
  syncAssigneeFieldState();
  drawBoard();
}

function renderNotes() {
  editingNoteId = null;

  els.content.innerHTML = `
    <section class="panel note-layout">
      <div>
        <h2 class="panel-title">Bloco de notas</h2>
        <p class="panel-subtitle">Guarde informacoes rapidas para seu dia a dia.</p>

        <form id="note-form" class="form-grid">
          <div class="full">
            <label for="note-title">Titulo</label>
            <input id="note-title" type="text" maxlength="100" placeholder="Titulo da nota" required />
          </div>
          <div class="full">
            <label for="note-content">Conteudo</label>
            <textarea id="note-content" maxlength="3000" placeholder="Escreva aqui..."></textarea>
          </div>
          <div class="full inline-actions">
            <button class="btn-primary" type="submit" id="note-save">Salvar nota</button>
            <button class="btn-ghost" type="button" id="note-clear">Limpar</button>
          </div>
        </form>
      </div>

      <div>
        <h3 class="panel-title">Minhas notas</h3>
        <div id="notes-list" class="note-list"></div>
      </div>
    </section>
  `;

  const noteForm = document.getElementById('note-form');
  const noteTitle = document.getElementById('note-title');
  const noteContent = document.getElementById('note-content');
  const clearButton = document.getElementById('note-clear');
  const notesList = document.getElementById('notes-list');

  function ownNotes() {
    return getUserNotes().slice().sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function drawList() {
    const list = ownNotes();
    if (list.length === 0) {
      notesList.innerHTML = '<div class="empty-state">Nenhuma nota cadastrada.</div>';
      return;
    }

    notesList.innerHTML = list.map((note) => `
      <article class="note-card">
        <h4>${escapeHtml(note.title)}</h4>
        <div class="note-preview">${escapeHtml(toShortText(note.content || 'Sem conteudo.', 120))}</div>
        <small>${formatDateTime(note.updatedAt)}</small>
        <div class="inline-actions" style="margin-top:8px;">
          <button class="btn-secondary" data-action="edit-note" data-note="${note.id}">Editar</button>
          <button class="btn-danger" data-action="delete-note" data-note="${note.id}">Excluir</button>
        </div>
      </article>
    `).join('');
  }

  function resetForm() {
    editingNoteId = null;
    noteForm.reset();
    noteTitle.focus();
    document.getElementById('note-save').textContent = 'Salvar nota';
  }

  noteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title.length < 2) {
      showNotification('Titulo deve ter ao menos 2 caracteres.', 'warning');
      return;
    }

    if (editingNoteId) {
      const existing = notes.find((note) => note.id === editingNoteId && note.owner === session.username);
      if (!existing) return;

      existing.title = title;
      existing.content = content;
      existing.updatedAt = Date.now();

      saveData();
      addLog(`Atualizou nota "${title}"`);
      showNotification('Nota atualizada.', 'success');
    } else {
      notes.push(normalizeNote({
        id: createId(),
        owner: session.username,
        title,
        content,
        updatedAt: Date.now()
      }));
      saveData();
      addLog(`Criou nota "${title}"`);
      showNotification('Nota criada.', 'success');
    }

    resetForm();
    drawList();
  });

  clearButton.addEventListener('click', resetForm);

  notesList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action][data-note]');
    if (!button) return;

    const noteId = Number(button.dataset.note);
    const action = button.dataset.action;
    const note = notes.find((item) => item.id === noteId && item.owner === session.username);
    if (!note) return;

    if (action === 'edit-note') {
      editingNoteId = note.id;
      noteTitle.value = note.title;
      noteContent.value = note.content;
      document.getElementById('note-save').textContent = 'Atualizar nota';
      noteTitle.focus();
      return;
    }

    if (action === 'delete-note') {
      if (!confirm('Excluir esta nota?')) return;
      notes = notes.filter((item) => item.id !== note.id);
      saveData();
      addLog(`Excluiu nota "${note.title}"`);
      drawList();
      if (editingNoteId === note.id) {
        resetForm();
      }
      showNotification('Nota excluida.', 'success');
    }
  });

  drawList();
}
function renderAnnouncements() {
  const canPublish = session.role === 'admin' || session.role === 'superadmin';

  const formHtml = canPublish
    ? `
      <section class="panel">
        <h2 class="panel-title">Publicar comunicado</h2>
        <form id="announcement-form" class="form-grid">
          <div>
            <label for="announcement-title">Titulo</label>
            <input id="announcement-title" type="text" maxlength="120" placeholder="Titulo do aviso" required />
          </div>
          <div>
            <label for="announcement-audience">Publico</label>
            <select id="announcement-audience">
              <option value="all">Todos</option>
              <option value="team">Equipe administrativa</option>
            </select>
          </div>
          <div class="full">
            <label for="announcement-content">Conteudo</label>
            <textarea id="announcement-content" maxlength="2000" placeholder="Mensagem do comunicado"></textarea>
          </div>
          <div class="full inline-actions">
            <button class="btn-primary" type="submit">Publicar</button>
          </div>
        </form>
      </section>
    `
    : '';

  els.content.innerHTML = `
    ${formHtml}
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Comunicados internos</h2>
          <p class="panel-subtitle">Linha do tempo com avisos relevantes da equipe.</p>
        </div>
      </div>
      <div id="announcement-list" class="timeline"></div>
    </section>
  `;

  const list = document.getElementById('announcement-list');

  function visibleAnnouncements() {
    return announcements
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter((item) => {
        if ((Number(item.deletedAt) || 0) > 0) return false;
        if (item.audience === 'all') return true;
        return session.role === 'admin' || session.role === 'superadmin';
      });
  }

  function drawAnnouncements() {
    const items = visibleAnnouncements();
    if (items.length === 0) {
      list.innerHTML = '<div class="empty-state">Nenhum comunicado disponivel.</div>';
      return;
    }

    list.innerHTML = items.map((item) => {
      const canDelete = session.role === 'superadmin' || item.author === session.username;
      return `
        <article class="announcement">
          <div class="announcement-header">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${formatDateTime(item.createdAt)}</small>
          </div>
          <p>${escapeHtml(item.content)}</p>
          <div class="announcement-meta">
            ${renderUserIdentity(item.author, { size: 'xs', showRole: false })}
            <small>Publico: ${item.audience === 'all' ? 'Todos' : 'Equipe administrativa'}</small>
          </div>
          ${canDelete ? `<div class="inline-actions" style="margin-top:8px;"><button class="btn-danger" data-action="delete-announcement" data-item="${item.id}">Excluir</button></div>` : ''}
        </article>
      `;
    }).join('');
  }

  if (canPublish) {
    const form = document.getElementById('announcement-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const title = document.getElementById('announcement-title').value.trim();
      const content = document.getElementById('announcement-content').value.trim();
      const audience = document.getElementById('announcement-audience').value;

      if (title.length < 3 || content.length < 3) {
        showNotification('Titulo e conteudo precisam ter ao menos 3 caracteres.', 'warning');
        return;
      }

      announcements.push(normalizeAnnouncement({
        id: createId(),
        title,
        content,
        author: session.username,
        audience,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        deletedAt: 0
      }));

      saveData();
      addLog(`Publicou comunicado "${title}"`);
      form.reset();
      drawAnnouncements();
      showNotification('Comunicado publicado.', 'success');
    });
  }

  list.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="delete-announcement"]');
    if (!button) return;

    const itemId = Number(button.dataset.item);
    const item = announcements.find((announcement) => announcement.id === itemId);
    if (!item) return;

    const canDelete = session.role === 'superadmin' || item.author === session.username;
    if (!canDelete) {
      showNotification('Voce nao pode excluir este comunicado.', 'error');
      return;
    }

    if (!confirm('Excluir este comunicado?')) return;

    item.deletedAt = Date.now();
    item.updatedAt = item.deletedAt;
    saveData();
    addLog(`Excluiu comunicado "${item.title}"`);
    drawAnnouncements();
    showNotification('Comunicado excluido.', 'success');
  });

  drawAnnouncements();
}

function renderKnowledge() {
  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Base de conhecimento</h2>
          <p class="panel-subtitle">Artigos curtos para acelerar resolucao e padronizar atendimento.</p>
        </div>
      </div>

      <div class="filters" style="grid-template-columns: 1fr;">
        <input id="knowledge-search" type="text" placeholder="Buscar por titulo, categoria ou conteudo" />
      </div>

      <div id="knowledge-list" class="knowledge-grid"></div>
    </section>
  `;

  const searchInput = document.getElementById('knowledge-search');
  const list = document.getElementById('knowledge-list');

  function drawArticles() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = KNOWLEDGE_BASE.filter((article) => {
      if (!query) return true;
      return article.title.toLowerCase().includes(query)
        || article.category.toLowerCase().includes(query)
        || article.content.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      list.innerHTML = '<div class="empty-state">Nenhum artigo encontrado para o filtro atual.</div>';
      return;
    }

    list.innerHTML = filtered.map((article) => `
      <details class="knowledge-item">
        <summary>${escapeHtml(article.title)} <small style="color: var(--muted);">(${escapeHtml(article.category)})</small></summary>
        <p>${escapeHtml(article.content)}</p>
      </details>
    `).join('');
  }

  searchInput.addEventListener('input', drawArticles);
  drawArticles();
}

function generatePassword(length, options) {
  const pools = [];
  if (options.lower) pools.push('abcdefghijklmnopqrstuvwxyz');
  if (options.upper) pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (options.numbers) pools.push('0123456789');
  if (options.symbols) pools.push('!@#$%&*()-_=+[]{}?');

  if (pools.length === 0) return '';

  let password = '';
  for (let i = 0; i < length; i += 1) {
    const pool = pools[Math.floor(Math.random() * pools.length)];
    const char = pool[Math.floor(Math.random() * pool.length)];
    password += char;
  }

  return password;
}

function updateFocusDisplay() {
  const display = document.getElementById('focus-time');
  const status = document.getElementById('focus-status');
  if (!display || !status) return;

  const minutes = Math.floor(focusSecondsLeft / 60);
  const seconds = focusSecondsLeft % 60;
  display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  status.textContent = focusRunning ? 'Rodando' : 'Pausado';
}

function startFocusTimer() {
  if (focusRunning) return;
  focusRunning = true;
  updateFocusDisplay();

  focusInterval = setInterval(() => {
    focusSecondsLeft -= 1;

    if (focusSecondsLeft <= 0) {
      focusSecondsLeft = 0;
      clearInterval(focusInterval);
      focusInterval = null;
      focusRunning = false;
      updateFocusDisplay();
      showNotification('Ciclo de foco finalizado.', 'success');
      return;
    }

    updateFocusDisplay();
  }, 1000);
}

function pauseFocusTimer() {
  if (focusInterval) {
    clearInterval(focusInterval);
    focusInterval = null;
  }
  focusRunning = false;
  updateFocusDisplay();
}

function resetFocusTimer() {
  pauseFocusTimer();
  focusSecondsLeft = FOCUS_DEFAULT_SECONDS;
  updateFocusDisplay();
}

function renderTools() {
  els.content.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Ferramentas rapidas</h2>
          <p class="panel-subtitle">Recursos simples para produtividade no dia a dia.</p>
        </div>
      </div>

      <div class="tool-grid">
        <article class="tool-card">
          <h3 class="panel-title">Gerador de senha</h3>
          <label for="pwd-length">Tamanho</label>
          <input id="pwd-length" type="number" min="6" max="64" value="14" />

          <label><input id="pwd-lower" type="checkbox" checked /> minusculas</label>
          <label><input id="pwd-upper" type="checkbox" checked /> maiusculas</label>
          <label><input id="pwd-number" type="checkbox" checked /> numeros</label>
          <label><input id="pwd-symbol" type="checkbox" /> simbolos</label>

          <div class="inline-actions">
            <button id="pwd-generate" class="btn-primary">Gerar</button>
            <button id="pwd-copy" class="btn-secondary">Copiar</button>
          </div>

          <div id="pwd-output" class="tool-output">Clique em gerar para criar uma senha.</div>
        </article>

        <article class="tool-card">
          <h3 class="panel-title">Contador de texto</h3>
          <textarea id="text-counter-input" placeholder="Cole um texto para contar palavras, caracteres e linhas."></textarea>
          <div class="tool-output" id="text-counter-output">0 caracteres | 0 palavras | 0 linhas</div>
        </article>

        <article class="tool-card">
          <h3 class="panel-title">Timer de foco (25:00)</h3>
          <div id="focus-time" class="focus-display">25:00</div>
          <div id="focus-status" class="tool-output" style="text-align:center;">Pausado</div>
          <div class="inline-actions">
            <button id="focus-start" class="btn-primary">Iniciar</button>
            <button id="focus-pause" class="btn-secondary">Pausar</button>
            <button id="focus-reset" class="btn-ghost">Resetar</button>
          </div>
        </article>

        <article class="tool-card">
          <h3 class="panel-title">Plano de 10 anos</h3>
          <label for="plan-value-tool">Valor total</label>
          <input id="plan-value-tool" type="number" min="1" step="0.01" placeholder="Ex: 1200" />

          <label for="plan-rate-tool">Juros anual (%)</label>
          <input id="plan-rate-tool" type="number" min="0" max="40" step="0.01" value="0" />

          <div class="inline-actions">
            <button id="plan-calc-tool" class="btn-primary">Calcular</button>
          </div>
          <div id="plan-output-tool" class="tool-output">Descubra quanto ficaria por mes durante 10 anos.</div>

          <label for="dopamine-target-tool">Meta dopamina (R$)</label>
          <input id="dopamine-target-tool" type="number" min="1" step="0.01" value="100" />
          <button id="dopamine-rush-tool" class="btn-secondary">Gerar desafio</button>
          <div id="dopamine-rush-output" class="tool-output">Clique para gerar um desafio rapido de motivacao.</div>
        </article>
      </div>
    </section>
  `;

  const pwdLength = document.getElementById('pwd-length');
  const pwdLower = document.getElementById('pwd-lower');
  const pwdUpper = document.getElementById('pwd-upper');
  const pwdNumber = document.getElementById('pwd-number');
  const pwdSymbol = document.getElementById('pwd-symbol');
  const pwdOutput = document.getElementById('pwd-output');
  const pwdGenerate = document.getElementById('pwd-generate');
  const pwdCopy = document.getElementById('pwd-copy');

  function generateAndShowPassword() {
    const length = Math.max(6, Math.min(64, Number(pwdLength.value) || 14));
    const password = generatePassword(length, {
      lower: pwdLower.checked,
      upper: pwdUpper.checked,
      numbers: pwdNumber.checked,
      symbols: pwdSymbol.checked
    });

    if (!password) {
      showNotification('Selecione pelo menos um tipo de caractere.', 'warning');
      return;
    }

    pwdOutput.textContent = password;
  }

  pwdGenerate.addEventListener('click', generateAndShowPassword);

  pwdCopy.addEventListener('click', async () => {
    const text = pwdOutput.textContent || '';
    if (!text || text.includes('Clique em gerar')) {
      showNotification('Gere uma senha antes de copiar.', 'warning');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showNotification('Senha copiada para a area de transferencia.', 'success');
    } catch {
      showNotification('Nao foi possivel copiar automaticamente.', 'error');
    }
  });

  const textInput = document.getElementById('text-counter-input');
  const textOutput = document.getElementById('text-counter-output');

  textInput.addEventListener('input', () => {
    const text = textInput.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    textOutput.textContent = `${chars} caracteres | ${words} palavras | ${lines} linhas`;
  });

  const focusStart = document.getElementById('focus-start');
  const focusPause = document.getElementById('focus-pause');
  const focusReset = document.getElementById('focus-reset');
  const planCalcTool = document.getElementById('plan-calc-tool');
  const planValueTool = document.getElementById('plan-value-tool');
  const planRateTool = document.getElementById('plan-rate-tool');
  const planOutputTool = document.getElementById('plan-output-tool');
  const dopamineTargetTool = document.getElementById('dopamine-target-tool');
  const dopamineRushTool = document.getElementById('dopamine-rush-tool');
  const dopamineRushOutput = document.getElementById('dopamine-rush-output');

  focusStart.addEventListener('click', startFocusTimer);
  focusPause.addEventListener('click', pauseFocusTimer);
  focusReset.addEventListener('click', resetFocusTimer);

  planCalcTool.addEventListener('click', () => {
    const value = toPositiveAmount(planValueTool.value);
    const rate = Number(planRateTool.value) || 0;
    if (!value) {
      showNotification('Informe um valor para calcular.', 'warning');
      return;
    }
    const result = calculateTenYearPlan(value, rate);
    planOutputTool.innerHTML = `<strong>${formatCurrency(result.monthly)}/mes</strong> por 10 anos | Total ${formatCurrency(result.total)} | Juros ${formatCurrency(result.interest)}`;
  });

  dopamineRushTool.addEventListener('click', () => {
    const target = Math.max(1, toPositiveAmount(dopamineTargetTool.value));
    const challengeA = (target * 0.15).toFixed(2);
    const challengeB = (target / 12).toFixed(2);
    const challengeC = (target / 120).toFixed(2);
    dopamineRushOutput.innerHTML = `
      Desafio: pagar <strong>${formatCurrency(challengeA)}</strong> em 7 dias.<br />
      Rota anual: <strong>${formatCurrency(challengeB)}</strong>/mes por 12 meses.<br />
      Rota 10 anos: <strong>${formatCurrency(challengeC)}</strong>/mes por 120 meses.
    `;
  });

  updateFocusDisplay();
}
function renderProfile() {
  const user = getCurrentUser();
  if (!user) {
    renderAccessDenied('Sessao invalida. Faca login novamente.');
    return;
  }
  const canChangePassword = isEsther();
  const displayName = getUserDisplayName(user);
  const publicLabel = getUserPublicLabel(user);
  const currentMonthKey = getCurrentMonthKey();
  const currentMonthSummary = getUserFinanceMonthSummary(user, currentMonthKey);
  const latestPayment = getUserLastPaymentEntry(user);

  els.content.innerHTML = `
    <section class="panel grid-2">
      <div>
        <h2 class="panel-title">Meu perfil</h2>
        <p class="panel-subtitle">Dados da conta e indicadores rapidos.</p>

        <div class="user-identity user-identity-profile">
          ${renderUserAvatar(user, { size: 'lg' })}
          <div class="user-identity-copy">
            <strong>${escapeHtml(displayName)}</strong>
            <small>${escapeHtml(publicLabel)}</small>
          </div>
        </div>

        <div class="kpi-list">
          <div class="kpi-item"><strong>Usuario</strong><span>${escapeHtml(user.username)}</span></div>
          <div class="kpi-item"><strong>Nome publico</strong><span>${escapeHtml(displayName)}</span></div>
          <div class="kpi-item"><strong>Papel</strong><span>${escapeHtml(roleLabel(user.role))}</span></div>
          <div class="kpi-item"><strong>Status</strong><span>${escapeHtml(user.status)}</span></div>
          <div class="kpi-item"><strong>Divida atual</strong><span>${formatDebtCurrency(user.debt)}</span></div>
          <div class="kpi-item"><strong>Total cobrado</strong><span>${formatCurrency(user.totalCharged)}</span></div>
          <div class="kpi-item"><strong>Total pago</strong><span>${formatCurrency(user.totalPaid)}</span></div>
          <div class="kpi-item"><strong>Lucro acumulado</strong><span>${formatCurrency(user.walletProfit)}</span></div>
          <div class="kpi-item"><strong>Saude da carteira</strong><span>${escapeHtml(walletHealthLabel(user.walletHealth))}</span></div>
          <div class="kpi-item"><strong>Pago no mes</strong><span>${formatCurrency(currentMonthSummary.paid)}</span></div>
          <div class="kpi-item"><strong>Cobrado no mes</strong><span>${formatCurrency(currentMonthSummary.charged)}</span></div>
          <div class="kpi-item"><strong>Ultimo pagamento</strong><span>${latestPayment ? formatDateTime(latestPayment.timestamp) : 'Nenhum registro'}</span></div>
        </div>

        <form id="profile-identity-form" class="form-grid" style="margin-top: 12px;">
          <div class="full">
            <label for="profile-display-name">Nome exibido para todos</label>
            <input id="profile-display-name" type="text" maxlength="${MAX_PROFILE_NAME_LENGTH}" value="${escapeHtml(displayName)}" placeholder="Como seu nome aparece no portal" />
          </div>
          <div>
            <label for="profile-avatar-file">Foto de perfil</label>
            <input id="profile-avatar-file" type="file" accept="image/*" />
            <small class="muted-text">Imagem quadrada sera gerada automaticamente (${MAX_AVATAR_IMAGE_SIDE}x${MAX_AVATAR_IMAGE_SIDE}).</small>
          </div>
          <div id="profile-avatar-preview" class="profile-avatar-preview">
            ${renderUserAvatar(user, { size: 'md' })}
            <small>${sanitizeAvatarDataUrl(user.avatarDataUrl) ? 'Foto ativa' : 'Sem foto definida'}</small>
          </div>
          <div class="full inline-actions">
            <button class="btn-primary" type="submit">Salvar perfil visual</button>
            <button id="profile-avatar-remove" class="btn-ghost" type="button" ${sanitizeAvatarDataUrl(user.avatarDataUrl) ? '' : 'disabled'}>Remover foto</button>
          </div>
        </form>

        <form id="profile-finance-form" class="form-grid" style="margin-top: 12px;">
          <div>
            <label for="profile-payment-amount">Pagar agora</label>
            <input id="profile-payment-amount" type="number" min="1" step="0.01" placeholder="Ex: 30.00" />
          </div>
          <div class="inline-actions" style="align-items:end;">
            <button class="btn-primary" type="submit">Registrar pagamento</button>
          </div>
        </form>
      </div>

      <div>
        <h3 class="panel-title">Alterar senha</h3>
        <p class="panel-subtitle">${canChangePassword ? 'Como Esther, voce pode alterar sua senha.' : 'Senha padrao controlada pela Esther (1705).'}</p>
        <form id="password-form" class="form-grid">
          <div class="full">
            <label for="current-password">Senha atual</label>
            <input id="current-password" type="password" ${canChangePassword ? 'required' : 'disabled'} />
          </div>
          <div class="full">
            <label for="new-password-profile">Nova senha</label>
            <input id="new-password-profile" type="password" ${canChangePassword ? 'required' : 'disabled'} />
          </div>
          <div class="full">
            <label for="confirm-password-profile">Confirmar nova senha</label>
            <input id="confirm-password-profile" type="password" ${canChangePassword ? 'required' : 'disabled'} />
          </div>
          <div class="full inline-actions">
            <button class="btn-primary" type="submit" ${canChangePassword ? '' : 'disabled'}>Atualizar senha</button>
          </div>
        </form>
      </div>
    </section>
  `;

  const identityForm = document.getElementById('profile-identity-form');
  const displayNameInput = document.getElementById('profile-display-name');
  const avatarFileInput = document.getElementById('profile-avatar-file');
  const avatarPreview = document.getElementById('profile-avatar-preview');
  const avatarRemoveButton = document.getElementById('profile-avatar-remove');
  const form = document.getElementById('password-form');
  const financeForm = document.getElementById('profile-finance-form');
  let pendingAvatarDataUrl = sanitizeAvatarDataUrl(user.avatarDataUrl);
  let avatarTouched = false;

  function drawAvatarPreview(avatarDataUrl) {
    const previewUser = {
      ...user,
      avatarDataUrl: sanitizeAvatarDataUrl(avatarDataUrl)
    };
    const hasAvatar = Boolean(sanitizeAvatarDataUrl(previewUser.avatarDataUrl));
    avatarPreview.innerHTML = `
      ${renderUserAvatar(previewUser, { size: 'md' })}
      <small>${hasAvatar ? 'Foto ativa' : 'Sem foto definida'}</small>
    `;
    avatarRemoveButton.disabled = !hasAvatar;
  }

  drawAvatarPreview(pendingAvatarDataUrl);

  avatarFileInput.addEventListener('change', async () => {
    const [file] = Array.from(avatarFileInput.files || []);
    if (!file) return;
    try {
      const nextAvatar = await loadImageAsAvatarDataUrl(file);
      pendingAvatarDataUrl = nextAvatar;
      avatarTouched = true;
      drawAvatarPreview(pendingAvatarDataUrl);
      showNotification('Foto pronta para salvar.', 'success');
    } catch (error) {
      showNotification(error && error.message ? error.message : 'Falha ao processar imagem.', 'warning');
      avatarFileInput.value = '';
    }
  });

  avatarRemoveButton.addEventListener('click', () => {
    pendingAvatarDataUrl = '';
    avatarTouched = true;
    avatarFileInput.value = '';
    drawAvatarPreview('');
  });

  identityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nextDisplayName = normalizeDisplayName(displayNameInput.value, user.username);
    if (nextDisplayName.length < 2) {
      showNotification('Nome exibido precisa ter pelo menos 2 caracteres.', 'warning');
      return;
    }
    const sanitizedAvatar = sanitizeAvatarDataUrl(pendingAvatarDataUrl);
    const previousAvatar = sanitizeAvatarDataUrl(user.avatarDataUrl);
    const now = Date.now();
    user.displayName = nextDisplayName;
    user.profileUpdatedAt = now;
    if (avatarTouched || sanitizedAvatar !== previousAvatar) {
      user.avatarDataUrl = sanitizedAvatar;
      user.avatarUpdatedAt = now;
    }
    saveData();
    updateCurrentUserDisplay();
    addLog('Atualizou perfil visual (nome/foto)');
    showNotification('Perfil visual atualizado.', 'success');
    renderProfile();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!canChangePassword) {
      showNotification('Somente Esther pode alterar senhas.', 'warning');
      return;
    }

    const current = document.getElementById('current-password').value;
    const next = document.getElementById('new-password-profile').value.trim();
    const confirmNext = document.getElementById('confirm-password-profile').value.trim();

    if (next.length < 4) {
      showNotification('Nova senha deve ter pelo menos 4 caracteres.', 'warning');
      return;
    }

    if (next !== confirmNext) {
      showNotification('Confirmacao de senha nao confere.', 'warning');
      return;
    }

    try {
      await changeOwnPasswordOnServer(current, next);
      user.passwordUpdatedAt = Date.now();
      form.reset();
      showNotification('Senha atualizada com sucesso.', 'success');
    } catch (error) {
      showNotification(error && error.message ? error.message : 'Falha ao atualizar senha.', 'error');
    }
  });

  financeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = toPositiveAmount(document.getElementById('profile-payment-amount').value);
    if (!amount) {
      showNotification('Informe um valor valido para pagamento.', 'warning');
      return;
    }
    const result = registerFinanceEvent(user, 'payment', amount, 'Pagamento pelo perfil');
    if (!result.ok) {
      showNotification(result.message, 'warning');
      return;
    }
    addLog(`Pagamento proprio no perfil: ${formatCurrency(result.amount)} (lucro ${formatCurrency(result.profitAdded || 0)})`);
    const profitText = result.profitAdded > 0 ? ` | lucro ${formatCurrency(result.profitAdded)}` : '';
    showNotification(`Pagamento aplicado: ${formatCurrency(result.amount)}${profitText}.`, 'success');
    renderProfile();
  });

}

function renderAccessDenied(message) {
  els.content.innerHTML = `
    <section class="panel">
      <h2 class="panel-title">Acesso restrito</h2>
      <p class="panel-subtitle">${escapeHtml(message)}</p>
    </section>
  `;
}

function syncActiveTicketChatView() {
  if (!session || activeChatTicketId === null) return;
  if (!els.chatModal || els.chatModal.classList.contains('hidden')) return;
  const ticket = tickets.find((item) => item.id === activeChatTicketId);
  if (!ticket || !canAccessTicket(ticket)) {
    closeChat();
    return;
  }
  els.chatTitle.textContent = `Conversa #${ticket.id} - ${ticket.title}`;
  renderChatMessages(ticket);
}

function openChat(ticketId) {
  const ticket = tickets.find((item) => item.id === ticketId);
  if (!ticket) {
    showNotification('Ticket nao encontrado.', 'error');
    return;
  }

  if (!canAccessTicket(ticket)) {
    showNotification('Voce nao tem permissao para este chat.', 'error');
    return;
  }

  activeChatTicketId = ticketId;
  els.chatTitle.textContent = `Conversa #${ticket.id} - ${ticket.title}`;
  renderChatMessages(ticket);

  els.chatModal.classList.remove('hidden');
  els.chatInput.value = '';
  els.chatInput.focus();
}

function renderChatMessages(ticket) {
  if (!ticket.messages || ticket.messages.length === 0) {
    els.chatMessages.innerHTML = '<div class="empty-state">Nenhuma mensagem ainda. Inicie a conversa.</div>';
    return;
  }

  els.chatMessages.innerHTML = ticket.messages.map((message) => {
    const mine = message.sender === session.username;
    const authorUser = getUserByUsername(message.sender);
    const authorRole = authorUser ? roleLabel(authorUser.role) : '';
    const roleSuffix = authorRole ? ` - ${authorRole}` : '';
    return `
      <div class="chat-message ${mine ? 'mine' : ''}">
        <div class="chat-message-author">
          ${renderUserAvatar(authorUser || message.sender, { size: 'xs' })}
          <div class="chat-message-author-copy">
            <strong>${escapeHtml(getUserPublicLabel(authorUser || message.sender))}</strong>
            <small>@${escapeHtml(message.sender)}${escapeHtml(roleSuffix)}</small>
          </div>
        </div>
        <span>${escapeHtml(message.content)}</span>
        <small>${formatDateTime(message.timestamp)}</small>
      </div>
    `;
  }).join('');

  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
}

function sendMessage() {
  const text = els.chatInput.value.trim();
  if (!text) return;

  const ticket = tickets.find((item) => item.id === activeChatTicketId);
  if (!ticket) {
    showNotification('Ticket nao encontrado.', 'error');
    return;
  }

  if (!canAccessTicket(ticket)) {
    showNotification('Voce nao pode enviar mensagem neste ticket.', 'error');
    return;
  }

  ticket.messages.push({
    sender: session.username,
    content: text,
    timestamp: Date.now()
  });
  ticket.messages = mergeTicketMessages(ticket.messages, []);
  ticket.updatedAt = Date.now();

  saveData();
  addLog(`Enviou mensagem no ticket #${ticket.id}`);

  els.chatInput.value = '';
  renderChatMessages(ticket);
}

function closeChat() {
  els.chatModal.classList.add('hidden');
  activeChatTicketId = null;
}

function bindStaticEvents() {
  els.loginButton.addEventListener('click', handleLogin);
  if (els.loginThemeToggle) {
    els.loginThemeToggle.addEventListener('click', toggleThemeMode);
  }
  if (els.themeToggleButton) {
    els.themeToggleButton.addEventListener('click', toggleThemeMode);
  }

  els.passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLogin();
    }
  });

  els.usernameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLogin();
    }
  });

  els.logoutButton.addEventListener('click', handleLogout);

  if (els.headerSearchButton) {
    els.headerSearchButton.addEventListener('click', () => {
      openGlobalSearch();
    });
  }
  if (els.headerSearchInput) {
    els.headerSearchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        openGlobalSearch();
      }
    });
  }

  els.sendMessageButton.addEventListener('click', sendMessage);
  els.chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });

  els.closeChatButton.addEventListener('click', closeChat);
  els.chatOverlay.addEventListener('click', closeChat);
  if (els.walletDetailOverlay) {
    els.walletDetailOverlay.addEventListener('click', closeWalletDetailModal);
  }

  els.menuToggle.addEventListener('click', () => {
    els.appContainer.classList.toggle('sidebar-open');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) {
      els.appContainer.classList.remove('sidebar-open');
    }
    if (!session) return;
    if (viewportResizeRenderTimer) {
      clearTimeout(viewportResizeRenderTimer);
    }
    viewportResizeRenderTimer = setTimeout(() => {
      viewportResizeRenderTimer = null;
      requestRealtimeRender();
    }, 140);
  });

  window.addEventListener('beforeunload', () => {
    destroyStealthChat(false);
    stopEspionageAutoRefresh();
    if (viewportResizeRenderTimer) {
      clearTimeout(viewportResizeRenderTimer);
      viewportResizeRenderTimer = null;
    }
    if (session && session.username) {
      registerUserOffline(session.username, 'fechou aba ou navegador');
    }
    removePresence();
    disconnectPresenceSocket(false);
    if (realtimeRenderRateTimer) {
      clearTimeout(realtimeRenderRateTimer);
      realtimeRenderRateTimer = null;
    }
    if (presenceViewRefreshTimer) {
      clearTimeout(presenceViewRefreshTimer);
      presenceViewRefreshTimer = null;
    }
    saveData({ immediate: true });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !els.chatModal.classList.contains('hidden')) {
      closeChat();
      return;
    }
    if (event.key === 'Escape' && els.walletDetailModal && !els.walletDetailModal.classList.contains('hidden')) {
      closeWalletDetailModal();
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEYS.ui) {
      const uiState = readUiState();
      if (!session && typeof uiState.lastUser === 'string' && document.activeElement !== els.usernameInput) {
        els.usernameInput.value = uiState.lastUser;
      }
      applyThemeMode(uiState.theme || UI_THEME_LIGHT, { persist: false, rerender: Boolean(session) });
    }

    if (event.key === STORAGE_KEYS.users || event.key === STORAGE_KEYS.settings) {
      if (event.key === STORAGE_KEYS.users) {
        const refreshedUsers = safeParse(storageGetItem(STORAGE_KEYS.users), users);
        users = Array.isArray(refreshedUsers) ? refreshedUsers.map(normalizeUser) : users;
        ensureCoreUsers();
      }
      if (event.key === STORAGE_KEYS.settings) {
        const refreshedSettings = safeParse(storageGetItem(STORAGE_KEYS.settings), settings);
        settings = normalizeSettings(refreshedSettings);
      }
      const syncResult = syncSessionFromUsers({ source: `storage:${event.key}`, notify: true });
      if (syncResult.changed && !syncResult.loggedOut && session) {
        requestRealtimeRender();
      }
    }

    if (event.key === STORAGE_KEYS.tickets) {
      const refreshedTickets = safeParse(storageGetItem(STORAGE_KEYS.tickets), tickets);
      tickets = Array.isArray(refreshedTickets) ? refreshedTickets.map(normalizeTicket) : tickets;
      syncActiveTicketChatView();
      if (currentPage === 'myTickets' || currentPage === 'pending' || currentPage === 'allTickets') {
        requestRealtimeRender();
      }
    }
    if (event.key === STORAGE_KEYS.tasks) {
      const refreshedTasks = safeParse(storageGetItem(STORAGE_KEYS.tasks), tasks);
      tasks = Array.isArray(refreshedTasks) ? refreshedTasks.map(normalizeTask) : tasks;
      if (currentPage === 'tasks' || currentPage === 'dashboard' || currentPage === 'profile') {
        requestRealtimeRender();
      }
    }
    if (event.key === STORAGE_KEYS.announcements) {
      const refreshedAnnouncements = safeParse(storageGetItem(STORAGE_KEYS.announcements), announcements);
      announcements = Array.isArray(refreshedAnnouncements) ? refreshedAnnouncements.map(normalizeAnnouncement) : announcements;
      if (currentPage === 'announcements' || currentPage === 'dashboard') {
        requestRealtimeRender();
      }
    }
    if (event.key === STORAGE_KEYS.stealthBus) {
      syncStealthFromStorage();
    }
    if (event.key === STORAGE_KEYS.liveBroadcast) {
      showLiveBroadcastBanner(readLiveBroadcast());
      if (currentPage === 'espionage' && !shouldDeferRealtimeRenderForPage('espionage')) {
        renderEspionage();
      }
    }
    if (event.key === STORAGE_KEYS.presence && currentPage === 'intelCenter' && !shouldDeferRealtimeRenderForPage('intelCenter')) {
      renderIntelCenter();
    }
    if ((event.key === STORAGE_KEYS.logs || event.key === STORAGE_KEYS.users) && currentPage === 'intelCenter') {
      const refreshedLogs = safeParse(storageGetItem(STORAGE_KEYS.logs), logs);
      const refreshedUsers = safeParse(storageGetItem(STORAGE_KEYS.users), users);
      logs = Array.isArray(refreshedLogs) ? capLogs(refreshedLogs.map(normalizeLogEntry)) : logs;
      users = Array.isArray(refreshedUsers) ? refreshedUsers.map(normalizeUser) : users;
      ensureCoreUsers();
      if (!shouldDeferRealtimeRenderForPage('intelCenter')) {
        renderIntelCenter();
      }
    }
    if ((event.key === STORAGE_KEYS.logs || event.key === STORAGE_KEYS.presence) && currentPage === 'logs') {
      const refreshedLogs = safeParse(storageGetItem(STORAGE_KEYS.logs), logs);
      logs = Array.isArray(refreshedLogs) ? capLogs(refreshedLogs.map(normalizeLogEntry)) : logs;
      renderLogs();
    }
    if ((event.key === STORAGE_KEYS.users || event.key === STORAGE_KEYS.settings) && currentPage === 'dashboard') {
      const refreshedUsers = safeParse(storageGetItem(STORAGE_KEYS.users), users);
      const refreshedSettings = safeParse(storageGetItem(STORAGE_KEYS.settings), settings);
      users = Array.isArray(refreshedUsers) ? refreshedUsers.map(normalizeUser) : users;
      ensureCoreUsers();
      settings = normalizeSettings(refreshedSettings);
      renderDashboard();
    }
    if ((event.key === STORAGE_KEYS.users || event.key === STORAGE_KEYS.settings) && currentPage === 'walletControl') {
      const refreshedUsers = safeParse(storageGetItem(STORAGE_KEYS.users), users);
      const refreshedSettings = safeParse(storageGetItem(STORAGE_KEYS.settings), settings);
      users = Array.isArray(refreshedUsers) ? refreshedUsers.map(normalizeUser) : users;
      ensureCoreUsers();
      settings = normalizeSettings(refreshedSettings);
      renderWalletControl();
    }
    if (event.key === STORAGE_KEYS.settings && currentPage === 'staffChat') {
      const refreshedSettings = safeParse(storageGetItem(STORAGE_KEYS.settings), settings);
      settings = normalizeSettings(refreshedSettings);
      if (!shouldDeferRealtimeRenderForPage('staffChat')) {
        renderStaffChat();
      }
    }
    if ((event.key === STORAGE_KEYS.users || event.key === STORAGE_KEYS.presence || event.key === STORAGE_KEYS.logs) && currentPage === 'espionage') {
      const refreshedUsers = safeParse(storageGetItem(STORAGE_KEYS.users), users);
      const refreshedLogs = safeParse(storageGetItem(STORAGE_KEYS.logs), logs);
      users = Array.isArray(refreshedUsers) ? refreshedUsers.map(normalizeUser) : users;
      ensureCoreUsers();
      logs = Array.isArray(refreshedLogs) ? capLogs(refreshedLogs.map(normalizeLogEntry)) : logs;
      if (!shouldDeferRealtimeRenderForPage('espionage')) {
        renderEspionage();
      }
    }
  });
}

function restoreLastUserHint() {
  const uiState = readUiState();
  if (uiState && typeof uiState.lastUser === 'string') {
    els.usernameInput.value = uiState.lastUser;
  }
}

function bootstrap() {
  restoreThemePreference();
  initData();
  bindStaticEvents();
  restoreLastUserHint();
  updateConnectionStatusDisplay();
  restoreServerSession();
}

bootstrap();

