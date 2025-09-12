import { View } from "react-native";
import { Button } from "./ui/button";
import { openInBrowser, sharePdfWithNativeApp } from "~/lib/file-funtions/pdf";
import { Icon } from "./ui/icon";
import { ExternalLink, Share2 } from "lucide-react-native";
import { Text } from "./ui/text";

export function ShareArticle({ publicUrl }: { publicUrl: string }) {
  // TODO: enhance share (with content title etc)
  if (!publicUrl) return null;
  return (
    <View className="flex-row justify-end gap-2 mb-2 pr-2">
      <Button size="sm" className="flex-row gap-2" variant="secondary" onPress={() => openInBrowser(publicUrl)}>
        <Text className="text-xs">Open</Text>
        <Icon as={ExternalLink} />
      </Button>
      <Button size="sm" className="flex-row gap-2 md:hidden" variant="secondary" onPress={() => sharePdfWithNativeApp(publicUrl)}>
        <Text className="text-xs">Share</Text>
        <Icon as={Share2} />
      </Button>
    </View>
  )
}
