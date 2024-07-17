import { Gif, SearchResponse } from './../interfaces/gifs.interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private _tagsHistory: string[] = []
  private APIKEY:string = 'kyucaTx2tcD7y75mGUtWJvj71Dcx6PHy'
  private SERVICEURL: string = 'https://api.giphy.com/v1/gifs'
  public gifsList: Gif[] = []

  constructor( private _httpClient: HttpClient) {
    this.loadLocalStorage()
  }

  get tagsHistory(): string[]{
    return [...this._tagsHistory]
  }

  public searchTag( tag:string ):void{
    if( tag.length === 0 ) return
    this.organizeHistory( tag )
    const params = new HttpParams()
          .set('api_key', this.APIKEY)
          .set('limit', 10)
          .set('q', tag)

    this._httpClient.get<SearchResponse>( `${this.SERVICEURL}/search`, { params } )
    .subscribe( (resp) =>  this.gifsList = resp.data )
  }

  private organizeHistory( tag: string){
    tag = tag.toLocaleLowerCase()
    if( this._tagsHistory.includes( tag ) ){
      this._tagsHistory = this._tagsHistory.filter( oldTag => oldTag !== tag )
    }
    this._tagsHistory.unshift( tag )
    this._tagsHistory = this._tagsHistory.splice(0,10)
    this.saveLocalStorage()
  }

  private saveLocalStorage():void{
    localStorage.setItem('historyTag', JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage():void{

    if( !localStorage.getItem('historyTag') ) return

    const temp = localStorage.getItem('historyTag')
    this._tagsHistory = JSON.parse( temp! )

    if( this._tagsHistory.length === 0) return

    this.searchTag( this._tagsHistory[0])
  }
}
