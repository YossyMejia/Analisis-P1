export class individuo{
    private bajadas:number=0;
    private subidas:number=0;
    private colinas:number=0;
    private llano:number=0;
    private meseta:number=0;
    private id:number;
    public constructor(){
    }

    public añadirBajada() {
        this.bajadas++;
    } 
    public añadirSubida() {
        this.subidas++;
    } 
    public añadirColina() {
        this.colinas++;
    } 
    public añadirLlano() {
        this.llano++;
    } 
    public añadirMeseta() {
        this.meseta++;
    } 
    public obtenerPorcentajes(){
        console.log(this.bajadas);
        var formasTotales = this.bajadas+this.subidas+this.colinas+this.llano+this.meseta;
        this.bajadas = (this.bajadas/formasTotales)*100;
        this.subidas = (this.subidas/formasTotales)*100;
        this.colinas = (this.colinas/formasTotales)*100;
        this.meseta = (this.meseta/formasTotales)*100;
        this.llano = (this.bajadas/formasTotales)*100;
    }
}