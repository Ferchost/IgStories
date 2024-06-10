import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Image, TouchableOpacity, Linking } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Video from 'react-native-video';
import useAnnouncementCollection from '../hooks/useGetStoriesData';
import { SvgUri } from 'react-native-svg';
import { StaticSlide } from '../components/StaticSlide';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProgressBar = ({ progress, index, currentIndex }: any) => (
    <View style={[styles.progressBarContainer, currentIndex === index && { flex: 1 }]}>
        <View style={[styles.progressBar, currentIndex === index && { width: `${progress}%` }]} />
    </View>
);

const StoryCarousel = () => {
    const { data, loading, error } = useAnnouncementCollection();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const videoRefs = useRef<any>([]);
    const carouselRef = useRef<any>(null);

    const handleProgress = (e: any, index: number) => {
        if (index === currentIndex) {
            const progress = (e.currentTime / e.seekableDuration) * 100;
            setProgress(progress);
        }
    };

    const onScrollIndexChanged = (index: number) => {
        setCurrentIndex(index);
        setProgress(0)
        if (videoRefs.current[index]) {
            videoRefs.current[index].seek(0);
        }
    };

    const handleVideoEnd = (index: number) => {
        if (index === data.length - 1) {
            carouselRef.current.scrollTo({ index: 0 })
            setCurrentIndex(0);
        } else {
            carouselRef.current.scrollTo({ index: index + 1 });
            setCurrentIndex(index + 1);
        }
    };

    const handleGoToWeb = (url: string) => {
        Linking.openURL(url)
    }

    const handleNextSlide = () => {
        if (currentIndex === data.length - 1) {
            carouselRef.current?.scrollTo({ index: 0 });
            setCurrentIndex(0);
            setProgress(0)

        } else {
            carouselRef.current?.scrollTo({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
            setProgress(0)

        }
    };

    const renderItem = ({ item, index }: any) => {
        const logoExtension = item?.eyebrowImage?.url.slice(-3);

        return (
            <View style={styles.slide}>
                {
                    item?.static ?
                       <StaticSlide item={item} onPress={handleGoToWeb}  />
                        :
                        <>
                            <Video
                                ref={(ref) => (videoRefs.current[index] = ref)}
                                playInBackground
                                source={{ uri: item.mobileImageOrVideo?.url }}
                                onError={(e) => console.log("error", e)}
                                style={styles.backgroundVideo}
                                resizeMode='cover'
                                paused={currentIndex !== index}
                                onProgress={(e) => handleProgress(e, index)}
                                onEnd={() => handleVideoEnd(index)}
                            />
                            {item.enableDarkBackdrop && <View style={styles.overlay} />}
                            <View style={styles.progressContainer}>
                                {data.map((_, idx) => (
                                    <ProgressBar k key={idx}
                                        progress={currentIndex === idx ? progress : idx < currentIndex ? 100 : 0}
                                        isCurrent={currentIndex === idx} />
                                ))}
                            </View>
                            <View style={styles.titleLogo}>
                                {logoExtension === 'svg' ? (
                                    <SvgUri uri={item.eyebrowImage?.url} style={styles.logo} />
                                ) : (
                                    <Image source={{ uri: item.eyebrowImage?.url }} style={styles.logo} />
                                )}
                                <Text style={styles.text}>{item.title?.toUpperCase()}</Text>
                            </View>
                        </>
                }
            </View>
        )

    }

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error.message}</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Carousel
                ref={carouselRef}
                width={width}
                height={height}
                data={data}
                renderItem={renderItem}
                onSnapToItem={onScrollIndexChanged}
            />
            <TouchableOpacity style={styles.fab} onPress={handleNextSlide}>
                <Text style={{ fontSize: 18, color: "white" }}>{">"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        height: "100%",
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    text: {
        fontSize: 45,
        color: 'white',
        width: "80%",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },

    progressBar: {
        height: 5,
        backgroundColor: 'white',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    fab: {
        position: 'absolute',
        top: height / 2 - 25,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBarContainer: {
        flex: 1,
        height: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 2,
        borderRadius: 2.5,
    },
    progressContainer: {
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 45,
        height: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logo: {
        alignSelf: "flex-start",
        width: "45%",
        height: 60,
        resizeMode: 'contain',

    },
    titleLogo: {
        width: "100%",
        marginLeft: 22,
        position: "absolute",
        left: 0,
        bottom: 100
    }
});

export default StoryCarousel;
