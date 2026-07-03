// ClaimSense AI - Main Application Logic

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State
  const state = {
    claims: [...window.ClaimSenseData.claims],
    selectedClaim: window.ClaimSenseData.claims[0],
    activeTab: "dashboard",
    filters: {
      search: "",
      risk: "all",
      hospital: "all"
    },
    isSimulating: false,
    simTimer: null,
    logs: [
      "System initialized. Awaiting live claims data feed...",
      "Ensemble ML model loaded: XGBoost v1.4 + Isolation Forest.",
      "Explainability module active: SHAP engine configured for dynamic text conversion."
    ],
    charts: {}
  };

  // 2. DOM Elements
  const elements = {
    navItems: document.querySelectorAll(".nav-item"),
    panels: document.querySelectorAll(".view-panel"),
    claimsTableBody: document.getElementById("claims-table-body"),
    selectedClaimDetail: document.getElementById("selected-claim-detail"),
    
    // Metrics
    totalClaimsVal: document.getElementById("total-claims-val"),
    flaggedClaimsVal: document.getElementById("flagged-claims-val"),
    totalLeakageVal: document.getElementById("total-leakage-val"),
    avgRiskVal: document.getElementById("avg-risk-val"),
    
    // Filters
    searchInput: document.getElementById("search-input"),
    riskFilter: document.getElementById("risk-filter"),
    hospitalFilter: document.getElementById("hospital-filter"),
    
    // Simulator
    btnToggleSim: document.getElementById("btn-toggle-sim"),
    btnInjectClaim: document.getElementById("btn-inject-claim"),
    simConsole: document.getElementById("sim-console"),
    scannedClaimsList: document.getElementById("scanned-claims-list"),
    formPatientName: document.getElementById("sim-form-name"),
    formHospital: document.getElementById("sim-form-hospital"),
    formProcedure: document.getElementById("sim-form-procedure"),
    formAmount: document.getElementById("sim-form-amount"),
    
    // Actions
    btnApproveClaim: document.getElementById("btn-approve-claim"),
    btnAdjustClaim: document.getElementById("btn-adjust-claim")
  };

  // 3. Navigation and Tabs Router
  function initNavigation() {
    elements.navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = item.getAttribute("data-tab");
        switchTab(tab);
      });
    });
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    elements.navItems.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });
    elements.panels.forEach(panel => {
      panel.classList.toggle("active", panel.id === `${tabName}-panel`);
    });

    if (tabName === "analytics") {
      initCharts();
    }
  }

  // 4. Metric Calculations
  function updateMetrics() {
    const total = state.claims.length;
    const flagged = state.claims.filter(c => c.riskScore >= 70).length;
    
    // Calculate total leakage (accumulate variance on flagged/pending claims only)
    let totalLeakage = 0;
    state.claims.forEach(claim => {
      if (claim.riskScore >= 70) {
        claim.billingLines.forEach(line => {
          totalLeakage += line.variance;
        });
      }
    });

    // Calculate average risk score
    const avgRisk = total > 0 
      ? Math.round(state.claims.reduce((sum, c) => sum + c.riskScore, 0) / total) 
      : 0;

    // Update DOM
    if (elements.totalClaimsVal) elements.totalClaimsVal.textContent = total.toLocaleString();
    if (elements.flaggedClaimsVal) elements.flaggedClaimsVal.textContent = flagged.toLocaleString();
    if (elements.totalLeakageVal) elements.totalLeakageVal.textContent = `₹${totalLeakage.toLocaleString()}`;
    if (elements.avgRiskVal) {
      elements.avgRiskVal.textContent = `${avgRisk}%`;
      // Color coding average risk
      elements.avgRiskVal.style.color = avgRisk >= 70 ? 'var(--color-danger)' : (avgRisk >= 40 ? 'var(--color-warning)' : 'var(--color-success)');
    }
  }

  // 5. Populate Filters
  function populateHospitalFilter() {
    if (!elements.hospitalFilter) return;
    const hospitals = [...new Set(state.claims.map(c => c.hospital))];
    
    // Keep the "All Providers" option and append others
    elements.hospitalFilter.innerHTML = '<option value="all">All Providers</option>';
    hospitals.forEach(hosp => {
      const option = document.createElement("option");
      option.value = hosp;
      option.textContent = hosp;
      elements.hospitalFilter.appendChild(option);
    });
  }

  // 6. Claims Table Renderer
  function renderClaimsTable() {
    if (!elements.claimsTableBody) return;
    
    const filteredClaims = state.claims.filter(claim => {
      const matchesSearch = 
        claim.id.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        claim.patient.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        claim.procedure.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        claim.hospital.toLowerCase().includes(state.filters.search.toLowerCase());
        
      const matchesRisk = 
        state.filters.risk === "all" ||
        (state.filters.risk === "high" && claim.riskScore >= 70) ||
        (state.filters.risk === "medium" && claim.riskScore >= 40 && claim.riskScore < 70) ||
        (state.filters.risk === "low" && claim.riskScore < 40);
        
      const matchesHospital = 
        state.filters.hospital === "all" ||
        claim.hospital === state.filters.hospital;
        
      return matchesSearch && matchesRisk && matchesHospital;
    });

    elements.claimsTableBody.innerHTML = "";

    if (filteredClaims.length === 0) {
      elements.claimsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem;">
            No claims matched the selected filters.
          </td>
        </tr>
      `;
      return;
    }

    filteredClaims.forEach(claim => {
      const tr = document.createElement("tr");
      if (state.selectedClaim && state.selectedClaim.id === claim.id) {
        tr.classList.add("selected");
      }

      const riskClass = claim.riskScore >= 70 ? "high" : (claim.riskScore >= 40 ? "medium" : "low");
      const riskLabel = claim.riskScore >= 70 ? "High" : (claim.riskScore >= 40 ? "Medium" : "Low");

      tr.innerHTML = `
        <td class="claim-id">${claim.id}</td>
        <td>${claim.date}</td>
        <td>
          <div class="patient-info">
            <span class="patient-name">${claim.patient}</span>
            <span class="patient-meta">${claim.gender}, ${claim.age} yrs</span>
          </div>
        </td>
        <td class="hospital-name" title="${claim.hospital}">${claim.hospital}</td>
        <td>${claim.procedure}</td>
        <td class="claim-amount">₹${claim.amount.toLocaleString()}</td>
        <td>
          <div class="risk-score-wrapper">
            <span class="risk-badge ${riskClass}">${riskLabel} (${claim.riskScore})</span>
          </div>
        </td>
      `;

      tr.addEventListener("click", () => {
        selectClaim(claim);
        // Highlight active row
        document.querySelectorAll("#claims-table-body tr").forEach(row => row.classList.remove("selected"));
        tr.classList.add("selected");
      });

      elements.claimsTableBody.appendChild(tr);
    });
  }

  // 7. Select & Render Claim Details (with SHAP bar charts)
  function selectClaim(claim) {
    state.selectedClaim = claim;
    renderSelectedClaimDetail();
  }

  function renderSelectedClaimDetail() {
    const panel = elements.selectedClaimDetail;
    if (!panel) return;

    if (!state.selectedClaim) {
      panel.innerHTML = `
        <div class="drawer-empty-state">
          <svg viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <p>Select a claim from the queue to view explainable risk score, clinical SHAP features, and billing analysis.</p>
        </div>
      `;
      return;
    }

    const claim = state.selectedClaim;
    const riskClass = claim.riskScore >= 70 ? "high" : (claim.riskScore >= 40 ? "medium" : "low");
    
    // Check if status is Approved
    const isApproved = claim.status === "Approved";
    
    // Compute total billing variance
    const totalVariance = claim.billingLines.reduce((sum, line) => sum + line.variance, 0);

    // Build SHAP Rows
    let shapHtml = "";
    Object.entries(claim.shapValues).forEach(([feature, val]) => {
      const isPos = val >= 0;
      const absVal = Math.abs(val);
      const directionClass = isPos ? "pos" : "neg";
      const sign = isPos ? "+" : "-";
      
      // Calculate width percentage (cap at 45% to leave room for visual display on both sides of center)
      const widthPct = Math.min(absVal * 1.2, 45); 

      // If positive, it starts at 50% and expands right. If negative, it expands left by shifting the left position.
      const barStyle = isPos 
        ? `left: 50%; width: ${widthPct}%;` 
        : `right: 50%; width: ${widthPct}%;`;

      shapHtml += `
        <div class="shap-row">
          <div class="shap-label-row">
            <span class="shap-name">${feature}</span>
            <span class="shap-val ${directionClass}">${sign}${absVal}</span>
          </div>
          <div class="shap-bar-track">
            <div class="shap-axis-line"></div>
            <div class="shap-bar-fill ${directionClass}" style="${barStyle}"></div>
          </div>
        </div>
      `;
    });

    // Build Billing Lines
    let billingHtml = "";
    claim.billingLines.forEach(line => {
      billingHtml += `
        <div class="billing-item">
          <div class="billing-item-name">${line.item}</div>
          <div class="billing-item-val">
            ₹${line.claimed.toLocaleString()} 
            ${line.variance > 0 ? `<span class="billing-item-val variance">(+₹${line.variance.toLocaleString()})</span>` : ""}
          </div>
        </div>
      `;
    });

    panel.innerHTML = `
      <div class="drawer-header">
        <div>
          <div class="drawer-title" style="color: var(--accent-cyan); font-weight:700;">${claim.id}</div>
          <div style="font-size:0.8rem; color: var(--text-muted); margin-top: 0.15rem;">
            ${claim.patient} (${claim.age}Y, ${claim.gender})
          </div>
        </div>
        <span class="risk-badge ${riskClass}">${claim.riskScore} Risk Score</span>
      </div>

      <div class="explanation-card ${riskClass}">
        <div class="explanation-title">Natural Language Explanation</div>
        <div class="explanation-body">${claim.explanation}</div>
      </div>

      <div>
        <div class="explanation-title" style="margin-bottom: 0.75rem;">SHAP Feature Attributions</div>
        <div class="shap-chart-container">
          ${shapHtml}
          <div class="shap-legend">
            <div class="legend-item">
              <span class="legend-color pos"></span>
              <span>Increases Risk Score</span>
            </div>
            <div class="legend-item">
              <span class="legend-color neg"></span>
              <span>Decreases Risk Score</span>
            </div>
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
        <div class="explanation-title" style="margin-bottom: 0.75rem;">Billing & Tariff Breakdown</div>
        <div class="billing-list">
          ${billingHtml}
          <div class="billing-item" style="border-top: 1px solid rgba(255,255,255,0.15); margin-top: 0.5rem; padding-top: 0.75rem; font-weight:700;">
            <div>Total Audit Variance</div>
            <div style="color: ${totalVariance > 0 ? 'var(--color-danger)' : 'var(--color-success)'}">
              ₹${totalVariance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; margin-top: auto; padding-top: 1rem;">
        <button id="btn-approve-claim" class="btn-primary" style="flex:1; background: rgba(16, 185, 129, 0.15); border: 1px solid var(--color-success); color: var(--color-success); box-shadow: none;" ${isApproved ? "disabled" : ""}>
          ${isApproved ? "Approved ✓" : "Approve Full Pay"}
        </button>
        <button id="btn-adjust-claim" class="btn-primary" style="flex:1; background: linear-gradient(135deg, var(--accent-purple), var(--color-danger));" ${isApproved || totalVariance === 0 ? "disabled" : ""}>
          Adjust ₹${totalVariance.toLocaleString()}
        </button>
      </div>
    `;

    // Bind actions
    document.getElementById("btn-approve-claim").addEventListener("click", () => {
      approveClaim(claim.id);
    });
    
    const adjustBtn = document.getElementById("btn-adjust-claim");
    if (adjustBtn) {
      adjustBtn.addEventListener("click", () => {
        adjustClaim(claim.id, totalVariance);
      });
    }
  }

  // Action Handlers
  function approveClaim(claimId) {
    const claim = state.claims.find(c => c.id === claimId);
    if (claim) {
      claim.status = "Approved";
      claim.riskScore = Math.max(5, Math.round(claim.riskScore / 5)); // Reduce score to demonstrate audit action
      // Set explanation to updated
      claim.explanation = "Claim audited and approved for full payout. Risk score updated.";
      // Set all billing variances to 0
      claim.billingLines.forEach(line => {
        line.variance = 0;
      });
      
      addLog(`[ACTION] Claim ${claimId} approved for full payment by Auditor.`, "info");
      
      updateMetrics();
      renderClaimsTable();
      renderSelectedClaimDetail();
      
      if (state.activeTab === "analytics") {
        initCharts();
      }
    }
  }

  function adjustClaim(claimId, adjustedAmount) {
    const claim = state.claims.find(c => c.id === claimId);
    if (claim) {
      claim.status = "Approved";
      claim.amount -= adjustedAmount; // deduct leakage
      claim.riskScore = 10; // resolved
      claim.explanation = `Audit Complete. Adjusted payout: saved ₹${adjustedAmount.toLocaleString()} by resolving billing leakage.`;
      
      // Zero out variance since it's resolved
      claim.billingLines.forEach(line => {
        if (line.variance > 0) {
          line.claimed = line.standard;
          line.variance = 0;
        }
      });
      
      addLog(`[ACTION] Claim ${claimId} auto-adjusted by Auditor. Recovered ₹${adjustedAmount.toLocaleString()} in billing leakage.`, "info");
      
      updateMetrics();
      renderClaimsTable();
      renderSelectedClaimDetail();
      
      if (state.activeTab === "analytics") {
        initCharts();
      }
    }
  }

  // 8. Filters Event Listeners
  if (elements.searchInput) {
    elements.searchInput.addEventListener("input", (e) => {
      state.filters.search = e.target.value;
      renderClaimsTable();
    });
  }

  if (elements.riskFilter) {
    elements.riskFilter.addEventListener("change", (e) => {
      state.filters.risk = e.target.value;
      renderClaimsTable();
    });
  }

  if (elements.hospitalFilter) {
    elements.hospitalFilter.addEventListener("change", (e) => {
      state.filters.hospital = e.target.value;
      renderClaimsTable();
    });
  }

  // 9. Simulator Console Logging
  function addLog(text, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    const line = `[${timestamp}] ${text}`;
    state.logs.push(line);
    
    // limit console memory to last 50 entries
    if (state.logs.length > 50) state.logs.shift();

    if (elements.simConsole) {
      const p = document.createElement("div");
      p.className = `console-line ${type}`;
      p.textContent = line;
      elements.simConsole.appendChild(p);
      elements.simConsole.scrollTop = elements.simConsole.scrollHeight;
    }
  }

  // Render initial console logs
  function renderInitialLogs() {
    if (!elements.simConsole) return;
    elements.simConsole.innerHTML = "";
    state.logs.forEach(log => {
      const p = document.createElement("div");
      // Basic type deduction for styling
      let type = "info";
      if (log.includes("[ACTION]")) type = "info";
      else if (log.includes("SCANNING")) type = "info";
      else if (log.includes("FLAGGED")) type = "warn";
      else if (log.includes("model loaded") || log.includes("active")) type = "info";
      
      p.className = `console-line ${type}`;
      p.textContent = log;
      elements.simConsole.appendChild(p);
    });
    elements.simConsole.scrollTop = elements.simConsole.scrollHeight;
  }

  // 10. Simulator Engine (Interactive Auto-scans)
  function toggleSimulation() {
    if (state.isSimulating) {
      // Stop
      clearInterval(state.simTimer);
      state.isSimulating = false;
      elements.btnToggleSim.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Start Claims Stream
      `;
      elements.btnToggleSim.style.background = "";
      addLog("Claims simulation stream paused.");
    } else {
      // Start
      state.isSimulating = true;
      elements.btnToggleSim.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Pause Claims Stream
      `;
      elements.btnToggleSim.style.background = "linear-gradient(135deg, var(--color-warning), var(--color-danger))";
      addLog("Claims simulation stream started. Listening to TPA core system API...");
      
      // Auto-simulate a claim every 8 seconds
      state.simTimer = setInterval(() => {
        simulateIncomingClaim();
      }, 8000);
      
      simulateIncomingClaim(); // run first one immediately
    }
  }

  function simulateIncomingClaim(customData = null) {
    const opts = window.ClaimSenseData.simOptions;
    
    // Choose random values or use custom
    const hospitalObj = customData?.hospital 
      ? opts.hospitals.find(h => h.name === customData.hospital) || opts.hospitals[0]
      : opts.hospitals[Math.floor(Math.random() * opts.hospitals.length)];
      
    const procObj = customData?.procedure
      ? opts.procedures.find(p => p.name === customData.procedure) || opts.procedures[0]
      : opts.procedures[Math.floor(Math.random() * opts.procedures.length)];
      
    const firstName = customData?.firstName || opts.firstNames[Math.floor(Math.random() * opts.firstNames.length)];
    const lastName = customData?.lastName || opts.lastNames[Math.floor(Math.random() * opts.lastNames.length)];
    const patientName = `${firstName} ${lastName}`;
    const age = customData?.age || Math.floor(Math.random() * 55) + 18;
    const gender = Math.random() > 0.5 ? "Male" : "Female";
    
    const baseAmt = Math.round((procObj.minAmt + Math.random() * (procObj.maxAmt - procObj.minAmt)) / 5000) * 5000;
    const claimedAmt = customData?.amount || baseAmt;
    
    // Determine risk and leakage details
    const isHighRisk = customData ? (customData.riskScore >= 70) : (Math.random() < procObj.riskChance);
    const riskScore = customData?.riskScore || (isHighRisk ? Math.floor(Math.random() * 25) + 71 : Math.floor(Math.random() * 45) + 10);
    
    let leakageType = "None";
    let explanation = "Claim aligns with typical provider billing packages. Low risk.";
    let shapValues = {
      "Provider Tariff Deviation": Math.floor(Math.random() * 5) - 8,
      "Consumables anomalies": Math.floor(Math.random() * 8) - 4,
      "Clinical Document Mismatch": Math.floor(Math.random() * 10) - 12,
      "Patient Historical Risk": -10,
      "Other factors": Math.floor(Math.random() * 15) + 30
    };
    
    let billingLines = [];
    
    if (riskScore >= 70) {
      leakageType = opts.leakageTypes[Math.floor(Math.random() * opts.leakageTypes.length)];
      
      if (leakageType === "Inflated Billing") {
        const excess = Math.round(claimedAmt * 0.35);
        explanation = `Billing analysis shows standard ward items and ICU accommodation are marked up by 1.5x of TPA tariff limit. High frequency of inflated billing at this provider.`;
        shapValues = {
          "Provider Tariff Deviation": 30,
          "Consumables anomalies": 22,
          "Provider Historical Claim Vol": 18,
          "Clinical Document Mismatch": 4,
          "Patient Historical Risk": -2,
          "Other factors": 17
        };
        billingLines = [
          { item: "Room Rent (3 Days)", claimed: Math.round(claimedAmt * 0.3), standard: Math.round(claimedAmt * 0.15), variance: excess },
          { item: "Procedure Package Charges", claimed: claimedAmt - Math.round(claimedAmt * 0.3), standard: claimedAmt - Math.round(claimedAmt * 0.3), variance: 0 }
        ];
      } else if (leakageType === "Upcoding") {
        const excess = Math.round(claimedAmt * 0.28);
        explanation = `The clinical diagnostic summary suggests routine procedure, but billing was coded under high-complexity package level. Clinical guidelines do not support complex upcoding.`;
        shapValues = {
          "Clinical Document Mismatch": 42,
          "Procedure Complexity Ratio": 18,
          "Provider Cost Index": 12,
          "Patient Age Factor": 5,
          "Prior Claim History": -5,
          "Other factors": 6
        };
        billingLines = [
          { item: "OT & Surgeon Premium Fees", claimed: Math.round(claimedAmt * 0.45), standard: Math.round(claimedAmt * 0.45) - excess, variance: excess },
          { item: "Ward package charges", claimed: claimedAmt - Math.round(claimedAmt * 0.45), standard: claimedAmt - Math.round(claimedAmt * 0.45), variance: 0 }
        ];
      } else if (leakageType === "Unbundled Services") {
        const excess = Math.round(claimedAmt * 0.18);
        explanation = `Operating Room disposables and basic sterile drapes are billed as separate line items outside the standard package pricing framework. Suspected unbundled billing.`;
        shapValues = {
          "Unbundled Service Charges": 38,
          "Tariff Package Abuse": 24,
          "Provider Claim Density": 8,
          "Patient Age Factor": -2,
          "Other factors": riskScore - 68
        };
        billingLines = [
          { item: "Surgical Kit & Disposables", claimed: excess, standard: 0, variance: excess },
          { item: "Hospital Package Fee", claimed: claimedAmt - excess, standard: claimedAmt - excess, variance: 0 }
        ];
      } else if (leakageType === "Unjustified Stay") {
        const excess = Math.round(claimedAmt * 0.25);
        explanation = `Length of hospital stay (5 days) is twice the standard average for this condition. Review of laboratory metrics shows clinical stability was reached by day 2.`;
        shapValues = {
          "Length of Stay (LOS) Excess": 35,
          "Lab Test Congruence": 20,
          "Provider Cost Index": 10,
          "Patient Age Group Risk": 2,
          "Other factors": 10
        };
        billingLines = [
          { item: "Extra Stay Ward Charges (3 Days)", claimed: excess, standard: 0, variance: excess },
          { item: "Base Admission & Treatment", claimed: claimedAmt - excess, standard: claimedAmt - excess, variance: 0 }
        ];
      } else { // Duplicate Claim
        const excess = claimedAmt;
        explanation = `Potential duplicate billing found. The provider submitted an identical claim with matching diagnostic codes and identical consumable item counts within 10 days of a settled case.`;
        shapValues = {
          "Duplicate Serial Number Match": 48,
          "Time Interval Frequency": 22,
          "Provider Flagged History": 12,
          "Patient Profile Congruence": -5,
          "Other factors": 13
        };
        billingLines = [
          { item: "Full duplicate claim line items", claimed: claimedAmt, standard: 0, variance: excess }
        ];
      }
    } else {
      // Low risk billing lines
      billingLines = [
        { item: "Standard Room Rent", claimed: Math.round(claimedAmt * 0.25), standard: Math.round(claimedAmt * 0.25), variance: 0 },
        { item: "Procedure Package Fee", claimed: Math.round(claimedAmt * 0.65), standard: Math.round(claimedAmt * 0.65), variance: 0 },
        { item: "Consumables & Drugs", claimed: claimedAmt - Math.round(claimedAmt * 0.9), standard: claimedAmt - Math.round(claimedAmt * 0.9), variance: 0 }
      ];
    }

    const claimId = `CS-2026-0${Math.floor(Math.random() * 900) + 100}`;
    const newClaim = {
      id: claimId,
      date: new Date().toISOString().split("T")[0],
      patient: patientName,
      age: age,
      gender: gender,
      hospital: hospitalObj.name,
      city: hospitalObj.city,
      procedure: procObj.name,
      amount: claimedAmt,
      riskScore: riskScore,
      status: riskScore >= 70 ? "Flagged" : (riskScore >= 40 ? "Pending" : "Approved"),
      leakageType: leakageType,
      explanation: explanation,
      shapValues: shapValues,
      billingLines: billingLines
    };

    // Logging scan sequence
    addLog(`SCANNING incoming claim ${claimId} from ${newClaim.hospital}...`, "info");
    
    setTimeout(() => {
      // Append claim to local state
      state.claims.unshift(newClaim); // insert at top
      
      // Log risk classification
      if (newClaim.riskScore >= 70) {
        addLog(`[ALERT] Claim ${claimId} classified as HIGH RISK (${newClaim.riskScore}). Reason: ${newClaim.leakageType}`, "warn");
      } else {
        addLog(`Claim ${claimId} processed. Risk: LOW (${newClaim.riskScore}). Auto-routed to standard approval queue.`, "info");
      }

      // Add element to the Scanned list in Simulator UI
      addScannedClaimBubble(newClaim);
      
      // Update UI components dynamically
      updateMetrics();
      populateHospitalFilter();
      renderClaimsTable();
      
      // If none selected, default to this new one
      if (!state.selectedClaim || state.selectedClaim.riskScore < 70) {
        selectClaim(newClaim);
      }

      if (state.activeTab === "analytics") {
        initCharts();
      }
    }, 1500);
  }

  function addScannedClaimBubble(claim) {
    if (!elements.scannedClaimsList) return;
    const row = document.createElement("div");
    row.className = "scanned-claim-row";
    
    const riskClass = claim.riskScore >= 70 ? "high" : (claim.riskScore >= 40 ? "medium" : "low");
    
    row.innerHTML = `
      <div class="scanned-claim-info">
        <div class="scanned-score-bubble ${riskClass}">${claim.riskScore}</div>
        <div>
          <div style="font-weight:600; font-size:0.85rem;">${claim.id}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${claim.patient}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:600; font-size:0.85rem;">₹${claim.amount.toLocaleString()}</div>
        <div style="font-size:0.75rem; color: ${claim.riskScore >= 70 ? 'var(--color-danger)' : 'var(--text-muted)'};">${claim.leakageType}</div>
      </div>
    `;

    // Click to select
    row.addEventListener("click", () => {
      switchTab("claims");
      selectClaim(claim);
      renderClaimsTable();
    });

    elements.scannedClaimsList.insertBefore(row, elements.scannedClaimsList.firstChild);
    
    // limit UI display list length
    if (elements.scannedClaimsList.children.length > 8) {
      elements.scannedClaimsList.removeChild(elements.scannedClaimsList.lastChild);
    }
  }

  // 11. Custom Claims Injection Form
  if (elements.btnInjectClaim) {
    elements.btnInjectClaim.addEventListener("click", (e) => {
      e.preventDefault();
      
      const name = elements.formPatientName.value.trim();
      const amount = parseInt(elements.formAmount.value);
      
      if (!name || isNaN(amount) || amount <= 0) {
        alert("Please provide a valid Patient Name and Claimed Amount.");
        return;
      }
      
      const splitName = name.split(" ");
      const firstName = splitName[0];
      const lastName = splitName.slice(1).join(" ") || "Kumar";
      
      const customData = {
        firstName: firstName,
        lastName: lastName,
        hospital: elements.formHospital.value,
        procedure: elements.formProcedure.value,
        amount: amount,
        riskScore: Math.random() > 0.4 ? Math.floor(Math.random() * 25) + 71 : Math.floor(Math.random() * 35) + 10 // random skew
      };

      addLog(`[MANUAL INJECTION] Dispatching claim review request for ${name}...`, "info");
      simulateIncomingClaim(customData);
      
      // Reset form fields
      elements.formPatientName.value = "";
      elements.formAmount.value = "";
    });
  }

  if (elements.btnToggleSim) {
    elements.btnToggleSim.addEventListener("click", toggleSimulation);
  }

  // 12. Chart.js Configurations (Dynamic Insights)
  function initCharts() {
    const ctxLeakage = document.getElementById("leakage-types-chart");
    const ctxTrend = document.getElementById("risk-trend-chart");
    if (!ctxLeakage || !ctxTrend) return;

    // Calculate Leakage Type metrics
    const leakageCounts = {
      "Inflated Billing": 0,
      "Upcoding": 0,
      "Unbundled Services": 0,
      "Unjustified Stay": 0,
      "Duplicate Claim": 0
    };

    let totalFlaggedValue = 0;
    state.claims.forEach(c => {
      if (c.riskScore >= 70 && leakageCounts[c.leakageType] !== undefined) {
        leakageCounts[c.leakageType] += 1;
        totalFlaggedValue += c.amount;
      }
    });

    const categories = Object.keys(leakageCounts);
    const dataCounts = Object.values(leakageCounts);

    // Update Ratio Bars in HTML DOM
    categories.forEach(cat => {
      const slug = cat.toLowerCase().split(" ")[0];
      const barFill = document.querySelector(`.ratio-fill.${slug}`);
      const valLabel = document.getElementById(`ratio-val-${slug}`);
      if (barFill && valLabel) {
        const count = leakageCounts[cat];
        const pct = state.claims.filter(c => c.riskScore >= 70).length > 0
          ? Math.round((count / state.claims.filter(c => c.riskScore >= 70).length) * 100)
          : 0;
        barFill.style.width = `${pct}%`;
        valLabel.textContent = `${count} cases (${pct}%)`;
      }
    });

    // Destroy existing charts to reload fresh data
    if (state.charts.leakage) state.charts.leakage.destroy();
    if (state.charts.trend) state.charts.trend.destroy();

    // Chart 1: Pie/Doughnut for leakage types
    state.charts.leakage = new Chart(ctxLeakage, {
      type: "doughnut",
      data: {
        labels: categories,
        datasets: [{
          data: dataCounts,
          backgroundColor: [
            "#6366f1", // Indigo
            "#a855f7", // Purple
            "#06b6d4", // Cyan
            "#f59e0b", // Warning Yellow
            "#ef4444"  // Danger Red
          ],
          borderColor: "#0f172a",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#94a3b8",
              font: { family: "Outfit", size: 11 }
            }
          }
        }
      }
    });

    // Chart 2: Cumulative audit savings or Claim counts over time
    const chartLabels = [];
    const chartData = [];
    let rollingSum = 0;
    
    // Sort claims chronologically (reverse order since we insert new ones at start)
    const chronoClaims = [...state.claims].reverse();
    chronoClaims.forEach((c, idx) => {
      if (c.riskScore >= 70) {
        c.billingLines.forEach(line => {
          rollingSum += line.variance;
        });
      }
      // Sample 6 data points to prevent chart clutter
      if (idx % Math.ceil(chronoClaims.length / 6) === 0 || idx === chronoClaims.length - 1) {
        chartLabels.push(`Point ${chartLabels.length + 1}`);
        chartData.push(rollingSum);
      }
    });

    state.charts.trend = new Chart(ctxTrend, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [{
          label: "Prevented Audit Leakage (₹)",
          data: chartData,
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6, 182, 212, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { family: "Outfit" } }
          },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#94a3b8", font: { family: "Outfit" } }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  // 13. Application Initialization
  function init() {
    updateMetrics();
    populateHospitalFilter();
    renderClaimsTable();
    renderSelectedClaimDetail();
    renderInitialLogs();
    initNavigation();
  }

  init();
});
