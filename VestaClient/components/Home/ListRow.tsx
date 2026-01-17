import { Theme } from "@/type";
import { Text, View } from "react-native";
import { listRowStyles  as styles} from "./ListRow.styles";

export default function ListRow(props: {
  theme: Theme;
  title: string;
  sub: string;
  tag: string;
  showTopBorder?: boolean;
}) {
  const { theme } = props;

  return (
    <View
      style={[
        styles.listRow,
        {
          borderTopWidth: 0,
          borderTopColor: theme.border,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.listTitle, { color: theme.text }]}>
          {props.title}
        </Text>
        <Text style={[styles.listSub, { color: theme.textMuted }]}>
          {props.sub}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <View
          style={[
            styles.tag,
            {
              borderColor: theme.borderStrong,
              backgroundColor: theme.surface2,
            },
          ]}
        >
          <Text style={[styles.tagText, { color: theme.text }]}>
            {props.tag}
          </Text>
        </View>
        <Text
          style={[styles.listSub, { color: theme.textMuted, marginTop: 4 }]}
        >
          Reminder set
        </Text>
      </View>
    </View>
  );
}
