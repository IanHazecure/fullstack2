import { Injectable, signal } from '@angular/core';

export interface PurchaseRecord {
  id: string;
  quantity: number;
  totalSpent: number;
}

@Injectable({ providedIn: 'root' })
export class PurchasesService {
  private readonly KEY = 'vinyl_purchases';
  private load(): Record<string, PurchaseRecord> {
    try {
      const stored = localStorage.getItem(this.KEY);
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  }

  private save(data: Record<string, PurchaseRecord>): void {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }




  recordPurchase(items: { id: string; title: string; price: number; quantity: number; cover: string; genre: string }[]): void {
    const data = this.load();
    for (const item of items) {
      if (data[item.id]) {
        data[item.id].quantity += item.quantity;
        data[item.id].totalSpent += item.price * item.quantity;
      } else {
        data[item.id] = {
          id: item.id,
          quantity: item.quantity,
          totalSpent: item.price * item.quantity
        };
      }
    }
    this.save(data);
  }


  getAll(): Record<string, PurchaseRecord> {
    return this.load();
  }



  
  getTop3(): PurchaseRecord[] {
    const data = this.load();
    return Object.values(data)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);
  }
  getTotalRevenue(): number {
    const data = this.load();
    return Object.values(data).reduce((sum, r) => sum + r.totalSpent, 0);
  }
}