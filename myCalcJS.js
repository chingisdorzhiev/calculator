let x = "";
let y = "";
let sign = "";
let sign2 = "";
let finish = false;

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const actions = ["+", "-", "X", "/"];
const outTop = document.querySelector(".calc-screen-top");
const outBot = document.querySelector(".calc-screen-bot");

function clearAll() {
  x = "";
  y = "";
  sign = "";
  sign2 = "";
  finish = false;
  outTop.textContent = "";
  outBot.textContent = "0";
}

function changeFontSize(screen) {
  if (screen.textContent.length < 7) {
    screen.style.fontSize = "4rem";
  } else if (screen.textContent.length == 7) {
    screen.style.fontSize = "3.5rem";
  } else if (screen.textContent.length == 8) {
    screen.style.fontSize = "3rem";
  } else if (screen.textContent.length >= 9) {
    screen.style.fontSize = "2.5rem";
  }

  return;
}

// не используется
// function setDecimalSign(screen) {
//   if (+screen.textContent >= 1000) {
//     let pos = Math.floor(+screen.textContent / 1000).toString().length;
//     let str = "";
//     str = `${screen.textContent.slice(0, pos)}'${screen.textContent.slice(
//       pos
//     )}`;
//     if (+screen.textContent >= 1e6) {
//       str = `${str.slice(0, pos - 3)}'${str.slice(pos - 3)}`;
//       if (+screen.textContent >= 1e9) {
//         str = `${str.slice(0, pos - 6)}'${str.slice(pos - 6)}`;
//       }
//     }
//     screen.textContent = str;
//   }
//   return;
// }

function setBotFormat(screen) {
  if (+screen.textContent && Math.abs(+screen.textContent) >= 1) {
    let str;
    str = (+screen.textContent).toLocaleString();
    if (Math.abs(+screen.textContent) >= 1e11) {
      str = (+screen.textContent).toLocaleString("en-US", {
        notation: "engineering",
      });
    }
    screen.textContent = str;
  }

  if (Math.abs(+screen.textContent) < 1 && screen.textContent.length > 11) {
    screen.textContent = (+screen.textContent).toFixed(11);
  }
}

function setTopFormat(x, y, sign, key) {
  let str1 = +x;
  let str2 = +y;
  if (Math.abs(+x) >= 1) {
    str1 = (+x).toLocaleString();
    if (Math.abs(+x) >= 1e11) {
      str1 = (+x).toLocaleString("en-US", {
        notation: "engineering",
      });
    }
  }
  if (Math.abs(+y) >= 1) {
    str2 = (+y).toLocaleString();
    if (Math.abs(+y) >= 1e11) {
      str2 = (+y).toLocaleString("en-US", {
        notation: "engineering",
      });
    }
  }

  if (Math.abs(str1) < 1 && `${str1}`.length > 11) {
    str1 = str1.toFixed(11);
  }

  if (Math.abs(str2) < 1 && `${str2}`.length > 11) {
    str2 = str2.toFixed(11);
  }

  outTop.textContent = `${str1} ${sign} ${str2}`;
  if (finish) {
    outTop.textContent = `${str1}`;
  }
  if (y === "" || (finish && actions.includes(key))) {
    outTop.textContent = `${str1} ${sign}`;
  }
}

document.querySelector(".calc").onclick = (event) => {
  if (event.target.classList.contains("ac")) clearAll();
  if (!event.target.classList.contains("btn")) return;

  let key = event.target.textContent;

  if (digits.includes(key)) {
    // ограничение на кол-во цифр
    if (outBot.textContent.length > 12) {
      return;
    }

    // обработка ведущего нуля
    if (outBot.textContent === "0" && key === "0") return;

    // обработка ведущего минуса
    if (x === "" && y === "" && sign === "-") {
      x = sign;
      sign = "";
      outBot.textContent = x;
    }

    // отображение в экранах и запись чисел в переменные
    if (y === "" && sign === "") {
      if (outBot.textContent === "0" && key === ".") {
        x = "0";
      }
      x += key;
      outBot.textContent = x;
    } else if (x !== "" && y !== "" && finish) {
      y = key;
      outBot.textContent = y;
      finish = false;
    } else {
      if (outBot.textContent === "0" && key === ".") {
        y = "0";
      }
      y += key;
      outBot.textContent = y;
    }
  }

  // операции

  if (actions.includes(key)) {
    if (x !== "" && y !== "" && sign && !finish) {
      sign2 = key;
      key = "=";
    } else {
      sign = key;
      outBot.textContent = sign;
    }
  }

  // вычисления
  if (key === "=") {
    if (y === "") {
      y = x;
    }
    switch (sign) {
      case "+":
        x = +x + +y;
        break;
      case "-":
        x = +x - +y;
        break;
      case "X":
        x = +x * +y;
        break;
      case "/":
        if (y === "0") {
          x = "";
          y = "";
          sign = "";
          outBot.textContent = "Error";
          return;
        }
        x = +x / +y;
        break;
    }
    finish = true;
    outBot.textContent = x;
    if (sign2) {
      sign = sign2;
      sign2 = null;
    }
  }

  // знак плюс-минус

  if (key === "+/-") {
    if (y === "" && sign === "") {
      x = -+x;
      outBot.textContent = x;
    } else {
      y = -+y;
      outBot.textContent = y;
    }
  }

  // знак процента

  if (key === "%") {
    if (sign === "X") {
      y = +y / 100;
      x = +x * +y;
    }
    if (sign === "+") {
      y = +x * (+y / 100);
      x = +x + +y;
    }
    if (sign === "-") {
      y = +x * (+y / 100);
      x = +x - +y;
    }
    finish = true;
    outBot.textContent = x;
  }

  setBotFormat(outBot);
  setTopFormat(x, y, sign, key);
  changeFontSize(outBot);

  return;
};
