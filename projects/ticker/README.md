# NG Ticker

Lightweight Ticker animation component

Show changing number with stock ticker like animation
&nbsp;
&nbsp;

![ng ticker in action](https://github.com/plumcoder/ng-ticker-/blob/master/ngTicker.gif?raw=true)

## TOI

- [Demo](#demo)
- [Install](#install)
- [Setup](#setup)
- [Development](#development)
- [Contribute](#contribute)


## Demo

Try demo on Stackblitz!

- [Usage: animation duration, appearance](https://stackblitz.com/edit/angular-ivy-2v6yjf)


## Install

You can get it on NPM installing `ng-ticker` module as a project dependency.

```shell
npm install @plcoder/ng-ticker --save
```

## Setup

You'll need to add `TickerModule` to your application module. So that, the `<ticker>` components will be accessible in your application.

```typescript
...
import { TickerModule } from '@plcoder/ng-ticker';
...

@NgModule({
  declarations: [
    YourAppComponent
  ],
  imports: [
    ...
    TickerModule,
    ...
  ],
  providers: [],
  bootstrap: [YourAppComponent]
})

export class YourAppComponent {}

```

After that, you can use the `ticker` components in your templates, passing the configuration data into the component itself.

- `ticker`: Handle the number change animation

```html
<ticker [displayNum]="price" duration="300ms"></ticker>
```

## API

### @Inputs

| <div style="width:250px">Prop name and type</div>           | Description | 
| ----------------------------------------------------------- | ------------------------------------------------------------- | 
| **`displayNum?: number`** <br/> Defaults to `0`             |  Number to display   |
| **`duration?: string`** <br /> Defaults to `200ms`          |  Animation speed, time required to transiton from one value to other              |
