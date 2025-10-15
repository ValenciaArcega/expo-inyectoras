import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, StyleSheet, Alert, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, cancelAnimation, } from "react-native-reanimated";
import { useReminder, CalendarItem } from "@/src/context/ReminderContext";

const Calendar: React.FC = () => {
    const { addReminder, updateReminder, deleteReminder, items } = useReminder();

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [modalEventVisible, setModalEventVisible] = useState(false);
    const [modalDayVisible, setModalDayVisible] = useState(false);

    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState<"evento" | "recordatorio">("evento");
    const [selectedHour, setSelectedHour] = useState<number>(1);
    const [selectedMinute, setSelectedMinute] = useState<number>(0);
    const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM">("AM");
    const [selectedNotification, setSelectedNotification] = useState<string>("10 min antes");
    const [selectedCategory, setSelectedCategory] = useState<string>("inyeccion");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showHourList, setShowHourList] = useState(false);
    const [showMinuteList, setShowMinuteList] = useState(false);
    const [showNotifList, setShowNotifList] = useState(false);
    const [showCatList, setShowCatList] = useState(false);

    // Animación campana
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
        bellScale.value = withSequence(withSpring(1.5), withSpring(1));
        bellRotate.value = withSequence(withSpring(15), withSpring(-10), withSpring(0));
        bellShake.value = withSequence(withSpring(-8), withSpring(8), withSpring(0));
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

    const addItem = () => {
        // Verifica si el título está vacío o solo contiene espacios
        if (!newTitle || newTitle.trim() === "") {
            Alert.alert("Campos requeridos", "Asegúrate de ingresar un nombre válido.");
            return;
        }

        // Verifica que haya una fecha seleccionada
        if (!selectedDate) {
            Alert.alert("Fecha no seleccionada", "Por favor selecciona una fecha antes de guardar.");
            return;
        }

        const newItem: CalendarItem = {
            title: newTitle.trim(),
            date: selectedDate,
            type: newType,
            hour: newType === "recordatorio" ? selectedHour : undefined,
            minute: newType === "recordatorio" ? selectedMinute : undefined,
            ampm: newType === "recordatorio" ? selectedAMPM : undefined,
            notification: newType === "recordatorio" ? selectedNotification : undefined,
            category: newType === "recordatorio" ? selectedCategory : undefined,
        };

        if (editingIndex !== null) {
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
        setModalEventVisible(false);
    };

    const scrollRef = useRef<ScrollView>(null);
    const [monthPositions, setMonthPositions] = useState<number[]>([]);

    // Scroll al mes actual al cargar
    useEffect(() => {
        if (scrollRef.current && monthPositions.length === 12) {
            scrollRef.current.scrollTo({ y: monthPositions[currentMonth], animated: false });
        }
    }, [monthPositions]);

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
                onLayout={(e) => {
                    const y = e.nativeEvent.layout.y;
                    setMonthPositions((prev) => {
                        const copy = [...prev];
                        copy[month] = y;
                        return copy;
                    });
                }}
            >
                <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
                    {formattedMonth}
                </Text>

                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    {weekDays.map((d, i) => (
                        <Text key={i} style={{ fontWeight: "bold", width: 40, textAlign: "center", color: "#555" }}>
                            {d}
                        </Text>
                    ))}
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {daysArray.map((day, i) => {
                        if (!day)
                            return <View key={i} style={{ width: "14.2%", minHeight: 120 }} />;

                        const dateStr = `${year}-${month + 1}-${day}`;
                        const isToday =
                            day === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();
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
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}
                            >
                                <Text className={`fond-bold text-center rounded-full w-6 h-6 leading-6 self-center ${isToday 
                                ? `bg-[#f03e3e] dark:bg-zinc-700 text-white` 
                                : 'bg-white dark:bg-[#495057] text-black'}`}
                                >
                                    {day}
                                </Text>

                                <View style={{ height: 6 }} />

                                {dayItems.length > 0 ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedDate(dateStr);
                                            setModalDayVisible(true);
                                        }}
                                        style={{
                                            alignSelf: "center",
                                            marginTop: 5,
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
                                        <Text style={{ fontSize: 12, fontWeight: "bold", marginRight: 6 }}>Ver</Text>
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
                                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
                                                {dayItems.length}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedDate(dateStr);
                                            setEditingIndex(null);
                                            setNewTitle("");
                                            setNewType("evento");
                                            setModalEventVisible(true);
                                        }}
                                        style={{
                                            width: "100%",
                                            minHeight: 60,
                                            marginTop: 5,
                                            borderRadius: 6,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "transparent",
                                        }}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    const eventsForSelectedDay = items.filter((it) => it.date === selectedDate);

    return (
        <View 
        className="flex-1 bg-[#fff] dark:bg-[#495057]">
            <Animated.View style={[{ position: "absolute", top: 20, right: 20, zIndex: 10 }, bellAnimatedStyle]}>
                <Ionicons name="notifications-outline" size={40} color="#f03e3e" />
            </Animated.View>

            <ScrollView ref={scrollRef}>
                {Array.from({ length: 12 }, (_, i) => renderMonth(i, currentYear))}
            </ScrollView>

            {modalDayVisible && selectedDate && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { width: "75%", maxHeight: "85%" }]}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                Eventos - {selectedDate}
                            </Text>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setEditingIndex(null);
                                        setNewTitle("");
                                        setNewType("evento");
                                        setModalEventVisible(true);
                                        setModalDayVisible(false);
                                    }}
                                    style={{
                                        padding: 8,
                                        borderRadius: 8,
                                        backgroundColor: "#4CAF50",
                                        marginRight: 8,
                                    }}
                                >
                                    <Ionicons name="add" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalDayVisible(false)} style={{ padding: 8 }}>
                                    <Ionicons name="close" size={22} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView style={{ marginTop: 12 }}>
                            {eventsForSelectedDay.length === 0 ? (
                                <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
                                    No hay eventos en este día.
                                </Text>
                            ) : (
                                eventsForSelectedDay.map((it) => {
                                    const realIndex = items.findIndex((item) => item === it);
                                    return (
                                        <View
                                            key={realIndex}
                                            style={{
                                                backgroundColor: "#fafafa",
                                                padding: 12,
                                                borderRadius: 8,
                                                marginBottom: 10,
                                                borderWidth: 1,
                                                borderColor: "#eee",
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>{it.title}</Text>
                                                    {it.type === "recordatorio" ? (
                                                        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>
                                                            <Text style={{ color: "#666" }}>
                                                                Recordatorio - {it.hour}:{it.minute?.toString().padStart(2, "0")} {it.ampm}
                                                            </Text>
                                                            {it.notification && (
                                                                <Text style={{ color: "#666", fontSize: 13, marginLeft: 8 }}>
                                                                    ({it.notification})
                                                                </Text>
                                                            )}
                                                            {it.category && (
                                                                <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
                                                                    <View
                                                                        style={{
                                                                            width: 10,
                                                                            height: 10,
                                                                            borderRadius: 5,
                                                                            backgroundColor:
                                                                                it.category === "inyeccion" ? "#4CAF50" :
                                                                                    it.category === "pintura" ? "#F03E3E" :
                                                                                        "#FFC107",
                                                                            marginRight: 4,
                                                                        }}
                                                                    />
                                                                    <Text style={{ color: "#666", fontSize: 13 }}>
                                                                        {it.category === "inyeccion" ? "Inyección" :
                                                                            it.category === "pintura" ? "Pintura" :
                                                                                "Ensamble"}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                    ) : (
                                                        <Text style={{ color: "#666", marginTop: 6 }}>Evento</Text>
                                                    )}
                                                </View>

                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setEditingIndex(realIndex);
                                                            setNewTitle(it.title);
                                                            setNewType(it.type);
                                                            setSelectedHour(it.hour ?? 1);
                                                            setSelectedMinute(it.minute ?? 0);
                                                            setSelectedAMPM(it.ampm ?? "AM");
                                                            setSelectedNotification(it.notification ?? "10 min antes");
                                                            setSelectedCategory(it.category ?? "inyeccion");
                                                            setModalEventVisible(true);
                                                            setModalDayVisible(false);
                                                        }}
                                                        style={{ marginRight: 8 }}
                                                    >
                                                        <Ionicons name="pencil" size={20} color="#333" />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            Alert.alert("Confirmar", "¿Eliminar este elemento?", [
                                                                { text: "Cancelar", style: "cancel" },
                                                                {
                                                                    text: "Eliminar",
                                                                    style: "destructive",
                                                                    onPress: () => deleteReminder(realIndex),
                                                                },
                                                            ])
                                                        }
                                                    >
                                                        <Ionicons name="trash" size={20} color="#F03E3E" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </ScrollView>
                    </View>
                </View>
            )}

            {/* Modal agregar/editar */}
            {modalEventVisible && (
                <View style={styles.modalOverlay}>
                    <ScrollView
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            padding: 20,
                            width: "90%",
                            maxHeight: "80%",
                        }}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                marginBottom: 10,
                                textAlign: "center",
                            }}
                        >
                            {editingIndex !== null ? "Editar" : "Nuevo"}{" "}
                            {newType === "recordatorio" ? "Recordatorio" : "Evento"}
                        </Text>

                        <Text style={{ marginBottom: 6, color: "#333" }}>
                            Fecha: {selectedDate || "-"}
                        </Text>

                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                padding: 10,
                                borderRadius: 6,
                                marginBottom: 10,
                            }}
                            placeholder="Título"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />

                        {/* Botones tipo */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: 10,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setNewType("evento")}
                                style={{
                                    flex: 1,
                                    backgroundColor: newType === "evento" ? "#505050" : "#ddd",
                                    paddingVertical: 10,
                                    borderRadius: 6,
                                    marginRight: 5,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Evento</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setNewType("recordatorio")}
                                style={{
                                    flex: 1,
                                    backgroundColor: newType === "recordatorio" ? "#505050" : "#ddd",
                                    paddingVertical: 10,
                                    borderRadius: 6,
                                    marginLeft: 5,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                                    Recordatorio
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {newType === "recordatorio" && (
                            <View>
                                {/* COMBOBOX: HORA */}
                                <Text style={{ fontWeight: "bold", marginBottom: 6, marginTop: 10 }}>Hora:</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                                    {/* Hora */}
                                    <View style={{ flex: 1, marginRight: 5 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowHourList(!showHourList);
                                                setShowMinuteList(false);
                                                setShowNotifList(false);
                                                setShowCatList(false);
                                            }}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: "#ccc",
                                                borderRadius: 6,
                                                paddingVertical: 8,
                                                paddingHorizontal: 10,
                                                backgroundColor: "#fff",
                                            }}
                                        >
                                            <Text>{selectedHour.toString().padStart(2, "0")}</Text>
                                        </TouchableOpacity>

                                        {showHourList && (
                                            <ScrollView
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: "#ccc",
                                                    borderRadius: 6,
                                                    backgroundColor: "#fff",
                                                    position: "absolute",
                                                    width: "100%",
                                                    zIndex: 999,
                                                    maxHeight: 150,
                                                }}
                                                nestedScrollEnabled={true}
                                            >
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                                    <TouchableOpacity
                                                        key={h}
                                                        onPress={() => {
                                                            setSelectedHour(h);
                                                            setShowHourList(false);
                                                        }}
                                                        style={{
                                                            paddingVertical: 8,
                                                            paddingHorizontal: 10,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: "#eee",
                                                        }}
                                                    >
                                                        <Text>{h.toString().padStart(2, "0")}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        )}
                                    </View>

                                    {/* Minutos */}
                                    <View style={{ flex: 1, marginRight: 5 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowMinuteList(!showMinuteList);
                                                setShowHourList(false);
                                                setShowNotifList(false);
                                                setShowCatList(false);
                                            }}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: "#ccc",
                                                borderRadius: 6,
                                                paddingVertical: 8,
                                                paddingHorizontal: 10,
                                                backgroundColor: "#fff",
                                            }}
                                        >
                                            <Text>{selectedMinute.toString().padStart(2, "0")}</Text>
                                        </TouchableOpacity>

                                        {showMinuteList && (
                                            <ScrollView
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: "#ccc",
                                                    borderRadius: 6,
                                                    backgroundColor: "#fff",
                                                    position: "absolute",
                                                    width: "100%",
                                                    zIndex: 999,
                                                    maxHeight: 200,
                                                }}
                                                nestedScrollEnabled={true}
                                            >
                                                {Array.from({ length: 59 }, (_, i) => i + 1).map((m) => (
                                                    <TouchableOpacity
                                                        key={m}
                                                        onPress={() => {
                                                            setSelectedMinute(m);
                                                            setShowMinuteList(false);
                                                        }}
                                                        style={{
                                                            paddingVertical: 8,
                                                            paddingHorizontal: 10,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: "#eee",
                                                        }}
                                                    >
                                                        <Text>{m.toString().padStart(2, "0")}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        )}
                                    </View>

                                    {/* AM/PM */}
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                setSelectedAMPM(selectedAMPM === "AM" ? "PM" : "AM")
                                            }
                                            style={{
                                                borderWidth: 1,
                                                borderColor: "#ccc",
                                                borderRadius: 6,
                                                paddingVertical: 8,
                                                paddingHorizontal: 10,
                                                backgroundColor: "#fff",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text>{selectedAMPM}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* COMBOBOX: NOTIFICACIÓN */}
                                <Text style={{ fontWeight: "bold", marginBottom: 6, marginTop: 10 }}>Notificación:</Text>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowNotifList(!showNotifList);
                                            setShowHourList(false);
                                            setShowMinuteList(false);
                                            setShowCatList(false);
                                        }}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            borderRadius: 6,
                                            paddingVertical: 8,
                                            paddingHorizontal: 10,
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        <Text>{selectedNotification}</Text>
                                    </TouchableOpacity>

                                    {showNotifList && (
                                        <ScrollView
                                            style={{
                                                borderWidth: 1,
                                                borderColor: "#ccc",
                                                borderRadius: 6,
                                                backgroundColor: "#fff",
                                                position: "absolute",
                                                width: "100%",
                                                zIndex: 999,
                                                maxHeight: 150,
                                            }}
                                            nestedScrollEnabled={true}
                                        >
                                            {["-", "10 min", "30 min", "1 hora"].map((opt) => (
                                                <TouchableOpacity
                                                    key={opt}
                                                    onPress={() => {
                                                        setSelectedNotification(opt);
                                                        setShowNotifList(false);
                                                    }}
                                                    style={{
                                                        paddingVertical: 8,
                                                        paddingHorizontal: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: "#eee",
                                                    }}
                                                >
                                                    <Text>{opt}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </View>
                                {/* COMBOBOX: CATEGORÍA */}
                                <Text style={{ fontWeight: "bold", marginBottom: 6, marginTop: 10 }}>Área:</Text>
                                <View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowCatList(!showCatList);
                                            setShowHourList(false);
                                            setShowMinuteList(false);
                                            setShowNotifList(false);
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            borderRadius: 6,
                                            paddingVertical: 8,
                                            paddingHorizontal: 10,
                                            backgroundColor: "#fff",
                                        }}
                                    >
                                        {/* Puntito de color del valor seleccionado */}
                                        <View
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: 5,
                                                backgroundColor:
                                                    selectedCategory === "inyeccion"
                                                        ? "#4CAF50"
                                                        : selectedCategory === "pintura"
                                                            ? "#F03E3E"
                                                            : "#FFC107",
                                                marginRight: 8,
                                            }}
                                        />
                                        <Text>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</Text>
                                    </TouchableOpacity>

                                    {showCatList && (
                                        <ScrollView
                                            style={{
                                                borderWidth: 1,
                                                borderColor: "#ccc",
                                                borderRadius: 6,
                                                backgroundColor: "#fff",
                                                position: "absolute",
                                                width: "100%",
                                                zIndex: 999,
                                                maxHeight: 150,
                                            }}
                                            nestedScrollEnabled={true}
                                        >
                                            {[
                                                { value: "inyeccion", label: "Inyección", color: "#4CAF50" },
                                                { value: "pintura", label: "Pintura", color: "#F03E3E" },
                                                { value: "ensamble", label: "Ensamble", color: "#FFC107" },
                                            ].map((cat) => (
                                                <TouchableOpacity
                                                    key={cat.value}
                                                    onPress={() => {
                                                        setSelectedCategory(cat.value);
                                                        setShowCatList(false);
                                                    }}
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        paddingVertical: 8,
                                                        paddingHorizontal: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: "#eee",
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: 5,
                                                            backgroundColor: cat.color,
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    <Text>{cat.label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </View>
                            </View>
                        )}

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 20 }}>
                            <TouchableOpacity onPress={resetForm} style={{ paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 }}>
                                <Text style={{ color: "#9D0E0E", fontWeight: "bold" }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={addItem} style={{ paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 }}>
                                <Text style={{ color: "#257D55", fontWeight: "bold" }}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
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
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
    },
    label: { fontWeight: "bold", marginBottom: 6, marginTop: 10 },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    smallInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        flex: 1,
        marginRight: 5,
    },
    ampmButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    notifOption: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 6,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },
});
