function Obstacle(image, col, row) {
    this.image = image;
    this.col = col;
    this.row = row;
    this.connected = false;
    this.warning = null;
    this.sap = false;
    this.damage = 5;
    this.sprite = null;
}

// Warns player if obstacle is connected to active pipes
function setWarnings() {
    for (o of obstacleArray) {
      let adjacentPipes = getAdjacentObjects(o, Pipe);
      for (p of adjacentPipes) {
        if (p.connectedToStart === true) {
          o.warning = addSpriteToGrid('warning', o.col, o.row);
          o.warning.animations.add('flash', [0, 1, 2, 3, 4, 5, 6, 7], 30, true);
        }
      }
    }
  }