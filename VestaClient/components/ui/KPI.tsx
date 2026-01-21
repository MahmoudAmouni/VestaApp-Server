import { Theme } from "@/type";
import { Text, View } from "react-native";
import { kpiStyles as styles } from "./KPI.styles";

import Skeleton from "./Skeleton";

export default function KPI(props: {
  theme: Theme;
  label: string;
  value: string;
  hint?: string;
  loading?: boolean;
}) {
  const { theme, loading } = props;
  return (
    <View
      style={[
        styles.kpi,
        { borderColor: theme.border, backgroundColor: theme.surface2 },
      ]}
    >
      {loading ? (
        <Skeleton width={60} height={12} borderRadius={4} />
      ) : (
        <Text style={[styles.kpiLabel, { color: theme.textMuted }]}>
          {props.label}
        </Text>
      )}
      
      {loading ? (
        <Skeleton width={80} height={28} style={{ marginTop: 6 }} />
      ) : (
        <Text
          style={[
            styles.kpiValue,
            { color: theme.text },
            { fontSize: 18 },
          ]}
        >
          {props.value}
        </Text>
      )}
      {props.hint && (
        <Text style={[styles.kpiHint, { color: theme.textMuted }]}>
          {props.hint}
        </Text>
      )}
    </View>
  );
}
