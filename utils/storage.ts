import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TasbeehRecord {
  id: string;
  name: string;
  arabicText?: string;
  count: number;
  goal: number;
  lastUpdated: string;
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  yearlyCount: number;
  lastResetDate: string;
}

export interface CustomTasbeeh {
  id: string;
  name: string;
  arabicText: string;
  goal: number;
}

const STORAGE_KEYS = {
  ASTAGHFAR: 'astaghfar_record',
  DUROOD: 'durood_record',
  TASBEEH_RECORDS: 'tasbeeh_records',
  CUSTOM_TASBEEH: 'custom_tasbeeh',
  WUQOOF_SETTINGS: 'wuqoof_settings',
};

/**
 * StorageService provides methods to manage tasbeeh records and custom tasbeeh settings.
 * 
 * @module StorageService
 * 
 * @typedef TasbeehRecord
 * @property {string} id - The unique identifier for the tasbeeh record.
 * @property {string} name - The name of the tasbeeh.
 * @property {number} count - The total count of tasbeeh.
 * @property {number} goal - The goal count for the tasbeeh.
 * @property {string} lastUpdated - The timestamp of the last update.
 * @property {number} dailyCount - The count for the current day.
 * @property {number} weeklyCount - The count for the current week.
 * @property {number} monthlyCount - The count for the current month.
 * @property {number} yearlyCount - The count for the current year.
 * @property {string} lastResetDate - The date when the count was last reset.
 * 
 * @typedef CustomTasbeeh
 * @property {string} id - The unique identifier for the custom tasbeeh.
 * @property {string} name - The name of the custom tasbeeh.
 * 
 * @function getTasbeehRecord - Retrieves a tasbeeh record by its key.
 * @param {string} key - The key associated with the tasbeeh record.
 * @returns {Promise<TasbeehRecord | null>} - The tasbeeh record or null if not found.
 * 
 * @function saveTasbeehRecord - Saves a tasbeeh record.
 * @param {string} key - The key associated with the tasbeeh record.
 * @param {TasbeehRecord} record - The tasbeeh record to save.
 * @returns {Promise<void>}
 * 
 * @function updateTasbeehCount - Updates the count of a tasbeeh record.
 * @param {string} key - The key associated with the tasbeeh record.
 * @param {number} [increment=1] - The amount to increment the count by.
 * @returns {Promise<TasbeehRecord | null>} - The updated tasbeeh record or null if an error occurs.
 * 
 * @function resetTasbeehCount - Resets the count of a tasbeeh record to zero.
 * @param {string} key - The key associated with the tasbeeh record.
 * @returns {Promise<void>}
 * 
 * @function getAllTasbeehRecords - Retrieves all tasbeeh records.
 * @returns {Promise<TasbeehRecord[]>} - An array of all tasbeeh records.
 * 
 * @function getCustomTasbeeh - Retrieves custom tasbeeh records.
 * @returns {Promise<CustomTasbeeh[]>} - An array of custom tasbeeh records.
 * 
 * @function addCustomTasbeeh - Adds a new custom tasbeeh record.
 * @param {CustomTasbeeh} tasbeeh - The custom tasbeeh to add.
 * @returns {Promise<void>}
 * 
 * @function deleteCustomTasbeeh - Deletes a custom tasbeeh record by its ID.
 * @param {string} id - The ID of the custom tasbeeh to delete.
 * @returns {Promise<void>}
 * 
 * @function getWuqoofSettings - Retrieves wuqoof settings.
 * @returns {Promise<{ enabled: boolean; interval: number }>} - The wuqoof settings.
 * 
 * @function saveWuqoofSettings - Saves wuqoof settings.
 * @param {{ enabled: boolean; interval: number }} settings - The settings to save.
 * @returns {Promise<void>}
 */
export const StorageService = {
  async getTasbeehRecord(key: string): Promise<TasbeehRecord | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading tasbeeh record:', error);
      return null;
    }
  },

  async saveTasbeehRecord(key: string, record: TasbeehRecord): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(record));
    } catch (error) {
      console.error('Error saving tasbeeh record:', error);
    }
  },

  async updateTasbeehCount(key: string, increment: number = 1): Promise<TasbeehRecord | null> {
    try {
      const record = await this.getTasbeehRecord(key);
      const today = new Date().toISOString().split('T')[0];

      if (!record) {
        const newRecord: TasbeehRecord = {
          id: key,
          name: key,
          count: increment,
          goal: 100,
          lastUpdated: new Date().toISOString(),
          dailyCount: increment,
          weeklyCount: increment,
          monthlyCount: increment,
          yearlyCount: increment,
          lastResetDate: today,
        };
        await this.saveTasbeehRecord(key, newRecord);
        return newRecord;
      }

      const lastResetDate = record.lastResetDate || today;
      const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastResetDate).getTime()) / (1000 * 60 * 60 * 24));

      let dailyCount = record.dailyCount;
      let weeklyCount = record.weeklyCount;
      let monthlyCount = record.monthlyCount;
      let yearlyCount = record.yearlyCount;

      if (daysDiff >= 1) {
        dailyCount = 0;
      }
      if (daysDiff >= 7) {
        weeklyCount = 0;
      }
      if (daysDiff >= 30) {
        monthlyCount = 0;
      }
      if (daysDiff >= 365) {
        yearlyCount = 0;
      }

      const updatedRecord: TasbeehRecord = {
        ...record,
        count: record.count + increment,
        dailyCount: dailyCount + increment,
        weeklyCount: weeklyCount + increment,
        monthlyCount: monthlyCount + increment,
        yearlyCount: yearlyCount + increment,
        lastUpdated: new Date().toISOString(),
        lastResetDate: today,
      };

      await this.saveTasbeehRecord(key, updatedRecord);
      return updatedRecord;
    } catch (error) {
      console.error('Error updating tasbeeh count:', error);
      return null;
    }
  },

  async resetTasbeehCount(key: string): Promise<void> {
    try {
      const record = await this.getTasbeehRecord(key);
      if (record) {
        const resetRecord: TasbeehRecord = {
          ...record,
          count: 0,
          lastUpdated: new Date().toISOString(),
        };
        await this.saveTasbeehRecord(key, resetRecord);
      }
    } catch (error) {
      console.error('Error resetting tasbeeh count:', error);
    }
  },

  async getAllTasbeehRecords(): Promise<TasbeehRecord[]> {
    try {
      const keys = [
        STORAGE_KEYS.ASTAGHFAR,
        STORAGE_KEYS.DUROOD,
        'tasbeeh_laIlaha',
        'tasbeeh_subhanAllah',
        'tasbeeh_alhamdulillah',
        'tasbeeh_allahuAkbar',
        'tasbeeh_subhanAllahWaBihamdihi',
      ];

      const records: TasbeehRecord[] = [];
      for (const key of keys) {
        const record = await this.getTasbeehRecord(key);
        if (record) {
          records.push(record);
        }
      }

      const customTasbeeh = await this.getCustomTasbeeh();
      for (const custom of customTasbeeh) {
        const record = await this.getTasbeehRecord(`custom_${custom.id}`);
        if (record) {
          records.push(record);
        }
      }

      return records;
    } catch (error) {
      console.error('Error getting all tasbeeh records:', error);
      return [];
    }
  },

  async getCustomTasbeeh(): Promise<CustomTasbeeh[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_TASBEEH);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading custom tasbeeh:', error);
      return [];
    }
  },

  async addCustomTasbeeh(tasbeeh: CustomTasbeeh): Promise<void> {
    try {
      const existing = await this.getCustomTasbeeh();
      existing.push(tasbeeh);
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_TASBEEH, JSON.stringify(existing));
    } catch (error) {
      console.error('Error adding custom tasbeeh:', error);
    }
  },

  async deleteCustomTasbeeh(id: string): Promise<void> {
    try {
      const existing = await this.getCustomTasbeeh();
      const filtered = existing.filter(t => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_TASBEEH, JSON.stringify(filtered));
      await AsyncStorage.removeItem(`custom_${id}`);
    } catch (error) {
      console.error('Error deleting custom tasbeeh:', error);
    }
  },

  async getWuqoofSettings(): Promise<{ enabled: boolean; interval: number }> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WUQOOF_SETTINGS);
      if (!data) return { enabled: false, interval: 60 };
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading wuqoof settings:', error);
      return { enabled: false, interval: 60 };
    }
  },

  async saveWuqoofSettings(settings: { enabled: boolean; interval: number }): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WUQOOF_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving wuqoof settings:', error);
    }
  },
};