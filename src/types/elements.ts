import { Ionicons } from "@expo/vector-icons"

export type BtnControlCenter = {
    id: number,
    title: string,
    subtitle: string,
    route: string
    icon: keyof typeof Ionicons.glyphMap,
    iconColor: string,
}

export type DraggableButtonProps = {
    btn: BtnControlCenter;
    index: number;
    positions: any;
    buttonHeight: number;
}
