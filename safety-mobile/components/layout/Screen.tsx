import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../contexts/theme'

type Props = {
  children: React.ReactNode
  scrollable?: boolean
  padded?: boolean
  keyboardOffset?: number
}

export function Screen({ children, scrollable = false, padded = true, keyboardOffset = 0 }: Props) {
  const { colors, mode } = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={{
              padding: padded ? 16 : 0,
              gap: 16,
              paddingTop: padded ? 16 : 12,
              paddingBottom: 32,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              padding: padded ? 16 : 0,
              paddingTop: padded ? 16 : 12,
              paddingBottom: 16,
              gap: 16,
            }}
          >
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
