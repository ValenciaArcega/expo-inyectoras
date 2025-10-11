import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    cancelAnimation,
} from "react-native-reanimated";
import { useReminder, CalendarItem } from "@/src/context/ReminderContext";

const Calendar: React.FC = () => {
    const { addReminder, updateReminder, deleteReminder, items } = useReminder();

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [modalViewVisible, setModalViewVisible] = useState(false);
    const [modalAddVisible, setModalAddVisible] = useState(false);

    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState<"evento" | "recordatorio">("evento");
    const [selectedHour, setSelectedHour] = useState<number>(1);
    const [selectedMinute, setSelectedMinute] = useState<number>(0);
    const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM">("AM");
    const [selectedNotification, setSelectedNotification] = useState<string>("10 min antes");
    const [selectedCategory, setSelectedCategory] = useState<string>("inyeccion");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Animación de campana
    const [alertActive, setAlertActive] = useState(false);
    const bellScale = useSharedValue(1);
    const bellRotate = useSharedValue(0);
    const bellShake = useSharedValue(0);

    const bellAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: bellScale.value },
            { rotate: `${bellRotate.value}deg` },
            { translateX: bellShake.value },
        ],
    }));

    const triggerBell = () => {
        bellScale.value = withSequence(
            withSpring(1.5, { damping: 2, stiffness: 150 }),
            withSpring(1, { damping: 2, stiffness: 150 })
        );
        bellRotate.value = withSequence(
            withSpring(15, { damping: 3, stiffness: 100 }),
            withSpring(-10, { damping: 3, stiffness: 100 }),
            withSpring(0, { damping: 3, stiffness: 100 })
        );
        bellShake.value = withSequence(
            withSpring(-8, { damping: 2, stiffness: 120 }),
            withSpring(8, { damping: 2, stiffness: 120 }),
            withSpring(-5, { damping: 2, stiffness: 120 }),
            withSpring(0, { damping: 2, stiffness: 120 })
        );
    };

    const stopBell = () => {
        cancelAnimation(bellScale);
        cancelAnimation(bellRotate);
        cancelAnimation(bellShake);
        bellScale.value = 1;
        bellRotate.value = 0;
        bellShake.value = 0;
    };

    useEffect(() => {
        if (alertActive) triggerBell();
        else stopBell();
    }, [alertActive]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            const hasReminderNow = items.some((item) => {
                if (item.type !== "recordatorio") return false;
                const [hour, minute] = [item.hour ?? 0, item.minute ?? 0];
                let reminderHour = item.ampm === "PM" && hour < 12 ? hour + 12 : hour;
                reminderHour = item.ampm === "AM" && hour === 12 ? 0 : reminderHour;

                return (
                    item.date === `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}` &&
                    reminderHour === now.getHours() &&
                    minute === now.getMinutes()
                );
            });

            setAlertActive(hasReminderNow);
        }, 1000);

        return () => clearInterval(interval);
    }, [items]);

    const isSameItem = (a: CalendarItem, b: CalendarItem) => {
        if (!a || !b) return false;
        return (
            a.title === b.title &&
            a.date === b.date &&
            a.type === b.type &&
            (a.hour ?? -1) === (b.hour ?? -1) &&
            (a.minute ?? -1) === (b.minute ?? -1) &&
            (a.ampm ?? "") === (b.ampm ?? "") &&
            (a.notification ?? "") === (b.notification ?? "") &&
            (a.category ?? "") === (b.category ?? "")
        );
    };

    const saveItem = () => {
        if (!newTitle || !selectedDate) return;

        const newItem: CalendarItem = {
            title: newTitle,
            date: selectedDate,
            type: newType,
            hour: newType === "recordatorio" ? selectedHour : undefined,
            minute: newType === "recordatorio" ? selectedMinute : undefined,
            ampm: newType === "recordatorio" ? selectedAMPM : undefined,
            notification: newType === "recordatorio" ? selectedNotification : undefined,
            category: newType === "recordatorio" ? selectedCategory : undefined,
        };

        if (editingIndex !== null && editingIndex >= 0 && editingIndex < items.length) {
            updateReminder(editingIndex, newItem);
        } else {
            addReminder(newItem);
        }

        resetForm();
    };

    const resetForm = () => {
        setNewTitle("");
        setNewType("evento");
        setSelectedHour(1);
        setSelectedMinute(0);
        setSelectedAMPM("AM");
        setSelectedNotification("10 min antes");
        setSelectedCategory("inyeccion");
        setEditingIndex(null);
        setModalAddVisible(false);
    };

    const scrollRef = useRef<ScrollView>(null);
    const [monthPositions, setMonthPositions] = useState<number[]>([]);

    const renderMonth = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const daysArray: (number | null)[] = Array(firstDay)
            .fill(null)
            .concat(Array.from({ length: totalDays }, (_, i) => i + 1));

        const monthName = new Date(year, month).toLocaleDateString("es-MX", {
            month: "long",
            year: "numeric",
        });
        const formattedMonth =
            monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
        const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        return (
            <View
                key={`${year}-${month}`}
                style={{ marginBottom: 40 }}
                onLayout={(event) => {
                    const y = event.nativeEvent.layout.y;
                    setMonthPositions((prev) => {
                        const copy = [...prev];
                        copy[month] = y;
                        return copy;
                    });
                }}
            >
                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 10,
                    }}
                >
                    {formattedMonth}
                </Text>

                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    {weekDays.map((d, i) => (
                        <Text
                            key={i}
                            style={{
                                fontWeight: "bold",
                                width: 40,
                                textAlign: "center",
                                color: "#555",
                            }}
                        >
                            {d}
                        </Text>
                    ))}
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {daysArray.map((day, i) => {
                        if (!day)
                            return (
                                <View
                                    key={i}
                                    style={{
                                        width: "14.2%",
                                        borderWidth: 0.5,
                                        borderColor: "#eee",
                                        minHeight: 120,
                                    }}
                                />
                            );

                        const dateStr = `${year}-${month + 1}-${day}`;
                        const isToday =
                            day === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();

                        // FILTRAR ITEMS DE ESTE DÍA
                        const dayItems = items.filter((it) => it.date === dateStr);

                        return (
                            <View
                                key={i}
                                style={{
                                    width: "14.2%",
                                    borderWidth: 0.5,
                                    borderColor: "#eee",
                                    minHeight: 120,
                                    padding: 4,
                                    borderRadius: isToday ? 6 : 0,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        color: isToday ? "#fff" : "#000",
                                        backgroundColor: isToday ? "#f03e3e" : "white",
                                        borderRadius: 999,
                                        height: 24,
                                        width: 24,
                                        lineHeight: 24,
                                        textAlignVertical: "center",
                                        alignSelf: "center",
                                        marginBottom: 6,
                                    }}
                                >
                                    {day}
                                </Text>

                                <TouchableOpacity
                                    style={{
                                        width: "100%",
                                        alignItems: "center",
                                        marginVertical: 4,
                                    }}
                                    onPress={() => {
                                        setSelectedDate(dateStr);
                                        if (dayItems.length > 0) {
                                            setModalViewVisible(true);
                                        } else {
                                            setEditingIndex(null);
                                            setModalAddVisible(true);
                                        }
                                    }}
                                >
                                    {dayItems.length > 0 ? (
                                        <View
                                            style={{
                                                alignSelf: "center",
                                                paddingHorizontal: 8,
                                                paddingVertical: 6,
                                                borderRadius: 6,
                                                backgroundColor: "#F3FFEE",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                borderWidth: 1,
                                                borderColor: "#BBECA5",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "bold",
                                                    marginRight: 6,
                                                }}
                                            >
                                                Ver
                                            </Text>
                                            <View
                                                style={{
                                                    backgroundColor: "#4CAF50",
                                                    borderRadius: 10,
                                                    paddingHorizontal: 6,
                                                    paddingVertical: 2,
                                                    minWidth: 20,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {dayItems.length}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                height: 50, // área presionable grande
                                                width: "100%",
                                            }}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    useEffect(() => {
        if (scrollRef.current && monthPositions[currentMonth] !== undefined) {
            scrollRef.current.scrollTo({
                y: monthPositions[currentMonth],
                animated: false,
            });
        }
    }, [monthPositions]);

    const eventsForSelectedDay = items.filter((it) => it.date === selectedDate);
    const findItemIndex = (item: CalendarItem) => items.findIndex((it) => isSameItem(it, item));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Animated.View
                style={[{ position: "absolute", top: 20, right: 20, zIndex: 10 }, bellAnimatedStyle]}
            >
                <Ionicons name="notifications-outline" size={40} color="#f03e3e" />
            </Animated.View>

            <ScrollView ref={scrollRef}>
                {Array.from({ length: 12 }, (_, i) => renderMonth(i, currentYear))}
            </ScrollView>

            {/* MODAL 1: Ver eventos */}
            {modalViewVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Eventos - {selectedDate}</Text>

                        <ScrollView style={{ maxHeight: 300 }}>
                            {eventsForSelectedDay.length === 0 ? (
                                <Text style={{ textAlign: "center", marginTop: 20 }}>
                                    No hay eventos ni recordatorios.
                                </Text>
                            ) : (
                                eventsForSelectedDay.map((item, idx) => {
                                    const globalIndex = findItemIndex(item);

                                    return (
                                        <View
                                            key={idx}
                                            style={{
                                                backgroundColor: "#f5f5f5",
                                                padding: 10,
                                                borderRadius: 8,
                                                marginVertical: 5,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                                                {item.type === "recordatorio" && (
                                                    <Text style={{ fontSize: 12, color: "#555" }}>
                                                        {item.hour}:{item.minute?.toString().padStart(2, "0")}{" "}
                                                        {item.ampm} - {item.category}
                                                    </Text>
                                                )}
                                            </View>

                                            <View style={{ flexDirection: "row" }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (globalIndex === -1) return;
                                                        setEditingIndex(globalIndex);

                                                        const it = items[globalIndex];
                                                        setNewTitle(it.title);
                                                        setNewType(it.type);
                                                        setSelectedHour(it.hour ?? 1);
                                                        setSelectedMinute(it.minute ?? 0);
                                                        setSelectedAMPM(it.ampm ?? "AM");
                                                        setSelectedNotification(it.notification ?? "10 min antes");
                                                        setSelectedCategory(it.category ?? "inyeccion");

                                                        setModalViewVisible(false);
                                                        setModalAddVisible(true);
                                                    }}
                                                    style={{ marginRight: 10 }}
                                                >
                                                    <Feather name="edit-3" size={20} color="#333" />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (globalIndex === -1) return;
                                                        deleteReminder(globalIndex);
                                                    }}
                                                >
                                                    <Feather name="trash-2" size={20} color="#f03e3e" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            onPress={() => {
                                setEditingIndex(null);
                                setModalViewVisible(false);
                                setModalAddVisible(true);
                            }}
                            style={styles.addButton}
                        >
                            <Ionicons name="add" size={28} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalViewVisible(false)} style={styles.closeButton}>
                            <Text style={{ color: "#f03e3e", fontWeight: "bold" }}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* MODAL 2: Agregar/Editar */}
            {modalAddVisible && (
                <View style={styles.modalOverlay}>
                    <ScrollView style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            {editingIndex !== null ? "Editar" : "Nuevo"}{" "}
                            {newType === "recordatorio" ? "Recordatorio" : "Evento"}
                        </Text>

                        <Text style={{ marginBottom: 6, color: "#333" }}>Fecha: {selectedDate || "-"}</Text>

                        <TextInput style={styles.input} placeholder="Título" value={newTitle} onChangeText={setNewTitle} />

                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                            <TouchableOpacity
                                onPress={() => setNewType("evento")}
                                style={[styles.toggleButton, { backgroundColor: newType === "evento" ? "#505050" : "#ddd" }]}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Evento</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setNewType("recordatorio")}
                                style={[styles.toggleButton, { backgroundColor: newType === "recordatorio" ? "#505050" : "#ddd" }]}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Recordatorio</Text>
                            </TouchableOpacity>
                        </View>

                        {newType === "recordatorio" && (
                            <>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                                    <TextInput
                                        placeholder="HH"
                                        keyboardType="numeric"
                                        value={String(selectedHour)}
                                        onChangeText={(t) => setSelectedHour(Number(t))}
                                        style={[styles.input, { flex: 1, marginRight: 5 }]}
                                    />
                                    <TextInput
                                        placeholder="MM"
                                        keyboardType="numeric"
                                        value={String(selectedMinute)}
                                        onChangeText={(t) => setSelectedMinute(Number(t))}
                                        style={[styles.input, { flex: 1, marginRight: 5 }]}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setSelectedAMPM(selectedAMPM === "AM" ? "PM" : "AM")}
                                        style={[styles.input, { flex: 1, justifyContent: "center", alignItems: "center" }]}
                                    >
                                        <Text>{selectedAMPM}</Text>
                                    </TouchableOpacity>
                                </View>

                                <TextInput placeholder="Notificación" value={selectedNotification} onChangeText={setSelectedNotification} style={styles.input} />
                                <TextInput placeholder="Categoría" value={selectedCategory} onChangeText={setSelectedCategory} style={styles.input} />
                            </>
                        )}

                        <TouchableOpacity onPress={saveItem} style={styles.saveButton}>
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>Guardar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={resetForm} style={styles.closeButton}>
                            <Text style={{ color: "#f03e3e", fontWeight: "bold" }}>Cancelar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Calendar;

const styles = StyleSheet.create({
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalBox: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        width: "90%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    addButton: {
        backgroundColor: "#4caf50",
        borderRadius: 50,
        alignSelf: "center",
        padding: 10,
        marginTop: 10,
    },
    closeButton: {
        marginTop: 10,
        alignSelf: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,
    },
    toggleButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: "center",
    },
    saveButton: {
        backgroundColor: "#505050",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
});
