import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  private apiKey: string = 'p0OXuow7CJ2GQl64YVeOrwmIIMl4tBPt';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs/search';

  public resultados: Gif[] = []; // es PUBLICA

  get historial() { return [...this._historial]; }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  } //CTRL + PTO

  buscarGifs(query: string) {
    query = query.trim().toLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query); // al principio
      this._historial = this._historial.splice(0, 10); //cojo 10
      //localStorage.setItem('historial',query);
      localStorage.setItem('historial', JSON.stringify(this._historial)); // a STRING
    }
    //console.log(this._historial);
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', query)
      .set('limit', 10);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}`,{params})
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados)); // a STRING
      });
  }
}
