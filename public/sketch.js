let socket;
let col;
let cx ;
let cy ;
let figura;
let datos; 


function setup() {
	createCanvas(windowWidth, windowHeight);
	background('#008040');
	//LLamamos la coneccion
	socket =io.connect('http://192.168.1.68:5000');
	//Enviamos un mensaje de que se esta realizando algo
	socket.on('mouse',nuevoDibujo);
	textSize(80); 
	fill(255);
	text('Pizarrón', windowWidth/2-160, 60);


}


//Toma el estado de la figura seleccionada
function Estadofigura(data) {
	figura=data;
}
//Toma el color que se selecciona
$("input[name=color]").change(function(){
		col=$(this).val();
});

// se pinta la figura en el canvas local 
function mouseDragged() {
   	//comparamos la distancia del los primeros muntos (x,y) con diferencia de
  	//mouseX,mouseY
	var d = dist(cx, cy, mouseX, mouseY);
	 
		//evaluamos el estado de la figura que se selecciono
		if (figura === '2') {
			//Guardamos los datos obtenidos en una estancia asociativa
			datos = {
				x: cx,
				y: cy,
				x2: mouseX,
				y2: mouseY,
				fig: figura,
				colores: col
			}
		}else{
			//Guardamos los datos obtenidos en una estancia asociativa
			datos = {
				x: cx,
				y: cy,
				size: d,
				fig: figura,
				colores: col
			}
		}
		//enviamos los datos al servidor
		socket.emit('mouse',datos);
		 //color de la figura, del cual se selecciono
			fill(datos.colores);
			//se incorpora la sombra del mismo color
			stroke(datos.colores);
		//verificamos el estado de la figura par poder pintarla
		switch(datos.fig){
		case '0':
			
			//se ennvia los datos por parametros a la funcion del cual generara
			// la figura
			puntoMedio(datos.x,datos.y, datos.size);
		break;

		case '1':
			//centramos la figura rectangular
			rectMode(CENTER);
			//se ennvia los datos por parametros a la funcion del cual generara
			// la figura
			rect(datos.x, datos.y,datos.size, datos.size);
		break;

		case '2':
			//se ennvia los datos por parametros a la funcion del cual generara
			// la figura
			Bresenham(datos.x, datos.y, datos.x2, datos.y2);
		break;
		}
}

//Toma las primeras posiciones de X y Y del primer clic
function mousePressed(){
	cx = mouseX;
	cy = mouseY;
}

// canvas de la nueva ventana
function nuevoDibujo(dato) {
	noStroke();
	 
	switch(dato.fig){
		case '0':
		fill(dato.colores);
		stroke(dato.colores);
		puntoMedio(dato.x, dato.y, dato.size);
		break;

		case '1':
		rectMode(CENTER);
		fill(dato.colores);
		stroke(dato.colores);
		rect(dato.x, dato.y, dato.size, dato.size);
		break;

		case '2':
		fill(dato.colores);
		stroke(dato.colores);
		Bresenham(dato.x, dato.y, dato.x2, dato.y2);
		break;
	}


}


function Bresenham(x0, y0, x1, y1){
   let dx = Math.abs(x1-x0);
   let dy = Math.abs(y1-y0);
   let sx;
   let sy;

   	if (x0 < x1) {
   		sx=1
   	}else
   	{
   		sx=-1
   	}
   
   if (y0 < y1) {
   	sy=1
   }else{
   	sy=-1
   }

   let err = dx-dy;

   while(true){
     line(x0,y0,x1,y1);

     if (Math.abs(x0-x1)<0.0001 && Math.abs(y0-y1)<0.0001){ 
     	break
     }; 

     var e2 = 2*err;
     if (e2 >-dy){ 
     	err -= dy; 
     	x0  += sx; 
     }
     if (e2 < dx){ 
     	err += dx; 
     	y0  += sy; 
     }
   }
}


 

function puntoMedio(xc, yc , r){
	let x = 0;
	let y = r;		

	let p= 5/4 - r; 
	while (x < y){
		x = x + 1;
	    if (p < 0)
	    	p = p + 2*x + 1;
	    else {
	    	y = y - 1;
	    	p = p + 2*(x - y) + 1;
	    }
    	line(xc + x+2, yc + y+2,xc + y , yc + x+2); 

    	line(xc + y, yc - x,xc + x+2,yc - y); 

    	line(xc - x, yc - y,xc - y, yc - x); 

    	line(xc - y,yc + x+2,xc - x,yc + y); 

	}
}