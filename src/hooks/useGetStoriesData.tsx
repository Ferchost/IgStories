import { useState, useEffect } from 'react';
import axios from 'axios';
//import {TOKEN1,} from "@env"

interface Slide {
    title: string | null;
    eyebrowText: string | null;
    targetUrl: string | null;
    enableDarkBackdrop: boolean;
    eyebrowImage: {
      url: string;
      contentType: string;
    } | null;
    mobileImageOrVideo: {
      url: string;
      contentType: string;
    } | null;
  }
  
  interface Announcement {
    backgroundColor: string;
    ctaLabel: string;
    ctaUrl: string;
    intro: string;
    message: string;
    static: boolean; 
  }

const useAnnouncementCollection = () => {
    const [data, setData] = useState<(Slide | Announcement)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const query = `
        query {
          blockHomeHeroSlider(id: "770C1r3U3ogFUUdV32HlKi") {
            slide1Title
            slide1EyebrowImage {
              url
              contentType
            }
            slide1EyebrowText
            slide1TargetUrl
            slide1MobileImageOrVideo {
              url
              contentType
            }
            slide1EnableDarkBackdrop
            slide2Title
            slide2EyebrowImage {
              url
            }
            slide2EyebrowText
            slide2TargetUrl
            slide2MobileImageOrVideo {
              url
              contentType
            }
            slide2EnableDarkBackdrop
            slide3Title
            slide3EyebrowImage {
              url
            }
            slide3EyebrowText
            slide3TargetUrl
            slide3MobileImageOrVideo {
              url
              contentType
            }
            slide3EnableDarkBackdrop
            slide4Title
            slide4EyebrowImage {
              url
            }
            slide4EyebrowText
            slide4TargetLink
            slide4MobileImageOrVideo {
              url
              contentType
            }
            slide4EnableDarkBackdrop
            slide5Title
            slide5EyebrowImage {
              url
            }
            slide5EyebrowText
            slide5TargetUrl
            slide5MobileImageOrVideo {
              url
              contentType
            }
            slide5EnableDarkBackdrop
          }
        }
      `;

            const config = {
                method: 'post',
                url: 'https://graphql.contentful.com/content/v1/spaces/tyqyfq36jzv2/environments/master',
                headers: {
                    'User-Agent': 'Apidog/1.0.0 (https://apidog.com)',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.TOKEN1}`
                },
                data: JSON.stringify({
                    query: query,
                    variables: {}
                })
            };

            try {
                const response = await axios(config);
                const sliderData = response.data.data.blockHomeHeroSlider;

                const formattedData: Slide[] = [];
                for (let i = 1; i <= 5; i++) {
                    const slide: Slide = {
                        title: sliderData[`slide${i}Title`] || null,
                        eyebrowText: sliderData[`slide${i}EyebrowText`] || null,
                        targetUrl: sliderData[`slide${i}TargetUrl`] || sliderData[`slide${i}TargetLink`] || null,
                        enableDarkBackdrop: sliderData[`slide${i}EnableDarkBackdrop`] || false,
                        eyebrowImage: sliderData[`slide${i}EyebrowImage`] || null,
                        mobileImageOrVideo: sliderData[`slide${i}MobileImageOrVideo`] || null
                    };
                    if (slide.title || slide.eyebrowText || slide.targetUrl) {
                        formattedData.push(slide);
                    }
                }

                const secondQueryConfig = {
                    method: 'post',
                    url: 'https://graphql.contentful.com/content/v1/spaces/951t4k2za2uf/environments/master',
                    headers: {
                        'User-Agent': 'Apidog/1.0.0 (https://apidog.com)',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.TOKEN2}`
                    },
                    data: JSON.stringify({
                        query: `query {
              announcementCollection {
                items {
                  backgroundColor
                  ctaLabel
                  ctaUrl
                  intro
                  message
                }
              }
            }`,
                        variables: {}
                    })
                };

                const secondResponse = await axios(secondQueryConfig);
                const announcementData = secondResponse.data.data.announcementCollection.items;

                if (announcementData.length > 0) {
                    const announcement: Announcement = {
                        ...announcementData[0],
                        static: true
                    };
                    formattedData.unshift(announcement);
                }

                setData(formattedData);
                
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export default useAnnouncementCollection;
