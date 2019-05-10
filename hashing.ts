import {Segundo} from './Segundo';

export class myHash{
    public hashSubidasS1:Map<number,Segundo[]>; 
    public hashLlanosS1:Map<number,Segundo[]>; 
    public hashBajadasS1:Map<number,Segundo[]>; 
    public hashSubidasS2:Map<number,Segundo[]>; 
    public hashLlanosS2:Map<number,Segundo[]>;
    public hashBajadasS2:Map<number,Segundo[]>;
    public pSubidas:number[];
    public pBajadas:number[];
    public pLlanos:number[];

    public constructor(){
        this.hashSubidasS1=new Map<number,Segundo[]>();
        this.hashLlanosS1=new Map<number,Segundo[]>();
        this.hashBajadasS1=new Map<number,Segundo[]>();
        this.hashSubidasS2=new Map<number,Segundo[]>();
        this.hashLlanosS2=new Map<number,Segundo[]>();
        this.hashBajadasS2=new Map<number,Segundo[]>();
        this.pSubidas=[];this.pBajadas=[];this.pLlanos=[];// se guardan los porcentajes que han sido usados, esto para evitar entrar al hash
                                                          // donde la lista asociada este vacia
    }

    public iniciarHash(){// hay rangos aumentados, ya no serian solo cuatro sino que se dividen de 100 en 100 para obtener valores mas dispersos
                         // y con mas similitud entre ellos
        var porcentaje;
        for(var valor=100;valor<=4000;valor=valor+100){
            porcentaje=valor/4000;
            this.hashSubidasS1.set(porcentaje,[]);
            this.hashLlanosS1.set(porcentaje,[]);
            this.hashBajadasS1.set(porcentaje,[]);
            this.hashSubidasS2.set(porcentaje,[]);
            this.hashLlanosS2.set(porcentaje,[]);
            this.hashBajadasS2.set(porcentaje,[]);
        }
    }

    public limpiarHash(){
        this.hashBajadasS1.clear();
        this.hashLlanosS1.clear();
        this.hashSubidasS1.clear();
        this.hashBajadasS2.clear();
        this.hashLlanosS2.clear();
        this.hashSubidasS2.clear();
    }

    public reEstructurarS1(listaSegundos:Segundo[]){ // recibe una lista de segundos (generada por secuencias), y luego se itera para estructurar
                                                      // cada segundo
        for(var seg of listaSegundos){
            this.estructurarInformacion(seg,this.hashBajadasS1,this.hashSubidasS1,this.hashLlanosS1);
        }
    }

    public estructurarInformacion(segundito:Segundo,hashBajadas:Map<number,Segundo[]>,hashSubidas:Map<number,Segundo[]>,hashLlanos:Map<number,Segundo[]>){
        var porcentajeBajadas = this.redondear(segundito.getBajadas());
        //if(this.pBajadas.indexOf(porcentajeBajadas)==-1){//para saber a que valores hacerle random y evitar una lista vacia cuando se obtenga del hash
            this.pBajadas.push(porcentajeBajadas);
        //}
        this.guardarEnHash(porcentajeBajadas,segundito,hashBajadas);
        
        var porcentajeLlanos = this.redondear(segundito.getLlanos());
        //if(this.pLlanos.indexOf(porcentajeLlanos)==-1){
            this.pLlanos.push(porcentajeLlanos);
        //}
        this.guardarEnHash(porcentajeLlanos,segundito,hashLlanos);
        
        var porcentajeSubidas = this.redondear(segundito.getSubida());
        //if(this.pSubidas.indexOf(porcentajeSubidas)==-1){
            this.pSubidas.push(porcentajeSubidas);
        //}
        this.guardarEnHash(porcentajeSubidas,segundito,hashSubidas);
    }

    public redondear(porcentaje:number):number{// se adapta el redondeo a los nuevos valores del hash
        for(var valor=100;valor<=4000;valor=valor+100){
            if(porcentaje>=valor-100 && porcentaje<=valor){
                return valor/4000;
            }
        }
        return 1;
    }
    
    //Guarda el objeto que recibe como parametro en la lista correspondiente segun su porcentaje
    public guardarEnHash(porcentaje:number,segundito:Segundo,hash:Map<number,Segundo[]>){
        var arregloBajadas= hash.get(porcentaje);
        if(arregloBajadas!=undefined){
            arregloBajadas.push(segundito);
            hash.set(porcentaje,arregloBajadas);
        }
    }

    public obtenerLista(hash:Map<number,Segundo[]>,key:number):Segundo[]{
        var ret=hash.get(key);
        if(ret!=undefined){
            return ret;
        }
        return [];
    }

    public getRandom(min:number,max:number):number{
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    public getListaMatchS1():Segundo[][]{//obtiene un random y lo busca en su respectiva lista (esta lista tienen los valores o porcentajes 
                                         //en los q se debe hacer random ya que podria haber listas vacias si solo se busca en el hash)
        var listaDeMatchS1:Segundo[][] = [];
        var random = this.pSubidas[this.getRandom(0,this.pSubidas.length-1)];
        var random2 = this.pLlanos[this.getRandom(0,this.pLlanos.length-1)];
        var random3 = this.pBajadas[this.getRandom(0,this.pBajadas.length-1)];
        
        listaDeMatchS1.push(this.obtenerLista(this.hashSubidasS1,random));
        listaDeMatchS1.push(this.obtenerLista(this.hashLlanosS1,random2));
        listaDeMatchS1.push(this.obtenerLista(this.hashBajadasS1,random3));
        return listaDeMatchS1
    }

}