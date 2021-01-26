class Grid extends Block
{
  constructor(x, y, width)
  {
    super(x, y, width);

    this.data = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.dataTiles = this.refreshDataTiles();

    this.frameColour = "#000";
    this.frameWidth = 3;
  }

  get alpha()
  {
    return 1;
  }

  get tileWidth()
  {
    return this.width/3;
  }

  refreshDataTiles()
  {
    let dataTiles = this.data.map(arr => arr = []);

    this.data.forEach((arr, i) => {
      arr.forEach((data, j) => {
        let x = this.x + this.tileWidth * j;
        let y = this.y + this.tileWidth * i;

        if(data === 0) dataTiles[i][j] = new Tile(x, y, this.tileWidth, this, this.alpha);
        if(data === 1) dataTiles[i][j] = new Cross(x, y, this.tileWidth, this, this.alpha);
        if(data === 2) dataTiles[i][j] = new Nought(x, y, this.tileWidth, this, this.alpha);
      });
    });

    return dataTiles;
  }

  checkWin(player)
  {
    /*
      WARNING: TERRIBLY INEFFICIENT CODE
    */

    let win;

    //checks each row
    for(let j = 0; j < 3; j++)
    {
      win = true;
      for(let i = 0; i < 3; i++)
      {
        if(this.data[i][j] !== player)
        {
          win = false;
        }
      }

      if(win) return true;
    }

    //checks each column
    for(let i = 0; i < 3; i++)
    {
      win = true;
      for(let j = 0; j < 3; j++)
      {
        if(this.data[i][j] !== player)
        {
          win = false;
        }
      }

      if(win) return true;
    }
    win = true;

    //checks diagonals
    for(let i = 0; i < 3; i++)
    {
      if(this.data[i][i] !== player)
      {
        win = false;
      }
    }
    if(win) return true;
    win = true;

    for(let i = 0; i < 3; i++)
    {
      if(this.data[i][2 - i] !== player)
      {
        win = false;
      }
    }
    if(win) return true;

    return false;

  }

  checkFilled()
  {
    for(let i = 0; i < 3; i++)
    {
      for(let j = 0; j < 3; j++)
      {
        if(this.data[i][j] === 0)
        {
          return false;
        }
      }
    }

    return true;
  }

  drawLine(x1, y1, x2, y2)
  {
    ctx.save();

    ctx.strokeStyle = this.frameColour;
    ctx.lineWidth = this.frameWidth;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.restore();
  }

  drawFrame()
  {
    let xOffset = this.x, yOffset = this.y;

    for(let i = 0; i < 2; i++)
    {
      xOffset += this.tileWidth;
      this.drawLine(xOffset, this.y, xOffset, this.y + this.width);
    }

    for(let i = 0; i < 2; i++)
    {
      yOffset += this.tileWidth;
      this.drawLine(this.x, yOffset, this.x + this.width, yOffset);
    }
  }

  tickTiles()
  {
    this.dataTiles.forEach((arr) => {
      arr.forEach((tile) => {
        tile.draw();
      });
    });
  }

  tick()
  {
    this.tickTiles();
    this.drawFrame();
  }
}
