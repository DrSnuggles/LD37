﻿var map0 = {
    cols: 33,
    rows: 20,
    tsize: 64,	// tilesize: 64x64
    layers: [[	// Level 0 (Titlescreen) Size:33x20 (Fullscene Camera)
		 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1,14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,13,13,13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1,14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,14, 1, 1,14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1,14, 1, 1, 1, 1, 1,13,13,13, 1, 1, 1, 1, 1,14, 1, 1,14, 1, 1,13,13, 1, 1, 1,13,13, 1, 1, 1, 1,
		 1, 1,14, 1, 1, 1, 1, 1, 1, 1,14, 1, 1, 1, 1, 1,14, 1,14, 1, 1,14, 1, 1,14, 1,14, 1, 1,14, 1, 1, 1,
		 1, 1,14, 1, 1, 1, 1,13,13,13,13, 1, 1, 1, 1, 1,14, 1, 1,14, 1,14,13,13, 1, 1,14,13,13, 1, 1, 1, 1,
		 1, 1,14, 1, 1, 1, 1,14, 1, 1,14, 1, 1, 1, 1, 1,14, 1, 1,14,13,14, 1, 1, 1, 1,14, 1, 1, 1, 1, 1, 1,
		 1, 1,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 1,13,13,13,13,13,13,13,13,13,13, 1, 1,
		 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1,12,12,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1,12, 1, 1,12, 1, 1,12, 1, 1, 1, 1, 1, 1, 1, 1, 1,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1,12, 1, 1,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1,12,12,12, 1, 1, 1,12, 1,12,12,12, 1, 1,12,12,12,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1,12, 1,12, 1, 1, 1,12, 1,12, 1,12,12, 1,12, 1, 1,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1,12, 1,12,12, 1, 1,12, 1,12, 1, 1,12, 1,12, 1, 1,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1,12, 1, 1,12,12,12,12,12,12, 1, 1,12,12,12,12,12,12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
	]],
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    },
    isSolidTileAtXY: function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);

        // tiles <=10 are solid -- the rest are walkable
        // loop through all layers and return TRUE if any tile is solid
        return this.layers.reduce(function (res, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = tile <=10 && tile!=0;
            return res || isSolid;
        }.bind(this), false);
    },
    getCol: function (x) {
        return Math.floor(x / this.tsize);
    },
    getRow: function (y) {
        return Math.floor(y / this.tsize);
    },
    getX: function (col) {
        return col * this.tsize;
    },
    getY: function (row) {
        return row * this.tsize;
    }
};

var map1 = {
    cols: 22,
    rows: 17,
    tsize: 64,
    layers: [[	// Level 1
		 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2,
		 3,17,17, 2,18, 6,17,17,17,17,17,17, 2,18, 4,17,17,17,17,17,17, 3,
		 3,17,17,17,18, 9,10,18, 3, 5, 3, 7, 8,18, 5,18, 5, 9, 2, 5, 3, 3,
		 3, 6, 7,10,18,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17, 3,
		 3,18, 3,17,17, 3, 4,18, 6, 3, 3, 5, 3,10,18,17, 6,18,10,17,18, 3,
		 3,17,18,17,17, 9, 5,18, 9,18,17,17,17, 9,18, 3,10,18, 3, 9,18, 3,
		 3, 7,18, 9, 3,17,17,18, 2,18, 7, 2, 5, 3,17,17,17,17,17,17,18, 3,
		 3,17,18,10, 9, 2,10,18, 9,17,17,17,17,18,10,18, 7,18, 3, 8,18, 3,
		 3, 2,18,17,17,17,17,17, 3, 7, 3,18, 8,18, 7, 2,17,18, 3,10,18, 3,
		 3, 8,18, 9,18,18, 9,18,10,17,17,17, 3,18,17, 5,17,18, 6,17,18, 3,
		 3,17,17, 7, 3, 3,17,18, 6,17,17,17, 3,18, 3,18, 3,18, 8,17,18, 3,
		 3,17,17,17, 7, 3, 3,18, 3, 3, 7,18, 9,18,17,18, 3,18, 2, 8,18, 3,
		 3, 5, 3,18,17,17, 4,18, 4, 9, 5,18, 5,18, 5,18, 6,18, 2,17,18, 3,
		 3,18, 3,18,10,18,10,18, 2,17,17,18, 3,17,17,17,17,18, 9, 5,18, 3,
		 3,18,17,18, 3,17,17,18,10,17,17, 9,18, 6, 3, 2, 2, 7, 4,17,18, 3,
		 3,18, 3,18, 6,18, 3,18, 6, 3,18,17,17,17,17,17,17,17,17,17,17, 3,
		 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3
	],[	// collectables (21,22,23,24(flowers generated),25(kaffee),30(key)+20(door),26(bier),27(time),28(ammo))
		 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		 0,27, 0, 0, 0, 0,26,27, 0, 0,28,30, 0, 0, 0,20, 0, 0, 0, 0, 0, 0,
		 0,25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,25, 0,27, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,26, 0,
		 0,26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		 0,27, 0, 0, 0, 0, 0, 0, 0, 0,27, 0,30, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0,25, 0, 0, 0,25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,26, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,25, 0, 0, 0, 0,
		 0, 0, 0, 0, 0,26, 0, 0, 0, 0, 0, 0, 0, 0,28, 0,28, 0, 0, 0, 0, 0,
		 0,28, 0, 0, 0, 0,25, 0, 0,26, 0, 0, 0, 0, 0,30, 0, 0, 0,26, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0,25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,27, 0, 0,
		 0,30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0, 0,26, 0, 0,28, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0,27, 0,26, 0,28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,25, 0,
		 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]],
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    },
    isSolidTileAtXY: function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);

        // tiles <=10 are solid, 20=door -- the rest are walkable
        // loop through all layers and return TRUE if any tile is solid
        return this.layers.reduce(function (res, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = (tile <= 10 && tile!=0) || tile===20;
            return res || isSolid;
        }.bind(this), false);
    },
    getCol: function (x) {
        return Math.floor(x / this.tsize);
    },
    getRow: function (y) {
        return Math.floor(y / this.tsize);
    },
    getX: function (col) {
        return col * this.tsize;
    },
    getY: function (row) {
        return row * this.tsize;
    }
};
