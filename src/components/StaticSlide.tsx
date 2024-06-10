import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface Announcement {
    type: 'announcement';
    backgroundColor: string;
    ctaLabel: string;
    ctaUrl: string;
    intro: string;
    message: string;
    static: boolean;
}

interface IStaticSlide {
    item: Announcement;
    onPress: (ctaUrl: string) => void;
}

export const StaticSlide = ({ item, onPress }: IStaticSlide) => {

    return (
        <TouchableOpacity onPress={() => onPress(item.ctaUrl)} style={[styles.backgroundVideo, { backgroundColor: item.backgroundColor }]}>
            <View style={styles.titleLogo}>
                <Text style={styles.title}>
                    {item.intro}
                </Text>
                <Text style={styles.description}>
                    {item.message}
                </Text>

                <TouchableOpacity onPress={() => onPress(item.ctaUrl)} style={styles.button} >
                    <Text style={styles.buttonText}>
                        {item.ctaLabel} {" >"}
                    </Text>
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    progressBar: {
        height: 5,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 28,
        color: "white"
    },
    description: {
        marginTop: 5,
        fontSize: 18,
        color: "white",
        width: "80%"
    },
    button: {
        marginTop: 15,
        width: "40%",
        backgroundColor: "white",
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7
    },
    buttonText: {
        fontSize: 16,
        color: "black"
    },
    titleLogo: {
        width: "100%",
        marginLeft: 22,
        position: "absolute",
        left: 0,
        bottom: 100
    }
});