import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private api = `${environment.apiUrl}/pedidos`;


  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get(`${this.api}/listar`)
  }

  buscar(id: number) {
    return this.http.get(`${this.api}/buscar?id=${id}`)
  }

  atualizar(id: number, data: any) {
    return this.http.patch(`${this.api}/atualizar?id=${id}`, data)
  }

  deletar(id: number) {
    return this.http.delete(`${this.api}/deletar?id=${id}`)
  }
}
