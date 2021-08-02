import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor{
  color: string;
  market?: mapboxgl.Marker;
  centro?: [number,number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container{
          width: 100%;
          height: 100%;
        }
      .list-group{
        position: fixed;
        top: 20px;
        right: 20px;
        z-index:99;
      }

      li{
        cursor: pointer;
      }
    `

  ]
})
export class MarcadoresComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa') divMapa!:ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number,number] = [-4.372459719732231,37.32673171919045];

  marcadores: MarcadorColor[] = [];

  constructor() { }
 

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });

      this.leerLocalStorage();

      // const maker = new mapboxgl.Marker().
      //   setLngLat(this.center)
      //   .addTo(this.mapa);
  }

  ngOnInit(): void {
  }


  irMarcador(marcador: mapboxgl.Marker){
    this.mapa.flyTo({
      center: marcador.getLngLat()
    })
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat(this.center). addTo(this.mapa);

    this.marcadores.push({market:nuevoMarcador,color});

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend',()=>{
      this.guardarMarcadoresLocalStorage();
    })
  }

  guardarMarcadoresLocalStorage(){

    const lngLaetArr: MarcadorColor[] = [];

    this.marcadores.forEach(m=>{
      const color = m.color;
      const {lng,lat} = m.market!.getLngLat();

      lngLaetArr.push({
        color:color,
        centro:[lng,lat]
      });
    });

    localStorage.setItem('marcadores',JSON.stringify(lngLaetArr));

  }

  leerLocalStorage(){

    if(!localStorage.getItem('marcadores')){
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach(m=>{

      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color:m.color
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);
      
      this.marcadores.push({color:m.color,market:newMarker});

      newMarker.on('dragend',()=>{
        this.guardarMarcadoresLocalStorage();
      })

    })


  }

  borrarMarcador(index: number){
    this.marcadores.splice(index,1)[0].market?.remove();
    this.guardarMarcadoresLocalStorage();
  }

}
