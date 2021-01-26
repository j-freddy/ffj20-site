class MainController
{
  constructor()
  {
    this.grid = new Grid(0, 0, this.tileWidth*9);
    this.subgrids = [];
    this.createSubgrids();

    this.player;
    this.activeGrid;
    this.winner = 0; //-1 = draw

    this.message = document.getElementById("message");
  }

  get tileWidth()
  {
    if(canvas.height > canvas.width)
    {
      return canvas.width/9;
    } else
    {
      return canvas.height/9;
    }
  }

  get bigTileWidth()
  {
    return this.tileWidth * 3;
  }

  createSubgrids()
  {
    let xOffset, yOffset = 0;

    for(let i = 0; i < 3; i++)
    {
      xOffset = 0;

      for(let j = 0; j < 3; j++)
      {
        this.subgrids.push(new Subgrid(xOffset, yOffset, this.bigTileWidth));
        xOffset += this.bigTileWidth;
      }

      yOffset += this.bigTileWidth;
    }
  }

  setActiveGrids()
  {
    this.subgrids.forEach((subgrid, i) => {
      if(this.activeGrid === "all")
      {
        if(!subgrid.archived) subgrid.active = true;
      } else
      {
        subgrid.active = (i === this.activeGrid);
      }
    });
  }

  init()
  {
    this.player = 1;
    this.activeGrid = "all";
  }

  tick()
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grid = this.grid
    const subgrids = this.subgrids;
    const message = this.message;
    let count;

    //tick subgrid
    this.setActiveGrids();
    let moved = Subgrid.tickBatch(this);
    if(moved)
    {
      message.innerHTML = "Status: Game in progress";

      //tick main grid
      count = 0;
      for(let i = 0; i < 3; i++)
      {
        for(let j = 0; j < 3; j++)
        {
          if(subgrids[count].occupied !== 0)
          {
            grid.data[i][j] = subgrids[count].occupied;
            grid.dataTiles = grid.refreshDataTiles();
          }
          count++;
        }
      }

      //tick game controller
      this.player = 3 - this.player;

      if(subgrids[this.activeGrid].archived)
      {
        this.activeGrid = "all";
      }

      if(grid.checkFilled()) this.winner = -1;
      if(grid.checkWin(1)) this.winner = 1;
      if(grid.checkWin(2)) this.winner = 2;
    }
    this.grid.tick();

    //other
    cursor.tick();

    if(this.winner === 0)
    {
      window.requestAnimationFrame(() => {
        this.tick();
      });
    } else
    {
      if(this.winner === 1) message.innerHTML = "Status: Cross player wins!";
      if(this.winner === 2) message.innerHTML = "Status: Nought player wins!";
      if(this.winner === -1) message.innerHTML = "Status: Game tied!";
    }
  }

  runProgram()
  {
    this.init();
    this.tick();
  }
}
