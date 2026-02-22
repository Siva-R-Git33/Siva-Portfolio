import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const commands = {
    whoami: {
        output: 'Siva R — Cybersecurity Enthusiast | Ethical Hacker | Blue Team',
    },
    skills: {
        output: `┌─ Programming ─────── Python, SQL, Bash, MATLAB
├─ Operating Systems ─ Windows, Linux
├─ Cyber Tools ─────── Kali Linux, Nmap, Metasploit
└─ Security ─────────── Networking, Malware Analysis, Log Analysis, Wazuh (SIEM)`,
    },
    status: {
        output: '🟢 Learning & Building in Cybersecurity — MSc Cyber Security @ Bharathiar University',
    },
    help: {
        output: `Available commands:
  whoami   — Display identity
  skills   — List technical skills
  status   — Current status
  social   — Social links
  clear    — Clear terminal
  help     — Show this help`,
    },
    social: {
        output: `📧 shivar6277@gmail.com
🔗 linkedin.com/in/sivarr31
🎯 tryhackme.com/p/rsshiva403
📍 Tenkasi, Tamil Nadu, India`,
    },
};

export default function Terminal() {
    const [history, setHistory] = useState([
        { type: 'system', text: 'Welcome to SivaR Terminal v1.0.0' },
        { type: 'system', text: 'Type "help" for available commands.\n' },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [typingTarget, setTypingTarget] = useState('');
    const termRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-type demo on mount
    useEffect(() => {
        const demoCommands = ['whoami', 'skills', 'status'];
        let timeout;
        let currentIndex = 0;

        const runDemo = () => {
            if (currentIndex >= demoCommands.length) return;
            const cmd = demoCommands[currentIndex];
            let charIndex = 0;

            const typeChar = () => {
                if (charIndex < cmd.length) {
                    setInput(cmd.substring(0, charIndex + 1));
                    charIndex++;
                    timeout = setTimeout(typeChar, 80 + Math.random() * 60);
                } else {
                    timeout = setTimeout(() => {
                        handleCommand(cmd);
                        setInput('');
                        currentIndex++;
                        timeout = setTimeout(runDemo, 1000);
                    }, 400);
                }
            };

            timeout = setTimeout(typeChar, 800);
        };

        timeout = setTimeout(runDemo, 1500);
        return () => clearTimeout(timeout);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const typeOutput = (text) => {
        return new Promise((resolve) => {
            setIsTyping(true);
            setTypingTarget(text);
            let i = 0;
            const interval = setInterval(() => {
                setTypingText(text.substring(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    setIsTyping(false);
                    setTypingText('');
                    setTypingTarget('');
                    resolve();
                }
            }, 8);
        });
    };

    const handleCommand = async (cmd) => {
        const trimmed = cmd.trim().toLowerCase();

        setHistory((prev) => [...prev, { type: 'input', text: cmd }]);

        if (trimmed === 'clear') {
            setHistory([]);
            return;
        }

        if (commands[trimmed]) {
            const output = commands[trimmed].output;
            await typeOutput(output);
            setHistory((prev) => [...prev, { type: 'output', text: output }]);
        } else if (trimmed) {
            const errorMsg = `Command not found: ${trimmed}. Type "help" for available commands.`;
            setHistory((prev) => [...prev, { type: 'error', text: errorMsg }]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isTyping || !input.trim()) return;
        handleCommand(input);
        setInput('');
    };

    useEffect(() => {
        if (termRef.current) {
            termRef.current.scrollTop = termRef.current.scrollHeight;
        }
    }, [history, typingText]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="terminal-window max-w-3xl mx-auto"
        >
            {/* Terminal Header */}
            <div className="terminal-header">
                <div className="terminal-dot bg-red-500" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-green-500" />
                <span className="ml-3 text-gray-400 text-xs font-mono">siva@kali:~</span>
            </div>

            {/* Terminal Body */}
            <div
                ref={termRef}
                className="terminal-body h-[350px] overflow-y-auto cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((line, i) => (
                    <div key={i} className="mb-1">
                        {line.type === 'input' && (
                            <div>
                                <span className="text-neon-blue">siva@kali</span>
                                <span className="text-gray-500">:</span>
                                <span className="text-neon-purple">~</span>
                                <span className="text-gray-500">$ </span>
                                <span className="text-gray-200">{line.text}</span>
                            </div>
                        )}
                        {line.type === 'output' && (
                            <pre className="text-neon-green whitespace-pre-wrap text-sm">{line.text}</pre>
                        )}
                        {line.type === 'error' && (
                            <span className="text-neon-red">{line.text}</span>
                        )}
                        {line.type === 'system' && (
                            <span className="text-gray-500 italic">{line.text}</span>
                        )}
                    </div>
                ))}

                {/* Typing animation */}
                {isTyping && (
                    <pre className="text-neon-green whitespace-pre-wrap text-sm animate-pulse">
                        {typingText}
                        <span className="text-neon-green animate-blink-caret">█</span>
                    </pre>
                )}

                {/* Input line */}
                {!isTyping && (
                    <form onSubmit={handleSubmit} className="flex items-center">
                        <span className="text-neon-blue">siva@kali</span>
                        <span className="text-gray-500">:</span>
                        <span className="text-neon-purple">~</span>
                        <span className="text-gray-500">$ </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-200 font-mono text-sm caret-neon-green"
                            autoFocus
                            spellCheck="false"
                            autoComplete="off"
                        />
                    </form>
                )}
            </div>
        </motion.div>
    );
}
