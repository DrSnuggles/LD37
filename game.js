// LaBeeRind2D - by Gnax Productions
//
// Techniques:
// Canvas
// Pathfinding (https://github.com/qiao/PathFinding.js)
// Random flowers
// Tiles (https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps)
//

var snd_allesschluesseleingesammelt=document.createElement("audio");snd_allesschluesseleingesammelt.src="snd/allesschluesseleingesammelt.ogg";
var snd_bangbang=document.createElement("audio");snd_bangbang.src="snd/bangbang.ogg";
var snd_bee=document.createElement("audio");snd_bee.src="snd/bee.ogg";
var snd_gong=document.createElement("audio");snd_gong.src="snd/gong.ogg";
var snd_hermitderkrone=document.createElement("audio");snd_hermitderkrone.src="snd/hermitderkrone.ogg";
var snd_jippi=document.createElement("audio");snd_jippi.src="snd/jippi.ogg";
var snd_losgehts=document.createElement("audio");snd_losgehts.src="snd/losgehts.ogg";
var snd_menno=document.createElement("audio");snd_menno.src="snd/menno.ogg";
var snd_muhkuh=document.createElement("audio");snd_muhkuh.src="snd/muhkuh.ogg";
var snd_wullewulle=document.createElement("audio");snd_wullewulle.src="snd/wullewulle.ogg";
var snd_hoppla=document.createElement("audio");snd_hoppla.src="snd/hoppla.ogg";
var snd_bgmusic=document.createElement("audio");snd_bgmusic.src="snd/music.ogg"; snd_bgmusic.loop=true;

// Init
document.title='LaBeeRind2D - ©2016 by Gnax Productions';	// set title and Copyright
document.oncontextmenu=function (){return false;};			// disable contextmenu
document.ondragstart=function (){return false;};			// disable dragstart
document.ondragsend=function (){return false;};				// disable dragend

// canvas resizeable machen
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
window.onresize = function (){resizer();};

var xscale, yscale;
function resizer(){
 canvas.width=window.innerWidth-1;
 canvas.height=window.innerHeight-4;
 // scalefactor
 // in LaBee wurden 1024x576 (16x9) dargestellt
 xscale=canvas.width/1024.0;
 yscale=canvas.height/576.0;
// xscale=1;
// yscale=1;
 if (story===0){	// der titelscreen ist komplett zu sehen
	xscale=canvas.width/(33.0*64.0);
	yscale=canvas.height/(20.0*64.0);
 }
 // alert('width: '+canvas.width+'xscale: '+xscale+' yscale: '+yscale);
// if (Game.paused)Game.init();
}

// variablen welche inGame geändert werden können
var playmus=true;	// still no menu 
var playsnd=true;	// still no menu 

//
// Asset loader from MDN
//
var Loader = {
	images: {}
};
Loader.loadImage = function (key, src) {
	var img = new Image();
	var d = new Promise(function (resolve, reject) {
		img.onload = function () {
			this.images[key] = img;
			resolve(img);
		}.bind(this);
		img.onerror = function () {
			reject('Could not load image: ' + src);
		};
	}.bind(this));
	img.src = src;
	return d;
};
Loader.getImage = function (key) {
	return (key in this.images) ? this.images[key] : null;
};

//
// Keyboard handler from MDN
//
var Keyboard = {};
Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;
Keyboard.SPACE = 32;
Keyboard._keys = {};
Keyboard.listenForEvents = function (keys) {
	window.addEventListener('keydown', this._onKeyDown.bind(this));
	window.addEventListener('keyup', this._onKeyUp.bind(this));
	keys.forEach(function (key) {
		this._keys[key] = false;
	}.bind(this));
}
Keyboard._onKeyDown = function (event) {
	var keyCode = event.keyCode;
	if (keyCode in this._keys) {
		event.preventDefault();
		this._keys[keyCode] = true;
	}
};
Keyboard._onKeyUp = function (event) {
	var keyCode = event.keyCode;
	if (keyCode in this._keys) {
		event.preventDefault();
		this._keys[keyCode] = false;
	}
};
Keyboard.isDown = function (keyCode) {
	if (!keyCode in this._keys) {
		throw new Error('Keycode ' + keyCode + ' is not being listened to');
	}
	return this._keys[keyCode];
};

//
// Game object from MDN
//
var Game = {};
Game.paused=false;
Game.run = function (context) {
	this.ctx = context;
	this._previousElapsed = 0;

	var p = this.load();
	Promise.all(p).then(function (loaded) {
		this.init();
		window.requestAnimationFrame(this.tick);
	}.bind(this));
};
Game.tick = function (elapsed) {
	if(!this.paused){
		window.requestAnimationFrame(this.tick);

		// clear previous frame
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);

		// compute delta time in seconds -- also cap it
		var delta = (elapsed - this._previousElapsed) / 1000.0;
		delta = Math.min(delta, 0.25); // maximum delta of 250 ms
		this._previousElapsed = elapsed;

		this.update(delta);
		this.render();
	}
}.bind(Game);

// override these methods to create the game
Game.init = function () {};
Game.update = function (delta) {};
Game.render = function () {};

//
// start up function
//

window.onload = function () {
	Game.run(context);
};

// now the specific part
function Camera(map, width, height) {
	this.x = 0;
	this.y = 0;
	this.width = width;
	this.height = height;
	this.maxX = map.cols * map.tsize - width;
	this.maxY = map.rows * map.tsize - height;
}
Camera.prototype.follow = function (sprite) {
	this.following = sprite;
	sprite.screenX = 0;
	sprite.screenY = 0;
};
Camera.prototype.update = function () {
	// assume followed sprite should be placed at the center of the screen
	// whenever possible
	this.following.screenX = this.width / 2;
	this.following.screenY = this.height / 2;

	// make the camera follow the sprite
	this.x = this.following.x - this.width / 2;
	this.y = this.following.y - this.height / 2;
	// clamp values
	this.x = Math.max(0, Math.min(this.x, this.maxX));
	this.y = Math.max(0, Math.min(this.y, this.maxY));

	// in map corners, the sprite cannot be placed in the center of the screen
	// and we have to change its screen coordinates

	// left and right sides
	if (this.following.x < this.width / 2 ||
		this.following.x > this.maxX + this.width / 2) {
		this.following.screenX = this.following.x - this.x;
	}
	// top and bottom sides
	if (this.following.y < this.height / 2 ||
		this.following.y > this.maxY + this.height / 2) {
		this.following.screenY = this.following.y - this.y;
	}
};

var animframe=0;
var totalframe=0;
var animline=0;
var oldherox=0;
var oldheroy=0;
function Hero(map, x, y) {
	this.map = map;
	this.x = x;
	this.y = y;
	this.width = map.tsize;					// hatte auch schon keinere heros
	this.height = map.tsize;
	this.crownAt = 1500;
	this.shoot=false;
	
	// hier kommt die spritesheet änderung
	if (points>this.crownAt){
		this.Sheet = Loader.getImage('hero2');
	}else{
		this.Sheet = Loader.getImage('hero');
	}
}
Hero.OrgSpeed = 128;
Hero.SPEED = Hero.OrgSpeed; // pixels per second
Hero.prototype.move = function (delta, dirx, diry) {
	// move hero
	this.x += dirx * Hero.SPEED * delta;
	this.y += diry * Hero.SPEED * delta;

	// check if we walked into a non-walkable tile
	this._collide(dirx, diry);

	// clamp values
	var maxX = this.map.cols * this.map.tsize;
	var maxY = this.map.rows * this.map.tsize;
	this.x = Math.max(0, Math.min(this.x, maxX));
	this.y = Math.max(0, Math.min(this.y, maxY));

	// im sheet sind die zeilen DLRU angeordnet. 8 spalten (frames)
	var moved=false;
	if (oldherox>this.x) {animline=1;moved=true;}
	if (oldherox<this.x) {animline=2;moved=true;}
	if (oldheroy>this.y) {animline=3;moved=true;}
	if (oldheroy<this.y) {animline=0;moved=true;}
	oldherox=this.x;
	oldheroy=this.y;
	totalframe++;
	if ((totalframe % 3 == 0) && moved)animframe++;
	if (animframe===8)animframe=0;
};
Hero.prototype._collide = function (dirx, diry) {
	var row, col;
	// -1 in right and bottom is because image ranges from 0..63
	// and not up to 64
	var left = this.x - this.width / 2;
	var right = this.x + this.width / 2 - 1;
	var top = this.y - this.height / 2;
	var bottom = this.y + this.height / 2 - 1;

	// hero hat 3 pixel nach unten
	// hero hat 11 pixel nach links
	// hero hat 11 pixel nach rechts
	// hero hat 3 pixel nach oben
	left+=13;
	right-=13;
	top+=20;
	bottom-=5;

	// check for collisions on sprite sides
	var collision = false;
	if (dirx<0) collision+=this.map.isSolidTileAtXY(left, bottom);
	if (dirx>0) collision+=this.map.isSolidTileAtXY(right, bottom);
	if (diry<0) collision+=this.map.isSolidTileAtXY(this.x, top);
	if (diry>0) collision+=this.map.isSolidTileAtXY(this.x, bottom);

	// check for collectables (liegen in der mitte)
	if (this.map.layers[1]){
		var collectable = this.map.layers[1][Math.floor(this.y/map.tsize) * map.cols + Math.floor(this.x/map.tsize)];
		if (collectable>0){
			this.map.layers[1][Math.floor(this.y/map.tsize) * map.cols + Math.floor(this.x/map.tsize)] = 0;	// remove collectable
			// points
			if (collectable==21)points+=1;	//yellow
			if (collectable==22)points+=5;	//blue
			if (collectable==23)points+=15;	//blueish
			if (collectable==24)points+=50;	//red
			// speed
			if (collectable==25){			//coffee (faster for 10 sec.)
				Hero.SPEED=Hero.SPEED*1.5;
				setTimeout(function (){Hero.SPEED=Hero.OrgSpeed}, 10000);
				if (playsnd)snd_jippi.play();
			};
			if (collectable==26){			//beer (slower for 10 sec.)
				Hero.SPEED=Hero.SPEED*0.75;
				setTimeout(function (){Hero.SPEED=Hero.OrgSpeed}, 10000);
				if (playsnd)snd_menno.play();
			};
			if (collectable==27){			//honeypot (+30 sec.)
				timeleft+=30;
				if (playsnd)snd_bee.play();
			};
			if (collectable==28){			//honeyball (+5 ammo)
				ammo+=5;
				if (playsnd)snd_bangbang.play();
			};
			if (collectable==29){};			//+30sec (was intended for display when you collet a honeypot)
			if (collectable==30){			//key
				keys++;
				if (keys==totalkeys){
					if (playsnd)snd_allesschluesseleingesammelt.play();	// play audio
					// remove the door from layer1 (tile=20)
					for (var i=0;i<=this.map.layers[1].length;i++){
						if (this.map.layers[1][i]===20)this.map.layers[1][i]=0;	// remove collectable
					}
				}
			};
			// the crown
			if (oldpoints<this.crownAt && points>this.crownAt){
				this.Sheet=Loader.getImage('hero2');
				if (playsnd)snd_hermitderkrone.play();//play audio
			}
			oldpoints=points;
		}
	}
	
	
	if (!collision) { return; }
	// collision -> set back to old values
	this.x=oldherox;
	this.y=oldheroy;
};
// dead slime
function DeadSlime(x, y) {
	this.x = x;
	this.y = y;
	this.width = map.tsize;
	this.height = map.tsize;
	this.Sheet = Loader.getImage('slime');
	window.setTimeout(function(){Game.deadslime.splice(0,1)},2000); // self destroy in 2 sec.
}
// now the shot
function Shot(map, x, y, dirx, diry) {
	this.map = map;
	this.x = x;
	this.y = y;
	this.dirx = dirx;
	this.diry = diry;
	this.width = map.tsize;
	this.height = map.tsize;
//	this.Sheet = Loader.getImage('shot');
	this.speed = 128;
}
Shot.prototype.move = function (delta) {
	// move shot
	this.x += this.dirx * this.speed * delta;
	this.y += this.diry * this.speed * delta;
	// check if we hit sth.
	this._collide(this.dirx, this.diry);
};
Shot.prototype._collide = function (dirx, diry) {
    var row, col;
    // -1 in right and bottom is because image ranges from 0..63
    // and not up to 64
    var left = this.x - this.width / 2;
    var right = this.x + this.width / 2 - 1;
    var top = this.y - this.height / 2;
    var bottom = this.y + this.height / 2 - 1;

    // check for collisions on sprite sides
    var collision = false;
/*
    if (dirx<0) collision+=this.map.isSolidTileAtXY(left, bottom);
    if (dirx>0) collision+=this.map.isSolidTileAtXY(right, bottom);
    if (diry<0) collision+=this.map.isSolidTileAtXY(this.x, top);
    if (diry>0) collision+=this.map.isSolidTileAtXY(this.x, bottom);
*/

	// clamp values
	var maxX = this.map.cols * this.map.tsize;
	var maxY = this.map.rows * this.map.tsize;
	collision+=(this.x>maxX || this.y>maxY || this.x<0 || this.y<0)// object zerstören (rand der map erreicht)

	var slimeHit=false;
	// slime getroffen?
	for (var i=0;i<Game.slime.length;i++){
		if (Math.abs(this.x-Game.slime[i].x)<32 && Math.abs(this.y-Game.slime[i].y)<32){
			collision+=true;
			slimeHit=true;
			break;
		}
	}
	if (slimeHit){
		Game.deadslime.push(new DeadSlime(Game.slime[i].x,Game.slime[i].y));		// splash anzeigen
		Game.slime.splice(i,1);				// ziel zerstören
		if (playsnd)snd_wullewulle.play();	// audio abspielen
		points+=100;
		// make new slime
		var tmp=Math.floor(Math.random()*4+1); //1-4
		switch(tmp){
		 case 1: // upper left
		  Game.slime.push(new Slime(map, 1*map.tsize+32, 1*map.tsize+32));
		  break;
		 case 2: // upper right
		  Game.slime.push(new Slime(map, (map.cols-2)*map.tsize+32, 3*map.tsize+32));
		  break;
		 case 3: // lower left
		  Game.slime.push(new Slime(map, 1*map.tsize+32, (map.rows-2)*map.tsize+32));
		  break;
		 case 4: // lower right
		  Game.slime.push(new Slime(map, (map.cols-2)*map.tsize+32, (map.rows-2)*map.tsize+32));
		  break;
		 default:
		}
	}
	if (collision){	// shot zerstören
		Game.hero.shot = null;
		delete Game.hero.shot;
		window.setTimeout(function(){Game.hero.shoot=false;},500);
		Game.hero.shot=false;
	}

};

function Slime(map, x, y) {// now the slime (complex NPC finds way to hero)
	this.map = map;
	this.x = x;
	this.y = y;
	this.width = map.tsize;
	this.height = map.tsize;
	this.Sheet = Loader.getImage('slime');
	this.speed = 48;
	this.animline=0;
	this.animframe=0;
	this.totalframe=0;
	this.lastX = x;
	this.lastY = y;
	this.lastdirx = 0;
	this.lastdiry = 0;
}
Slime.prototype.move = function (delta) {
	var dirx=0;var diry=0;
	// has to walk till mid of tile
	if (this.lastdirx!=0 && Math.floor(this.x%64)!=32){
		dirx=this.lastdirx;
	}
	if (this.lastdiry!=0 && Math.floor(this.y%64)!=32){
		diry=this.lastdiry;
	}
	if (dirx===0 && diry===0){
		// prepare pathfinding
		var grid = new PF.Grid(map.cols, map.rows);	//by default all are walkable
		this.grid=grid;
		for (var row=0;row<map.rows;row++){
			for (var col=0;col<map.cols;col++){
				if (map.layers[0][row*map.cols+col]<=10)grid.setWalkableAt(col,row,false);	//makes wall
			}
		}
		var finder = new PF.AStarFinder();
		this.col = Math.round((this.x-this.width/2)/map.tsize);
		this.row = Math.round((this.y-this.height/2)/map.tsize);
		this.path = finder.findPath(this.col, this.row, Math.floor(Game.hero.x/map.tsize), Math.floor(Game.hero.y/map.tsize), grid);
		var newcol, newrow;
		if (this.path[1]){
			newcol = this.path[1][0];
			newrow = this.path[1][1];
		}
		if (newcol<this.col)dirx=-1;
		if (newcol>this.col)dirx=1;
		if (newrow<this.row)diry=-1;
		if (newrow>this.row)diry=1;
	}
	
	// move Slime
	this.x += dirx * this.speed * delta;
	this.y += diry * this.speed * delta;

	// im sheet sind die zeilen LR angeordnet. 5 spalten (frames)
	var moved=false;
	if (this.lastX>this.x) {this.animline=1;moved=true;}
	if (this.lastX<this.x) {this.animline=2;moved=true;}
	if (this.lastY>this.y) {this.animline=3;moved=true;}
	if (this.lastY<this.y) {this.animline=0;moved=true;}
	this.lastX=this.x;
	this.lastY=this.y;
	this.lastdirx=dirx;
	this.lastdiry=diry;
};
function Cow(map, x, y) {// now the cow (simple NPC just left/right)
	this.map = map;
	this.x = x;
	this.y = y;
	this.width = map.tsize;
	this.height = map.tsize;
	this.Sheet = Loader.getImage('cow');
	this.speed = 64;
	this.animline=0;
	this.animframe=0;
	this.totalframe=0;
	this.lastX = x;
	this.lastY = y;
	this.lastdirx = 0;
	this.lastdiry = 0;
}
Cow.prototype.move = function (delta) {
	// set to old direction
	dirx=this.lastdirx;
	diry=this.lastdiry;

	// move cow
	this.x += dirx * this.speed * delta;
	this.y += diry * this.speed * delta;

	// check if we walked into a non-walkable tile
	this._collide(dirx, diry);

	// clamp values
	var maxX = this.map.cols * this.map.tsize;
	var maxY = this.map.rows * this.map.tsize;
	this.x = Math.max(0, Math.min(this.x, maxX));
	this.y = Math.max(0, Math.min(this.y, maxY));

	// in sheet rows are LR angeordnet. 5 cols (frames)
	var moved=false;
	if (this.lastX>this.x) {this.animline=0;moved=true;}
	if (this.lastX<this.x) {this.animline=1;moved=true;}
	if (this.lastY>this.y) {this.animline=2;moved=true;}
	if (this.lastY<this.y) {this.animline=3;moved=true;}
	this.lastX=this.x;
	this.lastY=this.y;
	this.totalframe++;
	if ((this.totalframe % 3 == 0) && moved)this.animframe++;
	if (this.animframe===5)this.animframe=0;
	//make moo
	if (this.totalframe % (20*60) === 0){
		if (playsnd){
			//calc distance
			var maxdistance=Math.sqrt( Math.pow((map.cols-3)*map.tsize, 2) + Math.pow((map.rows-3)*map.tsize, 2) ); // -3 weil 2xrand+mitte/mitte
			var actdistance=Math.sqrt( Math.pow(Math.abs(this.x-Game.hero.x), 2) + Math.pow(Math.abs(this.y-Game.hero.y), 2) );
			snd_muhkuh.volume=1-actdistance/maxdistance;
			snd_muhkuh.play();
		}
	}
};
Cow.prototype._collide = function (dirx, diry) {
    var row, col;
    // -1 in right and bottom is because image ranges from 0..63
    // and not up to 64
    var left = this.x - this.width / 2;
    var right = this.x + this.width / 2 - 1;
    var top = this.y - this.height / 2;
    var bottom = this.y + this.height / 2 - 1;

	// Cow hat 3 pixel nach unten
	// Cow hat 11 pixel nach links
	// Cow hat 11 pixel nach rechts
	// Cow hat 3 pixel nach oben
	left+=0;
	right-=0;
	top+=0;
	bottom-=0;

    // check for collisions on sprite sides
    var collision = false;
    if (dirx<0) collision+=this.map.isSolidTileAtXY(left, bottom);
    if (dirx>0) collision+=this.map.isSolidTileAtXY(right, bottom);
    if (diry<0) collision+=this.map.isSolidTileAtXY(this.x, top);
    if (diry>0) collision+=this.map.isSolidTileAtXY(this.x, bottom);

    if (!collision) { return; }
	// collision -> set back to old values
	this.x=this.lastX;
	this.y=this.lastY;
	// and set new direction
	this.lastdirx=this.lastdirx*(-1);
};

Game.load = function () { // hier werden die assets geladen
    return [
        Loader.loadImage('tiles', 'gfx/Tileset.png'),
        Loader.loadImage('hero', 'gfx/Stripeset_LaBee.png'),
        Loader.loadImage('cow', 'gfx/Stripeset_Rind.png'),
        Loader.loadImage('slime', 'gfx/Stripeset_Slime.png'),
		Loader.loadImage('hero2', 'gfx/Stripeset_LaBeeKrone.png')
    ];
};

var points = 0;
var oldpoints = 0;		// for switching to crown
var totalpoints = 0;	// levelreset -> you will lose your inlevel collected points
var keys = 0;
var totalkeys = 0;		// how many keys are needed
var ammo = 0;
var timeleft = 60;
var map;
var story = 0;			// where does the story start
Game.init = function () {
	Keyboard.listenForEvents(
		[Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN, Keyboard.SPACE]);
	this.tileAtlas = Loader.getImage('tiles');
resizer();

if (story===0){	// titlescreen
	map = cloneObject(map0);
	timeleft = 99999999;
	this.hero = new Hero(map, 2*map.tsize+32, 2*map.tsize+32);					// level 0 startposition
	this.cow = new Cow(map, 5*map.tsize+32, 11*map.tsize+32);
	this.cow.lastdirx=1;
	this.camera = new Camera(map, map.cols*map.tsize, map.rows*map.tsize);
	this.camera.follow(this.hero);
	window.setTimeout(function (){story++;Game.init()},5000); // jump to intro/story after 5sec.
}
if (story>0 && story<6){	// intro/story
	showSplash('Story_'+story);
	story++;
	return;
}
if (story===6){	// level
	map = cloneObject(map1);
	flowerFill(map,0.6,0.25,0.10,0.05);
	ammo = 5;
	keys = 0;
	totalkeys = 4;
	timeleft = 60;
	points = totalpoints;
	this.hero = new Hero(map, 1*map.tsize+32, 11*map.tsize+32);		// level 4 startposition (sprite ist mittig zentriert)
	this.cow = new Cow(map, (map.cols-2)*map.tsize+32, 1*map.tsize+32);	// oben rechts
	this.cow.lastdirx=-1;
	this.slime = [];
	this.deadslime = [];
	// make slimer
	this.slime[0] = new Slime(map, 1*map.tsize+32, 1*map.tsize+32); // upper left
	this.slime[1] = new Slime(map, 1*map.tsize+32, (map.rows-2)*map.tsize+32); // lower left
	this.slime[2] = new Slime(map, (map.cols-2)*map.tsize+32, 3*map.tsize+32); // upper right
	this.slime[3] = new Slime(map, (map.cols-2)*map.tsize+32, (map.rows-2)*map.tsize+32); // lower right
}
if (story===7){
	showSplash('Story_End');
//	story++;
	return;
}
if (story>7){story=0;Game.init();return}	// one room :-) and never reached
// last prepare before level start
if (story>0)this.camera = new Camera(map, 16*map.tsize, 9*map.tsize);	// camera
if (story>0)this.camera.follow(this.hero);
// play start audio
if (playsnd)snd_losgehts.play();
if (playmus)snd_bgmusic.play();
window.requestAnimationFrame(this.tick);
};
var grid;
Game.update = function (delta) { // handle hero movement with arrow keys / TIME / Player hits cow / SPACE
	timeleft-=delta;
	if (Math.round(timeleft,1)==30.0 && playsnd)snd_gong.play();					// spiele gong zur warnung
	if (Math.round(timeleft,1)==0.0){story--;Game.init();}							// level neustart bei zeitende
	// levelende
	if (Math.abs(this.hero.x-this.cow.x)<32 && Math.abs(this.hero.y-this.cow.y)<32){story++;totalpoints=points;Game.init();}	// nächster schritt in story
	// slimer getroffen
	if (this.slime){
		for (var i=0;i<this.slime.length;i++){
			if (Math.abs(this.hero.x-this.slime[i].x)<48 && Math.abs(this.hero.y-this.slime[i].y)<48){
				if (playsnd)snd_hoppla.play();
				story--;
				Game.init();
			}
		}
	}
	var dirx = 0;
	var diry = 0;
	if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
	else if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
	else if (Keyboard.isDown(Keyboard.UP)) { diry = -1; }
	else if (Keyboard.isDown(Keyboard.DOWN)) { diry = 1; }
	if (Keyboard.isDown(Keyboard.SPACE)) {						// SPACE = Schuss
		if (ammo>0 && !this.hero.shoot){
			// nun der schuss
			if (!this.shoot){
				if (animline==1)dirx=-1;
				if (animline==2)dirx=1;
				if (animline==3)diry=-1;
				if (animline==0)diry=1;
				this.hero.shot = new Shot(map, this.hero.x+map.tsize/2*dirx, this.hero.y+map.tsize/2*diry, dirx, diry);
			}
			this.hero.shoot=true;
			ammo--;
		}
	}

	this.hero.move(delta, dirx, diry);									//move hero
	this.cow.move(delta);												//move cow
	if (this.hero.shoot && this.hero.shot)this.hero.shot.move(delta);	//move shot
	if (this.slime){
		for (var i=0;i<this.slime.length;i++){								//move slime
			this.slime[i].move(delta);
		}
	}
	this.camera.update();
};
Game._drawLayer = function (layer) { // draws layer
    if (map.layers[layer]){
		var startCol = Math.floor(this.camera.x / map.tsize);
		var endCol = startCol + (this.camera.width / map.tsize);
		var startRow = Math.floor(this.camera.y / map.tsize);
		var endRow = startRow + (this.camera.height / map.tsize);
		var offsetX = -this.camera.x + startCol * map.tsize;
		var offsetY = -this.camera.y + startRow * map.tsize;

		for (var c = startCol; c <= endCol; c++) {
			for (var r = startRow; r <= endRow; r++) {
				var tile = map.getTile(layer, c, r);
				var tiley=Math.floor((tile-1)/10);	// 10 tiles in one row
				var tilex=(tile-1)-10*tiley;
				var x = (c - startCol) * map.tsize + offsetX;
				var y = (r - startRow) * map.tsize + offsetY;
				if (tile !== 0) { // 0 => empty tile
					this.ctx.drawImage(
						this.tileAtlas, // image
						tilex * map.tsize, // source x
						tiley * map.tsize, // source y (now multirow tileset)
						map.tsize, // source width
						map.tsize, // source height
						Math.round(x)*xscale,  // target x
						Math.round(y)*yscale, // target y
						map.tsize*xscale, // target width
						map.tsize*yscale // target height
					);
				}
			}
		}
	}
};
Game._drawGrid = function () { // draw grid (not used)
	var width = map.cols * map.tsize;
	var height = map.rows * map.tsize;
	var x, y;
	for (var r = 0; r < map.rows; r++) {
		x = - this.camera.x;
		y = r * map.tsize - this.camera.y;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(width, y);
		this.ctx.stroke();
	}
	for (var c = 0; c < map.cols; c++) {
		x = c * map.tsize - this.camera.x;
		y = - this.camera.y;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x, height);
		this.ctx.stroke();
	}
};
Game.render = function () { // render Layers / Players / NPCs / OSD
    // draw map background layer
    this._drawLayer(0);
    // draw map top layer (collectables)
	this._drawLayer(1);

    // draw main character, the bee
    this.ctx.drawImage(
		this.hero.Sheet, // image
		animframe * map.tsize, // source x
		animline * map.tsize, // source y
		map.tsize, // source width
		map.tsize, // source height
		(this.hero.screenX - this.hero.width / 2)*xscale,  // target x
		(this.hero.screenY - this.hero.height / 2)*yscale, // target y
		map.tsize*xscale, // target width
		map.tsize*yscale // target height
	);

	// Cow in camera view?
	if ( ((this.cow.x)>this.camera.x) && ((this.cow.x)<(this.camera.x+this.camera.width)) && (this.cow.y+this.cow.height/2>this.camera.y) && (this.cow.y-this.cow.height/2<(this.camera.y+this.camera.height)) ) {
		this.ctx.drawImage(
			this.cow.Sheet, // image
			this.cow.animframe * map.tsize, // source x
			this.cow.animline * map.tsize, // source y
			map.tsize, // source width
			map.tsize, // source height
			(this.cow.x - this.cow.width / 2 - this.camera.x)*xscale,  // target x
			(this.cow.y - this.cow.height / 2 - this.camera.y)*yscale, // target y
			map.tsize*xscale, // target width
			map.tsize*yscale // target height
		);
	}

	// Slime
	if (this.slime){
		for (var i=0;i<this.slime.length;i++){
			// in camera view?
			if ( ((this.slime[i].x)>this.camera.x) && ((this.slime[i].x)<(this.camera.x+this.camera.width)) && (this.slime[i].y+this.slime[i].height/2>this.camera.y) && (this.slime[i].y-this.slime[i].height/2<(this.camera.y+this.camera.height)) ) {
				this.ctx.drawImage(
					this.slime[i].Sheet, // image
					this.slime[i].animframe * map.tsize, // source x
					this.slime[i].animline * map.tsize, // source y
					map.tsize, // source width
					map.tsize, // source height
					(this.slime[i].x - this.slime[i].width / 2 - this.camera.x)*xscale,  // target x
					(this.slime[i].y - this.slime[i].height / 2 - this.camera.y)*yscale, // target y
					map.tsize*xscale, // target width
					map.tsize*yscale // target height
				);
			}
		}
	}
	
	// DeadSlime
	if (this.deadslime){
		for (var i=0;i<this.deadslime.length;i++){
			// in camera view?
			if ( ((this.deadslime[i].x)>this.camera.x) && ((this.deadslime[i].x)<(this.camera.x+this.camera.width)) && (this.deadslime[i].y+this.deadslime[i].height/2>this.camera.y) && (this.deadslime[i].y-this.deadslime[i].height/2<(this.camera.y+this.camera.height)) ) {
				this.ctx.drawImage(
					this.deadslime[i].Sheet, // image
					0 * map.tsize, // source x
					4 * map.tsize, // source y
					map.tsize, // source width
					map.tsize, // source height
					(this.deadslime[i].x - this.deadslime[i].width / 2 - this.camera.x)*xscale,  // target x
					(this.deadslime[i].y - this.deadslime[i].height / 2 - this.camera.y)*yscale, // target y
					map.tsize*xscale, // target width
					map.tsize*yscale // target height
				);
			}
		}
	}
	
	// if there is a shot draw it
	if (this.hero.shoot){
		// in camera view?
		if ( ((this.hero.shot.x)>this.camera.x) && ((this.hero.shot.x)<(this.camera.x+this.camera.width)) && (this.hero.shot.y+this.hero.shot.height/2>this.camera.y) && (this.hero.shot.y-this.hero.shot.height/2<(this.camera.y+this.camera.height)) ) {
			this.ctx.drawImage(
				this.tileAtlas, // image
				7 * map.tsize, // source x
				2 * map.tsize, // source y (now multirow tileset)
				map.tsize, // source width
				map.tsize, // source height
				(this.hero.shot.x - this.hero.shot.width / 2 - this.camera.x)*xscale,  // target x
				(this.hero.shot.y - this.hero.shot.height / 2 - this.camera.y)*yscale, // target y
				map.tsize*xscale, // target width
				map.tsize*yscale // target height
			);	
		}
	}
	
	// OSD
	if (story>0){
		context.font = 'bold 20pt Calibri';
		context.fillStyle = 'white';
		context.fillText('Ludum Dare 37 - One room', 2, 24);
		context.fillText('Points:'+points, 2, 48);
		context.fillStyle = '#33FFFF';
		context.fillText('Keys:'+keys+'/'+totalkeys, 2, 72);
		context.fillStyle = 'yellow';
		context.fillText('Time:'+Math.round(timeleft), 2, 96);
		context.fillStyle = 'red';
		context.fillText('Ammo:'+ammo, 2, 128);
	}
};

function flowerFill(map,f1,f2,f3,f4){ // fills a map with random flowers (f1-f4 are the parts.Sum=1)
	// idea walk trough layers[1] and compare with layers[0]
	for (var row=0;row<map.rows;row++){
		for (var col=0;col<map.cols;col++){
			if (map.layers[1][row*map.cols+col]==0 && map.layers[0][row*map.cols+col]>10){
				// find random flower
				var flower=21;
				var tmp=Math.random();
				if (tmp>f1)flower=22;
				if (tmp>f1+f2)flower=23;
				if (tmp>f1+f2+f3)flower=24;
				map.layers[1][row*map.cols+col]=flower;
			}
		}
	}
}
function showSplash(imgName){	// Show splash screen
	// pause the game
	Game.paused=true;
	// Load Image
	var imgObj = new Image();
	// draw Image
	imgObj.onload = function(){
		context.clearRect(0,0,canvas.width,canvas.height);
		context.drawImage(
			imgObj,
			0,
			0,
			1024,
			621,
			0,
			0,
			canvas.width,
			canvas.height
		);
	};
	imgObj.src = 'gfx/'+imgName+'.png';
	setTimeout(function(){Game.paused=false;Game.init();},7000);
}
function cloneObject(obj) {	// http://heyjavascript.com/4-creative-ways-to-clone-objects/
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}
	var temp = obj.constructor(); // give temp the original obj's constructor
	for (var key in obj) {
		temp[key] = cloneObject(obj[key]);
	}
	return temp;
}
