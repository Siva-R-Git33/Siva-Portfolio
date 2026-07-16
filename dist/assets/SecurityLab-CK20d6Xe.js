import { r as reactExports, j as jsxRuntimeExports, F as FaEyeSlash, a as FaEye, m as motion, b as FaClock, c as FaCheckCircle, d as FaTimesCircle, e as FaGlobe, f as FaSearch, g as FaExclamationTriangle, h as FaFingerprint, i as FaSpinner, k as FaCheck, l as FaCopy, n as FaLock, H as Helmet, o as FaShieldAlt, p as FaKey, q as FaCogs, A as AnimatePresence } from "./index-C1YA_Q0t.js";
function PasswordChecker() {
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [strength, setStrength] = reactExports.useState(0);
  const [crackTime, setCrackTime] = reactExports.useState("Instant");
  const [feedback, setFeedback] = reactExports.useState([]);
  const calculateStrength = (pwd) => {
    let score = 0;
    let checks = [];
    if (!pwd) {
      setStrength(0);
      setCrackTime("Instant");
      setFeedback([]);
      return;
    }
    if (pwd.length > 8) {
      score += 20;
      checks.push({ text: "More than 8 characters", passed: true });
    } else {
      checks.push({ text: "More than 8 characters", passed: false });
    }
    if (pwd.length >= 12) score += 10;
    if (pwd.length >= 16) score += 10;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
    if (hasLower) {
      score += 15;
      checks.push({ text: "Lowercase letters", passed: true });
    } else {
      checks.push({ text: "Lowercase letters", passed: false });
    }
    if (hasUpper) {
      score += 15;
      checks.push({ text: "Uppercase letters", passed: true });
    } else {
      checks.push({ text: "Uppercase letters", passed: false });
    }
    if (hasNumber) {
      score += 15;
      checks.push({ text: "Numbers", passed: true });
    } else {
      checks.push({ text: "Numbers", passed: false });
    }
    if (hasSymbol) {
      score += 15;
      checks.push({ text: "Special characters", passed: true });
    } else {
      checks.push({ text: "Special characters", passed: false });
    }
    setStrength(Math.min(score, 100));
    setFeedback(checks);
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSymbol) poolSize += 32;
    if (poolSize === 0) {
      setCrackTime("Instant");
      return;
    }
    const entropy = pwd.length * Math.log2(poolSize);
    const guessesPerSec = 1e10;
    const secondsToCrack = Math.pow(2, entropy) / guessesPerSec;
    formatCrackTime(secondsToCrack);
  };
  const formatCrackTime = (seconds) => {
    if (seconds < 1) setCrackTime("Instant");
    else if (seconds < 60) setCrackTime(`${Math.round(seconds)} seconds`);
    else if (seconds < 3600) setCrackTime(`${Math.round(seconds / 60)} minutes`);
    else if (seconds < 86400) setCrackTime(`${Math.round(seconds / 3600)} hours`);
    else if (seconds < 2592e3) setCrackTime(`${Math.round(seconds / 86400)} days`);
    else if (seconds < 31536e3) setCrackTime(`${Math.round(seconds / 2592e3)} months`);
    else if (seconds < 31536e5) setCrackTime(`${Math.round(seconds / 31536e3)} years`);
    else setCrackTime("Centuries");
  };
  reactExports.useEffect(() => {
    calculateStrength(password);
  }, [password]);
  const getStrengthColor = () => {
    if (strength === 0) return "bg-cyber-gray";
    if (strength < 40) return "bg-neon-red shadow-[0_0_10px_rgba(255,0,60,0.5)]";
    if (strength < 75) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
    return "bg-neon-green shadow-[0_0_10px_rgba(0,255,65,0.5)]";
  };
  const getStrengthLabel = () => {
    if (strength === 0) return "None";
    if (strength < 40) return "Weak";
    if (strength < 75) return "Moderate";
    return "Strong";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white font-mono mb-2", children: "Password Entropy Analyzer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm", children: "Test the mathematical complexity of a password against brute-force attacks." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: showPassword ? "text" : "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          placeholder: "Enter a test password...",
          className: "w-full bg-cyber-black border border-cyber-border rounded-lg py-4 pl-4 pr-12 text-white focus:border-neon-green focus:outline-none transition-all font-mono"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowPassword(!showPassword),
          className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors",
          children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(FaEyeSlash, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(FaEye, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400", children: [
          "Strength: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: strength >= 75 ? "text-neon-green" : strength >= 40 ? "text-yellow-500" : "text-neon-red", children: getStrengthLabel() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-400", children: [
          strength,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-cyber-black rounded-full overflow-hidden border border-cyber-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: `h-full rounded-full ${getStrengthColor()}`,
          initial: { width: 0 },
          animate: { width: `${strength}%` },
          transition: { duration: 0.3, ease: "easeOut" }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "bg-cyber-black border border-cyber-border p-4 rounded-lg flex items-center justify-between",
        animate: { scale: password.length > 0 ? 1 : 0.98, opacity: password.length > 0 ? 1 : 0.5 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FaClock, { className: "text-neon-purple text-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-mono uppercase tracking-wider", children: "Estimated Offline Crack Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-white font-mono", children: crackTime })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 mt-6", children: feedback.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 p-3 rounded-lg border text-sm font-mono ${item.passed ? "bg-neon-green/5 border-neon-green/30 text-neon-green" : "bg-cyber-black border-cyber-border text-gray-500"}`, children: [
      item.passed ? /* @__PURE__ */ jsxRuntimeExports.jsx(FaCheckCircle, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(FaTimesCircle, {}),
      item.text
    ] }, idx)) })
  ] });
}
function HeaderAnalyzer() {
  const [url, setUrl] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState("");
  const analyzeHeaders = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const target = encodeURIComponent(url);
      const res = await fetch(`/api/analyze-headers?url=${target}`);
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || "Failed to analyze headers.");
      }
      calculateScore(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Target may be unreachable.");
    } finally {
      setLoading(false);
    }
  };
  const calculateScore = (data) => {
    let score = 100;
    const checks = [];
    const headers = data.headers;
    const addCheck = (name, value, deduction, desc, passDesc) => {
      if (value) {
        checks.push({ name, passed: true, desc: passDesc, value });
      } else {
        score -= deduction;
        checks.push({ name, passed: false, desc });
      }
    };
    addCheck(
      "Strict-Transport-Security",
      headers["strict-transport-security"],
      20,
      "Missing. Site is vulnerable to MITM downgrade attacks.",
      "Enforces HTTPS connections."
    );
    addCheck(
      "Content-Security-Policy",
      headers["content-security-policy"],
      25,
      "Missing. Highly vulnerable to Cross-Site Scripting (XSS).",
      "Restricts resource loading to trusted sources."
    );
    addCheck(
      "X-Frame-Options",
      headers["x-frame-options"],
      15,
      "Missing. Site can be embedded in an iframe, leading to Clickjacking.",
      "Prevents Clickjacking attacks."
    );
    addCheck(
      "X-Content-Type-Options",
      headers["x-content-type-options"],
      10,
      "Missing. Browsers may perform MIME-sniffing, leading to XSS.",
      "Prevents MIME-sniffing exploits."
    );
    addCheck(
      "Referrer-Policy",
      headers["referrer-policy"],
      10,
      "Missing. May leak sensitive URL parameters to third-party sites.",
      "Controls amount of referrer information sent."
    );
    addCheck(
      "Permissions-Policy",
      headers["permissions-policy"],
      10,
      "Missing. Does not restrict excessive browser API access (camera, mic).",
      "Limits browser features."
    );
    setResult({
      score: Math.max(0, score),
      checks,
      url: data.url,
      raw: data.raw,
      grade: getGrade(Math.max(0, score))
    });
  };
  const getGrade = (score) => {
    if (score >= 90) return { letter: "A", color: "text-neon-green border-neon-green shadow-[0_0_15px_rgba(0,255,65,0.3)]" };
    if (score >= 80) return { letter: "B", color: "text-neon-blue border-neon-blue shadow-[0_0_15px_rgba(0,212,255,0.3)]" };
    if (score >= 60) return { letter: "C", color: "text-yellow-500 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" };
    if (score >= 40) return { letter: "D", color: "text-orange-500 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]" };
    return { letter: "F", color: "text-neon-red border-neon-red shadow-[0_0_15px_rgba(255,0,60,0.3)]" };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white font-mono mb-2", children: "HTTP Header Analyzer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm max-w-xl mx-auto", children: "Inspect a web server's security posture by analyzing its HTTP response headers. Checks for modern defenses against XSS, Clickjacking, and Sniffing." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: analyzeHeaders, className: "relative max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-4 flex items-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaGlobe, { className: "text-gray-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: url,
          onChange: (e) => setUrl(e.target.value),
          placeholder: "https://example.com",
          className: "w-full bg-cyber-black/50 border border-cyber-border rounded-xl py-4 pl-12 pr-32 text-white focus:border-neon-blue focus:outline-none transition-all font-mono",
          required: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading || !url,
          className: "absolute right-2 top-2 bottom-2 bg-neon-blue hover:bg-neon-blue/80 text-cyber-black font-bold px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
          children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-cyber-black border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FaSearch, {}),
            " Scan"
          ] })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        className: "max-w-2xl mx-auto p-4 bg-neon-red/10 border border-neon-red/30 text-neon-red rounded-lg text-center font-mono text-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FaExclamationTriangle, { className: "inline mr-2" }),
          error
        ]
      }
    ),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between bg-cyber-black/50 border border-cyber-border p-6 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 md:mb-0 text-center md:text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white font-mono mb-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-[300px] md:max-w-sm", title: result.url, children: result.url }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-400 text-sm font-mono", children: [
                "Score: ",
                result.score,
                " / 100"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl font-bold ${result.grade.color} bg-cyber-black`, children: result.grade.letter })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: result.checks.map((check, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 rounded-lg border ${check.passed ? "bg-neon-green/5 border-neon-green/20" : "bg-neon-red/5 border-neon-red/20"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: check.passed ? /* @__PURE__ */ jsxRuntimeExports.jsx(FaCheckCircle, { className: "text-neon-green text-xl" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FaTimesCircle, { className: "text-neon-red text-xl" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: `font-mono font-bold text-lg ${check.passed ? "text-neon-green" : "text-neon-red"}`, children: check.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm mt-1", children: check.desc }),
              check.passed && check.value && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 bg-cyber-black p-2 rounded border border-cyber-border/50 text-xs text-gray-300 font-mono break-all", children: check.value })
            ] })
          ] }) }, idx)) })
        ]
      }
    )
  ] });
}
function JwtDecoder() {
  const [token, setToken] = reactExports.useState("");
  const [decoded, setDecoded] = reactExports.useState(null);
  const [error, setError] = reactExports.useState("");
  const decodeToken = (jwt) => {
    if (!jwt) {
      setDecoded(null);
      setError("");
      return;
    }
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Must contain 3 parts separated by dots.");
      }
      const decodeBase64Url = (str) => {
        str = str.replace(/-/g, "+").replace(/_/g, "/");
        while (str.length % 4) {
          str += "=";
        }
        return JSON.parse(decodeURIComponent(escape(atob(str))));
      };
      const header = decodeBase64Url(parts[0]);
      const payload = decodeBase64Url(parts[1]);
      let isExpired = false;
      let timeRemaining = null;
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1e3);
        isExpired = now > payload.exp;
        if (!isExpired) {
          timeRemaining = payload.exp - now;
        }
      }
      setDecoded({
        header,
        payload,
        signature: parts[2],
        isExpired,
        timeRemaining,
        hasExp: !!payload.exp
      });
      setError("");
    } catch (err) {
      setError(err.message || "Failed to decode token. Please ensure it is a valid Base64 JWT.");
      setDecoded(null);
    }
  };
  reactExports.useEffect(() => {
    decodeToken(token);
  }, [token]);
  const formatTimeRemaining = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m`;
    return `${Math.floor(seconds / 86400)}d ${Math.floor(seconds % 86400 / 3600)}h`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white font-mono mb-2", children: "JWT Decoder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm max-w-xl mx-auto", children: "Inspect the contents of a JSON Web Token entirely client-side. Decodes the Base64Url Header and Payload, and checks token expiration status." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaFingerprint, { className: "text-neon-purple text-xl" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: token,
          onChange: (e) => setToken(e.target.value),
          placeholder: "Paste JWT here (ey...)",
          className: "w-full bg-cyber-black/50 border border-cyber-border rounded-xl py-4 pl-12 pr-4 text-white focus:border-neon-purple focus:outline-none transition-all font-mono text-sm min-h-[120px] max-h-[300px] break-all",
          spellCheck: "false"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        className: "p-4 bg-neon-red/10 border border-neon-red/30 text-neon-red rounded-lg text-center font-mono text-sm flex items-center justify-center gap-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FaExclamationTriangle, {}),
          error
        ]
      }
    ),
    decoded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border font-mono font-bold ${!decoded.hasExp ? "bg-cyber-gray/50 border-cyber-border text-gray-400" : decoded.isExpired ? "bg-neon-red/10 border-neon-red/30 text-neon-red" : "bg-neon-green/10 border-neon-green/30 text-neon-green"}`, children: !decoded.hasExp ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FaExclamationTriangle, {}),
              " No Expiration (exp) Claim"
            ] }) : decoded.isExpired ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FaTimesCircle, {}),
              " Token Expired"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FaCheckCircle, {}),
              " Token Valid"
            ] }) }),
            decoded.hasExp && !decoded.isExpired && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 p-4 rounded-xl border bg-neon-blue/10 border-neon-blue/30 text-neon-blue font-mono font-bold px-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FaClock, {}),
              "Expires in: ",
              formatTimeRemaining(decoded.timeRemaining)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyber-black/80 border border-cyber-border rounded-xl overflow-hidden flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyber-gray px-4 py-2 border-b border-cyber-border text-xs font-mono font-bold text-neon-red uppercase tracking-wider", children: "Header (Algorithm & Token Type)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 overflow-auto flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-neon-red font-mono text-sm", children: JSON.stringify(decoded.header, null, 2) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyber-black/80 border border-cyber-border rounded-xl overflow-hidden flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyber-gray px-4 py-2 border-b border-cyber-border text-xs font-mono font-bold text-neon-purple uppercase tracking-wider", children: "Payload (Data Claims)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 overflow-auto flex-1 max-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-neon-purple font-mono text-sm leading-relaxed", children: JSON.stringify(decoded.payload, null, 2) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-cyber-black/80 border border-cyber-border rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyber-gray px-4 py-2 border-b border-cyber-border text-xs font-mono font-bold text-neon-blue uppercase tracking-wider", children: "Verify Signature" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 overflow-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neon-blue font-mono text-xs break-all opacity-70", children: decoded.signature }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 font-mono text-xs mt-2 mt-4 pt-4 border-t border-cyber-border/50", children: "Note: Signature verification requires the private server secret and cannot be done client-side alone." })
            ] })
          ] })
        ]
      }
    )
  ] });
}
const RECORD_COLORS = {
  A: "text-neon-green",
  AAAA: "text-neon-blue",
  MX: "text-neon-purple",
  TXT: "text-yellow-400",
  NS: "text-orange-400"
};
function DnsLookup() {
  const [domain, setDomain] = reactExports.useState("");
  const [results, setResults] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState("");
  const handleLookup = async (e) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch("/api/dns-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "DNS Lookup" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm font-mono mb-6", children: "Resolve A, AAAA, MX, TXT, and NS records for any domain." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLookup, className: "flex gap-2 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: domain,
          onChange: (e) => setDomain(e.target.value),
          placeholder: "e.g. example.com",
          className: "flex-1 bg-cyber-gray border border-cyber-border rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-neon-green focus:outline-none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "cyber-btn-solid px-6 flex items-center gap-2",
          children: [
            loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(FaSpinner, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FaSearch, {}),
            "Resolve"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neon-red/10 border border-neon-red/30 text-neon-red p-4 rounded-lg font-mono text-sm mb-4", children: [
      "✗ ",
      error
    ] }),
    results && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-mono text-gray-400 mb-2", children: [
            "Results for ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neon-green font-bold", children: results.domain })
          ] }),
          Object.entries(results.records).map(([type, values]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cyber-card !p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold font-mono text-sm ${RECORD_COLORS[type] || "text-white"}`, children: type }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500", children: [
                "(",
                values.length,
                " record",
                values.length !== 1 ? "s" : "",
                ")"
              ] })
            ] }),
            values.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: values.map((val, i) => {
              const display = typeof val === "object" ? `${val.exchange} (priority: ${val.priority})` : String(val);
              const key = `${type}-${i}`;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between bg-cyber-black/50 px-3 py-2 rounded text-xs font-mono group",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-300 break-all", children: display }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => copyToClipboard(display, key),
                        className: "text-gray-600 hover:text-neon-green transition-colors ml-2 shrink-0",
                        title: "Copy",
                        children: copied === key ? /* @__PURE__ */ jsxRuntimeExports.jsx(FaCheck, { className: "text-neon-green" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FaCopy, {})
                      }
                    )
                  ]
                },
                i
              );
            }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-xs font-mono", children: "No records found" })
          ] }, type))
        ]
      }
    )
  ] });
}
const HASH_LABELS = {
  md5: { name: "MD5", color: "text-neon-red", note: "(insecure, legacy)" },
  sha1: { name: "SHA-1", color: "text-yellow-400", note: "(deprecated)" },
  sha256: { name: "SHA-256", color: "text-neon-green", note: "(recommended)" },
  sha512: { name: "SHA-512", color: "text-neon-blue", note: "(strongest)" }
};
function HashGenerator() {
  const [text, setText] = reactExports.useState("");
  const [results, setResults] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState("");
  const handleHash = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch("/api/hash-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hashing failed");
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = (hash, key) => {
    navigator.clipboard.writeText(hash);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "Hash Generator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 text-sm font-mono mb-6", children: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for any text input." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleHash, className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: text,
          onChange: (e) => setText(e.target.value),
          placeholder: "Enter text to hash...",
          rows: 4,
          className: "w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-neon-green focus:outline-none resize-none mb-3"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "cyber-btn-solid px-6 flex items-center gap-2",
          children: [
            loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(FaSpinner, { className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FaLock, {}),
            "Compute Hashes"
          ]
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-neon-red/10 border border-neon-red/30 text-neon-red p-4 rounded-lg font-mono text-sm mb-4", children: [
      "✗ ",
      error
    ] }),
    results && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        className: "space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-mono text-gray-400 mb-2", children: [
            "Input: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
              '"',
              results.input,
              '"'
            ] })
          ] }),
          Object.entries(results.hashes).map(([algo, hash]) => {
            const meta = HASH_LABELS[algo] || { name: algo, color: "text-white", note: "" };
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cyber-card !p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold font-mono text-sm ${meta.color}`, children: meta.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-600", children: meta.note })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-cyber-black/50 px-3 py-2 rounded group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs text-gray-300 break-all", children: hash }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => copyToClipboard(hash, algo),
                    className: "text-gray-600 hover:text-neon-green transition-colors ml-2 shrink-0",
                    title: "Copy hash",
                    children: copied === algo ? /* @__PURE__ */ jsxRuntimeExports.jsx(FaCheck, { className: "text-neon-green" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FaCopy, {})
                  }
                )
              ] })
            ] }, algo);
          })
        ]
      }
    )
  ] });
}
const tools = [
  { id: "password", name: "Password Strength", icon: FaKey },
  { id: "headers", name: "Header Analyzer", icon: FaGlobe },
  { id: "jwt", name: "JWT Decoder", icon: FaCogs },
  { id: "dns", name: "DNS Lookup", icon: FaGlobe },
  { id: "hash", name: "Hash Generator", icon: FaShieldAlt }
];
function SecurityLab() {
  const [activeTool, setActiveTool] = reactExports.useState("password");
  reactExports.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Helmet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Security Lab | Siva R" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("meta", { name: "description", content: "Interactive cybersecurity tools for educational purposes, including password entropy analysis, HTTP security header inspection, and JWT decoding." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        className: "text-center mb-12",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neon-green/10 mb-6",
              animate: { boxShadow: ["0 0 0px rgba(0,255,65,0)", "0 0 20px rgba(0,255,65,0.3)", "0 0 0px rgba(0,255,65,0)"] },
              transition: { duration: 2, repeat: Infinity },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaShieldAlt, { className: "text-4xl text-neon-green" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: [
            "Security ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "neon-text", children: "Lab" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 max-w-2xl mx-auto font-mono text-sm leading-relaxed", children: "A suite of interactive, client-side tools designed for security analysis and engineering." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-6 py-3 rounded-lg text-sm font-mono text-left max-w-3xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FaExclamationTriangle, { className: "text-2xl shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Educational Use Only:" }),
              " These tools process data entirely within your browser (except the Header Analyzer proxy). Do not paste production secrets or live active JWTs."
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        className: "flex flex-wrap justify-center gap-2 mb-8 bg-cyber-dark/50 p-2 rounded-xl border border-cyber-border backdrop-blur-sm max-w-3xl mx-auto",
        children: tools.map((tool) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTool(tool.id),
            className: `flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all duration-300 ${activeTool === tool.id ? "bg-neon-green text-cyber-black shadow-[0_0_15px_rgba(0,255,65,0.3)]" : "text-gray-400 hover:text-white hover:bg-cyber-gray"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(tool.icon, { className: activeTool === tool.id ? "text-cyber-black" : "text-neon-green" }),
              tool.name
            ]
          },
          tool.id
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.2 },
        className: "max-w-4xl mx-auto bg-cyber-dark/30 border border-cyber-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-md min-h-[500px]",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            transition: { duration: 0.2 },
            children: [
              activeTool === "password" && /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordChecker, {}),
              activeTool === "headers" && /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderAnalyzer, {}),
              activeTool === "jwt" && /* @__PURE__ */ jsxRuntimeExports.jsx(JwtDecoder, {}),
              activeTool === "dns" && /* @__PURE__ */ jsxRuntimeExports.jsx(DnsLookup, {}),
              activeTool === "hash" && /* @__PURE__ */ jsxRuntimeExports.jsx(HashGenerator, {})
            ]
          },
          activeTool
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.3 },
        className: "mt-16 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 font-mono text-sm mb-4", children: "Need a professional security audit for your application?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/#contact", className: "cyber-btn-solid inline-flex px-8", children: "Contact For Consulting" })
        ]
      }
    )
  ] });
}
export {
  SecurityLab as default
};
