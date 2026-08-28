/**
 * Hackverse Knowledge Base
 * Complete compiled intelligence for Learnathon 5.0, SIH 2026, 45 Problem Statements, and Strategy Playbooks.
 */
const HACKVERSE_KNOWLEDGE = {
  event_details: {
    learnathon_5: {
      name: "LEARNATHON 5.0",
      theme: "Unlocking the Future: Learn, Build, Innovate — Learn to Hack - Hack to Learn",
      focus: "Artificial Intelligence & Machine Learning",
      dates: "27th August to 30th August 2026",
      organizer: "GIET University, Gunupur-765022 in association with Incubatex Innovation Foundation",
      partners: [
        "Incubatex Innovation Foundation",
        "E-Yuva Center",
        "Quality Thought Future Skills Foundation",
        "Medicover Hospitals",
        "Blue Cloud Softech Solutions",
        "Co-Ignite",
        "ADP",
        "Elevate"
      ],
      coordinator: "Dr. Raghvendra Kumar (Dept. of Computer Science & Engineering, GIET University)",
      mentors: [
        "decode.ayush11@gmail.com",
        "dandpatayush05@gmail.com"
      ],
      venues: {
        workshop: "Mega Auditorium (Mega Audi) at 08:00 AM sharp (Mandatory)",
        development_and_evaluation: "Smart Classroom 1 and 2"
      },
      evaluation: {
        round_1: "50 Marks",
        round_2: "50 Marks",
        total: "100 Marks"
      },
      schedule_by_year: [
        { date: "27th August 2026", year: "2nd Year", teams: "78 Registered Teams" },
        { date: "28th August 2026", year: "3rd Year", teams: "58 Registered Teams" },
        { date: "29th August 2026", year: "1st Year", teams: "19 Registered Teams" },
        { date: "29th August 2026", year: "4th Year", teams: "4 Registered Teams" }
      ],
      whatsapp_groups: {
        year_1: "https://chat.whatsapp.com/J9ArqTgQwS4JUzicb7ZYJu",
        year_2: "https://chat.whatsapp.com/BdxxKswv65BJqqaxXMCK7u",
        year_3: "https://chat.whatsapp.com/HaHSBAGNefHD9hl5K4LnEV",
        year_4: "https://chat.whatsapp.com/GHyDTJO5DdzA7u21AL803Q"
      },
      student_mandatory_items: [
        "Fully charged laptop with power charger",
        "Electric extension board for the team",
        "Water bottle (stay hydrated)"
      ]
    },
    sih_2026: {
      name: "Smart India Hackathon 2026 (SIH 2026)",
      organizers: "Ministry of Education's Innovation Cell (MIC) & AICTE",
      patron: "Shri Narendra Modi (Hon'ble Prime Minister of India), Shri Pralhad Joshi (Hon'ble Minister of Education)",
      prize_money: "₹1,50,000 per problem statement",
      team_rules: {
        team_size: "Exactly 6 student members including Team Leader",
        gender_diversity: "At least 1 female team member is strictly mandatory",
        institution_rule: "All 6 members must belong to the same college (no inter-college teams)"
      },
      spoc_nominations: {
        per_institute: "Maximum 50 teams (45 shortlisted + 5 waitlisted)",
        per_university: "Maximum 100 teams",
        eligibility: "Senior faculty members (Lecturer, Assistant Professor, HOD, Dean, Principal)"
      },
      timeline: {
        spoc_registration: "July 2026",
        idea_submissions: "Starts August 2026",
        final_deadline: "20th September 2026",
        grand_finale: "December 2026 (Offline across national Nodal Centers)"
      },
      limits: {
        max_ps_per_team: "Maximum 2 Problem Statements per team",
        ps_freeze_cap: "500 idea submissions per PS (permanently freezes once reached)"
      },
      travel_and_stay: {
        reimbursement: "Up to ₹3,000 per person (round trip AC-III tier, subject to actuals and bills)",
        accommodation: "Arranged by Nodal Centers for official participants and mentors",
        entry_requirements: "College stamped photo ID and official College Authorization Letter (Annexure A)"
      },
      ip_policy: "50/50 split between winning team and problem-creating organization/ministry, enabling startup creation.",
      contact: {
        phone: "011 2958 1239 / 40 / 41 / 22 / 23 / 19",
        email: "sih@aicte-india.org, hackathon@aicte-india.org",
        portal: "https://sih.gov.in"
      }
    }
  },

  tracks_and_problem_statements: [
    {
      track_id: "AR_VR",
      track_name: "AR / VR & Spatial Computing",
      problems: [
        {
          id: 1,
          title: "AR/VR-Based Immersive Skill Training & Safety Simulator",
          challenge: "Develop an AI-powered AR/VR training platform for technical education, industrial training, and emergency scenarios tracking movement, attention, and safety violations.",
          datasets: "Ego4D, EPIC-KITCHENS, Human Activity Recognition (HAR), VR interaction logs.",
          models: "Vision Transformers (ViT), MediaPipe pose estimation, Reinforcement Learning for difficulty adaptation, LLM virtual instructor, Unity/Unreal Engine, OpenXR.",
          difficulty: "Advanced",
          skills: "Computer Vision, AR/VR, 3D Graphics, HCI, AI/ML"
        },
        {
          id: 2,
          title: "AI-Powered Virtual Reality Emergency Response Simulator",
          challenge: "Build an immersive VR simulator training responders for fires, industrial accidents, and disasters with dynamic hazard physics and personalized performance metrics.",
          datasets: "Disaster response datasets, Synthetic VR simulation data, Emergency mission logs.",
          models: "CV for activity recognition, Reinforcement Learning for dynamic hazard propagation, pose estimation, behavioral anomaly detection.",
          difficulty: "Advanced",
          skills: "VR Development, Simulation, Pose Estimation, RL"
        },
        {
          id: 3,
          title: "AR Navigation & Context-Aware Assistance for Smart Campuses",
          challenge: "Develop an augmented-reality navigation and assistance platform for campuses, hospitals, and airports with visual landmark recognition and congestion-aware routing.",
          datasets: "Indoor positioning datasets, OpenStreetMap (OSM), Campus building maps, Visual localization datasets.",
          models: "Visual SLAM, Vision Transformers, Graph-based route optimization (A*), LLM conversational navigation.",
          difficulty: "Advanced",
          skills: "AR Development, Visual SLAM, AI/ML, Geospatial Computing"
        }
      ]
    },
    {
      track_id: "FINTECH",
      track_name: "FinTech & Responsible Lending",
      problems: [
        {
          id: 4,
          title: "AI-Powered Financial Fraud Detection & Transaction Risk Intelligence",
          challenge: "Real-time financial transaction monitoring detecting anomalous transactions across digital banking, UPI, and cards using behavioral fingerprints and transaction graphs.",
          datasets: "IEEE-CIS Fraud Detection, PaySim, Elliptic Bitcoin, Synthetic UPI transaction data.",
          models: "XGBoost / LightGBM, Isolation Forest, Graph Neural Networks (GNNs), Autoencoders, SHAP explainers.",
          difficulty: "Advanced",
          skills: "Fraud Analytics, GNNs, Real-Time Streaming (Kafka), Explainable AI"
        },
        {
          id: 5,
          title: "AI-Based Credit Risk & Responsible Lending Assessment",
          challenge: "AI-driven credit assessment platform estimating borrower risk using alternative financial patterns while identifying algorithmic bias and providing SHAP explainability.",
          datasets: "German Credit, Home Credit Default Risk, Lending Club historical data.",
          models: "Monotonic XGBoost, Random Forest, SHAP/LIME, Fairness calibration metrics.",
          difficulty: "Advanced",
          skills: "Credit Risk Modeling, Responsible AI, Data Analytics"
        },
        {
          id: 6,
          title: "Real-Time Digital Payment Anomaly & Mule Account Detection",
          challenge: "Uncover suspicious digital payment networks and mule accounts by analyzing transaction velocity, cyclic transfers, and account-to-account graphs.",
          datasets: "PaySim, Elliptic Bitcoin, Synthetic UPI transaction networks.",
          models: "PyTorch Geometric GNNs, Graph clustering, Isolation Forest, Autoencoders, Cytoscape graph visualization.",
          difficulty: "Advanced",
          skills: "Graph Analytics, Cybersecurity, Money Velocity Analysis"
        }
      ]
    },
    {
      track_id: "QUANTUM",
      track_name: "Quantum Computing & Post-Quantum Security",
      problems: [
        {
          id: 7,
          title: "AI-Driven Quantum Error Detection & Circuit Optimization",
          challenge: "AI system identifying noise patterns and inefficient gate sequences in NISQ quantum circuits, reducing circuit depth while maintaining unitary accuracy.",
          datasets: "Qiskit benchmark circuits, OpenQASM datasets, IBM Quantum experiment data.",
          models: "Deep Reinforcement Learning (DQN/PPO), Graph Neural Networks for DAG gate optimization, Qiskit/Cirq noise simulation.",
          difficulty: "Advanced",
          skills: "Quantum Circuits, RL, Gate Depth Minimization, Linear Algebra"
        },
        {
          id: 8,
          title: "Quantum Machine Learning for Anomaly Detection",
          challenge: "Hybrid quantum-classical ML pipeline encoding classical features into quantum Hilbert space via angle/amplitude embedding for robust anomaly classification.",
          datasets: "Iris/Wine, KDD anomaly datasets, Credit card fraud, High-dimensional synthetic data.",
          models: "Variational Quantum Classifiers (VQC), Quantum Kernel Estimation, PennyLane.",
          difficulty: "Advanced",
          skills: "QML, Quantum Autoencoders, Hybrid Quantum-Classical Algorithms"
        },
        {
          id: 9,
          title: "Quantum Network Security & Post-Quantum Threat Simulation",
          challenge: "Simulate quantum attack resilience (Shor's, Grover's) on RSA/ECC and benchmark against lattice-based Post-Quantum Cryptography standards (Kyber, Dilithium).",
          datasets: "NIST cryptographic test vectors, Public-key benchmarks.",
          models: "Shor's/Grover's algorithm simulators, PQC lattice benchmark frameworks.",
          difficulty: "Advanced",
          skills: "Post-Quantum Cryptography (PQC), Algorithm Simulation, Cyber Security"
        }
      ]
    },
    {
      track_id: "MLOPS",
      track_name: "MLOps, LLMOps & AIOps Infrastructure",
      problems: [
        {
          id: 10,
          title: "Autonomous ML Drift Detection & Self-Healing Pipeline",
          challenge: "Continuously monitor deployed models for data/concept drift and trigger automated data validation, retraining, and Kubernetes model rollbacks.",
          datasets: "UCI datasets with simulated drift, Kaggle production data, NYC Taxi dataset.",
          models: "Evidently AI, MLflow, DVC, Prometheus + Grafana, Kolmogorov-Smirnov drift metrics.",
          difficulty: "Advanced",
          skills: "MLOps, CI/CD, Model Monitoring, Docker, Kubernetes"
        },
        {
          id: 11,
          title: "Automated ML CI/CD Pipeline with Model Validation & Governance",
          challenge: "Automated pipeline enforcing model testing, bias benchmarks, artifact versioning, containerization, and Istio canary deployments.",
          datasets: "OpenML datasets, Synthetic validation streams.",
          models: "MLflow, DVC, GitHub Actions, Docker, Kubernetes, Great Expectations.",
          difficulty: "Advanced",
          skills: "MLOps, DevOps, CI/CD, Model Governance"
        },
        {
          id: 12,
          title: "LLMOps: Production Monitoring & Safety Platform for Generative AI",
          challenge: "Centralized proxy monitoring token costs, latency, hallucination indicators, and prompt injection attacks with OpenTelemetry logging.",
          datasets: "Instruction datasets, Prompt-injection datasets, Synthetic conversational traces.",
          models: "LiteLLM reverse proxy, LLM-as-a-judge evaluation, Prompt-injection classifiers.",
          difficulty: "Advanced",
          skills: "LLMOps, GenAI, NLP, Observability, AI Security"
        },
        {
          id: 13,
          title: "Self-Healing Infrastructure (AIOps Incident Resolution)",
          challenge: "Detect microservice degradation from log streams and automatically execute validated remediation scripts without human intervention.",
          datasets: "ELK stack logs, Prometheus metrics, Kubernetes container events.",
          models: "Transformer log parsers (Drain), XGBoost root-cause prediction, LLM runbook engine.",
          difficulty: "Advanced",
          skills: "AIOps, Incident Response, Observability, IaC"
        },
        {
          id: 14,
          title: "Intelligent Synthetic Test Data Generation with Privacy Preservation",
          challenge: "Generate realistic production-scale test data matching relational foreign-key distributions while ensuring differential privacy.",
          datasets: "TPC-DS, TPC-H benchmarks, Real production schemas.",
          models: "Conditional Tabular GAN (CTGAN), Tabular Diffusion models, Differential privacy.",
          difficulty: "Intermediate-Advanced",
          skills: "Data Engineering, Privacy-Preserving ML, SQL"
        },
        {
          id: 15,
          title: "Autonomous Cloud Cost Optimization with Resource Allocation",
          challenge: "Monitor cloud spending across VMs and serverless functions, predicting workload spikes and dynamically mixing spot instances.",
          datasets: "AWS/Azure/GCP billing datasets, APM telemetry.",
          models: "Prophet / LSTM time-series forecasting, Reinforcement Learning, Linear programming.",
          difficulty: "Intermediate-Advanced",
          skills: "Cloud Cost Optimization, Time Series Analysis, AWS/GCP"
        }
      ]
    },
    {
      track_id: "BLOCKCHAIN",
      track_name: "Blockchain & Real-World Assets",
      problems: [
        {
          id: 16,
          title: "Prove It, Don't Expose It: Self-Sovereign Identity & Verifiable Credentials",
          challenge: "Design the Trust Layer authoring new verifiable credential schemas and issuance-to-verification journeys without exposing private user PII.",
          datasets: "W3C Credential Schemas, DID registries.",
          models: "ERC-5192 Soulbound Tokens, IPFS metadata, Zero-Knowledge proofs.",
          difficulty: "Advanced",
          skills: "SSI, W3C Verifiable Credentials, Smart Contracts"
        },
        {
          id: 17,
          title: "Decentralized Marketplace with AI Matching & Risk Assessment",
          challenge: "Intelligent marketplace combining blockchain ownership and smart contracts with AI recommendation, dynamic pricing, and credit evaluation.",
          datasets: "E-commerce transaction graphs, On-chain trade data.",
          models: "Solidity smart contracts, GNN matching algorithms, Transformer pricing models.",
          difficulty: "Advanced",
          skills: "Smart Contracts, Web3 UX, AI Recommender Systems"
        },
        {
          id: 18,
          title: "Decentralized Fact-Checking Network with GenAI Consensus",
          challenge: "Domain-specialized AI models evaluating claims with citation retrieval and reaching Byzantine-fault-tolerant consensus on-chain.",
          datasets: "Snopes, FEVER, ClaimBuster, Wikipedia with citations.",
          models: "BERT claim encoding, T5 evidence retrieval, Multi-agent staking protocol.",
          difficulty: "Advanced",
          skills: "NLP, Blockchain Consensus, Multi-Agent Systems, Fact Verification"
        },
        {
          id: 19,
          title: "Autonomous DAO Treasury Management Using Predictive AI",
          challenge: "Autonomous rebalancing of DAO liquidity pools and treasury token weights on DEXs using volatility models to prevent crash exposure.",
          datasets: "Uniswap trading data, DeFi protocol analytics, Token price history.",
          models: "Transformers for price prediction, PPO Reinforcement Learning for portfolio allocation, GNN market structure analysis.",
          difficulty: "Advanced",
          skills: "DeFi Protocols, RL, Time Series, Smart Contracts"
        },
        {
          id: 20,
          title: "Decentralized Identity Verification Using Biometric Zero-Knowledge Proofs",
          challenge: "Prove unique identity authentication on-chain without revealing underlying facial or fingerprint biometric embeddings.",
          datasets: "NIST FRVT benchmarks, Biometric verification datasets.",
          models: "ArcFace/CosFace local embeddings, Circom / ZoKrates zk-SNARK circuits.",
          difficulty: "Advanced",
          skills: "Zero-Knowledge Proofs (ZKP), Biometrics, Cryptography, Solidity"
        }
      ]
    },
    {
      track_id: "IOT_ROBOTICS",
      track_name: "IoT, Robotics & Autonomous Systems",
      problems: [
        {
          id: 21,
          title: "AI-Powered Precision Beekeeping & Hive Health Monitoring",
          challenge: "Predict Colony Collapse Disorder (CCD) and Varroa mite stress using embedded audio sensors and telemetry inside beehives.",
          datasets: "BMON Beehive Dataset, Acoustic Bee Monitoring Project.",
          models: "1D CNNs for audio spectrogram classification, LSTM time-series anomaly models, BirdCLIP transfer learning.",
          difficulty: "Advanced",
          skills: "Audio DSP, Time Series Anomaly Detection, Agricultural IoT"
        },
        {
          id: 22,
          title: "DeepOcean: Real-Time Microplastic Detection in Water Systems",
          challenge: "Edge AI system combining multi-wavelength optical spectroscopy with vision transformers to classify microplastics (<5mm) in waterways.",
          datasets: "Tox21 Chemical dataset, Marine Plastic database, NOAA Water Quality data.",
          models: "Vision Transformers for spectral analysis, Lightweight CNNs, PointNet 3D point clouds.",
          difficulty: "Advanced",
          skills: "Spectroscopy, Edge Computing, Computer Vision, Environmental IoT"
        },
        {
          id: 23,
          title: "GhostWifi: Detecting IoT Botnets via Electromagnetic Signatures",
          challenge: "Passively detect malware-compromised IoT botnet devices by analyzing side-channel electromagnetic emissions and RF patterns.",
          datasets: "Kaggle IoT Botnet Dataset, CICIDS2018, Custom EM radiation captures.",
          models: "Graph Neural Networks, 1D CNN for EM signature classification, One-Class SVM.",
          difficulty: "Advanced",
          skills: "Signal Processing, Network Security, Hardware EM Analysis"
        },
        {
          id: 24,
          title: "Wildlife Poaching Prevention — AI-Powered Autonomous Rangers",
          challenge: "Autonomous drone/rover patrolling reserves in harsh terrain, detecting illegal wire snares, weapons, and human silhouettes in real-time.",
          datasets: "Drone surveillance footage, Wildlife trap datasets, Poacher behavior patterns.",
          models: "YOLOv8 object detection, DeepSORT poacher tracking, RL patrol optimization, LoRa audio triangulation.",
          difficulty: "Advanced",
          skills: "Computer Vision, Robotics, Edge AI, Environmental Science"
        },
        {
          id: 25,
          title: "Soft Robotic Gripper with AI Tactile Intelligence",
          challenge: "Control soft pneumatic gripper fingers using embedded tactile cameras to handle delicate agricultural produce (tomatoes, eggs, berries) without bruising.",
          datasets: "GelSight tactile data, BioTac sensor recordings, Fragile object datasets.",
          models: "Tactile CNNs, PPO force-control reinforcement learning, PyBullet physics simulation.",
          difficulty: "Advanced",
          skills: "Tactile Sensing, Soft Robotics, Reinforcement Learning, Materials Science"
        },
        {
          id: 26,
          title: "Swarm Intelligence Multi-Robot Search and Rescue",
          challenge: "Decentralized rover swarm exploring disaster rubble without centralized Wi-Fi using mesh networking and collaborative SLAM mapping.",
          datasets: "CARLA / Gazebo simulation logs, Search & rescue mission data.",
          models: "Graph Neural Networks, Multi-Agent Reinforcement Learning (MARL), Distributed consensus protocols.",
          difficulty: "Advanced",
          skills: "Swarm Robotics, Distributed Computing, Multi-Agent RL"
        }
      ]
    },
    {
      track_id: "CIRCULAR_AGRICULTURE",
      track_name: "Circular Manufacturing & Smart Agriculture",
      problems: [
        {
          id: 27,
          title: "Waste-to-Value & Circular Manufacturing Using Industrial Pond Ash",
          challenge: "Convert coal power plant pond ash waste into cement-free geopolymer bricks, lightweight paving tiles, and thermal insulation materials for MSMEs.",
          datasets: "Material characterization datasets, Compressive strength and leaching test benchmarks.",
          models: "Geopolymer composite compaction, Alkaline activator optimization, Polymer-matrix extrusion.",
          sdgs: "SDG 12 (Responsible Consumption), SDG 9 (Industry & Innovation), SDG 13 (Climate Action), SDG 8, 11, 6.",
          difficulty: "Advanced",
          skills: "Mechanical Engineering, Material Science, Circular Economy, MSME Scaling"
        },
        {
          id: 28,
          title: "Sustainable 3D-Printing Filament from Recycled Waste Plastics",
          challenge: "Shred, clean, and extrude post-consumer PET, PLA, and HDPE waste into high-precision 1.75mm (+-0.05mm) FDM/FFF 3D-printer filament using closed-loop optical sensors.",
          datasets: "Polymer rheology datasets, Thermal degradation curves.",
          models: "Closed-loop PID heated extruder, Laser micrometer puller speed feedback control.",
          sdgs: "SDG 12, SDG 9, SDG 13, SDG 8, SDG 11, SDG 15.",
          difficulty: "Advanced",
          skills: "Additive Manufacturing, Polymer Processing, Mechatronics"
        },
        {
          id: 29,
          title: "Excessive Chemical Fertilizers & Soil Health Calculator",
          challenge: "Prevent fertilizer overuse and soil degradation by translating Soil Health Card N-P-K readings into crop-specific nutrient dosage recommendations offline.",
          solution: "Soil-test mobile calculator, Integrated Nutrient Management (INM), Balanced fertilization advisory."
        },
        {
          id: 30,
          title: "Irrigation Water Wastage & Smart Drip Scheduling",
          challenge: "Eliminate water wastage in smallholder farms through affordable soil moisture sensing and crop-growth-phase irrigation scheduling.",
          solution: "Low-cost capacitive soil-moisture sensor, crop-wise irrigation schedules, solar-switched automated drip relay."
        },
        {
          id: 31,
          title: "Pest & Crop Disease Early Identification",
          challenge: "Early detection of leaf anomalies and pest infestations before catastrophic crop destruction and uncontrolled pesticide usage.",
          solution: "MobileNet leaf vision scanner, WhatsApp advisory chatbot, low-cost smart pheromone/optical traps with IPM."
        },
        {
          id: 32,
          title: "Agricultural Waste & Crop Residue Management",
          challenge: "Prevent stubble burning and open dumping by productively converting agricultural biomass into valuable bio-inputs.",
          solution: "Biochar and vermicompost tracking, mushroom cultivation mapping, biodegradable packaging production."
        },
        {
          id: 33,
          title: "Direct Market Access & Fair Price Discovery for Farmers",
          challenge: "Eliminate middlemen exploitation and lack of transparent mandi price discovery for rural farmers.",
          solution: "Digital farmer-to-buyer platform, local aggregation center routing, real-time APMC price analytics, FPO linkage."
        }
      ]
    },
    {
      track_id: "AI_NLP_CYBER",
      track_name: "Artificial Intelligence, NLP & Cybersecurity",
      problems: [
        {
          id: 34,
          title: "Cross-Lingual Code Understanding — The Rosetta AI",
          challenge: "Translate legacy enterprise code (Python, Java, C++, JavaScript) while preserving semantic logic, memory safety, and idiom patterns.",
          datasets: "BigCloneBench, CodeSearchNet, Multi-language algorithm implementations.",
          models: "CodeBERT with multi-language extensions, Abstract Syntax Tree (AST) Graph Neural Networks, seq2seq transformers.",
          difficulty: "Advanced",
          skills: "NLP, Code Understanding, AST Parsing, Semantic Compilers"
        },
        {
          id: 35,
          title: "Emotion-Aware Mental Health Companion with Psychological Safety",
          challenge: "Empathetic conversational agent trained on CBT frameworks with distress detection and hardcoded emergency crisis triggers.",
          datasets: "PsychQA, Crisis Text Line (anonymized), Therapy conversation datasets.",
          models: "Fine-tuned GPT models, BERT emotion recognition, RoBERTa context understanding, RLHF.",
          difficulty: "Advanced",
          skills: "NLP, CBT Psychology, Safety in ML, Ethical AI"
        },
        {
          id: 36,
          title: "Deepfake Voice Detection in Real-Time Communications",
          challenge: "Detect synthetic voices (Tortoise-TTS, Vall-E) in live phone calls and video conferences via bispectral phase and prosody analysis.",
          datasets: "ASVspoof Challenge, VoxCeleb, DeepFakes-o-meter.",
          models: "XVector embeddings, Wav2Vec 2.0 feature extraction, ResNet spectrogram analysis, Capsule Networks.",
          difficulty: "Advanced",
          skills: "Audio DSP, Speaker Verification, Adversarial ML, Real-Time Audio"
        },
        {
          id: 37,
          title: "Zero-Trust API Security via Behavioral Biometrics",
          challenge: "Continuous machine-to-machine authentication detecting anomalous API requests and credential theft without requiring explicit tokens.",
          datasets: "HTTP request logs with anomalies, API call sequences.",
          models: "LSTM sequence anomaly detection, Isolation Forest, Autoencoders, One-Class SVM.",
          difficulty: "Intermediate-Advanced",
          skills: "API Security, Sequence Modeling, DevSecOps"
        },
        {
          id: 38,
          title: "Autonomous AI Agent Indirect Prompt Injection Guard",
          challenge: "Middleware gateway inspecting proposed tool execution parameters against strict schemas, blocking hijacked LLM egress.",
          models: "Pydantic schema interceptors, Dual-LLM trust boundary isolation, Dynamic canary token injection."
        },
        {
          id: 39,
          title: "Synthetic Data Generation for Rare Disease Clinical Detection",
          challenge: "Augment scarce medical imaging datasets for rare conditions while maintaining HIPAA compliance and biological plausibility.",
          datasets: "Kaggle rare disease imaging, Clinical case study datasets.",
          models: "Latent Diffusion Models (LDM), Conditional GANs, Conditional VAEs, Style transfer.",
          difficulty: "Advanced",
          skills: "Medical AI, Generative Vision, HIPAA Regulations"
        },
        {
          id: 40,
          title: "Context-Aware GenAI Content Moderation at Scale",
          challenge: "Filter text toxicity while understanding sarcasm, cultural context, and reclaimed internet slang.",
          datasets: "Twitter sentiment datasets, Multi-lingual hate speech datasets, Sarcasm corpora.",
          models: "XLM-RoBERTa, LLM-as-a-judge with SHAP feature explainability, Multi-lingual BERT.",
          difficulty: "Intermediate-Advanced",
          skills: "NLP, Content Moderation, Multilingual Processing"
        }
      ]
    }
  ],

  strategic_playbooks: {
    sprint_36h: {
      title: "Winning 36-Hour Hackathon Sprint Blueprint",
      phases: [
        { time: "Hours 0 – 3", name: "Scope & MVP Lock", description: "Pick the one core happy path. Assign 1 owner per decision area (Tech Lead, Product Lead). Do not build 10 unfinished features." },
        { time: "Hours 3 – 12", name: "Core Feature Build", description: "Scaffold GitHub repo, API boilerplate, DB schemas, Figma wireframes, and backend endpoints." },
        { time: "Hours 12 – 24", name: "Integration & Review", description: "Connect frontend to backend/APIs. Incorporate mentor feedback from Round 1 checkpoints." },
        { time: "Hours 24 – 32", name: "Hard Code Freeze", description: "Freeze new feature code 4 hours before submission. Mock slow/unstable APIs, pre-fill demo forms." },
        { time: "Hours 32 – 36", name: "Testing, Video & Pitch", description: "Record 2-minute backup demo video, verify public GitHub README, rehearse pitch 3x, submit 30 mins early." }
      ]
    },
    sih_30_day: {
      title: "30-Day SIH Master Plan",
      phases: [
        { week: "Week 1", name: "Selection & Team Formation", description: "Filter 2-3 Problem Statements, analyze existing competitor gaps, form balanced 6-member team (1 female member mandatory)." },
        { week: "Week 2", name: "Architecture & User Validation", description: "Conduct user/domain interviews, design Figma screens, finalize tech stack and database schemas." },
        { week: "Week 3", name: "Prototype & MVP Build", description: "Build functional MVP, commit code daily to GitHub, deploy live test URL." },
        { week: "Week 4", name: "Pitch Deck, Video & Rehearsals", description: "Create 10-slide standard PPT, record demo video, run mock jury Q&A sessions on novelty, cost, and scaling." }
      ]
    },
    pitch_2_min: {
      title: "2-Minute High-Impact Pitch Structure",
      breakdown: [
        { time: "0 – 15s", section: "The Hook", example: "Small farmers lose 30% of crops annually because early pest symptoms are impossible to spot without experts." },
        { time: "15 – 35s", section: "The Real Problem", example: "Explain who suffers, how often, and the exact cost/time limitation of current solutions." },
        { time: "35 – 60s", section: "Your Solution", example: "We built an offline-first mobile assistant that identifies leaf blight from a phone photo in under 1 second." },
        { time: "60 – 85s", section: "Working Demo", example: "Walk judges through the single most critical user flow (the 'Happy Path')." },
        { time: "85 – 105s", section: "Innovation & Tech", example: "Highlight why you stand out: offline edge quantization, multilingual audio guidance, or 90% cheaper deployment." },
        { time: "105 – 115s", section: "Impact & Feasibility", example: "Realistic cost, privacy compliance, scaling metrics, and pilot deployment roadmap." },
        { time: "115 – 120s", section: "Strong Closing", example: "We transform reactive loss into proactive harvest protection. Thank you!" }
      ]
    },
    rubric_weights: {
      problem_and_novelty: "25%",
      working_mvp_execution: "30%",
      feasibility_and_cost: "25%",
      ui_ux_and_storytelling: "20%"
    }
  }
};

// Export for use in Node or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HACKVERSE_KNOWLEDGE;
}
