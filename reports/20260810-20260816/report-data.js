(function () {
  'use strict';

  var priorSupport = {};
  document.querySelectorAll('.closure-store-scroll tbody tr').forEach(function (row) {
    var nameCell = row.querySelector('.object-cell b');
    if (!nameCell) return;
    var metrics = {};
    row.querySelectorAll('.support-metric').forEach(function (metric) {
      var label = metric.querySelector('b');
      var value = metric.querySelector('span');
      if (!label || !value) return;
      var parts = value.textContent.split('→').map(function (part) { return part.trim(); });
      metrics[label.textContent.trim()] = parts[parts.length - 1] || '-';
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
      metrics[label.textContent.trim()] = parts[parts.length - 1] || '-';
    });
    priorSupport[storeName] = metrics;
  });

  function ready() {
    if (document.readyState !== 'loading') return Promise.resolve();
    return new Promise(function (resolve) { document.addEventListener('DOMContentLoaded', resolve, { once: true }); });
  }

  Promise.all([
    ready(),
    fetch('./current-week-data.json', { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('本周数据读取失败');
      return response.json();
    }),
    fetch('./employee-current-week.json', { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('本周员工排名数据读取失败');
      return response.json();
    })
  ]).then(function (result) {
    window.setTimeout(function () { applyCurrentWeek(result[1], result[2]); }, 80);
  }).catch(function (error) {
    console.error(error);
  });

  function applyCurrentWeek(source, peopleSource) {
    var stores = source.stores || [];
    var storeMap = {};
    stores.forEach(function (store) { storeMap[store.name] = enrich(store); });
    var regions = {};
    ['1区', '2区', '3区'].forEach(function (area) {
      regions[area] = aggregate(stores.filter(function (store) { return store.region === area; }), area, source.regionTargets[area]);
    });
    var brand = aggregate(stores, '品牌', Object.keys(source.regionTargets).reduce(function (sum, area) {
      return sum + Number(source.regionTargets[area] || 0);
    }, 0));

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
    document.documentElement.dataset.reportDataReady = 'true';
  }

  function enrich(store) {
    var result = Object.assign({}, store);
    result.completion = ratio(store.revenue, store.target);
    result.newSmallRate = ratio(store.newSmall, store.newCardCount);
    result.newMidRate = ratio(store.newMid, store.newCardCount);
    result.newLargeRate = store.newLargeRateOverride == null ? ratio(store.newLarge, store.newCardCount) : Number(store.newLargeRateOverride);
    result.newMidLargeRate = ratio(store.newMid + store.newLarge, store.newCardCount);
    result.renewSmallRate = ratio(store.renewSmall, store.renewCount);
    result.renewMidRate = ratio(store.renewMid, store.renewCount);
    result.renewLargeRate = store.renewLargeRateOverride == null ? ratio(store.renewLarge, store.renewCount) : Number(store.renewLargeRateOverride);
    result.renewShare = store.renewShareOverride == null ? ratio(store.renewAmount, store.revenue) : Number(store.renewShareOverride);
    result.trafficShare = store.trafficShareOverride == null ? ratio(store.trafficAmount, store.newCardAmount) : Number(store.trafficShareOverride);
    result.sweepShare = ratio(store.sweepAmount, store.newCardAmount);
    result.overallLargeRate = store.overallLargeRateOverride == null ? ratio(store.newMid + store.newLarge + store.renewMid + store.renewLarge, store.cardCount) : Number(store.overallLargeRateOverride);
    return result;
  }

  function aggregate(rows, name, target) {
    var fields = ['revenue', 'customers', 'consumption', 'recharge', 'members', 'casual', 'cardCount', 'cardAmount',
      'newCardCount', 'newCardAmount', 'newSmall', 'newMid', 'newLarge', 'renewCount', 'renewAmount',
      'renewSmall', 'renewMid', 'renewLarge', 'partTimeVisits', 'trafficCount', 'trafficAmount', 'stairCount',
      'stairAmount', 'sweepCount', 'sweepAmount', 'otherTraffic', 'managerConfirmed', 'salary'];
    var result = { name: name, target: target, stores: rows.length, newCustomers: null, oldCustomers: null, newSignRate: null, renewRate: null };
    fields.forEach(function (field) {
      result[field] = rows.reduce(function (sum, row) { return sum + Number(row[field] || 0); }, 0);
    });
    result.completion = ratio(result.revenue, result.target);
    result.newSmallRate = ratio(result.newSmall, result.newCardCount);
    result.newMidRate = ratio(result.newMid, result.newCardCount);
    result.newLargeRate = ratio(result.newLarge, result.newCardCount);
    result.newMidLargeRate = ratio(result.newMid + result.newLarge, result.newCardCount);
    result.renewShare = ratio(result.renewAmount, result.revenue);
    result.trafficShare = ratio(result.trafficAmount, result.newCardAmount);
    result.sweepShare = ratio(result.sweepAmount, result.newCardAmount);
    result.overallLargeRate = ratio(result.newMid + result.newLarge + result.renewMid + result.renewLarge, result.cardCount);
    return result;
  }

  function ratio(value, base) {
    return base ? Number(value || 0) / Number(base) * 100 : 0;
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
    return value == null ? '—' : Math.round(Number(value)).toLocaleString('zh-CN');
  }

  function metricValue(entity, label) {
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
      heads[2].textContent = '7/20-7/26';
      heads[3].textContent = '7/27-8/2';
      heads[4].innerHTML = '上周<br><small>8/3-8/9</small>';
      heads[5].innerHTML = '本周<br><small>8/10-8/16</small>';
    });
    document.querySelectorAll('[data-custom-start]').forEach(function (input) { input.value = '2026-08-10'; });
    document.querySelectorAll('[data-custom-end]').forEach(function (input) { input.value = '2026-08-16'; });
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
    cells[2].querySelector('b').textContent = '—';
    cells[2].querySelector('span').textContent = '新客数未提供';
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
        var label = labelCell.textContent.trim();
        var current = metricValue(entity, label);
        if (current == null) return;
        weeks[0].innerHTML = weeks[1].innerHTML;
        weeks[1].innerHTML = weeks[2].innerHTML;
        weeks[2].innerHTML = weeks[3].innerHTML;
        weeks[3].textContent = current;
        weeks[3].classList.toggle('metric-bad', isBad(entity, label));
        updateTrendCells(row, label, weeks[2].textContent, current, entity);
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
    changeCell.innerHTML = '<span class="' + (change != null && change >= 0 ? 'cg' : 'cr') + '">' +
      (change == null ? '—' : (change >= 0 ? '+' : '') + change.toFixed(1) + '%') + '</span>';
    var bad = isBad(entity, label);
    var judgment = bad ? '未过线' : (/率|占比/.test(label) ? '达标' : (change == null ? '—' : change >= 0 ? '较上周增长' : '较上周下降'));
    judgmentCell.innerHTML = '<span class="' + (bad ? 'cr' : 'cg') + '">' + judgment + '</span>';
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
    document.querySelectorAll('table.ranking-table').forEach(function (table) {
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
    var fields = {
      revenue: entity.revenue, completion: entity.completion, newRate: entity.newSignRate,
      renewAmount: entity.renewAmount, renewShare: entity.renewShare, renewRate: entity.renewRate,
      newSmallRate: entity.newSmallRate, newMidLargeRate: entity.newMidLargeRate,
      traffic: entity.trafficAmount, trafficShare: entity.trafficShare, newCustomers: null
    };
    Object.keys(fields).forEach(function (key) {
      var currentAttr = camelToData(key) + '-current';
      var previousAttr = camelToData(key) + '-previous';
      var monthAttr = camelToData(key) + '-month';
      var oldCurrent = row.getAttribute('data-' + currentAttr);
      row.setAttribute('data-' + previousAttr, oldCurrent == null ? '' : oldCurrent);
      row.setAttribute('data-' + currentAttr, fields[key] == null ? '' : fields[key]);
      if (['revenue', 'renewAmount', 'traffic'].indexOf(key) >= 0) {
        var oldMonth = Number(row.getAttribute('data-' + monthAttr) || 0);
        row.setAttribute('data-' + monthAttr, oldMonth + Number(fields[key] || 0));
      }
    });
    row.setAttribute('data-target-previous', row.getAttribute('data-target-current') || row.getAttribute('data-target') || '');
    row.setAttribute('data-target-current', entity.target || '');
    var oldMonthTarget = Number(row.getAttribute('data-target-month') || 0);
    row.setAttribute('data-target-month', oldMonthTarget + Number(entity.target || 0));
  }

  function camelToData(value) {
    return value.replace(/[A-Z]/g, function (letter) { return '-' + letter.toLowerCase(); });
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
        var current = metricValue(store, label);
        if (current == null) return;
        var previous = priorSupport[store.name] && priorSupport[store.name][label] || '—';
        if (label === '新客数' || label === '老客数') current = '—';
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
      var problem = card.querySelector('.review-panel.problem [contenteditable="true"], .review-panel.problem textarea');
      if (problem) {
        problem.textContent = questionFor(store);
        problem.dataset.editField = 'question';
        problem.dataset.placeholder = '点击修改本周问题';
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
      if (problem) problem.textContent = bad.slice(0, 3).map(function (label) { return label + metricValue(entity, label); }).join('；') + '。';
      if (highlight) highlight.textContent = '本周营收' + money(entity.revenue) + '；续卡金额' + money(entity.renewAmount) + '；总引流金额' + money(entity.trafficAmount) + '。';
      if (action) action.textContent = '优先处理' + bad.slice(0, 2).join('和') + '，拆到门店、责任人和每日验收节点。';
    });
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
    var employees = (source && source.employees || []).slice().sort(function (a, b) { return b.amount - a.amount; });
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
        name = historicalAliases[name] || name;
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

    function render(page, rows, area) {
      if (!page) return;
      var table = page.querySelector('table[data-ranking-table="employee"]');
      if (!table) return;
      var headers = ['本周', '上周', '排名变化', '区域', '门店', '店员', '本周总金额', '本周完成率', '上周总金额', '金额增减', '续卡金额', '办卡/新签/续卡', '新签办卡率', '新签小卡率', '新签中卡率', '新签大卡率'];
      Array.from(table.querySelectorAll('thead th')).forEach(function (header, index) {
        if (headers[index]) header.textContent = headers[index];
      });
      var body = table.tBodies[0];
      body.innerHTML = '';
      rows.forEach(function (employee, index) {
        var currentRank = index + 1;
        var old = history[employee.name];
        var previousRank = area ? previousAreaRanks[area + '|' + employee.name] : old && old.rank;
        var previousAmount = old && old.amount;
        var change = previousRank == null ? null : previousRank - currentRank;
        var amountChange = previousAmount == null ? null : employee.amount - previousAmount;
        var newTotal = employee.newSmall + employee.newMid + employee.newLarge;
        var renewTotal = employee.renewSmall + employee.renewMid + employee.renewLarge;
        var row = document.createElement('tr');
        row.setAttribute('data-amount-current', employee.amount);
        if (previousAmount != null) row.setAttribute('data-amount-previous', previousAmount);
        row.innerHTML = '<td data-rank-cell>' + rankCell(currentRank) + '</td>' +
          '<td>' + (previousRank == null ? '-' : previousRank) + '</td>' +
          '<td>' + (change == null ? '-' : '<span class="' + (change >= 0 ? 'cg' : 'cr') + '">' + (change >= 0 ? '+' : '') + change + '</span>') + '</td>' +
          '<td>' + employee.region + '</td><td>' + employee.store + '</td><td><b>' + employee.name + '</b></td>' +
          '<td><span class="now">' + money(employee.amount) + '</span></td>' +
          '<td><span class="' + (employee.completion >= 100 ? 'cg' : 'cr') + '">' + percent(employee.completion) + '</span></td>' +
          '<td>' + (previousAmount == null ? '-' : money(previousAmount)) + '</td>' +
          '<td>' + (amountChange == null ? '-' : '<span class="' + (amountChange >= 0 ? 'cg' : 'cr') + '">' + (amountChange >= 0 ? '+' : '-') + money(Math.abs(amountChange)) + '</span>') + '</td>' +
          '<td>' + money(employee.renewAmount) + '</td>' +
          '<td>' + employee.cardCount + '/' + newTotal + '/' + renewTotal + '</td>' +
          '<td>' + percent(employee.newSignRate) + '</td>' +
          '<td>' + percent(rate(employee.newSmall, newTotal)) + '</td>' +
          '<td>' + percent(rate(employee.newMid, newTotal)) + '</td>' +
          '<td>' + percent(rate(employee.newLarge, newTotal)) + '</td>';
        body.appendChild(row);
      });
      var brief = page.querySelector('.area-brief.employee-brief');
      if (brief) {
        var top = rows[0];
        var values = [rows.length, money(rows.reduce(function (sum, row) { return sum + row.amount; }, 0)), top ? top.name : '-', top ? money(top.amount) : '-', rows.filter(function (row) { return row.completion >= 100; }).length];
        Array.from(brief.querySelectorAll('b')).forEach(function (node, index) { node.textContent = values[index]; });
      }
      addNote(page, '8月10日-8月16日员工排名已按用户截图原值更新；测试门店、非正式门店及已确认店长未计入。', false);
    }

    var managerPage = pageForTitle('店长业绩排名');
    if (managerPage) {
      managerPage.querySelectorAll('table tbody').forEach(function (body) { body.innerHTML = ''; });
      addNote(managerPage, '8月10日-8月16日店长独立排名截图尚未提供，本页不沿用上周数据。', true);
    }
    render(fullPage, employees, '');
    ['1区', '2区', '3区'].forEach(function (area) {
      var areaPage = pageForTitle(area + '店员排名');
      render(areaPage, employees.filter(function (employee) { return employee.region === area; }), area);
    });
  }
})();
