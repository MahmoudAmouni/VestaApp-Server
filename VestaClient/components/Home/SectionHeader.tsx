import { Theme } from "@/type";
import { Pressable, Text, View } from "react-native";
import { sectionHeaderStyles as styles } from "./SectionHeader.styles";
import SmallButton from "../ui/SmallButton";

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
      <SmallButton
        label={props.actionLabel}
        onPress={props.onPressAction}
        variant="text"
      />
    </View>
  );
}
