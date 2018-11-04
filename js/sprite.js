function Sprite(col, images, x, y) {
    this.x=x;
    this.y=y;
    this.col=col;
    this.images=images || [];
    this.currentImage = 0;

    this.setPosition = function(x, y) {
        this.x = x
        this.y = y;
    }

    this.tick = function() {
        this.currentImage = (this.currentImage+1)%this.images.length;
    }

    this.draw = function() {
        tint(this.col);
        image(this.images[this.currentImage], this.x*TILE_SIZE*scale, this.y*TILE_SIZE*scale,TILE_SIZE*scale,TILE_SIZE*scale);
    }
}