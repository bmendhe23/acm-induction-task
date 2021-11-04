const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArr;

//get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
};

window.addEventListener('mousemove', 
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
)

//create particles
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    //method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    //check particle position, check mouse position, move the particle, draw the particle
    update() {
        //check if particle is still within canvas
        if(this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        } 
        if(this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        } 

        //check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < mouse.radius + this.size) {
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 6;
                this.directionX = -this.directionX;
            }
            if(mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 6;
                this.directionX = -this.directionX;
            }
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 6;
                this.directionY = -this.directionY;
            }
            if(mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 6;
                this.directionY = -this.directionY;
            }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

//create particle array
function init() {
    particleArr = [];
    let numberOfParticles = (canvas.height * canvas.width) / 13000;

    for(let i = 0 ; i < numberOfParticles ; i++) {
        let size = (Math.random() * 4) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 3.5) - 2;
        let directionY = (Math.random() * 3.5) - 2;
        let color = 'rgba(255,255,255,0.5)';

        particleArr.push(new Particle(x, y, directionX, directionY, size,color));
    }
}

//animate loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for(let i = 0 ; i < particleArr.length ; i++) {
        particleArr[i].update();
    }
    connect();
}

//check if particles are close enough to draw a line between them
//j is the particle and k are all the consecutive particles
function connect() {
    for(let j = 0 ; j < particleArr.length ; j++) {
        for(let k = 0 ; k < particleArr.length ; k++) {
            let distance = ((particleArr[j].x - particleArr[k].x)*(particleArr[j].x - particleArr[k].x)) + ((particleArr[j].y - particleArr[k].y)*(particleArr[j].y - particleArr[k].y));

            if(distance < (canvas.width) * (canvas.height)) {
                let opacityValue = .8 - (distance/20000);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = .5;
                ctx.beginPath();
                ctx.moveTo(particleArr[j].x, particleArr[j].y);
                ctx.lineTo(particleArr[k].x, particleArr[k].y);
                ctx.stroke();
            }
        }
    }
}

init();
animate();

//resize fix
window.addEventListener('resize',
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    }
)

//mouse out event 
window.addEventListener('mouseout',
    function() {
        mouse.x = undefined;
        mouse.y = undefined;
    }
)



