import { Text, View } from "react-native"

export function NewsComponent() {
  return (
    <View className="px-6 py-4 my-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mx-4">
      <Text className="text-3xl font-semibold text-gray-700 dark:text-gray-300 text-center mb-6">
        Updates and News
      </Text>

      <View className="bg-gray-100 dark:bg-gray-800 rounded-md p-6 space-y-6 border border-gray-200 dark:border-gray-700">

        {/* News Item 1 */}
        <View className="space-y-1">
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
            Upcoming Events
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center text-base">
            Tech Talk on AI, Workshop on React Native - Join us to learn the latest in tech!
          </Text>
        </View>

        {/* News Item 2 */}
        <View className="space-y-1">
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
            New Articles
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center text-base">
            Understanding React Native, Building Scalable Apps - Explore our expert guides and tutorials.
          </Text>
        </View>

      </View>
    </View>
  )
}
