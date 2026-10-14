const defaultInvestments = [
  { name: "Gold", cost: 20000, expectedReturn: 26000, risk: "Moderate" },
  { name: "Bitcoin", cost: 30000, expectedReturn: 45000, risk: "High" },
  { name: "Apple Stock", cost: 25000, expectedReturn: 34000, risk: "High" },
  { name: "Government Bonds", cost: 15000, expectedReturn: 18000, risk: "Low" },
  { name: "Fixed Deposit", cost: 10000, expectedReturn: 12000, risk: "Low" },
  { name: "Real Estate", cost: 50000, expectedReturn: 65000, risk: "Moderate" }
];

let investments = defaultInvestments.map((item) => ({ ...item }));

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function greedySelection(items, budget) {
  const sorted = [...items].sort(
    (a, b) => (b.expectedReturn / b.cost) - (a.expectedReturn / a.cost)
  );
  const selected = [];
  let totalCost = 0;
  let totalReturn = 0;

  for (const item of sorted) {
    if (totalCost + item.cost <= budget) {
      selected.push(item);
      totalCost += item.cost;
      totalReturn += item.expectedReturn;
    }
  }

  return { selected, totalCost, totalReturn };
}

function dynamicProgrammingSelection(items, budget) {
  const dp = Array.from({ length: items.length + 1 }, () => Array(budget + 1).fill(0));

  for (let i = 1; i <= items.length; i += 1) {
    const item = items[i - 1];
    for (let available = 0; available <= budget; available += 1) {
      dp[i][available] = dp[i - 1][available];
      if (item.cost <= available) {
        dp[i][available] = Math.max(
          dp[i][available],
          item.expectedReturn + dp[i - 1][available - item.cost]
        );
      }
    }
  }

  const selected = [];
  let remainingBudget = budget;
  for (let i = items.length; i > 0; i -= 1) {
    if (dp[i][remainingBudget] !== dp[i - 1][remainingBudget]) {
      const item = items[i - 1];
      selected.push(item);
      remainingBudget -= item.cost;
    }
  }

  selected.reverse();
  return {
    selected,
    totalCost: selected.reduce((sum, item) => sum + item.cost, 0),
    totalReturn: selected.reduce((sum, item) => sum + item.expectedReturn, 0)
  };
}

function sortedInvestments() {
  const query = document.getElementById("investment-search").value.trim().toLowerCase();
  const sortBy = document.getElementById("investment-sort").value;
  const matches = investments.filter((item) => item.name.toLowerCase().includes(query));

  matches.sort((a, b) => {
    if (sortBy === "return") return b.expectedReturn - a.expectedReturn;
    if (sortBy === "cost") return a.cost - b.cost;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return (b.expectedReturn / b.cost) - (a.expectedReturn / a.cost);
  });
  return matches;
}

function renderInvestmentCards() {
  const list = document.getElementById("investment-list");
  const visibleInvestments = sortedInvestments();
  document.getElementById("opportunity-count").textContent = `${visibleInvestments.length} OF ${investments.length} ASSETS`;

  if (!visibleInvestments.length) {
    list.innerHTML = '<p class="empty-state">No investments match that search.</p>';
    return;
  }

  list.innerHTML = visibleInvestments.map((item) => `
    <article class="investment-card">
      <div class="asset-topline">
        <span class="asset-monogram" aria-hidden="true">${item.name.slice(0, 1)}</span>
        <span class="risk-tag risk-${item.risk.toLowerCase()}">${item.risk} risk</span>
      </div>
      <h3>${item.name}</h3>
      <label class="asset-input"><span>Cost</span><span class="asset-value"><span>&#8377;</span><input type="number" min="1" step="1000" value="${item.cost}" data-investment="${item.name}" data-field="cost" aria-label="${item.name} cost" /></span></label>
      <label class="asset-input"><span>Expected return</span><span class="asset-value"><span>&#8377;</span><input type="number" min="0" step="1000" value="${item.expectedReturn}" data-investment="${item.name}" data-field="expectedReturn" aria-label="${item.name} expected return" /></span></label>
      <div class="asset-footer"><span>Return ratio</span><strong data-ratio="${item.name}">${(item.expectedReturn / item.cost).toFixed(2)}x</strong></div>
    </article>
  `).join("");
}

function renderStrategy(title, result, budget, modifier) {
  const utilization = budget > 0 ? Math.min(100, (result.totalCost / budget) * 100) : 0;
  const selectedMarkup = result.selected.length
    ? result.selected.map((item) => `
      <li class="selected-asset">
        <span class="selected-name"><span class="selection-dot"></span>${item.name}</span>
        <span class="selected-numbers"><strong>${formatCurrency(item.expectedReturn)}</strong><small>${formatCurrency(item.cost)} invested</small></span>
      </li>`).join("")
    : '<li class="empty-selection">No assets fit this budget.</li>';

  return `
    <article class="result-card ${modifier}">
      <div class="strategy-heading"><div><span class="strategy-label">${modifier === "greedy-card" ? "STRATEGY A" : "STRATEGY B"}</span><h3>${title}</h3></div><span class="strategy-count">${result.selected.length} picked</span></div>
      <div class="return-highlight"><span>Expected return</span><strong>${formatCurrency(result.totalReturn)}</strong></div>
      <div class="allocation-heading"><span>Budget used</span><strong>${formatCurrency(result.totalCost)} <span>/ ${formatCurrency(budget)}</span></strong></div>
      <div class="allocation-track" role="img" aria-label="${utilization.toFixed(0)} percent of budget used"><span style="width: ${utilization}%"></span></div>
      <ul class="selected-list">${selectedMarkup}</ul>
    </article>`;
}

function readInvestmentInputs() {
  for (const input of document.querySelectorAll("[data-investment]")) {
    const value = Number(input.value);
    const item = investments.find((investment) => investment.name === input.dataset.investment);
    if (!input.value || !item || !Number.isSafeInteger(value) || value < Number(input.min)) {
      input.setCustomValidity("Enter a valid whole-number amount.");
      input.reportValidity();
      return false;
    }

    input.setCustomValidity("");
    item[input.dataset.field] = value;
  }
  return true;
}

function renderResults() {
  const budgetInput = document.getElementById("budget-input");
  const budget = Number(budgetInput.value);
  if (!Number.isSafeInteger(budget) || budget < 0 || budget > 1000000) {
    budgetInput.setCustomValidity("Enter a whole-number budget between 0 and 1,000,000.");
    budgetInput.reportValidity();
    return;
  }
  budgetInput.setCustomValidity("");
  if (!readInvestmentInputs()) return;

  const greedy = greedySelection(investments, budget);
  const dp = dynamicProgrammingSelection(investments, budget);
  const winner = dp.totalReturn >= greedy.totalReturn ? "Dynamic Programming" : "Greedy";
  const difference = Math.abs(dp.totalReturn - greedy.totalReturn);
  const deployed = dp.totalCost;
  const utilization = budget > 0 ? Math.round((deployed / budget) * 100) : 0;

  document.getElementById("metric-budget").textContent = formatCurrency(budget);
  document.getElementById("metric-return").textContent = formatCurrency(Math.max(dp.totalReturn, greedy.totalReturn));
  document.getElementById("metric-winner").textContent = `${winner} strategy leads`;
  document.getElementById("metric-deployed").textContent = formatCurrency(deployed);
  document.getElementById("metric-utilization").textContent = `${utilization}% of available budget`;
  document.getElementById("metric-assets").textContent = String(dp.selected.length);
  document.getElementById("analysis-status").textContent = `Analysis complete · ${investments.length} assets`;

  const chartMax = Math.max(greedy.totalReturn, dp.totalReturn, 1);
  document.getElementById("results").innerHTML = `
    <div class="strategy-grid">
      ${renderStrategy("Greedy algorithm", greedy, budget, "greedy-card")}
      ${renderStrategy("Dynamic programming", dp, budget, "dp-card")}
    </div>
    <article class="comparison-panel">
      <div class="comparison-title"><div><span class="strategy-label">RETURN COMPARISON</span><h3>Strategy performance</h3></div><span class="winner-label">Top return: ${winner}</span></div>
      <div class="comparison-row"><span>Greedy</span><div class="comparison-track"><span class="greedy-bar" style="width: ${(greedy.totalReturn / chartMax) * 100}%"></span></div><strong>${formatCurrency(greedy.totalReturn)}</strong></div>
      <div class="comparison-row"><span>Dynamic programming</span><div class="comparison-track"><span class="dp-bar" style="width: ${(dp.totalReturn / chartMax) * 100}%"></span></div><strong>${formatCurrency(dp.totalReturn)}</strong></div>
      <div class="comparison-delta"><span>Return difference</span><strong>${formatCurrency(difference)}</strong></div>
    </article>`;
}

function syncInvestmentInput(event) {
  const input = event.target;
  if (!input.matches("[data-investment]")) return;

  const item = investments.find((investment) => investment.name === input.dataset.investment);
  const value = Number(input.value);
  if (!item || !Number.isSafeInteger(value) || value < Number(input.min)) return;

  item[input.dataset.field] = value;
  const ratio = document.querySelector(`[data-ratio="${item.name}"]`);
  if (ratio) ratio.textContent = `${(item.expectedReturn / item.cost).toFixed(2)}x`;
}

function resetDashboard() {
  investments = defaultInvestments.map((item) => ({ ...item }));
  document.getElementById("budget-input").value = "100000";
  document.getElementById("investment-search").value = "";
  document.getElementById("investment-sort").value = "ratio";
  renderInvestmentCards();
  renderResults();
}

document.getElementById("calculate-btn").addEventListener("click", renderResults);
document.getElementById("reset-btn").addEventListener("click", resetDashboard);
document.getElementById("investment-list").addEventListener("input", syncInvestmentInput);
document.getElementById("investment-search").addEventListener("input", renderInvestmentCards);
document.getElementById("investment-sort").addEventListener("change", renderInvestmentCards);

renderInvestmentCards();
renderResults();
