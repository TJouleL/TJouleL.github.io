/*This code was written by TJouleL on github*/


function initMatrixBackground() {
    const canvas = document.getElementById('matrix-background');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size with validation
    function resizeCanvas() {
        // Ensure canvas dimensions are valid integers
        const width = Math.min(Math.max(100, window.innerWidth), 2000);
        const height = Math.min(Math.max(100, window.innerHeight), 1500);
        
        canvas.width = width;
        canvas.height = height;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix settings with validation
    const letters = '01';
    const fontSize = 16;
    
    // Calculate columns with safety checks
    const columns = Math.min(
        Math.max(1, Math.floor(canvas.width / fontSize)),
        200  // Maximum columns to prevent memory issues
    );
    
    // Create drops array safely
    const drops = new Array(columns).fill(0);
    
    // Animation function
    function draw() {
        // Create subtle fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw matrix characters
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {

            if (Math.random() > 0.1) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            }


            // move down and reset if needed
            drops[i]++;
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.999) {
                drops[i] = 0;
            }
        }
    }
    
    // Animation loop
    setInterval(draw, 20);
}
class LoadingScreen {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.resources = [];
        this.loadedCount = 0;
        this.totalResources = 0;
        this.audioElement = null;
        this.initialize();
    }

    initialize() {
        // create loading screen overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'loading-overlay';
        document.body.appendChild(this.overlay);

        // create loading text
        this.loadingText = document.createElement('div');
        this.loadingText.className = 'loading-text';
        this.loadingText.textContent = 'Loading...';
        this.overlay.appendChild(this.loadingText);

        // create continue button
        this.continueButton = document.createElement('button');
        this.continueButton.className = 'continue-button';
        this.continueButton.textContent = 'Click to Continue';
        this.continueButton.style.display = 'none';
        this.continueButton.onclick = () => this.startAudioAndContinue();
        this.overlay.appendChild(this.continueButton);
    }

    addResource(url, type = 'audio') {
        const resource = {
            url,
            type,
            loaded: false,
            buffer_filled: false,
            element: null,
            timeoutId: null
        };

        if (type === 'audio') {
            resource.element = new Audio();
            resource.element.src = url;
            
            // track download progress
            resource.element.addEventListener('progress', (event) => {
                if (!event) {
                    console.error('Progress event is undefined');
                    resource.buffer_filled = true;
                    this.checkProgress();
                    return;
                }

                // get the current progress from the audio element directly
                const audio = resource.element;
                
                if (audio.buffered.length > 0) {
                    const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
                    const duration = audio.duration || audio.seekable.end(0);
                    const percent = (bufferedEnd / duration) * 100;
                    
                    console.log(`Loaded ${Math.round(percent)}%`);
                    
                    if (percent >= 15.0) {
                        resource.buffer_filled = true;
                        this.checkProgress();
                    }
                }
            });
            
            
            // set timeout for stuck resources
            resource.timeoutId = setTimeout(() => {
                if (!resource.loaded && !resource.buffer_filled) {
                    console.warn(`Resource ${url} timed out, marking as complete`);
                    resource.loaded = true;
                    resource.buffer_filled = true;
                    this.checkProgress();
                }
            }, 10000); // 10 second timeout
            
            resource.element.addEventListener('canplaythrough', () => {
                clearTimeout(resource.timeoutId);
                resource.loaded = true;
                this.audioElement = resource.element;
                this.audioElement.loop = true;
                
                this.checkProgress();
            });
            
            resource.element.addEventListener('error', (e) => {
                clearTimeout(resource.timeoutId);
                console.error(`Failed to load ${url}:`, e);
                resource.loaded = true;
                resource.buffer_filled = true;
                this.checkProgress();
            });
        }

        this.resources.push(resource);
    }

    checkProgress() {
        const fullyLoaded = this.resources.every(r => 
            r.loaded && r.buffer_filled
        );
        
        if (fullyLoaded) {
            this.loadingText.textContent = 'Loaded! Click to continue...';
            this.continueButton.style.display = 'block';
        }
    }

    startAudioAndContinue() {
        this.audioElement.play()
        if (this.audioElement) {
            this.audioElement.play().catch(error => {
                console.error('Failed to start audio:', error);
            });
        } else {
            console.log("started background sound")
        }
        
        this.fadeOut();
    }


    stopAudio() {
        this.audioElement.stopAudio()
    }


    fadeOut() {
        this.overlay.style.opacity = '0';
        this.overlay.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            this.overlay.remove();
            if (typeof this.onComplete === 'function') {
                this.onComplete();
            }
        }, 500);
    }
}

class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('command-input');
        this.commands = {};
        
        this.setupEventListeners();
        this.showPrompt();
        this.print("TJoulesL [Version 1.0.0]\n(c) Some Corporation. All rights reserved.\n\n")
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
// create loading screen
const loadingScreen = new LoadingScreen(() => {
    initMatrixBackground(); // runs after loadingscreen has been loaded
});

loadingScreen.addResource('sounds/non-copyright-lofi-background-music.mp3', 'audio');


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
    term.print("Terminal version 1.0.0, Made by TJouleL on github (https://www.github.com/TJouleL)\n")
});

