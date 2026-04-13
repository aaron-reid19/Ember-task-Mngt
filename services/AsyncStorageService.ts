import AsyncStorage from "@react-native-async-storage/async-storage";
import type { EmberState, LocalEmberData } from "@/types/ember";

const STORAGE_KEYS = {
    hp: "ember_hp",
    visualState: "ember_visual_state",
} as const;

const DEFAULT_HP = 100;
const DEFAULT_VISUAL_STATE: EmberState = "Thriving";

function isValidEmberState(value: unknown): value is EmberState{
    return(
        value === "Thriving" ||
        value === "Steady" ||
        value === "Strained" ||
        value === "Flickering"
    );
}


function clampHP(value: number): number {
    if (Number.isNaN(value)) return DEFAULT_HP;
    return Math.max(0, Math.min(100, value));
  }
  
export const AsyncStorageService = {
    async getHP(): Promise<number> {
        try {
            const storedHP = await AsyncStorage.getItem(STORAGE_KEYS.hp);

        if (storedHP === null) {
        return DEFAULT_HP;
    }

    const parsedHP = Number(storedHP);

    if (Number.isNaN(parsedHP)) {
        return DEFAULT_HP;
    }

    return clampHP(parsedHP);
    } catch (error) {
    console.error("Failed to read HP from AsyncStorage:", error);
    return DEFAULT_HP;
    }
},
    async setHP(hp: number): Promise<void> {
        try {
        const safeHP = clampHP(hp);
        await AsyncStorage.setItem(STORAGE_KEYS.hp, safeHP.toString());
        } catch (error) {
        console.error("Failed to write HP to AsyncStorage:", error);
        throw error;
        }
    },
    async setVisualState(state: EmberState): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.visualState, state);
      } catch (error) {
        console.error("Failed to write visual state to AsyncStorage:", error);
        throw error;
      }
    },

    async getVisualState(): Promise<EmberState> {
        try{
            const storedState = await AsyncStorage.getItem(STORAGE_KEYS.visualState);

            if (storedState === null){
                return DEFAULT_VISUAL_STATE;
            }

            if (!isValidEmberState(storedState)) {
            return DEFAULT_VISUAL_STATE;
      }

            return storedState;
        } 
        catch (error) {
            console.error("Failed to read visual state from AsyncStorage:", error);
            return DEFAULT_VISUAL_STATE;
            }
        },
    async getLocalEmberData(): Promise<LocalEmberData> {
        try {
            const [hp, visualState] = await Promise.all([
                this.getHP(),
                this.getVisualState(),
            ]);
        
              return { hp, visualState };
            } 
            catch (error) {
              console.error("Failed to read local Ember data:", error);
              return {
                hp: DEFAULT_HP,
                visualState: DEFAULT_VISUAL_STATE,
              };
            }
        },

    async setLocalEmberData(data: LocalEmberData): Promise<void> {
        try {
            const safeHP = clampHP(data.hp);
            
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.hp, safeHP.toString()],
                    [STORAGE_KEYS.visualState, data.visualState],
                ]);
        } 
        catch (error) {
            console.error("Failed to write local Ember data:", error);
            throw error;
        }
    },

    async resetLocalEmberData(): Promise<void> {
        try {
          await AsyncStorage.multiRemove([
            STORAGE_KEYS.hp,
            STORAGE_KEYS.visualState,
            ]);
        } 
        catch (error) {
            console.error("Failed to reset local Ember data:", error);
            throw error;
        }
    },
};