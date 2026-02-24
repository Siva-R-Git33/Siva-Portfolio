import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { settingsAPI } from '../utils/api';

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

const fileSystem = {
    '~': {
        type: 'dir',
        contents: ['projects', 'documents', 'secret']
    },
    '~/projects': {
        type: 'dir',
        contents: ['signature_verification.py', 'keylogger.c']
    },
    '~/documents': {
        type: 'dir',
        contents: ['resume.pdf', 'notes.txt']
    },
    '~/secret': {
        type: 'dir',
        contents: ['passwords.txt']
    },
    '~/projects/signature_verification.py': {
        type: 'file',
        content: '# Import Siamese Networks\nimport tensorflow as tf\n\ndef verify(img1, img2):\n  print("Checking authenticity...")\n  return True'
    },
    '~/projects/keylogger.c': {
        type: 'file',
        content: '#include <windows.h>\n#include <stdio.h>\n\nint main() {\n  // For educational purposes only\n  FreeConsole();\n  return 0;\n}'
    },
    '~/documents/notes.txt': {
        type: 'file',
        content: 'TODO:\n1. Learn more about Active Directory\n2. Setup Wazuh SIEM home lab\n3. Do more TryHackMe rooms'
    },
    '~/secret/passwords.txt': {
        type: 'file',
        content: 'admin: hunter2\nwifi: h@ckm31fy0uc@n'
    }
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
    const [currentDir, setCurrentDir] = useState('~');
    const [advancedEnabled, setAdvancedEnabled] = useState(false);
    const [matrixMode, setMatrixMode] = useState(false);
    const termRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        settingsAPI.get('feature_flags').then(res => {
            if (res.data?.showAdvancedTerminal) setAdvancedEnabled(true);
        }).catch(console.error);
    }, []);

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
        const fullCmd = cmd.trim();
        const args = fullCmd.split(' ').filter(Boolean);
        if (args.length === 0) return;

        const baseCmd = args[0].toLowerCase();
        setHistory((prev) => [...prev, { type: 'input', text: fullCmd, dir: currentDir }]);

        if (baseCmd === 'clear') {
            setHistory([]);
            return;
        }

        if (fullCmd === 'sudo su' || fullCmd === 'sudo -i') {
            if (!advancedEnabled) {
                setHistory((prev) => [...prev, { type: 'error', text: 'siva is not in the sudoers file. This incident will be reported.' }]);
                return;
            }
            await typeOutput("Access granted. Initiating matrix protocol...");
            setMatrixMode(true);
            setTimeout(() => setMatrixMode(false), 5000); // Easter egg lasts 5 seconds
            setHistory((prev) => [...prev, { type: 'output', text: 'You are now root.' }]);
            return;
        }

        if (commands[baseCmd]) {
            let output = commands[baseCmd].output;
            if (baseCmd === 'help' && advancedEnabled) {
                output += '\n  ls       — List directory contents\n  cd       — Change directory\n  cat      — Read file contents';
            }
            await typeOutput(output);
            setHistory((prev) => [...prev, { type: 'output', text: output }]);
            return;
        }

        if (advancedEnabled) {
            if (baseCmd === 'ls') {
                const node = fileSystem[currentDir];
                if (node && node.type === 'dir') {
                    const output = node.contents.join('  ');
                    await typeOutput(output);
                    setHistory((prev) => [...prev, { type: 'output', text: output }]);
                }
                return;
            }

            if (baseCmd === 'cd') {
                const target = args[1];
                if (!target || target === '~') {
                    setCurrentDir('~');
                    return;
                }
                if (target === '..') {
                    if (currentDir === '~') return;
                    const parts = currentDir.split('/');
                    parts.pop();
                    setCurrentDir(parts.join('/'));
                    return;
                }
                const newPath = currentDir === '~' ? `~/${target}` : `${currentDir}/${target}`;
                if (fileSystem[newPath] && fileSystem[newPath].type === 'dir') {
                    setCurrentDir(newPath);
                } else {
                    setHistory((prev) => [...prev, { type: 'error', text: `cd: ${target}: No such file or directory` }]);
                }
                return;
            }

            if (baseCmd === 'cat') {
                const target = args[1];
                if (!target) {
                    setHistory((prev) => [...prev, { type: 'error', text: 'cat: missing operand' }]);
                    return;
                }
                const filePath = currentDir === '~' ? `~/${target}` : `${currentDir}/${target}`;
                const node = fileSystem[filePath];
                if (node && node.type === 'file') {
                    await typeOutput(node.content);
                    setHistory((prev) => [...prev, { type: 'output', text: node.content }]);
                } else if (node && node.type === 'dir') {
                    setHistory((prev) => [...prev, { type: 'error', text: `cat: ${target}: Is a directory` }]);
                } else {
                    setHistory((prev) => [...prev, { type: 'error', text: `cat: ${target}: No such file or directory` }]);
                }
                return;
            }
        }

        const errorMsg = `Command not found: ${baseCmd}. Type "help" for available commands.`;
        setHistory((prev) => [...prev, { type: 'error', text: errorMsg }]);
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
                className={`terminal-body h-[350px] overflow-y-auto cursor-text transition-all duration-500 ${matrixMode ? 'bg-[#001100] text-[#00ff00]' : ''}`}
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((line, i) => (
                    <div key={i} className="mb-1">
                        {line.type === 'input' && (
                            <div>
                                <span className={matrixMode ? "text-[#00ff00]" : "text-neon-blue"}>siva@kali</span>
                                <span className={matrixMode ? "text-[#00ff00]" : "text-gray-500"}>:</span>
                                <span className={matrixMode ? "text-[#00ff00]" : "text-neon-purple"}>{line.dir || '~'}</span>
                                <span className={matrixMode ? "text-[#00ff00]" : "text-gray-500"}>$ </span>
                                <span className={matrixMode ? "text-[#00ff00] font-bold" : "text-gray-200"}>{line.text}</span>
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
                        <span className={matrixMode ? "text-[#00ff00]" : "text-neon-blue"}>siva@kali</span>
                        <span className={matrixMode ? "text-[#00ff00]" : "text-gray-500"}>:</span>
                        <span className={matrixMode ? "text-[#00ff00]" : "text-neon-purple"}>{currentDir}</span>
                        <span className={matrixMode ? "text-[#00ff00]" : "text-gray-500"}>$ </span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className={`flex-1 bg-transparent outline-none font-mono text-sm caret-neon-green ml-1 ${matrixMode ? "text-[#00ff00]" : "text-gray-200"}`}
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
