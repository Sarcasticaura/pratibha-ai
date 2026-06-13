// Pratibha.ai - Biomechanical AI Engine & Marketplace App Router

document.addEventListener('DOMContentLoaded', () => {
  
  // --- MOCK ATHLETE DATA BASE ---
  const athletes = [
    {
      id: "a1",
      name: "Priyaraj Kulkarni",
      sport: "javelin",
      sportLabel: "Javelin Throw",
      location: "Pune, Maharashtra",
      score: 94,
      imageColor: "#FF4E50",
      stats: {
        "Release Angle": "36.2°",
        "Release Velocity": "28.4 m/s",
        "Proj. Distance": "78.42m",
        "Knee Flexion": "142°"
      },
      avatarChar: "P",
      sponsored: false,
      sponsorBrand: null,
      sponsorAmount: null,
      sponsoredClass: null
    },
    {
      id: "a2",
      name: "Aarav Sharma",
      sport: "longjump",
      sportLabel: "Long Jump",
      location: "Rohtak, Haryana",
      score: 91,
      imageColor: "#FC913A",
      stats: {
        "Take-off Angle": "22.4°",
        "Approach Velocity": "10.2 m/s",
        "Proj. Distance": "7.95m",
        "Air Time": "0.82s"
      },
      avatarChar: "A",
      sponsored: true,
      sponsorBrand: "Campus Shoes",
      sponsorAmount: 240000,
      sponsoredClass: "Gear Ambassador"
    },
    {
      id: "a3",
      name: "Kavita Das",
      sport: "javelin",
      sportLabel: "Javelin Throw",
      location: "Sambalpur, Odisha",
      score: 89,
      imageColor: "#F9D423",
      stats: {
        "Release Angle": "38.5°",
        "Release Velocity": "24.1 m/s",
        "Proj. Distance": "62.10m",
        "Knee Flexion": "138°"
      },
      avatarChar: "K",
      sponsored: false,
      sponsorBrand: null,
      sponsorAmount: null,
      sponsoredClass: null
    },
    {
      id: "a4",
      name: "Rohit Mishra",
      sport: "shotput",
      sportLabel: "Shot Put",
      location: "Meerut, Uttar Pradesh",
      score: 87,
      imageColor: "#EDE574",
      stats: {
        "Release Angle": "39.1°",
        "Release Velocity": "13.8 m/s",
        "Proj. Distance": "18.25m",
        "Torso Rotation": "112°"
      },
      avatarChar: "R",
      sponsored: true,
      sponsorBrand: "Frido Mobility",
      sponsorAmount: 180000,
      sponsoredClass: "Financial Backing"
    },
    {
      id: "a5",
      name: "Sunita Hembram",
      sport: "longjump",
      sportLabel: "Long Jump",
      location: "Ranchi, Jharkhand",
      score: 85,
      imageColor: "#E1F5FE",
      stats: {
        "Take-off Angle": "20.8°",
        "Approach Velocity": "9.6 m/s",
        "Proj. Distance": "6.45m",
        "Air Time": "0.74s"
      },
      avatarChar: "S",
      sponsored: false,
      sponsorBrand: null,
      sponsorAmount: null,
      sponsoredClass: null
    },
    {
      id: "a6",
      name: "Devendra Singh",
      sport: "shotput",
      sportLabel: "Shot Put",
      location: "Patiala, Punjab",
      score: 93,
      imageColor: "#E8F5E9",
      stats: {
        "Release Angle": "37.8°",
        "Release Velocity": "15.2 m/s",
        "Proj. Distance": "19.80m",
        "Torso Rotation": "124°"
      },
      avatarChar: "D",
      sponsored: true,
      sponsorBrand: "Yoho Footwear",
      sponsorAmount: 260000,
      sponsoredClass: "Full Ambassadorship"
    }
  ];

  // --- SPA ROUTER ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.app-section');

  function switchTab(tabId) {
    // Update active nav class
    navLinks.forEach(link => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update active section class with animation
    sections.forEach(section => {
      if (section.id === `section-${tabId}`) {
        section.classList.add('active');
        section.style.opacity = '1';
      } else {
        section.classList.remove('active');
        section.style.opacity = '0';
      }
    });

    // If switching to playground tab, init canvas
    if (tabId === 'playground') {
      initCanvas();
    }
    // If switching to chat tab, render chat
    if (tabId === 'chat') {
      renderChatSidebar();
      renderChatWindow();
    }
    // If switching to pitch tab, init pitch hub
    if (tabId === 'pitch') {
      initPitchHub();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      switchTab(tabId);
      window.location.hash = tabId;
    });
  });

  // logo link routing
  document.getElementById('logo-link').addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('home');
    window.location.hash = 'home';
  });

  // Action buttons routing
  document.getElementById('btn-demo-header').addEventListener('click', () => switchTab('playground'));
  document.getElementById('hero-btn-playground').addEventListener('click', () => switchTab('playground'));
  document.getElementById('hero-btn-marketplace').addEventListener('click', () => switchTab('marketplace'));

  // Init route from hash
  const hash = window.location.hash.substring(1);
  if (hash && ['home', 'playground', 'marketplace', 'chat', 'pitch', 'dashboard'].includes(hash)) {
    switchTab(hash);
  } else {
    switchTab('home');
  }

  // --- RENDERING MARKETPLACE ---
  const searchInput = document.getElementById('marketplace-search');
  const filterChips = document.querySelectorAll('.filter-chip');
  const cardsContainer = document.getElementById('athlete-cards-container');
  let currentFilter = 'all';

  function renderMarketplace() {
    cardsContainer.innerHTML = '';
    const query = searchInput.value.toLowerCase();

    const filteredAthletes = athletes.filter(ath => {
      const matchesSearch = ath.name.toLowerCase().includes(query) || ath.location.toLowerCase().includes(query);
      const matchesFilter = currentFilter === 'all' || ath.sport === currentFilter;
      return matchesSearch && matchesFilter;
    });

    if (filteredAthletes.length === 0) {
      cardsContainer.innerHTML = `
        <div class="glass-panel" style="grid-column: 1/-1; text-align: center; padding: 4rem;">
          <p style="color: var(--text-muted);">No athletes found matching the filters.</p>
        </div>
      `;
      return;
    }

    filteredAthletes.forEach(ath => {
      const card = document.createElement('div');
      card.className = `glass-panel athlete-card ${ath.sponsored ? 'sponsored' : ''}`;
      
      // Render stats elements
      let statsHtml = '';
      for (const [key, val] of Object.entries(ath.stats)) {
        statsHtml += `
          <div class="a-stat-col">
            <span class="stat-lbl">${key}</span>
            <span class="stat-val">${val}</span>
          </div>
        `;
      }

      // Sponsor status badge
      const sponsorBadgeHtml = ath.sponsored 
        ? `<span class="a-badge" style="border-color: var(--accent-violet); color: var(--accent-violet);">Sponsor: ${ath.sponsorBrand}</span>`
        : `<span class="a-badge" style="color: var(--text-muted); border-color: var(--text-muted);">Available</span>`;

      // Sponsor action button
      const sponsorBtn = ath.sponsored
        ? `<button class="btn btn-secondary" disabled style="opacity: 0.6;">Sponsored</button>`
        : `<button class="btn btn-premium btn-sponsor-action" data-id="${ath.id}">Sponsor</button>`;

      card.innerHTML = `
        <div class="athlete-img-container">
          <div class="athlete-img-mock" style="background: linear-gradient(135deg, ${ath.imageColor}22 0%, ${ath.imageColor}88 100%); display: flex; align-items: center; justify-content: center; font-size: 4rem; font-weight: 800; font-family: var(--font-display); color: white;">
            ${ath.avatarChar}
          </div>
          <div class="athlete-metric-overlay">
            <span class="a-badge verified">✓ Verified</span>
            <span class="a-badge score">${ath.score} Score</span>
          </div>
        </div>
        <div class="athlete-card-info">
          <h3>${ath.name} <span class="sport-tag">${ath.sportLabel}</span></h3>
          <p class="location">📍 ${ath.location}</p>
          <div class="athlete-stats-summary">
            ${statsHtml}
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary btn-analyze-direct" data-preset="${ath.sport}">Analyze Flow</button>
            <button class="btn btn-secondary btn-chat-action" data-id="${ath.id}">Chat</button>
            ${sponsorBtn}
          </div>
        </div>
      `;
      cardsContainer.appendChild(card);
    });

    // Bind dynamic event listeners
    document.querySelectorAll('.btn-sponsor-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        openSponsorshipModal(id);
      });
    });

    document.querySelectorAll('.btn-analyze-direct').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sportPreset = e.target.getAttribute('data-preset');
        switchTab('playground');
        // Set selected preset button active
        document.querySelectorAll('.preset-btn').forEach(pb => {
          if (pb.getAttribute('data-preset') === sportPreset) {
            pb.classList.add('active');
          } else {
            pb.classList.remove('active');
          }
        });
        currentPreset = sportPreset;
        initCanvas();
        startSimulation();
      });
    });

    document.querySelectorAll('.btn-chat-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        activeChatAthleteId = id;
        switchTab('chat');
        window.location.hash = 'chat';
      });
    });
  }

  // Listeners for filters
  searchInput.addEventListener('input', renderMarketplace);
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      renderMarketplace();
    });
  });

  renderMarketplace();

  // --- BRAND PORTAL DASHBOARD MANAGER ---
  const activeContractsVal = document.getElementById('dash-active-contracts');
  const fundedAmountVal = document.getElementById('dash-funded-amount');
  const dashboardRoster = document.getElementById('dashboard-roster');
  const dashboardFeed = document.getElementById('dashboard-feed');

  function renderBrandDashboard() {
    const sponsored = athletes.filter(a => a.sponsored);
    activeContractsVal.innerText = sponsored.length;

    let totalFunds = 0;
    dashboardRoster.innerHTML = '';

    sponsored.forEach(ath => {
      totalFunds += ath.sponsorAmount;
      const rRow = document.createElement('div');
      rRow.className = 'contract-card';
      rRow.innerHTML = `
        <div class="contract-profile">
          <div class="contract-avatar" style="background: linear-gradient(135deg, ${ath.imageColor}33 0%, ${ath.imageColor}cc 100%); display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-display); color: white;">
            ${ath.avatarChar}
          </div>
          <div class="contract-name">
            <h4>${ath.name}</h4>
            <p>📍 ${ath.location} • Verified score: <strong>${ath.score}</strong></p>
          </div>
        </div>
        <div class="contract-deal">
          <div class="amount">₹${ath.sponsorAmount.toLocaleString('en-IN')}</div>
          <div class="badge">${ath.sponsoredClass} (${ath.sponsorBrand})</div>
        </div>
      `;
      dashboardRoster.appendChild(rRow);
    });

    fundedAmountVal.innerText = `₹${totalFunds.toLocaleString('en-IN')}`;
  }

  function addFeedItem(desc, time = 'Just now', type = 'athlete') {
    const item = document.createElement('div');
    item.className = `feed-item ${type === 'brand' ? 'brand' : ''}`;
    item.innerHTML = `
      <div class="feed-time">${time}</div>
      <div class="feed-desc">${desc}</div>
    `;
    dashboardFeed.insertBefore(item, dashboardFeed.firstChild);
  }

  renderBrandDashboard();

  // --- MODAL SPONSORSHIP FLOW ---
  const modal = document.getElementById('sponsorship-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const sponsorForm = document.getElementById('sponsorship-form');
  const sponsorBrandSelect = document.getElementById('sponsor-brand');
  const customBrandGroup = document.getElementById('custom-brand-group');

  function openSponsorshipModal(athleteId) {
    const ath = athletes.find(a => a.id === athleteId);
    if (!ath) return;

    document.getElementById('modal-athlete-id').value = athleteId;
    document.getElementById('modal-athlete-name').innerText = ath.name;
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
    sponsorForm.reset();
    customBrandGroup.style.style = 'none';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  sponsorBrandSelect.addEventListener('change', (e) => {
    if (e.target.value === 'Custom Sponsor') {
      customBrandGroup.style.display = 'block';
    } else {
      customBrandGroup.style.display = 'none';
    }
  });

  sponsorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const athleteId = document.getElementById('modal-athlete-id').value;
    let brandName = sponsorBrandSelect.value;
    if (brandName === 'Custom Sponsor') {
      brandName = document.getElementById('custom-brand-name').value || 'Anonymous Sponsor';
    }

    const type = document.getElementById('sponsor-type').value;
    const amount = parseInt(document.getElementById('sponsor-amount').value) || 150000;
    
    // Find and update athlete
    const ath = athletes.find(a => a.id === athleteId);
    if (ath) {
      ath.sponsored = true;
      ath.sponsorBrand = brandName;
      ath.sponsorAmount = amount;
      ath.sponsoredClass = type;

      // Update UI components
      renderMarketplace();
      renderBrandDashboard();
      
      // Feed Notification
      addFeedItem(`<span>${brandName}</span> locked active deal with <span>${ath.name} (${ath.sportLabel})</span> for <span>₹${amount.toLocaleString('en-IN')}</span>.`, 'Just now', 'brand');
      
      // Update stats counters
      const statSponsorsVal = document.getElementById('stat-sponsors');
      let currentFunded = parseInt(statSponsorsVal.innerText.replace(/[₹M+,]/g, '')) || 4.8;
      // Just visually increment for the landing page
      statSponsorsVal.innerText = `₹${(currentFunded + (amount / 1000000)).toFixed(1)}M+`;
    }

    closeModal();
    switchTab('dashboard');
  });


  // --- BIOMECHANICS AI CANVAS PLAYGROUND SIMULATOR ---
  const canvas = document.getElementById('analyzer-canvas');
  const ctx = canvas.getContext('2d');
  const runSimBtn = document.getElementById('btn-run-simulation');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const uploadMockBtn = document.getElementById('btn-upload-mock');
  const laser = document.getElementById('scanning-laser');
  const fpsLabel = document.getElementById('video-fps');
  const eventLabel = document.getElementById('video-event-label');
  const statusBadge = document.getElementById('video-status-badge');
  const canvasPlaceholder = document.getElementById('canvas-placeholder');
  
  // Stats outputs
  const mAngle = document.getElementById('metric-angle');
  const mVelocity = document.getElementById('metric-velocity');
  const mDistance = document.getElementById('metric-distance');
  const mKneeSpeed = document.getElementById('metric-kneespeed');
  const coachFeedbackTitle = document.getElementById('coach-feedback-title');
  const coachFeedbackText = document.getElementById('coach-feedback-text');
  const consoleLog = document.getElementById('cli-console');

  let currentPreset = 'javelin';
  let isSimulating = false;
  let animationId = null;
  let simFrame = 0;

  // Presets parameters configuration
  const presets = {
    javelin: {
      label: "Javelin Throw",
      fps: 60.0,
      score: "94/100",
      stats: { angle: "36.2°", velocity: "28.4 m/s", distance: "78.42m", kneespeed: "142°/s" },
      feedback: {
        title: "Release Optimization (Excellent)",
        text: "Knee blocking angle is solid (142° flex). Projecting hand coordinate indicates javelin release arc is high, but release vector could be optimized to 38.5° for +3 meters growth."
      },
      cliLogs: [
        "Initializing Javelin kinematic model...",
        "Identifying runway stride nodes... [7/7 matched]",
        "Tracking shoulder, elbow, javelin coordinates...",
        "Verifying knee blocking vector...",
        "CALCULATING RELEASE FORCE VECTOR: 36.2° release pitch.",
        "COMPUTING BALLISTIC FLIGHT SCATTER PREDICT..."
      ]
    },
    longjump: {
      label: "Long Jump",
      fps: 60.0,
      score: "91/100",
      stats: { angle: "22.4°", velocity: "10.2 m/s", distance: "7.95m", kneespeed: "172°/s" },
      feedback: {
        title: "Take-off Projection Feedback",
        text: "Solid runway sprint speed (10.2 m/s approach). Take-off takeoff board blocking is precise, but hips dropped 3.2cm right before projection. Push posture upwards."
      },
      cliLogs: [
        "Loading Long Jump speed diagnostics...",
        "Detecting takeoff board coordinates...",
        "Segmenting vertical torso vector...",
        "Locking center-of-mass trajectory...",
        "PROJECTION VECTOR CONFIRMED: 22.4° takeoff tilt.",
        "Generating landing hip displacement curve..."
      ]
    },
    shotput: {
      label: "Shot Put",
      fps: 60.0,
      score: "87/100",
      stats: { angle: "39.1°", velocity: "13.8 m/s", distance: "18.25m", kneespeed: "112°/s" },
      feedback: {
        title: "Rotational Torque Feedback",
        text: "Core torso rotation (112°) provides adequate launch leverage. Power transfer from trailing leg block is optimized, but elbow thrust vector dropped slightly late in release."
      },
      cliLogs: [
        "Calibrating rotational center axis...",
        "Measuring shoulder-to-hip alignment angles...",
        "Calculating release push vectors...",
        "Elbow height coordinates locked...",
        "TORQUE DISCHARGE ESTIMATED: 39.1° release inclination.",
        "Verifying flight drag calculations..."
      ]
    }
  };

  presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (isSimulating) return;
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPreset = btn.getAttribute('data-preset');
      initCanvas();
    });
  });

  uploadMockBtn.addEventListener('click', () => {
    addConsoleLine("System: Simulated custom file upload dialog triggered.", true);
    addConsoleLine("System: Mock MP4 video file received. Compiling custom joint mesh...", true);
    initCanvas();
    startSimulation();
  });

  runSimBtn.addEventListener('click', () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  });

  function initCanvas() {
    if (animationId) cancelAnimationFrame(animationId);
    simFrame = 0;
    isSimulating = false;
    runSimBtn.innerText = "⚡ Simulate AI Analysis";
    runSimBtn.className = "btn btn-primary";
    statusBadge.innerHTML = "<span>STANDBY</span>";
    statusBadge.className = "status-badge";
    laser.classList.remove('active');
    canvasPlaceholder.style.display = "block";
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reset stats labels
    mAngle.innerText = "--";
    mVelocity.innerText = "--";
    mDistance.innerText = "--";
    mKneeSpeed.innerText = "--";
    
    const data = presets[currentPreset];
    eventLabel.innerText = data.label;
    fpsLabel.innerText = data.fps.toFixed(1);
  }

  function addConsoleLine(text, isAccent = false) {
    const line = document.createElement('div');
    line.className = `console-line ${isAccent ? 'accent' : ''}`;
    line.innerText = `> ${text}`;
    consoleLog.appendChild(line);
    consoleLog.scrollTop = consoleLog.scrollHeight;
  }

  function startSimulation() {
    isSimulating = true;
    runSimBtn.innerText = "⏹ Stop Simulator";
    runSimBtn.className = "btn btn-secondary";
    statusBadge.innerHTML = "<span>SCANNING MOTION</span>";
    statusBadge.className = "status-badge scanning";
    laser.classList.add('active');
    canvasPlaceholder.style.display = "none";
    
    consoleLog.innerHTML = "";
    addConsoleLine(`Pratibha.ai Biometrics v2.4.1 initialized.`);
    addConsoleLine(`Target event preset: ${presets[currentPreset].label}`);
    
    playSimulationLoop();
  }

  function stopSimulation() {
    isSimulating = false;
    initCanvas();
  }

  function playSimulationLoop() {
    if (!isSimulating) return;

    // Draw frame on canvas
    drawSimFrame(simFrame);

    // Feed dynamic console log messages
    const logIdx = Math.floor(simFrame / 20);
    const customLogs = presets[currentPreset].cliLogs;
    if (simFrame % 20 === 0 && logIdx < customLogs.length) {
      addConsoleLine(customLogs[logIdx], true);
    }

    simFrame++;

    // Max frames is 120 (approx 2 seconds)
    if (simFrame < 130) {
      animationId = requestAnimationFrame(playSimulationLoop);
    } else {
      // Completed simulation
      isSimulating = false;
      runSimBtn.innerText = "⚡ Re-run Simulator";
      runSimBtn.className = "btn btn-primary";
      statusBadge.innerHTML = "<span>VERIFIED</span>";
      statusBadge.className = "status-badge";
      statusBadge.style.borderColor = "var(--accent-green)";
      statusBadge.style.color = "var(--accent-green)";
      laser.classList.remove('active');

      // Populate finalized biomechanics outputs
      const p = presets[currentPreset];
      mAngle.innerText = p.stats.angle;
      mVelocity.innerText = p.stats.velocity;
      mDistance.innerText = p.stats.distance;
      mKneeSpeed.innerText = p.stats.kneespeed;

      coachFeedbackTitle.innerText = p.feedback.title;
      coachFeedbackText.innerText = p.feedback.text;

      document.getElementById('diag-overall-score').innerText = p.score;
      addConsoleLine(`System calculation complete. verified analytics saved.`, true);
      addConsoleLine(`Telemetry broadcast ready.`, true);

      // Increment aggregate landing stats counter
      const statProcessedVal = document.getElementById('stat-processed');
      let currentVal = parseInt(statProcessedVal.innerText.replace(/[+,]/g, '')) || 14200;
      statProcessedVal.innerText = `${(currentVal + 1).toLocaleString()}+`;
    }
  }

  function drawSimFrame(frame) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    const gridSpacing = 30;
    for (let x = 0; x < canvas.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 2. Draw ground/sandbox line
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 350);
    ctx.lineTo(canvas.width, 350);
    ctx.stroke();

    // 3. Render sport animation logic
    if (currentPreset === 'javelin') {
      drawJavelinAnimation(frame);
    } else if (currentPreset === 'longjump') {
      drawLongJumpAnimation(frame);
    } else if (currentPreset === 'shotput') {
      drawShotPutAnimation(frame);
    }
  }

  // --- MATH HELPER: DRAW SKIPPABLE GLOWING VECTORS ---
  function drawNode(x, y, color = '#00F2FE') {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  }

  function drawSegment(x1, y1, x2, y2, color = 'rgba(0, 242, 254, 0.6)', width = 3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  // JAVELIN SIMULATION COORDINATES
  function drawJavelinAnimation(frame) {
    // Phase 1: Runway run (Frames 0 to 50)
    // Phase 2: Pullback & Throw (Frames 51 to 75)
    // Phase 3: Flight trajectory (Frames 76 to 130)

    let athleteX = 100 + (frame * 2.8);
    let athleteY = 300;
    
    // Cap athlete position once they throw
    if (frame > 70) {
      athleteX = 100 + (70 * 2.8);
    }

    // Let's compute bounce stride
    let bounce = Math.sin(frame * 0.4) * 8;
    if (frame > 65) bounce = 0; // stop bounce during plant/release

    const shoulderX = athleteX;
    const shoulderY = athleteY - 70 + bounce;
    const hipX = athleteX - 5;
    const hipY = athleteY - 30 + bounce;
    const headX = athleteX + 2;
    const headY = athleteY - 90 + bounce;
    
    // Knee stride angles
    const leftKneeX = hipX - 15 + Math.sin(frame * 0.4) * 20;
    const leftKneeY = hipY + 30;
    const rightKneeX = hipX + 15 - Math.sin(frame * 0.4) * 20;
    const rightKneeY = hipY + 30;

    const leftFootX = leftKneeX - 5;
    const leftFootY = 350;
    const rightFootX = rightKneeX + 5;
    const rightFootY = 350;

    // Arm positioning cocking javelin
    let elbowX = shoulderX - 25;
    let elbowY = shoulderY - 15;
    let handX = elbowX - 25;
    let handY = elbowY - 25;

    // Release phase
    if (frame > 55 && frame <= 70) {
      // Throw arm forward
      const progress = (frame - 55) / 15;
      elbowX = shoulderX + (15 * progress);
      elbowY = shoulderY - 25;
      handX = shoulderX + (40 * progress);
      handY = shoulderY - 50;
    } else if (frame > 70) {
      // Arm finished follow through
      elbowX = shoulderX + 15;
      elbowY = shoulderY - 10;
      handX = shoulderX + 35;
      handY = shoulderY;
    }

    // Draw Skeleton
    drawSegment(headX, headY, shoulderX, shoulderY);
    drawSegment(shoulderX, shoulderY, hipX, hipY);
    drawSegment(hipX, hipY, leftKneeX, leftKneeY);
    drawSegment(leftKneeX, leftKneeY, leftFootX, leftFootY);
    drawSegment(hipX, hipY, rightKneeX, rightKneeY);
    drawSegment(rightKneeX, rightKneeY, rightFootX, rightFootY);
    drawSegment(shoulderX, shoulderY, elbowX, elbowY);
    drawSegment(elbowX, elbowY, handX, handY);

    // Draw Joint Nodes
    drawNode(headX, headY, '#fff');
    drawNode(shoulderX, shoulderY);
    drawNode(hipX, hipY);
    drawNode(leftKneeX, leftKneeY, '#9B51E0');
    drawNode(rightKneeX, rightKneeY, '#9B51E0');
    drawNode(elbowX, elbowY);
    drawNode(handX, handY);

    // JAVELIN FLIGHT LOGIC
    let javStartX = handX;
    let javStartY = handY;
    let javEndX, javEndY;
    let releaseAngleRad = 36.2 * Math.PI / 180;

    if (frame <= 70) {
      // Javelin resting in hand
      javEndX = javStartX + Math.cos(releaseAngleRad) * 70;
      javEndY = javStartY - Math.sin(releaseAngleRad) * 70;
      // Tail of javelin
      const javTailX = javStartX - Math.cos(releaseAngleRad) * 30;
      const javTailY = javStartY + Math.sin(releaseAngleRad) * 30;
      drawSegment(javTailX, javTailY, javEndX, javEndY, '#FFD600', 4);
    } else {
      // Javelin launched! Parabolic trajectory
      const flightFrame = frame - 70;
      const t = flightFrame * 0.15;
      // Start of velocity calculations
      const launchX = 100 + (70 * 2.8) + 35;
      const launchY = 300 - 50;

      // x = x0 + v_x * t
      const vx = 28.4 * Math.cos(releaseAngleRad) * 15; // scalar scaling
      const vy = 28.4 * Math.sin(releaseAngleRad) * 15;
      const g = 9.8 * 8; // gravity scale
      
      const currentJavX = launchX + vx * t;
      const currentJavY = launchY - (vy * t - 0.5 * g * t * t);

      // Estimate heading tangent
      const dx = vx;
      const dy = -(vy - g * t);
      const angle = Math.atan2(dy, dx);

      javStartX = currentJavX;
      javStartY = currentJavY;
      javEndX = javStartX + Math.cos(angle) * 70;
      javEndY = javStartY + Math.sin(angle) * 70;

      // Draw flight trailing path
      ctx.beginPath();
      ctx.moveTo(launchX, launchY);
      ctx.quadraticCurveTo(launchX + 150, launchY - 180, javStartX, javStartY);
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw active flying javelin
      if (javStartY < 350) {
        drawSegment(javStartX, javStartY, javEndX, javEndY, '#FFD600', 4);
        drawNode(javEndX, javEndY, '#FFD600');
      } else {
        // Impact
        drawSegment(javStartX, 350 - 15, javStartX + 20, 350, '#FFD600', 4);
      }
    }

    // Overlay technical text indicators at release
    if (frame > 70) {
      ctx.strokeStyle = 'rgba(155, 81, 224, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(100 + (70 * 2.8), 250, 40, -releaseAngleRad, 0);
      ctx.stroke();
      
      ctx.fillStyle = '#9B51E0';
      ctx.font = '10px Space Grotesk';
      ctx.fillText("36.2° REL", 100 + (70 * 2.8) + 45, 245);
    }
  }

  // LONG JUMP SIMULATION COORDINATES
  function drawLongJumpAnimation(frame) {
    let athleteX = 80 + (frame * 3.5);
    let athleteY = 300;
    let jumping = false;
    let jumpFrame = 0;

    // Take-off board is at x = 320 (around frame 68)
    if (athleteX > 320) {
      jumping = true;
      athleteX = 320;
      jumpFrame = frame - 68;
    }

    let torsoY = athleteY - 70;
    let hipY = athleteY - 30;
    let leftKneeY = hipY + 30;
    let rightKneeY = hipY + 30;
    let leftFootY = 350;
    let rightFootY = 350;

    if (jumping && jumpFrame > 0) {
      // Parabolic jump arc
      const t = jumpFrame * 0.12;
      const vx = 10.2 * 10; 
      const vy = 10.2 * Math.sin(22.4 * Math.PI / 180) * 15;
      const g = 9.8 * 8;

      athleteX = 320 + vx * t;
      const verticalOffset = (vy * t - 0.5 * g * t * t);
      
      // Stop landing
      if (athleteY - verticalOffset < 345) {
        athleteY = athleteY - verticalOffset;
        torsoY = athleteY - 60;
        hipY = athleteY - 20;

        // tucking knees in air
        leftKneeY = hipY + 10;
        rightKneeY = hipY + 12;
        leftFootY = leftKneeY + 15;
        rightFootY = rightKneeY + 15;
      } else {
        // Landed in sand
        athleteX = 320 + vx * (jumpFrame * 0.12); // stop forward momentum slightly
        athleteY = 340;
        torsoY = athleteY - 40;
        hipY = athleteY - 15;
        leftKneeY = athleteY;
        rightKneeY = athleteY;
        leftFootY = 350;
        rightFootY = 350;

        // Draw sand splash impact
        ctx.fillStyle = '#FC913A';
        ctx.beginPath();
        ctx.arc(athleteX + 20, 350, 15, 0, Math.PI, true);
        ctx.fill();
      }
    }

    const bounce = jumping ? 0 : Math.sin(frame * 0.4) * 6;
    
    // Draw joints relative
    const shoulderX = athleteX;
    const shoulderY = torsoY + bounce;
    const hipX = athleteX - 5;
    const headX = athleteX + 2;
    const headY = torsoY - 20 + bounce;
    
    const leftKneeX = hipX - 15 + (jumping ? 20 : Math.sin(frame * 0.4) * 20);
    const rightKneeX = hipX + 15 - (jumping ? 25 : Math.sin(frame * 0.4) * 20);

    const leftFootX = leftKneeX - 5;
    const rightFootX = rightKneeX + 5;

    // Draw Skeleton limbs
    drawSegment(headX, headY, shoulderX, shoulderY);
    drawSegment(shoulderX, shoulderY, hipX, hipY + bounce);
    drawSegment(hipX, hipY + bounce, leftKneeX, leftKneeY);
    drawSegment(leftKneeX, leftKneeY, leftFootX, leftFootY);
    drawSegment(hipX, hipY + bounce, rightKneeX, rightKneeY);
    drawSegment(rightKneeX, rightKneeY, rightFootX, rightFootY);
    
    // Arms in motion
    const elbowX = shoulderX - (jumping ? 30 : 15);
    const elbowY = shoulderY - (jumping ? 20 : 10);
    drawSegment(shoulderX, shoulderY, elbowX, elbowY);

    // Nodes
    drawNode(headX, headY, '#fff');
    drawNode(shoulderX, shoulderY);
    drawNode(hipX, hipY + bounce);
    drawNode(leftKneeX, leftKneeY, '#9B51E0');
    drawNode(rightKneeX, rightKneeY, '#9B51E0');

    // Draw vector path overlay for the landing trajectory
    if (jumping) {
      ctx.beginPath();
      ctx.moveTo(320, 300);
      ctx.quadraticCurveTo(420, 160, athleteX, athleteY);
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // SHOT PUT SIMULATION COORDINATES
  function drawShotPutAnimation(frame) {
    // Rotational release center is at x=250
    const centerX = 220;
    const athleteY = 300;

    // Rotation phase (frame 0 to 60)
    // Release (frame 61 to 130)
    let angleOffset = (frame * 0.15);
    let isReleased = frame > 60;
    
    let athleteX = centerX;
    if (isReleased) {
      angleOffset = 60 * 0.15; // cap rotation
    }

    const cosAngle = Math.cos(angleOffset);
    const sinAngle = Math.sin(angleOffset);

    // Calculate torso twisting coordinates
    const headX = centerX + cosAngle * 4;
    const headY = athleteY - 90;
    const shoulderX = centerX + cosAngle * 12;
    const shoulderY = athleteY - 70;
    const hipX = centerX - cosAngle * 6;
    const hipY = athleteY - 30;

    // Draw stance
    const leftKneeX = hipX - 25;
    const leftKneeY = hipY + 30;
    const rightKneeX = hipX + 25;
    const rightKneeY = hipY + 30;
    
    drawSegment(headX, headY, shoulderX, shoulderY);
    drawSegment(shoulderX, shoulderY, hipX, hipY);
    drawSegment(hipX, hipY, leftKneeX, leftKneeY);
    drawSegment(leftKneeX, leftKneeY, leftKneeX - 5, 350);
    drawSegment(hipX, hipY, rightKneeX, rightKneeY);
    drawSegment(rightKneeX, rightKneeY, rightKneeX + 5, 350);

    // Hand holding shotput ball near neck
    let handX = shoulderX + cosAngle * 10;
    let handY = shoulderY - 12;

    if (isReleased) {
      // Extension push vector forward
      const progress = Math.min((frame - 60) / 10, 1);
      handX = shoulderX + 45 * progress;
      handY = shoulderY - 35 * progress;
    }
    
    drawSegment(shoulderX, shoulderY, handX, handY);

    drawNode(headX, headY, '#fff');
    drawNode(shoulderX, shoulderY);
    drawNode(hipX, hipY);
    drawNode(handX, handY);

    // SHOT PUT BALL TRACKING
    let shotX = handX;
    let shotY = handY;
    let releaseAngleRad = 39.1 * Math.PI / 180;

    if (!isReleased) {
      // Ball rests near neck node
      ctx.beginPath();
      ctx.arc(shotX, shotY - 6, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#6B7280';
      ctx.fill();
    } else {
      // Launch ball trajectory
      const flightFrame = frame - 60;
      const t = flightFrame * 0.18;
      
      const launchX = shoulderX + 45;
      const launchY = shoulderY - 35;

      const vx = 13.8 * Math.cos(releaseAngleRad) * 15;
      const vy = 13.8 * Math.sin(releaseAngleRad) * 15;
      const g = 9.8 * 8;

      shotX = launchX + vx * t;
      shotY = launchY - (vy * t - 0.5 * g * t * t);

      // Draw flight line
      ctx.beginPath();
      ctx.moveTo(launchX, launchY);
      ctx.quadraticCurveTo(launchX + 100, launchY - 140, shotX, shotY);
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (shotY < 350) {
        ctx.beginPath();
        ctx.arc(shotX, shotY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#C5A3FF';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#C5A3FF';
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Hit ground
        ctx.beginPath();
        ctx.arc(shotX, 350, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#6B7280';
        ctx.fill();
      }
    }
  }

  // --- CHAT THREAD DATABASE ---
  const chatThreads = {
    "a1": [
      { sender: "athlete", text: "Hello! I recently uploaded my javelin release practice session. I got a 36.2° release angle but I want to push my projected distance to 80m. Do you have any recommendations?", time: "2h ago" }
    ],
    "a2": [
      { sender: "athlete", text: "Hi team, I'm hoping to get some gear sponsorship. My approach speed is currently 10.2 m/s.", time: "1d ago" },
      { sender: "brand", text: "Hi Aarav, we saw your takeoff board block is perfect. We can supply shoes and kits. What size do you wear?", time: "18h ago" },
      { sender: "athlete", text: "That's amazing! I wear UK size 9. I'm focusing on lifting my hips pre-flight right now.", time: "16h ago" }
    ],
    "a3": [
      { sender: "athlete", text: "Hello, I am Kavita. I have been analyzing my javelin throw release velocity and need support to attend the state selections. Let me know if you would like to review my telemetry stats.", time: "3d ago" }
    ],
    "a4": [
      { sender: "athlete", text: "Hi, this is Rohit. My release angle is at 39.1° for Shot Put. Let me know if you would like me to share more session video links.", time: "1d ago" }
    ],
    "a5": [
      { sender: "athlete", text: "Hi there! I am Sunita. I'm training in Ranchi. My jump length reached 6.45m in our last verified test.", time: "4d ago" }
    ],
    "a6": [
      { sender: "athlete", text: "Greetings. I'm Devendra, Shot Put specialist. I saw your brand is active in promoting field athletics.", time: "2d ago" }
    ]
  };

  let activeChatAthleteId = null;

  const chatUsersList = document.getElementById('chat-users-list');
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatActiveAvatar = document.getElementById('chat-active-avatar');
  const chatActiveName = document.getElementById('chat-active-name');
  const chatActiveStatus = document.getElementById('chat-active-status');
  const chatSponsorBtn = document.getElementById('chat-sponsor-btn');
  const chatInputForm = document.getElementById('chat-input-form');
  const chatMessageInput = document.getElementById('chat-message-input');

  function renderChatSidebar() {
    chatUsersList.innerHTML = '';
    athletes.forEach(ath => {
      const thread = chatThreads[ath.id] || [];
      const lastMsg = thread.length > 0 ? thread[thread.length - 1].text : 'No messages yet';
      const lastMsgTime = thread.length > 0 ? thread[thread.length - 1].time : '';
      
      const item = document.createElement('div');
      item.className = `chat-user-item ${ath.id === activeChatAthleteId ? 'active' : ''}`;
      item.setAttribute('data-id', ath.id);
      
      item.innerHTML = `
        <div class="chat-user-avatar" style="background: linear-gradient(135deg, ${ath.imageColor}33 0%, ${ath.imageColor}cc 100%);">
          ${ath.avatarChar}
        </div>
        <div class="chat-user-details">
          <h4 style="display: flex; justify-content: space-between; align-items: center; margin: 0;">
            <span style="font-weight: 600; color: white;">${ath.name}</span>
            <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: normal;">${lastMsgTime}</span>
          </h4>
          <p style="margin: 0; padding-top: 2px;">${lastMsg}</p>
        </div>
      `;
      
      item.addEventListener('click', () => {
        activeChatAthleteId = ath.id;
        renderChatSidebar();
        renderChatWindow();
      });
      
      chatUsersList.appendChild(item);
    });
  }

  function renderChatWindow() {
    if (!activeChatAthleteId) {
      chatMessagesContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); text-align: center;">
          <span style="font-size: 3rem; margin-bottom: 1rem;">💬</span>
          <p>Select a channel on the left to start direct communications.</p>
        </div>
      `;
      chatActiveName.innerText = "Select an Athlete";
      chatActiveStatus.innerText = "Offline";
      chatActiveAvatar.innerText = "-";
      chatActiveAvatar.style.background = "rgba(255,255,255,0.05)";
      chatSponsorBtn.style.display = 'none';
      chatInputForm.style.display = 'none';
      return;
    }

    const ath = athletes.find(a => a.id === activeChatAthleteId);
    if (!ath) return;

    chatActiveName.innerText = ath.name;
    chatActiveStatus.innerText = `Active now • ${ath.sportLabel}`;
    chatActiveAvatar.innerText = ath.avatarChar;
    chatActiveAvatar.style.background = `linear-gradient(135deg, ${ath.imageColor}33 0%, ${ath.imageColor}cc 100%)`;

    // Sponsor button visibility
    if (ath.sponsored) {
      chatSponsorBtn.style.display = 'none';
    } else {
      chatSponsorBtn.style.display = 'block';
      chatSponsorBtn.innerText = "Sponsor Athlete";
    }

    chatInputForm.style.display = 'flex';

    // Render messages
    chatMessagesContainer.innerHTML = '';
    const thread = chatThreads[ath.id] || [];
    
    if (thread.length === 0) {
      chatMessagesContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); margin-top: 2rem; font-size: 0.9rem;">
          No messages yet. Send a greeting to start chatting!
        </div>
      `;
    } else {
      thread.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `chat-message-bubble ${msg.sender === 'brand' ? 'sent' : 'received'}`;
        bubble.innerText = msg.text;
        chatMessagesContainer.appendChild(bubble);
      });
    }

    // Scroll to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeChatAthleteId) return;
    const text = chatMessageInput.value.trim();
    if (!text) return;

    const ath = athletes.find(a => a.id === activeChatAthleteId);
    if (!ath) return;

    // Add sent message
    chatThreads[ath.id].push({
      sender: "brand",
      text: text,
      time: "Just now"
    });

    chatMessageInput.value = '';
    renderChatSidebar();
    renderChatWindow();

    // Trigger simulated reply
    setTimeout(() => {
      let replyText = "Thanks for the feedback! I'm currently training hard to improve my release parameters.";
      
      if (ath.sport === 'javelin') {
        replyText = "Thank you! I will work on my blocking knee stance. That should help keep the launch angle closer to optimal. Uploading next video session soon!";
      } else if (ath.sport === 'longjump') {
        replyText = "Understood. My coach is helping me stabilize my hip drop right before projection. I appreciate the guidance!";
      } else if (ath.sport === 'shotput') {
        replyText = "Yes, I'm focusing on the rotational speed. The chest push vector is feeling much more solid now.";
      }

      chatThreads[ath.id].push({
        sender: "athlete",
        text: replyText,
        time: "Just now"
      });

      // If active tab is still chat and selected user is the same, re-render
      if (activeChatAthleteId === ath.id) {
        renderChatSidebar();
        renderChatWindow();
      } else {
        renderChatSidebar();
      }
    }, 1500);
  });

  chatSponsorBtn.addEventListener('click', () => {
    if (activeChatAthleteId) {
      openSponsorshipModal(activeChatAthleteId);
    }
  });

  // --- EXAMINATION PITCH HUB SCRIPTING ---
  const pitchNavBtns = document.querySelectorAll('.pitch-nav-btn');
  const pitchSubtabs = document.querySelectorAll('.pitch-subtab');
  
  // Slide Deck Data
  const slides = [
    {
      title: "PRATIBHA.AI",
      subtitle: "Democratizing Athletic Potential",
      content: `<p style="font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 1.5rem;">A Business Idea Pitch & Corporate Communication Strategy</p>
                <div style="border: 1px solid var(--border-color); padding: 1.2rem; border-radius: 8px; background: rgba(255,255,255,0.01); text-align: left; max-width: 460px; margin: 0 auto; font-size: 0.9rem; line-height: 1.5;">
                  <div style="margin-bottom: 0.4rem;">🎓 <strong>Submitted By:</strong> Marut Nandan</div>
                  <div style="margin-bottom: 0.4rem;">📚 <strong>Subject:</strong> Corporate Comm (Practical) - ETE</div>
                  <div style="margin-bottom: 0.4rem;">📈 <strong>Program:</strong> BBA Business Analytics, Sem IV</div>
                  <div>🏢 <strong>Institution:</strong> Galgotias University</div>
                </div>`
    },
    {
      title: "The Problem",
      subtitle: "The Grassroots Gap in Indian Sports",
      content: `<p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; max-width: 650px; text-align: left; margin: 0 auto;">
                  India has 1.4 billion people but returned with only 6 medals from the last Olympics. The core problem is a <strong>lack of objective performance metrics</strong> and <strong>funding access</strong> at the grassroots level. 
                  <br><br>
                  Brilliant university athletes in Tier-2/3 cities abandon sports because they lack basic training gear (shoes, weight belts), and high-end biomechanical labs are financially out of reach.
                </p>`
    },
    {
      title: "The Solution",
      subtitle: "AI Biometrics Meets Micro-Sponsorships",
      content: `<p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; max-width: 650px; text-align: left; margin: 0 auto;">
                  Pratibha.ai allows any athlete to record their practice session on a standard smartphone camera. 
                  <br><br>
                  Our cloud AI extracts pro-grade biomechanical data—like <strong>release angle, velocity, and posture nodes</strong>—and compiles a verified talent profile. D2C brands (Campus, Yoho, Frido) can filter metrics to sponsor rising talent directly.
                </p>`
    },
    {
      title: "Target Market & Segments",
      subtitle: "Grassroots Talent & B2B Sponsors",
      content: `<ul style="text-align: left; max-width: 580px; margin: 0 auto; line-height: 1.8; color: var(--text-secondary); font-size: 0.95rem;">
                  <li><strong>Primary:</strong> Grassroots and university track & field athletes (aged 14-25 years) in javelin, long jump, shot put, and indigenous sports.</li>
                  <li><strong>Secondary:</strong> Indian D2C footwear and mobility brands looking for hyper-local micro-influencers to build regional brand trust.</li>
                  <li><strong>B2B Targets:</strong> Corporate CSR departments and government sports ministries.</li>
                </ul>`
    },
    {
      title: "Value Proposition",
      subtitle: "Empowering Both Ends of the Ecosystem",
      content: `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align: left;">
                  <div style="border: 1px solid rgba(0, 242, 254, 0.15); padding: 1.2rem; border-radius: 8px; background: rgba(0,242,254,0.02);">
                    <strong style="color: var(--accent-cyan);">For Athletes:</strong>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.5;">Free, lab-grade performance feedback & direct corporate sponsorship pipeline to fund basic equipment and nutrition.</p>
                  </div>
                  <div style="border: 1px solid rgba(155, 81, 224, 0.15); padding: 1.2rem; border-radius: 8px; background: rgba(155,81,224,0.02);">
                    <strong style="color: var(--accent-violet);">For Brands:</strong>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.5;">Standardized, trusted performance analytics. High-ROI localized influencer reach. Streamlined execution for CSR and marketing budgets.</p>
                  </div>
                </div>`
    },
    {
      title: "Business Model",
      subtitle: "SaaS + Commission-Based Marketplace",
      content: `<ul style="text-align: left; max-width: 550px; margin: 0 auto; line-height: 1.8; color: var(--text-secondary); font-size: 0.95rem;">
                  <li><strong>15% Matching Commission:</strong> A standard platform fee charged on all micro-sponsorship and brand ambassadorship deals processed.</li>
                  <li><strong>Premium Analytics Subscriptions:</strong> ₹199/month for advanced, historical biomechanical breakdowns, charts, and verified badges.</li>
                  <li><strong>Data Licensing:</strong> Aggregated, anonymized regional talent indexes sold to state sports ministries and leagues.</li>
                </ul>`
    },
    {
      title: "Strategic Positioning",
      subtitle: "Grassroots Tech vs. Elite Legacy Giants",
      content: `<p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; max-width: 650px; text-align: left; margin: 0 auto;">
                  Unlike legacy giants like <strong>Hudl</strong> (which require heavy camera hardware setups for elite teams) or <strong>Strata</strong> (which require wearable sensors), Pratibha.ai is <strong>mobile-native and zero-setup</strong>.
                  <br><br>
                  We are the only platform combining smartphone biomechanics with built-in fintech sponsorship tools, optimized for low-bandwidth environments.
                </p>`
    },
    {
      title: "Marketing & Launch Strategy",
      subtitle: "The LinkedIn for Grassroots Champions",
      content: `<ul style="text-align: left; max-width: 550px; margin: 0 auto; line-height: 1.8; color: var(--text-secondary); font-size: 0.95rem;">
                  <li><strong>Instagram Launch:</strong> Post short-form video breakdowns comparing college athlete postures vs. Olympians.</li>
                  <li><strong>LinkedIn Campaign:</strong> Target corporate B2B marketing managers and CSR heads to pitch "Sponsor-an-Athlete" opportunities.</li>
                  <li><strong>WhatsApp Forums:</strong> Build communities of regional coaches and university sports departments.</li>
                </ul>`
    },
    {
      title: "Financial Projections",
      subtitle: "Capital Allocation & Revenue Growth",
      content: `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align: left;">
                  <div style="border: 1px solid var(--border-color); padding: 1.2rem; border-radius: 8px;">
                    <strong style="color: var(--accent-cyan);">Y1 Startup Capital (₹21L):</strong>
                    <ul style="font-size: 0.8rem; padding-left: 1rem; color: var(--text-secondary); margin-top: 0.4rem; line-height: 1.5;">
                      <li>AI & App R&D: ₹12 Lakhs</li>
                      <li>Cloud Server Infrastructure: ₹3 Lakhs</li>
                      <li>Marketing & Onboarding: ₹5 Lakhs</li>
                      <li>Compliance & Legal: ₹1 Lakh</li>
                    </ul>
                  </div>
                  <div style="border: 1px solid var(--border-color); padding: 1.2rem; border-radius: 8px;">
                    <strong style="color: var(--accent-violet);">Revenue Forecast:</strong>
                    <ul style="font-size: 0.8rem; padding-left: 1rem; color: var(--text-secondary); margin-top: 0.4rem; line-height: 1.5;">
                      <li>Year 1: ₹13 Lakhs</li>
                      <li>Year 2: ₹75 Lakhs</li>
                      <li>Year 3: ₹2.7 Crore</li>
                      <li>Break-even point: Month 18</li>
                    </ul>
                  </div>
                </div>`
    },
    {
      title: "Funding & Growth Strategy",
      subtitle: "From Bootstrapping to Angel Investment",
      content: `<p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; max-width: 650px; text-align: left; margin: 0 auto;">
                  Pratibha.ai will begin by <strong>bootstrapping ₹3 Lakhs</strong> for initial beta software assembly. Following this, we will apply for <strong>₹20 Lakhs</strong> under the <strong>Startup India Seed Fund Scheme (SISFS)</strong>.
                  <br><br>
                  Once user growth metrics and B2B brand pilot deals are validated in Year 1, we will seek a Seed Round from local Angel Networks.
                </p>`
    },
    {
      title: "Risk Analysis & Mitigation",
      subtitle: "Resolving Tech Adoption & Fraud",
      content: `<ul style="text-align: left; max-width: 580px; margin: 0 auto; line-height: 1.8; color: var(--text-secondary); font-size: 0.95rem;">
                  <li><strong>Traditional Resistance:</strong> Coaches skeptical of AI -> <em>Mitigation:</em> Offer automated vernacular coaching reports (Hindi, Bhojpuri, Marathi) and direct workshops.</li>
                  <li><strong>Sponsor/Upload Fraud:</strong> Users uploading fake/copied video -> <em>Mitigation:</em> AI deepfake detection models & campus student ID verification.</li>
                  <li><strong>Data Privacy:</strong> Athlete biometrics -> <em>Mitigation:</em> Strict compliance under the Indian DPDP Act.</li>
                </ul>`
    },
    {
      title: "Conclusion",
      subtitle: "India's Olympic Pipeline, Reimagined",
      content: `<p style="font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; max-width: 600px; font-weight: 500; font-family: var(--font-display); text-align: center; margin: 0 auto;">
                  "Pratibha.ai is a socially transformative venture. By merging business analytics with athletic technique, we ensure talent is objectively verified and financially supported, making athletic success in India dependent on raw grit and data—not finance. Let's build India's future champions together!"
                </p>`
    }
  ];

  let currentSlide = 0;

  // Viva Questions Data
  const vivaQAs = [
    { q: "What is the exact problem you are solving?", a: "The lack of objective biomechanical performance data and direct corporate sponsorship access for university and grassroots athletes in non-cricket sports." },
    { q: "Why not just use Instagram for athletic sponsorships?", a: "Instagram lacks verified, objective performance metrics. Brands cannot distinguish a real, high-potential athlete from a lifestyle influencer, leading to wasted marketing and CSR budgets." },
    { q: "How does the computer vision AI actually work?", a: "Our AI processes standard 2D smartphone footage, runs pose estimation models to map skeletal coordinates, and calculates joint angles, release velocity, torso rotation, and projection arcs." },
    { q: "Who is your primary customer?", a: "We operate a B2B2C model. The paying customers are D2C brands, CSR funds, and sports ministries (B2B). The primary users are underfunded grassroots athletes (B2C)." },
    { q: "Is this business idea scalable?", a: "Yes. Because it uses standard smartphone cameras rather than expensive wearable sensors or complex laboratory motion-capture systems, there is zero hardware overhead per user." },
    { q: "Why did you name the startup Pratibha.ai?", a: "'Pratibha' means talent or brilliant intellect in Hindi. The name perfectly represents our mission of discovering and verifying raw Indian talent using AI." },
    { q: "Can this technology be copied by competitors?", a: "While the basic AI models can be replicated, the verified athlete-sponsor network and exclusive tie-ups with university sports departments build a strong, sticky data moat." },
    { q: "What happens if a user uploads a fake or copied video?", a: "We run integrated deepfake screening filters and matching coordinate checks on the video metadata. Profile validation also requires a student/academy ID check." },
    { q: "How will you acquire your first 100 grassroots athletes?", a: "Through direct campus ambassadorship programs, partnerships with university athletic departments (like Galgotias), and presence at regional college sports fests." },
    { q: "How will you convince D2C brands to offer sponsorships?", a: "By showcasing higher localized engagement and authentic trust indices for micro-influencers (athletes) compared to expensive, broad-spectrum traditional advertising." },
    { q: "When do you project the business will break even?", a: "We project breaking even at Month 18 as the volume of brand sponsorship commissions and premium ₹199/month subscriptions scale." },
    { q: "Why did you select a 15% marketplace commission fee?", a: "A 15% commission is standard for influencer matchmaking platforms, ensuring we cover escrow and validation overhead while leaving 85% of the capital directly with the athlete." },
    { q: "How does Pratibha.ai handle personal data privacy?", a: "We maintain strict compliance with India's Digital Personal Data Protection (DPDP) Act. All athlete telemetry data is stored securely, and PII is never shared without explicit consent." },
    { q: "What happens if the startup co-founders have a dispute?", a: "We will establish a founders' agreement outlining a clear vesting schedule, equity clawbacks, and a structured mediation/arbitration framework for dispute resolution." },
    { q: "Why did you choose sports tech over saturated fields like EdTech or Food Delivery?", a: "EdTech and food delivery markets in India are heavily saturated with dominant players. Grassroots sports tech combined with athlete fintech is a blue ocean space with massive growth potential." }
  ];

  function initPitchHub() {
    // 1. Subtab selection logic
    pitchNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pitchNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const subtabId = btn.getAttribute('data-subtab');
        pitchSubtabs.forEach(tab => {
          if (tab.id === `subtab-${subtabId}`) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        });
      });
    });

    renderSlide();
    renderVivaList('');
  }

  // Render Slide Contents
  const slideNumLabel = document.getElementById('slide-num-label');
  const slideContentArea = document.getElementById('slide-content-area');
  const slideDotsContainer = document.getElementById('slide-dots-container');
  const prevSlideBtn = document.getElementById('btn-prev-slide');
  const nextSlideBtn = document.getElementById('btn-next-slide');

  function renderSlide() {
    if (!slideContentArea) return;
    
    const slide = slides[currentSlide];
    slideNumLabel.innerText = `Slide ${currentSlide + 1} of ${slides.length}`;
    
    slideContentArea.innerHTML = `
      <h2 style="font-family: var(--font-display); font-size: 2.2rem; color: white; margin-bottom: 0.5rem; text-shadow: 0 0 10px rgba(0, 242, 254, 0.2);">${slide.title}</h2>
      <h3 style="font-family: var(--font-main); font-size: 1.15rem; color: var(--accent-cyan); font-weight: 500; margin-bottom: 2rem;">${slide.subtitle}</h3>
      <div style="width: 100%;">${slide.content}</div>
    `;

    // Render Dots
    slideDotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `slide-dot ${idx === currentSlide ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentSlide = idx;
        renderSlide();
      });
      slideDotsContainer.appendChild(dot);
    });
  }

  prevSlideBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide--;
      renderSlide();
    }
  });

  nextSlideBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      renderSlide();
    }
  });

  // Render Viva Accordions
  const vivaListContainer = document.getElementById('viva-accordion-list');
  const vivaSearch = document.getElementById('viva-search-input');

  function renderVivaList(query) {
    if (!vivaListContainer) return;
    vivaListContainer.innerHTML = '';
    
    const lowercaseQuery = query.toLowerCase();
    const filteredQAs = vivaQAs.filter(item => 
      item.q.toLowerCase().includes(lowercaseQuery) || item.a.toLowerCase().includes(lowercaseQuery)
    );

    if (filteredQAs.length === 0) {
      vivaListContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem;">
          No matching Viva questions found.
        </div>
      `;
      return;
    }

    filteredQAs.forEach((item, index) => {
      const acc = document.createElement('div');
      acc.className = 'viva-item';
      acc.innerHTML = `
        <div class="viva-question">${index + 1}. ${item.q}</div>
        <div class="viva-answer">${item.a}</div>
      `;

      acc.querySelector('.viva-question').addEventListener('click', () => {
        const isActive = acc.classList.contains('active');
        document.querySelectorAll('.viva-item').forEach(i => i.classList.remove('active'));
        if (!isActive) {
          acc.classList.add('active');
        }
      });

      vivaListContainer.appendChild(acc);
    });
  }

  if (vivaSearch) {
    vivaSearch.addEventListener('input', (e) => {
      renderVivaList(e.target.value);
    });
  }

  // --- PREMIUM SUBSCRIPTION TRIGGERS ---
  const subscribePremiumBtn = document.getElementById('btn-subscribe-premium');
  const partnerBrandBtn = document.getElementById('btn-brand-info');
  const licensingInfoBtn = document.getElementById('btn-licensing-info');
  const openPitchHubDirectBtn = document.getElementById('btn-open-pitch-hub-direct');

  if (subscribePremiumBtn) {
    subscribePremiumBtn.addEventListener('click', () => {
      alert("💳 Pratibha.ai Premium Subscription Checkout Simulated!\n\nPlan: Athlete Biomechanics Breakdown\nPrice: ₹199 / month\n\nResult: Success! Subscription status is active on this device.");
    });
  }

  if (partnerBrandBtn) {
    partnerBrandBtn.addEventListener('click', () => {
      switchTab('marketplace');
      window.location.hash = 'marketplace';
      alert("Welcome Sponsor! Select any athlete card and click 'Sponsor' to pitch custom gear or stipend contracts.");
    });
  }

  if (licensingInfoBtn) {
    licensingInfoBtn.addEventListener('click', () => {
      alert("📧 Data Licensing Inquiries\n\nContact email generated: licensing@pratibha.ai\n\nOur team will contact you with custom B2B talent indices within 24 hours.");
    });
  }

  if (openPitchHubDirectBtn) {
    openPitchHubDirectBtn.addEventListener('click', () => {
      switchTab('pitch');
      window.location.hash = 'pitch';
    });
  }

  // Run Javelin preset by default on start
  initCanvas();

});
