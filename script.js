document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");

  let voices = [];
  let currentVoice = null;

  let isListening = false;
  let wakeWordMode = true;
  let jarvisAwake = false;
  let awakeTimeout = null;

  let jarvisActivated = false;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition API");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

 
  function speak(text) {
    if (!text) return;

    if (!currentVoice) setJarvisVoice();

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.voice = currentVoice;
    speech.rate = 1;
    speech.pitch = 1;

    output.textContent = `Jarvis: ${text}`;
    window.speechSynthesis.speak(speech);
  }

  
  function setJarvisVoice() {
    voices = window.speechSynthesis.getVoices();

    currentVoice =
      voices.find((v) => v.name.toLowerCase().includes("daniel")) ||
      voices.find((v) => v.name.toLowerCase().includes("google")) ||
      voices.find((v) => v.lang.toLowerCase().includes("en")) ||
      voices[0];

    console.log("Voice Selected:", currentVoice?.name);
  }


  function setAwakeForSeconds(seconds = 8) {
    jarvisAwake = true;

    if (awakeTimeout) clearTimeout(awakeTimeout);

    awakeTimeout = setTimeout(() => {
      jarvisAwake = false;
      output.textContent = "Jarvis: (Waiting for wake word...)";
    }, seconds * 1000);
  }

  function respondToCommand(command) {
    const cmd = command.toLowerCase().trim();

    
    if (cmd.includes("stop speaking") || cmd.includes("quiet")) {
      window.speechSynthesis.cancel();
      output.textContent = "Jarvis: Okay, I stopped speaking.";
      return;
    }

    if (cmd.includes("stop jarvis") || cmd.includes("sleep jarvis")) {
      isListening = false;
      recognition.stop();
      speak("Okay sir. Going to sleep.");
      return;
    }

    if (cmd.includes("start jarvis") || cmd.includes("wake up jarvis")) {
      if (!isListening) {
        isListening = true;
        recognition.start();
      }
      speak("I am online sir.");
      return;
    }

    if (cmd.includes("time")) {
      speak(`The current time is ${new Date().toLocaleTimeString()}`);
      return;
    }

    if (cmd.includes("date")) {
      speak(`Today's date is ${new Date().toLocaleDateString()}`);
      return;
    }

    if (cmd.includes("hello") || cmd.includes("hi")) {
      speak("Hello sir. How can I help you?");
      return;
    }

    if (cmd.includes("how are you")) {
      speak("I am working perfectly sir.");
      return;
    }

    if (cmd.includes("your name")) {
      speak("My name is Jarvis. Your personal assistant.");
      return;
    }

    if (cmd.includes("who made you") || cmd.includes("who created you")) {
      speak("I was created by Nitesh Pandey sir.");
      return;
    }


    if (cmd.includes("joke")) {
      const jokes = [
        "Why did the programmer quit his job? Because he didn’t get arrays.",
        "Why do Java developers wear glasses? Because they don’t C sharp.",
        "What is a programmer’s favorite place? The function room.",
        "I told my computer I needed a break, and it said no problem, I’ll go to sleep.",
        "Debugging is like being a detective in a crime movie where you are also the criminal.",
      ];
      speak(jokes[Math.floor(Math.random() * jokes.length)]);
      return;
    }

    
    if (cmd.includes("open google")) {
      window.open("https://www.google.com", "_blank");
      speak("Opening Google.");
      return;
    }

    if (cmd.includes("open youtube")) {
      window.open("https://www.youtube.com", "_blank");
      speak("Opening YouTube.");
      return;
    }

    if (cmd.includes("open instagram")) {
      window.open("https://www.instagram.com", "_blank");
      speak("Opening Instagram.");
      return;
    }

    if (cmd.includes("open facebook")) {
      window.open("https://www.facebook.com", "_blank");
      speak("Opening Facebook.");
      return;
    }

    if (cmd.includes("open whatsapp")) {
      window.open("https://web.whatsapp.com", "_blank");
      speak("Opening WhatsApp Web.");
      return;
    }

    if (cmd.includes("open gmail")) {
      window.open("https://mail.google.com", "_blank");
      speak("Opening Gmail.");
      return;
    }

    if (cmd.includes("open github")) {
      window.open("https://github.com", "_blank");
      speak("Opening GitHub.");
      return;
    }

    if (cmd.includes("open chatgpt")) {
      window.open("https://chat.openai.com", "_blank");
      speak("Opening ChatGPT.");
      return;
    }

    if (cmd.startsWith("search for ")) {
      const query = cmd.replace("search for", "").trim();
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank"
      );
      speak(`Searching Google for ${query}`);
      return;
    }

    if (cmd.startsWith("youtube search ")) {
      const query = cmd.replace("youtube search", "").trim();
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          query
        )}`,
        "_blank"
      );
      speak(`Searching YouTube for ${query}`);
      return;
    }

  
    if (cmd.includes("play music")) {
      window.open("https://www.youtube.com/watch?v=5qap5aO4i9A", "_blank");
      speak("Playing music on YouTube.");
      return;
    }

    if (cmd.startsWith("play song ")) {
      const song = cmd.replace("play song", "").trim();
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          song
        )}`,
        "_blank"
      );
      speak(`Playing ${song} on YouTube.`);
      return;
    }

    if (cmd.startsWith("calculate ")) {
      try {
        const expression = cmd.replace("calculate", "").trim();
        const result = eval(expression);
        speak(`The answer is ${result}`);
      } catch (err) {
        speak("Sorry sir, I could not calculate that.");
      }
      return;
    }

   
    if (cmd.includes("battery")) {
      if (navigator.getBattery) {
        navigator.getBattery().then((battery) => {
          const percent = Math.round(battery.level * 100);
          speak(`Battery is at ${percent} percent.`);
        });
      } else {
        speak("Sorry sir, battery information is not supported in this browser.");
      }
      return;
    }

    if (cmd.includes("scroll down")) {
      window.scrollBy({ top: 600, behavior: "smooth" });
      speak("Scrolling down.");
      return;
    }

    if (cmd.includes("scroll up")) {
      window.scrollBy({ top: -600, behavior: "smooth" });
      speak("Scrolling up.");
      return;
    }

    if (cmd.includes("go to top")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      speak("Going to top.");
      return;
    }

   
    if (cmd.includes("dark mode")) {
      document.body.style.background = "#000";
      document.body.style.color = "#00ffff";
      speak("Dark mode enabled sir.");
      return;
    }

    if (cmd.includes("light mode")) {
      document.body.style.background = "#fff";
      document.body.style.color = "#000";
      speak("Light mode enabled sir.");
      return;
    }


    if (cmd.includes("full screen") || cmd.includes("fullscreen")) {
      document.documentElement.requestFullscreen?.();
      speak("Fullscreen enabled sir.");
      return;
    }

    if (cmd.includes("exit full screen") || cmd.includes("exit fullscreen")) {
      document.exitFullscreen?.();
      speak("Fullscreen disabled sir.");
      return;
    }

    if (cmd.includes("refresh")) {
      speak("Refreshing the page sir.");
      location.reload();
      return;
    }

    if (cmd.includes("go back")) {
      speak("Going back sir.");
      history.back();
      return;
    }

    if (cmd.includes("go forward")) {
      speak("Going forward sir.");
      history.forward();
      return;
    }

    if (cmd.includes("tell me a fact")) {
      const facts = [
        "Honey never spoils. It can last thousands of years.",
        "Octopuses have three hearts.",
        "Bananas are berries, but strawberries are not.",
        "The human brain uses about 20 percent of the body's energy.",
        "Sharks existed before trees on Earth.",
      ];
      speak(facts[Math.floor(Math.random() * facts.length)]);
      return;
    }

    if (cmd.includes("weather")) {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
      speak("Opening weather information.");
      return;
    }

   
    if (cmd.startsWith("where is ")) {
      const place = cmd.replace("where is", "").trim();
      window.open(
        `https://www.google.com/maps/search/${encodeURIComponent(place)}`,
        "_blank"
      );
      speak(`Showing location of ${place}`);
      return;
    }

    if (cmd.startsWith("note ")) {
      const note = cmd.replace("note", "").trim();
      localStorage.setItem("jarvis_note", note);
      speak("Note saved sir.");
      return;
    }

    if (cmd.includes("show note")) {
      const saved = localStorage.getItem("jarvis_note");
      speak(saved ? `Your note is: ${saved}` : "No note saved sir.");
      return;
    }

    if (cmd.includes("clear note")) {
      localStorage.removeItem("jarvis_note");
      speak("Your note has been cleared sir.");
      return;
    }

    speak("I did not understand. I can search it on Google.");
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(cmd)}`,
      "_blank"
    );
  }

  recognition.onstart = () => {
    output.textContent = "🎙️ Listening...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    const lower = transcript.toLowerCase().trim();

    output.textContent = `You said: ${transcript}`;

    if (wakeWordMode) {
      if (!jarvisAwake) {
        if (lower.includes("jarvis")) {
          speak("Yes sir?");
          setAwakeForSeconds(10);
        }
        return;
      } else {
        setAwakeForSeconds(10);
        respondToCommand(transcript);
        return;
      }
    }

    respondToCommand(transcript);
  };

  recognition.onerror = (event) => {
    output.textContent = `Error: ${event.error}`;
    console.error("Speech Error:", event.error);
  };

  recognition.onend = () => {
    if (isListening) {
      recognition.start();
    }
  };

  function activateJarvis() {
    if (jarvisActivated) return;
    jarvisActivated = true;

    setJarvisVoice();

    isListening = true;
    recognition.start();

    speak("Jarvis activated. Say Jarvis to give me a command.");
  }

 
  document.addEventListener("click", activateJarvis);
  document.addEventListener("keydown", activateJarvis);

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = setJarvisVoice;
  }

  output.textContent = "Click anywhere to activate Jarvis...";
});
