(function () {
  'use strict';

  var storeMonth = {
    '洛阳泉舜': { area: '2区', revenue: 174663.30, target: 197510, completion: 88.43, cardCount: 316, newCardCount: 212, newCardAmount: 87547, newRate: 36.1, renewCount: 104, renewAmount: 49193, renewRate: 13.2, traffic: 8482 },
    '武汉武昌万象城': { area: '3区', revenue: 155933.65, target: 142735, completion: 109.25, cardCount: 250, newCardCount: 235, newCardAmount: 123188.59, newRate: 51.1, renewCount: 15, renewAmount: 10630, renewRate: 13.4, traffic: 9168.60 },
    '焦作万达': { area: '2区', revenue: 149843.10, target: 181640, completion: 82.49, cardCount: 303, newCardCount: 236, newCardAmount: 98095.50, newRate: 53.8, renewCount: 67, renewAmount: 33179, renewRate: 8.1, traffic: 8699 },
    '武汉荟聚': { area: '3区', revenue: 142966.10, target: 197550, completion: 72.37, cardCount: 270, newCardCount: 242, newCardAmount: 99337.60, newRate: 52.4, renewCount: 28, renewAmount: 14542, renewRate: 8.1, traffic: 5910.54 },
    '开封万达': { area: '3区', revenue: 140638.40, target: 153080, completion: 91.87, cardCount: 296, newCardCount: 246, newCardAmount: 86553.90, newRate: 47.4, renewCount: 50, renewAmount: 27544.10, renewRate: 11.2, traffic: 4073 },
    '襄阳高新万达': { area: '1区', revenue: 130635.60, target: 151354, completion: 86.31, cardCount: 318, newCardCount: 288, newCardAmount: 98189.20, newRate: 58.2, renewCount: 30, renewAmount: 12481, renewRate: 7.1, traffic: 3382 },
    '郑州二七万象城': { area: '3区', revenue: 114218.78, target: 145850, completion: 78.31, cardCount: 210, newCardCount: 175, newCardAmount: 69293.20, newRate: 36.8, renewCount: 35, renewAmount: 15990, renewRate: 9.7, traffic: 492 },
    '郑州美盛天街': { area: '3区', revenue: 106090.12, target: 124380, completion: 85.30, cardCount: 184, newCardCount: 149, newCardAmount: 72853.70, newRate: 56.9, renewCount: 35, renewAmount: 22965, renewRate: 13.9, traffic: 3714.66 },
    '南阳吾悦': { area: '1区', revenue: 103420, target: 158350, completion: 65.31, cardCount: 223, newCardCount: 176, newCardAmount: 73519, newRate: 63.3, renewCount: 47, renewAmount: 20675, renewRate: 8.2, traffic: 4882 },
    '洛阳中州万达': { area: '2区', revenue: 95096.60, target: 111260, completion: 85.47, cardCount: 215, newCardCount: 170, newCardAmount: 64671.20, newRate: 55.2, renewCount: 45, renewAmount: 18263, renewRate: 11.6, traffic: 4015 },
    '许昌魏都万达': { area: '1区', revenue: 91190.40, target: 108338, completion: 84.17, cardCount: 182, newCardCount: 121, newCardAmount: 50274, newRate: 52.2, renewCount: 61, renewAmount: 31300, renewRate: 13.9, traffic: 78 },
    '南阳万达': { area: '1区', revenue: 81526, target: 134401, completion: 60.66, cardCount: 170, newCardCount: 131, newCardAmount: 56290, newRate: 64.5, renewCount: 39, renewAmount: 18119, renewRate: 7.3, traffic: 771 },
    '商丘万达': { area: '1区', revenue: 71615.45, target: 94040, completion: 76.15, cardCount: 164, newCardCount: 94, newCardAmount: 34168, newRate: 47.7, renewCount: 70, renewAmount: 28181, renewRate: 17.8, traffic: 22363.14 },
    '郑州中原万达': { area: '3区', revenue: 67706.60, target: 139760, completion: 48.44, cardCount: 134, newCardCount: 110, newCardAmount: 44233.90, newRate: 50.0, renewCount: 24, renewAmount: 12584.80, renewRate: 9.5, traffic: 3049 },
    '周口万达': { area: '2区', revenue: 66839.40, target: 81132, completion: 82.38, cardCount: 138, newCardCount: 99, newCardAmount: 35179.40, newRate: 37.4, renewCount: 39, renewAmount: 16190, renewRate: 11.4, traffic: 5274 },
    '郑州惠济万达': { area: '2区', revenue: 65091, target: 139740, completion: 46.58, cardCount: 133, newCardCount: 86, newCardAmount: 37069, newRate: 53.1, renewCount: 47, renewAmount: 20241, renewRate: 11.8, traffic: 4760 },
    '信阳万达': { area: '1区', revenue: 58849.30, target: 81160, completion: 72.51, cardCount: 144, newCardCount: 106, newCardAmount: 38579.94, newRate: 62.4, renewCount: 38, renewAmount: 14923.05, renewRate: 15.0, traffic: 13780.40 },
    '新乡万达': { area: '2区', revenue: 46410.01, target: 94430, completion: 49.15, cardCount: 79, newCardCount: 61, newCardAmount: 26543.10, newRate: 33.0, renewCount: 18, renewAmount: 7900, renewRate: 4.7, traffic: 3014 },
    '郑州信万': { area: '2区', revenue: 42060, target: 85230, completion: 49.35, cardCount: 81, newCardCount: 59, newCardAmount: 28159, newRate: 49.6, renewCount: 22, renewAmount: 9296, renewRate: 8.6, traffic: 556 },
    '安阳万达': { area: '3区', revenue: 37661.40, target: 79360, completion: 47.46, cardCount: 59, newCardCount: 36, newCardAmount: 17377, newRate: 23.8, renewCount: 23, renewAmount: 11000, renewRate: 11.2, traffic: 357 },
    '安阳滑县吾悦': { area: '3区', revenue: 31235.20, target: 74440, completion: 41.96, cardCount: 73, newCardCount: 62, newCardAmount: 20402.20, newRate: 36.5, renewCount: 11, renewAmount: 3664, renewRate: 5.8, traffic: 2738 }
  };

  var aliases = {
    '南阳吾悦广场': '南阳吾悦',
    '许昌万达': '许昌魏都万达',
    '新乡牧野万达': '新乡万达',
    '郑州信万广场': '郑州信万',
    '滑县吾悦': '安阳滑县吾悦'
  };

  function pct(value, base) {
    value = Number(value || 0);
    base = Number(base || 0);
    return base ? value / base * 100 : null;
  }

  function inferBase(count, rate) {
    count = Number(count || 0);
    rate = Number(rate || 0);
    return rate ? count / (rate / 100) : 0;
  }

  function enrich(item) {
    item.newSignRevenue = item.newCardAmount;
    item.renewShare = pct(item.renewAmount, item.revenue);
    item.trafficShare = pct(item.traffic, item.newSignRevenue);
    item.newSmallRate = null;
    item.newMidLargeRate = null;
    item.newCustomers = null;
    return item;
  }

  function aggregate(area) {
    var rows = Object.keys(storeMonth).map(function (name) { return storeMonth[name]; }).filter(function (item) {
      return !area || item.area === area;
    });
    var total = {
      revenue: 0,
      target: 0,
      cardCount: 0,
      newCardCount: 0,
      newCardAmount: 0,
      renewCount: 0,
      renewAmount: 0,
      traffic: 0,
      newBase: 0,
      renewBase: 0
    };
    rows.forEach(function (item) {
      total.revenue += Number(item.revenue || 0);
      total.target += Number(item.target || 0);
      total.cardCount += Number(item.cardCount || 0);
      total.newCardCount += Number(item.newCardCount || 0);
      total.newCardAmount += Number(item.newCardAmount || 0);
      total.renewCount += Number(item.renewCount || 0);
      total.renewAmount += Number(item.renewAmount || 0);
      total.traffic += Number(item.traffic || 0);
      total.newBase += inferBase(item.newCardCount, item.newRate);
      total.renewBase += inferBase(item.renewCount, item.renewRate);
    });
    total.completion = pct(total.revenue, total.target);
    total.newRate = pct(total.newCardCount, total.newBase);
    total.renewRate = pct(total.renewCount, total.renewBase);
    return enrich(total);
  }

  Object.keys(storeMonth).forEach(function (name) { enrich(storeMonth[name]); });
  var regionMonth = {
    '1区': aggregate('1区'),
    '2区': aggregate('2区'),
    '3区': aggregate('3区')
  };
  var brandMonth = aggregate(null);

  function normalizeName(name) {
    name = String(name || '').trim();
    return aliases[name] || name;
  }

  function monthAttrNames(key) {
    var kebab = key.replace(/[A-Z]/g, function (letter) { return '-' + letter.toLowerCase(); });
    return kebab === key ? ['data-' + key + '-month'] : ['data-' + key + '-month', 'data-' + kebab + '-month'];
  }

  function setMonthAttr(row, key, value) {
    var names = monthAttrNames(key);
    if (value == null || value !== value || value === '') {
      names.forEach(function (name) { row.removeAttribute(name); });
      return;
    }
    names.forEach(function (name) { row.setAttribute(name, String(value)); });
  }

  function applySnapshotToRow(row, snapshot) {
    [
      'revenue', 'target', 'completion', 'newCustomers', 'newSignRevenue',
      'renewAmount', 'renewShare', 'renewRate', 'newRate', 'newSmallRate',
      'newMidLargeRate', 'traffic', 'trafficShare', 'cardCount',
      'newCardCount', 'renewCount'
    ].forEach(function (key) {
      setMonthAttr(row, key, snapshot[key]);
    });
  }

  function applyRankingSnapshots() {
    document.querySelectorAll('table[data-ranking-table] tbody tr').forEach(function (row) {
      var nameCell = row.children[0];
      if (!nameCell) return;
      var name = normalizeName(nameCell.textContent);
      var snapshot = storeMonth[name] || regionMonth[name];
      if (snapshot) applySnapshotToRow(row, snapshot);
    });
  }

  function apply() {
    applyRankingSnapshots();
    window.PANDA_MONTH_20260801_20260830 = {
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
