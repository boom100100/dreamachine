const instructionsText = `Welcome to the Dreamachine!<br /><br />
WARNING: Before you begin, please note that flickering lights may trigger seizures due to photosensitive epilepsy. Please do not use Dreamachine if you have reason to believe this condition applies to you.<br /><br />
Instructions<br /><br />
Increase screen brightness to the highest setting.<br />
Press "Start".<br />
Close your eyes.<br />
Click or tap the screen to end.<br />
Learn more on <a href="https://en.wikipedia.org/wiki/Dreamachine">Wikipedia</a>.
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
  machineButton.style.backgroundColor = "black";
  const setShowMachineButton = (isShow) => {
      machineButton.style.display = isShow ? "block" : "none";
  }
  machineButton.addEventListener("click", () => {
    setShowMachineButton(false);
    document.exitFullscreen();
  });
  const lowerUpperLimit = [8, 13];
  const rate =  1000 / lowerUpperLimit[0]; // 8 times per second
  const delay = 50;
  setTimeout(() => {
    setInterval(() => machineButton.style.backgroundColor = "white", rate);
  }, 0);
  setTimeout(() => {
    setInterval(() => machineButton.style.backgroundColor = "black", rate);
  }, delay);

  return {machineButton, setShowMachineButton};
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
