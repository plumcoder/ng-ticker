import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.scss'],
  animations: [
    trigger('inAnim', [transition(':enter', [
      style({ opacity: 0 }), animate('{{duration}}', style({ opacity: 1 }),)
    ], { params: { duration: '300ms' } })])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TickerComponent implements OnChanges {
  @ViewChildren('ticker') priceVals!: QueryList<any>;
  @ViewChild('backTick', { read: ElementRef, static: false }) backTick: any;
  @Input() displayNum: any;
  @Input() duration = '300ms';

  price: any;
  offset = {
    y: 0,
    x: []
  }
  inProgress = false;

  private timeouts: any[] = []

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: any) {
    if (changes.displayNum.firstChange) {
      this.price = this.compare(0, changes.displayNum.currentValue ?? 0);
    } else {
      this.updateTicker(changes.displayNum.currentValue);
    }
  }

  private compare(a: number, b: number): any {
    const digit = (i: number) => (v: number) => Math.floor(v / Math.pow(10, i)) % 10;
    const MAX_DIGITS = 14;
    // const color = a > b ? 'green' : 'red'
    const mx = Math.log10(Math.max(Math.abs(a), Math.abs(b)) + 1);
    return Array(Math.ceil(isNaN(mx) ? 0 : Math.max(mx, 1)))
      .fill(0)
      .map((_, i) =>
        (([l, r]) => l === r ? { boot: null, old: l, val: r, id: MAX_DIGITS - i } : { bool: l > r, old: l, val: r, id: MAX_DIGITS - i })
          ([a, b].map(digit(i)))
      )
      .reverse()
      .reduce((acc, el, idx, arr) => {
        return (el.val === 0 && acc.skip && idx + 1 !== arr.length) ? { res: [...acc.res, { ...el, ft: false }], skip: false } : { res: [...acc.res, { ...el, ft: true }], skip: false }
      }, { res: [], skip: true } as any) // skipWhile
      .res;
  }

  private calcWidth(elems: any) {
    return elems.map((el: any) => el.nativeElement.getBoundingClientRect().width)
      .reduce((acc, w) => [...acc, w + acc.splice(-1).pop()], [0]);
  }

  updateTicker(newPrice) {
    this.timeouts.forEach(t => clearTimeout(t));
    const oldPrice = this.price.map(p => p.val).join('');
    this.price = this.compare(oldPrice, newPrice);

    this.inProgress = true;
    const t1 = setTimeout(() => {
      const w = this.calcWidth(this.priceVals);
      this.offset = { ...this.offset, x: w };
      this.detectChanges();
    });

    const t2 = setTimeout(() => {
      this.inProgress = false;
      this.offset = { ...this.offset, x: [...this.offset.x.slice(0, 1), ...this.offset.x.slice(1).filter((val, idx) => this.price[idx].ft)] };
      this.price = this.price.filter(p => p.ft);
      this.detectChanges();
    }, parseInt(this.duration));
    this.timeouts = [t1, t2];
  }

  trackFn(_: any, p: any) {
    return p.id;
  }

  trackFnP(_: any, p: any) {
    return p.val;
  }

  ngAfterViewInit() {
    const w = this.calcWidth(this.priceVals);
    const h = this.backTick?.nativeElement.offsetHeight;
    setTimeout(() => {
      this.offset = { x: w, y: h };
      this.cdr.detectChanges();
    });
  }

  private detectChanges() {
    if (!(this.cdr as any).destroyed) {
      this.cdr.detectChanges();
    }
  }

}
