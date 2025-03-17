let trails = [];
let userText = "";
let textWeight = 1;

function setup() {
  createCanvas(1920, 1080);
  background(0);
  textAlign(LEFT, CENTER);
}

function draw() {
  background(0);
  
  // 说明文字
  fill(255);
  textSize(20);
  text("This website is a Dynamic Neon Text Effect Generator", 20, 30);
  text("Type with the keyboard (English only)", 20, 60);
  text("Backspace: Delete | Enter: New Line", 20, 90);
  text("↑ / ↓: Adjust text weight", 20, 120);

  // 添加新的轨迹点
  if (userText.length > 0) {
    let angle = radians(random(6, 10)) * (random(1) > 0.5 ? 1 : -1);
    let fontSize = random(50, 70);
    trails.push(new Trail(mouseX, mouseY, angle, millis(), userText, fontSize));
  }

  // 绘制轨迹
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    if (millis() - t.timestamp > 3000) {
      trails.splice(i, 1);
    } else {
      t.display(i, trails.length);
    }
  }
}

class Trail {
  constructor(x, y, angle, timestamp, text, fontSize) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.timestamp = timestamp;
    this.text = text;
    this.fontSize = fontSize;
  }

  display(index, total) {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    let lerpFactor = map(index, 0, total, 0, 1);
    let colors = ["#3C21B7", "#8B63DA", "#CB98ED", "#CFCBD2"];
    let lerpedColor = lerpColor(
      color(colors[floor(lerpFactor * (colors.length - 1))]),
      color(colors[ceil(lerpFactor * (colors.length - 1))]),
      lerpFactor * (colors.length - 1) % 1
    );

    let letterSpacing = -15;
    let xOffset = -textWidth(this.text) / 2 + (letterSpacing * (this.text.length - 1)) / 2;

    // 弥散光效果 + 文字粗细
    for (let blurSize = 10; blurSize > 0; blurSize -= 2) {
      fill(lerpedColor.levels[0], lerpedColor.levels[1], lerpedColor.levels[2], map(blurSize, 10, 0, 50, 255));
      textSize(this.fontSize + blurSize * 0.5);
      for (let i = 0; i < this.text.length; i++) {
        text(this.text.charAt(i), xOffset + i * (textWidth(this.text.charAt(i)) + letterSpacing), 0);
      }
    }

    for (let w = 0; w < textWeight; w++) {
      fill(lerpedColor);
      textSize(this.fontSize);
      for (let i = 0; i < this.text.length; i++) {
        text(this.text.charAt(i), xOffset + i * (textWidth(this.text.charAt(i)) + letterSpacing), 0);
      }
    }

    pop();
  }
}

// 键盘输入（限制英文）
function keyPressed() {
  if (keyCode === BACKSPACE) {
    userText = userText.slice(0, -1);
  } else if (keyCode === ENTER || keyCode === RETURN) {
    userText += "\n";
  } else if (key.length === 1 && /^[a-zA-Z ]$/.test(key)) {
    userText += key;
  }
}

// 文字粗细调整
function keyReleased() {
  if (keyCode === UP_ARROW) {
    textWeight = constrain(textWeight + 1, 1, 10);
  } else if (keyCode === DOWN_ARROW) {
    textWeight = constrain(textWeight - 1, 1, 10);
  }
}
