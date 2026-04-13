export type EmberState = "Thriving" | "Steady" | "Strained" |"Flickering";

export interface LocalEmberData {
    hp: number;
    visualState: EmberState;
}