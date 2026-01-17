import { Theme } from "@/type";
import { Pressable, Text, View } from "react-native";
import { sectionHeaderStyles as styles } from "./SectionHeader.styles";

export default function SectionHeader(props: {
  theme: Theme;
  title: string;
  actionLabel: string;
  onPressAction: () => void;
}) {
  const { theme } = props;
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {props.title}
      </Text>
      <Pressable
        onPress={props.onPressAction}
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      >
        <Text style={[styles.sectionAction, { color: theme.primary }]}>
          {props.actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}
