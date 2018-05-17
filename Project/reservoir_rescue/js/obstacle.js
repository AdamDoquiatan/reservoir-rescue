function Obstacle(image, col, row) {
  this.image = image;
  this.col = col;
  this.row = row;
  this.warning = null;
  this.connectedToPipe = false;
  this.damage = 25;
  this.sprite = null;
  this.direction = null;
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
      o.warning.animations.add('flash', [0, 1, 2, 3, 4, 5, 6, 7], 30, true);
    } else if (!found && o.warning) {
      o.warning.destroy();
      o.warning = null;
    }
  }
}
