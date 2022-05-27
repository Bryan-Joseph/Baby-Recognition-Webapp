Status = false;
isBabyFound = true;
isSoundPlaying = false;

function preload() {
    alerts = loadSound('alert.mp3');
}

function setup(){
    canv = createCanvas(500,400);
    canv.parent("canvHolder");

    cam = createCapture(VIDEO);
    cam.hide();
    cam.size(500,400);    
}

function start(){
    objectDetector = ml5.objectDetector('cocossd',()=>{
        console.log('model loaded');
        Status = true;
    });
}

function draw(){
    image(cam,0,0,500,400);

    if (Status) {
        objectDetector.detect(cam,(error,results)=>{
            isBabyFound = false;
            if (error) {
                console.error(error);
            }else{
                
                for (let i = 0; i < results.length; i++) {
                    const result = results[i];
                    // console.log(result);
                    x = result.normalized.x * 500;
                    y = result.normalized.y * 400;
                    width = result.normalized.width * 500;
                    height = result.normalized.height * 400;

                    percentage = Math.round(result.confidence * 100);

                    stroke(255,0,0);
                    fill(255,0,0);
                    text(`${result.label} ${percentage}%`, x + 20, y + 20);                    
                    noFill();
                    rect(x,y,width,height);
                    
                    if (result.label =="person") {
                        isBabyFound = true;
                    }

                }
                

                if (isBabyFound) {
                    alerts.stop();
                    isSoundPlaying = false;
                    document.getElementById("isfoundL").innerHTML = "Baby is found.";
                }else if (!isBabyFound && !isSoundPlaying) {
                    
                    // if (!alert.isPlaying) {
                        alerts.play();
                        isSoundPlaying = true;
                        document.getElementById("isfoundL").innerHTML = "Baby isn't found.";
                    // }
                }

                if (result.length <= 0 && !isSoundPlaying) {
                    alerts.play();
                    document.getElementById("isfoundL").innerHTML = "Baby isn't found.";
                }
            }
        });
    }
}