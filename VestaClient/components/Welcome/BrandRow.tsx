import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";
import { brandRowStyles as styles } from "./BrandRowStyles";
import { Image } from "expo-image";

export default function BrandRow(props: { theme: Theme }) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>


      <View style={styles.mark}>
        <Image 
          source={require("@/assets/images/Vesta-logo.png")}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
      <Text style={[styles.text, { color: theme.text }]}>Vesta</Text>
    </View>
  );
}
