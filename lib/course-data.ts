/**
 * All built-in course content for the Learning Hub.
 * Separated from the page component to keep files manageable.
 */

export interface CourseLesson {
  id: string
  title: string
  type: "text" | "video" | "quiz" | "visualizer"
  content: string
}

export interface CourseModule {
  id: string
  title: string
  lessons: CourseLesson[]
}

export interface CourseData {
  id: string
  title: string
  modules: CourseModule[]
}

export const ALL_COURSES: CourseData[] = [
  // ===== SCHOOL ZONE =====
  {
    id: "scratch-basics", title: "Code with Blocks 🧩",
    modules: [{ id: "m1", title: "Module 1: Intro", lessons: [
      { id: "l1", title: "Drag & Drop", type: "visualizer", content: "reverse-string-challenge" }
    ]}]
  },
  {
    id: "python-kids", title: "Python for Kids 🐍",
    modules: [
      { id: "m1", title: "Module 1: Getting Started", lessons: [
        { id: "l1", title: "What is Python?", type: "text", content: "# Welcome to Python! 🐍\n\nPython is one of the most popular programming languages in the world.\n\n## Why Python?\n- **Easy to read** — looks like plain English\n- **Versatile** — web, data, AI, automation\n- **Huge community** — millions of developers\n\n## Your First Program\n```python\nprint('Hello, World!')\n```\n\nThat's it! One line to talk to a computer." },
        { id: "l2", title: "Variables & Types", type: "text", content: "# Variables\n\nVariables store data:\n```python\nname = 'Alice'\nage = 14\nheight = 5.4\nis_student = True\n```\n\n## Types\n| Type | Example | What it stores |\n|------|---------|----------------|\n| str | 'hello' | Text |\n| int | 42 | Whole numbers |\n| float | 3.14 | Decimal numbers |\n| bool | True | Yes/No values |" },
        { id: "l3", title: "Challenge: Fix the Bug", type: "visualizer", content: "reverse-string-challenge" },
      ]},
      { id: "m2", title: "Module 2: Loops & Logic", lessons: [
        { id: "l4", title: "If This Then That", type: "text", content: "## Conditionals\n\n```python\nx = 10\nif x > 5:\n    print('Big!')\nelif x == 5:\n    print('Exactly 5')\nelse:\n    print('Small')\n```\n\n### Practice\nWrite code that checks if a number is even or odd." },
        { id: "l5", title: "Looping Around", type: "text", content: "## Loops\n\n```python\nfor i in range(5):\n    print(f'Count: {i}')\n\nfruits = ['apple', 'banana', 'cherry']\nfor fruit in fruits:\n    print(fruit)\n```" },
      ]}
    ]
  },
  { id: "web-fun", title: "Make a Website 🌐", modules: [{ id: "m1", title: "Module 1: HTML Basics", lessons: [
    { id: "l1", title: "Your First HTML Page", type: "text", content: "# HTML Basics\n\n```html\n<!DOCTYPE html>\n<html>\n  <head><title>My Page</title></head>\n  <body>\n    <h1>Hello World!</h1>\n    <p>My first website.</p>\n  </body>\n</html>\n```\n\n## Key Tags\n- `<h1>`-`<h6>` — Headings\n- `<p>` — Paragraphs\n- `<a href>` — Links\n- `<img src>` — Images" },
  ]}]},

  // ===== COLLEGE & CS =====
  { id: "dsa", title: "Data Structures 🌳", modules: [
    { id: "m1", title: "Module 1: Sorting", lessons: [
      { id: "l1", title: "Bubble Sort", type: "visualizer", content: "bubble-sort" },
      { id: "l2", title: "Time Complexity", type: "text", content: "# Big O Notation\n\n| Name | Big O | Example |\n|------|-------|---------|\n| Constant | O(1) | Array access |\n| Log | O(log n) | Binary search |\n| Linear | O(n) | Linear search |\n| Quadratic | O(n²) | Bubble sort |" },
    ]},
    { id: "m2", title: "Module 2: Arrays", lessons: [
      { id: "l3", title: "Array Operations", type: "visualizer", content: "array-viz" }
    ]}
  ]},
  { id: "web-dev", title: "Full Stack Web 💻", modules: [{ id: "m1", title: "Module 1: React", lessons: [
    { id: "l1", title: "React Basics", type: "text", content: "# React.js\n\n```jsx\nfunction App() {\n  return <h1>Hello React!</h1>\n}\n```\n\n## Core Concepts\n- **Components** — Reusable UI blocks\n- **JSX** — HTML in JavaScript\n- **Props** — Pass data down\n- **State** — Component memory" },
    { id: "l2", title: "Hooks", type: "text", content: "# React Hooks\n\n```jsx\nconst [count, setCount] = useState(0);\n\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```" },
  ]}]},
  { id: "os", title: "Operating Systems ⚙️", modules: [{ id: "m1", title: "Module 1: Processes", lessons: [
    { id: "l1", title: "Processes & Threads", type: "text", content: "# Processes & Threads\n\n## Process\nAn instance of a running program with own memory space.\n\n## Thread\nLightweight execution unit sharing process memory.\n\n## Key Differences\n| Feature | Process | Thread |\n|---------|---------|--------|\n| Memory | Separate | Shared |\n| Creation | Heavy | Light |\n| Communication | IPC | Direct |" },
  ]}]},
  { id: "system-design", title: "System Design 🏗️", modules: [{ id: "m1", title: "Module 1: Scale", lessons: [
    { id: "l1", title: "Load Balancers", type: "visualizer", content: "system-design-canvas" },
    { id: "l2", title: "CAP Theorem", type: "text", content: "# CAP Theorem\n\nPick 2 of 3:\n- **C**onsistency\n- **A**vailability\n- **P**artition Tolerance\n\n| System | Choice |\n|--------|--------|\n| RDBMS | CA |\n| MongoDB | CP |\n| Cassandra | AP |" },
  ]}]},

  // ===== IoT & EMBEDDED =====
  { id: "arduino-basics", title: "Arduino Fundamentals 💡", modules: [
    { id: "m1", title: "Module 1: Getting Started", lessons: [
      { id: "l1", title: "What is Arduino?", type: "text", content: "# Arduino Fundamentals\n\nArduino is an open-source electronics platform for building interactive projects.\n\n## What You'll Need\n- Arduino Uno board\n- USB cable\n- Breadboard & jumper wires\n- LEDs, resistors, sensors\n\n## Your First Sketch\n```cpp\nvoid setup() {\n  pinMode(13, OUTPUT); // Built-in LED\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH); // LED ON\n  delay(1000);\n  digitalWrite(13, LOW);  // LED OFF\n  delay(1000);\n}\n```\n\n## Key Concepts\n- **Digital pins** — HIGH (5V) or LOW (0V)\n- **Analog pins** — Read sensor values (0-1023)\n- **`setup()`** runs once, **`loop()`** repeats forever" },
      { id: "l2", title: "Sensors & Input", type: "text", content: "# Reading Sensors\n\n## Temperature Sensor (LM35)\n```cpp\nint tempPin = A0;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int reading = analogRead(tempPin);\n  float voltage = reading * (5.0 / 1024.0);\n  float tempC = voltage * 100;\n  Serial.print(\"Temp: \");\n  Serial.println(tempC);\n  delay(1000);\n}\n```\n\n## Common Sensors\n| Sensor | Measures | Pin Type |\n|--------|----------|----------|\n| LM35 | Temperature | Analog |\n| HC-SR04 | Distance | Digital |\n| PIR | Motion | Digital |\n| LDR | Light | Analog |" },
    ]},
    { id: "m2", title: "Module 2: Projects", lessons: [
      { id: "l3", title: "Traffic Light System", type: "text", content: "# Build a Traffic Light 🚦\n\n## Components\n- 3 LEDs (Red, Yellow, Green)\n- 3 resistors (220Ω)\n- Arduino Uno\n\n## Wiring\n- Red → Pin 4\n- Yellow → Pin 3\n- Green → Pin 2\n\n## Code\n```cpp\nvoid setup() {\n  pinMode(2, OUTPUT); // Green\n  pinMode(3, OUTPUT); // Yellow\n  pinMode(4, OUTPUT); // Red\n}\n\nvoid loop() {\n  // Green for 5 seconds\n  digitalWrite(2, HIGH);\n  delay(5000);\n  digitalWrite(2, LOW);\n  \n  // Yellow for 2 seconds\n  digitalWrite(3, HIGH);\n  delay(2000);\n  digitalWrite(3, LOW);\n  \n  // Red for 5 seconds\n  digitalWrite(4, HIGH);\n  delay(5000);\n  digitalWrite(4, LOW);\n}\n```\n\n### Exercise\nAdd a pedestrian button using `digitalRead()`!" },
    ]}
  ]},
  { id: "raspberry-pi", title: "Raspberry Pi Projects 🫐", modules: [
    { id: "m1", title: "Module 1: Setup & Python", lessons: [
      { id: "l1", title: "Pi Setup & GPIO", type: "text", content: "# Raspberry Pi\n\nA full Linux computer the size of a credit card.\n\n## GPIO (General Purpose I/O)\n```python\nimport RPi.GPIO as GPIO\nimport time\n\nGPIO.setmode(GPIO.BCM)\nGPIO.setup(18, GPIO.OUT)\n\nwhile True:\n    GPIO.output(18, True)\n    time.sleep(1)\n    GPIO.output(18, False)\n    time.sleep(1)\n```\n\n## Common Uses\n- Home automation server\n- Weather station\n- Security camera\n- Retro gaming console" },
    ]}
  ]},
  { id: "mqtt-iot", title: "IoT Protocols 📡", modules: [
    { id: "m1", title: "Module 1: MQTT", lessons: [
      { id: "l1", title: "MQTT Pub/Sub", type: "text", content: "# MQTT Protocol\n\nLightweight messaging for IoT devices.\n\n## How It Works\n```\n[Sensor] → PUBLISH → [Broker] → DELIVER → [Dashboard]\n             topic: home/temp\n             payload: 23.5\n```\n\n## Python Client\n```python\nimport paho.mqtt.client as mqtt\n\nclient = mqtt.Client()\nclient.connect('broker.hivemq.com', 1883)\n\n# Publish sensor data\nclient.publish('home/temperature', '23.5')\n\n# Subscribe to commands\ndef on_message(client, userdata, msg):\n    print(f'{msg.topic}: {msg.payload.decode()}')\n\nclient.subscribe('home/commands')\nclient.on_message = on_message\nclient.loop_forever()\n```\n\n## IoT Protocols Compared\n| Protocol | Best For | Speed |\n|----------|----------|-------|\n| MQTT | Low-power sensors | Fast |\n| HTTP | Web APIs | Medium |\n| WebSocket | Real-time dashboards | Fast |\n| CoAP | Constrained devices | Fast |" },
    ]}
  ]},
  { id: "smart-home", title: "Smart Home Lab 🏠", modules: [
    { id: "m1", title: "Module 1: Automation", lessons: [
      { id: "l1", title: "Build a Smart Home", type: "text", content: "# Smart Home Automation\n\n## Architecture\n```\n[Sensors] → [Arduino/Pi] → [MQTT Broker] → [Node-RED Dashboard]\n  ├─ Temperature         ├─ WiFi Module    ├─ mosquitto\n  ├─ Motion              └─ Relay Module   └─ HiveMQ\n  └─ Light\n```\n\n## Node-RED Flow\n1. MQTT In node → receives sensor data\n2. Function node → process & threshold check\n3. Dashboard node → display on web UI\n4. MQTT Out node → send commands to actuators\n\n### Exercise: Auto Light System\n- LDR sensor reads ambient light\n- If light < threshold → turn on LED\n- Publish status to MQTT topic\n- Display on web dashboard" },
    ]}
  ]},

  // ===== DATA SCIENCE & AI =====
  { id: "python-data", title: "Python for Data 🐍", modules: [
    { id: "m1", title: "Module 1: pandas & NumPy", lessons: [
      { id: "l1", title: "pandas Basics", type: "text", content: "# pandas — Data Manipulation\n\n```python\nimport pandas as pd\n\n# Create DataFrame\ndf = pd.DataFrame({\n    'Name': ['Alice', 'Bob', 'Charlie'],\n    'Age': [25, 30, 35],\n    'Salary': [50000, 60000, 70000]\n})\n\n# Basic Operations\ndf.head()          # First 5 rows\ndf.describe()      # Statistics\ndf['Age'].mean()   # Average age\n\n# Filtering\nyoung = df[df['Age'] < 30]\n\n# Group by\ndf.groupby('Department')['Salary'].mean()\n```\n\n## Exercise\nLoad a CSV file and find:\n1. Average salary by department\n2. Employees older than 30\n3. Top 5 highest-paid employees" },
      { id: "l2", title: "NumPy Arrays", type: "text", content: "# NumPy — Numerical Computing\n\n```python\nimport numpy as np\n\narr = np.array([1, 2, 3, 4, 5])\n\n# Operations\narr * 2        # [2, 4, 6, 8, 10]\narr.mean()     # 3.0\narr.std()      # 1.414\n\n# Matrix\nmatrix = np.array([[1, 2], [3, 4]])\nnp.dot(matrix, matrix)  # Matrix multiplication\n```" },
    ]}
  ]},
  { id: "statistics", title: "Statistics Essentials 📈", modules: [
    { id: "m1", title: "Module 1: Foundations", lessons: [
      { id: "l1", title: "Probability & Distributions", type: "text", content: "# Statistics for Data Science\n\n## Key Measures\n| Measure | Formula | Use |\n|---------|---------|-----|\n| Mean | Σx/n | Average value |\n| Median | Middle value | Robust to outliers |\n| Mode | Most frequent | Categorical data |\n| Std Dev | √(Σ(x-μ)²/n) | Spread of data |\n\n## Normal Distribution\n- 68% within 1σ of mean\n- 95% within 2σ\n- 99.7% within 3σ\n\n## Hypothesis Testing\n1. State H₀ (null) and H₁ (alternative)\n2. Choose significance level (α = 0.05)\n3. Calculate test statistic\n4. Compare p-value to α\n5. Reject or fail to reject H₀" },
    ]}
  ]},
  { id: "ml-intro", title: "Machine Learning 101 🤖", modules: [
    { id: "m1", title: "Module 1: Supervised Learning", lessons: [
      { id: "l1", title: "Linear Regression", type: "text", content: "# Machine Learning\n\n## Types\n- **Supervised** — labeled data (classification, regression)\n- **Unsupervised** — find patterns (clustering)\n- **Reinforcement** — learn by reward\n\n## Linear Regression\n```python\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y)\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\nscore = model.score(X_test, y_test)\nprint(f'R² Score: {score:.2f}')\n```\n\n## Exercise\nPredict house prices using:\n- Square footage\n- Number of bedrooms\n- Location score" },
    ]},
    { id: "m2", title: "Module 2: Classification", lessons: [
      { id: "l2", title: "Decision Trees", type: "text", content: "# Classification\n\n```python\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import accuracy_score\n\nclf = DecisionTreeClassifier(max_depth=5)\nclf.fit(X_train, y_train)\npredictions = clf.predict(X_test)\n\nprint(f'Accuracy: {accuracy_score(y_test, predictions):.2%}')\n```\n\n## Confusion Matrix\n| | Predicted + | Predicted - |\n|---|---|---|\n| Actual + | TP | FN |\n| Actual - | FP | TN |\n\n- **Precision** = TP / (TP + FP)\n- **Recall** = TP / (TP + FN)\n- **F1** = 2 × (P × R) / (P + R)" },
    ]}
  ]},
  { id: "deep-learning", title: "Deep Learning 🧠", modules: [
    { id: "m1", title: "Module 1: Neural Networks", lessons: [
      { id: "l1", title: "Build a Neural Network", type: "text", content: "# Deep Learning with TensorFlow\n\n```python\nimport tensorflow as tf\n\nmodel = tf.keras.Sequential([\n    tf.keras.layers.Dense(128, activation='relu', input_shape=(784,)),\n    tf.keras.layers.Dropout(0.2),\n    tf.keras.layers.Dense(64, activation='relu'),\n    tf.keras.layers.Dense(10, activation='softmax')\n])\n\nmodel.compile(\n    optimizer='adam',\n    loss='sparse_categorical_crossentropy',\n    metrics=['accuracy']\n)\n\nmodel.fit(X_train, y_train, epochs=10, batch_size=32)\n```\n\n## Key Concepts\n- **Neurons** — weighted sum + activation\n- **Layers** — Dense, Conv2D, LSTM\n- **Backpropagation** — gradient descent\n- **Epochs** — full passes over data" },
    ]}
  ]},

  // ===== CYBERSECURITY =====
  { id: "security-fundamentals", title: "Security Fundamentals 🛡️", modules: [
    { id: "m1", title: "Module 1: Core Concepts", lessons: [
      { id: "l1", title: "CIA Triad & Threat Modeling", type: "text", content: "# Cybersecurity Fundamentals\n\n## CIA Triad\n- **Confidentiality** — Only authorized access\n- **Integrity** — Data isn't tampered with\n- **Availability** — Systems are accessible\n\n## Threat Modeling (STRIDE)\n| Threat | Against |\n|--------|--------|\n| **S**poofing | Authentication |\n| **T**ampering | Integrity |\n| **R**epudiation | Non-repudiation |\n| **I**nformation Disclosure | Confidentiality |\n| **D**enial of Service | Availability |\n| **E**levation of Privilege | Authorization |\n\n## Exercise: Threat Model a Login Page\n1. Draw the data flow diagram\n2. Identify STRIDE threats for each component\n3. Propose mitigations for each threat" },
      { id: "l2", title: "Attack Surfaces", type: "text", content: "# Understanding Attack Surfaces\n\n## Common Vulnerabilities\n```\nApplication Layer:  SQL Injection, XSS, CSRF\nNetwork Layer:      Man-in-the-Middle, DNS Spoofing\nPhysical Layer:     USB drops, shoulder surfing\nHuman Layer:        Phishing, social engineering\n```\n\n## Defense in Depth\n```\n[Firewall] → [IDS/IPS] → [WAF] → [App Security] → [Data Encryption]\n```\n\nEach layer stops different attacks. Never rely on a single defense." },
    ]}
  ]},
  { id: "network-security", title: "Network Security 🌐", modules: [
    { id: "m1", title: "Module 1: Network Defense", lessons: [
      { id: "l1", title: "Firewalls & Packet Analysis", type: "text", content: "# Network Security\n\n## Wireshark — Packet Analysis\n```\nFilter: http.request.method == \"POST\"\nFilter: ip.addr == 192.168.1.1\nFilter: tcp.port == 443\n```\n\n## iptables (Linux Firewall)\n```bash\n# Block an IP\niptables -A INPUT -s 10.0.0.5 -j DROP\n\n# Allow SSH\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\n\n# Allow HTTP/HTTPS\niptables -A INPUT -p tcp --dport 80 -j ACCEPT\niptables -A INPUT -p tcp --dport 443 -j ACCEPT\n\n# Drop everything else\niptables -A INPUT -j DROP\n```\n\n## Exercise\nCapture traffic on your local network and identify:\n1. HTTP vs HTTPS requests\n2. DNS lookups\n3. Any unencrypted credentials" },
    ]}
  ]},
  { id: "ethical-hacking", title: "Ethical Hacking 🏴‍☠️", modules: [
    { id: "m1", title: "Module 1: Pentesting", lessons: [
      { id: "l1", title: "OWASP Top 10", type: "text", content: "# OWASP Top 10 (2021)\n\n| # | Vulnerability | Example |\n|---|--------------|--------|\n| 1 | Broken Access Control | IDOR |\n| 2 | Cryptographic Failures | Plaintext passwords |\n| 3 | Injection | SQL injection |\n| 4 | Insecure Design | Missing rate limiting |\n| 5 | Security Misconfiguration | Default credentials |\n| 6 | Vulnerable Components | Outdated libraries |\n| 7 | Auth Failures | Weak passwords |\n| 8 | Data Integrity Failures | Insecure deserialization |\n| 9 | Logging Failures | No audit trail |\n| 10 | SSRF | Internal network access |\n\n## SQL Injection Example\n```sql\n-- Vulnerable query\nSELECT * FROM users WHERE email = '$input';\n\n-- Attack payload\n' OR '1'='1' --\n\n-- Fixed (parameterized)\nSELECT * FROM users WHERE email = $1;\n```\n\n## Exercise: Find the Vulnerability\nReview code and identify security flaws." },
    ]}
  ]},
  { id: "cryptography", title: "Cryptography 🔐", modules: [
    { id: "m1", title: "Module 1: Encryption", lessons: [
      { id: "l1", title: "Encryption Basics", type: "text", content: "# Cryptography\n\n## Symmetric Encryption (AES)\n```python\nfrom cryptography.fernet import Fernet\n\nkey = Fernet.generate_key()\ncipher = Fernet(key)\n\n# Encrypt\ntoken = cipher.encrypt(b'Secret message')\n\n# Decrypt\nplaintext = cipher.decrypt(token)\n```\n\n## Asymmetric (RSA)\n- **Public key** → encrypt / verify\n- **Private key** → decrypt / sign\n\n## Hashing (SHA-256)\n```python\nimport hashlib\nhash = hashlib.sha256(b'password').hexdigest()\n# One-way: can't reverse back to 'password'\n```\n\n## Comparison\n| Type | Speed | Use Case |\n|------|-------|----------|\n| Symmetric | Fast | File encryption |\n| Asymmetric | Slow | Key exchange, signatures |\n| Hashing | Fast | Password storage |" },
    ]}
  ]},

  // ===== UI/UX DESIGN =====
  { id: "design-thinking", title: "Design Thinking 💭", modules: [
    { id: "m1", title: "Module 1: The Process", lessons: [
      { id: "l1", title: "5 Phases of Design Thinking", type: "text", content: "# Design Thinking\n\nA human-centered approach to problem solving.\n\n## The 5 Phases\n\n### 1. Empathize 👥\n- Interview users\n- Observe behavior\n- Build empathy maps\n\n### 2. Define 🎯\n- Synthesize research\n- Create problem statement\n- \"How Might We...\" questions\n\n### 3. Ideate 💡\n- Brainstorm solutions\n- Crazy 8s sketching\n- Vote on best ideas\n\n### 4. Prototype 🔧\n- Low-fidelity wireframes\n- Paper prototypes\n- Figma clickable prototypes\n\n### 5. Test ✅\n- Usability testing (5 users)\n- A/B testing\n- Iterate based on feedback\n\n## Exercise: Redesign a Vending Machine\nApply all 5 phases to redesign a vending machine for accessibility." },
    ]}
  ]},
  { id: "figma-mastery", title: "Figma Mastery 🎨", modules: [
    { id: "m1", title: "Module 1: Figma Essentials", lessons: [
      { id: "l1", title: "Figma Workspace", type: "text", content: "# Figma Mastery\n\n## Core Tools\n- **Frame (F)** — Artboards for screens\n- **Rectangle (R)** — Shape tool\n- **Text (T)** — Typography\n- **Pen (P)** — Custom shapes\n- **Component** — Reusable elements\n\n## Auto Layout\n```\nFrame → Add Auto Layout (Shift+A)\n├─ Direction: Horizontal / Vertical\n├─ Gap: Space between items\n├─ Padding: Inner spacing\n└─ Alignment: Start / Center / End\n```\n\n## Components & Variants\n1. Design a button\n2. Create component (Ctrl+Alt+K)\n3. Add variants: Primary, Secondary, Disabled\n4. Use instances across your design\n\n## Exercise\nDesign a mobile app login screen with:\n- Email & password inputs\n- Login button (primary)\n- 'Forgot password' link\n- Social login options" },
    ]}
  ]},
  { id: "ux-research", title: "UX Research 🔍", modules: [
    { id: "m1", title: "Module 1: Research Methods", lessons: [
      { id: "l1", title: "User Research", type: "text", content: "# UX Research Methods\n\n## Qualitative\n- **User Interviews** — Deep insights, 5-8 participants\n- **Contextual Inquiry** — Observe in natural environment\n- **Card Sorting** — Information architecture\n\n## Quantitative\n- **Surveys** — Scale data, 100+ responses\n- **A/B Testing** — Compare two versions\n- **Analytics** — Behavioral data\n\n## Deliverables\n- **Personas** — Fictional user profiles\n- **Journey Maps** — User experience timeline\n- **Affinity Diagrams** — Group findings by theme\n\n## Exercise: Create a Persona\nInterview 3 people about their learning habits and create a user persona." },
    ]}
  ]},
  { id: "design-systems", title: "Design Systems 📐", modules: [
    { id: "m1", title: "Module 1: Building Systems", lessons: [
      { id: "l1", title: "Design Tokens & Components", type: "text", content: "# Design Systems\n\n## Design Tokens\n```json\n{\n  \"colors\": {\n    \"primary\": \"#6366F1\",\n    \"secondary\": \"#EC4899\",\n    \"background\": \"#0F172A\"\n  },\n  \"spacing\": {\n    \"xs\": \"4px\",\n    \"sm\": \"8px\",\n    \"md\": \"16px\"\n  },\n  \"typography\": {\n    \"heading\": { \"font\": \"Inter\", \"weight\": 700 },\n    \"body\": { \"font\": \"Inter\", \"weight\": 400 }\n  }\n}\n```\n\n## Component Library\n- Buttons (primary, secondary, ghost, danger)\n- Inputs (text, select, checkbox, radio)\n- Cards, Modals, Tooltips\n- Navigation (tabs, breadcrumbs, sidebar)\n\n## Exercise\nBuild a mini design system with 5 components in Figma." },
    ]}
  ]},

  // ===== CLOUD & DEVOPS =====
  { id: "aws-fundamentals", title: "AWS Fundamentals ☁️", modules: [
    { id: "m1", title: "Module 1: Core Services", lessons: [
      { id: "l1", title: "EC2, S3, Lambda", type: "text", content: "# AWS Core Services\n\n## EC2 (Virtual Servers)\n```bash\n# Launch instance\naws ec2 run-instances \\\n  --image-id ami-0c55b159cbfafe1f0 \\\n  --instance-type t2.micro \\\n  --key-name my-key\n```\n\n## S3 (Object Storage)\n```bash\n# Upload file\naws s3 cp ./file.txt s3://my-bucket/\n\n# Sync directory\naws s3 sync ./build s3://my-website-bucket/\n```\n\n## Lambda (Serverless)\n```python\ndef handler(event, context):\n    name = event.get('name', 'World')\n    return {\n        'statusCode': 200,\n        'body': f'Hello, {name}!'\n    }\n```\n\n## Service Map\n| Service | Category | Use Case |\n|---------|----------|----------|\n| EC2 | Compute | Web servers |\n| S3 | Storage | Static files |\n| RDS | Database | PostgreSQL/MySQL |\n| Lambda | Serverless | Event handlers |\n| IAM | Security | Access control |" },
    ]}
  ]},
  { id: "docker-course", title: "Docker Deep Dive 🐳", modules: [
    { id: "m1", title: "Module 1: Containers", lessons: [
      { id: "l1", title: "Dockerfile & Compose", type: "text", content: "# Docker\n\n## Dockerfile\n```dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n```\n\n## Docker Compose\n```yaml\nversion: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - '3000:3000'\n    depends_on:\n      - db\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: secret\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:\n```\n\n## Commands Cheat Sheet\n```bash\ndocker build -t myapp .\ndocker run -p 3000:3000 myapp\ndocker compose up -d\ndocker compose logs -f\n```" },
    ]}
  ]},
  { id: "kubernetes", title: "Kubernetes ⎈", modules: [
    { id: "m1", title: "Module 1: K8s Basics", lessons: [
      { id: "l1", title: "Pods & Deployments", type: "text", content: "# Kubernetes\n\n## Deployment YAML\n```yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n      - name: web\n        image: myapp:latest\n        ports:\n        - containerPort: 3000\n```\n\n## Core Concepts\n| Resource | Purpose |\n|----------|--------|\n| Pod | Smallest unit (1+ containers) |\n| Deployment | Manages pod replicas |\n| Service | Networking & load balancing |\n| Ingress | External HTTP routing |" },
    ]}
  ]},
  { id: "terraform", title: "Infrastructure as Code 🏗️", modules: [
    { id: "m1", title: "Module 1: Terraform", lessons: [
      { id: "l1", title: "Terraform Basics", type: "text", content: "# Terraform\n\n## Define Infrastructure\n```hcl\nprovider \"aws\" {\n  region = \"us-east-1\"\n}\n\nresource \"aws_instance\" \"web\" {\n  ami           = \"ami-0c55b159cbfafe1f0\"\n  instance_type = \"t2.micro\"\n\n  tags = {\n    Name = \"WebServer\"\n  }\n}\n\nresource \"aws_s3_bucket\" \"static\" {\n  bucket = \"my-static-site\"\n}\n```\n\n## Workflow\n```bash\nterraform init      # Download providers\nterraform plan      # Preview changes\nterraform apply     # Create resources\nterraform destroy   # Tear everything down\n```\n\n## State\nTerraform tracks what exists in `terraform.tfstate`. Always use remote state (S3 + DynamoDB lock) in teams." },
    ]}
  ]},

  // ===== NO-CODE & BUSINESS =====
  { id: "n8n-automation", title: "n8n Automation 🔄", modules: [
    { id: "m1", title: "Module 1: Workflow Basics", lessons: [
      { id: "l1", title: "Your First Workflow", type: "text", content: "# n8n Workflow Automation\n\n## What is n8n?\nAn open-source workflow automation tool — like Zapier, but self-hosted and extensible.\n\n## Core Concepts\n- **Trigger** — What starts the workflow (webhook, schedule, event)\n- **Node** — An action step (API call, transform, send email)\n- **Connection** — Data flows between nodes\n- **Execution** — One run of the workflow\n\n## Example: Slack Notification on Form Submit\n```\n[Webhook Trigger] → [Transform Data] → [Slack Node]\n    receives POST      extract name       send message\n```\n\n## Exercise\nBuild a workflow that:\n1. Receives a webhook POST with `{ name, email }`\n2. Saves to Google Sheets\n3. Sends a welcome email\n4. Posts notification to Slack" },
    ]},
    { id: "m2", title: "Module 2: Advanced Patterns", lessons: [
      { id: "l2", title: "Error Handling & Branching", type: "text", content: "# Advanced n8n Patterns\n\n## Conditional Branching (IF Node)\n```\n[Webhook] → [IF: amount > 100]\n              ├─ True  → [Send Alert]\n              └─ False → [Log to Sheet]\n```\n\n## Error Handling\n- Use **Error Trigger** to catch failures\n- Add **retry** on HTTP nodes\n- Set up **fallback** branches\n\n## Cron Schedules\n```\n┌───────── minute (0-59)\n│ ┌─────── hour (0-23)\n│ │ ┌───── day of month (1-31)\n│ │ │ ┌─── month (1-12)\n│ │ │ │ ┌─ day of week (0-6)\n* * * * *\n\n0 9 * * 1    Every Monday at 9 AM\n*/15 * * * *  Every 15 minutes\n0 0 1 * *     First of every month\n```" },
    ]}
  ]},
  { id: "product-management", title: "Product Management 📋", modules: [
    { id: "m1", title: "Module 1: PM Foundations", lessons: [
      { id: "l1", title: "Product Strategy", type: "text", content: "# Product Management\n\n## The PM Role\nA PM sits at the intersection of **Business**, **Technology**, and **Design**.\n\n## Frameworks\n\n### RICE Prioritization\n| Factor | Description |\n|--------|------------|\n| **R**each | How many users affected? |\n| **I**mpact | How much improvement? |\n| **C**onfidence | How sure are you? |\n| **E**ffort | How much work? |\n\nScore = (R × I × C) / E\n\n### User Story Format\n```\nAs a [user type],\nI want to [action],\nSo that [benefit].\n```\n\n### OKRs\n- **Objective**: Improve user onboarding\n- **KR1**: Increase completion rate from 40% to 70%\n- **KR2**: Reduce time-to-value from 5 min to 2 min\n- **KR3**: Achieve NPS > 50 from new users\n\n## Exercise\nWrite 3 user stories and prioritize them using RICE." },
    ]}
  ]},
  { id: "digital-marketing", title: "Digital Marketing 📣", modules: [
    { id: "m1", title: "Module 1: Growth & SEO", lessons: [
      { id: "l1", title: "SEO & Content Strategy", type: "text", content: "# Digital Marketing\n\n## SEO Fundamentals\n1. **Keyword Research** — What people search for\n2. **On-Page SEO** — Title tags, meta descriptions, headings\n3. **Technical SEO** — Site speed, mobile-friendly, schema\n4. **Off-Page SEO** — Backlinks, social signals\n\n## Content Marketing Funnel\n```\nAwareness  → Blog posts, social media, videos\nConsideration → Case studies, webinars, guides\nDecision    → Free trials, demos, testimonials\nRetention   → Email sequences, community\n```\n\n## Key Metrics\n| Metric | Target |\n|--------|--------|\n| Organic traffic | ↑ 20% monthly |\n| Bounce rate | < 40% |\n| Conversion rate | > 3% |\n| CAC | < LTV/3 |\n\n## Exercise\nCreate an SEO content plan for a SaaS product:\n1. Identify 10 target keywords\n2. Map to content types\n3. Plan a 4-week publishing calendar" },
    ]}
  ]},
  { id: "business-analytics", title: "Business Analytics 📊", modules: [
    { id: "m1", title: "Module 1: Data-Driven Decisions", lessons: [
      { id: "l1", title: "KPIs & Dashboards", type: "text", content: "# Business Analytics\n\n## Key Performance Indicators\n\n### SaaS Metrics\n| Metric | Formula | Good Target |\n|--------|---------|-------------|\n| MRR | Sum of monthly revenue | Growing |\n| Churn Rate | Lost customers / Total | < 5% |\n| CAC | Marketing spend / New customers | Decreasing |\n| LTV | ARPU × Average lifespan | > 3× CAC |\n| NPS | Promoters - Detractors | > 50 |\n\n### Dashboard Best Practices\n1. **One KPI per card** — avoid clutter\n2. **Trend lines** — show direction\n3. **Comparisons** — vs last period\n4. **Traffic light colors** — red/amber/green\n\n## Excel/Sheets Power Moves\n```\n=VLOOKUP(A2, Data!A:D, 3, FALSE)\n=SUMIFS(Sales, Region, \"Asia\", Month, \"Jan\")\n=IF(AND(Score>80, Attendance>90%), \"Pass\", \"Review\")\n```\n\n## Exercise\nBuild a dashboard tracking 5 KPIs for a fictional e-commerce store." },
    ]}
  ]},

  // ===== PRO EXPANDED =====
  { id: "microservices", title: "Microservices 🔌", modules: [
    { id: "m1", title: "Module 1: Architecture", lessons: [
      { id: "l1", title: "Microservices Patterns", type: "text", content: "# Microservices Architecture\n\n## Monolith vs Microservices\n| Aspect | Monolith | Microservices |\n|--------|----------|---------------|\n| Deploy | All at once | Independent |\n| Scale | Vertical | Horizontal |\n| Team | One large | Small teams |\n| DB | Shared | Per-service |\n\n## Key Patterns\n- **API Gateway** — single entry point\n- **Service Discovery** — find services dynamically\n- **Circuit Breaker** — handle failures gracefully\n- **Event Sourcing** — events as source of truth\n- **CQRS** — separate read/write models\n\n## Communication\n```\nSync:  REST, gRPC\nAsync: Message queues (RabbitMQ, Kafka)\nEvent: Event bus (Redis Streams, NATS)\n```" },
    ]}
  ]},
  { id: "devops-mastery", title: "DevOps Mastery 🚢", modules: [
    { id: "m1", title: "Module 1: CI/CD", lessons: [
      { id: "l1", title: "CI/CD Pipelines", type: "text", content: "# CI/CD Pipelines\n\n## GitHub Actions\n```yaml\nname: CI/CD Pipeline\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm install\n      - run: npm test\n  \n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm run build\n      - uses: amondnet/vercel-action@v25\n        with:\n          vercel-token: ${{ secrets.VERCEL_TOKEN }}\n```\n\n## Pipeline Stages\n```\n[Commit] → [Lint] → [Test] → [Build] → [Deploy Staging] → [E2E Tests] → [Deploy Prod]\n```" },
    ]}
  ]},
// ===== ENGINEERING ACADEMY =====
  { id: "mech-kinematics", title: "Mechanical Kinematics ⚙️", modules: [
    { id: "m1", title: "Module 1: Gear Systems", lessons: [
      { id: "l1", title: "Kinematics & Ratios", type: "text", content: "# Mechanical Kinematics\n\n## Gear Ratios\nThe gear ratio is calculated by dividing the number of teeth on the output gear by the number of teeth on the input gear.\n\n`Ratio = Output Teeth / Input Teeth`\n\n- **Torque**: Larger output gear = More torque, less speed.\n- **Speed**: Smaller output gear = Less torque, more speed." },
      { id: "l2", title: "Lab: Optimize Gear Ratio", type: "visualizer", content: "mech-lab" }
    ]}
  ]},
  { id: "fea-mechanics", title: "FEA Mechanics 🏗️", modules: [
    { id: "m1", title: "Module 1: Finite Element Analysis", lessons: [
      { id: "l1", title: "Understanding Stress", type: "text", content: "# Stress Analysis\n\nWhen a load is applied to a material, internal forces (stress) develop. If the stress exceeds the material's Yield Strength, permanent deformation or fracture occurs.\n\nFEA breaks down a complex structure into thousands of tiny 'finite elements' to calculate how stress flows." },
      { id: "l2", title: "Lab: Test Beam Stress", type: "visualizer", content: "fea-simulator" }
    ]}
  ]},
  { id: "gdt-mastery", title: "GD&T Mastery 📏", modules: [
    { id: "m1", title: "Module 1: Tolerancing", lessons: [
      { id: "l1", title: "Design for Manufacturing", type: "text", content: "# GD&T Basics\n\nGeometric Dimensioning & Tolerancing ensures that parts fit together during assembly. Modern CNC machines have variance.\n\nBy adding an acceptable ± tolerance band, you lower manufacturing costs while ensuring high yield." },
      { id: "l2", title: "Lab: Quality Control", type: "visualizer", content: "gdt-lab" }
    ]}
  ]},
  { id: "eee-circuits", title: "Digital Logic Design ⚡", modules: [
    { id: "m1", title: "Module 1: Logic Gates", lessons: [
      { id: "l1", title: "AND, OR, NOT Gates", type: "text", content: "# Digital Logic circuits\n\n## AND Gate\nOutputs TRUE only if ALL inputs are TRUE.\n\n## OR Gate\nOutputs TRUE if ANY input is TRUE.\n\n## Applications\nLogic gates are the fundamental building blocks of all CPUs and embedded electronics." },
      { id: "l2", title: "Lab: Build a Circuit", type: "visualizer", content: "circuit-lab" }
    ]}
  ]},
  { id: "bim-coordination", title: "BIM Clash Resolution 🏢", modules: [
    { id: "m1", title: "Module 1: BIM Concepts", lessons: [
      { id: "l1", title: "What is a Clash?", type: "text", content: "# Building Information Modeling\n\n## The Clash Matrix\nModern infrastructure is built digitally before it is built physically. A *clash* occurs when elements from different models (e.g., Structural vs. MEP) occupy the same 3D space.\n\n## Resolution Hierarchy\nGravity determines precedence. You cannot easily bend a massive steel I-Beam, but you *can* reroute flexible HVAC ductwork or plumbing pipes. Therefore, Structural elements usually have clash priority over MEP elements." },
      { id: "l2", title: "Lab: Resolve the Clash", type: "visualizer", content: "bim-clash-lab" }
    ]}
  ]},
  { id: "structural-analysis", title: "Truss Optimization 🌉", modules: [
    { id: "m1", title: "Module 1: Statics & Dynamics", lessons: [
      { id: "l1", title: "Live Load vs Dead Load", type: "text", content: "# Structural Analysis\n\n## Dead Load\nThe weight of the structure itself (e.g., steel beams, concrete deck).\n\n## Live Load\nThe temporary forces acting on the structure (e.g., traffic, wind, pedestrians).\n\n## Value Engineering\nAn engineer's job is not just to build a bridge that stands, but to build a bridge that stands *for the cheapest possible price* while maintaining a strict Safety Factor > 1.5." },
      { id: "l2", title: "Lab: Build a Bridge", type: "visualizer", content: "bridge-builder-lab" }
    ]}
  ]},

  { id: "bio-genetics", title: "Genetics & Synthesis 🧬", modules: [
    { id: "m1", title: "Module 1: DNA Structure", lessons: [
      { id: "l1", title: "Nucleotide Base Pairing", type: "text", content: "# DNA Base Pairing\n\nDNA consists of two strands winding around each other. Each strand has a backbone made of alternating sugar and phosphate groups.\n\n## The Rules of Pairing\n- **Adenine (A)** pairs with **Thymine (T)**\n- **Cytosine (C)** pairs with **Guanine (G)**\n\nThis specific pairing ensures that genetic code is copied precisely during cell division." },
      { id: "l2", title: "Lab: Synthesize Protein", type: "visualizer", content: "bio-lab" }
    ]}
  ]},
  { id: "game-physics", title: "Game Physics Engine 🎮", modules: [
    { id: "m1", title: "Module 1: Rigidbody Dynamics", lessons: [
      { id: "l1", title: "Gravity & Restitution", type: "text", content: "# Game Physics\n\n## Gravity\nAcceleration applied continuously to an object. In game engines, usually applied as a vector `(0, -9.8, 0)`.\n\n## Restitution (Bounciness)\nA value between 0 and 1 detailing how much kinetic energy is preserved during a collision.\n- 0 = Absolute thud (mud)\n- 1 = Perfect bounce (superball)" },
      { id: "l2", title: "Lab: Tune Physics Engine", type: "visualizer", content: "game-physics-lab" }
    ]}
  ]},
]
