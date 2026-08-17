(function () {
  var storeMonth = {
    '洛阳泉舜': { area: '2区', revenue: 106397.80, target: 114058, completion: 93.28, cardCount: 193, newCardCount: 127, newRate: 37.46, newSmall: 63, newMid: 54, newLarge: 10, renewCount: 66, renewAmount: 31993, renewRate: 13.41, traffic: 41465.60 },
    '焦作万达': { area: '2区', revenue: 87756.70, target: 104893, completion: 83.66, cardCount: 183, newCardCount: 143, newRate: 56.75, newSmall: 67, newMid: 66, newLarge: 10, renewCount: 40, renewAmount: 19879, renewRate: 8.02, traffic: 65884.70 },
    '开封万达': { area: '3区', revenue: 84050.10, target: 87948, completion: 95.57, cardCount: 178, newCardCount: 158, newRate: 47.73, newSmall: 109, newMid: 45, newLarge: 4, renewCount: 20, renewAmount: 11000, renewRate: 7.46, traffic: 41315.70 },
    '武汉荟聚': { area: '3区', revenue: 82618.40, target: 114080, completion: 72.42, cardCount: 153, newCardCount: 144, newRate: 52.55, newSmall: 71, newMid: 58, newLarge: 15, renewCount: 9, renewAmount: 4700, renewRate: 4.25, traffic: 36337.00 },
    '襄阳高新万达': { area: '1区', revenue: 74521.20, target: 84866, completion: 87.81, cardCount: 187, newCardCount: 172, newRate: 56.58, newSmall: 119, newMid: 48, newLarge: 5, renewCount: 15, renewAmount: 5582, renewRate: 6.33, traffic: 26894.00 },
    '洛阳中州万达': { area: '2区', revenue: 62257.40, target: 64250, completion: 96.90, cardCount: 144, newCardCount: 114, newRate: 54.29, newSmall: 75, newMid: 36, newLarge: 3, renewCount: 30, renewAmount: 12266, renewRate: 12.93, traffic: 30443.20 },
    '郑州二七万象城': { area: '3区', revenue: 59915.20, target: 84240, completion: 71.12, cardCount: 120, newCardCount: 98, newRate: 41.35, newSmall: 60, newMid: 34, newLarge: 4, renewCount: 22, renewAmount: 9900, renewRate: 10.09, traffic: 16171.00 },
    '南阳吾悦': { area: '1区', revenue: 59670.00, target: 90176, completion: 66.17, cardCount: 128, newCardCount: 105, newRate: 64.02, newSmall: 46, newMid: 49, newLarge: 10, renewCount: 23, renewAmount: 10400, renewRate: 6.91, traffic: 31413.00 },
    '武汉武昌万象城': { area: '3区', revenue: 54131.00, target: 59265, completion: 91.34, cardCount: 87, newCardCount: 82, newRate: 51.25, newSmall: 24, newMid: 39, newLarge: 19, renewCount: 5, renewAmount: 2800, renewRate: 20.00, traffic: 20245.40 },
    '郑州美盛天街': { area: '3区', revenue: 52523.91, target: 65337, completion: 80.39, cardCount: 94, newCardCount: 77, newRate: 54.61, newSmall: 22, newMid: 43, newLarge: 12, renewCount: 17, renewAmount: 10176, renewRate: 14.29, traffic: 16515.00 },
    '南阳万达': { area: '1区', revenue: 51952.00, target: 77386, completion: 67.13, cardCount: 107, newCardCount: 84, newRate: 68.29, newSmall: 31, newMid: 45, newLarge: 8, renewCount: 23, renewAmount: 11231, renewRate: 7.40, traffic: 31601.00 },
    '许昌魏都万达': { area: '1区', revenue: 48368.40, target: 62266, completion: 77.68, cardCount: 96, newCardCount: 67, newRate: 54.03, newSmall: 25, newMid: 39, newLarge: 3, renewCount: 29, renewAmount: 14900, renewRate: 10.43, traffic: 16765.00 },
    '郑州惠济万达': { area: '2区', revenue: 39626.00, target: 80697, completion: 49.10, cardCount: 81, newCardCount: 49, newRate: 53.85, newSmall: 16, newMid: 30, newLarge: 3, renewCount: 32, renewAmount: 13276, renewRate: 12.90, traffic: 13227.00 },
    '郑州中原万达': { area: '3区', revenue: 39617.60, target: 80708, completion: 49.09, cardCount: 79, newCardCount: 69, newRate: 55.65, newSmall: 38, newMid: 25, newLarge: 6, renewCount: 10, renewAmount: 5199.80, renewRate: 6.54, traffic: 22057.00 },
    '周口万达': { area: '2区', revenue: 34979.40, target: 42416, completion: 82.47, cardCount: 74, newCardCount: 57, newRate: 39.86, newSmall: 20, newMid: 30, newLarge: 7, renewCount: 17, renewAmount: 7197, renewRate: 8.29, traffic: 10693.40 },
    '商丘万达': { area: '1区', revenue: 29093.20, target: 33700, completion: 86.33, cardCount: 72, newCardCount: 39, newRate: 56.52, newSmall: 12, newMid: 24, newLarge: 3, renewCount: 33, renewAmount: 12718, renewRate: 19.30, traffic: 15342.20 },
    '郑州信万': { area: '2区', revenue: 27560.00, target: 49218, completion: 56.00, cardCount: 54, newCardCount: 41, newRate: 54.67, newSmall: 7, newMid: 27, newLarge: 7, renewCount: 13, renewAmount: 5696, renewRate: 7.43, traffic: 15067.00 },
    '新乡万达': { area: '2区', revenue: 25134.00, target: 54531, completion: 46.09, cardCount: 40, newCardCount: 29, newRate: 25.22, newSmall: 16, newMid: 10, newLarge: 3, renewCount: 11, renewAmount: 4900, renewRate: 4.56, traffic: 17572.00 },
    '安阳万达': { area: '3区', revenue: 23245.00, target: 45828, completion: 50.72, cardCount: 39, newCardCount: 24, newRate: 28.57, newSmall: 8, newMid: 12, newLarge: 4, renewCount: 15, renewAmount: 7000, renewRate: 11.03, traffic: 21632.00 },
    '信阳万达': { area: '1区', revenue: 21312.00, target: 28808, completion: 73.98, cardCount: 57, newCardCount: 39, newRate: 73.58, newSmall: 13, newMid: 22, newLarge: 4, renewCount: 18, renewAmount: 6590.05, renewRate: 15.52, traffic: 6826.45 },
    '安阳滑县吾悦': { area: '3区', revenue: 16374.05, target: 42942, completion: 38.13, cardCount: 39, newCardCount: 34, newRate: 37.78, newSmall: 8, newMid: 13, newLarge: 13, renewCount: 5, renewAmount: 1557, renewRate: 4.31, traffic: 15624.05 }
  };

  var regionOfficial = {
    '1区': { revenue: 284916.80, target: 377202, completion: 75.53 },
    '2区': { revenue: 383711.30, target: 510063, completion: 75.23 },
    '3区': { revenue: 412475.26, target: 580348, completion: 71.07 }
  };

  var brandOfficial = { revenue: 1082929.36, target: 1467613, completion: 73.79 };

  function pct(value, base) {
    value = Number(value || 0);
    base = Number(base || 0);
    return base ? value / base * 100 : 0;
  }

  function inferBase(count, rate) {
    count = Number(count || 0);
    rate = Number(rate || 0);
    return rate ? count / (rate / 100) : 0;
  }

  function enrich(item) {
    var newCardCount = Number(item.newCardCount || 0);
    item.newSmallRate = pct(item.newSmall, newCardCount);
    item.newMidLargeRate = pct(Number(item.newMid || 0) + Number(item.newLarge || 0), newCardCount);
    item.renewShare = pct(item.renewAmount, item.revenue);
    item.trafficShare = pct(item.traffic, Number(item.revenue || 0) - Number(item.renewAmount || 0));
    return item;
  }

  function aggregate(area, official) {
    var rows = Object.keys(storeMonth).map(function (name) { return storeMonth[name]; }).filter(function (item) {
      return !area || item.area === area;
    });
    var total = {
      revenue: official.revenue,
      target: official.target,
      completion: official.completion,
      newCardCount: 0,
      newSmall: 0,
      newMid: 0,
      newLarge: 0,
      renewCount: 0,
      renewAmount: 0,
      traffic: 0,
      newBase: 0,
      renewBase: 0
    };
    rows.forEach(function (item) {
      total.newCardCount += Number(item.newCardCount || 0);
      total.newSmall += Number(item.newSmall || 0);
      total.newMid += Number(item.newMid || 0);
      total.newLarge += Number(item.newLarge || 0);
      total.renewCount += Number(item.renewCount || 0);
      total.renewAmount += Number(item.renewAmount || 0);
      total.traffic += Number(item.traffic || 0);
      total.newBase += inferBase(item.newCardCount, item.newRate);
      total.renewBase += inferBase(item.renewCount, item.renewRate);
    });
    total.newRate = pct(total.newCardCount, total.newBase);
    total.renewRate = pct(total.renewCount, total.renewBase);
    return enrich(total);
  }

  Object.keys(storeMonth).forEach(function (name) { enrich(storeMonth[name]); });
  var regionMonth = {
    '1区': aggregate('1区', regionOfficial['1区']),
    '2区': aggregate('2区', regionOfficial['2区']),
    '3区': aggregate('3区', regionOfficial['3区'])
  };
  var brandMonth = aggregate(null, brandOfficial);
  brandMonth.revenue = brandOfficial.revenue;
  brandMonth.target = brandOfficial.target;
  brandMonth.completion = brandOfficial.completion;

  function setMonthAttr(row, key, value) {
    if (value == null || value !== value) return;
    row.setAttribute('data-' + key + '-month', String(value));
  }

  function applySnapshotToRow(row, snapshot) {
    setMonthAttr(row, 'revenue', snapshot.revenue);
    setMonthAttr(row, 'target', snapshot.target);
    setMonthAttr(row, 'completion', snapshot.completion);
    setMonthAttr(row, 'renew-amount', snapshot.renewAmount);
    setMonthAttr(row, 'renew-share', snapshot.renewShare);
    setMonthAttr(row, 'renew-rate', snapshot.renewRate);
    setMonthAttr(row, 'new-rate', snapshot.newRate);
    setMonthAttr(row, 'new-small-rate', snapshot.newSmallRate);
    setMonthAttr(row, 'new-mid-large-rate', snapshot.newMidLargeRate);
    setMonthAttr(row, 'traffic', snapshot.traffic);
    setMonthAttr(row, 'traffic-share', snapshot.trafficShare);
  }

  function applyRankingSnapshots() {
    document.querySelectorAll('table[data-ranking-table] tbody tr').forEach(function (row) {
      var nameCell = row.children[0];
      if (!nameCell) return;
      var name = nameCell.textContent.trim();
      var snapshot = storeMonth[name] || regionMonth[name];
      if (snapshot) applySnapshotToRow(row, snapshot);
    });
  }

  function formatMoney(value) {
    return '¥' + Number(value || 0).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatInteger(value) {
    return '¥' + Number(value || 0).toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  }

  function replaceMtdCard(sectionSelector, values) {
    var section = document.querySelector(sectionSelector);
    if (!section) return;
    var texts = Array.from(section.querySelectorAll('.metric-value, .summary-value, .kpi-value, strong, b'));
    texts.forEach(function (node) {
      var label = (node.parentElement ? node.parentElement.textContent : '').replace(/\s+/g, '');
      if (/营收|收入/.test(label) && /¥/.test(node.textContent)) node.textContent = formatMoney(values.revenue);
      if (/目标/.test(label) && /¥/.test(node.textContent)) node.textContent = formatInteger(values.target);
      if (/完成率/.test(label) && /%/.test(node.textContent)) node.textContent = Number(values.completion).toFixed(2) + '%';
    });
  }

  function apply() {
    applyRankingSnapshots();
    replaceMtdCard('[data-page="brand"], #brand, .page-brand', brandMonth);
    replaceMtdCard('[data-area="1区"], #area-1, .area-section-1', regionMonth['1区']);
    replaceMtdCard('[data-area="2区"], #area-2, .area-section-2', regionMonth['2区']);
    replaceMtdCard('[data-area="3区"], #area-3, .area-section-3', regionMonth['3区']);
    window.PANDA_MONTH_20260801_20260816 = {
      brand: brandMonth,
      regions: regionMonth,
      stores: storeMonth
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
