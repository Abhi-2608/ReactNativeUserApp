import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

/**
 * Displays user details and allows navigation between users.
 */
const UserScreen = ({ route, navigation }) => {
    const { currentUserIndex, users } = route.params;

    // Prevent crashes if user data is missing (just in case)
    if (!users || users.length === 0 || !users[currentUserIndex]) {
        console.warn("User data is missing, showing error message.");
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Oops! No user data available.</Text>
                <TouchableOpacity style={styles.reloadBtn} onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.reloadText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    console.log(`Displaying user ${currentUserIndex + 1} of ${users.length}`);

    return (
        <View style={styles.container}>
            <Image source={{ uri: users[currentUserIndex].avatar }} style={styles.avatar} />
            <View style={styles.detailsWrapper}>
                <Text style={styles.label}>ID:</Text>
                <Text style={styles.text}>{users[currentUserIndex].id || "N/A"}</Text>

                <Text style={styles.label}>First Name:</Text>
                <Text style={styles.text}>{users[currentUserIndex].first_name || "N/A"}</Text>

                <Text style={styles.label}>Last Name:</Text>
                <Text style={styles.text}>{users[currentUserIndex].last_name || "N/A"}</Text>

                <Text style={styles.label}>Username:</Text>
                <Text style={styles.text}>{users[currentUserIndex].username || "N/A"}</Text>

                <Text style={styles.label}>Email:</Text>
                <Text style={styles.text}>{users[currentUserIndex].email || "N/A"}</Text>

                <Text style={styles.label}>Password:</Text>
                <Text style={styles.text}>{users[currentUserIndex].password || "N/A"}</Text>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, currentUserIndex === 0 && styles.disabledButton]}
                    onPress={() => navigation.navigate("User", { currentUserIndex: currentUserIndex - 1, users })}
                    disabled={currentUserIndex === 0}
                >
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, currentUserIndex === users.length - 1 && styles.disabledButton]}
                    onPress={() => navigation.navigate("User", { currentUserIndex: currentUserIndex + 1, users })}
                    disabled={currentUserIndex === users.length - 1}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

/**
 * Fetches user data from API and handles errors.
 */
const HomeScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching user data...");
        fetch("https://random-data-api.com/api/users/random_user?size=80")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user data.");
                }
                return response.json();
            })
            .then((data) => {
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error("Invalid user data received.");
                }
                console.log("User data fetched successfully!");
                setUsers(data);
                setLoading(false);
                navigation.navigate("User", { currentUserIndex: 0, users: data });
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setError("Failed to load user data. Please check your internet connection.");
                setLoading(false);
            });
    }, []);

    return (
        <View style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && (
                <View>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.reloadBtn} onPress={() => navigation.navigate("Home")}>
                        <Text style={styles.reloadText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="User" component={UserScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

/**
 * Styles for UI elements
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "#007bff",
    },
    detailsWrapper: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginTop: 20,
    },
    button: {
        flex: 1,
        backgroundColor: "#007bff",
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 5,
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        marginTop: 20,
        textAlign: "center",
    },
    reloadBtn: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: "center",
    },
    reloadText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
