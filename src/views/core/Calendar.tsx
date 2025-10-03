import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

type CalendarItem = {
    title: string;
    date: string;
    type: "evento" | "recordatorio";
    hour?: number;
    minute?: number;
    ampm?: "AM" | "PM";
    notification?: string;
    category?: "inyeccion" | "ensamble" | "pintura";
};

//componente funcional
const Calendar: React.FC = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const [items, setItems] = useState<CalendarItem[]       >([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState<"evento" | "recordatorio">("evento");

    const [selectedHour, setSelectedHour] = useState<number>(1);
    const [selectedMinute, setSelectedMinute] = useState<number>(0);
    const [selectedAMPM, setSelectedAMPM] = useState<"AM" | "PM">("AM");
    const [selectedNotification, setSelectedNotification] = useState<string>("10 min antes");

    // categoría
    const [selectedCategory, setSelectedCategory] =useState<"inyeccion" | "ensamble" | "pintura">("inyeccion");
    const [categoryDropdown, setCategoryDropdown] = useState(false);

    const categoryOptions = [
        { label: "Inyección", value: "inyeccion", color: "green" },
        { label: "Ensamble", value: "ensamble", color: "blue" },
        { label: "Pintura", value: "pintura", color: "orange" },
    ];

    const [hourDropdown, setHourDropdown] = useState(false);
    const [minuteDropdown, setMinuteDropdown] = useState(false);
    const [ampmDropdown, setAMPMDropdown] = useState(false);
    const [notifDropdown, setNotifDropdown] = useState(false);
    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            items.forEach(item => {
                if (item.type === "recordatorio" && item.hour !== undefined && item.minute !== undefined) {
                    let itemHour = item.hour % 12;
                    if (item.ampm === "PM") itemHour += 12;

                    if (itemHour === currentHour && item.minute === currentMinute) {
                        triggerBell();
                    }
                }
            });
        };

        // Ejecuta primero al cargar
        checkReminders();

        // Calcula ms restantes hasta el siguiente minuto
        const now = new Date();
        const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        const timeout = setTimeout(() => {
            checkReminders();
            const interval = setInterval(checkReminders, 60 * 1000);
            // Guardamos para limpiar después
            (window as any)._reminderInterval = interval;
        }, delay);

        return () => {
            clearTimeout(timeout);
            clearInterval((window as any)._reminderInterval);
        };
    }, [items]);

    const scrollRef = useRef<ScrollView>(null);
    const monthLayouts = useRef<{ [key: number]: number }>({});

    // animación campana
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
        bellScale.value = withSpring(1.5, { damping: 2, stiffness: 150 }, () => {
            bellScale.value = withSpring(1);
        });
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

    const addItem = () => {
        if (!newTitle.trim() || !selectedDate) return;

        setItems([...items,
        {
            title: newTitle,
            date: selectedDate,
            type: newType,
            hour: selectedHour,
            minute: selectedMinute,
            ampm: selectedAMPM,
            notification: selectedNotification,
            category: selectedCategory,
        },
        ]);

        setNewTitle("");
        setNewType("evento");
        setSelectedHour(1);
        setSelectedMinute(0);
        setSelectedAMPM("AM");
        setSelectedNotification("10 min antes");
        setSelectedCategory("inyeccion");
        setModalVisible(false);
        // triggerBell();
    };

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
            monthName.charAt(0).toUpperCase() +
            monthName.slice(1).toLowerCase();

        const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        return (
            <View
                key={`${year}-${month}`}
                style={{ marginBottom: 40 }}
                onLayout={(event) => {
                    monthLayouts.current[month] = event.nativeEvent.layout.y;
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

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
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
                                        minHeight: 120, // aumenta el alto
                                    }}
                                />
                            );

                        const dateStr = `${year}-${month + 1}-${day}`;
                        const dayItems = items.filter((it) => it.date === dateStr);
                        const isToday =
                            day === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();

                        return (
                            <TouchableOpacity
                                key={i}
                                style={{
                                    width: "14.2%",
                                    borderWidth: 0.5,
                                    borderColor: "#eee",
                                    minHeight: 120,
                                    padding: 2,
                                    borderRadius: isToday ? 6 : 0,
                                }}
                                onPress={() => {
                                    setSelectedDate(dateStr);
                                    setModalVisible(true);
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
                                        marginBottom: 4,
                                    }}
                                >
                                    {day}
                                </Text>
                                {dayItems.map((it, idx) => (
                                    <View
                                        key={idx}
                                        style={{
                                            backgroundColor:
                                                it.type === "evento" ? "#BFECF5" : "#F5D6BF",
                                            borderRadius: 8,
                                            paddingHorizontal: 3,
                                            marginTop: 2,
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        {it.category && (
                                            <View
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor:
                                                        categoryOptions.find(
                                                            (c) => c.value === it.category
                                                        )?.color || "gray",
                                                    marginRight: 4,
                                                }}
                                            />
                                        )}
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: "#333",
                                                flexShrink: 1, // evita que se desborde
                                                flexWrap: "wrap", // permite varias líneas
                                            }}
                                        >
                                            {it.title}{" "}
                                            {it.type === "recordatorio" &&
                                                `- ${it.hour}:${it.minute
                                                    ?.toString()
                                                    .padStart(2, "0")} ${it.ampm}`}
                                        </Text>
                                    </View>
                                ))}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    const ComboBox = ({
        label,
        selected,
        setSelected,
        options,
        dropdownOpen,
        setDropdownOpen,
    }: any) => (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                {label}
            </Text>
            <TouchableOpacity
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: "#f9f9f9",
                }}
                onPress={() => setDropdownOpen(!dropdownOpen)}
            >
                <Text>{selected}</Text>
            </TouchableOpacity>
            {dropdownOpen && (
                <ScrollView
                    style={{
                        maxHeight: 120,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        marginTop: 5,
                    }}
                >
                    {options.map((opt: any, idx: number) => (
                        <TouchableOpacity
                            key={idx}
                            style={{
                                padding: 10,
                                backgroundColor:
                                    selected === opt ? "#eee" : "#fff",
                            }}
                            onPress={() => {
                                setSelected(opt);
                                setDropdownOpen(false);
                            }}
                        >
                            <Text>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );

    // combo de categoría
    const CategoryComboBox = () => (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Categoría</Text>
            <TouchableOpacity
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: "#f9f9f9",
                    flexDirection: "row",
                    alignItems: "center",
                }}
                onPress={() => setCategoryDropdown(!categoryDropdown)}
            >
                <View
                    style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor:
                            categoryOptions.find(
                                (c) => c.value === selectedCategory
                            )?.color || "gray",
                        marginRight: 8,
                    }}
                />
                <Text>
                    {
                        categoryOptions.find(
                            (c) => c.value === selectedCategory
                        )?.label
                    }
                </Text>
            </TouchableOpacity>
            {categoryDropdown && (
                <ScrollView
                    style={{
                        maxHeight: 120,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        marginTop: 5,
                    }}
                >
                    {categoryOptions.map((opt, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={{
                                padding: 10,
                                backgroundColor:
                                    selectedCategory === opt.value ? "#eee" : "#fff",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                            onPress={() => {
                                setSelectedCategory(opt.value as any);
                                setCategoryDropdown(false);
                            }}
                        >
                            <View
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: opt.color,
                                    marginRight: 8,
                                }}
                            />
                            <Text>{opt.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );

    // entrar al mes actual
    useEffect(() => {
        const timeout = setTimeout(() => {
            const y = monthLayouts.current[currentMonth];
            if (scrollRef.current && y !== undefined) {
                scrollRef.current.scrollTo({ y, animated: false });
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, []);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* campana */}
            <Animated.View
                style={[
                    { position: "absolute", top: 10, right: 20, zIndex: 10 },
                    bellAnimatedStyle,
                ]}
            >
                <Ionicons
                    name="notifications-outline"
                    size={44}
                    color="#F03E3E"
                />
            </Animated.View>

            {/* calendario */}
            <ScrollView ref={scrollRef}>
                {Array.from({ length: 12 }, (_, i) =>
                    renderMonth(i, currentYear)
                )}
            </ScrollView>

            {/* modal */}
            {modalVisible && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ScrollView
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            padding: 20,
                            width: "85%",
                            maxHeight: "80%",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                marginBottom: 10,
                            }}
                        >
                            Nuevo{" "}
                            {newType === "recordatorio"
                                ? "Recordatorio"
                                : "Evento"}
                        </Text>

                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                padding: 8,
                                marginBottom: 10,
                                borderRadius: 5,
                            }}
                            placeholder="Título"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                marginBottom: 10,
                            }}
                        >
                            <Button
                                title="Evento"
                                color={
                                    newType === "evento" ? "#505050" : "#ccc"
                                }
                                onPress={() => setNewType("evento")}
                            />
                            <Button
                                title="Recordatorio"
                                color={
                                    newType === "recordatorio"
                                        ? "#505050"
                                        : "#ccc"
                                }
                                onPress={() => setNewType("recordatorio")}
                            />
                        </View>

                        {newType === "recordatorio" && (
                            <>
                                <ComboBox
                                    label="Hora"
                                    selected={selectedHour}
                                    setSelected={setSelectedHour}
                                    options={Array.from(
                                        { length: 12 },
                                        (_, i) => i + 1
                                    )}
                                    dropdownOpen={hourDropdown}
                                    setDropdownOpen={setHourDropdown}
                                />
                                <ComboBox
                                    label="Minutos"
                                    selected={selectedMinute}
                                    setSelected={setSelectedMinute}
                                    options={[
                                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60
                                    ]}
                                    dropdownOpen={minuteDropdown}
                                    setDropdownOpen={setMinuteDropdown}
                                />
                                <ComboBox
                                    label="AM/PM"
                                    selected={selectedAMPM}
                                    setSelected={setSelectedAMPM}
                                    options={["AM", "PM"]}
                                    dropdownOpen={ampmDropdown}
                                    setDropdownOpen={setAMPMDropdown}
                                />
                                <ComboBox
                                    label="Notificación"
                                    selected={selectedNotification}
                                    setSelected={setSelectedNotification}
                                    options={[
                                        "-",
                                        "10 min antes",
                                        "30 min antes",
                                        "1 hora antes",
                                    ]}
                                    dropdownOpen={notifDropdown}
                                    setDropdownOpen={setNotifDropdown}
                                />
                                <CategoryComboBox />
                            </>
                        )}

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 10 }}>
                            <Button title="Guardar" onPress={addItem} />
                            <Button title="Cancelar" color="#F03E3E" onPress={() => setModalVisible(false)} />
                        </View>
                    </ScrollView>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Calendar;
