// ==========================================
// TUGAS MANDIRI MODUL 13 - DESIGN PATTERNS
// Implementasi: Singleton, Observer, dan Factory Pattern
// ==========================================

export interface Broadcast {
  id: number;
  text: string;
  urgency: 'info' | 'warning' | 'critical';
  date: string;
}

// -------------------------------------------------------------
// 1. OBSERVER PATTERN (Interface Observer)
// -------------------------------------------------------------
export interface BroadcastObserver {
  onBroadcastReceived(broadcasts: Broadcast[]): void;
}

// -------------------------------------------------------------
// 2. SINGLETON PATTERN & SUBJECT (Observer Pattern)
// -------------------------------------------------------------
export class BroadcastManager {
  private static instance: BroadcastManager | null = null;
  private observers: BroadcastObserver[] = [];
  private broadcasts: Broadcast[] = [];

  // Private constructor mencegah instansiasi langsung dari luar kelas (Singleton)
  private constructor() {
    this.loadFromStorage();
  }

  // Metode statis global untuk mengakses instance tunggal (Singleton)
  public static getInstance(): BroadcastManager {
    if (!BroadcastManager.instance) {
      BroadcastManager.instance = new BroadcastManager();
    }
    return BroadcastManager.instance;
  }

  // Membaca broadcast dari localStorage saat inisialisasi
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('telkom-in-competition:broadcasts');
      if (stored) {
        try {
          this.broadcasts = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse broadcasts from storage:', e);
          this.broadcasts = [];
        }
      } else {
        // Default broadcast jika kosong
        this.broadcasts = [
          {
            id: 1,
            text: 'Welcome to the new Telkom-In-Competition Admin Portal! Real-time stats are live.',
            urgency: 'info',
            date: new Date().toISOString().split('T')[0],
          },
        ];
        localStorage.setItem('telkom-in-competition:broadcasts', JSON.stringify(this.broadcasts));
      }
    }
  }

  // Mendaftarkan Observer baru (Subscribe)
  public subscribe(observer: BroadcastObserver): () => void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      // Kirimkan state terkini segera setelah mendaftar
      observer.onBroadcastReceived(this.broadcasts);
    }
    // Mengembalikan fungsi unsubscribe agar bersih dan aman dari kebocoran memori
    return () => {
      this.unsubscribe(observer);
    };
  }

  // Melepas pendaftaran Observer (Unsubscribe)
  public unsubscribe(observer: BroadcastObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // Menambahkan broadcast baru dan menotifikasi semua Observers (Notify)
  public addBroadcast(text: string, urgency: 'info' | 'warning' | 'critical'): void {
    const newBroadcast: Broadcast = {
      id: Date.now(),
      text,
      urgency,
      date: new Date().toISOString().split('T')[0],
    };

    this.broadcasts = [newBroadcast, ...this.broadcasts];

    // Simpan ke persistensi local
    if (typeof window !== 'undefined') {
      localStorage.setItem('telkom-in-competition:broadcasts', JSON.stringify(this.broadcasts));
    }

    // Beritahukan semua pihak yang berlangganan
    this.notifyObservers();
  }

  public getBroadcasts(): Broadcast[] {
    return this.broadcasts;
  }

  // Menotifikasi seluruh observer terdaftar secara dinamis
  private notifyObservers(): void {
    this.observers.forEach((observer) => {
      try {
        observer.onBroadcastReceived(this.broadcasts);
      } catch (err) {
        console.error('Error notifying observer:', err);
      }
    });
  }
}

// -------------------------------------------------------------
// 3. FACTORY PATTERN
// -------------------------------------------------------------

// Kelas abstrak produk dasar (Base Product)
export abstract class BroadcastAlert {
  protected broadcast: Broadcast;

  constructor(broadcast: Broadcast) {
    this.broadcast = broadcast;
  }

  // Kontrak method untuk diimplementasikan oleh kelas konkret (Concrete Products)
  public abstract getColors(): {
    bg: string;
    border: string;
    text: string;
    iconColor: string;
  };

  public abstract getIconType(): 'info' | 'warning' | 'critical';

  public getBroadcast(): Broadcast {
    return this.broadcast;
  }
}

// Concrete Product A: InfoAlert
export class InfoAlert extends BroadcastAlert {
  public getColors() {
    return {
      bg: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400',
      border: 'border-blue-500/20 dark:border-blue-500/30',
      text: 'text-blue-700 dark:text-blue-400',
      iconColor: 'text-blue-500',
    };
  }

  public getIconType(): 'info' | 'warning' | 'critical' {
    return 'info';
  }
}

// Concrete Product B: WarningAlert
export class WarningAlert extends BroadcastAlert {
  public getColors() {
    return {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/20 dark:border-amber-500/30',
      text: 'text-amber-700 dark:text-amber-400',
      iconColor: 'text-amber-500',
    };
  }

  public getIconType(): 'info' | 'warning' | 'critical' {
    return 'warning';
  }
}

// Concrete Product C: CriticalAlert
export class CriticalAlert extends BroadcastAlert {
  public getColors() {
    return {
      bg: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400',
      border: 'border-red-500/20 dark:border-red-500/30',
      text: 'text-red-700 dark:text-red-400',
      iconColor: 'text-red-500',
    };
  }

  public getIconType(): 'info' | 'warning' | 'critical' {
    return 'critical';
  }
}

// Creator / Factory Class
export class BroadcastAlertFactory {
  // Static Factory Method
  public static createAlert(broadcast: Broadcast): BroadcastAlert {
    switch (broadcast.urgency) {
      case 'critical':
        return new CriticalAlert(broadcast);
      case 'warning':
        return new WarningAlert(broadcast);
      case 'info':
      default:
        return new InfoAlert(broadcast);
    }
  }
}
