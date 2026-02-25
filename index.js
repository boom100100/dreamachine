const instructionsText = `Welcome to the Dreamachine!<br /><br />
WARNING: Before you begin, please note that flickering lights may trigger seizures due to photosensitive epilepsy. Please do not use Dreamachine if you have reason to believe this condition applies to you or anyone around you.<br /><br />
Instructions<br /><br />
Increase screen brightness to the highest setting.<br />
Optional: set frequency to a value between 1 and 20, inclusive (default: 7).<br />
Optional: set style to "strobe" (default) or "rotating".<br />
Press "Start".<br />
Close your eyes.<br />
Click or tap the screen to end.<br /><br />
Learn more on <a target="_blank" href="https://en.wikipedia.org/wiki/Dreamachine">Wikipedia</a>.<br /><br />
`;

const getInstructions = () => {
  const br = document.createElement("br");
  const instructions = document.createElement("div");
  instructions.style.maxWidth = "600px";
  instructions.style.margin = "20px auto";
  instructions.style.fontSize = "2em";

  const instructionsInner1 = document.createElement("div");
  instructionsInner1.innerHTML = instructionsText;

  const flickerRangeInput = document.createElement("input");
  const flickerRangeInputLabel = document.createElement("label");
  flickerRangeInput.id = "Frequency";
  flickerRangeInputLabel.for = flickerRangeInput.id;
  flickerRangeInputLabel.textContent = flickerRangeInput.id;
  flickerRangeInput.type = "range";
  flickerRangeInput.min = 1;
  flickerRangeInput.value = 7;
  flickerRangeInput.max = 20;
  
  const flavorSelect = document.createElement("select");
  flavorSelect.id = "Style";
  const flavorSelectLabel = document.createElement("label");
  flavorSelectLabel.for = flavorSelect.id;
  flavorSelectLabel.textContent = flavorSelect.id;
  const flavorSelectOptions = [
    document.createElement("option"),
    document.createElement("option"),
  ];
  flavorSelectOptions[0].value = "STROBE";
  flavorSelectOptions[1].value = "ROTATING";
  flavorSelectOptions[0].innerText = "strobe";
  flavorSelectOptions[1].innerText = "rotating";

  flavorSelect.appendChild(flavorSelectOptions[0]);
  flavorSelect.appendChild(flavorSelectOptions[1]);

  flickerRangeInput.addEventListener("change", (e) => {
    flickersPerSecond = e.target.value;
  });
  flavorSelect.addEventListener("change", (e) => flavor = e.target.value);

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
  instructions.appendChild(flickerRangeInputLabel);
  instructions.appendChild(flickerRangeInput);
  instructions.appendChild(br);
  instructions.appendChild(flavorSelectLabel);
  instructions.appendChild(flavorSelect);
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
    machineButton.getAnimations().map(animation => animation.cancel());
    intervals.forEach(interval => clearInterval(interval));
    setAnimate(machineButton);
    machineButton.style.display = isShow ? "block" : "none";
  }
  machineButton.addEventListener("click", () => {
    setShowMachineButton(false);
    document.exitFullscreen();
  });

  return {machineButton, setShowMachineButton};
};

const setAnimate = (machineButton) => {
  let rate;
  switch (flavor) {
    case "ROTATING":
      rate =  (1000 / flickersPerSecond) * 4;
      
      const clips = [.4, .2, 0];
      let clipIndex = 0;
      const getTransition = (percentage, opacity, clipIndex) => ({
          background: `linear-gradient(to right, black, white, black) ${percentage}%/90% 100% no-repeat`,
          opacity: opacity,
          clipPath: `xywh(0 ${clips[clipIndex % clips.length] * 100}% 100% 70%)`
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
      return [-1, -1];
    case "STROBE":
      rate = (1000 / flickersPerSecond);
      const delay = rate / 2;
      intervals.length = 0;
      setTimeout(() => {
        intervals.push(
          setInterval(() => machineButton.style.backgroundColor = "white", rate)
        );
      }, 0);
      setTimeout(() => {
        intervals.push(
          setInterval(() => machineButton.style.backgroundColor = "black", rate)
        );
      }, delay);
      return intervals;
  }
};

const setShowMachine = (
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

  setShowMachine(
    instructionsbutton,
    machineButton,
    setShowInstructions,
    setShowMachineButton
  );

  root.appendChild(instructions);
  root.appendChild(machineButton);
}

let flickersPerSecond = 7;
let flavor = "STROBE";
const intervals = [];
addEventListener("load", load);
