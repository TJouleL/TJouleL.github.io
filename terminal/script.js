/*This code was written by TJouleL on github*/


function initMatrixBackground() {
    const canvas = document.getElementById('matrix-background');
    const ctx = canvas.getContext('2d');
  
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  
    const letters = '01';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(0);
  
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;
  
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
  
            drops[i]++;
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.999) {
                drops[i] = 0;
            }
        }
    }
    setInterval(draw, 33);
  }


class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('command-input');
        this.commands = {};
        
        this.setupEventListeners();
        this.showPrompt();
        this.print("TJoulesL [Version 2.0.0]\n(c) Some Corporation. All rights reserved.\n\n")
    }

    setupEventListeners() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            }
        });
    }

    showPrompt() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    executeCommand() {
        const commandLine = this.input.value.trim();
        if (!commandLine) return;

        const parts = commandLine.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        this.print(`C:\\Windoves\\system32> ${commandLine}\n`);

        if (this.commands[command]) {
            this.commands[command](args);
        } else {
            this.print(`'${command}' is not recognized as an internal or external command,
operable program or batch file. (Try using 'help')\n`);
        }
        this.print('\n')

        this.input.value = '';
        
        this.showPrompt();
    }

    print(text) {
        this.output.textContent += text;
    }

    addCommand(name, callback) {
        this.commands[name] = callback;
    }
}

// initialize terminal
const term = new Terminal();
initMatrixBackground();


term.addCommand('help', (args) => {
    term.print(`ping            : pongs back
clear           : clears the terminal
version         : displays the version of the terminal\n`)
});
term.addCommand('ping', (args) => {
    term.print("pong\n");
});
term.addCommand('clear', (args) => {
    term.output.textContent = 'C:\\Windoves\\system32> clear\n';
    term.showPrompt();
});
term.addCommand('version', (args) => {
    term.print("Terminal version v2.0.0, Made by TJouleL on github (https://www.github.com/TJouleL)\n")
});