
/*
	Variabili utilizzate per instanziare una dropZone
*/
const dropZone = document.getElementById("dropZone");
const overDrop = document.getElementById("overDrop");
const mesh_zone = document.getElementById("mesh_zone");
let instructionCounter = 0;
let mesh_texture_vertex = [];
let mesh_geometry_faces = [];
let texture_matrix;



const progress_button = document.getElementById("progress_button");
let vertex_progress_counter = 0;
let faces_progress_counter = 0;
let increment_value = 1;
const interval_time = 1000;

progress_button.addEventListener("click", function(){
	//Faccio partire il set interval condizionato

			
			for(let i = 0; i< 50; i++){
				let faces_point = [];
				if (mesh_geometry_faces[faces_progress_counter+i] != null){
					const first_a = mesh_texture_vertex[mesh_geometry_faces[faces_progress_counter+i]["first"]-1]["u"];
					const second_a = mesh_texture_vertex[mesh_geometry_faces[faces_progress_counter+i]["first"]-1]["v"];
					const third_a = 0;
					const first_b = mesh_texture_vertex[mesh_geometry_faces[faces_progress_counter+i]["second"]-1]["u"];
					const second_b = mesh_texture_vertex[mesh_geometry_faces[faces_progress_counter+i]["second"]-1]["v"];
					const third_b = 0;
					const first_c = mesh_texture_vertex[mesh_geometry_faces[faces_progress_counter+i]["third"]-1]["u"];
					const second_c = mesh_texture_vertex[mesh_geometry_faces[faces_progress_counter+i]["third"]-1]["v"];
					const third_c = 0;
					const first_d = mesh_texture_vertex[mesh_geometry_faces[faces_progress_counter+i]["fourth"]-1]["u"];
					const second_d = mesh_texture_vertex[mesh_geometry_faces[faces_progress_counter+i]["fourth"]-1]["v"];
					const third_d = 0;
					const a = new BABYLON.Vector3(first_a*20, second_a*20, third_a*20);
					const b = new BABYLON.Vector3(first_b*20, second_b*20, third_b*20);
					const c = new BABYLON.Vector3(first_c*20, second_c*20, third_c*20);
					const d = new BABYLON.Vector3(first_d*20, second_d*20, third_d*20);
					faces_point.push(a);
					faces_point.push(b);
					faces_point.push(c);
					faces_point.push(d);
					
				}
				faces_progress_counter += 1;
				line = BABYLON.MeshBuilder.CreateLines("lines", {points: faces_point}, scene);
			hl.addMesh(line, new BABYLON.Color3(0, 0 , 1));
			location.hash = "parsed_line_" + faces_progress_counter;
			}

			
				
				//
			//}
		
		
	//}, interval_time);
	

});


document.getElementById("import_button").addEventListener("click", function(){

	plane.dispose();

	let dataUrl;
	BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine,camera, 600, function(data){
		dataUrl = data;
	})
		//grab the context from your destination canvas
	var destCtx = document.getElementById("textureCanvas").getContext('2d');


	var img = new Image;
	img.onload = function(){
	  destCtx.drawImage(img,0,0); // Or at whatever offset you like
	};
	img.src = dataUrl;

	flipHorizontally(img,0,30, destCtx);

	//call its drawImage() function passing it the source canvas directly
	//destCtx.drawImage(texCanvas, 0, 0);
});










/*
	Funzione per mostrare la dropZone
*/
function showDropZone() {
	dropZone.style.visibility = "visible";
}
/*
	Funzione per nascondere la dropZone
*/
function hideDropZone() {
	dropZone.style.visibility = "hidden";
	overDrop.style.display = "none";
	mesh_zone.style.display = "block";
}

/*
	Funzione che permette il drag del file all'interno della dropZone
*/
function allowDrag(e) {
	e.dataTransfer.dropEffect = "copy";
	e.preventDefault();
}


/*
	Funzione del primo parsing che viene effettuato sulla linea che viene passata. Il file di per 
	se è giè organizzato in modo da contenere un informazione (che sia, v, vn o altro) in ciascuna
	riga, pertanto viene effettuato il parsing riga per riga per ottenere le informazioni

	Quando il parser si accorge che non sta ricevendo in ingresso un commento, separa gli oggetti divisi
	da degli spazi con la seguente notazione

	v [posizione x] [posizione y] [posizione z] [colore r] [colore g] [colore b] 


*/
function firstParse(line){
	if(isComment(line)){
		const comment = document.createElement("p");
		comment.classList.add("obj_comment");
		comment.innerHTML = line;
		return comment;
	}else{
		instructionCounter += 1;
		//Creation of the composed div
		const div = document.createElement("div");
	
		/**
		* Condizione per la quale ci interessa prendere solo i vettori geometrici
		*/
		if (line.charAt(0)=="v" && line.charAt(1)=="t") {
			parseTextureVertex(line);
			div.innerHTML = line;
			div.style.display = "flex";
			div.id = "parsed_line_" + instructionCounter;
			return div;
		}else if (line.charAt(0)=="f" && line.charAt(1)==" ") {
			parseTextureFaces(line);
			div.innerHTML = line;
			div.style.display = "flex";
			div.id = "parsed_line_" + instructionCounter;
			return div;
		}else{
			return "no";
		}
		
	}
}

/**
	Questa funzione si occupa di parsare la linea in input e pushare gli oggetti all'
	interno dell'array mesh_texture_vertex
**/
function parseTextureVertex(line){
	const array_linea = line.split(" ");
	/* 
		A questo punto, il primo dell'array è sicuramente la v
		La tripletta successiva indica le coordinate x, y, z
		La tripletta successiva indica i colori
		Creo quindi l'oggetto da pushare dentro l'array
	*/
	var temp = {
		"u" : array_linea[1],
		"v" : array_linea[2]
	}
	mesh_texture_vertex.push(temp);
}


function parseTextureFaces(line){
	const array_linea = line.split(" ");
	/*
		Ora bisogna splittare ulteriormente in base alle /
		in modo da ottenere il vertice geometrico preciso
	*/
	const first = array_linea[1].split("/")[1];
	var temp = {
		"first" : first,
		"second" : array_linea[2].split("/")[1],
		"third" : array_linea[3].split("/")[1],
		"fourth": first
	}
	mesh_geometry_faces.push(temp);
}





// Function to check if the parsed line is a comment
// Return true or false
function isComment(line){
	return (line.charAt(0) == "#");
}



// Function that handles the drop of the file and then start parsing
function handleDrop(e) {
	e.preventDefault();
	hideDropZone();
	const files = e.dataTransfer.files;
	// Control to check if the user dropped one ore more files... a type check should be done too..
	if(files.length > 1){
		alert("You cannot insert more than one file");
	}
	const reader = new FileReader();

	reader.onload = (event ) => {
		const file = event.target.result;
		const allLines = file.split(/\r\n|\n/);
		// Reading line by line
		allLines.map((line) => {

			/**
			* Qui avviene l'inserimento di tutto cio che mi interessa all'iterno della mesh_zone
			*/
			var firstParse_result = firstParse(line);
			if(firstParse_result!=="no"){
				mesh_zone.appendChild(firstParse_result);
			}
			//Here I create the texture square
			
		});

		texture_matrix = fillMatrix(23);
	};
	reader.onerror = (evt) => {
		alert(evt.target.error.name);
	};
	reader.readAsText(files[0]);
    

}

// 1
window.addEventListener("dragenter", function() {
	showDropZone();
});

// 2
dropZone.addEventListener("dragenter", allowDrag);
dropZone.addEventListener("dragover", allowDrag);

// 3
dropZone.addEventListener("dragleave", function() {
	hideDropZone();
});

// 4
dropZone.addEventListener("drop", handleDrop);


/*** BABYLON STUFF ***/


var canvas = document.getElementById("renderCanvas"); // Get the canvas element 

var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var hl;
var plane;



/******* Add the create scene function ******/
var createScene = function () {

            // Create the scene space
            var scene = new BABYLON.Scene(engine);

            // Add a camera to the scene and attach it to the canvas
            camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -24), scene);

		// Targets the camera to a particular position. In this case the scene origin
		    camera.setTarget(new BABYLON.Vector3(0,0,0));
		    camera.position.x = 10;
		    camera.position.y = 10;

		// Attach the camera to the canvas
		    camera.attachControl(canvas, false);
		    camera.inputs.clear();

            scene.clearColor = new BABYLON.Color3(0,0,0);


            aqua_mat = new BABYLON.StandardMaterial("mat1", scene);
            aqua_mat.emissiveColor = diffuseColor = new BABYLON.Color3(0, 0, 1);

            plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 80, height: 80}, scene);
            plane.material = new BABYLON.GridMaterial("groundMaterial", scene);
            plane.material.backFaceCulling = false;


            hl = new BABYLON.HighlightLayer("hl1", scene);
            hl.innerGlow = true;

            //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1}, scene);


            // Add lights to the scene
            var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
            var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

            BABYLON.SceneOptimizer.OptimizeAsync(scene,	OptimizerOptions(), null, null);

            // Add and manipulate meshes in the scene
            

            return scene;
    };

    var OptimizerOptions = function() {
        	var result = new BABYLON.SceneOptimizerOptions(30, 2000); // limit 30 FPS min here
        
        	var priority = 0;
        	result.optimizations.push(new BABYLON.ShadowsOptimization(priority));
        	result.optimizations.push(new BABYLON.LensFlaresOptimization(priority));
        
        	// Next priority
        	priority++;
        	result.optimizations.push(new BABYLON.PostProcessesOptimization(priority));
        	result.optimizations.push(new BABYLON.ParticlesOptimization(priority));
        
        	// Next priority
        	priority++;
        	result.optimizations.push(new BABYLON.TextureOptimization(priority, 256));
        
        	// Next priority
        	priority++;
        	result.optimizations.push(new BABYLON.RenderTargetsOptimization(priority));
        
        	// Next priority
        	priority++;
        	result.optimizations.push(new BABYLON.HardwareScalingOptimization(priority, 4));
        	
        	return result;
        }

    /******* End of the create scene function ******/    
    var camera;
    var scene = createScene(); //Call the createScene function

engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
        scene.render();
});


window.addEventListener("resize", function () { // Watch for browser/canvas resize events
        engine.resize();
});



/**
Funzione per creare un canvas con tutti i punti della mappatura vt 

*/
let last_test;
let matrix;
function fillMatrix(matrix_dimension){

	let matrix = [];
	for(var i=0; i<matrix_dimension; i++) {
	    matrix[i] = [];
	    for(var j=0; j<matrix_dimension; j++) {
	        matrix[i][j] = 1;
	    }
	}
	//alert("dimensione" + matrix_dimension + "array creati" + matrix.length + " a " + matrix[0].length);

	for(let i = 0; i < mesh_texture_vertex.length; i++){
		var temp = mesh_texture_vertex[i];
		if (temp["u"] >=0 && temp["u"]<=1) {
			if (temp["v"] >=0 && temp["v"]<=1) {
				matrix[Math.floor(temp["u"]*(matrix_dimension-1))][Math.floor(temp["v"]*(matrix_dimension-1))] = 255;

			}

		}
	}
	
	createImage(matrix, matrix_dimension);

}
let m_to_val;

function createImage(matrix, m_dimension){
	const bottom_left = document.getElementById("bottom_left_container");
	var c = document.getElementById("textureCanvas");
	var ctx=c.getContext("2d");
	var imgData=ctx.createImageData(m_dimension, m_dimension);
	let m_to_val = [];
	for (var i=0;i< m_dimension;i++){
		for(let j = 0; j< m_dimension; j++){
				m_to_val.push(matrix[i][j]);
		}
	}
	for(let i = 0; i < imgData.data.length; i++){
		i++;
		imgData.data[i] = m_to_val[i];
	}

	
	ctx.putImageData(imgData,0,0);
}




/** CANVAS DRAW **/

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;
var clickColor = new Array();
var clickGross = new Array();

context = document.getElementById("textureCanvas").getContext("2d");

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push("#" + document.getElementById("hex").value);
  clickGross.push(document.getElementById("line_input").value);
}

document.getElementById("textureCanvas").addEventListener("mouseleave", function(e){
  paint = false;
});

document.getElementById("textureCanvas").addEventListener("mouseup", function(e){
  paint = false;
});

document.getElementById("textureCanvas").addEventListener("mousedown", function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
		
  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

document.getElementById("textureCanvas").addEventListener("mousemove", function(e){
	if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});


function redraw(){
  //context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  var line_gross_input = document.getElementById("line_input").value;
  
  context.lineJoin = "round";
  
			
  for(var i=0; i < clickX.length; i++) {		
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.lineWidth = clickGross[i];
     context.strokeStyle = clickColor[i];
     context.stroke();
  }
}


function flipHorizontally(img,x,y, destCtx){

	var ctx = destCtx;
    // move to x + img's width
    ctx.translate(x+img.width,y);

    // scaleX by -1; this "trick" flips horizontally
    ctx.scale(-1,1);
    
    // draw the img
    // no need for x,y since we've already translated


context.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    ctx.drawImage(img,0,0);
    
    // always clean up -- reset transformations to default
    ctx.setTransform(1,0,0,1,0,0);
}




