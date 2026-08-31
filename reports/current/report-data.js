(function () {
  'use strict';

  var DATA_VERSION = '20260830-excel-month-v1';
  var priorSupport = {};
  var hiddenSupportLabels = {
    '新签小卡数': true,
    '新签中卡数': true,
    '新签大卡数': true,
    '续卡小卡数': true,
    '续卡中卡数': true,
    '续卡大卡数': true
  };
  document.querySelectorAll('.closure-store-scroll tbody tr').forEach(function (row) {
    var nameCell = row.querySelector('.object-cell b');
    if (!nameCell) return;
    var metrics = {};
    row.querySelectorAll('.support-metric').forEach(function (metric) {
      var label = metric.querySelector('b');
      var value = metric.querySelector('span');
      if (!label || !value) return;
      var parts = value.textContent.split('→').map(function (part) { return part.trim(); });
      metrics[label.textContent.trim()] = parts.length > 1 ? parts[0] : (parts[0] || '-');
    });
    priorSupport[nameCell.textContent.trim()] = metrics;
  });
  document.querySelectorAll('.store-review-card').forEach(function (card) {
    var storeName = card.dataset.storeName;
    if (!storeName || priorSupport[storeName]) return;
    var metrics = {};
    card.querySelectorAll('.support-metric').forEach(function (metric) {
      var label = metric.querySelector('b');
      var value = metric.querySelector('span');
      if (!label || !value) return;
      var parts = value.textContent.split('→').map(function (part) { return part.trim(); });
      metrics[label.textContent.trim()] = parts.length > 1 ? parts[0] : (parts[0] || '-');
    });
    priorSupport[storeName] = metrics;
  });

  function ready() {
    if (document.readyState !== 'loading') return Promise.resolve();
    return new Promise(function (resolve) { document.addEventListener('DOMContentLoaded', resolve, { once: true }); });
  }

  Promise.all([
    ready(),
    fetch('./current-week-data.json?v=' + DATA_VERSION, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('本周数据读取失败');
      return response.json();
    }),
    fetch('./employee-current-week.json?v=' + DATA_VERSION, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('本周员工排名数据读取失败');
      return response.json();
    }),
    fetch('./previous-week-support.json?v=' + DATA_VERSION, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) return {};
      return response.json();
    }).catch(function () {
      return {};
    })
  ]).then(function (result) {
    applyCurrentWeek(result[1], result[2], result[3]);
  }).catch(function (error) {
    console.error(error);
  });

  function mergePreviousSupport(source) {
    if (!source) return;
    if (source.aggregates) {
      Object.keys(source.aggregates).forEach(function (name) {
        priorSupport[name] = Object.assign({}, priorSupport[name] || {}, source.aggregates[name] || {});
      });
    }
    if (source.stores) {
      Object.keys(source.stores).forEach(function (name) {
        priorSupport[name] = Object.assign({}, priorSupport[name] || {}, source.stores[name] || {});
      });
    }
  }

  function firstMetric(metrics, labels) {
    if (!metrics) return null;
    for (var i = 0; i < labels.length; i += 1) {
      var value = number(metrics[labels[i]]);
      if (value != null) return value;
    }
    return null;
  }

  function ensureDerivedMetricNode(card, support, label, anchorLabel, aliases) {
    if (!card || !support) return null;
    var labels = [label].concat(aliases || []);
    var existing = Array.from(support.querySelectorAll('.support-metric')).find(function (item) {
      var text = item.querySelector('b');
      var currentLabel = text ? text.textContent.trim() : '';
      return labels.indexOf(item.dataset.derivedLabel) >= 0 || labels.indexOf(currentLabel) >= 0;
    });
    if (existing) {
      existing.dataset.derivedLabel = label;
      var existingLabel = existing.querySelector('b');
      if (existingLabel) existingLabel.textContent = label;
      return existing;
    }
    var anchor = Array.from(support.querySelectorAll('.support-metric')).find(function (item) {
      var text = item.querySelector('b');
      return text && text.textContent.trim() === anchorLabel;
    });
    if (!anchor || !anchor.parentNode) return null;
    var node = document.createElement('div');
    node.className = 'support-metric';
    node.dataset.derivedLabel = label;
    node.innerHTML = '<b>' + label + '</b><span>— → —</span><em>—</em>';
    anchor.parentNode.insertBefore(node, anchor.nextSibling);
    return node;
  }

  function updateDerivedCountMetrics(storeMap) {
    document.querySelectorAll('.store-review-card').forEach(function (card) {
      var storeName = card.dataset.storeName;
      var store = storeMap[storeName];
      if (!store) return;
      var support = card.querySelector('.store-review-support .status-cell') || card.querySelector('.store-review-support');
      var metrics = priorSupport[storeName] || {};
      var newCountNode = ensureDerivedMetricNode(card, support, '新签总卡量', '新签营收', ['总新卡数量', '新卡总卡量']);
      var newAvgNode = ensureDerivedMetricNode(card, support, '新签卡均价', '新签总卡量', ['新卡均价']);
      var renewCountNode = ensureDerivedMetricNode(card, support, '续卡总卡量', '续卡金额', ['总续卡数量']);
      var renewAvgNode = ensureDerivedMetricNode(card, support, '续卡均价', '续卡总卡量');
      var previousNewCount = firstMetric(metrics, ['新签总卡量', '总新卡数量', '新卡总卡量']);
      var previousRenewCount = firstMetric(metrics, ['续卡总卡量', '总续卡数量']);
      updateCountNode(newCountNode, store.newCardCount, previousNewCount);
      updateAverageNode(newAvgNode, store.newCardAmount, store.newCardCount, firstMetric(metrics, ['新签营收']), previousNewCount);
      updateCountNode(renewCountNode, store.renewCount, previousRenewCount);
      updateAverageNode(renewAvgNode, store.renewAmount, store.renewCount, firstMetric(metrics, ['续卡金额']), previousRenewCount);
    });
  }

  function updateCountNode(node, currentCount, previousCount) {
    if (!node) return;
    var span = node.querySelector('span');
    var em = node.querySelector('em');
    var current = Number(currentCount);
    var previous = Number(previousCount);
    var currentText = Number.isFinite(current) ? integer(current) + '张' : '—';
    var previousText = Number.isFinite(previous) ? integer(previous) + '张' : '—';
    if (span) span.textContent = previousText + ' → ' + currentText;
    if (!em) return;
    if (!Number.isFinite(current) || !Number.isFinite(previous) || !previous) {
      em.textContent = '—';
      em.className = '';
      return;
    }
    var change = (current - previous) / Math.abs(previous) * 100;
    em.textContent = (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
    em.className = change >= 0 ? 'cg' : 'cr';
    node.classList.toggle('is-bad', change < 0);
  }

  function updateAverageNode(node, currentAmount, currentCount, previousAmount, previousCount) {
    if (!node) return;
    var span = node.querySelector('span');
    var em = node.querySelector('em');
    var current = Number(currentAmount);
    var currentBase = Number(currentCount);
    var previous = Number(previousAmount);
    var previousBase = Number(previousCount);
    var currentValue = Number.isFinite(current) && Number.isFinite(currentBase) && currentBase ? current / currentBase : null;
    var previousValue = Number.isFinite(previous) && Number.isFinite(previousBase) && previousBase ? previous / previousBase : null;
    var currentText = currentValue == null ? '—' : money(currentValue);
    var previousText = previousValue == null ? '—' : money(previousValue);
    if (span) span.textContent = previousText + ' → ' + currentText;
    if (!em) return;
    if (currentValue == null || previousValue == null || !previousValue) {
      em.textContent = '—';
      em.className = '';
      return;
    }
    var change = (currentValue - previousValue) / Math.abs(previousValue) * 100;
    em.textContent = (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
    em.className = change >= 0 ? 'cg' : 'cr';
    node.classList.toggle('is-bad', change < 0);
  }

  function applyCurrentWeek(source, peopleSource, previousSupportSource) {
    mergePreviousSupport(previousSupportSource);
    var stores = source.stores || [];
    var storeMap = {};
    stores.forEach(function (store) { storeMap[store.name] = enrich(store); });
    var regions = {};
    ['1区', '2区', '3区'].forEach(function (area) {
      var areaRows = stores.filter(function (store) { return store.region === area; });
      regions[area] = aggregate(areaRows, area, areaRows.reduce(function (sum, store) { return sum + Number(store.target || 0); }, 0));
    });
    var brand = aggregate(stores, '品牌', stores.reduce(function (sum, store) { return sum + Number(store.target || 0); }, 0));

    updateDates();
    updateSummary(document.querySelector('.page:first-of-type'), brand, '品牌本周汇总');
    ['1区', '2区', '3区'].forEach(function (area, index) {
      var page = document.querySelectorAll('.page')[index + 1];
      updateSummary(page, regions[area], area + '本周汇总');
      updateAreaBrief(page, regions[area], storeMap);
    });
    updateFourWeekTables(brand, regions);
    updateRankings(storeMap, regions, brand);
    updateClosureCards(storeMap);
    updateConclusions(brand, regions);
    updateHeaderScore();
    updatePeopleRankings(peopleSource);
    updateDerivedCountMetrics(storeMap);
    bindStoreFilters();
    document.documentElement.dataset.reportDataReady = 'true';
  }

  function bindStoreFilters() {
    var allCards = Array.from(document.querySelectorAll('.closure-store-list .store-review-card'));
    document.querySelectorAll('.store-filter-bar').forEach(function (bar) {
      var select = bar.querySelector('select');
      var list = bar.nextElementSibling;
      while (list && !list.classList.contains('closure-store-list')) list = list.nextElementSibling;
      if (!select || !list) return;
      var cards = Array.from(list.querySelectorAll('.store-review-card'));
      if (!cards.length) return;
      var selected = select.value;
      var ratingRank = { red: 0, yellow: 1, green: 2 };
      function cardRating(card) {
        var badge = card.querySelector('.closure-rating');
        if (badge && badge.classList.contains('red')) return 'red';
        if (badge && badge.classList.contains('yellow')) return 'yellow';
        return 'green';
      }
      function rankOf(card) {
        var rating = cardRating(card);
        return ratingRank[rating] == null ? 2 : ratingRank[rating];
      }
      var orderedCards = cards.slice().sort(function (a, b) {
        var rankDiff = rankOf(a) - rankOf(b);
        if (rankDiff) return rankDiff;
        return (a.dataset.storeName || '').localeCompare(b.dataset.storeName || '', 'zh-Hans-CN');
      });
      select.innerHTML = '';
      var all = document.createElement('option');
      all.value = '';
      all.textContent = '全部门店';
      select.appendChild(all);
      orderedCards.forEach(function (card) {
        if (!card.dataset.storeName) return;
        var rating = cardRating(card);
        var option = document.createElement('option');
        option.value = card.dataset.storeName;
        option.textContent = (rating === 'red' ? '红灯' : rating === 'yellow' ? '黄灯' : '绿灯') + '｜' + card.dataset.storeName;
        option.dataset.rating = rating;
        select.appendChild(option);
      });
      if (selected) select.value = selected;
      function apply() {
        var value = select.value;
        allCards.forEach(function (card) {
          card.hidden = Boolean(value) && card.dataset.storeName !== value;
        });
      }
      if (select.dataset.storeFilterBound !== 'true') {
        select.addEventListener('change', apply);
        select.dataset.storeFilterBound = 'true';
      }
      apply();
    });
  }

  function enrich(store) {
    var result = Object.assign({}, store);
    result.completion = store.completionOverride == null ? ratio(store.revenue, store.target) : Number(store.completionOverride);
    result.newSignRate = store.newSignRateOverride == null ? ratio(store.newCardCount, store.newCustomers) : Number(store.newSignRateOverride);
    result.newSmallRate = store.newSmallRateOverride == null ? ratio(store.newSmall, store.newCardCount) : Number(store.newSmallRateOverride);
    result.newMidRate = store.newMidRateOverride == null ? ratio(store.newMid, store.newCardCount) : Number(store.newMidRateOverride);
    result.newLargeRate = store.newLargeRateOverride == null ? ratio(store.newLarge, store.newCardCount) : Number(store.newLargeRateOverride);
    result.newMidLargeRate = store.newMidLargeRateOverride == null ? ratio(store.newMid + store.newLarge, store.newCardCount) : Number(store.newMidLargeRateOverride);
    result.renewSmallRate = ratio(store.renewSmall, store.renewCount);
    result.renewMidRate = ratio(store.renewMid, store.renewCount);
    result.renewLargeRate = store.renewLargeRateOverride == null ? ratio(store.renewLarge, store.renewCount) : Number(store.renewLargeRateOverride);
    result.renewRate = store.renewRateOverride == null ? ratio(store.renewCount, store.oldCustomers) : Number(store.renewRateOverride);
    result.renewShare = store.renewShareOverride == null ? ratio(store.renewAmount, store.revenue) : Number(store.renewShareOverride);
    result.trafficShare = ratio(store.trafficAmount, store.newCardAmount);
    result.sweepShare = ratio(store.sweepAmount, store.newCardAmount);
    var storeLargeFields = [store.newMid, store.newLarge, store.renewMid, store.renewLarge];
    var storeLargeTotal = storeLargeFields.some(function (value) { return value != null && value !== ''; })
      ? storeLargeFields.reduce(function (sum, value) { return sum + Number(value || 0); }, 0)
      : null;
    result.overallLargeRate = store.overallLargeRateOverride == null ? ratio(storeLargeTotal, store.cardCount) : Number(store.overallLargeRateOverride);
    return result;
  }

  function aggregate(rows, name, target) {
    var fields = ['revenue', 'customers', 'newCustomers', 'oldCustomers', 'consumption', 'recharge', 'members', 'casual', 'cardCount', 'cardAmount',
      'newCardCount', 'newCardAmount', 'newSmall', 'newMid', 'newLarge', 'renewCount', 'renewAmount',
      'renewSmall', 'renewMid', 'renewLarge', 'partTimeVisits', 'trafficCount', 'trafficAmount', 'stairCount',
      'stairAmount', 'sweepCount', 'sweepAmount', 'otherTraffic', 'managerConfirmed', 'salary'];
    var result = { name: name, target: target, stores: rows.length, newSignRate: null, renewRate: null };
    fields.forEach(function (field) {
      var hasValue = rows.some(function (row) { return row[field] != null && row[field] !== ''; });
      result[field] = hasValue ? rows.reduce(function (sum, row) { return sum + Number(row[field] || 0); }, 0) : null;
    });
    result.completion = ratio(result.revenue, result.target);
    result.newSignRate = ratio(result.newCardCount, result.newCustomers);
    if (result.newSignRate == null) result.newSignRate = weightedAverage(rows, 'newSignRateOverride', 'newCustomers');
    result.renewRate = ratio(result.renewCount, result.oldCustomers);
    if (result.renewRate == null) result.renewRate = weightedAverage(rows, 'renewRateOverride', 'revenue');
    result.newSmallRate = ratio(result.newSmall, result.newCardCount);
    result.newMidRate = ratio(result.newMid, result.newCardCount);
    result.newLargeRate = ratio(result.newLarge, result.newCardCount);
    result.newMidLargeRate = ratio(result.newMid + result.newLarge, result.newCardCount);
    result.renewShare = ratio(result.renewAmount, result.revenue);
    result.trafficShare = ratio(result.trafficAmount, result.newCardAmount);
    result.sweepShare = ratio(result.sweepAmount, result.newCardAmount);
    var largeFields = [result.newMid, result.newLarge, result.renewMid, result.renewLarge];
    var largeTotal = largeFields.some(function (value) { return value != null && value !== ''; })
      ? largeFields.reduce(function (sum, value) { return sum + Number(value || 0); }, 0)
      : null;
    result.overallLargeRate = ratio(largeTotal, result.cardCount);
    return result;
  }

  function ratio(value, base) {
    if (value == null || base == null) return null;
    return Number(base) ? Number(value || 0) / Number(base) * 100 : 0;
  }

  function weightedAverage(rows, valueField, weightField) {
    var totalWeight = 0;
    var weighted = 0;
    rows.forEach(function (row) {
      if (row[valueField] == null) return;
      var weight = Number(row[weightField]);
      if (!Number.isFinite(weight) || weight <= 0) weight = 1;
      weighted += Number(row[valueField]) * weight;
      totalWeight += weight;
    });
    return totalWeight ? weighted / totalWeight : null;
  }

  function number(value) {
    var parsed = Number(String(value == null ? '' : value).replace(/[¥,%张人次\s]/g, '').replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  }

  function money(value) {
    if (value == null) return '—';
    var numeric = Number(value);
    var sign = numeric < 0 ? '-' : '';
    return sign + '¥' + Math.abs(numeric).toLocaleString('zh-CN', { minimumFractionDigits: numeric % 1 ? 2 : 0, maximumFractionDigits: 2 });
  }

  function percent(value) {
    return value == null || !Number.isFinite(Number(value)) ? '—' : Number(value).toFixed(2) + '%';
  }

  function integer(value) {
    var numeric = Number(value);
    return value == null || !Number.isFinite(numeric) ? '—' : Math.round(numeric).toLocaleString('zh-CN');
  }

  function metricValue(entity, label) {
    if (label === '新签总卡量' || label === '总新卡数量' || label === '新卡总卡量') {
      var newCardCount = integer(entity.newCardCount);
      return newCardCount === '—' ? '—' : newCardCount + '张';
    }
    if (label === '总续卡数量' || label === '续卡总卡量') {
      var renewCount = integer(entity.renewCount);
      return renewCount === '—' ? '—' : renewCount + '张';
    }
    if (label === '新签卡均价' || label === '新卡均价') {
      var newCardAvg = Number(entity.newCardCount) ? Number(entity.newCardAmount || 0) / Number(entity.newCardCount) : null;
      return newCardAvg == null ? '—' : money(newCardAvg);
    }
    if (label === '续卡均价') {
      var renewAvg = Number(entity.renewCount) ? Number(entity.renewAmount || 0) / Number(entity.renewCount) : null;
      return renewAvg == null ? '—' : money(renewAvg);
    }
    var map = {
      '总接待人数': ['customers', 'count'], '新客数': ['newCustomers', 'count'], '本周新客数': ['newCustomers', 'count'], '老客数': ['oldCustomers', 'count'],
      '总营收': ['revenue', 'money'], '本周营收': ['revenue', 'money'], '新签营收': ['newCardAmount', 'money'],
      '目标': ['target', 'money'], '目标差额': ['gap', 'money'], '完成率': ['completion', 'percent'],
      '新签办卡率': ['newSignRate', 'percent'], '新签小卡率': ['newSmallRate', 'percent'],
      '新签中卡率': ['newMidRate', 'percent'], '新签大卡率': ['newLargeRate', 'percent'],
      '新签中大卡率': ['newMidLargeRate', 'percent'], '大卡率': ['overallLargeRate', 'percent'], '整体大卡率': ['overallLargeRate', 'percent'],
      '总续卡金额': ['renewAmount', 'money'], '续卡金额': ['renewAmount', 'money'],
      '总续卡占比': ['renewShare', 'percent'], '续卡占比': ['renewShare', 'percent'], '续费率': ['renewRate', 'percent'], '续卡率': ['renewRate', 'percent'],
      '续卡小卡率': ['renewSmallRate', 'percent'], '续卡中卡率': ['renewMidRate', 'percent'], '续卡大卡率': ['renewLargeRate', 'percent'],
      '总引流金额': ['trafficAmount', 'money'], '总引流占比': ['trafficShare', 'percent'],
      '扫楼金额': ['sweepAmount', 'money'], '扫楼占比': ['sweepShare', 'percent'], '扶梯口金额': ['stairAmount', 'money'],
      '新签小卡数': ['newSmall', 'cards'], '新签中卡数': ['newMid', 'cards'], '新签大卡数': ['newLarge', 'cards'],
      '续卡小卡数': ['renewSmall', 'cards'], '续卡中卡数': ['renewMid', 'cards'], '续卡大卡数': ['renewLarge', 'cards']
    };
    var config = map[label];
    if (!config) return null;
    var value = config[0] === 'gap' ? entity.revenue - entity.target : entity[config[0]];
    if (config[1] === 'money') return money(value);
    if (config[1] === 'percent') return percent(value);
    if (config[1] === 'cards') return integer(value) + '张';
    return integer(value);
  }

  function updateDates() {
    document.querySelectorAll('.four-week-table thead tr').forEach(function (row) {
      var heads = row.querySelectorAll('th');
      if (heads.length < 6) return;
      heads[2].textContent = '7/27-8/2';
      heads[3].textContent = '8/3-8/9';
      heads[4].innerHTML = '上周<br><small>8/10-8/16</small>';
      heads[5].innerHTML = '本周<br><small>8/24-8/30</small>';
    });
    document.querySelectorAll('[data-custom-start]').forEach(function (input) { input.value = '2026-08-24'; });
    document.querySelectorAll('[data-custom-end]').forEach(function (input) { input.value = '2026-08-30'; });
  }

  function updateSummary(page, entity, title) {
    if (!page) return;
    var summary = page.querySelector('.mtd-summary');
    if (!summary) return;
    var heading = summary.querySelector('.mtd-summary-title');
    if (heading) heading.textContent = title;
    var values = summary.querySelectorAll('.mtd-summary-grid b');
    if (values.length < 4) return;
    values[0].textContent = money(entity.revenue);
    values[1].textContent = money(entity.target);
    values[2].textContent = money(entity.revenue - entity.target);
    values[3].textContent = percent(entity.completion);
    values[2].classList.toggle('metric-bad', entity.revenue < entity.target);
    values[3].classList.toggle('metric-bad', entity.completion < 100);
  }

  function updateAreaBrief(page, area, storeMap) {
    if (!page) return;
    var cells = page.querySelectorAll('.area-brief > div');
    if (cells.length < 5) return;
    cells[0].querySelector('b').textContent = area.stores;
    cells[1].querySelector('b').textContent = money(area.revenue);
    cells[1].querySelector('em').textContent = percent(area.completion);
    cells[2].querySelector('b').textContent = integer(area.newCustomers);
    cells[2].querySelector('span').textContent = '新客数';
    var ratings = { red: 0, yellow: 0, green: 0 };
    Object.keys(storeMap).forEach(function (name) {
      if (storeMap[name].region !== area.name) return;
      ratings[ratingFor(storeMap[name])] += 1;
    });
    cells[3].querySelector('b').textContent = ratings.red + '/' + ratings.yellow + '/' + ratings.green;
    cells[4].querySelector('b').textContent = Object.keys(storeMap).filter(function (name) {
      return storeMap[name].region === area.name;
    }).reduce(function (sum, name) { return sum + failedMetrics(storeMap[name]).length; }, 0);
  }

  function updateFourWeekTables(brand, regions) {
    document.querySelectorAll('.metric-table.four-week-table:not(.store-core-table)').forEach(function (table) {
      var page = table.closest('.page');
      var entity = brand;
      if (page && !page.matches(':first-of-type')) {
        var guide = page.querySelector('.page-guide');
        var match = guide && guide.textContent.match(/[123]区/);
        if (match) entity = regions[match[0]];
      }
      table.querySelectorAll('tbody tr').forEach(function (row) {
        var labelCell = row.querySelector('.metric-name');
        var weeks = row.querySelectorAll('.week-value');
        if (!labelCell || weeks.length < 4) return;
        if (row.dataset.weekShifted !== '20260824') {
          weeks[0].textContent = weeks[1].textContent;
          weeks[1].textContent = weeks[2].textContent;
          weeks[2].textContent = weeks[3].textContent;
          row.dataset.weekShifted = '20260824';
        }
        var label = labelCell.textContent.trim();
        var current = metricValue(entity, label);
        if (current == null) return;
        var previousText = weeks[2].textContent;
        weeks[3].textContent = current;
        weeks[3].classList.toggle('metric-bad', isBad(entity, label));
        updateTrendCells(row, label, previousText, current, entity);
      });
    });
  }

  function updateTrendCells(row, label, previousText, currentText, entity) {
    var weeks = row.querySelectorAll('.week-value');
    var changeCell = weeks[3] && weeks[3].nextElementSibling;
    var judgmentCell = changeCell && changeCell.nextElementSibling;
    if (!changeCell || !judgmentCell) return;
    var previous = number(previousText);
    var current = number(currentText);
    var change = null;
    if (previous != null && current != null) {
      change = /率|占比/.test(label) ? current - previous : (previous ? (current - previous) / Math.abs(previous) * 100 : 0);
    }
    var favorable = change == null ? null : (label === '新签小卡率' ? change <= 0 : change >= 0);
    changeCell.innerHTML = '<span class="' + (change == null ? '' : (favorable ? 'cg' : 'cr')) + '">' +
      (change == null ? '—' : (change >= 0 ? '+' : '') + change.toFixed(1) + '%') + '</span>';
    var bad = isBad(entity, label);
    var judgment = '—';
    var judgmentGood = false;
    if (bad) {
      judgment = '未过线';
    } else if (label === '新签小卡率') {
      judgment = change == null ? '达标' : (change <= 0 ? '较上周下降' : '较上周上升');
      judgmentGood = change == null || change <= 0;
    } else if (/率|占比/.test(label)) {
      judgment = '达标';
      judgmentGood = true;
    } else if (change != null) {
      judgment = change >= 0 ? '较上周增长' : '较上周下降';
      judgmentGood = change >= 0;
    }
    judgmentCell.innerHTML = '<span class="' + (judgmentGood ? 'cg' : 'cr') + '">' + judgment + '</span>';
  }

  function isBad(entity, label) {
    var valueMap = {
      '完成率': entity.completion, '新签办卡率': entity.newSignRate, '新签小卡率': entity.newSmallRate,
      '新签中大卡率': entity.newMidLargeRate, '大卡率': entity.overallLargeRate, '整体大卡率': entity.overallLargeRate,
      '续卡占比': entity.renewShare, '总续卡占比': entity.renewShare, '总引流占比': entity.trafficShare, '扫楼占比': entity.sweepShare
    };
    if (!(label in valueMap) || valueMap[label] == null) return false;
    if (label === '新签小卡率') return valueMap[label] > 40;
    var line = { '完成率': 100, '新签办卡率': 40, '新签中大卡率': 55, '大卡率': 70, '整体大卡率': 70,
      '续卡占比': 20, '总续卡占比': 20, '总引流占比': 25, '扫楼占比': 15 }[label];
    return valueMap[label] < line;
  }

  function updateRankings(storeMap, regions, brand) {
    document.querySelectorAll('table[data-ranking-table="region"], table[data-ranking-table="store"]').forEach(function (table) {
      var isRegion = table.classList.contains('region-ranking-table');
      var rows = Array.from(table.querySelectorAll('tbody tr'));
      rows.forEach(function (row) {
        var name = row.children[0] ? row.children[0].textContent.trim() : '';
        var entity = isRegion ? regions[name] : storeMap[name];
        if (!entity) return;
        updateRankingDatasets(row, entity);
        updateRankingVisibleCells(table, row, entity);
      });
      rows.filter(function (row) {
        var name = row.children[0] ? row.children[0].textContent.trim() : '';
        return isRegion ? Boolean(regions[name]) : Boolean(storeMap[name]);
      }).sort(function (a, b) {
        return Number(b.dataset.revenueCurrent || 0) - Number(a.dataset.revenueCurrent || 0);
      }).forEach(function (row, index) {
        var rank = row.querySelector('[data-rank-cell]') || row.children[1];
        if (rank) rank.textContent = index + 1;
        row.parentNode.appendChild(row);
      });
      updateTotalRow(table, isRegion ? brand : aggregateRowsForTable(table, storeMap));
    });
  }

  function updateRankingDatasets(row, entity) {
    var previousMetricLabels = {
      revenue: '总营收',
      completion: '完成率',
      newSignRevenue: '新签营收',
      newRate: '新签办卡率',
      renewAmount: '续卡金额',
      renewShare: '续卡占比',
      renewRate: '续费率',
      newSmallRate: '新签小卡率',
      newMidLargeRate: '新签中大卡率',
      traffic: '总引流金额',
      trafficShare: '总引流占比',
      newCustomers: '新客数',
      target: '目标'
    };
    function previousSupportValue(key) {
      var support = entity && entity.name ? priorSupport[entity.name] : null;
      var label = previousMetricLabels[key];
      if (!support || !label || support[label] == null || support[label] === '') return null;
      return number(support[label]);
    }
    var fields = {
      revenue: entity.revenue, completion: entity.completion, newSignRevenue: entity.newCardAmount, newRate: entity.newSignRate,
      renewAmount: entity.renewAmount, renewShare: entity.renewShare, renewRate: entity.renewRate,
      newSmallRate: entity.newSmallRate, newMidLargeRate: entity.newMidLargeRate,
      traffic: entity.trafficAmount, trafficShare: entity.trafficShare, newCustomers: entity.newCustomers
    };
    Object.keys(fields).forEach(function (key) {
      var currentAttr = key + '-current';
      var previousAttr = key + '-previous';
      var supportPrevious = previousSupportValue(key);
      if (supportPrevious != null) {
        row.setAttribute('data-' + previousAttr, supportPrevious);
      } else if (row.dataset.sourcePriorLocked !== 'true') {
        var oldCurrent = row.getAttribute('data-' + currentAttr);
        if (oldCurrent != null && oldCurrent !== '') row.setAttribute('data-' + previousAttr, oldCurrent);
      }
      row.setAttribute('data-' + currentAttr, fields[key] == null ? '' : fields[key]);
    });
    var supportTarget = previousSupportValue('target');
    if (supportTarget != null) {
      row.setAttribute('data-target-previous', supportTarget);
    } else if (row.dataset.sourcePriorLocked !== 'true') {
      row.setAttribute('data-target-previous', row.getAttribute('data-target-current') || row.getAttribute('data-target') || '');
    }
    row.setAttribute('data-target-current', entity.target || '');
    row.dataset.sourcePriorLocked = 'true';
  }

  function updateRankingVisibleCells(table, row, entity) {
    var heads = Array.from(table.querySelectorAll('thead th')).map(function (head) { return head.textContent.replace(/\s+/g, '').trim(); });
    heads.forEach(function (head, index) {
      var cell = row.children[index];
      if (!cell || head === '门店' || head === '大区' || head === '区域' || head === '排名') return;
      var value = metricValue(entity, head);
      if (value == null) return;
      cell.textContent = value;
      cell.classList.toggle('metric-bad', isBad(entity, head));
    });
  }

  function aggregateRowsForTable(table, storeMap) {
    var names = Array.from(table.querySelectorAll('tbody tr')).map(function (row) {
      return row.children[0] ? row.children[0].textContent.trim() : '';
    }).filter(function (name) { return Boolean(storeMap[name]); });
    var rows = names.map(function (name) { return storeMap[name]; });
    return aggregate(rows, '合计', rows.reduce(function (sum, row) { return sum + Number(row.target || 0); }, 0));
  }

  function updateTotalRow(table, total) {
    var rows = Array.from(table.querySelectorAll('tr'));
    var row = rows.find(function (item) { return item.children[0] && /合计|汇总/.test(item.children[0].textContent); });
    if (row) updateRankingVisibleCells(table, row, total);
  }

  function updateClosureCards(storeMap) {
    document.querySelectorAll('.store-review-card').forEach(function (card) {
      var store = storeMap[card.dataset.storeName];
      if (!store) return;
      card.querySelectorAll('.support-metric').forEach(function (metric) {
        var labelNode = metric.querySelector('b');
        var valueNode = metric.querySelector('span');
        var deltaNode = metric.querySelector('em');
        if (!labelNode || !valueNode || !deltaNode) return;
        var label = labelNode.textContent.trim();
        if (hiddenSupportLabels[label]) {
          metric.remove();
          return;
        }
        var current = metricValue(store, label);
        if (current == null) return;
        var previous = priorSupport[store.name] && priorSupport[store.name][label] || '—';
        valueNode.textContent = previous + ' → ' + current;
        deltaNode.textContent = delta(previous, current, label);
        metric.classList.toggle('is-bad', isBad(store, label));
      });
      var rating = card.querySelector('.closure-rating');
      if (rating) {
        var state = ratingFor(store);
        rating.className = 'closure-rating ' + state;
        rating.textContent = state === 'red' ? '红灯' : state === 'yellow' ? '黄灯' : '绿灯';
      }
      var problem = card.querySelector('.review-panel.problem .review-editor, .review-panel.problem .question-editor, .review-panel.problem [data-edit-field="question"], .review-panel.problem textarea');
      if (problem) {
        if (!('value' in problem)) problem.contentEditable = 'true';
        problem.setAttribute('spellcheck', 'false');
        problem.dataset.editField = 'question';
        problem.dataset.placeholder = '点击修改本周问题';
        var currentText = ('value' in problem ? problem.value : problem.textContent || '').trim();
        var placeholderLike = !currentText || currentText === '点击修改本周问题' ||
          currentText === '点击填写门店回答和下周计划' || currentText === '点击填写门店回答及下周计划';
        if (placeholderLike) {
          if ('value' in problem) problem.value = questionFor(store);
          else problem.textContent = questionFor(store);
        }
      }
    });
  }

  function delta(previousText, currentText, label) {
    var previous = number(previousText);
    var current = number(currentText);
    if (previous == null || current == null) return '—';
    var value = /率|占比/.test(label) ? current - previous : (previous ? (current - previous) / Math.abs(previous) * 100 : 0);
    return (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
  }

  function failedMetrics(store) {
    var labels = ['完成率', '新签办卡率', '新签小卡率', '新签中大卡率', '续卡占比', '总引流占比', '扫楼占比', '整体大卡率'];
    return labels.filter(function (label) { return isBad(store, label); });
  }

  function ratingFor(store) {
    var count = failedMetrics(store).length;
    return count >= 4 ? 'red' : count >= 2 ? 'yellow' : 'green';
  }

  function questionFor(store) {
    var labels = failedMetrics(store).slice(0, 3);
    if (!labels.length) {
      return '1. 本周已达标指标如何固化为日动作？\n2. 下周最可能回落的指标是什么，预防动作和责任人是谁？';
    }
    return labels.map(function (label, index) {
      var value = metricValue(store, label === '整体大卡率' ? '整体大卡率' : label);
      return (index + 1) + '. ' + label + '本周为' + value + '，未达标准。缺口集中在哪些日期、时段或渠道？责任人、改善动作和验收时间是什么？';
    }).join('\n');
  }

  function updateConclusions(brand, regions) {
    var all = Object.assign({ '品牌': brand }, regions);
    document.querySelectorAll('.conclusion[data-conclusion-area]').forEach(function (section) {
      var entity = all[section.dataset.conclusionArea];
      if (!entity) return;
      var problem = section.querySelector('[data-edit-field="conclusion_problem"]');
      var highlight = section.querySelector('[data-edit-field="conclusion_highlight"]');
      var action = section.querySelector('[data-edit-field="conclusion_action"]');
      var bad = ['完成率', '新签中大卡率', '续卡占比', '总引流占比', '扫楼占比', '整体大卡率'].filter(function (label) { return isBad(entity, label); });
      setGeneratedConclusion(problem, bad.slice(0, 3).map(function (label) { return label + metricValue(entity, label); }).join('；') + '。');
      setGeneratedConclusion(highlight, '本周营收' + money(entity.revenue) + '；续卡金额' + money(entity.renewAmount) + '；总引流金额' + money(entity.trafficAmount) + '。');
      setGeneratedConclusion(action, '优先处理' + bad.slice(0, 2).join('和') + '，拆到门店、责任人和每日验收节点。');
    });
    window.dispatchEvent(new CustomEvent('weekly-report-data-ready'));
  }

  function setGeneratedConclusion(node, text) {
    if (!node) return;
    var current = node.textContent.trim();
    if (current && node.dataset.generatedConclusion !== 'true') return;
    node.textContent = text;
    node.dataset.generatedConclusion = 'true';
    node.addEventListener('input', function () { node.dataset.generatedConclusion = 'false'; }, { once: true });
  }

  function updateHeaderScore() {
    var score = { red: 0, yellow: 0, green: 0 };
    document.querySelectorAll('.store-review-card .closure-rating').forEach(function (badge) {
      if (badge.classList.contains('red')) score.red += 1;
      else if (badge.classList.contains('yellow')) score.yellow += 1;
      else score.green += 1;
    });
    var node = document.querySelector('.header-score b');
    if (node) node.textContent = score.red + '/' + score.yellow + '/' + score.green;
  }

  function updatePeopleRankings(source) {
    function normalizeName(name) {
      return name === '郭文字' ? '郭文宇' : name;
    }
    var managerRoster = [
      {
            "previousRank": 1,
            "region": "3区",
            "store": "武汉武昌万象城",
            "name": "王艺",
            "previousAmount": 12426.42
      },
      {
            "previousRank": 2,
            "region": "2区",
            "store": "洛阳泉舜",
            "name": "王若涵",
            "previousAmount": 10384
      },
      {
            "previousRank": 3,
            "region": "3区",
            "store": "武汉荟聚",
            "name": "周坤琪",
            "previousAmount": 9868.9
      },
      {
            "previousRank": 4,
            "region": "2区",
            "store": "焦作万达",
            "name": "张强",
            "previousAmount": 8518
      },
      {
            "previousRank": 5,
            "region": "3区",
            "store": "郑州中原万达",
            "name": "王嘉琦",
            "previousAmount": 8226
      },
      {
            "previousRank": 6,
            "region": "3区",
            "store": "安阳滑县吾悦",
            "name": "汤明放",
            "previousAmount": 4893.05
      },
      {
            "previousRank": 7,
            "region": "1区",
            "store": "南阳万达",
            "name": "王佳婷",
            "previousAmount": 4705
      },
      {
            "previousRank": 8,
            "region": "2区",
            "store": "新乡万达",
            "name": "贵诗涵",
            "previousAmount": 4355
      },
      {
            "previousRank": 9,
            "region": "2区",
            "store": "周口万达",
            "name": "杨宁可",
            "previousAmount": 4210
      },
      {
            "previousRank": 10,
            "region": "2区",
            "store": "洛阳中州万达",
            "name": "霍亭芮",
            "previousAmount": 3019
      },
      {
            "previousRank": 11,
            "region": "1区",
            "store": "南阳吾悦",
            "name": "齐继风",
            "previousAmount": 2799
      },
      {
            "previousRank": 12,
            "region": "1区",
            "store": "襄阳高新万达",
            "name": "王爽",
            "previousAmount": 2792
      },
      {
            "previousRank": 13,
            "region": "2区",
            "store": "郑州信万",
            "name": "司聪慧",
            "previousAmount": 2290
      },
      {
            "previousRank": 14,
            "region": "3区",
            "store": "开封万达",
            "name": "卢嘉诺",
            "previousAmount": 1127.2
      },
      {
            "previousRank": 15,
            "region": "1区",
            "store": "南阳吾悦",
            "name": "蔺海芬",
            "previousAmount": 928
      },
      {
            "previousRank": 16,
            "region": "3区",
            "store": "郑州二七万象城",
            "name": "郑金原",
            "previousAmount": 150
      },
      {
            "previousRank": 17,
            "region": "3区",
            "store": "郑州美盛天街",
            "name": "郭文宇",
            "previousAmount": 77
      }
];
    var confirmedManagers = managerRoster.reduce(function (map, person) {
      map[person.name] = true;
      return map;
    }, { '齐继风': true, '蔺海芬': true, '郭文宇': true, '郭文字': true });
    var allPeople = (source && source.employees || []).map(function (person) {
      return Object.assign({}, person, { name: normalizeName(person.name) });
    }).sort(function (a, b) { return b.amount - a.amount; });
    var hasPeopleData = allPeople.length > 0;
    var currentPeopleNote = hasPeopleData ? '8月24日-8月30日店长/店员个人排名已按本周Excel更新。' : '8月24日-8月30日店长/店员个人排名数据未提供；本页不沿用上周个人数据。';
    var currentByName = {};
    allPeople.forEach(function (person) {
      if (!currentByName[person.name]) currentByName[person.name] = person;
    });
    var seenManagers = {};
    var managers = managerRoster.map(function (person) {
      var current = currentByName[person.name];
      seenManagers[person.name] = true;
      return Object.assign({}, current || {}, person, {
        region: current && current.region || person.region,
        store: current && current.store || person.store,
        missingCurrent: !current
      });
    });
    allPeople.forEach(function (person) {
      if ((person.role === 'manager' || confirmedManagers[person.name]) && !seenManagers[person.name]) {
        seenManagers[person.name] = true;
        managers.push(Object.assign({}, person, { previousAmount: null, previousRank: null, missingCurrent: false }));
      }
    });
    managers.sort(function (a, b) {
      if (!a.missingCurrent && !b.missingCurrent) return Number(b.amount || 0) - Number(a.amount || 0);
      if (!a.missingCurrent) return -1;
      if (!b.missingCurrent) return 1;
      return Number(a.previousRank || 999) - Number(b.previousRank || 999);
    });
    var employees = allPeople.filter(function (person) { return person.role !== 'manager' && !confirmedManagers[person.name]; });
    var pageForTitle = function (title) {
      var heading = Array.from(document.querySelectorAll('.page .section-title')).find(function (item) {
        return item.textContent.trim() === title;
      });
      return heading && heading.closest('.page');
    };
    var fullPage = pageForTitle('店员全员排名：全品牌统一看优秀和短板');
    var fullTable = fullPage && fullPage.querySelector('table[data-ranking-table="employee"]');
    var historicalAliases = { '李苗壮': '李茁壮', '张运博': '张运倩', '蒋雪梅': '蒋雪柯', '孙灼柱': '孙刘柱', '徐桃森': '徐彬森' };
    var history = {};
    if (fullTable) {
      Array.from(fullTable.tBodies[0].rows).forEach(function (row) {
        var name = row.children[5] && row.children[5].textContent.trim();
        if (!name) return;
        name = normalizeName(historicalAliases[name] || name);
        history[name] = {
          rank: number(row.children[0] && row.children[0].textContent),
          region: row.children[3] && row.children[3].textContent.trim(),
          amount: number(row.getAttribute('data-amount-current'))
        };
      });
    }
    var previousAreaRanks = {};
    ['1区', '2区', '3区'].forEach(function (area) {
      Object.keys(history).filter(function (name) { return history[name].region === area; })
        .sort(function (a, b) { return Number(history[b].amount || 0) - Number(history[a].amount || 0); })
        .forEach(function (name, index) { previousAreaRanks[area + '|' + name] = index + 1; });
    });

    function addNote(page, text, warning) {
      if (!page) return;
      var old = page.querySelector('.current-week-source-note');
      if (old) old.remove();
      var note = document.createElement('div');
      note.className = 'current-week-source-note';
      note.textContent = text;
      note.style.cssText = 'margin:14px 0;padding:12px 16px;border:1px solid ' + (warning ? '#f3c98b' : '#b8dfd2') + ';background:' + (warning ? '#fff8eb' : '#eef9f5') + ';color:' + (warning ? '#8a4b08' : '#145c49') + ';font-weight:800;';
      var guide = page.querySelector('.page-guide');
      if (guide) guide.insertAdjacentElement('afterend', note);
    }

    function rate(value, total) {
      return total ? value / total * 100 : 0;
    }

    function rankCell(rank) {
      if (rank === 1) return '<span class="rank-medal gold">金</span>';
      if (rank === 2) return '<span class="rank-medal silver">银</span>';
      if (rank === 3) return '<span class="rank-medal bronze">铜</span>';
      return String(rank);
    }

    function render(page, rows, area, roleLabel, noteText, warning) {
      if (!page) return;
      var table = page.querySelector('table[data-ranking-table="employee"]');
      if (!table) return;
      var headers = ['本周', '上周', '排名变化', '区域', '门店', roleLabel || '店员', '本周总金额', '本周完成率', '上周总金额', '金额增减', '续卡金额', '办卡/新签/续卡', '新签办卡率', '新签小卡率', '新签中卡率', '新签大卡率'];
      Array.from(table.querySelectorAll('thead th')).forEach(function (header, index) {
        if (headers[index]) header.textContent = headers[index];
      });
      var body = table.tBodies[0];
      body.innerHTML = '';
      rows.forEach(function (employee, index) {
        var hasCurrent = !employee.missingCurrent && Number.isFinite(Number(employee.amount));
        var currentRank = hasCurrent ? index + 1 : null;
        var old = history[employee.name];
        var previousRank = employee.previousRank != null ? employee.previousRank : area ? previousAreaRanks[area + '|' + employee.name] : old && old.rank;
        var previousAmount = employee.previousAmount != null ? employee.previousAmount : old && old.amount;
        var change = !hasCurrent || previousRank == null ? null : previousRank - currentRank;
        var amountChange = !hasCurrent || previousAmount == null ? null : employee.amount - previousAmount;
        var hasNewCardCount = employee.newCardCount != null || employee.newSmall != null || employee.newMid != null || employee.newLarge != null;
        var hasRenewCount = employee.renewCount != null || employee.renewSmall != null || employee.renewMid != null || employee.renewLarge != null;
        var newTotal = employee.newCardCount == null ? (hasNewCardCount ? Number(employee.newSmall || 0) + Number(employee.newMid || 0) + Number(employee.newLarge || 0) : null) : employee.newCardCount;
        var renewTotal = employee.renewCount == null ? (hasRenewCount ? Number(employee.renewSmall || 0) + Number(employee.renewMid || 0) + Number(employee.renewLarge || 0) : null) : employee.renewCount;
        var newSmallRate = Object.prototype.hasOwnProperty.call(employee, 'newSmallRate') ? employee.newSmallRate : rate(employee.newSmall, newTotal);
        var newMidRate = Object.prototype.hasOwnProperty.call(employee, 'newMidRate') ? employee.newMidRate : rate(employee.newMid, newTotal);
        var newLargeRate = Object.prototype.hasOwnProperty.call(employee, 'newLargeRate') ? employee.newLargeRate : rate(employee.newLarge, newTotal);
        var completionKnown = employee.completion != null && Number.isFinite(Number(employee.completion));
        var cardCountText = employee.cardCount == null || !Number.isFinite(Number(employee.cardCount)) ? '—' : integer(employee.cardCount);
        var newSignText = employee.newCardAmount == null || !Number.isFinite(Number(employee.newCardAmount)) ? '—' : money(employee.newCardAmount);
        var renewText = employee.renewAmount == null || !Number.isFinite(Number(employee.renewAmount)) ? '—' : money(employee.renewAmount);
        var row = document.createElement('tr');
        if (hasCurrent) row.setAttribute('data-amount-current', employee.amount);
        if (previousAmount != null) row.setAttribute('data-amount-previous', previousAmount);
        row.innerHTML = '<td data-rank-cell>' + (currentRank == null ? '-' : rankCell(currentRank)) + '</td>' +
          '<td>' + (previousRank == null ? '-' : previousRank) + '</td>' +
          '<td>' + (change == null ? '-' : '<span class="' + (change >= 0 ? 'cg' : 'cr') + '">' + (change >= 0 ? '+' : '') + change + '</span>') + '</td>' +
          '<td>' + employee.region + '</td><td>' + employee.store + '</td><td><b>' + employee.name + '</b></td>' +
          '<td>' + (hasCurrent ? '<span class="now">' + money(employee.amount) + '</span>' : '<span class="muted">本周数据未提供</span>') + '</td>' +
          '<td>' + (hasCurrent && completionKnown ? '<span class="' + (employee.completion >= 100 ? 'cg' : 'cr') + '">' + percent(employee.completion) + '</span>' : '-') + '</td>' +
          '<td>' + (previousAmount == null ? '-' : money(previousAmount)) + '</td>' +
          '<td>' + (amountChange == null ? '-' : '<span class="' + (amountChange >= 0 ? 'cg' : 'cr') + '">' + (amountChange >= 0 ? '+' : '-') + money(Math.abs(amountChange)) + '</span>') + '</td>' +
          '<td>' + (hasCurrent ? money(employee.renewAmount) : '-') + '</td>' +
          '<td>' + (hasCurrent ? cardCountText + '/' + newSignText + '/' + renewText : '-') + '</td>' +
          '<td>' + (hasCurrent ? percent(employee.newSignRate) : '-') + '</td>' +
          '<td>' + (hasCurrent ? percent(newSmallRate) : '-') + '</td>' +
          '<td>' + (hasCurrent ? percent(newMidRate) : '-') + '</td>' +
          '<td>' + (hasCurrent ? percent(newLargeRate) : '-') + '</td>';
        row.dataset.currentHtml = row.innerHTML;
        body.appendChild(row);
      });
      var brief = page.querySelector('.area-brief.employee-brief');
      if (brief) {
        var currentRows = rows.filter(function (row) { return !row.missingCurrent && Number.isFinite(Number(row.amount)); });
        var top = currentRows[0];
        var values = [rows.length, money(currentRows.reduce(function (sum, row) { return sum + Number(row.amount || 0); }, 0)), top ? top.name : '-', top ? money(top.amount) : '-', currentRows.filter(function (row) { return row.completion >= 100; }).length];
        Array.from(brief.querySelectorAll('b')).forEach(function (node, index) { node.textContent = values[index]; });
      }
      addNote(page, noteText || currentPeopleNote, warning);
    }

    var managerPage = pageForTitle('店长业绩排名');
    if (managerPage) {
      var managerAlert = managerPage.querySelector('.alert');
      if (managerAlert) managerAlert.textContent = hasPeopleData ? '店长排名已按本周Excel更新；店长身份按固定名单识别。' : '店长名单沿用上周固定链接完整名单；本周有数据则更新，未提供数据不使用旧数据冒充。';
      render(managerPage, managers, '', '店长', hasPeopleData ? '8月24日-8月30日店长排名已按本周Excel更新；未出现在本周数据中的店长保留名单但标注未提供。' : '店长名单保留用于会议核对；本周个人排名数据未提供，金额不使用旧数据冒充。', false);
    }
    render(fullPage, employees, '', '店员');
    ['1区', '2区', '3区'].forEach(function (area) {
      var areaPage = pageForTitle(area + '店员排名');
      render(areaPage, employees.filter(function (employee) { return employee.region === area; }), area, '店员');
    });
  }
})();
