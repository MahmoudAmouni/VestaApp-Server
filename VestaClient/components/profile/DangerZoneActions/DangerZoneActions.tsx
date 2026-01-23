import React from "react";
import { View } from "react-native";
import { Theme } from "@/type";

import Button from "../../ui/Button";


import { dangerZoneStyles as styles } from "./DangerZoneActions.styles";

export default function DangerZoneActions(props: {
  theme: Theme;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}) {
  const { theme } = props;

  return (
    <View style={styles.row}>
      <Button
        variant="secondary"
        label="Sign Out"
        icon="log-out-outline"
        onPress={props.onSignOut}
        flex
      />

      <Button
        variant="primary"
        label="Delete Account"
        icon="trash-outline"
        onPress={props.onDeleteAccount}
        flex
      />
    </View>
  );
}
