function Obstacle(image, col, row, damage, animationFrames, animationSpeed, timerDuration) {
  this.image = image;
  this.col = col;
  this.row = row;
  this.warning = null;
  this.connectedToPipe = false;
  this.damage = damage;
  this.animationFrames = animationFrames;
  this.animationSpeed = animationSpeed;
  this.sprite = null;
  this.direction = null;
  this.timerDuration = timerDuration;
  this.displayDamage = function () {
    health -= this.damage;
    healthText.text = health;
    setHealthBar(health);
    let textStyle = { font: 'bold 30pt Helvetica', fill: 'red', align: 'center', wordWrap: true, wordWrapWidth: 850 };
    let damageText = game.add.text(colToX(this.col) + 8 * SCALE, rowToY(this.row), '-' + this.damage + 'L', textStyle);
    damageText.stroke = '#000000';
    damageText.strokeThickness = 7;
    let damageTween = game.add.tween(damageText);
    damageTween.to({ alpha: 0, y: this.sprite.y - 16 * SCALE }, 2000, Phaser.Easing.Cubic.Out, true);
    damageTween.onComplete.add(function () {
      damageText.destroy();
    }, this);
  };
  this.timer = game.time.create();
  this.startSap = function () {
    this.timer.loop(timerDuration, this.displayDamage, this);
    this.timer.start();
  }
  this.stopSap = function () {
    if (this.timer.running) {
      this.timer.stop();
    }
  }
}

function setWarnings() {
  for (let o of obstacleArray) {
    let found = false;
    let adjacentPipes = getAdjacentObjects(o, Pipe);
    for (let p of adjacentPipes) {
      if (!found && p.connectedToStart) {
        found = true;
      }
    }
    if (found && o.warning === null) {
      o.warning = addSpriteToGrid('warning', o.col, o.row);
      o.warning.animations.add('flash', [0, 1, 2, 3], 10, true);
      o.warning.animations.play('flash');
      if (!SFX_beep.isPlaying) {
        SFX_beep.play();
      }
    } else if (!found && o.warning) {
      o.warning.destroy();
      o.warning = null;
    }
  }
}

// Clears all obstacles from grid
function clearObstacles() {
  for (let o of obstacleArray) {
    o.sprite.destroy();
    grid[o.row][o.col] = null;
    obstacleArray = [];
  }
}
