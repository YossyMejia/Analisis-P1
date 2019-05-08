export class objetoMapa{
    public duracion:number;
    public tipoEfecto:number;
    public sample:number[][];
    //public creacion:number[][];

    public constructor(pDuracion:number,pTipo:number){
        this.duracion=pDuracion;
        this.tipoEfecto=pTipo;
        this.sample=[];
        //this.creacion=[[],[]];
    }
    
    public setSmple(psample:number[][]){
        this.sample=psample;
    }
    
    public verSample(){
        console.log(this.sample);
    }

    public crearEfecto(creacion:number[][]):number[][]{
        switch(this.tipoEfecto){
            case 1:
                return this.efectoLoop(creacion);
            case 2:
                return this.efectoLR(creacion);
            default:
                return this.efectoSS(creacion);
        }
    }

    public efectoLoop(creacion:number[][]):number[][]{
        for(var cont=0;cont<this.duracion;cont++){
            for(var pos in this.sample[0]){            
                creacion[0].push(this.sample[0][pos]);
                creacion[1].push(this.sample[1][pos]);
            }
        }
        return creacion;
    }
    public efectoLR(creacion:number[][]):number[][]{
        var flag:boolean=true;
        for(var cont=0;cont<this.duracion;cont++){
            if(flag){
                for(var pos in this.sample[0]){
                    creacion[0].push(0);
                    creacion[1].push(this.sample[1][pos]);
                }
                flag=false;
            }else{
                for(var pos in this.sample[0]){
                    creacion[0].push(this.sample[0][pos]);
                    creacion[1].push(0);
                }
                flag=true;
            }
        }
        return creacion;
    }
    public efectoSS(creacion:number[][]):number[][]{
        var flag:boolean=true;
        for(var cont=0;cont<this.duracion;cont++){
            if(flag){
                for(var pos in this.sample[0]){
                    creacion[0].push(this.sample[0][pos]);
                    creacion[1].push(this.sample[1][pos]);
                }
                flag=false;
            }else{
                for(var pos in this.sample[0]){
                    creacion[0].push(0);
                    creacion[1].push(0);
                }
                flag=true;
            }
        }
        return creacion;
    }

}

export class myMap{
    public matriz:objetoMapa[][];
    public tonadas:number[][][];
    public creacion:number[][];
    
    public constructor(pTonadas:number[][][]){
        this.matriz=[];
        this.tonadas=pTonadas;
        this.creacion=[[],[]];
    }

    public cargarEstructura(){// hace new's a la matriz, poniendo estatico la duracion y el tipo de efecto
        this.matriz=[[new objetoMapa(5,2),new objetoMapa(6,1),new objetoMapa(4,2)],
                    [new objetoMapa(3,3),new objetoMapa(2,2),new objetoMapa(3,1)],
                    [new objetoMapa(4,2),new objetoMapa(6,1),new objetoMapa(5,3)],
                    [new objetoMapa(2,1),new objetoMapa(3,2),new objetoMapa(4,3)],
                    [new objetoMapa(6,1),new objetoMapa(4,3),new objetoMapa(3,1)]];
    }
    public setTonadas(pTonadas:number[][][]){
        this.tonadas=pTonadas;
    }
    public getRandom(max:number,min:number):number{
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    public asignarTonadas(){// va a cada elemento de la matriz y le asigan un segundo random de "tonadas" y ademas va llenando creacion con el nuevo efecto
        for(var fila=0;fila<5;fila++){
            for(var columna=0;columna<3;columna++){
                this.matriz[fila][columna].setSmple(this.tonadas[this.getRandom(0,9)]);
                this.creacion=this.matriz[fila][columna].crearEfecto(this.creacion);
            }
        }
    }
    public getCreacion():number[][]{ // retorna "creacion"
        return this.creacion;
    }
}

