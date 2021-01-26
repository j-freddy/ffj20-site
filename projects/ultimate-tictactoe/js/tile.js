class Block
{
  constructor(x, y, width)
  {
    this.x = x;
    this.y = y;
    this.width = width;
  }

  get center()
  {
    let x = this.x + this.width/2;
    let y = this.y + this.width/2;

    return {x, y};
  }

  get isHover()
  {
    let pointer = new SAT.Vector(cursor.x, cursor.y);
    let tile = new SAT.Box(new SAT.Vector(this.x, this.y), this.width, this.width).toPolygon();

    return SAT.pointInPolygon(pointer, tile);
  }

  get isClicked()
  {
    return this.isHover && cursor.clicked;
  }
}

class Tile extends Block
{
  constructor(x, y, width, subgrid, alpha)
  {
    super(x, y, width);
    this.id = "tile";
    this.subgrid = subgrid;

    this.alpha = alpha;
    this.img = img.null;
  }

  draw()
  {
    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.width);

    ctx.restore();
  }
}

class Cross extends Tile
{
  constructor(x, y, width, subgrid, alpha)
  {
    super(x, y, width, subgrid, alpha);
    this.id = "cross";
    this.img = img.cross;
  }
}

class Nought extends Tile
{
  constructor(x, y, width, subgrid, alpha)
  {
    super(x, y, width, subgrid, alpha);
    this.id = "nought";
    this.img = img.nought;
  }
}
