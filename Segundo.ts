export class Segundo{
    private tasaDeVariacion:number;
    private subidas:number;
    private bajadas:number;
    private llanos:number;

    public constructor(tasaDeVariacion:number,subidas:number,bajadas:number,llanos:number){
        this.tasaDeVariacion=tasaDeVariacion;
        this.subidas = subidas;
        this.bajadas = bajadas;
        this.llanos = llanos;
    }

    public getTasa():number{
        return this.tasaDeVariacion;
    }

    public getSubida():number{
        return this.subidas;
    }
    
    public getBajadas():number{
        return this.bajadas;
    }

    public getLlanos():number{
        return this.llanos;
    }
}