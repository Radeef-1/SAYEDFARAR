// FinDash - Supabase Bilingual Financial Dashboard App Script (No Authentication)

// 1. DYNAMIC CONFIGURATION STATE FOR SUPABASE
let SUPABASE_URL = localStorage.getItem('findash_supabase_url');
let SUPABASE_ANON_KEY = localStorage.getItem('findash_supabase_key');

const DEFAULT_URL = 'https://rmkshljkemrzyzrnhcvm.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJta3NobGprZW1yenl6cm5oY3ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5Nzc4NzMsImV4cCI6MjA5ODU1Mzg3M30.oBAJz_K55b3r1I6zPUT6Nx-CwXSTexhM5CLznuMcR5I';

if (!SUPABASE_URL || SUPABASE_URL === 'null' || !SUPABASE_URL.startsWith('http')) {
  SUPABASE_URL = DEFAULT_URL;
  localStorage.setItem('findash_supabase_url', DEFAULT_URL);
}
if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'null' || SUPABASE_ANON_KEY.length < 50) {
  SUPABASE_ANON_KEY = DEFAULT_KEY;
  localStorage.setItem('findash_supabase_key', DEFAULT_KEY);
}

let supabase = null;

// Initialize Supabase client if keys are present
function initSupabase() {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return true;
    } catch (e) {
      showToast(currentLang === 'ar' ? 'فشل الاتصال بـ Supabase' : 'Connection to Supabase failed', 'error');
      console.error(e);
    }
  }
  return false;
}
initSupabase();

// 2. DICTIONARY FOR TRANSLATIONS (EN / AR)
const i18n = {
  ar: {
    add_topup: "+ شحن رصيد",
    add_withdrawal: "+ سحب منصة",
    notifications: "التنبيهات والتحليلات",
    clear_all: "مسح الكل",
    no_notifications: "لا توجد تنبيهات نشطة حالياً.",
    loading: "جاري التحميل...",
    offline_msg: "أنت غير متصل بالإنترنت حاليًا. قد لا يتم حفظ التغييرات الأخيرة.",
    card_limit: "حالة رصيد الحساب",
    current_balance: "الرصيد الحالي",
    net_cashflow: "صافي التدفق النقدي",
    total_topups: "إجمالي الشحن",
    total_withdrawals: "إجمالي السحوبات",
    highest_platform: "أعلى منصة إنفاق",
    spend_period: "صرف (اليوم / الشهر)",
    days_forecast: "تنبؤ بالرصيد المتبقي",
    today_spend: "اليوم",
    month_spend: "الشهر",
    times: "عمليات",
    avg_withdrawal: "م.سحب:",
    daily_avg_spend: "م.الصرف اليومي:",
    max_topup: "أكبر عملية شحن:",
    max_withdrawal: "أكبر عملية سحب:",
    highest_spend_day: "أعلى يوم صرف:",
    analytics_charts: "الرسوم البيانية والتحليل",
    chart_balance_time: "حركة الرصيد التراكمية",
    chart_platform_pie: "توزيع الإنفاق حسب المنصات",
    chart_daily_spend: "الصرف اليومي",
    chart_monthly_spend: "الصرف الشهري",
    transaction_history: "سجل المعاملات",
    filter_all: "الكل",
    filter_today: "اليوم",
    filter_yesterday: "أمس",
    filter_7d: "آخر 7 أيام",
    filter_30d: "آخر 30 يوم",
    filter_custom: "مخصص",
    from_date: "من تاريخ",
    to_date: "إلى تاريخ",
    apply: "تطبيق",
    reset: "إعادة تعيين",
    timeline: "الجدول الزمني",
    audit_log: "سجل المراجعة",
    empty_transactions: "لا توجد معاملات بعد. أضف شحن أو سحب للبدء!",
    empty_audit: "سجل المراجعة فارغ.",
    platform: "المنصة",
    amount: "المبلغ",
    date: "التاريخ",
    status: "حالة العملية",
    notes: "ملاحظات",
    cancel: "إلغاء",
    save: "حفظ",
    confirm_delete_title: "تأكيد الحذف",
    confirm_delete_msg: "هل أنت متأكد من رغبتك في حذف هذه المعاملة بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.",
    delete: "حذف المعاملة",
    settings_title: "إعدادات النظام",
    currency: "العملة",
    low_warning_limit: "تنبيه انخفاض الرصيد (تحذير)",
    critical_warning_limit: "تنبيه انخفاض الرصيد (حرج)",
    default_lang: "اللغة الافتراضية",
    theme: "المظهر",
    toast_save_success: "تم حفظ المعاملة بنجاح!",
    toast_delete_success: "تم حذف المعاملة بنجاح!",
    toast_settings_success: "تم حفظ الإعدادات بنجاح!",
    alert_low_balance: "تحذير: الرصيد منخفض، يرجى الشحن قريبًا.",
    alert_critical_balance: "تنبيه حرج: الرصيد شارف على النفاد!",
    alert_days_remain: "تنبيه: الرصيد المتبقي يكفي لـ {days} أيام فقط بناءً على معدل الصرف اليومي.",
    alert_no_activity: "تنبيه: لم يتم تسجيل أي عملية شحن رصيد منذ 15 يومًا.",
    alert_spend_spike: "تنبيه: الصرف اليومي أعلى بنسبة 40% من المتوسط اليومي العام.",
    topup_title: "شحن رصيد",
    withdrawal_title: "سحب للمنصة",
    action_create: "إضافة عملية",
    action_update: "تعديل عملية",
    action_delete: "حذف عملية"
  },
  en: {
    add_topup: "+ Add Top-up",
    add_withdrawal: "+ Add Withdrawal",
    notifications: "Insights & Alerts",
    clear_all: "Clear All",
    no_notifications: "No active alerts currently.",
    loading: "Loading...",
    offline_msg: "You are currently offline. Recent changes may not sync immediately.",
    card_limit: "Card Balance Status",
    current_balance: "Current Balance",
    net_cashflow: "Net Cash Flow",
    total_topups: "Total Top-ups",
    total_withdrawals: "Total Withdrawals",
    highest_platform: "Top Spend Platform",
    spend_period: "Spend (Today / Month)",
    days_forecast: "Balance Runout Forecast",
    today_spend: "Today",
    month_spend: "Month",
    times: "trx",
    avg_withdrawal: "Avg W/D:",
    daily_avg_spend: "Avg Daily Spend:",
    max_topup: "Largest Topup:",
    max_withdrawal: "Largest Withdrawal:",
    highest_spend_day: "Highest Spend Day:",
    analytics_charts: "Analytics & Charts",
    chart_balance_time: "Cumulative Running Balance",
    chart_platform_pie: "Platform Spending Distribution",
    chart_daily_spend: "Daily Spending Trends",
    chart_monthly_spend: "Monthly Spending Trends",
    transaction_history: "Transaction Ledger",
    filter_all: "All",
    filter_today: "Today",
    filter_yesterday: "Yesterday",
    filter_7d: "Last 7 Days",
    filter_30d: "Last 30 Days",
    filter_custom: "Custom Range",
    from_date: "From Date",
    to_date: "To Date",
    apply: "Apply",
    reset: "Reset",
    timeline: "Timeline View",
    audit_log: "Audit Logs",
    empty_transactions: "No transactions found yet. Add one to get started!",
    empty_audit: "Audit log is empty.",
    platform: "Platform",
    amount: "Amount",
    date: "Date",
    status: "Status",
    notes: "Notes",
    cancel: "Cancel",
    save: "Save",
    confirm_delete_title: "Confirm Deletion",
    confirm_delete_msg: "Are you sure you want to permanently delete this transaction? This action cannot be undone.",
    delete: "Delete Transaction",
    settings_title: "System Settings",
    currency: "Currency",
    low_warning_limit: "Low Balance Warning Level",
    critical_warning_limit: "Critical Balance Warning Level",
    default_lang: "Default Language",
    theme: "Theme Mode",
    toast_save_success: "Transaction saved successfully!",
    toast_delete_success: "Transaction deleted successfully!",
    toast_settings_success: "Settings updated successfully!",
    alert_low_balance: "Warning: Low Balance. Please recharge soon.",
    alert_critical_balance: "Critical: Balance is extremely low!",
    alert_days_remain: "Alert: Balance will run out in about {days} days based on your daily rate.",
    alert_no_activity: "Alert: No top-ups logged in the past 15 days.",
    alert_spend_spike: "Alert: Today's spend is 40% higher than your overall daily average.",
    topup_title: "Top-up Account",
    withdrawal_title: "Platform Withdrawal",
    action_create: "Add transaction",
    action_update: "Update transaction",
    action_delete: "Delete transaction"
  }
};

// 3. APPLICATION STATE
let currentLang = localStorage.getItem('findash_lang') || 'ar';
let currentTheme = localStorage.getItem('findash_theme') || 'dark';
let appSettings = {
  currency: 'SAR',
  low_balance_warning: 500,
  critical_balance: 100,
  default_language: 'ar',
  theme: 'dark'
};
let platformsList = [];
let transactionsList = [];
let auditLogsList = [];
let timeframeFilter = '7'; // Days for charts
let fastFilter = 'all';
let deleteTargetId = null;

// Chart JS Instances
let chartBalanceInstance = null;
let chartPlatformInstance = null;
let chartDailyInstance = null;
let chartMonthlyInstance = null;

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered'))
      .catch(err => console.log('Service Worker Failed to Register', err));
  });
}

// 4. LANGUAGE & TRANSLATION ENGINE
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('findash_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Update translation elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });

  // Modify placeholder strings
  const searchInput = document.getElementById('search-notes');
  if (searchInput) {
    searchInput.placeholder = lang === 'ar' 
      ? 'بحث بالملاحظات أو رقم العملية...' 
      : 'Search notes or transaction code...';
  }
  
  // Re-draw text labels in graphs and timeline items
  if (supabase) {
    calculateAndRenderAll();
  }
}

// 5. TOAST & NOTIFICATION CONTROLLER
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
    <span>${msg}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function showLoader(show) {
  const loader = document.getElementById('global-loader');
  if (show) loader.classList.remove('hidden');
  else loader.classList.add('hidden');
}

// 6. ONLINE / OFFLINE DETECTOR
window.addEventListener('online', () => {
  document.getElementById('offline-banner').classList.add('hidden');
  showToast(currentLang === 'ar' ? 'أنت متصل بالإنترنت الآن' : 'You are now online', 'success');
  syncData();
});

window.addEventListener('offline', () => {
  document.getElementById('offline-banner').classList.remove('hidden');
  showToast(currentLang === 'ar' ? 'فقد الاتصال بالإنترنت' : 'You are now offline', 'error');
});

// Check Supabase Credentials form if keys are missing
function checkSupabaseConfiguration() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    setTimeout(() => {
      openSettingsModal();
      const banner = document.getElementById('smart-insight-banner');
      const textEl = document.getElementById('insight-text');
      textEl.textContent = currentLang === 'ar' 
        ? '⚠️ الرجاء إدخال إعدادات الاتصال بـ Supabase (URL & Key) في لوحة الإعدادات للبدء.' 
        : '⚠️ Please enter your Supabase connection credentials (URL & Key) in the settings panel to get started.';
      banner.className = 'insight-banner alert-critical';
      banner.classList.remove('hidden');
    }, 500);
  }
}

// 7. INITIAL STARTUP CONTROLLERS & EVENT BINDINGS
document.addEventListener('DOMContentLoaded', () => {
  // Initialize icons
  lucide.createIcons();

  // Settings load
  document.body.className = currentTheme === 'dark' ? 'dark-theme' : 'light-theme';
  setLanguage(currentLang);
  
  // Prompt for keys if not exists
  checkSupabaseConfiguration();

  // If Supabase initialized, fetch data directly (No auth checking)
  if (supabase) {
    syncData();
  }

  // Lang Toggle Buttons
  document.getElementById('dashboard-lang-btn').addEventListener('click', () => {
    setLanguage(currentLang === 'ar' ? 'en' : 'ar');
  });

  // Theme Toggle Button
  document.getElementById('dashboard-theme-btn').addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('findash_theme', currentTheme);
    document.body.className = currentTheme === 'dark' ? 'dark-theme' : 'light-theme';
    document.getElementById('dashboard-theme-btn').innerHTML = currentTheme === 'dark' 
      ? '<i data-lucide="sun"></i>' 
      : '<i data-lucide="moon"></i>';
    lucide.createIcons();
    calculateAndRenderAll(); // redraw charts with new grid colors
  });

  // Settings form save handler
  document.getElementById('settings-form').addEventListener('submit', saveSettings);

  // Modal Triggers
  document.getElementById('quick-topup-btn').addEventListener('click', () => openTransactionModal('topup'));
  document.getElementById('quick-withdraw-btn').addEventListener('click', () => openTransactionModal('withdrawal'));
  document.getElementById('dashboard-settings-btn').addEventListener('click', openSettingsModal);
  
  // Transaction Submit
  document.getElementById('transaction-form').addEventListener('submit', handleTransactionSubmit);
  
  // Confirm Delete
  document.getElementById('confirm-delete-btn').addEventListener('click', deleteTransaction);

  // Timeframe selector bindings
  document.querySelectorAll('.chart-timeframe-selectors button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.chart-timeframe-selectors button').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      timeframeFilter = e.target.getAttribute('data-timeframe');
      calculateAndRenderAll();
    });
  });

  // Fast filter timeline bindings
  document.querySelectorAll('.history-fast-filters button').forEach(btn => {
    if (btn.id !== 'btn-custom-filter') {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.history-fast-filters button').forEach(b => b.classList.remove('btn-fastactive'));
        e.target.classList.add('btn-fastactive');
        fastFilter = e.target.getAttribute('data-fast-filter');
        document.getElementById('custom-filters-wrapper').classList.add('hidden');
        renderTimeline();
      });
    }
  });

  // Custom filter timeline drawer
  document.getElementById('btn-custom-filter').addEventListener('click', (e) => {
    document.querySelectorAll('.history-fast-filters button').forEach(b => b.classList.remove('btn-fastactive'));
    e.target.classList.add('btn-fastactive');
    fastFilter = 'custom';
    document.getElementById('custom-filters-wrapper').classList.remove('hidden');
  });

  // Custom date triggers
  document.getElementById('apply-filters-btn').addEventListener('click', renderTimeline);
  document.getElementById('reset-filters-btn').addEventListener('click', () => {
    document.getElementById('filter-start-date').value = '';
    document.getElementById('filter-end-date').value = '';
    document.getElementById('search-notes').value = '';
    renderTimeline();
  });

  // Export actions
  document.getElementById('export-csv-btn').addEventListener('click', () => exportData('csv'));
  document.getElementById('export-excel-btn').addEventListener('click', () => exportData('xls'));
  document.getElementById('export-pdf-btn').addEventListener('click', () => window.print());

  // Notification center clear/toggle
  document.getElementById('noti-toggle-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('noti-panel').classList.toggle('hidden');
  });
  
  document.getElementById('clear-noti-btn').addEventListener('click', () => {
    document.getElementById('noti-list').innerHTML = `
      <div class="empty-noti">${i18n[currentLang].no_notifications}</div>
    `;
    document.getElementById('noti-badge').classList.add('hidden');
  });

  document.addEventListener('click', () => {
    document.getElementById('noti-panel').classList.add('hidden');
  });

  // Tabs controls
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      e.target.classList.add('active');
      document.getElementById(e.target.getAttribute('data-tab')).classList.add('active');
    });
  });
});

// 9. DATABASE LOGIC (FETCH AND SYNC)
async function syncData() {
  if (!supabase) return;
  showLoader(true);

  try {
    // 1. Fetch Platforms
    const { data: platforms, error: pError } = await supabase
      .from('platforms')
      .select('*')
      .eq('active', true);
      
    if (pError) throw pError;
    platformsList = platforms || [];

    // 2. Fetch Global Settings (Single row)
    const { data: settings, error: sError } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (sError) throw sError;
    if (settings) {
      appSettings = settings;
    } else {
      // Create single default settings if not exists
      const { data: newSettings, error: nsError } = await supabase
        .from('settings')
        .insert({
          currency: 'SAR',
          low_balance_warning: 500,
          critical_balance: 100,
          default_language: currentLang,
          theme: currentTheme
        })
        .select()
        .single();
        
      if (nsError) throw nsError;
      appSettings = newSettings;
    }

    // 3. Fetch Transactions
    const { data: transactions, error: tError } = await supabase
      .from('transactions')
      .select('*, platforms(name, color, icon)')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (tError) throw tError;
    transactionsList = transactions || [];

    // 4. Fetch Audit Activity Logs
    const { data: logs, error: lError } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (lError) throw lError;
    auditLogsList = logs || [];

    // Synchronize Sync Header Time
    const now = new Date();
    document.getElementById('last-sync-time').textContent = `Last Sync: ${now.toLocaleDateString()} ${now.toTimeString().substring(0, 5)}`;
    
    // Perform Analytics Calculations & Visual Rendering
    calculateAndRenderAll();

  } catch (err) {
    showToast(err.message, 'error');
    console.error(err);
  } finally {
    showLoader(false);
  }
}

// Log actions to the audit log table
async function logActivity(trxId, action, oldValue, newValue) {
  if (!supabase) return;
  const details = JSON.stringify({ old: oldValue, new: newValue });
  
  await supabase.from('activity_logs').insert({
    transaction_id: trxId,
    action: action,
    details: details
  });
}

// 10. STATISTICS CALCULATION ENGINE & COMPILER
function calculateAndRenderAll() {
  // Sort transactions chronologically to calculate running balance correctly
  const chronoTrx = [...transactionsList].sort((a, b) => {
    const diff = new Date(a.date) - new Date(b.date);
    if (diff !== 0) return diff;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  // Calculate cumulative balances dynamically
  let balanceAccumulator = 0;
  chronoTrx.forEach(trx => {
    if (trx.status === 'Completed') {
      if (trx.type === 'topup') {
        balanceAccumulator += parseFloat(trx.amount);
      } else {
        balanceAccumulator -= parseFloat(trx.amount);
      }
    }
    trx.dynamic_running_balance = balanceAccumulator;
  });

  // Recount current values
  let currentBalance = balanceAccumulator;
  let totalTopups = 0;
  let topupCount = 0;
  let totalWithdrawals = 0;
  let withdrawalCount = 0;
  let maxTopup = 0;
  let maxWithdrawal = 0;

  // Platform spending maps
  const platformSpend = {};
  platformsList.forEach(p => platformSpend[p.name] = 0);
  
  // Date spends map
  const dailySpendMap = {};
  const monthlySpendMap = {};

  transactionsList.forEach(trx => {
    const amt = parseFloat(trx.amount);
    if (trx.status === 'Completed') {
      if (trx.type === 'topup') {
        totalTopups += amt;
        topupCount++;
        if (amt > maxTopup) maxTopup = amt;
      } else {
        totalWithdrawals += amt;
        withdrawalCount++;
        if (amt > maxWithdrawal) maxWithdrawal = amt;

        // Platform spend accumulation
        const pName = trx.platforms ? trx.platforms.name : 'Other';
        platformSpend[pName] = (platformSpend[pName] || 0) + amt;

        // Daily spend maps
        dailySpendMap[trx.date] = (dailySpendMap[trx.date] || 0) + amt;
        
        // Monthly spend maps
        const mKey = trx.date.substring(0, 7); // YYYY-MM
        monthlySpendMap[mKey] = (monthlySpendMap[mKey] || 0) + amt;
      }
    }
  });

  // 1. Current Balance Indicator
  const balanceEl = document.getElementById('kpi-balance');
  balanceEl.textContent = formatCurrencyValue(currentBalance);
  document.getElementById('kpi-balance-currency').textContent = appSettings.currency;
  
  if (currentBalance <= appSettings.critical_balance) {
    balanceEl.className = "kpi-value text-danger";
  } else if (currentBalance <= appSettings.low_balance_warning) {
    balanceEl.className = "kpi-value text-warning";
  } else {
    balanceEl.className = "kpi-value text-success";
  }

  // 2. Net Cashflow (Total Inflow - Total Outflow)
  const netFlow = totalTopups - totalWithdrawals;
  const netFlowEl = document.getElementById('kpi-netflow');
  netFlowEl.textContent = formatCurrencyValue(netFlow);
  document.getElementById('kpi-netflow-currency').textContent = appSettings.currency;
  netFlowEl.className = netFlow >= 0 ? "kpi-value text-success" : "kpi-value text-danger";

  // 3. Topups Card
  document.getElementById('kpi-topups').textContent = formatCurrencyValue(totalTopups);
  document.getElementById('kpi-topups-count').textContent = topupCount;

  // 4. Withdrawals Card
  document.getElementById('kpi-withdrawals').textContent = formatCurrencyValue(totalWithdrawals);
  document.getElementById('kpi-withdrawals-count').textContent = withdrawalCount;

  // 5. Highest Platform Spending
  let highestPlatform = '-';
  let highestPlatformAmt = 0;
  for (const plat in platformSpend) {
    if (platformSpend[plat] > highestPlatformAmt) {
      highestPlatformAmt = platformSpend[plat];
      highestPlatform = plat;
    }
  }
  document.getElementById('kpi-high-platform').textContent = highestPlatformAmt > 0 ? highestPlatform : '-';
  const avgWithdrawal = withdrawalCount > 0 ? (totalWithdrawals / withdrawalCount) : 0;
  document.getElementById('kpi-avg-withdrawal').textContent = formatCurrencyValue(avgWithdrawal);

  // 6. Today and Month Spends
  const todayStr = new Date().toISOString().substring(0, 10);
  const thisMonthStr = new Date().toISOString().substring(0, 7);
  
  const todaySpend = dailySpendMap[todayStr] || 0;
  const monthSpend = Object.keys(monthlySpendMap)
    .filter(k => k === thisMonthStr)
    .reduce((sum, k) => sum + monthlySpendMap[k], 0);

  document.getElementById('kpi-today-spend').textContent = formatCurrencyValue(todaySpend);
  document.getElementById('kpi-month-spend').textContent = formatCurrencyValue(monthSpend);

  // 7. Days Remaining Forecast
  // Calculate average daily spend on active withdrawal days or over a fixed window (e.g. past 30 days)
  const uniqueSpendDays = Object.keys(dailySpendMap).length;
  const dailyAverageSpend = uniqueSpendDays > 0 ? (totalWithdrawals / uniqueSpendDays) : 0;
  document.getElementById('kpi-daily-avg').textContent = formatCurrencyValue(dailyAverageSpend);

  const forecastDaysEl = document.getElementById('kpi-forecast-days');
  if (dailyAverageSpend > 0 && currentBalance > 0) {
    const daysLeft = Math.round(currentBalance / dailyAverageSpend);
    forecastDaysEl.textContent = daysLeft;
  } else {
    forecastDaysEl.textContent = '-';
  }

  // 8. Progress Limit Status Bar (Balance / Total Topups)
  const progressPercent = totalTopups > 0 ? Math.min(100, Math.max(0, (currentBalance / totalTopups) * 100)) : 0;
  const progressFill = document.getElementById('card-progress-fill');
  progressFill.style.width = `${progressPercent}%`;
  document.getElementById('progress-percent').textContent = `${Math.round(progressPercent)}%`;
  document.getElementById('progress-remaining').textContent = `${formatCurrencyValue(currentBalance)} ${appSettings.currency} Remaining`;

  // Color transition for progress bar
  if (progressPercent <= 15) {
    progressFill.style.background = 'var(--danger-color)';
  } else if (progressPercent <= 40) {
    progressFill.style.background = 'var(--warning-color)';
  } else {
    progressFill.style.background = 'var(--success-color)';
  }

  // Maximum Metas
  document.getElementById('meta-max-topup').textContent = formatCurrencyValue(maxTopup);
  document.getElementById('meta-max-withdrawal').textContent = formatCurrencyValue(maxWithdrawal);
  
  let maxSpendDay = '-';
  let maxSpendDayAmt = 0;
  for (const day in dailySpendMap) {
    if (dailySpendMap[day] > maxSpendDayAmt) {
      maxSpendDayAmt = dailySpendMap[day];
      maxSpendDay = day;
    }
  }
  document.getElementById('meta-max-spend-day').textContent = maxSpendDayAmt > 0 ? `${maxSpendDay} (${formatCurrencyValue(maxSpendDayAmt)})` : '-';

  // 9. Process Smart Alerts & Notification Center
  processSmartAlerts(currentBalance, dailyAverageSpend, chronoTrx, todaySpend, dailyAverageSpend);

  // 10. Draw Charts and Render Timeline
  renderCharts(chronoTrx, platformSpend, dailySpendMap, monthlySpendMap);
  renderTimeline();
  renderAuditLogs();
}

function formatCurrencyValue(val) {
  return parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 11. SMART INSIGHTS ENGINE
function processSmartAlerts(balance, dailyAvg, chronoTrx, todaySpend, overallDailyAvg) {
  const alertsList = [];
  
  // Alert 1: Low balance
  if (balance <= appSettings.critical_balance) {
    alertsList.push({
      text: i18n[currentLang].alert_critical_balance,
      type: 'critical',
      icon: 'alert-triangle'
    });
  } else if (balance <= appSettings.low_balance_warning) {
    alertsList.push({
      text: i18n[currentLang].alert_low_balance,
      type: 'warning',
      icon: 'alert-circle'
    });
  }

  // Alert 2: Runout prediction
  if (dailyAvg > 0 && balance > 0) {
    const daysLeft = Math.round(balance / dailyAvg);
    if (daysLeft <= 3) {
      alertsList.push({
        text: i18n[currentLang].alert_days_remain.replace('{days}', daysLeft),
        type: 'critical',
        icon: 'hourglass'
      });
    }
  }

  // Alert 3: Inactivity warning (No top-up for 15 days)
  const topups = transactionsList.filter(t => t.type === 'topup');
  if (topups.length > 0) {
    const lastTopupDate = new Date(topups[0].date);
    const daysSinceLast = Math.round((new Date() - lastTopupDate) / (1000 * 60 * 60 * 24));
    if (daysSinceLast >= 15) {
      alertsList.push({
        text: i18n[currentLang].alert_no_activity,
        type: 'warning',
        icon: 'calendar'
      });
    }
  }

  // Alert 4: Spending spike (Today's spend is 40% higher than average daily spend)
  if (overallDailyAvg > 0 && todaySpend > (overallDailyAvg * 1.4)) {
    alertsList.push({
      text: i18n[currentLang].alert_spend_spike,
      type: 'info',
      icon: 'zap'
    });
  }

  // Render Notification list dropdown
  const notiList = document.getElementById('noti-list');
  const notiBadge = document.getElementById('noti-badge');
  
  if (alertsList.length > 0) {
    notiBadge.textContent = alertsList.length;
    notiBadge.classList.remove('hidden');
    
    notiList.innerHTML = alertsList.map(a => `
      <div class="noti-item ${a.type}">
        <i data-lucide="${a.icon}"></i>
        <span>${a.text}</span>
      </div>
    `).join('');
    
    // Highlight the main warning at the top of the dashboard
    const banner = document.getElementById('smart-insight-banner');
    const textEl = document.getElementById('insight-text');
    textEl.textContent = alertsList[0].text;
    banner.className = `insight-banner alert-${alertsList[0].type}`;
    banner.classList.remove('hidden');
  } else {
    notiBadge.classList.add('hidden');
    notiList.innerHTML = `<div class="empty-noti">${i18n[currentLang].no_notifications}</div>`;
    document.getElementById('smart-insight-banner').classList.add('hidden');
  }
  lucide.createIcons();
}

// 12. DRAW GRAPHS WITH CHART.JS
function renderCharts(chronoTrx, platformSpend, dailySpendMap, monthlySpendMap) {
  // Common visual config based on current theme
  const gridColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)';
  const labelColor = currentTheme === 'dark' ? '#94a3b8' : '#475569';
  
  // Filter data according to timeframe selection
  let cutoffDate = new Date();
  if (timeframeFilter !== 'all') {
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeframeFilter));
  } else {
    cutoffDate = new Date(0); // Epoch start
  }

  // Filter chronologic lists for line graph
  const filteredChrono = chronoTrx.filter(t => new Date(t.date) >= cutoffDate);
  const lineLabels = filteredChrono.map(t => t.date);
  const lineData = filteredChrono.map(t => t.dynamic_running_balance);

  // Line Chart (Balance Over Time)
  if (chartBalanceInstance) chartBalanceInstance.destroy();
  const ctxBalance = document.getElementById('chart-balance').getContext('2d');
  chartBalanceInstance = new Chart(ctxBalance, {
    type: 'line',
    data: {
      labels: lineLabels,
      datasets: [{
        label: currentLang === 'ar' ? 'الرصيد التراكمي' : 'Running Balance',
        data: lineData,
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.15)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: labelColor } },
        y: { grid: { color: gridColor }, ticks: { color: labelColor } }
      },
      plugins: { legend: { display: false } }
    }
  });

  // Pie Chart (Spending by Platform)
  const pieLabels = Object.keys(platformSpend);
  const pieData = Object.values(platformSpend);
  const pieColors = platformsList.map(p => p.color || '#cbd5e1');

  if (chartPlatformInstance) chartPlatformInstance.destroy();
  const ctxPlatform = document.getElementById('chart-platform').getContext('2d');
  chartPlatformInstance = new Chart(ctxPlatform, {
    type: 'doughnut',
    data: {
      labels: pieLabels,
      datasets: [{
        data: pieData,
        backgroundColor: pieColors.length ? pieColors : ['#1877f2', '#000000', '#fffc00'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: labelColor }, position: 'bottom' }
      }
    }
  });

  // Daily Spending Chart
  const sortedDays = Object.keys(dailySpendMap)
    .filter(d => new Date(d) >= cutoffDate)
    .sort();
  const dailyLabels = sortedDays;
  const dailyData = sortedDays.map(d => dailySpendMap[d]);

  if (chartDailyInstance) chartDailyInstance.destroy();
  const ctxDaily = document.getElementById('chart-daily').getContext('2d');
  chartDailyInstance = new Chart(ctxDaily, {
    type: 'bar',
    data: {
      labels: dailyLabels,
      datasets: [{
        label: currentLang === 'ar' ? 'الإنفاق اليومي' : 'Daily Spend',
        data: dailyData,
        backgroundColor: 'rgba(251, 113, 133, 0.85)',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: labelColor } },
        y: { grid: { color: gridColor }, ticks: { color: labelColor } }
      },
      plugins: { legend: { display: false } }
    }
  });

  // Monthly Spending Chart
  const sortedMonths = Object.keys(monthlySpendMap).sort();
  const monthlyLabels = sortedMonths;
  const monthlyData = sortedMonths.map(m => monthlySpendMap[m]);

  if (chartMonthlyInstance) chartMonthlyInstance.destroy();
  const ctxMonthly = document.getElementById('chart-monthly').getContext('2d');
  chartMonthlyInstance = new Chart(ctxMonthly, {
    type: 'bar',
    data: {
      labels: monthlyLabels,
      datasets: [{
        label: currentLang === 'ar' ? 'الإنفاق الشهري' : 'Monthly Spend',
        data: monthlyData,
        backgroundColor: 'rgba(34, 211, 238, 0.85)',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: labelColor } },
        y: { grid: { color: gridColor }, ticks: { color: labelColor } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// 13. LEDGER TIMELINE RENDERING
function renderTimeline() {
  const container = document.getElementById('timeline-list');
  
  // Fast filter dates cutoff
  let startFilterDate = null;
  let endFilterDate = null;
  const today = new Date();

  if (fastFilter === 'today') {
    startFilterDate = new Date(today.setHours(0,0,0,0));
  } else if (fastFilter === 'yesterday') {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    startFilterDate = new Date(yesterday.setHours(0,0,0,0));
    endFilterDate = new Date(yesterday.setHours(23,59,59,999));
  } else if (fastFilter === '7days') {
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - 7);
    startFilterDate = new Date(cutoff.setHours(0,0,0,0));
  } else if (fastFilter === '30days') {
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - 30);
    startFilterDate = new Date(cutoff.setHours(0,0,0,0));
  } else if (fastFilter === 'custom') {
    const sd = document.getElementById('filter-start-date').value;
    const ed = document.getElementById('filter-end-date').value;
    if (sd) startFilterDate = new Date(sd);
    if (ed) {
      endFilterDate = new Date(ed);
      endFilterDate.setHours(23,59,59,999);
    }
  }

  // Filter notes/search query
  const searchVal = document.getElementById('search-notes').value.toLowerCase();

  const filteredList = transactionsList.filter(t => {
    const tDate = new Date(t.date);
    if (startFilterDate && tDate < startFilterDate) return false;
    if (endFilterDate && tDate > endFilterDate) return false;
    
    if (searchVal) {
      const matchText = (t.notes || '').toLowerCase() + (t.transaction_number || '').toLowerCase();
      if (!matchText.includes(searchVal)) return false;
    }
    return true;
  });

  if (filteredList.length === 0) {
    container.innerHTML = `<div class="empty-list">${i18n[currentLang].empty_transactions}</div>`;
    return;
  }

  container.innerHTML = filteredList.map(t => {
    const isTopup = t.type === 'topup';
    const amountVal = isTopup ? `+${formatCurrencyValue(t.amount)}` : `-${formatCurrencyValue(t.amount)}`;
    const platformName = t.platforms ? t.platforms.name : '';
    const platformColor = t.platforms ? t.platforms.color : '';
    const iconName = isTopup ? 'arrow-up-right' : 'arrow-down-left';
    
    return `
      <div class="timeline-item">
        <div class="timeline-left">
          <div class="timeline-icon ${isTopup ? 'topup-icon' : 'withdrawal-icon'}">
            <i data-lucide="${iconName}"></i>
          </div>
          <div class="timeline-meta">
            <div class="timeline-title">
              ${isTopup ? i18n[currentLang].topup_title : `${i18n[currentLang].withdrawal_title} (${platformName})`}
              <span class="status-chip ${t.status.toLowerCase()}">${t.status}</span>
            </div>
            <div class="timeline-sub-details">
              <span class="date-badge">${t.date}</span>
              <span>•</span>
              <span class="trx-id-label">${t.transaction_number || ''}</span>
              ${t.notes ? `<span>•</span> <span class="notes-preview" title="${t.notes}">${t.notes}</span>` : ''}
            </div>
          </div>
        </div>

        <div class="timeline-right">
          <div class="timeline-value-box">
            <span class="timeline-amount ${isTopup ? 'topup-amount' : 'withdrawal-amount'}">${amountVal} ${appSettings.currency}</span>
            <span class="timeline-running-balance">${formatCurrencyValue(t.dynamic_running_balance || 0)} ${appSettings.currency}</span>
          </div>
          <div class="timeline-actions">
            <button class="btn btn-icon btn-sm" onclick="openTransactionModal('${t.type}', '${t.id}')">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn btn-icon btn-sm text-danger" onclick="openDeleteConfirmModal('${t.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  lucide.createIcons();
}

function renderAuditLogs() {
  const container = document.getElementById('audit-logs-list');
  if (auditLogsList.length === 0) {
    container.innerHTML = `<div class="empty-list">${i18n[currentLang].empty_audit}</div>`;
    return;
  }

  container.innerHTML = auditLogsList.map(log => {
    let actionLabel = log.action;
    if (i18n[currentLang][`action_${log.action.toLowerCase()}`]) {
      actionLabel = i18n[currentLang][`action_${log.action.toLowerCase()}`];
    }
    const logDate = new Date(log.created_at).toLocaleString();
    
    return `
      <div class="audit-log-item">
        <div class="audit-log-header">
          <span>${actionLabel}</span>
          <span>${logDate}</span>
        </div>
        <div class="audit-log-body">
          ${log.details}
        </div>
      </div>
    `;
  }).join('');
}

// 14. TRANSACTIONS MODAL FORM CRUD
function openTransactionModal(type, trxId = null) {
  const modal = document.getElementById('transaction-modal');
  const title = document.getElementById('modal-title');
  const platformGroup = document.getElementById('modal-platform-group');
  
  // Set defaults
  document.getElementById('edit-trx-id').value = trxId || '';
  document.getElementById('edit-trx-type').value = type;
  document.getElementById('modal-amount').value = '';
  document.getElementById('modal-date').value = new Date().toISOString().substring(0, 10);
  document.getElementById('modal-status').value = 'Completed';
  document.getElementById('modal-notes').value = '';
  
  // Platform options render
  const selectPlat = document.getElementById('modal-platform');
  selectPlat.innerHTML = platformsList.map(p => `
    <option value="${p.id}">${p.name}</option>
  `).join('');

  if (type === 'topup') {
    title.textContent = currentLang === 'ar' ? 'إضافة شحن رصيد' : 'Add Top-up';
    platformGroup.classList.add('hidden');
  } else {
    title.textContent = currentLang === 'ar' ? 'إضافة سحب للمنصة' : 'Add Withdrawal';
    platformGroup.classList.remove('hidden');
  }

  // If editing, fill fields
  if (trxId) {
    const trx = transactionsList.find(t => t.id === trxId);
    if (trx) {
      title.textContent = currentLang === 'ar' ? 'تعديل المعاملة' : 'Modify Transaction';
      document.getElementById('modal-amount').value = trx.amount;
      document.getElementById('modal-date').value = trx.date;
      document.getElementById('modal-status').value = trx.status;
      document.getElementById('modal-notes').value = trx.notes || '';
      
      if (trx.platform_id) {
        selectPlat.value = trx.platform_id;
      }
    }
  }

  modal.classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

async function handleTransactionSubmit(e) {
  e.preventDefault();
  if (!supabase) return;
  showLoader(true);

  const trxId = document.getElementById('edit-trx-id').value;
  const type = document.getElementById('edit-trx-type').value;
  const amount = parseFloat(document.getElementById('modal-amount').value);
  const date = document.getElementById('modal-date').value;
  const status = document.getElementById('modal-status').value;
  const notes = document.getElementById('modal-notes').value;
  const platformId = type === 'withdrawal' ? document.getElementById('modal-platform').value : null;

  const trxData = {
    type,
    amount,
    date,
    status,
    notes,
    platform_id: platformId,
    created_by: 'Admin',
    updated_at: new Date().toISOString()
  };

  try {
    if (trxId) {
      // Find old transaction for audit trail
      const oldTrx = transactionsList.find(t => t.id === trxId);
      
      // Update
      const { error } = await supabase
        .from('transactions')
        .update(trxData)
        .eq('id', trxId);
        
      if (error) throw error;
      
      await logActivity(trxId, 'UPDATE', oldTrx, trxData);
    } else {
      // Create new
      const { data, error } = await supabase
        .from('transactions')
        .insert(trxData)
        .select()
        .single();
        
      if (error) throw error;
      
      await logActivity(data.id, 'CREATE', null, trxData);
    }

    closeModal('transaction-modal');
    showToast(i18n[currentLang].toast_save_success, 'success');
    await syncData();

  } catch (err) {
    showToast(err.message, 'error');
    console.error(err);
  } finally {
    showLoader(false);
  }
}

// DELETE TRIGGER FLOW
function openDeleteConfirmModal(id) {
  deleteTargetId = id;
  document.getElementById('confirm-delete-modal').classList.remove('hidden');
}

async function deleteTransaction() {
  if (!deleteTargetId || !supabase) return;
  showLoader(true);

  try {
    const oldTrx = transactionsList.find(t => t.id === deleteTargetId);
    
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', deleteTargetId);
      
    if (error) throw error;

    await logActivity(deleteTargetId, 'DELETE', oldTrx, null);

    closeModal('confirm-delete-modal');
    showToast(i18n[currentLang].toast_delete_success, 'success');
    deleteTargetId = null;
    await syncData();

  } catch (err) {
    showToast(err.message, 'error');
    console.error(err);
  } finally {
    showLoader(false);
  }
}

// 15. SYSTEM SETTINGS PANEL MODAL
function openSettingsModal() {
  document.getElementById('settings-supabase-url').value = SUPABASE_URL;
  document.getElementById('settings-supabase-key').value = SUPABASE_ANON_KEY;
  document.getElementById('settings-currency').value = appSettings.currency;
  document.getElementById('settings-low-warning').value = appSettings.low_balance_warning;
  document.getElementById('settings-critical-warning').value = appSettings.critical_balance;
  document.getElementById('settings-lang').value = appSettings.default_language;
  document.getElementById('settings-theme').value = appSettings.theme;
  
  document.getElementById('settings-modal').classList.remove('hidden');
}

async function saveSettings(e) {
  e.preventDefault();
  showLoader(true);

  const url = document.getElementById('settings-supabase-url').value.trim();
  const key = document.getElementById('settings-supabase-key').value.trim();
  const currency = document.getElementById('settings-currency').value;
  const lowWarning = parseFloat(document.getElementById('settings-low-warning').value);
  const criticalWarning = parseFloat(document.getElementById('settings-critical-warning').value);
  const defaultLang = document.getElementById('settings-lang').value;
  const theme = document.getElementById('settings-theme').value;

  let keysChanged = (url !== SUPABASE_URL || key !== SUPABASE_ANON_KEY);
  if (keysChanged) {
    SUPABASE_URL = url;
    SUPABASE_ANON_KEY = key;
    localStorage.setItem('findash_supabase_url', url);
    localStorage.setItem('findash_supabase_key', key);
    initSupabase();
  }

  try {
    if (supabase && appSettings && appSettings.id) {
      const { error } = await supabase
        .from('settings')
        .update({
          currency,
          low_balance_warning: lowWarning,
          critical_balance: criticalWarning,
          default_language: defaultLang,
          theme,
          updated_at: new Date().toISOString()
        })
        .eq('id', appSettings.id);

      if (error) throw error;
    }

    appSettings.currency = currency;
    appSettings.low_balance_warning = lowWarning;
    appSettings.critical_balance = criticalWarning;
    appSettings.default_language = defaultLang;
    appSettings.theme = theme;

    closeModal('settings-modal');
    showToast(i18n[currentLang].toast_settings_success, 'success');
    
    // Apply changes instantly
    currentTheme = theme;
    localStorage.setItem('findash_theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    
    setLanguage(defaultLang);
    
    if (supabase) {
      await syncData();
    } else {
      showToast(currentLang === 'ar' ? 'تم حفظ المفاتيح محلياً، يرجى إعادة التحميل' : 'Keys saved locally, please reload', 'info');
    }

  } catch (err) {
    showToast(err.message, 'error');
    console.error(err);
  } finally {
    showLoader(false);
  }
}

// 16. CLIENT DATA EXPORTING (CSV & EXCEL)
function exportData(format) {
  let content = '';
  let mimeType = 'text/csv';
  let extension = 'csv';

  // Sort chronologically
  const sorted = [...transactionsList].sort((a,b) => new Date(a.date) - new Date(b.date));

  if (format === 'csv' || format === 'xls') {
    const headers = ['Transaction Number', 'Type', 'Platform', 'Amount', 'Date', 'Status', 'Notes', 'Created By', 'Created At'];
    const rows = sorted.map(t => [
      t.transaction_number || '',
      t.type,
      t.platforms ? t.platforms.name : '',
      t.amount,
      t.date,
      t.status,
      (t.notes || '').replace(/"/g, '""'),
      t.created_by || '',
      t.created_at
    ]);

    if (format === 'csv') {
      content = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
      mimeType = 'text/csv;charset=utf-8;';
    } else {
      // Basic HTML Excel Export
      content = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Ledger</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
        <body>
          <table border="1">
            <tr>${headers.map(h => `<th style="background:#818cf8;color:white">${h}</th>`).join('')}</tr>
            ${rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </table>
        </body>
        </html>
      `;
      mimeType = 'application/vnd.ms-excel';
      extension = 'xls';
    }
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `FinDash_Export_${new Date().toISOString().slice(0,10)}.${extension}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
