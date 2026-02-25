var flickersPerSecond;

const instructionsText = `Welcome to the Dreamachine!<br /><br />
WARNING: Before you begin, please note that flickering lights may trigger seizures due to photosensitive epilepsy. Please do not use Dreamachine if you have reason to believe this condition applies to you or anyone around you.<br /><br />
Instructions<br /><br />
Increase screen brightness to the highest setting.<br />
Optional: set flickersPerSecond to a value between 8 (default) and 13, inclusive via the <a target="_blank" href="https://developer.chrome.com/docs/devtools/console/javascript">browser console</a>.<br />
Press "Start".<br />
Close your eyes.<br />
Click or tap the screen to end.<br />
Learn more on <a target="_blank" href="https://en.wikipedia.org/wiki/Dreamachine">Wikipedia</a>.
`;

const getInstructions = () => {
  const instructions = document.createElement("div");
  instructions.style.maxWidth = "600px";
  instructions.style.margin = "20px auto";
  instructions.style.fontSize = "2em";


  const instructionsInner1 = document.createElement("div");
  instructionsInner1.innerHTML = instructionsText;

  const instructionsbutton = document.createElement("button");
  instructionsbutton.style.margin = "20px auto";
  instructionsbutton.style.width = "100%";
  instructionsbutton.textContent = "Start";
  instructionsbutton.style.backgroundColor = "#0c761d";
  instructionsbutton.style.fontSize = "3em";
  instructionsbutton.style.color = "white";
  instructionsbutton.style.padding = "40px";
  instructionsbutton.style.borderRadius = "10px";
  instructionsbutton.style.border = "0 black solid";
  const setShowInstructions = (isShow) => {
    instructions.style.display = isShow ? "block" : "none";
  }  
  instructions.appendChild(instructionsInner1);
  instructions.appendChild(instructionsbutton);

  return {instructions, instructionsbutton, setShowInstructions};
};

const getMachineButton = () => {
  const machineButton = document.createElement("button");
  machineButton.style.position = "absolute";
  machineButton.style.width = "100%";
  machineButton.style.height = "100vh";
  machineButton.style.border = "0 black solid";
  machineButton.style.display = "none";
  machineButton.style.background = "#000000";
  const setShowMachineButton = (isShow) => {
    if (isShow) {
      setAnimate(machineButton);
      machineButton.style.display = "block";
      return;
    }
    machineButton.style.display = "none";
  }
  machineButton.addEventListener("click", () => {
    setShowMachineButton(false);
    document.exitFullscreen();
  });

  return {machineButton, setShowMachineButton};
};

const setAnimate = (machineButton) => {
  const lowerUpperLimit = [8, 13];
  const flickers = (flickersPerSecond || lowerUpperLimit[0]);
  const rate =  (1000 / flickers) * 4;
  const clips = [.66, .33, 0];
  let clipIndex = 0;
  const getTransition = (percentage, opacity, clipIndex) => ({
      background: `linear-gradient(to right, black, white, black) ${percentage}%/90% 100% no-repeat`,
      opacity: opacity,
      clipPath: `xywh(0 ${clips[clipIndex % clips.length] * 100}% 100% 45%)`
    });
  const colorTransition = [
    getTransition(200, 0, clipIndex),
    getTransition(200, 1, clipIndex),
    getTransition(0, .8, clipIndex),
    getTransition(-200, 0, clipIndex++),
    getTransition(200, 0, clipIndex),
    getTransition(200, 1, clipIndex),
    getTransition(0, .8, clipIndex),
    getTransition(-200, 0, clipIndex++),
    getTransition(200, 0, clipIndex),
    getTransition(200, 1, clipIndex),
    getTransition(0, .8, clipIndex),
    getTransition(-200, 0, clipIndex++),
  ];
  const timing = {
    duration: rate,
    iterations: Infinity,
  };
  
  machineButton.animate(colorTransition, timing);
};

const setProxy = (
  instructionsbutton,
  machineButton,
  setShowInstructions,
  setShowMachineButton
) => {
  const props = {
    showMachine: false,
  };

  const handler = {
    set: function (target, prop, isShowMachine) {
        setShowMachineButton(isShowMachine);
        setShowInstructions(!isShowMachine);
      target[prop] = isShowMachine;
      return true;
    }
  }

  const proxy = new Proxy(props, handler);
  instructionsbutton.addEventListener("click", () => {
    proxy.showMachine = true;
    machineButton.requestFullscreen?.();
  });
  machineButton.addEventListener("click", () => proxy.showMachine = false);

  return proxy;
};

const load = () => {
  const body = document.getElementsByTagName("body")[0];
  body.style.margin = 0;

  const root = document.getElementById("root");

  const {
    machineButton,
    setShowMachineButton
  } = getMachineButton();
  const {
    instructions,
    instructionsbutton,
    setShowInstructions
  } = getInstructions();

  setProxy(
    instructionsbutton,
    machineButton,
    setShowInstructions,
    setShowMachineButton
  );

  root.appendChild(instructions);
  root.appendChild(machineButton);
}

addEventListener("load", load);
