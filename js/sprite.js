function Sprite(x, y, col, images) {
    this.x=x;
    this.y=y;
    this.col=col;
    this.images=images || [];
    this.currentImage = 0;

    this.tick = function() {
        this.currentImage = (this.currentImage+1)%this.images.length;
    }

    this.draw = function() {
        tint(this.col);
        image(this.images[this.currentImage], this.x*TILE_WIDTH*scale, this.y*TILE_WIDTH*scale,TILE_WIDTH*scale,TILE_WIDTH*scale);
    }
}