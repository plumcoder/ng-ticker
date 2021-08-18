import { Component, Input, ViewChild } from '@angular/core';
import { calculateViewDimensions, getScaleType, getUniqueXDomainValues, LineChartComponent, ScaleType, ViewDimensions } from '@swimlane/ngx-charts';
import { multi } from './data';
import { scaleLinear, scaleTime, scalePoint } from 'd3-scale';



export interface Tooltip {
  color: string;
  d0: number;
  d1: number;
  max: number;
  min: number;
  name: any;
  series: any;
  value: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('chart') private chart: LineChartComponent;

  multi = multi;
  view = [900, 400] as any;

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  // ================================================================================================================

  findClosestPointIndex(xPos: number): number {
    let minIndex = 0;
    let maxIndex = this.chart.xSet.length - 1;
    let minDiff = Number.MAX_VALUE;
    let closestIndex = 0;

    while (minIndex <= maxIndex) {
      const currentIndex = ((minIndex + maxIndex) / 2) | 0;
      const currentElement = this.chart.xScale(this.chart.xSet[currentIndex]);

      const curDiff = Math.abs(currentElement - xPos);

      if (curDiff < minDiff) {
        minDiff = curDiff;
        closestIndex = currentIndex;
      }

      if (currentElement < xPos) {
        minIndex = currentIndex + 1;
      } else if (currentElement > xPos) {
        maxIndex = currentIndex - 1;
      } else {
        minDiff = 0;
        closestIndex = currentIndex;
        break;
      }
    }

    return closestIndex;
  }

  showPercentage: boolean = false;
  getValues(xVal) {
    const results: any[] = [];

    for (const group of this.chart.results) {
      const item = group.series.find(d => d.name.toString() === xVal.toString());
      let groupName = group.name;
      if (groupName instanceof Date) {
        groupName = groupName.toLocaleDateString();
      }

      if (item) {
        const label = item.name;
        let val = item.value;
        if (this.showPercentage) {
          val = (item.d1 - item.d0).toFixed(2) + '%';
        }
        let color;
        // if (this.colors.scaleType === ScaleType.Linear) {
        //   let v = val;
        //   if (item.d1) {
        //     v = item.d1;
        //   }
        //   color = this.colors.getColor(v);
        // } else {
        //   color = this.colors.getColor(group.name);
        // }

        const data = Object.assign({}, item, {
          value: val,
          name: label,
          series: groupName,
          min: item.min,
          max: item.max,
          color
        });

        results.push(data);
      }
    }

    return results;
  }

  onMouseMove(event) {
    const xPos = event.pageX - event.target.getBoundingClientRect().left;

    const closestIndex = this.findClosestPointIndex(xPos);
    const closestPoint = this.chart.xSet[closestIndex];
    let anchorPos = this.chart.xScale(closestPoint);
    anchorPos = Math.max(0, anchorPos);
    anchorPos = Math.min(this.chart.dims.width, anchorPos);

    const anchorValues = this.getValues(closestPoint);
    console.log(`[zzz] value:`, anchorValues);
    this.price = anchorValues[0]?.value;
  }

  // ---------------------------------------------------------------------------------------------------


  title = 'stock-app';
  price;

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ngAfterViewInit() {
    console.log(`[zzz] foo:`, this.chart);
  }

  onUpdate() {
    this.price = this.getRandomInt(120, 1299);
  }

}
