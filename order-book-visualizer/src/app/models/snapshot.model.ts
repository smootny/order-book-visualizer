export interface OrderLevel {
    price: number;
    volume: number;
  }
  
  export interface OrderBookSnapshot {
    Time: string;
    [key: `Bid${number}`]: number;
    [key: `Bid${number}Size`]: number;
    [key: `Ask${number}`]: number;
    [key: `Ask${number}Size`]: number;
  }
  

  