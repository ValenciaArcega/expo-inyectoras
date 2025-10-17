import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring } from "react-native-reanimated";
import { mmkv } from "@/src/utils/mmkv";

export type CalendarItem = {
  title: string;
  date: string;
  type: "evento" | "recordatorio";
  hour?: number;
  minute?: number;
  ampm?: "AM" | "PM";
  notification?: string;
  category?: string;
};

type ReminderContextType = {
  addReminder: (item: CalendarItem) => void;
  updateReminder: (index: number, updated: CalendarItem) => void;
  deleteReminder: (index: number) => void;
  items: CalendarItem[];
};

const ReminderContext = createContext<ReminderContextType | null>(null);
export const useReminder = () => useContext(ReminderContext)!;

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [alertActive, setAlertActive] = useState(false);
  const [activeReminder, setActiveReminder] = useState<CalendarItem | null>(null);
  const [countdown, setCountdown] = useState(0);

  const fondoParpadeo = useSharedValue(0);
  const blinkInterval = useRef<number | null>(null);
  const alertTimeout = useRef<number | null>(null);
  const countdownInterval = useRef<number | null>(null);

  const fondoParpadeanteStyle = useAnimatedStyle(() => ({
    backgroundColor: fondoParpadeo.value
      ? "rgba(255,0,0,0.4)"
      : "rgba(0,0,0,0.5)",
  }));

  // Cargar items desde MMKV
  useEffect(() => {
    const stored = mmkv.getString("mmkkv-events");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CalendarItem[];
      setItems(parsed);
    } catch {
      setItems([]);
    }
  }, []);

  // Revisar recordatorios cada segundo
  useEffect(() => {
    const triggeredReminders = new Set<string>();

    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

      items.forEach((item, idx) => {
        if (item.type !== "recordatorio" || item.date !== todayStr) return;
        if (item.hour === undefined || item.minute === undefined) return;

        let itemHour = item.hour % 12;
        if (item.ampm === "PM") itemHour += 12;
        const itemMinutes = itemHour * 60 + item.minute;

        // Aplicar notificación
        let notifOffset = 0;
        if (item.notification === "10 min") notifOffset = 10;
        else if (item.notification === "30 min") notifOffset = 30;
        else if (item.notification === "1 hora") notifOffset = 60;

        const notifyAt = itemMinutes - notifOffset;

        const key = `${item.date}-${itemHour}-${item.minute}-${idx}`;
        if (currentMinutes === notifyAt && !triggeredReminders.has(key)) {
          triggeredReminders.add(key);
          triggerGlobalAlert(item);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  const triggerGlobalAlert = (item: CalendarItem) => {
    setActiveReminder(item);
    setAlertActive(true);
    setCountdown(5 * 60); // 5 minutos de alerta

    // Fondo parpadeante
    if (blinkInterval.current) clearInterval(blinkInterval.current);
    let on = true;
    blinkInterval.current = setInterval(() => {
      fondoParpadeo.value = on ? 1 : 0;
      on = !on;
    }, 300);

    // Contador regresivo
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          stopAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Autocerrar alerta después de 5 minutos
    if (alertTimeout.current) clearTimeout(alertTimeout.current);
    alertTimeout.current = setTimeout(() => stopAlert(), 5 * 60 * 1000) as unknown as number;
  };

  const stopAlert = () => {
    setAlertActive(false);
    setActiveReminder(null);
    fondoParpadeo.value = 0;

    if (blinkInterval.current) clearInterval(blinkInterval.current);
    if (alertTimeout.current) clearTimeout(alertTimeout.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    blinkInterval.current = null;
    alertTimeout.current = null;
    countdownInterval.current = null;
  };

  const snoozeAlert = () => {
    if (!activeReminder) return;
    stopAlert();

    // Volver a lanzar alerta en 10 minutos
    setTimeout(() => {
      triggerGlobalAlert(activeReminder);
    }, 10 * 60 * 1000); // 10 minutos
  };

  const addReminder = (item: CalendarItem) => {
    const newItems = [...items, item];
    setItems(newItems);
    mmkv.set("mmkkv-events", JSON.stringify(newItems));
  };

  const updateReminder = (index: number, updated: CalendarItem) => {
    const newItems = [...items];
    newItems[index] = updated;
    setItems(newItems);
    mmkv.set("mmkkv-events", JSON.stringify(newItems));
  };

  const deleteReminder = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    mmkv.set("mmkkv-events", JSON.stringify(newItems));
  };

  return (
    <ReminderContext.Provider value={{ addReminder, updateReminder, deleteReminder, items }}>
      {children}

      {alertActive && activeReminder && (
        <Modal supportedOrientations={["landscape"]} transparent visible animationType="fade" onRequestClose={stopAlert}>
          <Animated.View style={[fondoParpadeanteStyle, { flex: 1, justifyContent: "center", alignItems: "center" }]}>
            <View
              style={{
                width: "75%",
                backgroundColor: "#fff",
                padding: 30,
                borderRadius: 12,
                alignItems: "center",
                borderWidth: 4,
                borderColor: "#fff",
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>{activeReminder.title}</Text>
              <Text style={{ marginTop: 10 }}>
                {activeReminder.hour?.toString().padStart(2, "0")}:
                {activeReminder.minute?.toString().padStart(2, "0")} {activeReminder.ampm}
              </Text>

              <Text style={{ marginTop: 5, color: "#666" }}>
                Alerta terminará en: {Math.floor(countdown / 60).toString().padStart(2, "0")}:
                {(countdown % 60).toString().padStart(2, "0")}
              </Text>
              <Text style={{ marginTop: 10, color: "#444", fontSize: 13, textAlign: "center" }}>
                Si presionas "Posponer", esta alerta se volverá a mostrar en 10 minutos.
              </Text>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F03E3E",
                    padding: 12,
                    borderRadius: 8,
                    marginHorizontal: 10,
                  }}
                  onPress={stopAlert}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Detener</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#4CAF50",
                    padding: 12,
                    borderRadius: 8,
                    marginHorizontal: 10,
                  }}
                  onPress={snoozeAlert}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Posponer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Modal>
      )}
    </ReminderContext.Provider>
  );
};
