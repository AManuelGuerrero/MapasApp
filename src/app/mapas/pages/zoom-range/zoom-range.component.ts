import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container{
        width: 100%;
        height: 100%;
      }
      .row{
        background-color: white;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        position: fixed;
        z-index:999;
        width: 400px;
      }
    `
  ]
})
export class ZoomRangeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!:ElementRef;

  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number,number] = [-4.372459719732231,37.32673171919045];
  constructor() { }

  ngOnDestroy(): void {
    this.mapa.off('zoom',() => {});
    this.mapa.off('zoomend',() => {});
    this.mapa.off('move',() => {});
  }
  
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });

      this.mapa.on('zoom', (ev) =>{
        const zoomActual = this.mapa.getZoom();
        this.zoomLevel = zoomActual;
      });

      this.mapa.on('zoomend', (ev) =>{
        const zoomActual = this.mapa.getZoom();
        if(zoomActual > 18){
          this.mapa.zoomTo(18);
        }
      });

      this.mapa.on('move',(event)=>{
        const target = event.target;
        const {lng, lat} = target.getCenter();
        this.center = [lng,lat];
      })
  }

  ngOnInit(): void {
   
  }

  zoomOut(){
    this.mapa.zoomOut();
  }

  zoomInt(){
    this.mapa.zoomIn();
  }

  zoomCambio(valor: string){
    console.log(valor);
    this.mapa.zoomTo(Number(valor));
    
  }

}
