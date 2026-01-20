import { Theme } from "@/type";
import { Text, View } from "react-native";
import { kpiStyles as styles } from "./KPI.styles";

export default function KPI(props: {
  theme: Theme;
  label: string;
  value: string;
  hint?: string;
  smallValue?: boolean;
}) {
  const { theme } = props;
  return (
    <View
      style={[
        styles.kpi,
        { borderColor: theme.border, backgroundColor: theme.surface2 },
      ]}
    >
      <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>
        {props.label}
      </Text>
      <Text
        style={[
          styles.kpiValue,
          { color: theme.text },
          props.smallValue && { fontSize: 18 },
        ]}
      >
        {props.value}
      </Text>
      {props.hint && (
        <Text style={[styles.kpiHint, { color: theme.textMuted }]}>
          {props.hint}
        </Text>
      )}
    </View>
  );
}
