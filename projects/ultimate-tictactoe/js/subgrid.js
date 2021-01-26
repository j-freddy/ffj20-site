class Subgrid extends Grid
{
  constructor(x, y, width)
  {
    //top left
    super(x, y, width);
    this.frameColour = "#ff0000";
    this.frameWidth = 1;

    this.active = false;
    this.occupied = 0;
    this.archived = false;
  }

  get alpha()
  {
    if(this.occupied === 0)
    {
      return 1;
    } else
    {
      return 0.4;
    }
  }

  static tickBatch(game)
  {
    let moved = false;

    game.subgrids.forEach((subgrid) => {
      if(subgrid.tick(game))
      {
        moved = true;
      }
    });

    return moved;
  }

  fillGrid()
  {
    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#ccccff";
    ctx.fillRect(this.x, this.y, this.width, this.width);

    ctx.restore();
  }

  updateAttributes()
  {
    this.dataTiles = this.refreshDataTiles();

    if(this.checkFilled()) this.occupied = -1; //draw
    if(this.checkWin(1)) this.occupied = 1;
    if(this.checkWin(2)) this.occupied = 2;

    if(this.occupied !== 0)
    {
      this.archived = true;
      this.dataTiles = this.refreshDataTiles(); //update alpha
    }
  }

  tick(game)
  {
    let moved = false;

    if(!this.archived)
    {
      if(this.isClicked && this.active)
      {
        let count = 0;

        this.dataTiles.forEach((arr, i) => {
          arr.forEach((data, j) => {
            if(data.isClicked && data.id === "tile")
            {
              this.data[i][j] = game.player;
              game.activeGrid = count;

              this.updateAttributes();

              moved = true;
            }

            count++;
          });
        });
      }
    }

    if(this.active)
    {
      this.fillGrid();
    }
    this.tickTiles();
    this.drawFrame();

    return moved;
  }
}
