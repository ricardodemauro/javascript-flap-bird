let obsColl = [];
let bird = { draw: () => false, update: () => false };
let img;
let slop = 1.5;

function setup() {
    createCanvas(640, 500);

    img = loadImage('assets/mario_sprite.jpg');
    for (let i = 0; i < 3; i++) {
        //0 - 150 - 300   -->
        //let w = random(0, 150);
        let w = width + (i * 250);
        let color = { r: random(0, 255), g: random(0, 255), b: random(0, 255) };
        obsColl.push(new Obstaculo(w, slop, color));
    }
    bird = new Bird(130, 130);
}

function draw() {
    // if (mouseIsPressed) {
    //     fill(0);
    // } else {
    //     fill(255);
    // }
    // ellipse(mouseX, mouseY, 80, 80);

    clear();
    background(img);

    for (let i = 0; i < obsColl.length; i++) {
        obsColl[i].update();
        obsColl[i].draw();
    }
    bird.update();
    bird.draw();

    if(bird.colided()) {
        bird.reset();
    }
}

class Obstaculo {
    initialX = 0;
    x = 0;
    h = 80;
    w = 80;
    slop = 0;
    gapPosition = 0;
    gapHeight = 120;
    color = { r: 0, g: 0, b: 0 };

    constructor(x, slop, color) {
        this.x = x;
        this.initialX = x;
        this.slop = slop;
        this.loadGapPosition();
        this.color = color;
    }

    loadGapPosition() {
        this.gapPosition = random(0, height - this.gapHeight);
    }

    draw() {
        fill(this.color.r, this.color.g, this.color.b);

        rect(this.x, 0, 50, this.gapPosition - (this.gapHeight / 2));

        rect(this.x, this.gapPosition + (this.gapHeight / 2), 50, height - this.gapPosition + (this.gapHeight / 2));
    }

    update() {
        this.x -= this.slop;

        if (this.x + this.w < 0) {
            this.x = width;
            this.loadGapPosition();
        }
    }
}

class Bird {
    x = 0;
    y = 0;
    h = 40;
    w = 40;

    mass = 10;
    position = createVector(0, 0);
    velocity = createVector(0, 0);
    acceleration = createVector(0, 0);

    isColided = false;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.position = createVector(x, y);
    }

    draw() {
        if (mouseIsPressed) {
            fill(0);
        } else {
            fill(255);
        }
        ellipse(this.x, this.position.y, this.w, this.h);
    }

    applyForce(force) {
        this.acceleration.add(0, force);
        this.acceleration = this.acceleration.limit(3);
    }

    update() {
        if (mouseIsPressed) {
            this.applyForce(-0.3);
        } else {
            this.applyForce(0.2);
        }
        
        this.velocity.add(this.acceleration);
        this.velocity = this.velocity.limit(4);

        this.position.add(this.velocity);

        // We must clear acceleration each frame
        this.acceleration.mult(0);

        console.log(this.velocity.y);
        console.log(this.acceleration.y);

        this.colidedWithFloor();
    }

    colidedWithFloor() {
        this.isColided = this.position.y + this.h / 2 >= height;
        console.log(`Colided with ${this.isColided} y ${this.position.y} h ${height}`);
    }

    reset() {
        this.position = createVector(this.x, this.y);
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);
    }

    colided = () => this.isColided;
}