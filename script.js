document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    let listening = false;
    let voices = [];
    let currentVoice = null;

    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support the Web Speech API');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        output.textContent = 'Listening...';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        output.textContent = `You said: ${transcript}`;
        console.log(`You said: ${transcript}`);
        respondToCommand(transcript);
    };

    recognition.onerror = (event) => {
        output.textContent = `Error occurred: ${event.error}`;
        console.error(`Error occurred: ${event.error}`);
    };

    recognition.onend = () => {
        output.textContent += ' Listening stopped.';
        if (listening) {
            recognition.start();
        }
    };

    function setJarvisVoice() {
        voices = window.speechSynthesis.getVoices();
        currentVoice = voices.find(voice => voice.name.includes('Daniel')) || voices[0];
    }

    function respondToCommand(command) {
        const speech = new SpeechSynthesisUtterance();
        speech.lang = 'en-US';
        speech.voice = currentVoice;
        const lowerCaseCommand = command.toLowerCase();

        if (lowerCaseCommand.includes('hello')) {
            speech.text = 'Hello! How can I assist you today?';
        } else if (lowerCaseCommand.includes('time')) {
            const now = new Date();
            speech.text = `The current time is ${now.toLocaleTimeString()}`;
        } else if (lowerCaseCommand.includes('date')) {
            const today = new Date();
            speech.text = `Today's date is ${today.toLocaleDateString()}`;
        } else if (lowerCaseCommand.includes('stop jarvis')) {
            stopRecognition();
            speech.text = 'Listening stopped.';
        } else if (lowerCaseCommand.includes('how are you')) {
            speech.text = 'Thank you for asking. I am functioning within normal parameters.';
        } else if (lowerCaseCommand.includes('weather')) {
            speech.text = 'The weather today is sunny with a temperature of 25 degrees Celsius.';
        } else if (lowerCaseCommand.includes('open google')) {
            console.log('Opening Google');
            window.open('https://www.google.com', '_blank');
            speech.text = 'Opening Google';
        } else if (lowerCaseCommand.includes('open youtube')) {
            console.log('Opening YouTube');
            window.open('https://www.youtube.com', '_blank');
            speech.text = 'Opening YouTube';
        } else if (lowerCaseCommand.startsWith('search for')) {
            const query = lowerCaseCommand.substring(10).trim();
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            speech.text = `Searching Google for ${query}`;
        } else if (lowerCaseCommand.startsWith('youtube for')) {
            const query = lowerCaseCommand.substring(11).trim();
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
            speech.text = `Searching YouTube for ${query}`;
        } else if (lowerCaseCommand.startsWith('play ')) {
            const songName = lowerCaseCommand.substring(5).trim();
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(songName)}`, '_blank');
            speech.text = `Playing ${songName} on YouTube`;
        } else if (lowerCaseCommand.includes('tell me a joke')) {
            speech.text = 'Why did the scarecrow win an award? Because he was outstanding in his field!';
        } else if (lowerCaseCommand.includes('news')) {
            fetchNewsHeadlines().then(headlines => {
                speech.text = `Here are the latest news headlines: ${headlines}`;
                window.speechSynthesis.speak(speech);
            });
            return;
        } else if (lowerCaseCommand.includes('quote')) {
            speech.text = 'The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt';
        } else if (lowerCaseCommand.startsWith('change voice to ')) {
            const voiceName = lowerCaseCommand.substring(16).trim();
            const selectedVoice = voices.find(voice => voice.name.toLowerCase().includes(voiceName.toLowerCase()));
            if (selectedVoice) {
                currentVoice = selectedVoice;
                speech.text = `Voice changed to ${selectedVoice.name}`;
            } else {
                speech.text = `Voice not found: ${voiceName}`;
            }
        } else {
            speech.text = 'I am not sure how to respond to that.';
        }

        window.speechSynthesis.speak(speech);
    }

    async function fetchNewsHeadlines() {
        const response = await fetch('https://api.example.com/news'); // Replace with a real news API endpoint
        const data = await response.json();
        return data.articles.map(article => article.title).join('. ');
    }

    function stopRecognition() {
        recognition.stop();
        listening = false;
    }

    document.addEventListener('click', (event) => {
        if (event.detail === 3) {
            listening = true;
            recognition.start();
        }
    });

    setJarvisVoice();

    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = setJarvisVoice;
    }
});
