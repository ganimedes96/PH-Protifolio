import { GetStaticPaths, GetStaticProps } from "next";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import Head from "next/head";
import Prismic from "@prismicio/client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./wallet.module.scss";

import { Button, Text } from "@chakra-ui/react";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type Wallet = {
  slug: string;
  image: string;
  image1: string;
  image2: string;
  image3: string;
  description: string;
  price: string;
};
interface WalletProps {
  wallets: Wallet[];
}

export default function wallet({ wallets }: WalletProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Head>
        <title>Relogios</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.images}>
          <Swiper
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className={styles.mySwiper2}
          >
            <SwiperSlide className={styles.swiperSlider}>
              <img src={wallets.image} />
            </SwiperSlide>
            <SwiperSlide className={styles.swiperSlider}>
              <img src={wallets.image1} />
            </SwiperSlide>
            <SwiperSlide className={styles.swiperSlider}>
              <img src={wallets.image2} />
            </SwiperSlide>
            <SwiperSlide className={styles.swiperSlider}>
              <img src={wallets.image3} />
            </SwiperSlide>
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={1}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className={styles.mySwiper}
          >
            <SwiperSlide className={styles.swiperBack}>
              <img src={wallets.image} />
            </SwiperSlide>
            <SwiperSlide className={styles.swiperBack}>
              <img src={wallets.image1} />
            </SwiperSlide>
            <SwiperSlide className={styles.swiperBack}>
              <img src={wallets.image2} />
            </SwiperSlide>
            <SwiperSlide className={styles.swiperBack}>
              <img src={wallets.image3} />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className={styles.descriptions}>
          <Text
            as="p"
            fontFamily="Ubuntu"
            fontWeight="bold"
            mb="2rem"
            fontSize="22px"
          >
            
            {wallets.description}
          </Text>
          <Text as="h2" fontSize="15px" mb="1rem">
            {wallets.price}
          </Text>
          <Text as="span" mb="3rem">
            <Text fontSize="25px" as="strong">
              6x
            </Text>
            de
            <Text fontSize="25px" as="strong">
              R$ 13,31
            </Text>{" "}
            sem juros
          </Text>

          <Button
            fontSize="22px"
            bg="gray.800"
            py="2rem"
            color="white.100"
            _hover={{
              bg: "gray.700",
            }}
          >
            Comprar
          </Button>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const wallets = await prismic.query([
    Prismic.predicates.at("document.type", "wallet"),
  ]);

  const paths = wallets.results.map((wallet) => ({
    params: {
      slug: wallet.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const prismic = getPrismicClient();

  const { slug } = context.params;

  const response = await prismic.getByUID<any>("wallet", String(slug), {});

  const wallets = {
    slug: response.uid,
    image: response.data.iamge.url,
    image1: response.data.image1.url,
    image2: response.data.image2.url,
    image3: response.data.image3.url,
    description: RichText.asText(response.data.description),
    price: RichText.asText(response.data.price),
  };

  console.log(response);

  return {
    props: { wallets },
  };
};