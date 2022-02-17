import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})

export class DateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any): any {
    return super.transform(value, 'dd-MMM-yyyy');
  }
}

@Pipe({
  name: 'fromNow'
})

export class FromNowPipe implements PipeTransform {
  transform(value: any): any {
    return moment(new Date(value)).fromNow();
  }
}
