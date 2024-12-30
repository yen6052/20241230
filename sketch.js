let sprites = {
  player1: {
    idle: { img: null, width: 87, height: 191, frames: 8 },
    walk: { img: null, width: 127, height: 195, frames: 8 },
    jump: { img: null, width: 140, height: 214, frames: 9 },
    attack: { img: null, width: 133, height: 177, frames: 9 } // 新增攻擊動作
  },
  player2: {
    idle: { img: null, width: 88, height: 191, frames: 8 },
    walk: { img: null, width: 177, height: 177, frames: 11 },
    jump: { img: null, width: 221, height: 185, frames: 12 },
    attack: { img: null, width: 223, height: 171, frames: 10 } // 新增攻擊動作
  },
  bullet: { img: null, width: 53, height: 36, frames: 8 }
};

let player1, player2;

function preload() {
  // 載入所有圖片...
    // 載入玩家1的精靈圖
    sprites.player1.idle.img = loadImage('player1_idle.png');
    sprites.player1.walk.img = loadImage('player1_walk.png');
    sprites.player1.jump.img = loadImage('player1_jump.png');
    sprites.player1.attack.img = loadImage('player1_attack.png');
    
    // 載入玩家2的精靈圖
    sprites.player2.idle.img = loadImage('player2_idle.png');
    sprites.player2.walk.img = loadImage('player2_walk.png');
    sprites.player2.jump.img = loadImage('player2_jump.png');
    sprites.player2.attack.img = loadImage('player2_attack.png');

  sprites.bullet.img = loadImage('bullet.png');
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 將角色放在畫面中間兩側
  player1 = new Character(windowWidth/2 - 300, windowHeight - 100, 'player1');
  player2 = new Character(windowWidth/2 + 300, windowHeight - 100, 'player2');
}

// 當視窗大小改變時調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新調整角色位置
  player1.y = windowHeight - 100;
  player2.y = windowHeight - 100;
}

function draw() {
  background(220);
  
  // 畫一條地板
  stroke(0);
  line(0, windowHeight - 20, windowWidth, windowHeight - 20);
  
  player1.update();
  player1.display();
  player2.update();
  player2.display();
}

class Character {
  constructor(x, y, playerType) {
    this.x = x;
    this.y = y;
    this.playerType = playerType;
    this.currentAction = 'idle';
    this.frameCount = 0;
    this.facingRight = (playerType === 'player2');
    
    // 物理相關參數
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 8; // 增加移動速度以適應大螢幕
    this.jumpForce = -20; // 增加跳躍高度
    this.gravity = 0.8;
    this.isOnGround = true;
  }
  
  update() {
    // 重力作用
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    
    // 地板碰撞檢測
    if (this.y > windowHeight - 100) {
      this.y = windowHeight - 100;
      this.velocityY = 0;
      this.isOnGround = true;
    }
    
    if (this.playerType === 'player1') {
      // 玩家1的控制：A,S,D
      if (keyIsDown(65)) { // A鍵
        this.velocityX = -this.speed;
        this.currentAction = 'walk';
        this.facingRight = false;
      } else if (keyIsDown(68)) { // D鍵
        this.velocityX = this.speed;
        this.currentAction = 'walk';
        this.facingRight = true;
      } else {
        this.velocityX = 0;
        this.currentAction = 'idle';
      }
      
      // S鍵跳躍
      if (keyIsDown(83) && this.isOnGround) {
        this.velocityY = this.jumpForce;
        this.isOnGround = false;
        this.currentAction = 'jump';
      }
    } else {
      // 玩家2的控制：J,K,L
      if (keyIsDown(74)) { // J鍵
        this.velocityX = -this.speed;
        this.currentAction = 'walk';
        this.facingRight = false;
      } else if (keyIsDown(76)) { // L鍵
        this.velocityX = this.speed;
        this.currentAction = 'walk';
        this.facingRight = true;
      } else {
        this.velocityX = 0;
        this.currentAction = 'idle';
      }
      
      // K鍵跳躍
      if (keyIsDown(75) && this.isOnGround) {
        this.velocityY = this.jumpForce;
        this.isOnGround = false;
        this.currentAction = 'jump';
      }
    }
    
    // 如果在空中，保持跳躍動作
    if (!this.isOnGround) {
      this.currentAction = 'jump';
    }
    
    // 更新位置
    this.x += this.velocityX;
    
    // 限制角色不會超出畫面
    this.x = constrain(this.x, 100, windowWidth - 100);
    
    this.frameCount++;
  }
  
  display() {
    let spriteInfo = sprites[this.playerType][this.currentAction];
    let currentFrame = floor(this.frameCount / 6) % spriteInfo.frames;
    
    push();
    translate(this.x, this.y);
    
    if (!this.facingRight) {
      scale(-1, 1);
    }
    
    image(
      spriteInfo.img,
      -spriteInfo.width/2,
      -spriteInfo.height/2,
      spriteInfo.width,
      spriteInfo.height,
      currentFrame * spriteInfo.width,
      0,
      spriteInfo.width,
      spriteInfo.height
    );
    
    pop();
  }
}

class Character {
  constructor(x, y, playerType) {
    // 原有的屬性...
    this.health = 100; // 新增生命值
    this.bullets = []; // 新增子彈陣列
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.hitCooldown = 0;
  }
  
  update() {
    // 原有的更新邏輯...
    
    // 更新冷卻時間
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.hitCooldown > 0) this.hitCooldown--;
    
    // 更新子彈
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update();
      // 移除超出畫面的子彈
      if (this.bullets[i].isOffScreen()) {
        this.bullets.splice(i, 1);
      }
    }
    
    // 檢查子彈碰撞
    this.checkBulletCollisions();
  }
  
  attack() {
    if (this.attackCooldown === 0) {
      this.isAttacking = true;
      this.currentAction = 'attack';
      this.shootBullet();
      this.attackCooldown = 30; // 攻擊冷卻時間
    }
  }
  
  shootBullet() {
    let bulletSpeed = this.facingRight ? 15 : -15;
    this.bullets.push(new Bullet(this.x, this.y - 50, bulletSpeed));
  }
  
  checkBulletCollisions() {
    let opponent = this.playerType === 'player1' ? player2 : player1;
    
    for (let bullet of opponent.bullets) {
      if (this.hitCooldown === 0 && this.checkCollision(bullet)) {
        this.health -= 10; // 被擊中扣 10 血
        this.hitCooldown = 30; // 受傷無敵時間
        // 移除擊中的子彈
        opponent.bullets.splice(opponent.bullets.indexOf(bullet), 1);
      }
    }
  }
  
  checkCollision(bullet) {
    let charWidth = sprites[this.playerType].idle.width;
    let charHeight = sprites[this.playerType].idle.height;
    
    return (
      bullet.x > this.x - charWidth/2 &&
      bullet.x < this.x + charWidth/2 &&
      bullet.y > this.y - charHeight/2 &&
      bullet.y < this.y + charHeight/2
    );
  }
  
  display() {
    // 原有的顯示邏輯...
    
    // 顯示生命值
    this.displayHealth();
    
    // 顯示子彈
    for (let bullet of this.bullets) {
      bullet.display();
    }
  }
  
  displayHealth() {
    push();
    noStroke();
    // 血條背景
    fill(255, 0, 0);
    rect(this.x - 50, this.y - 100, 100, 10);
    // 當前血量
    fill(0, 255, 0);
    rect(this.x - 50, this.y - 100, this.health, 10);
    pop();
  }
}

class Bullet {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.frameCount = 0;
  }
  
  update() {
    this.x += this.speed;
    this.frameCount++;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    if (this.speed < 0) scale(-1, 1);
    
    let currentFrame = floor(this.frameCount / 4) % sprites.bullet.frames;
    image(
      sprites.bullet.img,
      -sprites.bullet.width/2,
      -sprites.bullet.height/2,
      sprites.bullet.width,
      sprites.bullet.height,
      currentFrame * sprites.bullet.width,
      0,
      sprites.bullet.width,
      sprites.bullet.height
    );
    pop();
  }
  
  isOffScreen() {
    return this.x < 0 || this.x > windowWidth;
  }
}

function keyPressed() {
  // 玩家1攻擊 (F鍵)
  if (keyCode === 70) {
    player1.attack();
  }
  // 玩家2攻擊 (P鍵)
  if (keyCode === 80) {
    player2.attack();
  }
}