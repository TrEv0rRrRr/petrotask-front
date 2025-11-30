import { Pipe, PipeTransform } from '@angular/core';

type PipeCallback = (...value: any) => any;
@Pipe({
  name: 'callback'
})
export class CallbackPipe implements PipeTransform {

  transform(value: any | any[], callback: PipeCallback): any {
    if(!value || !callback){
      return '';
    }
    if(Array.isArray(value)){
      return (callback(...value));
    }
    return callback(value);
  }

}
