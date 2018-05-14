function Obstacle(image, col, row) {
    this.image = image;
    this.col = col;
    this.row = row;
    this.connected = false;
    this.warning = null;
    this.sap = false;
    this.damage = 5;
}

function setWarnings() {
    for (o of obstacleArray) {
      for (p of getAdjacent(o, Pipe)) {
        if (p.start === true) {
          o.warning = addToGrid(o.col, o.row, 'warning');
          o.warning.animations.add('flash', [0,1,2,3,4,5,6,7], 30, true);
        }
      }
    }
  }