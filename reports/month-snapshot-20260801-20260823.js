(function () {
  var storeMonth = {
    '洛阳泉舜': { area: '2区', revenue: 146040.30, target: 153560, completion: 95.10, cardCount: 266, cardAmount: 115188, newCardCount: 177, newCardAmount: 72795, newRate: 46.83, newSmall: 89, newMid: 76, newLarge: 12, renewCount: 89, renewAmount: 42393, renewRate: 13.65, renewSmall: 1, renewMid: 54, renewLarge: 34, traffic: 57727.60, stairsAmount: 27836.40, scanCount: 155, scanAmount: 29891.20, otherTraffic: 12, managerConfirm: 63, salary: 6485 },
    '焦作万达': { area: '2区', revenue: 123300.90, target: 141221, completion: 87.31, cardCount: 251, cardAmount: 109251.50, newCardCount: 192, newCardAmount: 80272.50, newRate: 61.37, newSmall: 82, newMid: 97, newLarge: 13, renewCount: 59, renewAmount: 28979, renewRate: 8.86, renewSmall: 1, renewMid: 31, renewLarge: 27, traffic: 91438.70, stairsAmount: 58344.30, scanCount: 138, scanAmount: 33094.40, otherTraffic: 417, managerConfirm: 46, salary: 4437.50 },
    '武汉荟聚': { area: '3区', revenue: 113909.80, target: 153590, completion: 74.16, cardCount: 215, cardAmount: 90511.40, newCardCount: 199, newCardAmount: 81521.40, newRate: 54.99, newSmall: 92, newMid: 88, newLarge: 19, renewCount: 16, renewAmount: 8990, renewRate: 5.80, renewSmall: 1, renewMid: 6, renewLarge: 9, traffic: 49448, stairsAmount: 31563, scanCount: 74, scanAmount: 17885, otherTraffic: 0, managerConfirm: 41, salary: 4557 },
    '开封万达': { area: '3区', revenue: 111669.90, target: 118764, completion: 94.03, cardCount: 238, cardAmount: 88446.70, newCardCount: 207, newCardAmount: 71380.60, newRate: 50.75, newSmall: 145, newMid: 56, newLarge: 6, renewCount: 31, renewAmount: 17066.10, renewRate: 8.68, renewSmall: 1, renewMid: 11, renewLarge: 19, traffic: 53463.60, stairsAmount: 29901, scanCount: 159, scanAmount: 23562.60, otherTraffic: 100, managerConfirm: 44, salary: 4958.50 },
    '武汉武昌万象城': { area: '3区', revenue: 105789.62, target: 98775, completion: 107.10, cardCount: 168, cardAmount: 89845.40, newCardCount: 160, newCardAmount: 84262.40, newRate: 53.33, newSmall: 34, newMid: 95, newLarge: 31, renewCount: 8, renewAmount: 5583, renewRate: 12.50, renewSmall: 0, renewMid: 3, renewLarge: 5, traffic: 37684.60, stairsAmount: 37684.60, scanCount: 0, scanAmount: 0, otherTraffic: 0, managerConfirm: 20, salary: 2056 },
    '襄阳高新万达': { area: '1区', revenue: 103554.40, target: 116338, completion: 89.01, cardCount: 255, cardAmount: 87865.20, newCardCount: 234, newCardAmount: 79083.20, newRate: 61.15, newSmall: 153, newMid: 75, newLarge: 6, renewCount: 21, renewAmount: 8782, renewRate: 6.33, renewSmall: 6, renewMid: 8, renewLarge: 7, traffic: 40417.20, stairsAmount: 14616.20, scanCount: 83, scanAmount: 25801, otherTraffic: 198, managerConfirm: 59, salary: 6067.50 },
    '郑州二七万象城': { area: '3区', revenue: 87222.60, target: 113400, completion: 76.92, cardCount: 164, cardAmount: 64690, newCardCount: 137, newCardAmount: 52690, newRate: 42.16, newSmall: 75, newMid: 56, newLarge: 6, renewCount: 27, renewAmount: 12000, renewRate: 9.22, renewSmall: 2, renewMid: 18, renewLarge: 7, traffic: 28349.20, stairsAmount: 27201.20, scanCount: 6, scanAmount: 1148, otherTraffic: 0, managerConfirm: 10, salary: 960 },
    '郑州美盛天街': { area: '3区', revenue: 83900.11, target: 93285, completion: 89.94, cardCount: 146, cardAmount: 75656.70, newCardCount: 120, newCardAmount: 58581.70, newRate: 61.86, newSmall: 31, newMid: 68, newLarge: 21, renewCount: 26, renewAmount: 17075, renewRate: 13.20, renewSmall: 1, renewMid: 5, renewLarge: 20, traffic: 27654.20, stairsAmount: 15427.20, scanCount: 34, scanAmount: 12227, otherTraffic: 0, managerConfirm: 39, salary: 2995 },
    '南阳吾悦': { area: '1区', revenue: 83294, target: 122446, completion: 68.03, cardCount: 180, cardAmount: 76178, newCardCount: 140, newCardAmount: 58079, newRate: 70.04, newSmall: 63, newMid: 63, newLarge: 14, renewCount: 40, renewAmount: 18099, renewRate: 8.66, renewSmall: 4, renewMid: 23, renewLarge: 13, traffic: 42594, stairsAmount: 35465, scanCount: 37, scanAmount: 7129, otherTraffic: 263, managerConfirm: 48, salary: 3845 },
    '洛阳中州万达': { area: '2区', revenue: 79230.40, target: 86502, completion: 91.59, cardCount: 181, cardAmount: 68478, newCardCount: 143, newCardAmount: 53012, newRate: 60.74, newSmall: 90, newMid: 47, newLarge: 6, renewCount: 38, renewAmount: 15466, renewRate: 12.58, renewSmall: 5, renewMid: 28, renewLarge: 5, traffic: 38672.20, stairsAmount: 16498.20, scanCount: 102, scanAmount: 22174, otherTraffic: 0, managerConfirm: 64, salary: 4813 },
    '南阳万达': { area: '1区', revenue: 71018, target: 104374, completion: 68.04, cardCount: 149, cardAmount: 64952, newCardCount: 117, newCardAmount: 49927, newRate: 72.68, newSmall: 45, newMid: 63, newLarge: 9, renewCount: 32, renewAmount: 15025, renewRate: 7.42, renewSmall: 1, renewMid: 19, renewLarge: 12, traffic: 46952, stairsAmount: 35532, scanCount: 39, scanAmount: 11420, otherTraffic: 246, managerConfirm: 65, salary: 5470 },
    '许昌魏都万达': { area: '1区', revenue: 69393.40, target: 84074, completion: 82.54, cardCount: 140, cardAmount: 62634, newCardCount: 98, newCardAmount: 40334, newRate: 64.22, newSmall: 41, newMid: 53, newLarge: 4, renewCount: 42, renewAmount: 22300, renewRate: 11.73, renewSmall: 0, renewMid: 15, renewLarge: 27, traffic: 23335, stairsAmount: 12650, scanCount: 23, scanAmount: 10685, otherTraffic: 151, managerConfirm: 47, salary: 4639 },
    '郑州中原万达': { area: '3区', revenue: 56468.40, target: 108660, completion: 51.97, cardCount: 113, cardAmount: 48011.70, newCardCount: 97, newCardAmount: 40025.90, newRate: 58.25, newSmall: 51, newMid: 38, newLarge: 8, renewCount: 16, renewAmount: 7985.80, renewRate: 7.88, renewSmall: 0, renewMid: 8, renewLarge: 8, traffic: 26260, stairsAmount: 22067, scanCount: 25, scanAmount: 4193, otherTraffic: 64, managerConfirm: 37, salary: 3275 },
    '郑州惠济万达': { area: '2区', revenue: 51369, target: 108645, completion: 47.28, cardCount: 102, cardAmount: 44482, newCardCount: 62, newCardAmount: 27407, newRate: 62.58, newSmall: 19, newMid: 40, newLarge: 3, renewCount: 40, renewAmount: 17075, renewRate: 12.27, renewSmall: 3, renewMid: 30, renewLarge: 7, traffic: 16384, stairsAmount: 7144, scanCount: 38, scanAmount: 9240, otherTraffic: 24, managerConfirm: 36, salary: 2821.60 },
    '周口万达': { area: '2区', revenue: 48741.40, target: 60742, completion: 80.24, cardCount: 100, cardAmount: 37060.40, newCardCount: 73, newCardAmount: 25769.40, newRate: 44.64, newSmall: 23, newMid: 42, newLarge: 8, renewCount: 27, renewAmount: 11291, renewRate: 10.00, renewSmall: 1, renewMid: 10, renewLarge: 16, traffic: 15324.40, stairsAmount: 14242.40, scanCount: 8, scanAmount: 1082, otherTraffic: 35, managerConfirm: 10, salary: 627 },
    '新乡万达': { area: '2区', revenue: 38850.01, target: 73417, completion: 52.92, cardCount: 67, cardAmount: 29450.10, newCardCount: 51, newCardAmount: 22350.10, newRate: 39.18, newSmall: 22, newMid: 24, newLarge: 5, renewCount: 16, renewAmount: 7100, renewRate: 4.92, renewSmall: 1, renewMid: 11, renewLarge: 4, traffic: 29773, stairsAmount: 23230.50, scanCount: 42, scanAmount: 6542.50, otherTraffic: 219, managerConfirm: 34, salary: 2812.50 },
    '郑州信万': { area: '2区', revenue: 34689, target: 66264, completion: 52.35, cardCount: 67, cardAmount: 31000, newCardCount: 49, newCardAmount: 23104, newRate: 58.26, newSmall: 8, newMid: 34, newLarge: 7, renewCount: 18, renewAmount: 7896, renewRate: 8.33, renewSmall: 0, renewMid: 11, renewLarge: 7, traffic: 18750, stairsAmount: 9303, scanCount: 34, scanAmount: 9447, otherTraffic: 0, managerConfirm: 49, salary: 3633 },
    '安阳万达': { area: '3区', revenue: 31444.20, target: 61700, completion: 50.96, cardCount: 51, cardAmount: 24489, newCardCount: 30, newCardAmount: 14489, newRate: 36.96, newSmall: 9, newMid: 16, newLarge: 5, renewCount: 21, renewAmount: 10000, renewRate: 12.21, renewSmall: 0, renewMid: 13, renewLarge: 8, traffic: 29597.20, stairsAmount: 29597.20, scanCount: 0, scanAmount: 0, otherTraffic: 0, managerConfirm: 39, salary: 2441 },
    '商丘万达': { area: '1区', revenue: 29093.20, target: 33700, completion: 86.33, cardCount: 72, cardAmount: 26352.20, newCardCount: 39, newCardAmount: 13634.20, newRate: 70.59, newSmall: 12, newMid: 24, newLarge: 3, renewCount: 33, renewAmount: 12718, renewRate: 19.08, renewSmall: 3, renewMid: 19, renewLarge: 11, traffic: 15342.20, stairsAmount: 10248.15, scanCount: 29, scanAmount: 5094.05, otherTraffic: 105, managerConfirm: 18, salary: 1376 },
    '安阳滑县吾悦': { area: '3区', revenue: 25267.20, target: 57830, completion: 43.69, cardCount: 62, cardAmount: 19936.20, newCardCount: 53, newCardAmount: 16941.20, newRate: 44.29, newSmall: 12, newMid: 24, newLarge: 17, renewCount: 9, renewAmount: 2995, renewRate: 5.77, renewSmall: 0, renewMid: 0, renewLarge: 9, traffic: 22903.20, stairsAmount: 20999.20, scanCount: 15, scanAmount: 1904, otherTraffic: 0, managerConfirm: 51, salary: 1874 },
    '信阳万达': { area: '1区', revenue: 21312, target: 28808, completion: 73.98, cardCount: 57, cardAmount: 20041.60, newCardCount: 39, newCardAmount: 13451.55, newRate: 80.28, newSmall: 13, newMid: 22, newLarge: 4, renewCount: 18, renewAmount: 6590.05, renewRate: 15.38, renewSmall: 1, renewMid: 15, renewLarge: 2, traffic: 6826.45, stairsAmount: 2060.15, scanCount: 25, scanAmount: 4766.30, otherTraffic: 78, managerConfirm: 18, salary: 1639 }
  };

  var regionOfficial = {
    '1区': { revenue: 377665, target: 489740, completion: 77.12 },
    '2区': { revenue: 522221.01, target: 690351, completion: 75.65 },
    '3区': { revenue: 615671.83, target: 806004, completion: 76.39 }
  };

  var brandOfficial = { revenue: 1517883.84, target: 1986095, completion: 76.43 };

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
    item.newSignRevenue = Number(item.newCardAmount || 0);
    item.newSmallRate = pct(item.newSmall, newCardCount);
    item.newMidLargeRate = pct(Number(item.newMid || 0) + Number(item.newLarge || 0), newCardCount);
    item.renewShare = pct(item.renewAmount, item.revenue);
    item.trafficShare = pct(item.traffic, item.newSignRevenue);
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
      cardCount: 0,
      cardAmount: 0,
      newCardCount: 0,
      newCardAmount: 0,
      newSmall: 0,
      newMid: 0,
      newLarge: 0,
      renewCount: 0,
      renewAmount: 0,
      renewSmall: 0,
      renewMid: 0,
      renewLarge: 0,
      traffic: 0,
      scanAmount: 0,
      newBase: 0,
      renewBase: 0
    };
    rows.forEach(function (item) {
      total.cardCount += Number(item.cardCount || 0);
      total.cardAmount += Number(item.cardAmount || 0);
      total.newCardCount += Number(item.newCardCount || 0);
      total.newCardAmount += Number(item.newCardAmount || 0);
      total.newSmall += Number(item.newSmall || 0);
      total.newMid += Number(item.newMid || 0);
      total.newLarge += Number(item.newLarge || 0);
      total.renewCount += Number(item.renewCount || 0);
      total.renewAmount += Number(item.renewAmount || 0);
      total.renewSmall += Number(item.renewSmall || 0);
      total.renewMid += Number(item.renewMid || 0);
      total.renewLarge += Number(item.renewLarge || 0);
      total.traffic += Number(item.traffic || 0);
      total.scanAmount += Number(item.scanAmount || 0);
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
    var text = String(value);
    var kebab = key.replace(/[A-Z]/g, function (letter) { return '-' + letter.toLowerCase(); });
    row.setAttribute('data-' + key + '-month', text);
    if (kebab !== key) row.setAttribute('data-' + kebab + '-month', text);
  }

  function clearMonthAttr(row, key) {
    var kebab = key.replace(/[A-Z]/g, function (letter) { return '-' + letter.toLowerCase(); });
    row.removeAttribute('data-' + key + '-month');
    if (kebab !== key) row.removeAttribute('data-' + kebab + '-month');
  }

  function applySnapshotToRow(row, snapshot) {
    setMonthAttr(row, 'revenue', snapshot.revenue);
    setMonthAttr(row, 'target', snapshot.target);
    setMonthAttr(row, 'completion', snapshot.completion);
    if (snapshot.newCustomers == null) clearMonthAttr(row, 'newCustomers');
    else setMonthAttr(row, 'newCustomers', snapshot.newCustomers);
    setMonthAttr(row, 'newSignRevenue', snapshot.newSignRevenue);
    setMonthAttr(row, 'renewAmount', snapshot.renewAmount);
    setMonthAttr(row, 'renewShare', snapshot.renewShare);
    setMonthAttr(row, 'renewRate', snapshot.renewRate);
    setMonthAttr(row, 'newRate', snapshot.newRate);
    setMonthAttr(row, 'newSmallRate', snapshot.newSmallRate);
    setMonthAttr(row, 'newMidLargeRate', snapshot.newMidLargeRate);
    setMonthAttr(row, 'traffic', snapshot.traffic);
    setMonthAttr(row, 'trafficShare', snapshot.trafficShare);
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

  function formatIntegerMoney(value) {
    return '¥' + Number(value || 0).toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  }

  function replaceMtdCard(sectionSelector, values) {
    var section = document.querySelector(sectionSelector);
    if (!section) return;
    var texts = Array.from(section.querySelectorAll('.metric-value, .summary-value, .kpi-value, strong, b'));
    texts.forEach(function (node) {
      var label = (node.parentElement ? node.parentElement.textContent : '').replace(/\s+/g, '');
      if (/营收|收入/.test(label) && /¥/.test(node.textContent)) node.textContent = formatMoney(values.revenue);
      if (/目标/.test(label) && /¥/.test(node.textContent)) node.textContent = formatIntegerMoney(values.target);
      if (/完成率/.test(label) && /%/.test(node.textContent)) node.textContent = Number(values.completion).toFixed(2) + '%';
    });
  }

  function apply() {
    applyRankingSnapshots();
    replaceMtdCard('[data-page="brand"], #brand, .page-brand', brandMonth);
    replaceMtdCard('[data-area="1区"], #area-1, .area-section-1', regionMonth['1区']);
    replaceMtdCard('[data-area="2区"], #area-2, .area-section-2', regionMonth['2区']);
    replaceMtdCard('[data-area="3区"], #area-3, .area-section-3', regionMonth['3区']);
    window.PANDA_MONTH_20260801_20260823 = {
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
