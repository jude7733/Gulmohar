import { View } from "react-native";
import { Button } from "./ui/button";
import { openInBrowser, sharePdfWithNativeApp } from "~/lib/file-funtions/pdf";
import { Icon } from "./ui/icon";
import { ExternalLink, Share2 } from "lucide-react-native";

export function ShareArticle({ publicUrl }: { publicUrl: string }) {
  if (!publicUrl) return null;
  return (
    <View className="flex-row justify-end gap-2 md:hidden">
      <Button variant="secondary" size="icon" onPress={() => openInBrowser(publicUrl)}>
        <Icon as={ExternalLink} />
      </Button>
      <Button variant="secondary" size="icon" onPress={() => sharePdfWithNativeApp(publicUrl)}>
        <Icon as={Share2} />
      </Button>
    </View>
  )
}
