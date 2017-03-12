import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Register}           from './register';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class RegisterService {
  constructor (private http: Http) {}

  private registerUrl = 'https://onyxconnectsapi.herokuapp.com/register';

  regist (data: Register) : Observable<any>  {

    let body = JSON.stringify({ data });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.registerUrl, body, options)
                    .map(res =>  {res.json();})
                    .catch((error:any) => {
                      return Observable.throw(error.json() || 'Server error');
                     });
  }

}
