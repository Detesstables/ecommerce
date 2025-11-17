import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Region {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class RegionsService {

  private apiUrl = 'http://localhost:3000/regions';

  constructor(private http: HttpClient) {}

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.apiUrl);
  }
}